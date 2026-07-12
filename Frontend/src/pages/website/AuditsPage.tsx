import { useMemo, useState } from 'react';
import { ClipboardCheck, Plus, Calendar, Shield, ExternalLink } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Select, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge } from '../../components/ui';
import toast from 'react-hot-toast';

interface AuditItem {
  id: string;
  name: string;
  scope: string;
  date: string;
  auditor: string;
  status: 'Completed' | 'In Progress' | 'Scheduled';
  findingsCount: number;
}

const mockAudits: AuditItem[] = [
  { id: 'aud-001', name: 'Q1 Financial & Tax Audit', scope: 'Financial/TDS', date: '2026-03-10', auditor: 'H&R Block Advisory', status: 'In Progress', findingsCount: 0 },
  { id: 'aud-002', name: 'Environmental Impact Assessment', scope: 'ESG / Environmental', date: '2026-02-28', auditor: 'GreenGen Auditors LLC', status: 'Completed', findingsCount: 2 },
  { id: 'aud-003', name: 'Annual SOC 2 Type II Audit', scope: 'Security/Privacy', date: '2026-01-15', auditor: 'Deloitte Compliance', status: 'Completed', findingsCount: 1 },
  { id: 'aud-004', name: 'Internal Secretarial Audit', scope: 'Secretarial (ROC MCA)', date: '2026-03-24', auditor: 'K. Patel & Associates', status: 'Scheduled', findingsCount: 0 },
  { id: 'aud-005', name: 'Labor & Wage Regulations Audit', scope: 'Social/HR', date: '2025-12-05', auditor: 'Apex Audit Bureau', status: 'Completed', findingsCount: 0 },
  { id: 'aud-006', name: 'Vendor Code of Conduct Review', scope: 'Supply Chain Governance', date: '2025-11-18', auditor: 'Internal Compliance', status: 'Completed', findingsCount: 4 },
];

export default function AuditsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredAudits = useMemo(() => {
    return mockAudits.filter((audit) => {
      const matchesSearch = audit.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
                            audit.auditor.toLowerCase().includes(searchTerm.toLowerCase().trim());
      const matchesStatus = statusFilter === 'all' || audit.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const handleCreateAudit = () => {
    toast.error('Schedule Audit module is under development. Coming soon!');
  };

  const handleViewReport = (auditName: string) => {
    toast.success(`Opening report details for ${auditName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit & Governance</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track external audit schedules, findings, and remediation statuses across business operations.
          </p>
        </div>
        <Button onClick={handleCreateAudit} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Schedule Audit
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Audits</p>
                <p className="text-3xl font-bold text-gray-950 mt-1">{mockAudits.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 font-medium">4 completed, 1 in progress, 1 scheduled</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Outstanding Findings</p>
                <p className="text-3xl font-bold text-gray-950 mt-1">7 findings</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-red-600 mt-3 font-medium">3 high risk, 4 medium/low risk</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Next Scheduled Audit</p>
                <p className="text-lg font-bold text-gray-950 mt-2 truncate">March 24, 2026</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 font-medium">Secretarial Audit (ROC MCA)</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Card */}
      <Card className="border-gray-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                placeholder="Search audits by name or auditor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3"
              />
            </div>
            <div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'Completed', label: 'Completed' },
                  { value: 'In Progress', label: 'In Progress' },
                  { value: 'Scheduled', label: 'Scheduled' },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audits list */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Audit History & Records</CardTitle>
          <CardDescription>View detailed timeline of audits, scope coverage, and outstanding corrective actions.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Audit Name</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Target Date</TableHead>
                  <TableHead>Assigned Auditor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Findings</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAudits.length > 0 ? (
                  filteredAudits.map((audit) => (
                    <TableRow key={audit.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-semibold text-gray-900 pl-6 flex items-center gap-3 py-4">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                          <ClipboardCheck className="w-4 h-4" />
                        </div>
                        {audit.name}
                      </TableCell>
                      <TableCell className="text-gray-700">{audit.scope}</TableCell>
                      <TableCell className="text-gray-600 font-mono text-sm">{audit.date}</TableCell>
                      <TableCell className="text-gray-700">{audit.auditor}</TableCell>
                      <TableCell>
                        <Badge
                          variant={audit.status === 'Completed' ? 'default' : 'outline'}
                          className={
                            audit.status === 'Completed' ? 'bg-emerald-500 text-white border-transparent' :
                            audit.status === 'In Progress' ? 'bg-blue-500 text-white border-transparent' :
                            'bg-amber-500 text-white border-transparent'
                          }
                        >
                          {audit.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {audit.findingsCount > 0 ? (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            {audit.findingsCount} issues found
                          </Badge>
                        ) : audit.status === 'Completed' ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            Clean Audit
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReport(audit.name)}
                          disabled={audit.status === 'Scheduled'}
                          className="inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Reports
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No audits found matching the filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
