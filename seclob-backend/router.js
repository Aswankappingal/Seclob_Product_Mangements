const express = require('express');
const router = express.Router();
const { createUser,loginUser,toggleWishlist } = require('./controllers/userController');
const { AddCategory,GetAllCategories } = require('./controllers/categoryController');
const { AddSubCategory,GetSubCategoriesByParent,GetAllSubCategories} = require('./controllers/subCategoryController');
const { addProduct,getAllProducts,getProductById,updateProduct} = require('./controllers/productController');
const auth = require('./middleware/auth');

//post
router.post('/user-signup', createUser);
router.post('/user-login', loginUser);
router.post('/add-sub-category', AddSubCategory);
router.post('/add-category', AddCategory);
router.post('/add-product', addProduct);
router.post('/wishlist/toggle', auth, toggleWishlist);

//update
router.patch('/update-product/:id', updateProduct);


//get
router.get('/profile', auth, async (req, res) => {
    try {
        const User = require('./Models/user.model');
        const user = await User.findById(req.user._id).populate('wishlist');
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/fetch-all-category', GetAllCategories);
router.get('/fetch-sub-category/:parent_category', GetSubCategoriesByParent);
router.get('/fetch-all-sub-category', GetAllSubCategories);
router.get('/fetch-all-products', getAllProducts);
router.get('/fetch-product-details/:id', getProductById);


module.exports = router;
