import assetCategoryServices from "../services/assetCategoryServices.js";

const getAllCategories = async (req, res) => {
    try {
        const { search } = req.query;
        const categories = await assetCategoryServices.getAllCategories(search);
        res.render("assetsCategory/assetCategory", { categories });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await assetCategoryServices.getCategoryById(id);
        if (category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({ error: "Category not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createCategory = async (req, res) => {
    const categoryData = req.body;
    try {
        const newCategory = await assetCategoryServices.createCategory(categoryData);
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const categoryData = req.body;
    try {
        const updatedCategory = await assetCategoryServices.updateCategory(id, categoryData);
        if (updatedCategory) {
            res.status(200).json(updatedCategory);
        } else {
            res.status(404).json({ error: "Category not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCategory = await assetCategoryServices.deleteCategory(id);
        if (deletedCategory) {
            res.status(200).json({ message: "Category deleted successfully" });
        } else {
            res.status(404).json({ error: "Category not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export default {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
