const Order = require("../../models/Order");
const Product = require("../../models/Product");
const {
  reserveStock,
  increaseStock,
  rollbackStock,
  isValidObjectId,
} = require("../../helpers/order");

// Statuses that mean the order will not be fulfilled, so the reserved stock has to
// go back to the catalogue. "rejected" is the option the admin UI already offers,
// "cancelled" is accepted as well so both wordings work.
const CANCELLED_STATUSES = ["cancelled", "rejected"];

const isCancelledStatus = (status) =>
  CANCELLED_STATUSES.includes(String(status || "").toLowerCase());

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({});

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

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
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

// Every status the admin UI offers, plus "confirmed" which the server sets when a
// payment is verified. Anything else is rejected - customers can never smuggle
// a status through because no customer endpoint accepts an orderStatus at all.
const ALLOWED_ORDER_STATUSES = [
  "pending",
  "confirmed",
  "inProcess",
  "inShipping",
  "delivered",
  "cancelled",
  "rejected",
];

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    if (!orderStatus || typeof orderStatus !== "string") {
      return res.status(400).json({
        success: false,
        message: "Order status is required!",
      });
    }

    if (!ALLOWED_ORDER_STATUSES.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status! Allowed values: ${ALLOWED_ORDER_STATUSES.join(", ")}`,
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    const orderItems = order.cartItems.map((item) => ({
      productId: item.productId,
      quantity: Number(item.quantity),
    }));

    // Validate every product reference before any stock is moved, so a cancellation
    // can never restore half of the order
    if (orderItems.some((item) => !isValidObjectId(item.productId))) {
      return res.status(400).json({
        success: false,
        message:
          "Order status was not changed: this order references invalid products!",
      });
    }

    const cancelling = isCancelledStatus(orderStatus);
    const wasCancelled = isCancelledStatus(order.orderStatus);

    // Units only leave the stock when a payment is captured. Orders created before
    // the stock flags existed are inferred from their payment status, so they can
    // still be cancelled correctly.
    const stockWasDecremented =
      order.stockDecremented === true ||
      (order.stockDecremented === undefined && order.paymentStatus === "paid");

    if (
      cancelling &&
      !wasCancelled &&
      stockWasDecremented &&
      !order.stockRestored
    ) {
      // Cancelled / rejected -> hand the reserved units back to the catalogue once
      try {
        await increaseStock(orderItems);
      } catch (error) {
        console.log(error);

        return res.status(500).json({
          success: false,
          message:
            "Order status was not changed: the stock could not be restored!",
        });
      }

      order.stockRestored = true;
    } else if (!cancelling && wasCancelled && order.stockRestored) {
      // Re-opened after a cancellation -> the units have to be reserved again
      const reReserved = [];

      for (const item of orderItems) {
        if (!Number.isInteger(item.quantity) || item.quantity < 1) {
          await rollbackStock(reReserved);

          return res.status(400).json({
            success: false,
            message:
              "Order status was not changed: the order contains an invalid quantity!",
          });
        }

        const updatedProduct = await reserveStock(item.productId, item.quantity);

        if (!updatedProduct) {
          await rollbackStock(reReserved);

          const product = await Product.findById(item.productId);

          return res.status(400).json({
            success: false,
            message: product
              ? `Order status was not changed: only ${Math.max(
                  Number(product.totalStock) || 0,
                  0
                )} left in stock for ${product.title}`
              : "Order status was not changed: one of the products is no longer available",
          });
        }

        reReserved.push(item);
      }

      order.stockRestored = false;
    }

    order.orderStatus = orderStatus;
    order.orderUpdateDate = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status is updated successfully!",
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
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};