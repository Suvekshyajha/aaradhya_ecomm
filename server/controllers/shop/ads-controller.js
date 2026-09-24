const Advertisement = require("../../models/Advertisement");
const { AD_PLACEMENTS } = require("../../helpers/validation");

// GET /api/shop/ads/active?placement=home-strip
// Display advertising revenue stream: returns only ads that are active
// right now (isActive + inside the optional date window).
const getActiveAdvertisements = async (req, res) => {
  try {
    const { placement } = req.query;
    const now = new Date();

    const filters = {
      isActive: true,
      $and: [
        { $or: [{ startsAt: null }, { startsAt: { $lte: now } }] },
        { $or: [{ endsAt: null }, { endsAt: { $gte: now } }] },
      ],
    };

    if (placement) {
      if (!AD_PLACEMENTS.includes(placement)) {
        return res.status(400).json({
          success: false,
          message: `Invalid placement! Allowed values: ${AD_PLACEMENTS.join(", ")}`,
        });
      }
      filters.placement = placement;
    }

    const data = await Advertisement.find(filters).sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (e) {
    console.error("Error in getActiveAdvertisements:", e);
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// POST /api/shop/ads/:id/click
// Counts one outbound click on a paid placement. Only the counter is
// incremented - no user data is stored.
const trackAdvertisementClick = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid advertisement ID!",
      });
    }

    const ad = await Advertisement.findByIdAndUpdate(
      id,
      { $inc: { clicks: 1 } },
      { new: true }
    ).lean();

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found!",
      });
    }

    return res.status(200).json({
      success: true,
      data: { clicks: ad.clicks || 0 },
    });
  } catch (e) {
    console.error("Error in trackAdvertisementClick:", e);
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

module.exports = {
  getActiveAdvertisements,
  trackAdvertisementClick,
};
