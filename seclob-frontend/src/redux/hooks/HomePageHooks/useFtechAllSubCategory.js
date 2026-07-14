import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllSubCategories } from '../../slices/HomePageSlices/fetchAllSubCategorySlice';

const useFtechAllSubCategory = () => {
  const dispatch = useDispatch();

  const subCategories = useSelector((state) => state.subCategories.data);
  const status = useSelector((state) => state.subCategories.status);
  const error = useSelector((state) => state.subCategories.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllSubCategories()).catch((err) => {
        console.error('Failed to fetch categories:', err);
      });
    }
  }, [status, dispatch]);

  // Function to refetch categories on demand
  const refetchSubCategories = async () => {
    try {
      await dispatch(fetchAllSubCategories());
    } catch (err) {
      console.error('Failed to refetch categories:', err);
    }
  };

  return { subCategories, status, error, refetchSubCategories };
};

export default useFtechAllSubCategory;
