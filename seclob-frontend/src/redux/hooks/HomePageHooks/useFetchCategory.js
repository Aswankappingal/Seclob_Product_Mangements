import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../../slices/HomePageSlices/ftechCategorySlice';

const useFetchCategories = () => {
  const dispatch = useDispatch();

  // Select data, status, and error from the Redux state
  const categories = useSelector((state) => state.fethCategory.data);
  const status = useSelector((state) => state.fethCategory.status);
  const error = useSelector((state) => state.fethCategory.error);

  // Initial fetch when the status is 'idle'
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories()).catch((err) => {
        console.error('Failed to fetch categories:', err);
      });
    }
  }, [status, dispatch]);

  // Function to refetch categories on demand
  const refetchCategories = async () => {
    try {
      await dispatch(fetchCategories());
    } catch (err) {
      console.error('Failed to refetch categories:', err);
    }
  };

  return { categories, status, error, refetchCategories };
};

export default useFetchCategories;
