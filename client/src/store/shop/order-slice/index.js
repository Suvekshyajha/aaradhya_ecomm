import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE } from "@/lib/api";

const initialState = {
  esewaPayment: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE}/api/shop/order/create`,
        orderData
      );

      return response.data;
    } catch (error) {
      // Surface the validation message coming from the server (price/stock checks)
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Unable to place the order. Please try again.",
        }
      );
    }
  }
);

export const verifyEsewaPayment = createAsyncThunk(
  "/order/verifyEsewaPayment",
  async ({ orderId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE}/api/shop/order/verify`,
        {
          orderId,
          data,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Payment could not be confirmed. Please contact support.",
        }
      );
    }
  }
);

export const mockConfirmEsewaPayment = createAsyncThunk(
  "/order/mockConfirmEsewaPayment",
  async ({ orderId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE}/api/shop/order/mock-confirm`,
        { orderId }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Mock payment failed. Please try again.",
        }
      );
    }
  }
);

export const cancelPayment = createAsyncThunk(
  "/order/cancelPayment",
  async ({ orderId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE}/api/shop/order/payment-cancel`,
        { orderId }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Unable to cancel the payment",
        }
      );
    }
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId) => {
    const response = await axios.get(
      `${API_BASE}/api/shop/order/list/${userId}`
    );

    return response.data;
  }
);

export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id) => {
    const response = await axios.get(
      `${API_BASE}/api/shop/order/details/${id}`
    );

    return response.data;
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.esewaPayment = action.payload.esewaUrl
          ? {
              esewaUrl: action.payload.esewaUrl,
              esewaParams: action.payload.esewaParams,
            }
          : null;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.esewaPayment = null;
        state.orderId = null;
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;




































// import{ createAsyncThunk, createSlice} from '@reduxjs/toolkit'
//  const initialState = {
//   approvalURL : null,
//   isLoading: false,
//   orderId: null
//  }

//  export const createNewOrder = createAsyncThunk('/order/createNewOrder', async(orderData)=>{
//   const response = await axios.post(
//     `${API_BASE}/api/shop/order/create`,
//     orderData
//   );

//   return response.data;


//  })

//  const shoppingOrderSlice =createSlice({
//   name:'shoppingOrderSlice',
//   initialState,
//   reducers:{},
//   extraReducers: (builder) => {

//     builder
//     .addCase(createNewOrder.pending, (state) => {
//       state.isLoading = true;
//     })

//     .addCase(createNewOrder.fulfilled, (state, action) => {
//       state.isLoading = false;
//       state.approvalURL = action.payload.approvalURL;
//       state.orderId = action.payload.orderId;

//     })

//     .addCase(createNewOrder.rejected, (state) => {
//       state.isLoading = false;

//       state.approvalURL = null
// state.orderId= null
//     })



//   }
    
    
      
  
//  })

//  export default shoppingOrderSlice.reducer;





// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios'; // Add this import

// const initialState = {
//   approvalURL: null,
//   isLoading: false,
//   orderId: null,
// };

// export const createNewOrder = createAsyncThunk('/order/createNewOrder', async (orderData) => {
//   const response = await axios.post(
//     `${API_BASE}/api/shop/order/create`,
//     orderData
//   );

//   return response.data;
// });

// const shoppingOrderSlice = createSlice({
//   name: 'shoppingOrderSlice',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(createNewOrder.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(createNewOrder.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.approvalURL = action.payload.approvalURL;
//         state.orderId = action.payload.orderId;
//       })
//       .addCase(createNewOrder.rejected, (state) => {
//         state.isLoading = false;
//         state.approvalURL = null;
//         state.orderId = null;
//       });
//   },
// });

// export default shoppingOrderSlice.reducer;
