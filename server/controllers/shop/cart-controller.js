const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const { getAvailableStock, isValidObjectId } = require("../../helpers/order");

// The customer identity always comes from the verified JWT (req.user.id).
// A userId sent in the body or URL is never trusted: when it is present it
// must match the session, otherwise the request is rejected.
const getAuthenticatedUserId = (req, res, claimedUserId) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
    return null;
  }

  if (claimedUserId && String(claimedUserId) !== String(userId)) {
    res.status(403).json({
      success: false,
      message: "You can only access your own cart!",
    });
    return null;
  }

  return String(userId);
};

const addToCart = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req, res, req.body?.userId);
    if (!userId) return;

    const { productId, quantity } = req.body;

    const requestedQuantity = Number(quantity);

    if (
      !productId ||
      !isValidObjectId(productId) ||
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Stock is validated here too, so a stale browser tab can never park more units
    // in the cart than the shop can actually ship
    const availableStock = getAvailableStock(product);

    if (availableStock < requestedQuantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableStock} left in stock for ${product.title}`,
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    const quantityAlreadyInCart =
      findCurrentProductIndex === -1
        ? 0
        : Number(cart.items[findCurrentProductIndex].quantity);

    if (quantityAlreadyInCart + requestedQuantity > availableStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableStock} left in stock for ${product.title}`,
      });
    }

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity: requestedQuantity });
    } else {
      cart.items[findCurrentProductIndex].quantity =
        quantityAlreadyInCart + requestedQuantity;
    }

    await cart.save();
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req, res, req.params?.userId);
    if (!userId) return;

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const validItems = cart.items.filter(
      (productItem) => productItem.productId
    );

    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req, res, req.body?.userId);
    if (!userId) return;

    const { productId, quantity } = req.body;

    const requestedQuantity = Number(quantity);

    if (
      !productId ||
      !isValidObjectId(productId) ||
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present !",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // The cart can never hold more units than the stock that is actually available
    const availableStock = getAvailableStock(product);

    if (requestedQuantity > availableStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableStock} left in stock for ${product.title}`,
      });
    }

    cart.items[findCurrentProductIndex].quantity = requestedQuantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req, res, req.params?.userId);
    if (!userId) return;

    const { productId } = req.params;
    if (!productId || !isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId?._id?.toString() !== productId
    );

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
};