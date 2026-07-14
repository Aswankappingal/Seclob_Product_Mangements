const SubCategory = require('../Models/subcategory.model');

const AddSubCategory = async (req, res) => {
    try {
        const { parent_category,sub_category_name } = req.body;

        if (!sub_category_name||!parent_category) {
            return res.status(400).json({ message: "Category name or Parent Id is required." });
        }

        const existingCategory = await SubCategory.findOne({ sub_category_name });
        if (existingCategory) {
            return res.status(409).json({ message: "Category already exists." });
        }

        const newCategory = new SubCategory({parent_category, sub_category_name });

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


const GetSubCategoriesByParent = async (req, res) => {
    try {
        const { parent_category } = req.params;

        if (!parent_category) {
            return res.status(400).json({ message: "Parent category ID is required." });
        }

        const subcategories = await SubCategory.find({ parent_category })
            .sort({ sub_category_name: 1 }); // Sort alphabetically by name

        if (!subcategories.length) {
            return res.status(404).json({ message: "No subcategories found for this parent category." });
        }

        res.status(200).send(subcategories);
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const GetAllSubCategories = async (req, res) => {
    try {
        const subcategories = await SubCategory.find()
            .sort({ sub_category_name: 1 }) // Sort alphabetically by name
            .populate('parent_category', 'category_name'); // Populate parent category details if needed

        if (!subcategories.length) {
            return res.status(404).json({ message: "No subcategories found." });
        }

        res.status(200).json(
            subcategories
        );
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = { 
    AddSubCategory,
    GetSubCategoriesByParent ,
    GetAllSubCategories
};
