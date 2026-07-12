const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Evidence = sequelize.define("Evidence", {
  evidence_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  issue_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  uploaded_by: {
    type: DataTypes.STRING,
    allowNull: true
  },
  file_url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file_type: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: "evidence",
  timestamps: true,
  createdAt: "uploaded_at",
  updatedAt: false
});

module.exports = Evidence;
