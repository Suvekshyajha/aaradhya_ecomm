// One-off utility: (re)set any user's password with a proper bcrypt hash.
// Usage: node reset-admin-password.js <email> <newPassword>
// Example: node reset-admin-password.js admin@gmail.com "Admin@123"
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

(async () => {
  const [, , email, newPassword] = process.argv;
  if (!email || !newPassword) {
    console.log("Usage: node reset-admin-password.js <email> <newPassword>");
    process.exit(1);
  }
  if (newPassword.length < 6) {
    console.log("Password must be at least 6 characters");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) {
    console.log(`No user found with email ${email}`);
    process.exit(1);
  }
  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  console.log(`Password reset for ${user.email} (role=${user.role})`);
  await mongoose.disconnect();
})().catch((e) => {
  console.error("ERR", e.message);
  process.exit(1);
});
