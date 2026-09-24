const express = require("express");

const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} = require("../../controllers/admin/order-controller");

const {
  authMiddleware,
  adminMiddleware,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Every admin order route requires a logged in user with the admin role
router.use(authMiddleware, adminMiddleware);

router.get("/get", getAllOrdersOfAllUsers);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);

module.exports = router;