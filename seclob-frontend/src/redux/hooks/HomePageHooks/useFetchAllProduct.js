import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllProducts } from '../../slices/HomePageSlices/fetchAllProductSlice';

const useFetchAllProduct = () => {
  const dispatch = useDispatch();
  const AllProducts = useSelector((state) => state.fetchAllProducts.data);
  const status = useSelector((state) => state.fetchAllProducts.status);
  const error = useSelector((state) => state.fetchAllProducts.error);

  // Fetch products when the component mounts or status is 'idle'
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllProducts())
        .unwrap()
        .catch((err) => {
          console.error('Failed to fetch AllProducts:', err);
        });
    }
  }, [status, dispatch]);

  // Refetch function to manually fetch products
  const refetch = useCallback(() => {
    dispatch(fetchAllProducts())
      .unwrap()
      .catch((err) => {
        console.error('Failed to refetch AllProducts:', err);
      });
  }, [dispatch]);

  return { AllProducts, status, error, refetch };
};

export default useFetchAllProduct;
