const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Document = sequelize.define("Document", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reportId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  formName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  docType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["compliance", "report"]]
    }
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  registeredAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  uploadedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  reminderSent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  reminderAttempts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  lastReminderAttemptAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  lastReminderError: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: "documents",
  timestamps: true,
  hooks: {
    beforeSave: async (doc) => {
      if (doc.docType === "report" && !doc.reportId) {
        try {
          const { Op } = require("sequelize");
          const latest = await sequelize.models.Document.findOne({
            where: {
              docType: "report",
              reportId: {
                [Op.like]: "rpt-%"
              }
            },
            order: [["id", "DESC"]]
          });
          let nextSequence = 1;
          if (latest && latest.reportId) {
            const match = /^rpt-(\d+)$/.exec(latest.reportId);
            if (match) {
              nextSequence = parseInt(match[1], 10) + 1;
            }
          }
          doc.reportId = `rpt-${String(nextSequence).padStart(3, "0")}`;
        } catch (error) {
          console.error("Error in assignReportId hook:", error.message);
        }
      }
    }
  }
});

module.exports = Document;
