const Advertisement = require("../../models/Advertisement");
const { validateAdvertisement, toBoolean } = require("../../helpers/validation");

// Picks only the known ad fields out of the request body (mass-assignment
// protection). In edit mode, fields that were not sent are left untouched.
const extractAdFields = (body = {}, forEdit = false) => {
  const fields = {};
  const isProvided = (value) => value !== undefined && value !== null && value !== "";

  if (isProvided(body.title)) fields.title = body.title.trim();
  if (isProvided(body.image)) fields.image = body.image.trim();
  if (isProvided(body.linkUrl)) fields.linkUrl = body.linkUrl.trim();
  if (isProvided(body.placement)) fields.placement = body.placement;
  if (isProvided(body.isActive)) fields.isActive = toBoolean(body.isActive).value;
  else if (!forEdit) fields.isActive = true;
  if (isProvided(body.startsAt)) fields.startsAt = new Date(body.startsAt);
  else if (!forEdit) fields.startsAt = null;
  if (isProvided(body.endsAt)) fields.endsAt = new Date(body.endsAt);
  else if (!forEdit) fields.endsAt = null;

  return fields;
};

const addAdvertisement = async (req, res) => {
  try {
    const validationErrors = validateAdvertisement(req.body, {
      requireTitleImageLink: true,
    });

    if (validationErrors.length) {
      return res.status(400).json({ success: false, message: validationErrors[0] });
    }

    const newlyCreatedAd = new Advertisement(extractAdFields(req.body));
    await newlyCreatedAd.save();
    res.status(201).json({ success: true, data: newlyCreatedAd });
  } catch (e) {
    console.error("Add Advertisement Error:", e.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const fetchAllAdvertisements = async (req, res) => {
  try {
    const ads = await Advertisement.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: ads });
  } catch (e) {
    console.error("Fetch Advertisements Error:", e.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const editAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const validationErrors = validateAdvertisement(req.body, {
      requireTitleImageLink: false,
    });

    if (validationErrors.length) {
      return res.status(400).json({ success: false, message: validationErrors[0] });
    }

    const ad = await Advertisement.findById(id);
    if (!ad) {
      return res.status(404).json({ success: false, message: "Advertisement not found" });
    }

    Object.assign(ad, extractAdFields(req.body, true));
    await ad.save();
    res.status(200).json({ success: true, data: ad });
  } catch (e) {
    console.error("Edit Advertisement Error:", e.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const deleteAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Advertisement.findByIdAndDelete(id);

    if (!ad) {
      return res.status(404).json({ success: false, message: "Advertisement not found" });
    }

    res.status(200).json({ success: true, message: "Advertisement deleted successfully" });
  } catch (e) {
    console.error("Delete Advertisement Error:", e.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  addAdvertisement,
  fetchAllAdvertisements,
  editAdvertisement,
  deleteAdvertisement,
};
