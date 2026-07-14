import { useDispatch, useSelector } from 'react-redux';
import { userSignin, clearError, selectSigninState } from '../slices/signInSlice';

const useLogin = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(selectSigninState);

  const login = (email, password) => {
    dispatch(userSignin({ email, password }));
  };

  const resetError = () => {
    dispatch(clearError());
  };

  return {
    user,
    loading,
    error,
    login,
    resetError,
  };
};

export default useLogin;
