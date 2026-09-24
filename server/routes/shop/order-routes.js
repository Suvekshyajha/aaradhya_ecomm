const express = require("express");

const {
  createOrder,
  verifyEsewaPayment,
  mockConfirmEsewaPayment,
  cancelPayment,
  getAllOrdersByUser,
  getOrderDetails
  
} = require("../../controllers/shop/order-controller");

const {
  authMiddleware,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Orders are per-user, so every order route requires an authenticated session
router.use(authMiddleware);


router.post("/create", createOrder);
router.post("/verify", verifyEsewaPayment);
router.post("/mock-confirm", mockConfirmEsewaPayment);
// eSewa sends the buyer to the failure url when the payment was not completed
router.post("/payment-cancel", cancelPayment);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);



module.exports = router;











