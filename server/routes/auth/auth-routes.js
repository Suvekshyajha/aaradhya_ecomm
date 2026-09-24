const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Brute-force protection for authentication only (not a global limit, so the
// rest of the shop is unaffected). 30 attempts per 15 minutes per IP is
// generous enough for normal development/testing while slowing down attacks.
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts, please try again after 15 minutes",
  },
});

router.post("/register", authRateLimiter, registerUser);
router.post("/login", authRateLimiter, loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

module.exports = router;


