const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Employee = sequelize.define("Employee", {
  employee_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  employee_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  manager_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  joining_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Active"
  }
}, {
  tableName: "employees",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
});

module.exports = Employee;
