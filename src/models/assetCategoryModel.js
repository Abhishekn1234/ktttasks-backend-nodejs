import { DataTypes } from "sequelize";
import db from "../config/db.js";

const AssetCategory = db.define(
  "assetCategory",
  {
    categoryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    categoryName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    categoryDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "asset_categories",
    timestamps: true,
  }
);

export default AssetCategory;