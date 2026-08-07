import { DataTypes } from "sequelize";
import db from "../config/db.js";

const AssetHistory = db.define(
  "assetHistory",
  {
    historyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    assetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    eventType: {
      type: DataTypes.ENUM(
        "Created",
        "Issued",
        "Returned",
        "Updated",
        "Scrapped"
      ),
      allowNull: false,
    },

    eventDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    eventDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "asset_history",
    timestamps: true,
  }
);

export default AssetHistory;

