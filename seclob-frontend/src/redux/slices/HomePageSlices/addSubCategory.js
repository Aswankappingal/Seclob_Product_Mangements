import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import backendUrl from '../../../backendUrl';


export const addSubCategory = createAsyncThunk(
  'subcategory/addSubCategory',
  async (newSubCategory, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendUrl}/artifitia/add-sub-category`, newSubCategory);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

const subCategorySlice = createSlice({
  name: 'subCategory',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addSubCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addSubCategory.fulfilled, (state, action) => {
        state.data.push(action.payload); 
        state.status = 'succeeded';
      })
      .addCase(addSubCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearError } = subCategorySlice.actions;

export default subCategorySlice.reducer;
