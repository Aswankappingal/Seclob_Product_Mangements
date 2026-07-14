const Category = require('../Models/category.model');


//Add New Category
const AddCategory = async (req, res) => {
    try {
        const { category_name } = req.body;

        if (!category_name) {
            return res.status(400).json({ message: "Category name is required." });
        }

        const existingCategory = await Category.findOne({ category_name });
        if (existingCategory) {
            return res.status(409).json({ message: "Category already exists." });
        }

        const newCategory = new Category({ category_name });

        await newCategory.save();

        res.status(201).json({
            message: "Category added successfully.",
            category: newCategory,
        });
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};


//Fetch All categories
const GetAllCategories = async (req, res) => {
    try {
        const categories = await Category.find(); // Fetch all categories

        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: "No categories found." });
        }

        res.status(200).send(categories);
    } catch (error) {
        console.error("Error retrieving categories:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = { AddCategory,GetAllCategories };
