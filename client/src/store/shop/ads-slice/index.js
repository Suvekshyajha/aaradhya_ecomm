import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE } from "@/lib/api";

const initialState = {
  isLoading: false,
  ads: [],
};

export const fetchActiveAdvertisements = createAsyncThunk(
  "/ads/fetchActiveAdvertisements",
  async (placement) => {
    const query = placement ? `?placement=${placement}` : "";
    const result = await axios.get(
      `${API_BASE}/api/shop/ads/active${query}`
    );

    return result?.data;
  }
);

const shopAdsSlice = createSlice({
  name: "shopAds",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveAdvertisements.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchActiveAdvertisements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ads = action.payload?.data || [];
      })
      .addCase(fetchActiveAdvertisements.rejected, (state) => {
        state.isLoading = false;
        state.ads = [];
      });
  },
});

export default shopAdsSlice.reducer;
