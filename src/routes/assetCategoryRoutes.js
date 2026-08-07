import express from "express";
import assetCategoryController from "../controllers/assetCategoryController.js";

const router = express.Router();

router.get("/categories", assetCategoryController.getAllCategories);
router.get("/categories/:id", assetCategoryController.getCategoryById);
router.post("/categories", assetCategoryController.createCategory);
router.put("/categories/:id", assetCategoryController.updateCategory);
router.delete("/categories/:id", assetCategoryController.deleteCategory);

export default router;
