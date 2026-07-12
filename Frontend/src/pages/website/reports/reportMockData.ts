export interface GovernanceSummaryRow {
  id: string;
  department: string;
  complianceScore: string;
  totalPolicies: number;
  activeAudits: number;
  openIssues: number;
  status: string;
  employee: string;
  date: string;
}

export interface PolicyReportRow {
  id: string;
  name: string;
  category: string;
  version: string;
  lastUpdated: string;
  status: 'Active' | 'Under Review' | 'Draft' | 'Expired';
  department: string;
  employee: string;
  date: string;
}

export interface PolicyAcknowledgementRow {
  id: string;
  employee: string;
  department: string;
  policyName: string;
  acknowledgedDate: string;
  version: string;
  status: 'Acknowledged' | 'Pending';
  date: string;
}

export interface AuditReportRow {
  id: string;
  name: string;
  scope: string;
  auditor: string;
  targetDate: string;
  status: 'Completed' | 'In Progress' | 'Scheduled';
  auditScore: string;
  department: string;
  employee: string;
  date: string;
}

export interface ComplianceIssueRow {
  id: string;
  title: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  dueDate: string;
  status: 'Open' | 'Resolved' | 'Overdue';
  department: string;
  employee: string;
  date: string;
}

export interface EmployeeGovernanceRow {
  id: string;
  employee: string;
  department: string;
  email: string;
  policiesCount: number;
  openIssues: number;
  status: string;
  date: string;
}

export const mockGovernanceSummary: GovernanceSummaryRow[] = [
  { id: 'gov-001', department: 'HR', complianceScore: '95%', totalPolicies: 6, activeAudits: 2, openIssues: 1, status: 'Active', employee: 'Anita Das', date: '2026-03-01' },
  { id: 'gov-002', department: 'Finance', complianceScore: '98%', totalPolicies: 6, activeAudits: 1, openIssues: 0, status: 'Active', employee: 'Rohit Kumar', date: '2026-03-05' },
  { id: 'gov-003', department: 'Manufacturing', complianceScore: '84%', totalPolicies: 4, activeAudits: 3, openIssues: 2, status: 'Under Review', employee: 'Meera Singh', date: '2026-02-28' },
  { id: 'gov-004', department: 'IT', complianceScore: '100%', totalPolicies: 6, activeAudits: 1, openIssues: 0, status: 'Active', employee: 'Rahul Jain', date: '2026-03-02' },
  { id: 'gov-005', department: 'Operations', complianceScore: '90%', totalPolicies: 5, activeAudits: 2, openIssues: 1, status: 'Active', employee: 'Vikram Sen', date: '2026-03-04' },
];

export const mockPolicyReport: PolicyReportRow[] = [
  { id: 'pol-001', name: 'Code of Conduct & Ethics', category: 'Ethical', version: 'v2.1', lastUpdated: '2026-01-10', status: 'Active', department: 'HR', employee: 'Anita Das', date: '2026-01-10' },
  { id: 'pol-002', name: 'Environmental Policy', category: 'Environment', version: 'v1.4', lastUpdated: '2026-02-15', status: 'Active', department: 'Operations', employee: 'Vikram Sen', date: '2026-02-15' },
  { id: 'pol-003', name: 'Whistleblower Protection Policy', category: 'Governance', version: 'v2.0', lastUpdated: '2025-11-20', status: 'Active', department: 'Finance', employee: 'Rohit Kumar', date: '2025-11-20' },
  { id: 'pol-004', name: 'Data Privacy & Security', category: 'Security', version: 'v3.0', lastUpdated: '2026-03-01', status: 'Active', department: 'IT', employee: 'Rahul Jain', date: '2026-03-01' },
  { id: 'pol-005', name: 'Equal Opportunity Policy', category: 'Social', version: 'v1.1', lastUpdated: '2025-09-05', status: 'Active', department: 'HR', employee: 'Anita Das', date: '2025-09-05' },
  { id: 'pol-006', name: 'Anti-Bribery Framework', category: 'Governance', version: 'v1.0', lastUpdated: '2026-03-05', status: 'Draft', department: 'Finance', employee: 'Rohit Kumar', date: '2026-03-05' },
  { id: 'pol-007', name: 'Travel Expense Policy', category: 'General', version: 'v1.2', lastUpdated: '2024-05-12', status: 'Expired', department: 'Finance', employee: 'Rohit Kumar', date: '2024-05-12' },
];

