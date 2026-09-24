
import { API_BASE } from "@/lib/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  addressList: [],
};

export const addNewAddress = createAsyncThunk(
  "/addresses/addNewAddress",
  async (formData, { rejectWithValue }) => {
    try {
      console.log("addNewAddress: Sending request with formData:", formData);
      if (!formData.userId) {
        console.error("addNewAddress: userId is missing in formData");
        return rejectWithValue("userId is missing in formData");
      }
      const response = await axios.post(
        `${API_BASE}/api/shop/address/add`,
        formData,
        {
          headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
          },
        }
      );
      console.log("addNewAddress: Response received:", response.data);
      return response.data;
    } catch (error) {
      console.error("addNewAddress: Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAllAddresses = createAsyncThunk(
  "/addresses/fetchAllAddresses",
  async (userId, { rejectWithValue }) => {
    try {
      console.log("fetchAllAddresses: Sending request for userId:", userId);
      if (!userId) {
        console.error("fetchAllAddresses: userId is missing");
        return rejectWithValue("userId is missing");
      }
      const response = await axios.get(
        `${API_BASE}/api/shop/address/get/${userId}`,
        {
          headers: {
            "Cache-Control": "no-cache",
          },
          params: {
            _t: new Date().getTime(),
          },
        }
      );
      console.log("fetchAllAddresses: Response received:", response.data);
      return response.data;
    } catch (error) {
      console.error("fetchAllAddresses: Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const editAddress = createAsyncThunk(
  "/addresses/editAddress",
  async ({ userId, addressId, formData }, { rejectWithValue }) => {
    try {
      console.log("editAddress: Sending request for userId:", userId, "addressId:", addressId);
      const response = await axios.put(
        `${API_BASE}/api/shop/address/update/${userId}/${addressId}`,
        formData,
        {
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );
      console.log("editAddress: Response received:", response.data);
      return response.data;
    } catch (error) {
      console.error("editAddress: Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async ({ userId, addressId }, { rejectWithValue }) => {
    try {
      console.log("deleteAddress: Sending request for userId:", userId, "addressId:", addressId);
      if (!userId || !addressId) {
        console.error("deleteAddress: userId or addressId is missing");
        return rejectWithValue("userId or addressId is missing");
      }
      const response = await axios.delete(
        `${API_BASE}/api/shop/address/delete/${userId}/${addressId}`,
        {
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );
      console.log("deleteAddress: Response received:", response.data);
      return response.data;
    } catch (error) {
      console.error("deleteAddress: Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.success && action.payload?.address) {
          state.addressList.push(action.payload.address);
        }
      })
      .addCase(addNewAddress.rejected, (state, action) => {
        state.isLoading = false;
        console.error("addNewAddress rejected:", action.payload);
      })
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload?.data || [];
      })
      .addCase(fetchAllAddresses.rejected, (state, action) => {
        state.isLoading = false;
        console.error("fetchAllAddresses rejected:", action.payload);
      })
      .addCase(editAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editAddress.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(editAddress.rejected, (state, action) => {
        state.isLoading = false;
        console.error("editAddress rejected:", action.payload);
      })
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAddress.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isLoading = false;
        console.error("deleteAddress rejected:", action.payload);
      });
  },
});

export default addressSlice.reducer;
