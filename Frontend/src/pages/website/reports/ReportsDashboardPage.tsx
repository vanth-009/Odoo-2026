import { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  PieChart, FileText, UserCheck, FileCheck, Shield, Users, 
  Settings2, Download, FileSpreadsheet, ArrowRight, Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input, Select, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge } from '../../../components/ui';
import toast from 'react-hot-toast';
import { exportAsCsv, exportAsExcel, exportAsPdf } from './reportExport';
import {
  mockGovernanceSummary,
  mockPolicyReport,
  mockPolicyAcknowledgement,
  mockAuditReport,
  mockComplianceIssues,
  mockEmployeeGovernance,
  type GovernanceSummaryRow,
  type PolicyReportRow,
  type PolicyAcknowledgementRow,
  type AuditReportRow,
  type ComplianceIssueRow,
  type EmployeeGovernanceRow
} from './reportMockData';

type ReportType = 'governance-summary' | 'policy' | 'acknowledgement' | 'audit' | 'compliance' | 'employee-governance' | 'custom-builder';

interface ReportCategoryInfo {
  key: ReportType;
  title: string;
  description: string;
  icon: React.ElementType;
}

const REPORT_CATEGORIES_LIST: ReportCategoryInfo[] = [
  { key: 'governance-summary', title: 'Governance Summary', description: 'Overview of department compliance, policies, and active audits.', icon: PieChart },
  { key: 'policy', title: 'Policy Report', description: 'Lists all organizational governance, social, and environmental policies.', icon: FileText },
  { key: 'acknowledgement', title: 'Policy Acknowledgement', description: 'Tracks employee-wise read receipts and sign-offs for active policies.', icon: UserCheck },
  { key: 'audit', title: 'Audit Report', description: 'Details scheduled compliance audits, scores, and target completion dates.', icon: FileCheck },
  { key: 'compliance', title: 'Compliance Issue Report', description: 'Registers active governance compliance issues, severities, and statuses.', icon: Shield },
  { key: 'employee-governance', title: 'Employee Governance Report', description: 'Monitors compliance records, open issues, and policies per employee.', icon: Users },
  { key: 'custom-builder', title: 'Custom Report Builder', description: 'Build customized compliance worksheets with specific parameters.', icon: Settings2 },
];

