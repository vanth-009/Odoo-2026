const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const AuditFinding = sequelize.define("AuditFinding", {
  finding_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  audit_id: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Open"
  },
  evidence_url: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: "audit_findings",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
});

module.exports = AuditFinding;
