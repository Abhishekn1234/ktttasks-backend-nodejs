import { Op } from 'sequelize';
import AssetIssue from '../models/assetissuesModel.js';
import employeeMasterModel from '../models/employeeMasterModels.js';
import assetMasterModel from '../models/assetMasterModel.js';
import assetHistoryServices from './assetHistoryServices.js';

const enrichIssue = async (issue) => {
  const employee = await employeeMasterModel.findByPk(issue.employeeId);
  const asset = await assetMasterModel.findByPk(issue.assetId);

  return {
    ...issue.toJSON(),
    employeeName: employee?.employeeName || '-',
    employeeEmail: employee?.employeeEmail || '-',
    assetName: asset?.assetName || '-',
    assetCode: asset?.assetCode || '-',
  };
};

const getAllIssues = async (search) => {
  try {
    const where = search
      ? {
          [Op.or]: [
            { status: { [Op.iLike]: `%${search}%` } },
            { remarks: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const issues = await AssetIssue.findAll({
      where,
      order: [['issueDate', 'DESC']],
    });

    return Promise.all(issues.map((issue) => enrichIssue(issue)));
  } catch (error) {
    throw new Error(`Error retrieving issue records: ${error.message}`);
  }
};

const getIssueById = async (id) => {
  try {
    const issue = await AssetIssue.findByPk(id);
    if (!issue) {
      return null;
    }
    return enrichIssue(issue);
  } catch (error) {
    throw new Error(`Error retrieving issue record with ID ${id}: ${error.message}`);
  }
};

const createIssue = async (issueData) => {
  try {
    const existingIssue = await AssetIssue.findOne({
      where: { assetId: issueData.assetId, status: 'Issued' },
    });

    if (existingIssue) {
      throw new Error('This asset is already issued to another employee.');
    }

    const asset = await assetMasterModel.findByPk(issueData.assetId);
    if (!asset) {
      throw new Error('Selected asset not found.');
    }

    if (asset.status !== 'Available') {
      throw new Error('Selected asset is not available for issue.');
    }

    const newIssue = await AssetIssue.create({
      ...issueData,
      status: 'Issued',
    });

    await asset.update({ status: 'Assigned' });

    const employee = await employeeMasterModel.findByPk(issueData.employeeId);
    await assetHistoryServices.logEvent(
      asset.assetId,
      'Issued',
      `Asset issued to ${employee?.employeeName || `employee #${issueData.employeeId}`} on ${newIssue.issueDate}.`
    );

    return newIssue;
  } catch (error) {
    throw new Error(`Error creating issue record: ${error.message}`);
  }
};

const returnIssue = async (id, payload) => {
  try {
    const issue = await AssetIssue.findByPk(id);
    if (!issue) {
      return null;
    }

    const updatedIssue = await issue.update({
      returnDate: payload.returnDate || new Date(),
      returnReason: payload.returnReason || null,
      remarks: payload.remarks || issue.remarks,
      status: 'Returned',
    });

    const asset = await assetMasterModel.findByPk(issue.assetId);
    if (asset) {
      await asset.update({ status: 'Available' });
    }

    await assetHistoryServices.logEvent(
      issue.assetId,
      'Returned',
      `Asset returned on ${updatedIssue.returnDate || new Date().toISOString().substring(0, 10)}${payload.returnReason ? ` (${payload.returnReason})` : ''}.`
    );

    return updatedIssue;
  } catch (error) {
    throw new Error(`Error returning asset issue with ID ${id}: ${error.message}`);
  }
};

const deleteIssue = async (id) => {
  try {
    const issue = await AssetIssue.findByPk(id);
    if (!issue) {
      return false;
    }

    await issue.destroy();
    return true;
  } catch (error) {
    throw new Error(`Error deleting issue record with ID ${id}: ${error.message}`);
  }
};

const getIssueFormData = async () => {
  try {
    const employees = await employeeMasterModel.findAll({
      where: { employeeStatus: 'Active' },
      order: [['employeeName', 'ASC']],
    });

    const assets = await assetMasterModel.findAll({
      where: { status: 'Available' },
      order: [['assetName', 'ASC']],
    });

    return { employees, assets };
  } catch (error) {
    throw new Error(`Error retrieving issue form data: ${error.message}`);
  }
};

export default {
  getAllIssues,
  getIssueById,
  createIssue,
  returnIssue,
  deleteIssue,
  getIssueFormData,
};
