"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  PieChart, FileText, UserCheck, FileCheck, Shield, Users, 
  Settings2, Download, FileSpreadsheet, ArrowRight, Play, Loader2,
  Calendar, Award, Database, RefreshCw, X, Sparkles, Globe
} from "lucide-react";
import toast from "react-hot-toast";

type ReportType = 'environmental' | 'social' | 'governance' | 'summary' | 'custom-builder';

interface ReportCategoryInfo {
  key: ReportType;
  title: string;
  description: string;
  icon: React.ElementType;
}

const REPORT_CATEGORIES_LIST: ReportCategoryInfo[] = [
  { key: 'environmental', title: 'Environmental Report', description: 'Lists carbon calculation logs, factors, and product footprints.', icon: Globe },
  { key: 'social', title: 'Social Report', description: 'Consolidates CSR activities, hours, and participation indicators.', icon: Users },
  { key: 'governance', title: 'Governance Report', description: 'Details corporate policy signs, scheduled audits, and compliance severity issues.', icon: Shield },
  { key: 'summary', title: 'ESG Summary Report', description: 'Unified overview combining indicators across all organizational business units.', icon: PieChart },
  { key: 'custom-builder', title: 'Custom Report Builder', description: 'Assemble customized ESG worksheets with specific parameters.', icon: Settings2 },
];

export default function GovernanceReportsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <span className="text-sm text-zinc-400 font-medium">Preparing Consolidated Reports Hub...</span>
      </div>
    }>
      <ReportsPageContent />
    </Suspense>
  );
}

