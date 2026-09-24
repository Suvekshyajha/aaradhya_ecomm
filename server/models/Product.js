const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
    // ---- Revenue streams -------------------------------------------------
    // Sponsored products: brands/sellers pay for prominent placement.
    // A product is "actively" sponsored when isSponsored is true and
    // sponsoredUntil is unset or in the future.
    isSponsored: { type: Boolean, default: false },
    sponsorName: String,
    sponsoredUntil: Date,
    // Affiliate referrals: when set, buyers can continue to the partner
    // shop; outbound clicks are counted in affiliateClicks.
    affiliateUrl: String,
    affiliatePartner: String,
    affiliateClicks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);