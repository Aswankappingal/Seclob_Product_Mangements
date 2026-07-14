// src/hooks/useUserSignup.js
import { useDispatch, useSelector } from 'react-redux';
import { userSignup, clearError, selectSignupState } from '../slices/signUpSlice';

const useUserSignup = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(selectSignupState);

  const signup = async (userData) => {
    await dispatch(userSignup(userData));
  };

  const clearSignupError = () => {
    dispatch(clearError());
  };

  return { user, loading, error, signup, clearSignupError };
};

export default useUserSignup;
