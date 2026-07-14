import { useDispatch, useSelector } from 'react-redux';
import { addSubCategory, clearError } from '../../slices/HomePageSlices/addCategorySlice';

const useAddSubCategory = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.addSubCategory);

  const submitSubCategory = async (newSubCategory) => {
    await dispatch(addSubCategory(newSubCategory));
  };

  const clearApiError = () => {
    dispatch(clearError());
  };

  return {
    status,
    error,
    submitSubCategory,
    clearApiError,
  };
};

export default useAddSubCategory;
