import { useMemo, useState } from 'react';
import { FileText, Plus, Download, ShieldCheck, HelpCircle } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Select, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge } from '../../components/ui';
import toast from 'react-hot-toast';

interface PolicyItem {
  id: string;
  name: string;
  category: 'Environment' | 'Social' | 'Governance' | 'Ethical' | 'Security';
  version: string;
  lastUpdated: string;
  status: 'Active' | 'Under Review' | 'Draft';
  complianceRate: string;
}

const mockPolicies: PolicyItem[] = [
  { id: 'pol-001', name: 'Code of Conduct & Ethics', category: 'Ethical', version: 'v2.1', lastUpdated: '2026-01-10', status: 'Active', complianceRate: '98.5%' },
  { id: 'pol-002', name: 'Environmental & Sustainability Policy', category: 'Environment', version: 'v1.4', lastUpdated: '2026-02-15', status: 'Active', complianceRate: '96.2%' },
  { id: 'pol-003', name: 'Whistleblower Protection Policy', category: 'Governance', version: 'v2.0', lastUpdated: '2025-11-20', status: 'Active', complianceRate: '94.0%' },
  { id: 'pol-004', name: 'Data Privacy & Security Standard', category: 'Security', version: 'v3.0', lastUpdated: '2026-03-01', status: 'Active', complianceRate: '100%' },
  { id: 'pol-005', name: 'Human Rights & Fair Labor Policy', category: 'Social', version: 'v1.2', lastUpdated: '2025-08-14', status: 'Active', complianceRate: '97.8%' },
  { id: 'pol-006', name: 'Anti-Bribery & Corruption Framework', category: 'Governance', version: 'v2.3', lastUpdated: '2026-03-05', status: 'Under Review', complianceRate: '88.5%' },
];

export default function PoliciesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredPolicies = useMemo(() => {
    return mockPolicies.filter((policy) => {
      const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
      const matchesCategory = categoryFilter === 'all' || policy.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, categoryFilter]);

  const handleDownload = (policyName: string) => {
    toast.success(`Downloading ${policyName}...`);
  };

  const handleAddPolicy = () => {
    toast.error('Add Policy module is under development. Coming soon!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policies & Standards</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage, distribute, and track compliance status of ESG policies and corporate codes.
          </p>
        </div>
        <Button onClick={handleAddPolicy} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Policy
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Policies</p>
                <p className="text-3xl font-bold text-gray-950 mt-1">{mockPolicies.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 font-medium">5 active, 1 under review</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Avg. Acknowledgement Rate</p>
                <p className="text-3xl font-bold text-gray-950 mt-1">95.8%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 font-medium">+1.2% increase this quarter</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Recent Revisions</p>
                <p className="text-3xl font-bold text-gray-950 mt-1">3 Policies</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 font-medium">Revised within the last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Card */}
      <Card className="border-gray-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                placeholder="Search policies by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3"
              />
            </div>
            <div>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Categories' },
                  { value: 'Environment', label: 'Environment (E)' },
                  { value: 'Social', label: 'Social (S)' },
                  { value: 'Governance', label: 'Governance (G)' },
                  { value: 'Ethical', label: 'Ethical Standards' },
                  { value: 'Security', label: 'Security & Privacy' },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Policy list */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Policy Documents</CardTitle>
          <CardDescription>Review policies current versions, categories, and distribution status.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Policy Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Acknowledgement Rate</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies.length > 0 ? (
                  filteredPolicies.map((policy) => (
                    <TableRow key={policy.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-semibold text-gray-900 pl-6 flex items-center gap-3 py-4">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                          <FileText className="w-4 h-4" />
                        </div>
                        {policy.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            policy.category === 'Environment' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            policy.category === 'Social' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                            policy.category === 'Governance' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            policy.category === 'Ethical' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }
                        >
                          {policy.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-gray-600">{policy.version}</TableCell>
                      <TableCell className="text-gray-600">{policy.lastUpdated}</TableCell>
                      <TableCell>
                        <Badge
                          variant={policy.status === 'Active' ? 'default' : 'outline'}
                          className={
                            policy.status === 'Active'
                              ? 'bg-emerald-500 text-white border-transparent'
                              : 'bg-amber-500 text-white border-transparent'
                          }
                        >
                          {policy.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-900 font-semibold">{policy.complianceRate}</TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(policy.name)}
                          className="inline-flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No policies found matching the filters.
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
