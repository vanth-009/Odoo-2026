import { Link } from 'react-router-dom';
import { ShieldAlert, CheckCircle, Clock, UploadCloud, FileText, ArrowRight, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button } from '../../components/ui';

interface ComplianceItem {
  id: string;
  name: string;
  category: 'Taxation' | 'Corporate (ROC)' | 'Labor & HR' | 'Environmental';
  dueDate: string;
  status: 'Compliant' | 'Pending Upload' | 'Overdue';
}

const mockComplianceItems: ComplianceItem[] = [
  { id: 'comp-001', name: 'Q1 GST Filing', category: 'Taxation', dueDate: '2026-04-20', status: 'Compliant' },
  { id: 'comp-002', name: 'ROC Form MGT-7 (Annual Return)', category: 'Corporate (ROC)', dueDate: '2026-03-31', status: 'Pending Upload' },
  { id: 'comp-003', name: 'TDS Quarterly Return (Form 26Q)', category: 'Taxation', dueDate: '2026-02-28', status: 'Compliant' },
  { id: 'comp-004', name: 'EPF ECR Submission', category: 'Labor & HR', dueDate: '2026-03-15', status: 'Pending Upload' },
  { id: 'comp-005', name: 'Hazardous Waste Annual Return', category: 'Environmental', dueDate: '2026-01-31', status: 'Overdue' },
  { id: 'comp-006', name: 'Board Resolution Filings', category: 'Corporate (ROC)', dueDate: '2026-03-05', status: 'Compliant' },
];

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compliance Center</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor your ongoing regulatory adherence, document submissions, and filing health.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Compliance Health Score</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">91.8%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 font-medium">Goal: 95%+ standard score</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Pending Tasks</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">2 Filings</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 font-medium">Awaiting document upload</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Critical/Overdue Items</p>
                <p className="text-3xl font-bold text-rose-600 mt-1">1 Item</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-rose-600 mt-3 font-medium">Requires immediate action</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Navigation Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/website/uploads">
          <Card className="border-gray-200 hover:shadow-md transition-all duration-200 group h-full">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1">
                <UploadCloud className="w-5 h-5" />
              </div>
              <CardTitle className="text-base group-hover:text-primary-700 transition-colors">
                Document Upload Control
              </CardTitle>
              <CardDescription>Upload raw PDF compliance records, receipts, and proofs.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-600">Access Uploads</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/website/reports/compliance-status">
          <Card className="border-gray-200 hover:shadow-md transition-all duration-200 group h-full">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-1">
                <FileText className="w-5 h-5" />
              </div>
              <CardTitle className="text-base group-hover:text-primary-700 transition-colors">
                Compliance Status Report
              </CardTitle>
              <CardDescription>View compliance status dashboards, charts, and metrics.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex items-center justify-between">
              <span className="text-xs font-semibold text-teal-600">View Status Report</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/website/reports/roc">
          <Card className="border-gray-200 hover:shadow-md transition-all duration-200 group h-full">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-1">
                <BarChart className="w-5 h-5" />
              </div>
              <CardTitle className="text-base group-hover:text-primary-700 transition-colors">
                ROC & MCA Compliance
              </CardTitle>
              <CardDescription>Ministry of Corporate Affairs and ROC filing verification reports.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-700">Open ROC Reports</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-700 group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Compliance list */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Recent Compliance Trackers</CardTitle>
          <CardDescription>Timeline of upcoming and past filing tasks requiring review.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Compliance Task</TableHead>
                  <TableHead>Filing Category</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Compliance Status</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockComplianceItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-semibold text-gray-900 pl-6 py-4">
                      {item.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 font-mono text-sm">{item.dueDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={item.status === 'Compliant' ? 'default' : 'outline'}
                        className={
                          item.status === 'Compliant' ? 'bg-emerald-500 text-white border-transparent' :
                          item.status === 'Pending Upload' ? 'bg-amber-500 text-white border-transparent' :
                          'bg-rose-500 text-white border-transparent'
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      {item.status === 'Pending Upload' || item.status === 'Overdue' ? (
                        <Link to="/website/uploads">
                          <Button size="sm" className="inline-flex items-center gap-1.5">
                            <UploadCloud className="w-3.5 h-3.5" /> Upload File
                          </Button>
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-400">Verified</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
