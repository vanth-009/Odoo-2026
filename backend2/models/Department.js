const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Department = sequelize.define("Department", {
  department_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  department_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  head_employee_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  parent_department_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  employee_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Active"
  }
}, {
  tableName: "departments",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
});

module.exports = Department;
