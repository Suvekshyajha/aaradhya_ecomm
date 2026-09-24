const express = require("express");

const {
  getActiveAdvertisements,
  trackAdvertisementClick,
} = require("../../controllers/shop/ads-controller");

const router = express.Router();

router.get("/active", getActiveAdvertisements);
router.post("/:id/click", trackAdvertisementClick);

module.exports = router;
