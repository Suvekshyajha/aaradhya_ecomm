import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE } from "@/lib/api";

const initialState = {
  isLoading: false,
  adList: [],
};

export const addNewAdvertisement = createAsyncThunk(
  "/ads/addNewAdvertisement",
  async (formData, { rejectWithValue }) => {
    try {
      const result = await axios.post(
        `${API_BASE}/api/admin/ads/add`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return result?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Unable to add the advertisement",
        }
      );
    }
  }
);

export const fetchAllAdvertisements = createAsyncThunk(
  "/ads/fetchAllAdvertisements",
  async () => {
    const result = await axios.get(
      `${API_BASE}/api/admin/ads/get`
    );

    return result?.data;
  }
);

export const editAdvertisement = createAsyncThunk(
  "/ads/editAdvertisement",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const result = await axios.put(
        `${API_BASE}/api/admin/ads/edit/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return result?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Unable to update the advertisement",
        }
      );
    }
  }
);

export const deleteAdvertisement = createAsyncThunk(
  "/ads/deleteAdvertisement",
  async (id) => {
    const result = await axios.delete(
      `${API_BASE}/api/admin/ads/delete/${id}`
    );

    return result?.data;
  }
);

const AdminAdsSlice = createSlice({
  name: "adminAds",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAdvertisements.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAdvertisements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adList = action.payload.data;
      })
      .addCase(fetchAllAdvertisements.rejected, (state) => {
        state.isLoading = false;
        state.adList = [];
      });
  },
});

export default AdminAdsSlice.reducer;
