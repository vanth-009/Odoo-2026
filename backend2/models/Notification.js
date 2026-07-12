const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Notification = sequelize.define("Notification", {
  notification_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["Policy Reminder", "Audit Assigned", "Issue Assigned", "Issue Overdue", "Badge Earned"]]
    }
  },
  reference_type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reference_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: "notifications",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false
});

module.exports = Notification;
