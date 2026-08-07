import { Op } from "sequelize";
import assetMasterModel from "../models/assetMasterModel.js";
import assetCategoryModel from "../models/assetCategoryModel.js";
import assetHistoryServices from "./assetHistoryServices.js";

const normalizeDateValue = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return null;
    }

    const isoMatch = /^\d{4}-\d{2}-\d{2}$/.exec(trimmedValue);
    if (isoMatch) {
      return trimmedValue;
    }

    const parsedDate = new Date(trimmedValue);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new Error(`${fieldName} must be a valid date.`);
    }

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const parsedDate = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`${fieldName} must be a valid date.`);
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const sanitizeStringValue = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();
    return trimmedValue || null;
  }

  return value;
};

const validateAssetPayload = (assetData, { requireRequiredFields = true } = {}) => {
  const payload = { ...assetData };
  const errors = [];

  const requiredFields = ["assetCode", "assetName", "categoryId", "make", "model", "serialNumber"];

  requiredFields.forEach((fieldName) => {
    const value = sanitizeStringValue(payload[fieldName]);
    if (requireRequiredFields && !value) {
      errors.push(`${fieldName.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase())} is required.`);
    }
    payload[fieldName] = value;
  });

  if (payload.categoryId !== undefined && payload.categoryId !== null && payload.categoryId !== "") {
    const categoryId = Number(payload.categoryId);
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      errors.push("Please select a valid category.");
    } else {
      payload.categoryId = categoryId;
    }
  }

  if (payload.purchaseCost !== undefined && payload.purchaseCost !== null && payload.purchaseCost !== "") {
    const parsedCost = Number(payload.purchaseCost);
    if (Number.isNaN(parsedCost) || parsedCost < 0) {
      errors.push("Purchase cost must be a non-negative number.");
    } else {
      payload.purchaseCost = parsedCost;
    }
  } else if (payload.purchaseCost === "") {
    payload.purchaseCost = null;
  }

  try {
    payload.purchaseDate = normalizeDateValue(payload.purchaseDate, "Purchase date");
    payload.warrantyExpiry = normalizeDateValue(payload.warrantyExpiry, "Warranty expiry");
  } catch (error) {
    errors.push(error.message);
  }

  if (payload.purchaseDate && payload.warrantyExpiry && payload.warrantyExpiry < payload.purchaseDate) {
    errors.push("Warranty expiry date cannot be earlier than purchase date.");
  }

  if (errors.length) {
    throw new Error(errors.join(" "));
  }

  return payload;
};

const validateScrapPayload = (payload) => {
  const scrapPayload = { ...payload };
  const errors = [];

  try {
    scrapPayload.scrapDate = normalizeDateValue(scrapPayload.scrapDate, "Scrap date");
  } catch (error) {
    errors.push(error.message);
  }

  const scrapReason = sanitizeStringValue(scrapPayload.scrapReason);
  if (!scrapReason) {
    errors.push("Scrap reason is required.");
  }
  scrapPayload.scrapReason = scrapReason;

  if (!scrapPayload.scrapDate) {
    errors.push("Scrap date is required.");
  }

  if (errors.length) {
    throw new Error(errors.join(" "));
  }

  return scrapPayload;
};

