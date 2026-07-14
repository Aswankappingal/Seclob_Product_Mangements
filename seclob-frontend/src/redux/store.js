import { configureStore } from '@reduxjs/toolkit';
import userSignupReducer from './slices/signUpSlice';
import userSigninReducer from './slices/signInSlice';
import logginedUserReducer from './slices/loginedUserSlice';
import addCategoryReducer from './slices/HomePageSlices/addCategorySlice'
import fetchAllCategoryReducer from './slices/HomePageSlices/ftechCategorySlice'
import fetchSubCategoryRducer from './slices/HomePageSlices/fetchSubCategorySlice';
import fetchAllSubcategoryRducer from './slices/HomePageSlices/fetchAllSubCategorySlice';
import addSubCategoryReducer from './slices/HomePageSlices/addSubCategory';
import AllProductsReducer from './slices/HomePageSlices/fetchAllProductSlice';
import productDetailsReducer from './slices/productDetailsSlice/ProductDetailsSlice';


export const store = configureStore({
  reducer: {
    // signup
    userSignup: userSignupReducer,
    //signin
    userSignin: userSigninReducer,
    //fetch logined used details 
    loginedUser: logginedUserReducer, 
    //add category
    category: addCategoryReducer, 
    //Fetch All category
    fethCategory:fetchAllCategoryReducer,
    //add sub category
    addSubCategory:addSubCategoryReducer,
    //fetch sub category using parent_category_id
    fetchSubcategory:fetchSubCategoryRducer,
    //fetch all sub categorys
    subCategories:fetchAllSubcategoryRducer,
    //fetch all products
    fetchAllProducts:AllProductsReducer,
    //fetch products details
    productInnerDetails:productDetailsReducer

  },
});
