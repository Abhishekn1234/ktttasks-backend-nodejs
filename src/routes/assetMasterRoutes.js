import assetMasterController from "../controllers/assetMasterController.js";
import express from "express";
const router = express.Router();

router.get("/assets", assetMasterController.getAllAssets);
router.get("/assets/status", assetMasterController.getAssetBasedonStatus);
router.get("/assets/scrapped", assetMasterController.getScrappedAssets);
router.get("/assets/:id", assetMasterController.getAssetById);
router.get("/assets/:id/history", assetMasterController.getAssetHistory);
router.post("/assets", assetMasterController.createAsset);
router.post("/assets/:id/scrap", assetMasterController.scrapAsset);
router.put("/assets/:id", assetMasterController.updateAsset);
router.delete("/assets/:id", assetMasterController.deleteAsset);
export default router;
