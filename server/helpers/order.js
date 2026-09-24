const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Money is always handled with two decimals - PayPal rejects any other format
const roundToTwoDecimals = (value) => Math.round(value * 100) / 100;

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

// A product is sold at its sale price when one is configured, otherwise at its price
const getUnitPrice = (product) => {
  const salePrice = Number(product.salePrice);
  const price = Number(product.price);

  return roundToTwoDecimals(salePrice > 0 ? salePrice : price);
};

const getAvailableStock = (product) => {
  const totalStock = Number(product.totalStock);

  return Number.isFinite(totalStock) && totalStock > 0 ? totalStock : 0;
};

/**
 * Rebuilds the order lines straight from the database so nothing money or stock
 * related is ever taken from the client:
 *   - the quantities come from the user's cart document (client cartItems are only
 *     used as a fallback when no cartId is available)
 *   - the unit price is the product's sale price / price as stored in MongoDB
 *   - the total is recalculated from those unit prices
 *   - every line is checked against the stock that is actually available
 *
 * Returns { data: { cartItems, totalAmount } } on success or
 * { error: { status, message } } when the order can not be created.
 */
const resolveOrderItems = async ({ userId, cartId, cartItems }) => {
  let requestedItems = [];

  if (cartId) {
    if (!isValidObjectId(cartId)) {
      return { error: { status: 400, message: "Invalid cart id provided!" } };
    }

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return { error: { status: 404, message: "Cart not found!" } };
    }

    if (cart.userId.toString() !== String(userId)) {
      return {
        error: {
          status: 403,
          message: "This cart does not belong to the logged in user!",
        },
      };
    }

    requestedItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId.toString() : null,
      quantity: Number(item.quantity),
    }));
  } else if (Array.isArray(cartItems)) {
    requestedItems = cartItems.map((item) => ({
      productId: item?.productId ? String(item.productId) : null,
      quantity: Number(item?.quantity),
    }));
  }

  if (!requestedItems.length) {
    return {
      error: {
        status: 400,
        message: "Your cart is empty. Please add items to proceed",
      },
    };
  }

  // Lines for the same product are merged so the stock check sees the full quantity
  const quantityPerProduct = new Map();

  for (const item of requestedItems) {
    if (!item.productId || !isValidObjectId(item.productId)) {
      return {
        error: {
          status: 404,
          message: "One of the products in your order is no longer available",
        },
      };
    }

    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      return { error: { status: 400, message: "Invalid quantity provided!" } };
    }

    quantityPerProduct.set(
      item.productId,
      (quantityPerProduct.get(item.productId) || 0) + item.quantity
    );
  }

  const products = await Product.find({
    _id: { $in: [...quantityPerProduct.keys()] },
  });

  const productById = new Map(
    products.map((product) => [product._id.toString(), product])
  );

  const orderItems = [];
  let totalAmount = 0;

  for (const [productId, quantity] of quantityPerProduct) {
    const product = productById.get(productId);

    if (!product) {
      return {
        error: {
          status: 404,
          message: "One of the products in your order is no longer available",
        },
      };
    }

    const unitPrice = getUnitPrice(product);

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      return {
        error: {
          status: 500,
          message: `Invalid price configured for ${product.title}`,
        },
      };
    }

    // Reject the whole order instead of silently ordering more than we can ship
    const availableStock = getAvailableStock(product);

    if (availableStock < quantity) {
      return {
        error: {
          status: 400,
          message: `Only ${availableStock} left in stock for ${product.title}`,
        },
      };
    }

    orderItems.push({
      productId: product._id,
      title: product.title,
      image: product.image,
      price: unitPrice, // server side price - any client supplied price is ignored
      quantity,
    });

    totalAmount += unitPrice * quantity;
  }

  return {
    data: { cartItems: orderItems, totalAmount: roundToTwoDecimals(totalAmount) },
  };
};

/**
 * Atomic "check and decrement": MongoDB evaluates the stock condition and applies
 * the $inc in a single operation, so two orders captured at the same moment can
 * never take the stock below zero (no read-then-write race).
 *
 * Returns null when the product is missing or does not have enough stock left.
 */
const reserveStock = async (productId, quantity) =>
  Product.findOneAndUpdate(
    { _id: productId, totalStock: { $gte: quantity } },
    { $inc: { totalStock: -quantity } },
    { new: true }
  );

/**
 * Gives a set of previously reserved units back to the catalogue (cancelled
 * order, failed checkout, ...). Throws, so callers can report the failure.
 */
const increaseStock = async (items) => {
  if (!items || !items.length) {
    return;
  }

  await Promise.all(
    items.map(({ productId, quantity }) =>
      Product.updateOne({ _id: productId }, { $inc: { totalStock: quantity } })
    )
  );
};

/**
 * Compensating action used when an order fails halfway through: gives back every
 * unit that was already reserved so stock never leaks.
 */
const rollbackStock = async (decrementedItems) => {
  try {
    await increaseStock(decrementedItems);
  } catch (error) {
    // Never mask the original failure - only report the rollback problem
    console.log("[order] Could not restore stock after a failed order:", error);
  }
};

module.exports = {
  resolveOrderItems,
  reserveStock,
  increaseStock,
  rollbackStock,
  roundToTwoDecimals,
  getUnitPrice,
  getAvailableStock,
  isValidObjectId,
};


