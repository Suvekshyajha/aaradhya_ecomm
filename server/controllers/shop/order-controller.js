const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const Address = require("../../models/Address");
const {
  resolveOrderItems,
  reserveStock,
  rollbackStock,
  roundToTwoDecimals,
  isValidObjectId,
} = require("../../helpers/order");
const { validateOrderAddressInfo } = require("../../helpers/validation");
const {
  ESEWA_CURRENCY,
  IS_MOCK,
  buildEsewaPaymentForm,
  buildMockSuccessPayload,
  decodeEsewaResponse,
  isValidEsewaSignature,
  checkEsewaTransactionStatus,
  getEsewaErrorMessage,
  formatEsewaAmount,
} = require("../../helpers/esewa");

const createOrder = async (req, res) => {
  try {
    const { cartId, cartItems, addressInfo } = req.body;

    // The order belongs to the authenticated user. A userId sent by the client
    // is never trusted: when present it must match the session.
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorised user!",
      });
    }

    if (req.body.userId && String(req.body.userId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "You can only create orders for your own account!",
      });
    }

    // paymentStatus / orderStatus / totals sent by the client are ignored - the
    // server sets pending/pending and recalculates every amount from the DB.

    const addressErrors = validateOrderAddressInfo(addressInfo);

    if (addressErrors.length) {
      return res.status(400).json({
        success: false,
        message: addressErrors[0],
      });
    }

    // When the client references a stored address, it must belong to the buyer
    if (addressInfo.addressId) {
      const ownedAddress = await Address.findOne({
        _id: addressInfo.addressId,
        userId: String(userId),
      });

      if (!ownedAddress) {
        return res.status(403).json({
          success: false,
          message: "The selected delivery address does not belong to you!",
        });
      }
    }

    // Prices, quantities, total and stock are recalculated from the database, never
    // taken from the request body (the browser can be tampered with). orderStatus,
    // paymentStatus and paymentMethod are server decisions as well.
    const resolvedItems = await resolveOrderItems({ userId, cartId, cartItems });

    if (resolvedItems.error) {
      return res.status(resolvedItems.error.status).json({
        success: false,
        message: resolvedItems.error.message,
      });
    }

    const { cartItems: resolvedCartItems, totalAmount } = resolvedItems.data;

    // The order exists before the payment does. The eSewa transaction_uuid
    // is the order id itself, so eSewa's response can only ever confirm
    // the exact order the server created.
    // Only the known address fields are stored - arbitrary client objects are
    // never written to the order.
    const sanitizedAddressInfo = {
      addressId: addressInfo.addressId ? String(addressInfo.addressId) : "",
      address: String(addressInfo.address).trim(),
      city: String(addressInfo.city).trim(),
      pincode: String(addressInfo.pincode).trim(),
      phone: String(addressInfo.phone).trim(),
      notes: addressInfo.notes ? String(addressInfo.notes).trim().slice(0, 500) : "",
    };
    const newlyCreatedOrder = new Order({
      userId,
      cartId: cartId || "",
      cartItems: resolvedCartItems,
      addressInfo: sanitizedAddressInfo,
      orderStatus: "pending",
      paymentMethod: "esewa", // the only payment integration that is wired up
      paymentStatus: "pending",
      totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    });

    await newlyCreatedOrder.save();

    // eSewa works with a signed HTML form (not a redirect URL): the server
    // signs the server-side total and hands the form fields to the browser,
    // which posts them straight to eSewa.
    let esewaForm;
    try {
      esewaForm = buildEsewaPaymentForm({
        totalAmount,
        orderId: newlyCreatedOrder._id,
      });
    } catch (formError) {
      console.log(formError);

      newlyCreatedOrder.paymentStatus = "failed";
      newlyCreatedOrder.paymentFailureReason =
        `eSewa payment could not be prepared: ${formError.message}`.slice(0, 500);
      newlyCreatedOrder.orderUpdateDate = new Date();
      await newlyCreatedOrder.save();

      return res.status(500).json({
        success: false,
        message: "The payment could not be prepared. Please try again.",
      });
    }

    res.status(201).json({
      success: true,
      orderId: newlyCreatedOrder._id,
      esewaUrl: esewaForm.esewaUrl,
      esewaParams: esewaForm.esewaParams,
      mockMode: esewaForm.mockMode === true,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const verifyEsewaPayment = async (req, res) => {
  try {
    const body = req.body || {};
    const { orderId, data } = body;

    if (!orderId || !data) {
      return res.status(400).json({
        success: false,
        message: "Order id and eSewa response data are both mandatory!",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    // An order can only be paid (and its payment info read) by the user who placed it
    if (order.userId && String(order.userId) !== String(req.user?.id)) {
      return res.status(403).json({
        success: false,
        message: "This order does not belong to the logged in user!",
      });
    }

    // Idempotent: eSewa can send the buyer back more than once (refresh, double
    // click). Decrementing the stock twice would sell the same units twice.
    if (order.paymentStatus === "paid" && order.orderStatus === "confirmed") {
      return res.status(200).json({
        success: true,
        message: "Order is already confirmed",
        data: order,
      });
    }

    // Cancelled payment handling: a cancelled order is never confirmed
    if (order.paymentStatus === "cancelled" || order.orderStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "This order was cancelled, please place a new order.",
      });
    }

    // ---- Verification: the browser payload is never trusted ----
    // 1) It must decode to a real eSewa response object
    const esewaPayload = decodeEsewaResponse(data);

    if (!esewaPayload) {
      order.paymentFailureReason =
        "eSewa returned an unreadable payment response".slice(0, 500);
      order.orderUpdateDate = new Date();
      await order.save();

      return res.status(400).json({
        success: false,
        message: "The payment response from eSewa is invalid.",
      });
    }

    // 2) The response must belong to this exact order (uuid binding)
    if (String(esewaPayload.transaction_uuid) !== String(order._id)) {
      order.paymentFailureReason =
        "The eSewa payment does not belong to this order".slice(0, 500);
      order.orderUpdateDate = new Date();
      await order.save();

      return res.status(400).json({
        success: false,
        message: "This payment does not belong to this order!",
      });
    }

    // 3) The HMAC signature must verify with the server's secret key
    if (!isValidEsewaSignature(esewaPayload)) {
      order.paymentFailureReason =
        "The eSewa payment signature could not be verified".slice(0, 500);
      order.orderUpdateDate = new Date();
      await order.save();

      return res.status(400).json({
        success: false,
        message:
          "The payment could not be verified. No order was confirmed - please contact support before paying again.",
      });
    }

    // 4) eSewa must report the transaction as COMPLETE, independently checked
    // with eSewa's status API (the browser response alone is not enough)
    let statusResult;
    try {
      statusResult = await checkEsewaTransactionStatus({
        productCode: esewaPayload.product_code,
        totalAmount: String(esewaPayload.total_amount),
        transactionUuid: String(esewaPayload.transaction_uuid),
      });
    } catch (statusError) {
      console.log(statusError);

      order.paymentFailureReason = `eSewa could not verify this payment: ${getEsewaErrorMessage(
        statusError
      )}`.slice(0, 500);
      order.orderUpdateDate = new Date();
      await order.save();

      return res.status(502).json({
        success: false,
        message:
          "The payment could not be verified with eSewa. No order was confirmed - please contact support before paying again.",
      });
    }

    if (statusResult?.status !== "COMPLETE") {
      order.paymentStatus = "failed";
      order.paymentFailureReason = `eSewa reported the transaction as "${statusResult?.status || "unknown"}"`.slice(
        0,
        500
      );
      order.orderUpdateDate = new Date();
      await order.save();

      return res.status(400).json({
        success: false,
        message:
          "The payment was not completed and nothing was charged to your account.",
      });
    }

    // 5) The amount eSewa really captured must match the server side order total
    const paidAmount = Number(
      statusResult.total_amount ?? esewaPayload.total_amount
    );
    const expectedAmount = formatEsewaAmount(order.totalAmount);

    if (
      !Number.isFinite(paidAmount) ||
      formatEsewaAmount(paidAmount) !== expectedAmount
    ) {
      order.paymentFailureReason = `The amount eSewa captured (${statusResult.total_amount ?? esewaPayload.total_amount}) does not match the order total (${order.totalAmount})`.slice(
        0,
        500
      );
      order.orderUpdateDate = new Date();
      await order.save();

      return res.status(400).json({
        success: false,
        message:
          "The paid amount does not match the order total, so the order was not confirmed. Please contact support.",
      });
    }

    const transactionCode =
      statusResult.transaction_code || esewaPayload.transaction_code || "";

    const decrementedItems = [];
    let stockError = null;

    try {
      for (const item of order.cartItems) {
        const quantity = Number(item.quantity);

        if (!Number.isInteger(quantity) || quantity < 1) {
          stockError = {
            status: 400,
            message: `Invalid quantity for ${item.title}`,
          };
          break;
        }

        // Atomic check + decrement: MongoDB applies the stock condition and the
        // $inc in one operation, so parallel captures can never oversell
        const updatedProduct = await reserveStock(item.productId, quantity);

        if (!updatedProduct) {
          const product = await Product.findById(item.productId);

          stockError = {
            status: 400,
            message: product
              ? `Only ${Math.max(
                  Number(product.totalStock) || 0,
                  0
                )} left in stock for ${product.title}`
              : "One of the products is no longer available",
          };
          break;
        }

        decrementedItems.push({ productId: item.productId, quantity });
      }

      if (!stockError) {
        // Successful payment handling: only what eSewa verified is stored here
        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        order.paymentId = String(order._id);
        order.payerId = "";
        order.transactionId = transactionCode;
        order.transactionState = "COMPLETE";
        order.paymentCurrency = ESEWA_CURRENCY;
        order.paidAmount = paidAmount;
        order.paymentPayerEmail = "";
        order.paymentDate = new Date();
        order.paymentFailureReason = "";
        // Remember that these units are now taken out of the stock, so a later
        // cancellation gives back exactly what this order consumed (and only once)
        order.stockDecremented = true;
        order.stockRestored = false;
        order.orderUpdateDate = new Date();

        await order.save();
      }
    } catch (stockUpdateError) {
      // Give back whatever was already reserved before reporting the failure
      await rollbackStock(decrementedItems);
      throw stockUpdateError;
    }

    if (stockError) {
      // Nothing is reserved, so no unit is oversold. The money was taken though, so
      // the transaction stays on the order (a refund needs the transaction id) and
      // stockDecremented stays false so cancelling can not restock what was never
      // taken.
      order.paymentStatus = "paid";
      order.orderStatus = "pending";
      order.paymentId = String(order._id);
      order.payerId = "";
      order.transactionId = transactionCode;
      order.transactionState = "COMPLETE";
      order.paymentCurrency = ESEWA_CURRENCY;
      order.paidAmount = paidAmount;
      order.paymentPayerEmail = "";
      order.paymentDate = new Date();
      order.stockDecremented = false;
      order.stockRestored = false;
      order.paymentFailureReason = `Payment was captured but the order could not be fulfilled: ${stockError.message}`.slice(
        0,
        500
      );
      order.orderUpdateDate = new Date();
      await order.save();

      return res.status(stockError.status).json({
        success: false,
        message: `${stockError.message}. Your payment was captured and our team will refund it.`,
      });
    }

    // Cart cleanup is best effort - the order is already confirmed at this point
    if (order.cartId && isValidObjectId(order.cartId)) {
      try {
        await Cart.findByIdAndDelete(order.cartId);
      } catch (cartError) {
        console.log(cartError);
      }
    }

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};


/**
 * Mock gateway only (ESEWA_MODE=mock): the test cashier page calls this when
 * the buyer clicks Pay. It returns a genuinely-signed COMPLETE payload that
 * travels the exact same verify path as a real eSewa response. Refused
 * entirely unless mock mode is on.
 */
const mockConfirmEsewaPayment = async (req, res) => {
  try {
    if (!IS_MOCK) {
      return res.status(404).json({
        success: false,
        message: "Mock payments are only available in mock mode!",
      });
    }

    const { orderId } = req.body || {};

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order id is mandatory!",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    if (order.userId && String(order.userId) !== String(req.user?.id)) {
      return res.status(403).json({
        success: false,
        message: "This order does not belong to the logged in user!",
      });
    }

    if (
      (order.paymentStatus === "paid" && order.orderStatus === "confirmed") ||
      order.paymentStatus === "cancelled" ||
      order.orderStatus === "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: "This order can no longer be paid.",
      });
    }

    const data = buildMockSuccessPayload({
      orderId: order._id,
      totalAmount: order.totalAmount,
      productCode: process.env.ESEWA_MERCHANT_CODE || "EPAYTEST",
    });

    return res.status(200).json({
      success: true,
      orderId: order._id,
      data,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

/**
 * Called by the /shop/esewa-failure page: eSewa sends the buyer here when the
 * payment was not completed. Nothing was reserved for this order yet (stock is only
 * taken once a payment is verified), so the catalogue and the cart stay untouched
 * and the buyer can simply check out again.
 */
const cancelPayment = async (req, res) => {
  try {
    const { orderId } = req.body || {};

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order id is mandatory!",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    if (order.userId && String(order.userId) !== String(req.user?.id)) {
      return res.status(403).json({
        success: false,
        message: "This order does not belong to the logged in user!",
      });
    }

    // A confirmed/paid order must never be cancelled through this endpoint
    if (order.paymentStatus === "paid" && order.orderStatus === "confirmed") {
      return res.status(400).json({
        success: false,
        message: "This order is already paid - there is nothing to cancel.",
      });
    }

    if (order.paymentStatus !== "cancelled") {
      order.paymentStatus = "cancelled";
      order.orderStatus = "cancelled";
      order.paymentFailureReason = "The buyer cancelled the payment on eSewa";
      order.orderUpdateDate = new Date();
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: "Payment cancelled",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // A user can only list their own orders
    if (String(userId) !== String(req.user?.id)) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own orders!",
      });
    }

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    // Order details carry payment information, so they stay private to the buyer
    if (order.userId && String(order.userId) !== String(req.user?.id)) {
      return res.status(403).json({
        success: false,
        message: "This order does not belong to the logged in user!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  verifyEsewaPayment,
  mockConfirmEsewaPayment,
  cancelPayment,
  getAllOrdersByUser,
  getOrderDetails,
};

