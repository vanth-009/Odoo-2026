const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const PolicyVersion = sequelize.define("PolicyVersion", {
  version_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  policy_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  version_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  document_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  change_summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  effective_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  uploaded_by: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: "policy_versions",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false
});

module.exports = PolicyVersion;
