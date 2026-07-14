import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductDetails } from '../../slices/productDetailsSlice/ProductDetailsSlice';
import { useParams } from 'react-router-dom';

const useProductInnerDetails = () => {
    const dispatch = useDispatch();
    const { productId } = useParams();
    const productInnerDetails = useSelector((state) => state.productInnerDetails.data);
    const status = useSelector((state) => state.productInnerDetails.status);
    const error = useSelector((state) => state.productInnerDetails.error);
  
    const refetch = useCallback(() => {
      if (!productId) return;
      return dispatch(fetchProductDetails(productId)).catch((err) => {
        console.error('Failed to fetch product details:', err);
      });
    }, [productId, dispatch]);

    useEffect(() => {
      refetch();
    }, [refetch]);
  
    return { productInnerDetails, status, error, refetch };
};

export default useProductInnerDetails;