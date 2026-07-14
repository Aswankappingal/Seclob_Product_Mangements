import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import backendUrl from '../../../backendUrl';

export const fetchAllSubCategories = createAsyncThunk(
  'subcategory/fetchSubCategories',
  async () => {
    const response = await fetch(`${backendUrl}/artifitia/fetch-all-sub-category`);
    return response.json();
  }
);

const fetchAllSubcategorySlice = createSlice({
  name: 'subCategory',
  initialState: {
    data: [],
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
      .addCase(fetchAllSubCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllSubCategories.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchAllSubCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default fetchAllSubcategorySlice.reducer;
export const { fetchSuccess } = fetchAllSubcategorySlice.actions;