



// const { imageUploadUtils } = require("../../helpers/cloudinary");

// const handleImageUpload = async(req, res) => {
//     try {
//         // Convert file buffer to base64 format for storage
//         const b64 = Buffer.from(req.file.buffer).toString('base64');

//         const url = "data:" + req.file.mimetype + ";base64," + b64;

//         // Call imageUploadUtils to upload the file to Cloudinary
//         const result = await imageUploadUtils(req.file);  // Passing the file directly instead of the URL

//         res.json({
//             success: true,
//             result
//         });

//     } catch (error) {
//         console.log(error);
//         res.json({
//             success: false,
//             message: "Error occurred",
//         });
//     }
// };

// module.exports = { handleImageUpload };




// const { imageUploadUtil } = require("../../helpers/cloudinary");
// const Product = require("../../models/Product");

// const handleImageUpload = async (req, res) => {
//   try {
//     const b64 = Buffer.from(req.file.buffer).toString("base64");
//     const url = "data:" + req.file.mimetype + ";base64," + b64;
//     const result = await imageUploadUtil(url);

//     res.json({
//       success: true,
//       result,
//     });
//   } catch (error) {
//     console.log(error);
//     res.json({
//       success: false,
//       message: "Error occured",
//     });
//   }
// };

// //add a new product
// const addProduct = async (req, res) => {
//   try {
//     const {
//       image,
//       title,
//       description,
//       category,
//       brand,
//       price,
//       salePrice,
//       totalStock,
//       averageReview,
//     } = req.body;

//     console.log(averageReview, "averageReview");

//     const newlyCreatedProduct = new Product({
//       image,
//       title,
//       description,
//       category,
//       brand,
//       price,
//       salePrice,
//       totalStock,
//       averageReview,
//     });

//     await newlyCreatedProduct.save();
//     res.status(201).json({
//       success: true,
//       data: newlyCreatedProduct,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Error occured",
//     });
//   }
// };

// //fetch all products

// const fetchAllProducts = async (req, res) => {
//   try {
//     const listOfProducts = await Product.find({});
//     res.status(200).json({
//       success: true,
//       data: listOfProducts,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Error occured",
//     });
//   }
// };

// //edit a product
// const editProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       image,
//       title,
//       description,
//       category,
//       brand,
//       price,
//       salePrice,
//       totalStock,
//       averageReview,
//     } = req.body;

//     let findProduct = await Product.findById(id);
//     if (!findProduct)
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });

//     findProduct.title = title || findProduct.title;
//     findProduct.description = description || findProduct.description;
//     findProduct.category = category || findProduct.category;
//     findProduct.brand = brand || findProduct.brand;
//     findProduct.price = price === "" ? 0 : price || findProduct.price;
//     findProduct.salePrice =
//       salePrice === "" ? 0 : salePrice || findProduct.salePrice;
//     findProduct.totalStock = totalStock || findProduct.totalStock;
//     findProduct.image = image || findProduct.image;
//     findProduct.averageReview = averageReview || findProduct.averageReview;

//     await findProduct.save();
//     res.status(200).json({
//       success: true,
//       data: findProduct,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Error occured",
//     });
//   }
// };

// //delete a product
// const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findByIdAndDelete(id);

//     if (!product)
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });

//     res.status(200).json({
//       success: true,
//       message: "Product delete successfully",
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Error occured",
//     });
//   }
// };

// module.exports = {
//   handleImageUpload,
//   addProduct,
//   fetchAllProducts,
//   editProduct,
//   deleteProduct,
// };











const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");
const { validateProduct, toBoolean } = require("../../helpers/validation");

