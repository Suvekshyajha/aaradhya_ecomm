const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const {
  validateRegistration,
  validateLogin,
} = require("../../helpers/validation");

// Production (HTTPS, cross-site frontend) needs secure + sameSite "none" so the
// browser sends the cookie. Localhost development uses plain http, where a
// secure cookie would never be stored - hence lax + non-secure there.
const isProduction = process.env.NODE_ENV === "production";

const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 60 * 60 * 1000, // 60m, matches JWT_EXPIRES_IN default
  path: "/",
});

//register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const validationErrors = validateRegistration({ userName, email, password });
    if (validationErrors.length) {
      return res.status(400).json({
        success: false,
        message: validationErrors[0],
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const checkUser = await User.findOne({ email: normalizedEmail });
    if (checkUser)
      return res.status(409).json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName: userName.trim(),
      email: normalizedEmail,
      password: hashPassword,
    });

    await newUser.save();
    res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    // A unique-index race (two registers at once) surfaces as a duplicate key
    if (e && e.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });
    }
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const validationErrors = validateLogin({ email, password });
    if (validationErrors.length) {
      return res.status(400).json({
        success: false,
        message: validationErrors[0],
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const checkUser = await User.findOne({ email: normalizedEmail });
    if (!checkUser)
      return res.status(401).json({
        success: false,
        message: "User doesn't exists! Please register first",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.status(401).json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    // The signing secret comes from server/.env - never hard-code it
    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "60m" }
    );

    res.cookie("token", token, getAuthCookieOptions()).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//logout - clearing uses the same path/sameSite/secure options (minus maxAge,
// which Express ignores on clear), otherwise the browser keeps the cookie
const logoutUser = (req, res) => {
  const { maxAge, ...clearOptions } = getAuthCookieOptions();
  res.clearCookie("token", clearOptions).json({
    success: true,
    message: "Logged out successfully!",
  });
};

//auth middleware - verifies the JWT and attaches the decoded user to req.user
const authMiddleware = async (req, res, next) => {
  const bearerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;

  const token = req.cookies?.token || bearerToken;

  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

//admin middleware - must run after authMiddleware, blocks non-admin users
const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({
      success: false,
      message: "Access denied! Admin privileges required.",
    });

  return next();
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  adminMiddleware,
};