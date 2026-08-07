import { Op } from 'sequelize';
import employeeMasterModel from '../models/employeeMasterModels.js';

const getAllEmployees = async (search) => {
    try {
        const where = search
            ? {
                  [Op.or]: [
                      { employeeName: { [Op.iLike]: `%${search}%` } },
                      { employeeEmail: { [Op.iLike]: `%${search}%` } },
                      { employeeDepartment: { [Op.iLike]: `%${search}%` } },
                      { employeeDesignation: { [Op.iLike]: `%${search}%` } },
                  ],
              }
            : {};

        const employees = await employeeMasterModel.findAll({ where });
        return employees;
    } catch (error) {
        throw new Error(`Error retrieving employees: ${error.message}`);
    }
};

const getEmployeeById = async (id) => {
    try {
        const employee = await employeeMasterModel.findByPk(id);
        return employee;
    } catch (error) {
        throw new Error(`Error retrieving employee with ID ${id}: ${error.message}`);
    }
};

const createEmployee = async (employeeData) => {
    try {
        const newEmployee = await employeeMasterModel.create(employeeData);
        return newEmployee;
    } catch (error) {
        throw new Error(`Error creating employee: ${error.message}`);
    }
};

const updateEmployee = async (id, employeeData) => {
    try {
        const employee = await employeeMasterModel.findByPk(id);
        if (!employee) {
            return null;
        }
        await employee.update(employeeData);
        return employee;
    } catch (error) {
        throw new Error(`Error updating employee with ID ${id}: ${error.message}`);
    }
};

const deleteEmployee = async (id) => {
    try {
        const employee = await employeeMasterModel.findByPk(id);
        if (!employee) {
            return false;
        }
        await employee.destroy();
        return true;
    } catch (error) {
        throw new Error(`Error deleting employee with ID ${id}: ${error.message}`);
    }
};

export default {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
};