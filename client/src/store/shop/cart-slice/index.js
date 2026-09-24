import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE } from "@/lib/api";

const initialState = {
  cartItems: [],
  isLoading: false,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE}/api/shop/cart/add`,
        {
          userId,
          productId,
          quantity,
        }
      );

      return response.data;
    } catch (error) {
      // e.g. "Only 2 left in stock for <product>" returned by the server
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Unable to add the item to the cart",
        }
      );
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId) => {
    const response = await axios.get(
      `${API_BASE}/api/shop/cart/get/${userId}`
    );

    return response.data;
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/shop/cart/${userId}/${productId}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Unable to remove the item from the cart",
        }
      );
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE}/api/shop/cart/update-cart`,
        {
          userId,
          productId,
          quantity,
        }
      );

      return response.data;
    } catch (error) {
      // e.g. "Only 3 left in stock for <product>" returned by the server
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Unable to update the cart item",
        }
      );
    }
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state) => {
        // Keep the cart that is already on screen - the server refused this change
        // (e.g. not enough stock), so emptying the list would be wrong
        state.isLoading = false;
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        // See addToCart.rejected - the previous cart state stays visible
        state.isLoading = false;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        // See addToCart.rejected - the previous cart state stays visible
        state.isLoading = false;
      });
  },
});

export default shoppingCartSlice.reducer;
