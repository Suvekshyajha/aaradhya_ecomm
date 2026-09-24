/**
 * Shared backend input validation for Glam Grace.
 * Every function here is deliberately dependency-free (no new packages) and
 * works on plain request values. Controllers decide the HTTP status codes.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Characters with special meaning in MongoDB/JavaScript regular expressions
const REGEX_SPECIAL_CHARS_RE = /[.*+?^${}()|[\]\\]/g;

/** Returns a trimmed string, or "" for non-string input. */
const toTrimmedString = (value, maxLength = 500) => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
};

const isValidEmail = (value) =>
  typeof value === "string" &&
  value.trim().length >= 5 &&
  value.trim().length <= 254 &&
  EMAIL_RE.test(value.trim());

/** Escapes user text so it can be safely embedded in a RegExp. */
const escapeRegExp = (value) => String(value).replace(REGEX_SPECIAL_CHARS_RE, "\\$&");

/**
 * Registration validation. Returns an array of human readable problems
 * (empty = valid). Never relies on frontend validation.
 */
const validateRegistration = ({ userName, email, password } = {}) => {
  const errors = [];

  const name = typeof userName === "string" ? userName.trim() : "";
  if (!name) errors.push("User name is required");
  else if (name.length < 3) errors.push("User name must be at least 3 characters");
  else if (name.length > 50) errors.push("User name must be at most 50 characters");

  if (!email || typeof email !== "string" || !email.trim()) {
    errors.push("Email is required");
  } else if (!isValidEmail(email)) {
    errors.push("Email format is invalid");
  }

  if (!password || typeof password !== "string" || !password) {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  } else if (password.length > 128) {
    errors.push("Password must be at most 128 characters");
  }

  return errors;
};

const validateLogin = ({ email, password } = {}) => {
  const errors = [];

  if (!email || typeof email !== "string" || !email.trim()) {
    errors.push("Email is required");
  } else if (!isValidEmail(email)) {
    errors.push("Email format is invalid");
  }

  if (!password || typeof password !== "string" || !password) {
    errors.push("Password is required");
  }

  return errors;
};

const isFiniteNonNegativeNumber = (value) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

/**
 * Product validation for admin add/edit. In "edit" mode only the fields that
 * are present are validated. Returns an array of problems (empty = valid).
 */
