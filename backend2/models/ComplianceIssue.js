const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ComplianceIssue = sequelize.define("ComplianceIssue", {
  issue_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  audit_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  owner_employee_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  severity: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Medium",
    validate: {
      isIn: [["Low", "Medium", "High", "Critical"]]
    }
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Open",
    validate: {
      isIn: [["Open", "In Progress", "Resolved", "Closed"]]
    }
  },
  resolution: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  closed_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: "compliance_issues",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
});

module.exports = ComplianceIssue;
