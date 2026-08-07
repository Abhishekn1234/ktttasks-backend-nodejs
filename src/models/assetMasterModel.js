import { Sequelize,DataTypes } from "sequelize";
import db from "../config/db.js";
import AssetCategory from "./assetCategoryModel.js";
import AssetHistory from "./assetHistoryModel.js";

const AssetMaster = db.define(
  "assetMaster",
  {
    assetId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

  
    assetCode: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },

    assetName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

   
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    make: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    model: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    serialNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    purchaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    purchaseCost: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },

    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    vendor: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    warrantyExpiry: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "Available",
        "Assigned",
        "Maintenance",
        "Retired",
        "Scrapped"
      ),
      defaultValue: "Available",
    },

    scrapDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    scrapReason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "asset_master",
    timestamps: true,
  }
);

AssetMaster.belongsTo(AssetCategory, {
    foreignKey: "categoryId"
});
AssetCategory.hasMany(AssetMaster, {
    foreignKey: "categoryId"
});

AssetMaster.hasMany(AssetHistory, {
    foreignKey: "assetId",
    as: "history"
});
AssetHistory.belongsTo(AssetMaster, {
    foreignKey: "assetId",
    as: "asset"
});

export default AssetMaster;
