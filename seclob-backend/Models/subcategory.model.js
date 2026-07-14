const mongoose = require('mongoose')

const subCategorySchema = new mongoose.Schema({
    parent_category: { type: String },
    sub_category_name: { type: String },

}, { timestamps: true });

module.exports = mongoose.model("sub_categories", subCategorySchema)