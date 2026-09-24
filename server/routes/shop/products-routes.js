
const express = require("express");

const {
  getFilteredProducts,
  getProductDetails,
  getProductRecommendations,
  getSponsoredProducts,
  trackAffiliateClick,
} = require("../../controllers/shop/products-controller");

const router = express.Router();

router.get("/get", getFilteredProducts);
router.get("/sponsored", getSponsoredProducts);
router.get("/recommendations/:productId", getProductRecommendations);
router.post("/:id/affiliate-click", trackAffiliateClick);
router.get("/get/:id", getProductDetails);

module.exports = router;

