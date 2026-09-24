const Product = require("../../models/Product");
const getFilteredProducts = async (req, res) => {
  try {
    const { category = "", brand = "", sortBy = "price-lowtohigh" } = req.query;
    let filters = {};
    if (category.length) {
      filters.category = { $in: category.split(",") };
    }
    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }
    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
        break;
    }
    const products = await Product.find(filters).sort(sort);
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    console.error("Error in getProductDetails:", e); 
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// GET /api/shop/products/recommendations/:productId
// Simple rule-based content recommendation (no ML, no extra dependencies).
// Scoring: same category +2, same brand +1. Current product is excluded.
// Falls back to newest products when there are not enough scored matches.
const getProductRecommendations = async (req, res) => {
  try {
    const { productId } = req.params;
    const requestedLimit = parseInt(req.query.limit, 10);
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), 12)
      : 5;

    if (!productId || !productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID!",
      });
    }

    const currentProduct = await Product.findById(productId).lean();

    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    const others = await Product.find({
      _id: { $ne: currentProduct._id },
    }).lean();

    const scored = others.map((product) => {
      let score = 0;
      if (
        currentProduct.category &&
        product.category &&
        product.category === currentProduct.category
      ) {
        score += 2;
      }
      if (
        currentProduct.brand &&
        product.brand &&
        product.brand === currentProduct.brand
      ) {
        score += 1;
      }
      return { product, score };
    });

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const bTime = b.product.createdAt
        ? new Date(b.product.createdAt).getTime()
        : 0;
      const aTime = a.product.createdAt
        ? new Date(a.product.createdAt).getTime()
        : 0;
      return bTime - aTime;
    });

    const data = scored.slice(0, limit).map((entry) => entry.product);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (e) {
    console.error("Error in getProductRecommendations:", e);
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// GET /api/shop/products/sponsored?limit=8
// Sponsored products revenue stream: returns only actively sponsored
// products (isSponsored + no expiry or expiry in the future), newest first.
const getSponsoredProducts = async (req, res) => {
  try {
    const requestedLimit = parseInt(req.query.limit, 10);
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), 20)
      : 8;

    const now = new Date();
    const data = await Product.find({
      isSponsored: true,
      $or: [{ sponsoredUntil: null }, { sponsoredUntil: { $gt: now } }],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (e) {
    console.error("Error in getSponsoredProducts:", e);
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// POST /api/shop/products/:id/affiliate-click
// Affiliate referrals revenue stream: counts one outbound click to the
// partner shop. Only the counter is incremented - no user data is stored.
const trackAffiliateClick = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID!",
      });
    }

    const product = await Product.findOneAndUpdate(
      { _id: id, affiliateUrl: { $nin: ["", null] } },
      { $inc: { affiliateClicks: 1 } },
      { new: true }
    ).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or has no affiliate link!",
      });
    }

    return res.status(200).json({
      success: true,
      data: { affiliateClicks: product.affiliateClicks || 0 },
    });
  } catch (e) {
    console.error("Error in trackAffiliateClick:", e);
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails, getProductRecommendations, getSponsoredProducts, trackAffiliateClick };






// const Product = require('../../models/Product')

// const getFilteredProducts = async(req,res)=>{
//     try{

//         const products = await Product.find({})

//         res.status(200).json({
//             sucess:true,
//             data: products
//         })
       
//     }catch(e){
//         console.log(error);
//         res.status(500).json({
//             sucess:false,
//             message:'some error occured'

//         })
//     }
// }


// module.exports = {getFilteredProducts}





// const Product = require("../../models/Product");

// const getFilteredProducts = async (req, res) => {
//   try {
//     const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

//     let filters = {};

//     if (category.length) {
//       filters.category = { $in: category.split(",") };
//     }

//     if (brand.length) {
//       filters.brand = { $in: brand.split(",") };
//     }

//     let sort = {};

//     switch (sortBy) {
//       case "price-lowtohigh":
//         sort.price = 1;

