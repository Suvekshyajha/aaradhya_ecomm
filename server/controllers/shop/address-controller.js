const Address = require("../../models/Address");
const { validateAddress } = require("../../helpers/validation");

// The customer identity always comes from the verified JWT (req.user.id).
// A userId sent in the body or URL is never trusted: when it is present it
// must match the session, otherwise the request is rejected so User A can
// never read or change User B's addresses.
const getAuthenticatedUserId = (req, res, claimedUserId) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
    return null;
  }

  if (claimedUserId && String(claimedUserId) !== String(userId)) {
    res.status(403).json({
      success: false,
      message: "You can only access your own addresses!",
    });
    return null;
  }

  return String(userId);
};

const addAddress = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req, res, req.body?.userId);
    if (!userId) return;

    const { errors, address } = validateAddress(req.body);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        message: errors[0],
      });
    }

    // Only the whitelisted fields are stored - a client-supplied userId/_id
    // can never be written to another user's document
    const newlyCreatedAddress = new Address({
      userId,
      ...address,
    });

    await newlyCreatedAddress.save();

    res.status(201).json({
      success: true,
      data: newlyCreatedAddress,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req, res, req.params?.userId);
    if (!userId) return;

    const addressList = await Address.find({ userId });

    res.status(200).json({
      success: true,
      data: addressList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const editAddress = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req, res, req.params?.userId);
    if (!userId) return;

    const { addressId } = req.params;

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "User and address id is required!",
      });
    }

    // Merge with the stored document so partial updates are validated against
    // the full value set, then write back only the whitelisted fields
    const existingAddress = await Address.findOne({ _id: addressId, userId });

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const { errors, address } = validateAddress({
      address: req.body.address ?? existingAddress.address,
      city: req.body.city ?? existingAddress.city,
      pincode: req.body.pincode ?? existingAddress.pincode,
      phone: req.body.phone ?? existingAddress.phone,
      notes: req.body.notes ?? existingAddress.notes ?? "",
    });

    if (errors.length) {
      return res.status(400).json({
        success: false,
        message: errors[0],
      });
    }

    Object.assign(existingAddress, address);
    await existingAddress.save();

    res.status(200).json({
      success: true,
      data: existingAddress,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req, res, req.params?.userId);
    if (!userId) return;

    const { addressId } = req.params;
    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "User and address id is required!",
      });
    }

    // Ownership is part of the query, so another user's address id simply
    // looks "not found" - nothing about it is revealed
    const address = await Address.findOneAndDelete({ _id: addressId, userId });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { addAddress, editAddress, fetchAllAddress, deleteAddress };
