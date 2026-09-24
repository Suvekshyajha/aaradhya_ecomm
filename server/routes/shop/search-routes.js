


const express = require("express");
const { searchProducts } = require("../../controllers/shop/search-controller");

const router = express.Router();

// Support both query parameters and route parameters
router.get("/", searchProducts);  // For /api/shop/search?keyword=value
router.get("/:keyword", searchProducts);  // For /api/shop/search/value

module.exports = router;