export default function ReportsDashboardPage() {
  const { reportType } = useParams<{ reportType?: string }>();
  
  const currentReportType = (reportType || '') as ReportType | '';

  // Core filter states (Required at the top of every report)
  const [department, setDepartment] = useState('all');
  const [employee, setEmployee] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [status, setStatus] = useState('all');

  // Custom Report Builder filter states
  const [builderModule, setBuilderModule] = useState('all');
  const [builderPolicy, setBuilderPolicy] = useState('all');
  const [builderAudit, setBuilderAudit] = useState('all');
  const [builderIssue, setBuilderIssue] = useState('all');
  const [builderSeverity, setBuilderSeverity] = useState('all');
  const [customReportRows, setCustomReportRows] = useState<any[]>([]);
  const [builderGenerated, setBuilderGenerated] = useState(false);

  // Search input inside report tables
  const [searchTerm, setSearchTerm] = useState('');

  // Reset filters when switching reports
  useEffect(() => {
    setDepartment('all');
    setEmployee('all');
    setFromDate('');
    setToDate('');
    setStatus('all');
    setSearchTerm('');
    setBuilderModule('all');
    setBuilderPolicy('all');
    setBuilderAudit('all');
    setBuilderIssue('all');
    setBuilderSeverity('all');
    setCustomReportRows([]);
    setBuilderGenerated(false);
  }, [currentReportType]);

  // Date range verification helper
  const isWithinDateRange = (dateStr: string) => {
    if (!dateStr) return false;
    const itemDate = dateStr.slice(0, 10);
    const startMatch = !fromDate || itemDate >= fromDate;
    const endMatch = !toDate || itemDate <= toDate;
    return startMatch && endMatch;
  };

  // Predefined reports filtering logic
  const filteredGovernanceSummary = useMemo(() => {
    return mockGovernanceSummary.filter(row => {
      const matchDept = department === 'all' || row.department === department;
      const matchEmp = employee === 'all' || row.employee === employee;
      const matchStatus = status === 'all' || row.status === status;
      const matchDate = !fromDate && !toDate || isWithinDateRange(row.date);
      const matchSearch = row.department.toLowerCase().includes(searchTerm.toLowerCase());
      return matchDept && matchEmp && matchStatus && matchDate && matchSearch;
    });
  }, [department, employee, fromDate, toDate, status, searchTerm]);

  const filteredPolicyReport = useMemo(() => {
    return mockPolicyReport.filter(row => {
      const matchDept = department === 'all' || row.department === department;
      const matchEmp = employee === 'all' || row.employee === employee;
      const matchStatus = status === 'all' || row.status === status;
      const matchDate = !fromDate && !toDate || isWithinDateRange(row.date);
      const matchSearch = row.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          row.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchDept && matchEmp && matchStatus && matchDate && matchSearch;
    });
  }, [department, employee, fromDate, toDate, status, searchTerm]);

  const filteredPolicyAcknowledgement = useMemo(() => {
    return mockPolicyAcknowledgement.filter(row => {
      const matchDept = department === 'all' || row.department === department;
      const matchEmp = employee === 'all' || row.employee === employee;
      const matchStatus = status === 'all' || row.status === status;
      const matchDate = !fromDate && !toDate || (row.acknowledgedDate ? isWithinDateRange(row.acknowledgedDate) : true);
      const matchSearch = row.employee.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          row.policyName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchDept && matchEmp && matchStatus && matchDate && matchSearch;
    });
  }, [department, employee, fromDate, toDate, status, searchTerm]);

  const filteredAuditReport = useMemo(() => {
    return mockAuditReport.filter(row => {
      const matchDept = department === 'all' || row.department === department;
      const matchEmp = employee === 'all' || row.employee === employee;
      const matchStatus = status === 'all' || row.status === status;
      const matchDate = !fromDate && !toDate || isWithinDateRange(row.date);
      const matchSearch = row.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          row.auditor.toLowerCase().includes(searchTerm.toLowerCase());
      return matchDept && matchEmp && matchStatus && matchDate && matchSearch;
    });
  }, [department, employee, fromDate, toDate, status, searchTerm]);

  const filteredComplianceIssues = useMemo(() => {
    return mockComplianceIssues.filter(row => {
      const matchDept = department === 'all' || row.department === department;
      const matchEmp = employee === 'all' || row.employee === employee;
      const matchStatus = status === 'all' || row.status === status;
      const matchDate = !fromDate && !toDate || isWithinDateRange(row.date);
      const matchSearch = row.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          row.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchDept && matchEmp && matchStatus && matchDate && matchSearch;
    });
  }, [department, employee, fromDate, toDate, status, searchTerm]);

  const filteredEmployeeGovernance = useMemo(() => {
    return mockEmployeeGovernance.filter(row => {
      const matchDept = department === 'all' || row.department === department;
      const matchEmp = employee === 'all' || row.employee === employee;
      const matchStatus = status === 'all' || row.status === status;
      const matchDate = !fromDate && !toDate || isWithinDateRange(row.date);
      const matchSearch = row.employee.toLowerCase().includes(searchTerm.toLowerCase());
      return matchDept && matchEmp && matchStatus && matchDate && matchSearch;
    });
  }, [department, employee, fromDate, toDate, status, searchTerm]);

  // Dynamic builder query execution
  const handleGenerateCustomReport = () => {
    const combinedData: any[] = [];

    // 1. Policy Report
    if (builderModule === 'all' || builderModule === 'policies') {
      mockPolicyReport.forEach(p => {
        const matchDept = department === 'all' || p.department === department;
        const matchEmp = employee === 'all' || p.employee === employee;
        const matchStatus = status === 'all' || p.status === status;
        const matchDate = !fromDate && !toDate || isWithinDateRange(p.date);
        const matchPolicy = builderPolicy === 'all' || p.name === builderPolicy;
        
        if (matchDept && matchEmp && matchStatus && matchDate && matchPolicy && builderSeverity === 'all' && builderAudit === 'all' && builderIssue === 'all') {
          combinedData.push({
            id: p.id,
            module: 'Policy',
            detail: `${p.name} (${p.category})`,
            department: p.department,
            responsible: p.employee,
            date: p.lastUpdated,
            status: p.status,
            severity: '—'
          });
        }
      });
    }

    // 2. Audit Report
    if (builderModule === 'all' || builderModule === 'audits') {
      mockAuditReport.forEach(a => {
        const matchDept = department === 'all' || a.department === department;
        const matchEmp = employee === 'all' || a.employee === employee;
        const matchStatus = status === 'all' || a.status === status;
        const matchDate = !fromDate && !toDate || isWithinDateRange(a.date);
        const matchAudit = builderAudit === 'all' || a.name === builderAudit;

        if (matchDept && matchEmp && matchStatus && matchDate && matchAudit && builderSeverity === 'all' && builderPolicy === 'all' && builderIssue === 'all') {
          combinedData.push({
            id: a.id,
            module: 'Audit',
            detail: `${a.name} by ${a.auditor}`,
            department: a.department,
            responsible: a.employee,
            date: a.targetDate,
            status: a.status,
            severity: `Score: ${a.auditScore}`
          });
        }
      });
    }

    // 3. Compliance Issue Report
    if (builderModule === 'all' || builderModule === 'compliance') {
      mockComplianceIssues.forEach(i => {
        const matchDept = department === 'all' || i.department === department;
        const matchEmp = employee === 'all' || i.employee === employee;
        const matchStatus = status === 'all' || i.status === status;
        const matchDate = !fromDate && !toDate || isWithinDateRange(i.date);
        const matchIssue = builderIssue === 'all' || i.title === builderIssue;
        const matchSev = builderSeverity === 'all' || i.severity === builderSeverity;

        if (matchDept && matchEmp && matchStatus && matchDate && matchIssue && matchSev && builderPolicy === 'all' && builderAudit === 'all') {
          combinedData.push({
            id: i.id,
            module: 'Compliance Issue',
            detail: i.title,
            department: i.department,
            responsible: i.employee,
            date: i.dueDate,
            status: i.status,
            severity: i.severity
          });
        }
      });
    }

    setCustomReportRows(combinedData);
    setBuilderGenerated(true);
    toast.success(`Custom report generated with ${combinedData.length} records!`);
  };

  // Export handlers
  const getExportData = () => {
    switch (currentReportType) {
      case 'governance-summary':
        return {
          title: 'Governance Summary Report',
          rows: filteredGovernanceSummary,
          cols: [
            { label: 'Department', value: (r: GovernanceSummaryRow) => r.department },
            { label: 'Compliance Score', value: (r: GovernanceSummaryRow) => r.complianceScore },
            { label: 'Total Policies', value: (r: GovernanceSummaryRow) => String(r.totalPolicies) },
            { label: 'Active Audits', value: (r: GovernanceSummaryRow) => String(r.activeAudits) },
            { label: 'Open Issues', value: (r: GovernanceSummaryRow) => String(r.openIssues) },
            { label: 'Status', value: (r: GovernanceSummaryRow) => r.status },
          ]
        };
      case 'policy':
        return {
          title: 'Policy Report',
          rows: filteredPolicyReport,
          cols: [
            { label: 'Policy Name', value: (r: PolicyReportRow) => r.name },
            { label: 'Category', value: (r: PolicyReportRow) => r.category },
            { label: 'Version', value: (r: PolicyReportRow) => r.version },
            { label: 'Last Updated', value: (r: PolicyReportRow) => r.lastUpdated },
            { label: 'Status', value: (r: PolicyReportRow) => r.status },
          ]
        };
      case 'acknowledgement':
        return {
          title: 'Policy Acknowledgement Report',
          rows: filteredPolicyAcknowledgement,
          cols: [
            { label: 'Employee', value: (r: PolicyAcknowledgementRow) => r.employee },
            { label: 'Department', value: (r: PolicyAcknowledgementRow) => r.department },
            { label: 'Policy Name', value: (r: PolicyAcknowledgementRow) => r.policyName },
            { label: 'Ack Date', value: (r: PolicyAcknowledgementRow) => r.acknowledgedDate || 'Pending' },
            { label: 'Version', value: (r: PolicyAcknowledgementRow) => r.version },
            { label: 'Status', value: (r: PolicyAcknowledgementRow) => r.status },
          ]
        };
      case 'audit':
        return {
          title: 'Audit Report',
          rows: filteredAuditReport,
          cols: [
            { label: 'Audit Name', value: (r: AuditReportRow) => r.name },
            { label: 'Scope', value: (r: AuditReportRow) => r.scope },
            { label: 'Auditor', value: (r: AuditReportRow) => r.auditor },
            { label: 'Target Date', value: (r: AuditReportRow) => r.targetDate },
            { label: 'Status', value: (r: AuditReportRow) => r.status },
            { label: 'Audit Score', value: (r: AuditReportRow) => r.auditScore },
          ]
        };
      case 'compliance':
        return {
          title: 'Compliance Issue Report',
          rows: filteredComplianceIssues,
          cols: [
            { label: 'Issue Title', value: (r: ComplianceIssueRow) => r.title },
            { label: 'Category', value: (r: ComplianceIssueRow) => r.category },
            { label: 'Severity', value: (r: ComplianceIssueRow) => r.severity },
            { label: 'Due Date', value: (r: ComplianceIssueRow) => r.dueDate },
            { label: 'Status', value: (r: ComplianceIssueRow) => r.status },
          ]
        };
      case 'employee-governance':
        return {
          title: 'Employee Governance Report',
          rows: filteredEmployeeGovernance,
          cols: [
            { label: 'Employee', value: (r: EmployeeGovernanceRow) => r.employee },
            { label: 'Department', value: (r: EmployeeGovernanceRow) => r.department },
            { label: 'Email', value: (r: EmployeeGovernanceRow) => r.email },
            { label: 'Policies Acknowledged', value: (r: EmployeeGovernanceRow) => String(r.policiesCount) },
            { label: 'Open Issues', value: (r: EmployeeGovernanceRow) => String(r.openIssues) },
          ]
        };
      case 'custom-builder':
        return {
          title: 'Custom Governance Report',
          rows: customReportRows,
          cols: [
            { label: 'Record ID', value: (r: any) => r.id },
            { label: 'Module/Type', value: (r: any) => r.module },
            { label: 'Details', value: (r: any) => r.detail },
            { label: 'Department', value: (r: any) => r.department },
            { label: 'Responsible Person', value: (r: any) => r.responsible },
            { label: 'Date', value: (r: any) => r.date },
            { label: 'Status', value: (r: any) => r.status },
            { label: 'Severity/Details', value: (r: any) => r.severity },
          ]
        };
      default:
        return null;
    }
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    const exportConfig = getExportData();
    if (!exportConfig) {
      toast.error('Choose a report to export.');
      return;
    }

    if (exportConfig.rows.length === 0) {
      toast.error('No report data available to export.');
      return;
    }

    const { title, rows, cols } = exportConfig;
    const safeFileName = title.toLowerCase().replace(/ /g, '-');

    if (format === 'pdf') {
      const ok = exportAsPdf(title, rows as any[], cols as any[]);
      if (!ok) toast.error('Allow browser pop-ups to print PDF.');
    } else if (format === 'excel') {
      exportAsExcel(`${safeFileName}.xls`, rows as any[], cols as any[]);
      toast.success('Excel file download started');
    } else if (format === 'csv') {
      exportAsCsv(`${safeFileName}.csv`, rows as any[], cols as any[]);
      toast.success('CSV file download started');
    }
  };

  // Render main dashboard lists
  if (!currentReportType) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Reports Registry</h1>
          <p className="text-sm text-gray-500 mt-1">
            Access pre-built dashboards or build custom compliance spreadsheets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {REPORT_CATEGORIES_LIST.map((category) => (
            <Link key={category.key} to={`/website/reports/${category.key}`} className="block">
              <Card className="h-full border-gray-200 hover:shadow-md transition-shadow group">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center mb-3">
                    <category.icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary-700 transition-colors">
                    {category.title}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between text-xs font-semibold text-primary-600">
                  <span>Open Report</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const activeCategory = REPORT_CATEGORIES_LIST.find(c => c.key === currentReportType);

  return (
    <div className="space-y-6">
      {/* Back button and title */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link to="/website/reports" className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1">
            ← Back to Report Center
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {activeCategory && <activeCategory.icon className="w-6 h-6 text-primary-600" />}
            {activeCategory?.title}
          </h1>
          <p className="text-sm text-gray-500">{activeCategory?.description}</p>
        </div>
      </div>

      {/* FILTER BAR (Mandatory filters at the top of every report) */}
      <Card className="border-gray-200 bg-gray-50/50">
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <Select
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                options={[
                  { value: 'all', label: 'All Departments' },
                  { value: 'HR', label: 'HR' },
                  { value: 'Finance', label: 'Finance' },
                  { value: 'Manufacturing', label: 'Manufacturing' },
                  { value: 'IT', label: 'IT' },
                  { value: 'Operations', label: 'Operations' },
                ]}
              />
            </div>
            <div>
              <Select
                label="Responsible Employee"
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                options={[
                  { value: 'all', label: 'All Employees' },
                  { value: 'Anita Das', label: 'Anita Das (HR)' },
                  { value: 'Rohit Kumar', label: 'Rohit Kumar (Finance)' },
                  { value: 'Meera Singh', label: 'Meera Singh (Mfg)' },
                  { value: 'Rahul Jain', label: 'Rahul Jain (IT)' },
                  { value: 'Vikram Sen', label: 'Vikram Sen (Ops)' },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 col-span-1">
              <Input
                label="From Date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <Input
                label="To Date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div>
              <Select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'Active', label: 'Active / Compliant' },
                  { value: 'Pending', label: 'Pending Upload / Review' },
                  { value: 'Completed', label: 'Completed' },
                  { value: 'In Progress', label: 'In Progress' },
                  { value: 'Scheduled', label: 'Scheduled' },
                  { value: 'Open', label: 'Open' },
                  { value: 'Overdue', label: 'Overdue' },
                  { value: 'Resolved', label: 'Resolved' },
                  { value: 'Acknowledged', label: 'Acknowledged' },
                  { value: 'Draft', label: 'Draft' },
                  { value: 'Expired', label: 'Expired' },
                ]}
              />
            </div>
            
            {/* EXPORTS BAR (Mandatory Exports at the top right of the filters) */}
            <div className="flex gap-2 justify-stretch">
              <Button onClick={() => handleExport('pdf')} className="flex-1 text-xs" variant="outline">
                <FileText className="w-3.5 h-3.5 mr-1" /> PDF
              </Button>
              <Button onClick={() => handleExport('excel')} className="flex-1 text-xs" variant="outline">
                <FileSpreadsheet className="w-3.5 h-3.5 mr-1" /> Excel
              </Button>
              <Button onClick={() => handleExport('csv')} className="flex-1 text-xs" variant="outline">
                <Download className="w-3.5 h-3.5 mr-1" /> CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CUSTOM REPORT BUILDER CRITERIA BOX */}
      {currentReportType === 'custom-builder' && (
        <Card className="border-primary-100 bg-primary-50/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-primary-900">
              <Settings2 className="w-4 h-4" /> Builder Parameters
            </CardTitle>
            <CardDescription>Select query options to compile a custom governance workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Select
                  label="Target Module"
                  value={builderModule}
                  onChange={(e) => setBuilderModule(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Modules' },
                    { value: 'policies', label: 'Policies' },
                    { value: 'audits', label: 'Audits' },
                    { value: 'compliance', label: 'Compliance Issues' },
                  ]}
                />
              </div>
              <div>
                <Select
                  label="Select Policy"
                  value={builderPolicy}
                  onChange={(e) => setBuilderPolicy(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Policies' },
                    { value: 'Code of Conduct & Ethics', label: 'Code of Conduct' },
                    { value: 'Environmental Policy', label: 'Environmental Policy' },
                    { value: 'Whistleblower Protection Policy', label: 'Whistleblower Policy' },
                    { value: 'Data Privacy & Security', label: 'Data Privacy' },
                  ]}
                />
              </div>
              <div>
                <Select
                  label="Select Audit"
                  value={builderAudit}
                  onChange={(e) => setBuilderAudit(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Audits' },
                    { value: 'Q1 Financial & Tax Audit', label: 'Q1 Financial/Tax' },
                    { value: 'Environmental Impact Assessment', label: 'Environmental Assessment' },
                    { value: 'Annual SOC 2 Type II Audit', label: 'SOC 2 Type II' },
                  ]}
                />
              </div>
              <div>
                <Select
                  label="Compliance Issue"
                  value={builderIssue}
                  onChange={(e) => setBuilderIssue(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Issues' },
                    { value: 'ROC Form MGT-7 Pending Submission', label: 'MGT-7 Pending' },
                    { value: 'Hazardous Waste Annual Return Overdue', label: 'Waste Return Overdue' },
                    { value: 'EPF ECR Submission Delay', label: 'EPF Submission Delay' },
                  ]}
                />
              </div>
              <div>
                <Select
                  label="Severity"
                  value={builderSeverity}
                  onChange={(e) => setBuilderSeverity(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Severities' },
                    { value: 'Critical', label: 'Critical' },
                    { value: 'High', label: 'High' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'Low', label: 'Low' },
                  ]}
                />
              </div>
            </div>

            <div className="flex justify-end border-t border-primary-100/35 pt-4 gap-3">
              <Button 
                variant="outline"
                onClick={() => {
                  setDepartment('all');
                  setEmployee('all');
                  setFromDate('');
                  setToDate('');
                  setStatus('all');
                  setBuilderModule('all');
                  setBuilderPolicy('all');
                  setBuilderAudit('all');
                  setBuilderIssue('all');
                  setBuilderSeverity('all');
                  setCustomReportRows([]);
                  setBuilderGenerated(false);
                }}
              >
                Reset Builder
              </Button>
              <Button onClick={handleGenerateCustomReport} className="flex items-center gap-2">
                <Play className="w-4 h-4 fill-white text-white" /> Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PRE-BUILT REPORTS TABLES */}
      <Card className="border-gray-200">
        <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Report Data</CardTitle>
            <CardDescription>
              {currentReportType === 'custom-builder' && !builderGenerated 
                ? 'Select parameters above and click Generate Report.' 
                : 'Showing filtered rows based on active parameters.'
              }
            </CardDescription>
          </div>
          {currentReportType !== 'custom-builder' && (
            <div>
              <Input
                placeholder="Search table rows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {/* 1. Governance Summary Table */}
            {currentReportType === 'governance-summary' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Department</TableHead>
                    <TableHead>Compliance Score</TableHead>
                    <TableHead>Total Policies</TableHead>
                    <TableHead>Active Audits</TableHead>
                    <TableHead>Open Issues</TableHead>
                    <TableHead className="pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGovernanceSummary.length > 0 ? (
                    filteredGovernanceSummary.map(row => (
                      <TableRow key={row.id}>
                        <TableCell className="font-semibold text-gray-900 pl-6 py-4">{row.department}</TableCell>
                        <TableCell className="font-bold text-emerald-600">{row.complianceScore}</TableCell>
                        <TableCell>{row.totalPolicies}</TableCell>
                        <TableCell>{row.activeAudits}</TableCell>
                        <TableCell>
                          {row.openIssues > 0 ? (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {row.openIssues} issues
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                              No issues
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="pr-6">
                          <Badge className="bg-emerald-500 text-white border-transparent">{row.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-400">No records found matching current criteria.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            {/* 2. Policy Report Table */}
            {currentReportType === 'policy' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Policy Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPolicyReport.length > 0 ? (
                    filteredPolicyReport.map(row => (
                      <TableRow key={row.id}>
                        <TableCell className="font-semibold text-gray-900 pl-6 py-4">{row.name}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell className="font-mono text-sm">{row.version}</TableCell>
                        <TableCell>{row.lastUpdated}</TableCell>
                        <TableCell className="pr-6">
                          <Badge
                            className={
                              row.status === 'Active' ? 'bg-emerald-500 text-white border-transparent' :
                              row.status === 'Draft' ? 'bg-amber-500 text-white border-transparent' :
                              'bg-gray-500 text-white border-transparent'
                            }
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-400">No policies found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            {/* 3. Policy Acknowledgement Table */}
            {currentReportType === 'acknowledgement' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Policy Name</TableHead>
                    <TableHead>Acknowledged Date</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead className="pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPolicyAcknowledgement.length > 0 ? (
                    filteredPolicyAcknowledgement.map(row => (
                      <TableRow key={row.id}>
                        <TableCell className="font-semibold text-gray-900 pl-6 py-4">{row.employee}</TableCell>
                        <TableCell>{row.department}</TableCell>
                        <TableCell>{row.policyName}</TableCell>
                        <TableCell>{row.acknowledgedDate || '—'}</TableCell>
                        <TableCell className="font-mono text-sm">{row.version}</TableCell>
                        <TableCell className="pr-6">
                          <Badge
                            className={
                              row.status === 'Acknowledged' ? 'bg-emerald-500 text-white border-transparent' :
                              'bg-amber-500 text-white border-transparent'
                            }
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-400">No acknowledgement rows found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            {/* 4. Audit Report Table */}
            {currentReportType === 'audit' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Audit Name</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Auditor</TableHead>
                    <TableHead>Target Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-6">Audit Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAuditReport.length > 0 ? (
                    filteredAuditReport.map(row => (
                      <TableRow key={row.id}>
                        <TableCell className="font-semibold text-gray-900 pl-6 py-4">{row.name}</TableCell>
                        <TableCell>{row.scope}</TableCell>
                        <TableCell>{row.auditor}</TableCell>
                        <TableCell>{row.targetDate}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              row.status === 'Completed' ? 'bg-emerald-500 text-white border-transparent' :
                              row.status === 'In Progress' ? 'bg-blue-500 text-white border-transparent' :
                              'bg-amber-500 text-white border-transparent'
                            }
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-6 font-bold text-gray-900">{row.auditScore}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-400">No audits found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            {/* 5. Compliance Issue Report Table */}
            {currentReportType === 'compliance' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Issue Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplianceIssues.length > 0 ? (
                    filteredComplianceIssues.map(row => (
                      <TableRow key={row.id}>
                        <TableCell className="font-semibold text-gray-900 pl-6 py-4">{row.title}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              row.severity === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                              row.severity === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                              row.severity === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              'bg-blue-50 text-blue-700 border-blue-200'
                            }
                          >
                            {row.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>{row.dueDate}</TableCell>
                        <TableCell className="pr-6">
                          <Badge
                            className={
                              row.status === 'Resolved' ? 'bg-emerald-500 text-white border-transparent' :
                              row.status === 'Open' ? 'bg-blue-500 text-white border-transparent' :
                              'bg-rose-500 text-white border-transparent'
                            }
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-400">No issues found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            {/* 6. Employee Governance Report Table */}
            {currentReportType === 'employee-governance' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Employee Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Policies Acknowledged</TableHead>
                    <TableHead className="pr-6">Open Compliance Issues</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployeeGovernance.length > 0 ? (
                    filteredEmployeeGovernance.map(row => (
                      <TableRow key={row.id}>
                        <TableCell className="font-semibold text-gray-900 pl-6 py-4">{row.employee}</TableCell>
                        <TableCell>{row.department}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell className="font-bold text-gray-800">{row.policiesCount} / 6</TableCell>
                        <TableCell className="pr-6">
                          {row.openIssues > 0 ? (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {row.openIssues} active issues
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                              Clean Record
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-400">No employee records found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            {/* 7. Custom Report Builder Result Table */}
            {currentReportType === 'custom-builder' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Record ID</TableHead>
                    <TableHead>Module/Type</TableHead>
                    <TableHead>Details / Scope</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Responsible</TableHead>
                    <TableHead>Target Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-6">Severity/Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!builderGenerated ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-gray-400">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Settings2 className="w-8 h-8 text-gray-300 animate-pulse" />
                          <span>Configure builder parameters above and click <strong>Generate Report</strong>.</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : customReportRows.length > 0 ? (
                    customReportRows.map(row => (
                      <TableRow key={`${row.module}-${row.id}`}>
                        <TableCell className="font-mono text-xs pl-6 py-4">{row.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            {row.module}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">{row.detail}</TableCell>
                        <TableCell>{row.department}</TableCell>
                        <TableCell>{row.responsible}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              row.status === 'Active' || row.status === 'Completed' || row.status === 'Resolved' || row.status === 'Acknowledged' 
                                ? 'bg-emerald-500 text-white border-transparent' 
                                : 'bg-amber-500 text-white border-transparent'
                            }
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-6 font-semibold text-gray-800">{row.severity}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10 text-gray-400">
                        No matching entries found for custom builder selections. Try broadening filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
