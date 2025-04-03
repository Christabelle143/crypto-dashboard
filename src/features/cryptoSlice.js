import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';


export const fetchCryptos = createAsyncThunk('crypto/fetchCryptos', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState: {
    cryptos: [],
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCryptos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cryptos = action.payload;
      })
      .addCase(fetchCryptos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});


export default cryptoSlice.reducer;
