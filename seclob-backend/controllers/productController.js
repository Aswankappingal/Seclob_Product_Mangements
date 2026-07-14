const Product = require('../Models/product.model'); 

const addProduct = async (req, res) => {
  try {
    const {
      title,
      code,
      variants,
      subcategory,
      description,
      images,
    } = req.body;
    console.log(req.body);
    
    if (!title || !code || !subcategory  || !description || !images || !variants) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!Array.isArray(images) || !Array.isArray(variants)) {
      return res.status(400).json({ error: 'Images and variants must be arrays' });
    }

    const newProduct = new Product({
      title,
      code,
      variants,
      subcategory,
      description,
      images,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: 'Product added successfully',
      product: savedProduct,
    });
  } catch (error) {
    console.error('Error adding product:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'An error occurred while adding the product' });
  }
};


const getAllProducts = async (req, res) => {
    try {
      const products = await Product.find(); // Retrieve all products from the database
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'An error occurred while fetching products' });
    }
  };

  const getProductById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate the ID
      if (!id) {
        return res.status(400).json({ error: 'Product ID is required' });
      }
  
      // Find the product by its ID
      const product = await Product.findById(id);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json(product);
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      res.status(500).json({ error: 'An error occurred while fetching the product' });
    }
  };
  
  // Update Product
const updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, code, variants, subcategory, description, images } = req.body;
  
      // Validate the incoming data
      if (!id) {
        return res.status(400).json({ error: 'Product ID is required' });
      }
  
      if (!title || !code || !subcategory || !description || !images || !variants) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      if (!Array.isArray(images) || !Array.isArray(variants)) {
        return res.status(400).json({ error: 'Images and variants must be arrays' });
      }
  
      // Find and update the product by its ID
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { title, code, variants, subcategory, description, images },
        { new: true, runValidators: true } // Ensure the returned document is the updated one and validate the update
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json({
        message: 'Product updated successfully',
        product: updatedProduct,
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'An error occurred while updating the product' });
    }
  };
module.exports = {
  addProduct,getAllProducts,getProductById,updateProduct
};
