const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const bcrypt = require("bcrypt");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["company_admin", "company_secretary"]]
    }
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  otpExpire: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: "users",
  timestamps: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.changed("password")) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

module.exports = User;
