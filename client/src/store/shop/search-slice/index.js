import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE } from "@/lib/api";

const initialState = {
  isLoading: false,
  searchResults: [],
};

export const getSearchResults = createAsyncThunk(
  "/order/getSearchResults",
  async (keyword) => {
    const response = await axios.get(
      `${API_BASE}/api/shop/search/${keyword}`
    );

    return response.data;
  }
);

const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data;
      })
      .addCase(getSearchResults.rejected, (state) => {
        state.isLoading = false;
        state.searchResults = [];
      });
  },
});

export const { resetSearchResults } = searchSlice.actions;

export default searchSlice.reducer;

// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const initialState = {
//   isLoading: false,
//   searchResults: [],
//   error: null
// };

// // Update to support both query params and URL params
// export const getSearchResults = createAsyncThunk(
//   "/shop/getSearchResults",
//   async (keyword, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_BASE}/api/shop/search/${encodeURIComponent(keyword)}`
//       );
      
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Error searching products"
//       );
//     }
//   }
// );

// const searchSlice = createSlice({
//   name: "shopSearch",
//   initialState,
//   reducers: {
//     resetSearchResults: (state) => {
//       state.searchResults = [];
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(getSearchResults.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(getSearchResults.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.searchResults = action.payload.data;
//         state.error = null;
//       })
//       .addCase(getSearchResults.rejected, (state, action) => {
//         state.isLoading = false;
//         state.searchResults = [];
//         state.error = action.payload || "Failed to search products";
//       });
//   },
// });

// export const { resetSearchResults } = searchSlice.actions;

// export default searchSlice.reducer;








