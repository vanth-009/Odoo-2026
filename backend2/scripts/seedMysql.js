const {
  User, Company, Document, Department, Employee, Policy, PolicyVersion,
  PolicyAcknowledgement, Audit, AuditFinding, ComplianceIssue, Evidence, Notification
} = require("../models");
const bcrypt = require("bcrypt");

async function seedMysql() {
  try {
    // Check if User table is seeded
    const userCount = await User.count();
    if (userCount > 0) {
      console.log("[Seeder] Database already has data. Skipping seeding.");
      return;
    }

    console.log("[Seeder] Seeding MySQL database with mock data...");

    // 1. Seed Users
    const hashedPassword = await bcrypt.hash("123456", 10);
    const adminUser = await User.create({
      email: "anilkumarjena4323@gmail.com",
      password: hashedPassword,
      role: "company_admin"
    });
    const secretaryUser = await User.create({
      email: "secretary@company.com",
      password: hashedPassword,
      role: "company_secretary"
    });

    // 2. Seed Companies (For existing app report functionality)
    const company1 = await Company.create({
      tier: "Tier 1",
      companyData: {
        companyName: "Acme Corporates",
        officialCompanyEmail: "contact@acme.com",
        pan: "ABCDE1234F",
        paidUpCapital: 5000000
      },
      status: "active"
    });
    const company2 = await Company.create({
      tier: "Tier 2",
      companyData: {
        companyName: "Stark Industries",
        officialCompanyEmail: "info@stark.com",
        pan: "STARK9876I",
        paidUpCapital: 10000000
      },
      status: "active"
    });

    // 3. Seed Documents (For existing app report functionality)
    const doc1 = await Document.create({
      companyId: company1.id,
      categoryId: "tds",
      title: "TDS Report Q1",
      docType: "report",
      fileName: "tds_q1.pdf",
      filePath: "/uploads/tds_q1.pdf",
      mimeType: "application/pdf",
      size: 1024,
      registeredAt: new Date(),
      uploadedAt: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      reminderSent: false
    });
    const doc2 = await Document.create({
      companyId: company2.id,
      categoryId: "compliance-status",
      title: "Compliance Status Q1",
      docType: "compliance",
      fileName: "compliance_status_q1.pdf",
      filePath: "/uploads/compliance_status_q1.pdf",
      mimeType: "application/pdf",
      size: 2048,
      registeredAt: new Date(),
      uploadedAt: new Date(),
      expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days expired
      reminderSent: true
    });

    // 4. Seed Departments
    const deptOps = await Department.create({
      department_name: "Operations",
      department_code: "OPS",
      employee_count: 15,
      status: "Active"
    });
    const deptComp = await Department.create({
      department_name: "Compliance",
      department_code: "COMP",
      employee_count: 5,
      status: "Active"
    });
    const deptESG = await Department.create({
      department_name: "ESG Committee",
      department_code: "ESG",
      employee_count: 8,
      status: "Active"
    });

    // 5. Seed Employees
    const empHead = await Employee.create({
      employee_code: "EMP001",
      name: "Amit Kumar",
      email: "amit@company.com",
      designation: "Chief Compliance Officer",
      department_id: deptComp.department_id,
      joining_date: "2022-01-15",
      status: "Active"
    });
    // Set head of compliance department
    await deptComp.update({ head_employee_id: empHead.employee_id });

    const empRahul = await Employee.create({
      employee_code: "EMP002",
      name: "Rahul Sharma",
      email: "rahul@company.com",
      designation: "Operations Manager",
      department_id: deptOps.department_id,
      manager_id: empHead.employee_id,
      joining_date: "2023-06-01",
      status: "Active"
    });

    const empPriya = await Employee.create({
      employee_code: "EMP003",
      name: "Priya Patel",
      email: "priya@company.com",
      designation: "ESG Lead",
      department_id: deptESG.department_id,
      manager_id: empHead.employee_id,
      joining_date: "2024-03-10",
      status: "Active"
    });

    // 6. Seed ESG Policies
    const policyCode = await Policy.create({
      policy_name: "Code of Conduct",
      category: "Social/Governance",
      description: "Standards of ethical behavior, conflict of interest, and business integrity.",
      version: "2.1",
      effective_date: "2026-01-01",
      owner_department_id: deptComp.department_id,
      owner_employee_id: empHead.employee_id,
      document_url: "/uploads/policies/code_of_conduct_v2.1.pdf",
      status: "Active",
      created_by: "System"
    });

    const policyEnv = await Policy.create({
      policy_name: "Environmental Policy",
      category: "Environmental",
      description: "Guidelines on carbon footprint reduction, waste management, and energy efficiency.",
      version: "1.2",
      effective_date: "2025-09-15",
      owner_department_id: deptESG.department_id,
      owner_employee_id: empPriya.employee_id,
      document_url: "/uploads/policies/environmental_policy_v1.2.pdf",
      status: "Active",
      created_by: "System"
    });

    // 7. Seed Policy Versions
    await PolicyVersion.create({
      policy_id: policyCode.policy_id,
      version_number: "1.0",
      document_url: "/uploads/policies/code_of_conduct_v1.0.pdf",
      change_summary: "Initial release",
      effective_date: "2024-01-01",
      uploaded_by: "Admin"
    });
    await PolicyVersion.create({
      policy_id: policyCode.policy_id,
      version_number: "2.0",
      document_url: "/uploads/policies/code_of_conduct_v2.0.pdf",
      change_summary: "Updated compliance helpline details",
      effective_date: "2025-01-01",
      uploaded_by: "Admin"
    });
    await PolicyVersion.create({
      policy_id: policyCode.policy_id,
      version_number: "2.1",
      document_url: "/uploads/policies/code_of_conduct_v2.1.pdf",
      change_summary: "Minor wording amendments",
      effective_date: "2026-01-01",
      uploaded_by: "Admin"
    });

    // 8. Seed Policy Acknowledgements
    await PolicyAcknowledgement.create({
      policy_id: policyCode.policy_id,
      employee_id: empRahul.employee_id,
      version_number: "2.1",
      status: "Accepted",
      accepted_at: new Date(),
      ip_address: "192.168.1.50",
      remarks: "Fully agreed to the conduct terms."
    });

    await PolicyAcknowledgement.create({
      policy_id: policyEnv.policy_id,
      employee_id: empRahul.employee_id,
      version_number: "1.2",
      status: "Pending",
      remarks: "Requires review of recycling guidelines."
    });

    // 9. Seed Audits
    const audit1 = await Audit.create({
      audit_name: "Annual ESG Compliance Audit 2026",
      department_id: deptESG.department_id,
      audit_type: "ESG",
      auditor_employee_id: empHead.employee_id,
      start_date: "2026-06-01",
      end_date: "2026-06-15",
      status: "Completed",
      score: 88.50,
      remarks: "Overall good compliance, few minor gaps in carbon offsetting logs.",
      created_by: "System"
    });

    const audit2 = await Audit.create({
      audit_name: "Operations Safety & Quality Check Q2",
      department_id: deptOps.department_id,
      audit_type: "Compliance",
      auditor_employee_id: empHead.employee_id,
      start_date: "2026-07-01",
      status: "Ongoing",
      created_by: "System"
    });

    // 10. Seed Audit Findings
    const finding1 = await AuditFinding.create({
      audit_id: audit1.audit_id,
      title: "Missing Carbon Offsetting Logs",
      description: "Offset logs for logistics segment of Q1 2026 are incomplete.",
      severity: "Medium",
      status: "Open"
    });

    const finding2 = await AuditFinding.create({
      audit_id: audit2.audit_id,
      title: "Fire Extinguishers Expired",
      description: "Three fire extinguishers on Floor 2 warehouse have passed their expiry date.",
      severity: "High",
      status: "Open"
    });

    // 11. Seed Compliance Issues
    const issue1 = await ComplianceIssue.create({
      audit_id: audit2.audit_id,
      department_id: deptOps.department_id,
      owner_employee_id: empRahul.employee_id,
      title: "Fire Extinguishers Replacement",
      description: "Procure and replace the expired fire extinguishers in Warehouse block B.",
      severity: "High",
      due_date: "2026-07-25",
      status: "In Progress"
    });

    const issue2 = await ComplianceIssue.create({
      audit_id: audit1.audit_id,
      department_id: deptESG.department_id,
      owner_employee_id: empPriya.employee_id,
      title: "Carbon Offset Logging",
      description: "Log off-site carbon footprint parameters into the central repository.",
      severity: "Medium",
      due_date: "2026-08-15",
      status: "Open"
    });

    // 12. Seed Evidence
    await Evidence.create({
      issue_id: issue1.issue_id,
      uploaded_by: "Rahul Sharma",
      file_url: "/uploads/evidence/warehouse_extinguisher_quote.pdf",
      file_type: "application/pdf"
    });

    // 13. Seed Notifications
    await Notification.create({
      employee_id: empRahul.employee_id,
      title: "Policy Acknowledgement Due",
      message: "Please read and acknowledge the Environmental Policy version 1.2.",
      type: "Policy Reminder",
      reference_type: "Policy",
      reference_id: policyEnv.policy_id,
      is_read: false
    });

    await Notification.create({
      employee_id: empRahul.employee_id,
      title: "New Compliance Issue Assigned",
      message: "You have been assigned: Fire Extinguishers Replacement. Due by 25 Jul 2026.",
      type: "Issue Assigned",
      reference_type: "ComplianceIssue",
      reference_id: issue1.issue_id,
      is_read: false
    });

    console.log("[Seeder] MySQL seeder executed successfully.");
  } catch (error) {
    console.error("[Seeder] Error during MySQL seeding:", error.message);
  }
}

module.exports = { seedMysql };
