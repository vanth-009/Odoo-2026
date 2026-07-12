const { sequelize } = require("../config/db");
const User = require("./User");
const Company = require("./Company");
const Document = require("./Document");
const Department = require("./Department");
const Employee = require("./Employee");
const Policy = require("./Policy");
const PolicyVersion = require("./PolicyVersion");
const PolicyAcknowledgement = require("./PolicyAcknowledgement");
const Audit = require("./Audit");
const AuditFinding = require("./AuditFinding");
const ComplianceIssue = require("./ComplianceIssue");
const Evidence = require("./Evidence");
const Notification = require("./Notification");

// Define Associations

// Document & Company
Document.belongsTo(Company, { foreignKey: "companyId", as: "company" });
Company.hasMany(Document, { foreignKey: "companyId" });

// Department & Employee
Employee.belongsTo(Department, { foreignKey: "department_id", as: "department" });
Department.hasMany(Employee, { foreignKey: "department_id" });

// Policy & PolicyVersion
PolicyVersion.belongsTo(Policy, { foreignKey: "policy_id", as: "policy" });
Policy.hasMany(PolicyVersion, { foreignKey: "policy_id" });

// Policy & Acknowledgement
PolicyAcknowledgement.belongsTo(Policy, { foreignKey: "policy_id", as: "policy" });
PolicyAcknowledgement.belongsTo(Employee, { foreignKey: "employee_id", as: "employee" });
Policy.hasMany(PolicyAcknowledgement, { foreignKey: "policy_id" });
Employee.hasMany(PolicyAcknowledgement, { foreignKey: "employee_id" });

// Audit
Audit.belongsTo(Department, { foreignKey: "department_id", as: "department" });
Audit.belongsTo(Employee, { foreignKey: "auditor_employee_id", as: "auditor" });
Audit.hasMany(AuditFinding, { foreignKey: "audit_id" });
AuditFinding.belongsTo(Audit, { foreignKey: "audit_id", as: "audit" });

// ComplianceIssue
ComplianceIssue.belongsTo(Audit, { foreignKey: "audit_id", as: "audit" });
ComplianceIssue.belongsTo(Department, { foreignKey: "department_id", as: "department" });
ComplianceIssue.belongsTo(Employee, { foreignKey: "owner_employee_id", as: "owner" });
ComplianceIssue.hasMany(Evidence, { foreignKey: "issue_id" });
Evidence.belongsTo(ComplianceIssue, { foreignKey: "issue_id", as: "issue" });

// Notification
Notification.belongsTo(Employee, { foreignKey: "employee_id", as: "employee" });

module.exports = {
  sequelize,
  User,
  Company,
  Document,
  Department,
  Employee,
  Policy,
  PolicyVersion,
  PolicyAcknowledgement,
  Audit,
  AuditFinding,
  ComplianceIssue,
  Evidence,
  Notification
};
