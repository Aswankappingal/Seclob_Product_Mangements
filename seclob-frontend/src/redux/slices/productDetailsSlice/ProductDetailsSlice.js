import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import backendUrl from '../../../backendUrl';

export const fetchProductDetails = createAsyncThunk(
  'productDetails/fetchProductDetails', 
  async (id) => {
    const response = await fetch(`${backendUrl}/artifitia/fetch-product-details/${id}`);
    return response.json();
  }
);

const productDetailsSlice = createSlice({
  name: 'productDetails', 
  initialState: {
    data: null, 
    status: 'idle',
    error: null,
  },
  reducers: {
    fetchSuccess: (state, action) => {
      state.data = action.payload;
      state.status = 'succeeded';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productDetailsSlice.reducer;
export const { fetchSuccess } = productDetailsSlice.actions;