const getAllAssets = async (search) => {
  const where = {
    status: { [Op.ne]: "Scrapped" },
    ...(search
      ? {
          [Op.or]: [
            { assetName: { [Op.iLike]: `%${search}%` } },
            { assetCode: { [Op.iLike]: `%${search}%` } },
            { make: { [Op.iLike]: `%${search}%` } },
            { model: { [Op.iLike]: `%${search}%` } },
            { serialNumber: { [Op.iLike]: `%${search}%` } },
            { location: { [Op.iLike]: `%${search}%` } },
            { vendor: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {}),
  };

  try {
    const assets = await assetMasterModel.findAll({
      where,
      include: [{ model: assetCategoryModel, attributes: ["categoryName"] }],
      order: [["assetName", "ASC"]],
    });
    return assets;
  } catch (error) {
    throw new Error(`Error retrieving assets: ${error.message}`);
  }
};

const getAssetById = async (id) => {
  try {
    const asset = await assetMasterModel.findByPk(id, {
      include: [{ model: assetCategoryModel, attributes: ["categoryName"] }],
    });
    return asset;
  } catch (error) {
    throw new Error(`Error retrieving asset with ID ${id}: ${error.message}`);
  }
};

const createAsset = async (assetData) => {
  try {
    const normalizedAsset = validateAssetPayload(assetData, { requireRequiredFields: true });
    const newAsset = await assetMasterModel.create(normalizedAsset);
    await assetHistoryServices.logEvent(
      newAsset.assetId,
      "Created",
      `Asset "${newAsset.assetName}" (${newAsset.assetCode}) was added to inventory${newAsset.purchaseDate ? ` with purchase date ${newAsset.purchaseDate}` : ""}.`
    );
    return newAsset;
  } catch (error) {
    throw new Error(`Error creating asset: ${error.message}`);
  }
};

const getAssetsByStatus = async (status) => {
  try {
    const where = status
      ? { status }
      : { status: { [Op.ne]: "Scrapped" } };

    if (!status) {
      where.status = { [Op.ne]: "Scrapped" };
    }

    return await assetMasterModel.findAll({
      where,
      include: [{ model: assetCategoryModel, attributes: ["categoryName"] }],
      order: [["assetName", "ASC"]],
    });
  } catch (error) {
    throw new Error(`Error retrieving assets by status: ${error.message}`);
  }
};

const getAssetBasedonStatus = async (status) => {
  return getAssetsByStatus(status);
};

const getScrappedAssets = async () => {
  try {
    return await assetMasterModel.findAll({
      where: { status: "Scrapped" },
      include: [{ model: assetCategoryModel, attributes: ["categoryName"] }],
      order: [["assetName", "ASC"]],
    });
  } catch (error) {
    throw new Error(`Error retrieving scrapped assets: ${error.message}`);
  }
};

const scrapAsset = async (id, payload) => {
  try {
    const asset = await assetMasterModel.findByPk(id);
    if (!asset) {
      return null;
    }
    if (asset.status === "Scrapped") {
      throw new Error("This asset has already been scrapped.");
    }

    const normalizedPayload = validateScrapPayload(payload);
    await asset.update({
      status: "Scrapped",
      scrapDate: normalizedPayload.scrapDate,
      scrapReason: normalizedPayload.scrapReason,
    });

    await assetHistoryServices.logEvent(
      asset.assetId,
      "Scrapped",
      `Asset was scrapped on ${normalizedPayload.scrapDate}. Reason: ${normalizedPayload.scrapReason}.`
    );

    return asset;
  } catch (error) {
    throw new Error(`Error scrapping asset with ID ${id}: ${error.message}`);
  }
};

const updateAsset = async (id, assetData) => {
  try {
    const asset = await assetMasterModel.findByPk(id);
    if (!asset) {
      return null;
    }
    if (asset.status === "Scrapped") {
      throw new Error("Scrapped assets cannot be edited. Use the scrap workflow or contact admin.");
    }
    if (assetData.status === "Scrapped") {
      throw new Error("Please use the dedicated Scrap action to mark an asset as scrapped.");
    }

    const normalizedAsset = validateAssetPayload(assetData, { requireRequiredFields: true });
    await asset.update(normalizedAsset);
    await assetHistoryServices.logEvent(
      asset.assetId,
      "Updated",
      `Asset details were updated (${new Date().toLocaleString()}).`
    );
    return asset;
  } catch (error) {
    throw new Error(`Error updating asset with ID ${id}: ${error.message}`);
  }
};

const deleteAsset = async (id) => {
  try {
    const asset = await assetMasterModel.findByPk(id);
    if (!asset) {
      return false;
    }
    await asset.destroy();
    return true;
  } catch (error) {
    throw new Error(`Error deleting asset with ID ${id}: ${error.message}`);
  }
};

export default {
  getAllAssets,
  getAssetById,
  getAssetsByStatus,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetBasedonStatus,
  getScrappedAssets,
  scrapAsset,
};
