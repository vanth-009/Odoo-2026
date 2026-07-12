const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Company = sequelize.define("Company", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tier: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["Tier 1", "Tier 2", "Tier 3"]]
    }
  },
  companyData: {
    type: DataTypes.JSON,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "registered",
    validate: {
      isIn: [["registered", "active", "inactive"]]
    }
  }
}, {
  tableName: "companies",
  timestamps: true
});

module.exports = Company;
