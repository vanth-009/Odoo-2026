"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid } from "recharts";
import { TrendingUp, Award, Target, Droplets, Users, Shield, ArrowUpRight, Zap, FileText, Bot, Send, User } from "lucide-react";
import { useToast } from "@/components/Toast";
import Modal from "@/components/Modal";

const trendData = [
  { name: 'Jan', actual: 110, target: 120 },
  { name: 'Feb', actual: 95, target: 115 },
  { name: 'Mar', actual: 80, target: 110 },
  { name: 'Apr', actual: 85, target: 105 },
  { name: 'May', actual: 70, target: 100 },
  { name: 'Jun', actual: 60, target: 95 },
  { name: 'Jul', actual: 45, target: 90 },
];

const deptData = [
  { name: 'Logistics', score: 88, fill: '#059669' },
  { name: 'Sales', score: 72, fill: '#2563eb' },
  { name: 'Manufacturing', score: 64, fill: '#dc2626' },
  { name: 'Corporate', score: 94, fill: '#059669' },
  { name: 'R&D', score: 82, fill: '#d97706' },
];

export default function Dashboard() {
  const [loaded, setLoaded] = useState(false);
  const { toast } = useToast();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'ERP Assistant Ready. I noticed your Logistics emissions dropped 12% this quarter. How can I assist with this data?' }
  ]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleExport = () => {
    toast("Generating CSV Export...", "info");
    setTimeout(() => {
      toast("Export complete.", "success");
    }, 2000);
  };

  const handleSendAiMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;
    
    setChatHistory([...chatHistory, { role: 'user', text: aiMessage }]);
    setAiMessage("");
    
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'ai', text: 'Simulated response: Database querying suggests optimizing Sector B supply chains could yield another 4% reduction in Scope 3.' }]);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">ESG Master Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Enterprise performance overview across all tracked modules.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="bg-background border border-border px-3 py-1.5 rounded text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2 text-foreground">
            <FileText size={14} />
            Export CSV
          </button>
          <button onClick={() => setIsAiModalOpen(true)} className="bg-primary text-primary-foreground px-3 py-1.5 rounded text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <Bot size={14} />
            Query Data
          </button>
        </div>
      </div>

      {/* Hero Row: Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ESG Main Gauge */}
        <div className="lg:col-span-4 erp-panel p-5 rounded-md flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="w-full flex justify-between items-start mb-4 z-10">
            <h3 className="font-semibold text-sm">Aggregate Index Score</h3>
            <span className="px-2 py-0.5 rounded text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30 text-[10px] font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
              LEADER
            </span>
          </div>
          
          <div className="relative w-40 h-40 flex items-center justify-center z-10 my-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle className="text-muted" cx="50" cy="50" fill="transparent" r="42" stroke="currentColor" strokeWidth="8"></circle>
              <circle 
                className="text-primary transition-all duration-1000 ease-out" 
                cx="50" cy="50" fill="transparent" r="42" 
                stroke="currentColor" 
                strokeLinecap="round" strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={loaded ? 264 - (81 / 100) * 264 : 264}
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-foreground">81</span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">/ 100</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-3 w-full text-center divide-x divide-border z-10 bg-muted rounded border border-border p-2">
            <div>
              <p className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs"><ArrowUpRight size={12} /> 2.4%</p>
              <p className="text-[9px] text-muted-foreground uppercase mt-0.5">YoY Var</p>
            </div>
            <div>
              <p className="text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center gap-1 text-xs"><Award size={12} /> Gold</p>
              <p className="text-[9px] text-muted-foreground uppercase mt-0.5">Status</p>
            </div>
            <div>
              <p className="text-amber-600 dark:text-amber-500 font-bold text-xs">92nd</p>
              <p className="text-[9px] text-muted-foreground uppercase mt-0.5">PCTL</p>
            </div>
          </div>
        </div>

        {/* Three Pillar KPIs */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Environmental */}
          <div className="erp-panel p-4 rounded-md border-t-2 border-t-emerald-500 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded">
                <Droplets size={20} />
              </div>
              <span className="text-lg font-bold text-foreground">82<span className="text-xs text-muted-foreground font-normal">/100</span></span>
            </div>
            <h4 className="font-semibold text-sm mb-1">Environmental</h4>
            <p className="text-xs text-muted-foreground mb-4 flex-1">Scope 1 Emissions & Water Stewardship index.</p>
            <div>
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden mb-2">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: loaded ? '82%' : '0%' }}></div>
              </div>
              <div className="flex items-center text-emerald-700 dark:text-emerald-400 text-[10px] font-medium bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded w-fit border border-emerald-100 dark:border-emerald-800">
                <TrendingUp size={10} className="mr-1" /> Trending positive
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="erp-panel p-4 rounded-md border-t-2 border-t-blue-500 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded">
                <Users size={20} />
              </div>
              <span className="text-lg font-bold text-foreground">74<span className="text-xs text-muted-foreground font-normal">/100</span></span>
            </div>
            <h4 className="font-semibold text-sm mb-1">Social</h4>
            <p className="text-xs text-muted-foreground mb-4 flex-1">D&I tracking and community hours logged.</p>
            <div>
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden mb-2">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: loaded ? '74%' : '0%' }}></div>
              </div>
              <div className="flex items-center text-amber-700 dark:text-amber-400 text-[10px] font-medium bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded w-fit border border-amber-100 dark:border-amber-800">
                Below target Q2
              </div>
            </div>
          </div>

          {/* Governance */}
          <div className="erp-panel p-4 rounded-md border-t-2 border-t-purple-500 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded">
                <Shield size={20} />
              </div>
              <span className="text-lg font-bold text-foreground">88<span className="text-xs text-muted-foreground font-normal">/100</span></span>
            </div>
            <h4 className="font-semibold text-sm mb-1">Governance</h4>
            <p className="text-xs text-muted-foreground mb-4 flex-1">Audit readiness and compliance adherence.</p>
            <div>
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden mb-2">
                <div className="h-full bg-purple-500 rounded-full transition-all duration-1000" style={{ width: loaded ? '88%' : '0%' }}></div>
              </div>
              <div className="flex items-center text-emerald-700 dark:text-emerald-400 text-[10px] font-medium bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded w-fit border border-emerald-100 dark:border-emerald-800">
                <Shield size={10} className="mr-1" /> Compliant
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Emissions Trend Line Chart */}
        <div className="lg:col-span-8 erp-panel p-5 rounded-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-semibold text-sm">Carbon Intensity Over Time</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Metric: tCO2e / $M Revenue</p>
            </div>
            <div className="flex gap-1 bg-muted p-1 rounded border border-border">
              <button className="px-2 py-0.5 text-xs bg-background rounded-sm font-medium text-foreground shadow-sm">YTD</button>
              <button className="px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors" onClick={() => toast("Timeframe switching unavailable.", "info")}>1Y</button>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--muted-fg)', fontSize: 11}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--muted-fg)', fontSize: 11}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--fg-color)' }}
                  itemStyle={{ color: 'var(--fg-color)' }}
                />
                <Area type="monotone" dataKey="target" stroke="var(--muted-fg)" strokeDasharray="4 4" fillOpacity={0} name="Target Limit" />
                <Area type="monotone" dataKey="actual" stroke="#059669" strokeWidth={2} fillOpacity={0.1} fill="#059669" name="Actual Readings" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-4 erp-panel p-5 rounded-md flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
            <h3 className="font-semibold text-sm">System Log</h3>
          </div>
          
          <div className="flex-1 space-y-4">
            {/* Item 1 */}
            <div className="flex items-start gap-3 group">
              <div className="mt-0.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs text-foreground cursor-pointer hover:underline" onClick={() => toast("Viewing record...", "info")}>Data Ingestion: Logistics</span>
                  <span className="text-[10px] text-muted-foreground">10:42 AM</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Automated pull from SAP transportation module completed.</p>
              </div>
            </div>
            
            {/* Item 2 */}
            <div className="flex items-start gap-3 group">
              <div className="mt-0.5 w-2 h-2 rounded-full bg-amber-500 shrink-0"></div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs text-foreground cursor-pointer hover:underline" onClick={() => toast("Viewing alert...", "info")}>System Alert: Governance</span>
                  <span className="text-[10px] text-muted-foreground">08:15 AM</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Vendor cert for 'Supplier B' is expiring in 15 days.</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-start gap-3 group">
              <div className="mt-0.5 w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs text-foreground cursor-pointer hover:underline" onClick={() => toast("Viewing batch...", "info")}>HR Sync: Training</span>
                  <span className="text-[10px] text-muted-foreground">Yesterday</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Workday API integration updated diversity statistics.</p>
              </div>
            </div>
          </div>
          
          <button onClick={() => toast("Opening full logs...", "info")} className="mt-4 w-full py-1.5 bg-muted border border-border hover:bg-background rounded text-xs font-medium transition-colors text-foreground">
            View All Logs
          </button>
        </div>
      </div>

      {/* AI Assistant Modal */}
      <Modal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} title="ERP Data Query Assistant" maxWidth="max-w-2xl">
        <div className="flex flex-col h-[50vh]">
          <div className="flex-1 overflow-y-auto space-y-3 pb-4">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-primary/20 text-primary' : 'bg-muted border border-border text-foreground'}`}>
                  {msg.role === 'ai' ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div className={`p-2.5 rounded border text-sm ${msg.role === 'user' ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-foreground'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendAiMessage} className="mt-2 flex gap-2 border-t border-border pt-4">
            <input 
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              placeholder="Query database (e.g., 'Show me Q3 emissions variance')..." 
              className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button type="submit" disabled={!aiMessage.trim()} className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
              Execute
            </button>
          </form>
        </div>
      </Modal>
      
    </div>
  );
}