const validateProduct = (body = {}, { requireTitleAndPrice = true } = {}) => {
  const errors = [];
  const {
    image,
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock,
    averageReview,
  } = body;

  if (requireTitleAndPrice || title !== undefined) {
    if (typeof title !== "string" || !title.trim()) errors.push("Product title is required");
    else if (title.trim().length > 200) errors.push("Product title must be at most 200 characters");
  }

  if (description !== undefined && description !== null && description !== "") {
    if (typeof description !== "string") errors.push("Product description must be text");
    else if (description.length > 2000) errors.push("Product description must be at most 2000 characters");
  }

  for (const [field, value] of [
    ["category", category],
    ["brand", brand],
  ]) {
    if (value !== undefined && value !== null && value !== "") {
      if (typeof value !== "string" || !value.trim()) errors.push(`Product ${field} must be a non-empty string`);
      else if (value.trim().length > 100) errors.push(`Product ${field} must be at most 100 characters`);
    }
  }

  const priceNumber = Number(price);
  if (requireTitleAndPrice || price !== undefined) {
    if (price === undefined || price === null || price === "") {
      errors.push("Product price is required");
    } else if (!Number.isFinite(priceNumber) || priceNumber < 0) {
      errors.push("Product price must be a number >= 0");
    } else if (priceNumber > 100000000) {
      errors.push("Product price is unreasonably large");
    }
  }

  if (salePrice !== undefined && salePrice !== null && salePrice !== "") {
    const saleNumber = Number(salePrice);
    if (!Number.isFinite(saleNumber) || saleNumber < 0) {
      errors.push("Product sale price must be a number >= 0");
    }
  }

  if (totalStock !== undefined && totalStock !== null && totalStock !== "") {
    const stockNumber = Number(totalStock);
    if (!Number.isInteger(stockNumber) || stockNumber < 0) {
      errors.push("Product stock must be an integer >= 0");
    }
  }

  if (averageReview !== undefined && averageReview !== null && averageReview !== "") {
    const reviewNumber = Number(averageReview);
    if (!Number.isFinite(reviewNumber) || reviewNumber < 0 || reviewNumber > 5) {
      errors.push("Product average review must be a number between 0 and 5");
    }
  }

  if (image !== undefined && image !== null && image !== "") {
    if (typeof image !== "string") errors.push("Product image must be a URL string");
    else if (image.length > 2000) errors.push("Product image URL is too long");
  }

  // ---- Revenue-stream fields (all optional) -------------------------------
  if (body.isSponsored !== undefined && body.isSponsored !== null && body.isSponsored !== "") {
    if (!toBoolean(body.isSponsored).valid) {
      errors.push("Product sponsored flag must be true or false");
    }
  }

  if (body.sponsorName !== undefined && body.sponsorName !== null && body.sponsorName !== "") {
    if (typeof body.sponsorName !== "string" || !body.sponsorName.trim()) {
      errors.push("Sponsor name must be a non-empty string");
    } else if (body.sponsorName.trim().length > 100) {
      errors.push("Sponsor name must be at most 100 characters");
    }
  }

  if (body.sponsoredUntil !== undefined && body.sponsoredUntil !== null && body.sponsoredUntil !== "") {
    const expiry = new Date(body.sponsoredUntil);
    if (Number.isNaN(expiry.getTime())) {
      errors.push("Sponsored expiry must be a valid date");
    }
  }

  if (body.affiliateUrl !== undefined && body.affiliateUrl !== null && body.affiliateUrl !== "") {
    if (!isValidHttpUrl(body.affiliateUrl)) {
      errors.push("Affiliate URL must be a valid http(s) URL");
    }
  }

  if (body.affiliatePartner !== undefined && body.affiliatePartner !== null && body.affiliatePartner !== "") {
    if (typeof body.affiliatePartner !== "string" || !body.affiliatePartner.trim()) {
      errors.push("Affiliate partner must be a non-empty string");
    } else if (body.affiliatePartner.trim().length > 100) {
      errors.push("Affiliate partner must be at most 100 characters");
    }
  }

  return errors;
};

const PHONE_DIGITS_RE = /\d/g;

const HTTP_URL_RE = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

// Coerces form values ("true"/"false"/boolean) to a real boolean.
// Returns { value, valid } so controllers can reject garbage.
const toBoolean = (value) => {
  if (typeof value === "boolean") return { value, valid: true };
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return { value: true, valid: true };
    if (normalized === "false") return { value: false, valid: true };
  }
  if (value === 1) return { value: true, valid: true };
  if (value === 0) return { value: false, valid: true };
  return { value: false, valid: false };
};

const isValidHttpUrl = (value) =>
  typeof value === "string" && value.trim().length <= 2000 && HTTP_URL_RE.test(value.trim());

/**
 * Address validation against the actual Address schema fields
 * (address, city, pincode, phone, notes). Returns { errors, address } where
 * address contains only the whitelisted fields - anything else the client
 * sent (userId, _id, ...) is dropped, never written to the database.
 */
const validateAddress = (body = {}) => {
  const errors = [];
  const address = {};

  const fields = [
    { key: "address", label: "Address", required: true, min: 5, max: 200 },
    { key: "city", label: "City", required: true, min: 2, max: 100 },
    { key: "pincode", label: "Pincode", required: true, min: 3, max: 12 },
    { key: "phone", label: "Phone", required: true, min: 7, max: 20 },
    { key: "notes", label: "Notes", required: false, min: 0, max: 500 },
  ];

  for (const field of fields) {
    const raw = body[field.key];
    const value = typeof raw === "string" ? raw.trim() : "";

    if (!value) {
      if (field.required) errors.push(`${field.label} is required`);
      continue;
    }

    if (value.length < field.min || value.length > field.max) {
      errors.push(`${field.label} must be between ${field.min} and ${field.max} characters`);
      continue;
    }

    if (field.key === "phone") {
      const digits = value.match(PHONE_DIGITS_RE) || [];
      if (digits.length < 7 || digits.length > 15) {
        errors.push("Phone number must contain between 7 and 15 digits");
        continue;
      }
      if (!/^[+\d][\d\s\-().]*$/.test(value)) {
        errors.push("Phone number contains invalid characters");
        continue;
      }
    }

    address[field.key] = value;
  }

  return { errors, address };
};

