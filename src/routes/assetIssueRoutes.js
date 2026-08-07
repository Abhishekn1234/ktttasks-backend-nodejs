import express from 'express';
import assetIssueController from '../controllers/assetIssueController.js';

const router = express.Router();

router.get('/issues', assetIssueController.getAllIssues);
router.get('/issues/:id', assetIssueController.getIssueById);
router.post('/issues', assetIssueController.createIssue);
router.put('/issues/:id/return', assetIssueController.returnIssue);
router.delete('/issues/:id', assetIssueController.deleteIssue);

export default router;
