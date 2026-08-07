import employeeMasterServices from '../services/employeeMasterServices.js';

const getAllEmployees = async (req, res) => {
    try {
        const { search } = req.query;
        const employees = await employeeMasterServices.getAllEmployees(search);
        res.render('employeeMaster/employeeMaster', { employees });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await employeeMasterServices.getEmployeeById(id);
        if (employee) {
            res.status(200).json(employee);
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createEmployee = async (req, res) => {
    const employeeData = req.body;
    try {
        const newEmployee = await employeeMasterServices.createEmployee(employeeData);
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const employeeData = req.body;
    try {
        const updatedEmployee = await employeeMasterServices.updateEmployee(id, employeeData);
        if (updatedEmployee) {
            res.status(200).json(updatedEmployee);
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedEmployee = await employeeMasterServices.deleteEmployee(id);
        if (deletedEmployee) {
            res.status(200).json({ message: 'Employee deleted successfully' });
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export default {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
};