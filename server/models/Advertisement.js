const mongoose = require("mongoose");

// Display advertising: paid banner/promotional slots rendered on the
// storefront. An ad is "active" when isActive is true and the current time
// falls inside the optional [startsAt, endsAt] window.
const AdvertisementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    linkUrl: {
      type: String,
      required: true,
    },
    placement: {
      type: String,
      enum: ["home-strip", "listing-top"],
      default: "home-strip",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startsAt: Date,
    endsAt: Date,
    clicks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Advertisement", AdvertisementSchema);
