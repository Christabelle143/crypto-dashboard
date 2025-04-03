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
    status: "idle",
    error: null,
    lastFetched: null,
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

export default cryptoSlice.reducer;
