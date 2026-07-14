const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
  ram: { type: String, required: true },
  price: { type: String, required: true },
  QTY: { type: String, required: true },
});

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true },
  variants: [VariantSchema], // Embedded array of variants
  subcategory: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true }, // Array of image URLs
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