/**
 * Order delivery information validation. Prices, totals, statuses and the
 * user identity are always decided by the server - this only checks the
 * address block the frontend is allowed to submit.
 */
const validateOrderAddressInfo = (addressInfo = {}) => {
  if (!addressInfo || typeof addressInfo !== "object" || Array.isArray(addressInfo)) {
    return ["Delivery address information is required"];
  }

  const { errors } = validateAddress({
    address: addressInfo.address,
    city: addressInfo.city,
    pincode: addressInfo.pincode,
    phone: addressInfo.phone,
    notes: addressInfo.notes || "",
  });

  // Notes are optional on orders (validateAddress already treats them so)
  return errors;
};

/**
 * Advertisement validation for admin add/edit. In "edit" mode only the
 * fields that are present are validated. Returns an array of problems
 * (empty = valid).
 */
const AD_PLACEMENTS = ["home-strip", "listing-top"];

const validateAdvertisement = (body = {}, { requireTitleImageLink = true } = {}) => {
  const errors = [];
  const { title, image, linkUrl, placement, isActive, startsAt, endsAt } = body;

  if (requireTitleImageLink || title !== undefined) {
    if (typeof title !== "string" || !title.trim()) errors.push("Ad title is required");
    else if (title.trim().length > 200) errors.push("Ad title must be at most 200 characters");
  }

  if (requireTitleImageLink || image !== undefined) {
    if (typeof image !== "string" || !image.trim()) errors.push("Ad image is required");
    else if (image.trim().length > 2000) errors.push("Ad image URL is too long");
  }

  if (requireTitleImageLink || linkUrl !== undefined) {
    if (typeof linkUrl !== "string" || !linkUrl.trim()) errors.push("Ad link URL is required");
    else if (!isValidHttpUrl(linkUrl)) errors.push("Ad link URL must be a valid http(s) URL");
  }

  if (placement !== undefined && placement !== null && placement !== "") {
    if (!AD_PLACEMENTS.includes(placement)) {
      errors.push(`Ad placement must be one of: ${AD_PLACEMENTS.join(", ")}`);
    }
  }

  if (isActive !== undefined && isActive !== null && isActive !== "") {
    if (!toBoolean(isActive).valid) {
      errors.push("Ad active flag must be true or false");
    }
  }

  let startsAtDate = null;
  let endsAtDate = null;

  if (startsAt !== undefined && startsAt !== null && startsAt !== "") {
    startsAtDate = new Date(startsAt);
    if (Number.isNaN(startsAtDate.getTime())) errors.push("Ad start date must be a valid date");
  }

  if (endsAt !== undefined && endsAt !== null && endsAt !== "") {
    endsAtDate = new Date(endsAt);
    if (Number.isNaN(endsAtDate.getTime())) errors.push("Ad end date must be a valid date");
  }

  if (startsAtDate && endsAtDate && endsAtDate < startsAtDate) {
    errors.push("Ad end date must not be before the start date");
  }

  return errors;
};

module.exports = {
  toTrimmedString,
  isValidEmail,
  escapeRegExp,
  isFiniteNonNegativeNumber,
  toBoolean,
  isValidHttpUrl,
  AD_PLACEMENTS,
  validateRegistration,
  validateLogin,
  validateProduct,
  validateAdvertisement,
  validateAddress,
  validateOrderAddressInfo,
};
