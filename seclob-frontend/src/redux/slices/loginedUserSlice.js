import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import backendUrl from '../../backendUrl';

export const fetchLoginedUser = createAsyncThunk(
  'user/fetchLoginedUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${backendUrl}/artifitia/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
      
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
      }
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


const userSlice = createSlice({
  name: 'user',
  initialState: {
    loginedUser: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoginedUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLoginedUser.fulfilled, (state, action) => {
        state.loginedUser = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchLoginedUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch user';
      });
  },
});

export default userSlice.reducer;