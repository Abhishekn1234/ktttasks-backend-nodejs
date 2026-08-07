import express from 'express';
import employeeMasterController from '../controllers/employeeMasterController.js';
import assetMasterController from '../controllers/assetMasterController.js';
import assetCategoryController from '../controllers/assetCategoryController.js';
import assetIssueController from '../controllers/assetIssueController.js';
import assetCategoryServices from '../services/assetCategoryServices.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/employeeMaster', employeeMasterController.getAllEmployees);
router.get('/employeeMaster/add', (req, res) => {
  res.render('employeeMaster/employeeMasteradd');
});
router.get('/employeeMaster/edit/:id', (req, res) => {
  const { id } = req.params;
  res.render('employeeMaster/employeeMasteredit', { employeeId: id });
});
router.get('/employeeMaster/view/:id', (req, res) => {
  const { id } = req.params;
  res.render('employeeMaster/employeeMasterviewbyid', { employeeId: id });
});

router.get('/assetsMaster', assetMasterController.getAllAssets);
router.get('/stock/view', assetMasterController.getAssetBasedOnStatus);
router.get('/assetsMaster/add', async (req, res) => {
  const categories = await assetCategoryServices.getAllCategories();
  res.render('assetsMaster/assetMasteradd', { categories });
});
router.get('/assetsMaster/edit/:id', async (req, res) => {
  const { id } = req.params;
  const categories = await assetCategoryServices.getAllCategories();
  res.render('assetsMaster/assetMasteredit', { assetId: id, categories });
});
router.get('/assetsMaster/view/:id', (req, res) => {
  const { id } = req.params;
  res.render('assetsMaster/assetMasterviewbyid', { assetId: id });
});
router.get('/assetsMaster/scrap/:id', assetMasterController.showScrapAssetPage);
router.get('/assetsMaster/reports', assetMasterController.getScrappedAssets);
router.get('/assetsMaster/history/:id', assetMasterController.getAssetHistory);

router.get('/assetsCategory', assetCategoryController.getAllCategories);
router.get('/assetsCategory/add', (req, res) => {
  res.render('assetsCategory/assetCategoryadd');
});
router.get('/assetsCategory/edit/:id', (req, res) => {
  const { id } = req.params;
  res.render('assetsCategory/assetCategoryedit', { categoryId: id });
});
router.get('/assetsCategory/view/:id', (req, res) => {
  const { id } = req.params;
  res.render('assetsCategory/assetCategoryviewbyid', { categoryId: id });
});

router.get('/assetIssues', assetIssueController.getAllIssues);
router.get('/assetIssues/add', assetIssueController.showCreateIssuePage);
router.get('/assetIssues/return/:id', assetIssueController.showReturnIssuePage);
router.get('/assetIssues/view/:id', assetIssueController.getIssueById);

export default router;