const handleImageUpload = async (req, res) => {
  
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${b64}`;
    const result = await imageUploadUtil(dataUri);

    res.json({ success: true, result });
  } catch (error) {
    console.log("Image upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error occured during image upload",
    });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  try {
    const { image, title, description, category, brand, price, salePrice, totalStock, averageReview } = req.body;

    const validationErrors = validateProduct(req.body, { requireTitleAndPrice: true });

    if (validationErrors.length) {
      return res.status(400).json({ success: false, message: validationErrors[0] });
    }

    const newlyCreatedProduct = new Product({
      image,
      title: title.trim(),
      description,
      category: category ? category.trim() : category,
      brand: brand ? brand.trim() : brand,
      price: Number(price),
      salePrice: salePrice === "" || salePrice === undefined ? salePrice : Number(salePrice),
      totalStock: totalStock === "" || totalStock === undefined ? totalStock : Number(totalStock),
      averageReview,
      ...extractRevenueFields(req.body),
    });

    await newlyCreatedProduct.save();
    res.status(201).json({ success: true, data: newlyCreatedProduct });
  } catch (e) {
    console.error("Add Product Error:", e.message);
    res.status(500).json({ success: false, message: "Server Error", error: e.message });
  }
};

// Fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({ success: true, data: listOfProducts });
  } catch (e) {
    console.error("Fetch Products Error:", e.message);
    res.status(500).json({ success: false, message: "Server Error", error: e.message });
  }
};

// Edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { image, title, description, category, brand, price, salePrice, totalStock, averageReview } = req.body;

    const validationErrors = validateProduct(req.body, { requireTitleAndPrice: false });

    if (validationErrors.length) {
      return res.status(400).json({ success: false, message: validationErrors[0] });
    }

    let findProduct = await Product.findById(id);
    if (!findProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const isProvided = (value) => value !== undefined && value !== null && value !== "";

    if (isProvided(image)) findProduct.image = image;
    if (isProvided(title)) findProduct.title = title.trim();
    if (isProvided(description)) findProduct.description = description;
    if (isProvided(category)) findProduct.category = category.trim();
    if (isProvided(brand)) findProduct.brand = brand.trim();
    if (isProvided(price)) findProduct.price = Number(price);
    if (isProvided(salePrice)) findProduct.salePrice = Number(salePrice);
    if (isProvided(totalStock)) findProduct.totalStock = Number(totalStock);
    if (isProvided(averageReview)) findProduct.averageReview = averageReview;

    Object.assign(findProduct, extractRevenueFields(req.body, true));

    await findProduct.save();
    res.status(200).json({ success: true, data: findProduct });
  } catch (e) {
    console.error("Edit Product Error:", e.message);
    res.status(500).json({ success: false, message: "Server Error", error: e.message });
  }
};

// Picks only the known revenue-stream fields out of the request body so
// arbitrary client properties can never be written to the product.
// In edit mode (forEdit=true) fields that were not sent are left untouched.
const extractRevenueFields = (body = {}, forEdit = false) => {
  const fields = {};
  const isProvided = (value) => value !== undefined && value !== null && value !== "";

  if (isProvided(body.isSponsored) || !forEdit) {
    if (isProvided(body.isSponsored)) fields.isSponsored = toBoolean(body.isSponsored).value;
    else if (!forEdit) fields.isSponsored = false;
  }
  if (isProvided(body.sponsorName)) fields.sponsorName = body.sponsorName.trim();
  else if (body.sponsorName === null) fields.sponsorName = "";
  else if (!forEdit) fields.sponsorName = "";
  if (isProvided(body.sponsoredUntil)) fields.sponsoredUntil = new Date(body.sponsoredUntil);
  else if (!forEdit) fields.sponsoredUntil = null;
  if (isProvided(body.affiliateUrl)) fields.affiliateUrl = body.affiliateUrl.trim();
  else if (body.affiliateUrl === null) fields.affiliateUrl = "";
  else if (!forEdit) fields.affiliateUrl = "";
  if (isProvided(body.affiliatePartner)) fields.affiliatePartner = body.affiliatePartner.trim();
  else if (body.affiliatePartner === null) fields.affiliatePartner = "";
  else if (!forEdit) fields.affiliatePartner = "";

  return fields;
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (e) {
    console.error("Delete Product Error:", e.message);
    res.status(500).json({ success: false, message: "Server Error", error: e.message });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};