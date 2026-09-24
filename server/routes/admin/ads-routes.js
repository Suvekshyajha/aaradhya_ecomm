const express = require("express");

const {
  addAdvertisement,
  fetchAllAdvertisements,
  editAdvertisement,
  deleteAdvertisement,
} = require("../../controllers/admin/ads-controller");

const {
  authMiddleware,
  adminMiddleware,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Every admin ads route requires a logged in user with the admin role
router.use(authMiddleware, adminMiddleware);

router.post("/add", addAdvertisement);
router.put("/edit/:id", editAdvertisement);
router.delete("/delete/:id", deleteAdvertisement);
router.get("/get", fetchAllAdvertisements);

module.exports = router;
