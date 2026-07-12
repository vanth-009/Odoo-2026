const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const PolicyAcknowledgement = sequelize.define("PolicyAcknowledgement", {
  acknowledgement_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  policy_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  version_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Pending" // e.g. Accepted, Pending
  },
  accepted_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: "policy_acknowledgements",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
});

module.exports = PolicyAcknowledgement;
