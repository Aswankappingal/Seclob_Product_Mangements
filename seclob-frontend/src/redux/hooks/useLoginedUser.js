import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLoginedUser } from '../slices/loginedUserSlice';

const UseLoginedUser = () => {
  const dispatch = useDispatch();
  const loginedUser = useSelector((state) => state.loginedUser.loginedUser);
  const status = useSelector((state) => state.loginedUser.status);
  const error = useSelector((state) => state.loginedUser.error);
    
  const [isAuthTokenPresent, setIsAuthTokenPresent] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem('token');

    if (authToken) {
      setIsAuthTokenPresent(true);
      if (!loginedUser && status === 'idle') {
        dispatch(fetchLoginedUser())
          .unwrap()
          .catch((err) => {
            console.error('Failed to fetch logged-in user:', err);
          });
      }
    } else {
      setIsAuthTokenPresent(false);
      console.error('No authToken found, logging out...');
      localStorage.removeItem('token');
      // Redirect or handle as needed
    }
  }, [dispatch, loginedUser, status]);

  return { loginedUser, status, error, isAuthTokenPresent };
};

export default UseLoginedUser;