export const mockPolicyAcknowledgement: PolicyAcknowledgementRow[] = [
  { id: 'ack-001', employee: 'Anita Das', department: 'HR', policyName: 'Code of Conduct & Ethics', acknowledgedDate: '2026-01-12', version: 'v2.1', status: 'Acknowledged', date: '2026-01-12' },
  { id: 'ack-002', employee: 'Rohit Kumar', department: 'Finance', policyName: 'Whistleblower Protection', acknowledgedDate: '2025-11-21', version: 'v2.0', status: 'Acknowledged', date: '2025-11-21' },
  { id: 'ack-003', employee: 'Meera Singh', department: 'Manufacturing', policyName: 'Environmental Policy', acknowledgedDate: '', version: 'v1.4', status: 'Pending', date: '' },
  { id: 'ack-004', employee: 'Rahul Jain', department: 'IT', policyName: 'Data Privacy & Security', acknowledgedDate: '2026-03-02', version: 'v3.0', status: 'Acknowledged', date: '2026-03-02' },
  { id: 'ack-005', employee: 'Vikram Sen', department: 'Operations', policyName: 'Environmental Policy', acknowledgedDate: '2026-02-18', version: 'v1.4', status: 'Acknowledged', date: '2026-02-18' },
];

export const mockAuditReport: AuditReportRow[] = [
  { id: 'aud-001', name: 'Q1 Financial & Tax Audit', scope: 'Financial/TDS', auditor: 'H&R Block Advisory', targetDate: '2026-03-10', status: 'In Progress', auditScore: 'N/A', department: 'Finance', employee: 'Rohit Kumar', date: '2026-03-10' },
  { id: 'aud-002', name: 'Environmental Impact Assessment', scope: 'ESG / Environmental', auditor: 'GreenGen Auditors LLC', targetDate: '2026-02-28', status: 'Completed', auditScore: '92%', department: 'Operations', employee: 'Vikram Sen', date: '2026-02-28' },
  { id: 'aud-003', name: 'Annual SOC 2 Type II Audit', scope: 'Security/Privacy', auditor: 'Deloitte Compliance', targetDate: '2026-01-15', status: 'Completed', auditScore: '98%', department: 'IT', employee: 'Rahul Jain', date: '2026-01-15' },
  { id: 'aud-004', name: 'Internal Secretarial Audit', scope: 'Secretarial (ROC MCA)', auditor: 'K. Patel & Associates', targetDate: '2026-03-24', status: 'Scheduled', auditScore: 'N/A', department: 'Finance', employee: 'Rohit Kumar', date: '2026-03-24' },
];

export const mockComplianceIssues: ComplianceIssueRow[] = [
  { id: 'iss-001', title: 'ROC Form MGT-7 Pending Submission', category: 'Corporate (ROC)', severity: 'High', dueDate: '2026-03-31', status: 'Open', department: 'Finance', employee: 'Rohit Kumar', date: '2026-03-31' },
  { id: 'iss-002', title: 'Hazardous Waste Annual Return Overdue', category: 'Environmental', severity: 'Critical', dueDate: '2026-01-31', status: 'Overdue', department: 'Operations', employee: 'Vikram Sen', date: '2026-01-31' },
  { id: 'iss-003', title: 'EPF ECR Submission Delay', category: 'Labor & HR', severity: 'Medium', dueDate: '2026-03-15', status: 'Open', department: 'HR', employee: 'Anita Das', date: '2026-03-15' },
  { id: 'iss-004', title: 'Minor Server Access Log Alert', category: 'Security', severity: 'Low', dueDate: '2026-02-10', status: 'Resolved', department: 'IT', employee: 'Rahul Jain', date: '2026-02-10' },
];

export const mockEmployeeGovernance: EmployeeGovernanceRow[] = [
  { id: 'emp-001', employee: 'Anita Das', department: 'HR', email: 'anita.das@company.com', policiesCount: 5, openIssues: 1, status: 'Active', date: '2026-03-01' },
  { id: 'emp-002', employee: 'Rohit Kumar', department: 'Finance', email: 'rohit.kumar@company.com', policiesCount: 5, openIssues: 1, status: 'Active', date: '2026-03-01' },
  { id: 'emp-003', employee: 'Meera Singh', department: 'Manufacturing', email: 'meera.singh@company.com', policiesCount: 3, openIssues: 2, status: 'Active', date: '2026-02-28' },
  { id: 'emp-004', employee: 'Rahul Jain', department: 'IT', email: 'rahul.jain@company.com', policiesCount: 6, openIssues: 0, status: 'Active', date: '2026-03-02' },
  { id: 'emp-005', employee: 'Vikram Sen', department: 'Operations', email: 'vikram.sen@company.com', policiesCount: 4, openIssues: 1, status: 'Active', date: '2026-03-04' },
];
