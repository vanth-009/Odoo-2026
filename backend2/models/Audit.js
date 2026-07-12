const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Audit = sequelize.define("Audit", {
  audit_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  audit_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  audit_type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["Internal", "External", "ESG", "Compliance"]]
    }
  },
  auditor_employee_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Scheduled",
    validate: {
      isIn: [["Scheduled", "Ongoing", "Completed", "Cancelled"]]
    }
  },
  score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: "audits",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
});

module.exports = Audit;
