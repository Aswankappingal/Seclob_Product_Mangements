import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import backendUrl from '../../../backendUrl';

export const addCategory = createAsyncThunk(
    'category/addCategory',
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${backendUrl}/artifitia/add-category`, categoryData);
            console.log(response.data);

            return response.data;
            
        } catch (error) {
            // Check if the error response is related to an existing category
            if (error.response && error.response.status === 409) {
                return rejectWithValue('Category already exists');
            }
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        categories: [],
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(addCategory.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.successMessage = null;
        })
        .addCase(addCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = action.payload.message;
            state.categories.push(action.payload.category);
        })
        .addCase(addCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Something went wrong';
        });
    },
});

export const { clearMessages } = categorySlice.actions;

export default categorySlice.reducer;
