// import { configureStore } from "@reduxjs/toolkit";
// import  authReducer from './auth-slice';
// import adminProductsSlice from "./admin/products-slice"
// import shopProductsSlice from "./shop/products-slice"
// import shopAddressSlice from "./shop/address-slice"
// import shopCartSlice from "./shop/cart-slice";

// import shopSearchSlice from "./shop/search-slice";


// const store = configureStore({
//     reducer: {
//         auth: authReducer,
//         adminProducts: adminProductsSlice,
//         shopProducts: shopProductsSlice,
//         shopCart: shopCartSlice,
//         shopAddress : shopAddressSlice,
//         shopSearch: shopSearchSlice,
        

//     },
// });

// export default store;


import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/order-slice";
import adminAdsSlice from "./admin/ads-slice";


import shopProductsSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import shopSearchSlice from "./shop/search-slice";
import shopAdsSlice from "./shop/ads-slice";
import commonFeatureSlice from "./common-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,

    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,
    adminAds: adminAdsSlice,

    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    shopAds: shopAdsSlice,
    

    commonFeature: commonFeatureSlice,
  },
});

export default store;