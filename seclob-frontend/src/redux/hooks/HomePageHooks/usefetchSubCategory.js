import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSubcategory } from '../../slices/HomePageSlices/fetchSubCategorySlice';
import { useParams } from 'react-router-dom';

const useFetchSubCategory = () => {
  const dispatch = useDispatch();
  const { parent_category } = useParams();
  const subcategories = useSelector((state) => state.fetchSubcategory.data);
  const status = useSelector((state) => state.fetchSubcategory.status);
  const error = useSelector((state) => state.fetchSubcategory.error);

  useEffect(() => {
    if (!parent_category) return;

    if (status === 'idle') {
      dispatch(fetchSubcategory(parent_category))
        .catch((err) => {
          console.error('Failed to fetch subcategories:', err);
        });
    }
  }, [parent_category, status, dispatch]);

  return { subcategories, status, error };
};

export default useFetchSubCategory;