//         break;
//       case "price-hightolow":
//         sort.price = -1;

//         break;
//       case "title-atoz":
//         sort.title = 1;

//         break;

//       case "title-ztoa":
//         sort.title = -1;

//         break;

//       default:
//         sort.price = 1;
//         break;
//     }

//     const products = await Product.find(filters).sort(sort);

//     res.status(200).json({
//       success: true,
//       data: products,
//     });
//   } catch (e) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured",
//     });
//   }
// };

// const getProductDetails = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findById(id);

//     if (!product)
//       return res.status(404).json({
//         success: false,
//         message: "Product not found!",
//       });

//     res.status(200).json({
//       success: true,
//       data: product,
//     });
//   } catch (e) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured",
//     });
//   }
// };

// module.exports = { getFilteredProducts, getProductDetails };













// const Product = require("../../models/Product");

// const getFilteredProducts = async (req, res) => {
//   try {
//     const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

//     let filters = {};

//     if (category.length) {
//       filters.category = { $in: category.split(",") };
//     }

//     if (brand.length) {
//       filters.brand = { $in: brand.split(",") };
//     }

//     let sort = {};

//     switch (sortBy) {
//       case "price-lowtohigh":
//         sort.price = 1;
//         break;
//       case "price-hightolow":
//         sort.price = -1;
//         break;
//       case "title-atoz":
//         sort.title = 1;
//         break;
//       case "title-ztoa":
//         sort.title = -1;
//         break;
//       default:
//         sort.price = 1;
//         break;
//     }

//     const products = await Product.find(filters).sort(sort);

//     res.status(200).json({
//       success: true,
//       data: products,
//     });
//   } catch (e) {
//     console.log(e); // Fixed the variable name from 'error' to 'e'
//     res.status(500).json({
//       success: false,
//       message: "Some error occurred",
//     });
//   }
// };

// const getProductDetails = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findById(id);

//     if (!product)
//       return res.status(404).json({
//         success: false,
//         message: "Product not found!",
//       });

//     res.status(200).json({
//       success: true,
//       data: product,
//     });
//   } catch (e) {
//     console.log(e); // Fixed the variable name from 'error' to 'e'
//     res.status(500).json({
//       success: false,
//       message: "Some error occurred",
//     });
//   }
// };

// module.exports = { getFilteredProducts, getProductDetails };











// const Product = require("../../models/Product");
// const mongoose = require("mongoose");

// const getFilteredProducts = async (req, res) => {
//   try {
//     const { category = "", brand = "", sortBy = "price-lowtohigh" } = req.query;

//     let filters = {};

//     if (category && category.trim().length) {
//       filters.category = { $in: category.split(",") };
//     }

//     if (brand && brand.trim().length) {
//       filters.brand = { $in: brand.split(",") };
//     }

//     let sort = {};
//     const validSortOptions = [
//       "price-lowtohigh",
//       "price-hightolow",
//       "title-atoz",
//       "title-ztoa",
//     ];

//     let sortingKey = sortBy;
//     if (!validSortOptions.includes(sortBy)) {
//       sortingKey = "price-lowtohigh";
//     }

//     switch (sortingKey) {
//       case "price-lowtohigh":
//         sort.price = 1;
//         break;
//       case "price-hightolow":
//         sort.price = -1;
//         break;
//       case "title-atoz":
//         sort.title = 1;
//         break;
//       case "title-ztoa":
//         sort.title = -1;
//         break;
//     }

//     const products = await Product.find(filters).sort(sort);

//     res.status(200).json({
//       success: true,
//       data: products,
//     });
//   } catch (e) {
//     console.error("Error fetching filtered products:", e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occurred",
//     });
//   }
// };

// const getProductDetails = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid product ID!",
//       });
//     }

//     const product = await Product.findById(id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found!",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: product,
//     });
//   } catch (e) {
//     console.error("Error fetching product details:", e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occurred",
//     });
//   }
// };

// module.exports = { getFilteredProducts, getProductDetails };









