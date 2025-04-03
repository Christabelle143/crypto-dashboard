import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";

// Fetch cryptos only if data is not available or expired
export const fetchCryptos = createAsyncThunk(
  "crypto/fetchCryptos",
  async (_, { getState }) => {
    const { crypto } = getState();
    const cacheTime = 5 * 60 * 1000; 
    const currentTime = new Date().getTime();

    if (crypto.lastFetched && currentTime - crypto.lastFetched < cacheTime) {
      return crypto.cryptos; 
    }

    const response = await axios.get(API_URL);
    return { data: response.data, timestamp: currentTime };
  }
);

const cryptoSlice = createSlice({
  name: "crypto",
  initialState: {
    cryptos: [],
    favorites: [],
    searchQuery: "",
    sortOrder: "asc",
    status: "idle",
    error: null,
    lastFetched: null,
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const id = action.payload;
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter((fav) => fav !== id);
      } else {
        state.favorites.push(id);
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCryptos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cryptos = action.payload.data;
        state.lastFetched = action.payload.timestamp;
      })
      .addCase(fetchCryptos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { toggleFavorite, setSearchQuery, toggleSortOrder } = cryptoSlice.actions;
export default cryptoSlice.reducer;
