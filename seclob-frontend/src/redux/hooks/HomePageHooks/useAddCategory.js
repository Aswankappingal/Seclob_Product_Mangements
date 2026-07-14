import { useDispatch, useSelector } from 'react-redux';
import { addCategory, clearMessages } from '../../slices/HomePageSlices/addCategorySlice';
import { useEffect } from 'react';

const useAddCategory = () => {
    const dispatch = useDispatch();
    const { loading, error, successMessage } = useSelector((state) => state.category);

    const handleAddCategory = async (categoryName) => {
        const categoryData = { category_name: categoryName };
        const resultAction = await dispatch(addCategory(categoryData));
        
        if (addCategory.fulfilled.match(resultAction)) {
            return resultAction.payload;
        } else {
            throw resultAction.payload;
        }
    };

    useEffect(() => {
        if (successMessage || error) {
            const timer = setTimeout(() => {
                dispatch(clearMessages());
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [successMessage, error, dispatch]);

    return { loading, error, successMessage, handleAddCategory };
};

export default useAddCategory;
