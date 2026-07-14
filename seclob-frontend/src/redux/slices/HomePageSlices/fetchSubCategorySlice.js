import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import backendUrl from '../../../backendUrl';

export const fetchSubcategory = createAsyncThunk(
  'subcategory/fetchSubcategory',
  async (parent_category) => {
    const response = await axios.get(`${backendUrl}/artifitia/fetch-sub-category/${parent_category}`);
    return response.data;
  }
);

const fetchSubCategorySlice = createSlice({
  name: 'subCategory',
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
      .addCase(fetchSubcategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSubcategory.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchSubcategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default fetchSubCategorySlice.reducer;
export const { fetchSuccess } = fetchSubCategorySlice.actions;
