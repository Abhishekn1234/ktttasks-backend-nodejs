import express from 'express';
import employeeMasterController from '../controllers/employeeMasterController.js';
const router = express.Router();
router.get('/employees', employeeMasterController.getAllEmployees);
router.get('/employees/:id', employeeMasterController.getEmployeeById);
router.post('/employees', employeeMasterController.createEmployee);
router.put('/employees/:id', employeeMasterController.updateEmployee);
router.delete('/employees/:id', employeeMasterController.deleteEmployee);
export default router;