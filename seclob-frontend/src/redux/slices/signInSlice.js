import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import backendUrl from '../../backendUrl';

export const userSignin = createAsyncThunk(
  'user/signin',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendUrl}/artifitia/user-login`, userData);
      // Save token or other data to localStorage if needed
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'An error occurred. Please try again.';
      return rejectWithValue(message);
    }
  }
);

const userSigninSlice = createSlice({
  name: 'userSignin',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    signOut: (state) => {
      state.user = null;
      localStorage.removeItem('token'); // Clear token on sign-out
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userSignin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userSignin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(userSignin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, signOut } = userSigninSlice.actions;

export const selectSigninState = (state) => state.userSignin;

export default userSigninSlice.reducer;
