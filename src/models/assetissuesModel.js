import { DataTypes } from "sequelize";
import db from "../config/db.js";

const AssetIssue = db.define(
  "assetIssue",
  {
    issueId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    assetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    issueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    returnDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    returnReason: {
      type: DataTypes.ENUM(
        "Upgrade",
        "Repair",
        "Resignation",
        "Replacement",
        "Other"
      ),
      allowNull: true,
    },

    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("Issued", "Returned"),
      defaultValue: "Issued",
    },
  },
  {
    tableName: "asset_issues",
    timestamps: true,
  }
);

export default AssetIssue;