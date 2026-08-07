import { Op } from "sequelize";
import assetCategoryModel from "../models/assetCategoryModel.js";

const getAllCategories = async (search) => {
    try {
        const where = search
            ? {
                  [Op.or]: [
                      { categoryName: { [Op.iLike]: `%${search}%` } },
                      { categoryDescription: { [Op.iLike]: `%${search}%` } },
                  ],
              }
            : {};

        const categories = await assetCategoryModel.findAll({ where });
        return categories;
    } catch (error) {
        throw new Error(`Error retrieving categories: ${error.message}`);
    }
};

const getCategoryById = async (id) => {
    try {
        const category = await assetCategoryModel.findByPk(id);
        return category;
    } catch (error) {
        throw new Error(`Error retrieving category with ID ${id}: ${error.message}`);
    }
};

const createCategory = async (categoryData) => {
    try {
        const newCategory = await assetCategoryModel.create(categoryData);
        return newCategory;
    } catch (error) {
        throw new Error(`Error creating category: ${error.message}`);
    }
};

const updateCategory = async (id, categoryData) => {
    try {
        const category = await assetCategoryModel.findByPk(id);
        if (!category) {
            return null;
        }
        await category.update(categoryData);
        return category;
    } catch (error) {
        throw new Error(`Error updating category with ID ${id}: ${error.message}`);
    }
};

const deleteCategory = async (id) => {
    try {
        const category = await assetCategoryModel.findByPk(id);
        if (!category) {
            return false;
        }
        await category.destroy();
        return true;
    } catch (error) {
        throw new Error(`Error deleting category with ID ${id}: ${error.message}`);
    }
};

export default {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