function ReportsPageContent() {
  const searchParams = useSearchParams();
  const [activeReport, setActiveReport] = useState<ReportType | null>(null);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Dynamic Filters Lists from Database
  const [filterData, setFilterData] = useState<{
    employees: { id: string; name: string }[];
    departments: { id: string; name: string }[];
    challenges: { id: string; title: string }[];
  }>({ employees: [], departments: [], challenges: [] });

  // 2. Dynamic Datasets from Core Modules
  const [envTransactions, setEnvTransactions] = useState<any[]>([]);
  const [socialActivities, setSocialActivities] = useState<any[]>([]);
  const [govPolicies, setGovPolicies] = useState<any[]>([]);
  const [govAudits, setGovAudits] = useState<any[]>([]);
  const [govCompliance, setGovCompliance] = useState<any[]>([]);
  const [gameXP, setGameXP] = useState<any[]>([]);

  // 3. Consolidated Unified Filters (Required for each report)
  const [filterDept, setFilterDept] = useState('all');
  const [filterEmp, setFilterEmp] = useState('all');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [filterChallenge, setFilterChallenge] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Read URL search params to automatically switch active report tabs
  useEffect(() => {
    if (!searchParams) return;
    const initialModule = searchParams.get('module');
    if (initialModule) {
      if (initialModule === 'Environmental') {
        setActiveReport('environmental');
      } else if (initialModule === 'Social') {
        setActiveReport('social');
      } else if (initialModule === 'Governance') {
        setActiveReport('governance');
      } else if (initialModule === 'Gamification') {
        setActiveReport('custom-builder');
        setFilterModule('Gamification');
      }
    }
  }, [searchParams]);

  // Load filter selectors dynamically
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [xpRes, challengesRes] = await Promise.all([
          fetch('/api/gamification/xp').then(r => r.ok ? r.json() : { filterOptions: { employees: [], departments: [] } }),
          fetch('/api/gamification/challenges').then(r => r.ok ? r.json() : { data: [] })
        ]);

        setFilterData({
          employees: xpRes.filterOptions?.employees || [],
          departments: xpRes.filterOptions?.departments || [],
          challenges: (challengesRes.data || []).map((c: any) => ({ id: c.id, title: c.title }))
        });
      } catch (err) {
        console.error("Failed loading filter details:", err);
      }
    };
    loadFilters();
  }, []);

  // Fetch live database records for all ESG columns
  const fetchAllModuleRecords = async () => {
    setLoading(true);
    try {
      const [
        envRes,
        socialRes,
        policiesRes,
        auditsRes,
        complianceRes,
        xpRes
      ] = await Promise.all([
        fetch('/api/environment/transactions').then(r => r.ok ? r.json() : { data: [] }),
        fetch('/api/social/csr-activities').then(r => r.ok ? r.json() : { data: [] }),
        fetch('/api/governance/policies').then(r => r.ok ? r.json() : { data: [] }),
        fetch('/api/governance/audits').then(r => r.ok ? r.json() : { data: [] }),
        fetch('/api/governance/compliance').then(r => r.ok ? r.json() : { data: [] }),
        fetch('/api/gamification/xp').then(r => r.ok ? r.json() : { data: [] })
      ]);

      setEnvTransactions(envRes.data || []);
      setSocialActivities(socialRes.data || socialRes.activities || []);
      setGovPolicies(policiesRes.data || []);
      setGovAudits(auditsRes.data || []);
      setGovCompliance(complianceRes.data || []);
      setGameXP(xpRes.data || []);
    } catch (err) {
      console.error("Failed consolidating records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllModuleRecords();
  }, []);

  // Sync initial module filter states based on selected report category
  useEffect(() => {
    setFilterDept('all');
    setFilterEmp('all');
    setFilterFromDate('');
    setFilterToDate('');
    setSearchTerm('');
    setFilterChallenge('all');
    setFilterCategory('all');

    if (activeReport === 'environmental') {
      setFilterModule('Environmental');
    } else if (activeReport === 'social') {
      setFilterModule('Social');
    } else if (activeReport === 'governance') {
      setFilterModule('Governance');
    } else {
      setFilterModule('all');
    }
  }, [activeReport]);

  // Consolidate cross-module datasets
  const unifiedDataset = useMemo(() => {
    const records: any[] = [];

    // 1. Environmental carbon transactions
    envTransactions.forEach(t => {
      records.push({
        id: `env-${t.id.slice(0, 6)}`,
        module: 'Environmental',
        category: 'Carbon Offset',
        title: `Carbon calculation for product: ${t.productName || 'General'}`,
        department: t.departmentName || 'Manufacturing',
        employeeName: 'System Account',
        challengeTitle: 'N/A',
        date: t.date || t.createdAt || '',
        status: 'RECORDED',
        value: `${t.carbonOffset || 0} kg CO2`
      });
    });

    // 2. Social CSR Activities
    socialActivities.forEach(act => {
      records.push({
        id: `soc-${act.id.slice(0, 6)}`,
        module: 'Social',
        category: 'CSR Activities',
        title: act.title || act.activityName || 'Volunteer Event',
        department: 'Operations',
        employeeName: 'CSR Team',
        challengeTitle: 'N/A',
        date: act.date || act.createdAt || '',
        status: act.status || 'Active',
        value: act.location || 'HQ Office'
      });
    });

    // 3. Governance policies
    govPolicies.forEach(p => {
      records.push({
        id: `gov-pol-${p.id.slice(0, 6)}`,
        module: 'Governance',
        category: 'Policies & Standards',
        title: p.title || p.policyName || '',
        department: p.ownerDepartment?.name || 'HR',
        employeeName: p.ownerEmployee ? `${p.ownerEmployee.firstName} ${p.ownerEmployee.lastName}` : 'System Admin',
        challengeTitle: 'N/A',
        date: p.updatedAt || p.effectiveDate || '',
        status: p.status || 'Active',
        value: `Version ${p.version || '1.0'}`
      });
    });

    // 4. Governance compliance audits
    govAudits.forEach(a => {
      records.push({
        id: `gov-aud-${a.id.slice(0, 6)}`,
        module: 'Governance',
        category: 'Compliance Audits',
        title: a.name,
        department: a.department?.name || 'Finance',
        employeeName: a.auditorEmployee ? `${a.auditorEmployee.firstName} ${a.auditorEmployee.lastName}` : 'External Auditor',
        challengeTitle: 'N/A',
        date: a.startDate || '',
        status: a.status,
        value: a.score !== null ? `Score: ${a.score}%` : 'Ongoing'
      });
    });

    // 5. Governance compliance issues
    govCompliance.forEach(i => {
      records.push({
        id: `gov-comp-${i.id.slice(0, 6)}`,
        module: 'Governance',
        category: 'Compliance Issues',
        title: i.title,
        department: i.department?.name || 'Operations',
        employeeName: i.ownerEmployee ? `${i.ownerEmployee.firstName} ${i.ownerEmployee.lastName}` : 'Unassigned',
        challengeTitle: 'N/A',
        date: i.createdAt || '',
        status: i.status,
        value: `Severity: ${i.severity}`
      });
    });

    // 6. Gamification XP transactions
    gameXP.forEach(x => {
      records.push({
        id: `game-xp-${x.id.slice(0, 6)}`,
        module: 'Gamification',
        category: 'Gamification XP',
        title: x.activityName,
        department: x.departmentName || 'Operations',
        employeeName: x.employeeName,
        challengeTitle: x.challengeTitle || 'N/A',
        date: x.createdAt || '',
        status: 'COMPLETED',
        value: `${x.xp >= 0 ? '+' : ''}${x.xp} XP`
      });
    });

    return records;
  }, [envTransactions, socialActivities, govPolicies, govAudits, govCompliance, gameXP]);

  // Apply consolidated filters
  const filteredReportRows = useMemo(() => {
    return unifiedDataset.filter(item => {
      // 1. Department Filter
      if (filterDept !== 'all' && item.department !== filterDept) return false;

      // 2. Employee Filter
      if (filterEmp !== 'all') {
        const matchEmp = filterData.employees.find(e => e.id === filterEmp);
        if (matchEmp && !item.employeeName.toLowerCase().includes(matchEmp.name.split(' ')[0].toLowerCase())) return false;
      }

      // 3. Date Range Filter
      if (filterFromDate || filterToDate) {
        const itemDateStr = item.date ? item.date.slice(0, 10) : '';
        if (filterFromDate && itemDateStr < filterFromDate) return false;
        if (filterToDate && itemDateStr > filterToDate) return false;
      }

      // 4. Module Filter
      if (filterModule !== 'all' && item.module !== filterModule) return false;

      // 5. Challenge Filter
      if (filterChallenge !== 'all' && item.challengeTitle !== filterChallenge) return false;

      // 6. ESG Category Filter
      if (filterCategory !== 'all' && item.category !== filterCategory) return false;

      // 7. Search filter matches
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(term);
        const matchVal = item.value.toLowerCase().includes(term);
        const matchDeptName = item.department.toLowerCase().includes(term);
        const matchEmpName = item.employeeName.toLowerCase().includes(term);
        if (!matchTitle && !matchVal && !matchDeptName && !matchEmpName) return false;
      }

      return true;
    });
  }, [unifiedDataset, filterDept, filterEmp, filterFromDate, filterToDate, filterModule, filterChallenge, filterCategory, filterData, searchTerm]);

  // Handle file download exports
  const handleExport = (format: string) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast.success(`${format.toUpperCase()} report exported successfully.`);

      let contents = '';
      if (format === 'csv') {
        contents = "ID,Module,ESG Category,Title / Action,Department,Responsible Employee,Date,Status,Telemetry Value\n" +
          filteredReportRows.map(row => 
            `"${row.id}","${row.module}","${row.category}","${row.title.replace(/"/g, '""')}","${row.department}","${row.employeeName}","${row.date ? row.date.slice(0, 10) : '—'}","${row.status}","${row.value}"`
          ).join("\n");
      } else {
        contents = `ECOSPHERE ESG COMPLIANCE TELEMETRY REPORT\n` +
          `Report Type: ${REPORT_CATEGORIES_LIST.find(c => c.key === activeReport)?.title || 'Custom Worksheet'}\n` +
          `Generated on: ${new Date().toLocaleString()}\n` +
          `Record count: ${filteredReportRows.length}\n\n` +
          `ID\tModule\tCategory\tTitle\tDepartment\tResponsible\tDate\tStatus\tValue\n` +
          filteredReportRows.map(row => 
            `${row.id}\t${row.module}\t${row.category}\t${row.title}\t${row.department}\t${row.employeeName}\t${row.date ? row.date.slice(0, 10) : '—'}\t${row.status}\t${row.value}`
          ).join("\n");
      }

      const fileBlob = new Blob([contents], { type: format === 'csv' ? 'text/csv' : 'text/plain' });
      const element = document.createElement("a");
      element.href = URL.createObjectURL(fileBlob);
      element.download = `esg_report_${activeReport}_${Date.now()}.${format === 'excel' ? 'xls' : format === 'pdf' ? 'pdf' : 'csv'}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1200);
  };

  // Back list menu
  if (!activeReport) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent w-fit">
            Governance Reports Center
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Access pre-built dashboards or consolidate cross-module queries into custom sheets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {REPORT_CATEGORIES_LIST.map((category) => (
            <button 
              key={category.key} 
              onClick={() => setActiveReport(category.key)}
              className="text-left block w-full outline-none"
            >
              <div className="h-full border border-white/10 bg-white/[0.02] p-6 rounded-xl hover:border-emerald-550/30 hover:bg-white/[0.04] transition-all group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                  <category.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-450 transition-colors">
                  {category.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{category.description}</p>
                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-450 mt-4 border-t border-white/5 pt-3">
                  <span>Open Report Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-450 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const activeCategory = REPORT_CATEGORIES_LIST.find(c => c.key === activeReport);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Title & Navigation */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="space-y-1">
          <button 
            onClick={() => setActiveReport(null)} 
            className="text-xs font-bold text-emerald-450 hover:underline flex items-center gap-1"
          >
            ← Back to Reports Center
          </button>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-1">
            {activeCategory && <activeCategory.icon className="w-5.5 h-5.5 text-emerald-400" />}
            {activeCategory?.title}
          </h2>
          <p className="text-xs text-zinc-400">{activeCategory?.description}</p>
        </div>
      </div>

      {/* Dynamic Filter toolbar (renders for each report) */}
      <div className="border border-white/10 bg-white/[0.02] rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest">Query Filters</h4>
          {(filterDept !== 'all' || filterEmp !== 'all' || filterFromDate || filterToDate || filterModule !== 'all' || filterChallenge !== 'all' || filterCategory !== 'all') && (
            <button
              onClick={() => {
                setFilterDept('all');
                setFilterEmp('all');
                setFilterFromDate('');
                setFilterToDate('');
                setFilterModule(activeReport === 'environmental' ? 'Environmental' : activeReport === 'social' ? 'Social' : activeReport === 'governance' ? 'Governance' : 'all');
                setFilterChallenge('all');
                setFilterCategory('all');
                toast.success('Filters cleared.');
              }}
              className="text-[9px] font-bold text-rose-400 hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 items-end">
          
          {/* 1. Department */}
          <div>
            <label className="block text-[9px] font-bold text-zinc-450 uppercase mb-1">Department</label>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="all">All Departments</option>
              {filterData.departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>

          {/* 2. Employee */}
          <div>
            <label className="block text-[9px] font-bold text-zinc-450 uppercase mb-1">Employee</label>
            <select
              value={filterEmp}
              onChange={(e) => setFilterEmp(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="all">All Employees</option>
              {filterData.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>

          {/* 3. Date: From */}
          <div>
            <label className="block text-[9px] font-bold text-zinc-450 uppercase mb-1">From Date</label>
            <input
              type="date"
              value={filterFromDate}
              onChange={(e) => setFilterFromDate(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white [color-scheme:dark] focus:outline-none"
            />
          </div>

          {/* 4. Date: To */}
          <div>
            <label className="block text-[9px] font-bold text-zinc-450 uppercase mb-1">To Date</label>
            <input
              type="date"
              value={filterToDate}
              onChange={(e) => setFilterToDate(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white [color-scheme:dark] focus:outline-none"
            />
          </div>

          {/* 5. Module (Disabled if report tab pre-locks it) */}
          <div>
            <label className="block text-[9px] font-bold text-zinc-450 uppercase mb-1">Module</label>
            <select
              value={filterModule}
              disabled={activeReport !== 'summary' && activeReport !== 'custom-builder'}
              onChange={(e) => setFilterModule(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none disabled:opacity-50"
            >
              <option value="all">All Modules</option>
              <option value="Environmental">Environmental</option>
              <option value="Social">Social</option>
              <option value="Governance">Governance</option>
              <option value="Gamification">Gamification</option>
            </select>
          </div>

          {/* 6. Challenge */}
          <div>
            <label className="block text-[9px] font-bold text-zinc-450 uppercase mb-1">Challenge</label>
            <select
              value={filterChallenge}
              onChange={(e) => setFilterChallenge(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="all">All Challenges</option>
              {filterData.challenges.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
            </select>
          </div>

          {/* 7. ESG Category */}
          <div>
            <label className="block text-[9px] font-bold text-zinc-450 uppercase mb-1">ESG Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="all">All Categories</option>
              <option value="Carbon Offset">Carbon Footprints</option>
              <option value="CSR Activities">CSR Activities</option>
              <option value="Policies & Standards">Policies &amp; Standards</option>
              <option value="Compliance Audits">Compliance Audits</option>
              <option value="Compliance Issues">Compliance Issues</option>
              <option value="Gamification XP">Gamification XP</option>
            </select>
          </div>

        </div>
      </div>

      {/* worksheet result table */}
      <div className="border border-white/10 bg-white/[0.02] rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Worksheet Results ({filteredReportRows.length} rows matched)
            </h3>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 w-full sm:w-44 placeholder-zinc-550"
            />
            
            <div className="flex gap-1.5 shrink-0">
              <button 
                type="button"
                onClick={() => handleExport('pdf')}
                disabled={isExporting} 
                className="p-1.5 px-3 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold text-slate-200 transition-colors flex items-center gap-1"
              >
                <FileText className="w-3 h-3 text-red-400" /> PDF
              </button>
              <button 
                type="button"
                onClick={() => handleExport('excel')}
                disabled={isExporting} 
                className="p-1.5 px-3 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold text-slate-200 transition-colors flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3 h-3 text-emerald-450" /> Excel
              </button>
              <button 
                type="button"
                onClick={() => handleExport('csv')}
                disabled={isExporting} 
                className="p-1.5 px-3 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold text-slate-200 transition-colors flex items-center gap-1"
              >
                <Download className="w-3 h-3 text-sky-400" /> CSV
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-black/20 text-zinc-400 font-bold uppercase border-b border-white/5">
              <tr>
                <th className="px-6 py-3.5 w-24">ID</th>
                <th className="px-6 py-3.5 w-32">Module</th>
                <th className="px-6 py-3.5 w-40">ESG Category</th>
                <th className="px-6 py-3.5">Details</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">Responsible</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right rounded-tr-lg">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {filteredReportRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-zinc-555 bg-transparent italic">
                    No corporate records matched current selection filters. Try refining your dates or module settings.
                  </td>
                </tr>
              ) : (
                filteredReportRows.map(row => (
                  <tr key={row.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 font-mono text-[10.5px] text-zinc-500">{row.id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                        row.module === 'Environmental' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' :
                        row.module === 'Social' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/15' :
                        row.module === 'Governance' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/15' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/15'
                      }`}>
                        {row.module}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-350">{row.category}</td>
                    <td className="px-6 py-4 font-bold text-white max-w-xs truncate" title={row.title}>{row.title}</td>
                    <td className="px-6 py-4 text-slate-350">{row.department}</td>
                    <td className="px-6 py-4 text-slate-200">{row.employeeName}</td>
                    <td className="px-6 py-4 font-mono text-[10.5px] text-zinc-400">
                      {row.date ? new Date(row.date).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        row.status === 'APPROVED' || row.status === 'COMPLETED' || row.status === 'Active' || row.status === 'RECORDED'
                          ? 'bg-emerald-500/5 text-emerald-450'
                          : row.status === 'REJECTED' || row.status === 'Closed'
                            ? 'bg-rose-500/5 text-rose-450'
                            : 'bg-amber-500/5 text-amber-450'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-white">{row.value}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
