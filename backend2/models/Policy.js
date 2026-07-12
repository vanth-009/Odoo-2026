const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Policy = sequelize.define("Policy", {
  policy_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  policy_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  version: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "1.0"
  },
  effective_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  expiry_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  owner_department_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  owner_employee_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  document_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Active"
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: "esg_policies",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
});

module.exports = Policy;
