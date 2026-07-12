"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { TrendingUp, Award, Target, Droplets, Users, Shield, ArrowUpRight, Zap, FileText, Bot, Send, User } from "lucide-react";
import { useToast } from "@/components/Toast";
import Modal from "@/components/Modal";

const trendData = [
  { name: 'Sep', actual: 110, target: 120 },
  { name: 'Oct', actual: 95, target: 115 },
  { name: 'Nov', actual: 80, target: 110 },
  { name: 'Dec', actual: 85, target: 105 },
  { name: 'Jan', actual: 70, target: 100 },
  { name: 'Feb', actual: 60, target: 95 },
  { name: 'Mar', actual: 45, target: 90 },
];

const deptData = [
  { name: 'Logistics', score: 88, fill: '#10b981' },
  { name: 'Sales', score: 72, fill: '#3b82f6' },
  { name: 'Manufacturing', score: 64, fill: '#ef4444' },
  { name: 'Corporate', score: 94, fill: '#10b981' },
  { name: 'R&D', score: 82, fill: '#eab308' },
];

export default function Dashboard() {
  const [loaded, setLoaded] = useState(false);
  const { toast } = useToast();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Hello! I am your EcoSphere AI Assistant. I noticed your Logistics emissions dropped 12% this quarter. How can I help you analyze this?' }
  ]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleExport = () => {
    toast("Preparing Executive Summary PDF...", "info");
    setTimeout(() => {
      toast("Report downloaded successfully.", "success");
    }, 2000);
  };

  const handleSendAiMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;
    
    setChatHistory([...chatHistory, { role: 'user', text: aiMessage }]);
    setAiMessage("");
    
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'ai', text: 'This is a simulated AI response ready to be hooked up to your backend LLM service. Based on the data, optimizing Sector B supply chains could yield another 4% reduction.' }]);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Executive Overview</h2>
          <p className="text-muted-foreground mt-1">Real-time pulse of your global ESG performance.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="glass-panel px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <FileText size={16} />
            Export Report
          </button>
          <button onClick={() => setIsAiModalOpen(true)} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all flex items-center gap-2">
            <Zap size={16} fill="currentColor" />
            AI Insights
          </button>
        </div>
      </div>

      {/* Hero Row: Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ESG Main Gauge */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-20 text-muted-foreground">
            <Target size={120} />
          </div>
          
          <div className="w-full flex justify-between items-start mb-6 z-10">
            <h3 className="font-semibold text-lg">Overall ESG Rating</h3>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
              LEADER
            </span>
          </div>
          
          <div className="relative w-48 h-48 flex items-center justify-center z-10 my-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle className="text-black/5 dark:text-white/5" cx="50" cy="50" fill="transparent" r="42" stroke="currentColor" strokeWidth="8"></circle>
              <circle 
                className="text-primary transition-all duration-1500 ease-out" 
                cx="50" cy="50" fill="transparent" r="42" 
                stroke="url(#gradient)" 
                strokeLinecap="round" strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={loaded ? 264 - (81 / 100) * 264 : 264}
              ></circle>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground">81</span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1">Score</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-3 w-full text-center divide-x divide-white/10 z-10 bg-black/5 dark:bg-black/20 rounded-xl p-3 border border-white/5">
            <div>
              <p className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm"><ArrowUpRight size={14} /> 2.4%</p>
              <p className="text-[10px] text-muted-foreground uppercase mt-1">vs Last Year</p>
            </div>
            <div>
              <p className="text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center gap-1 text-sm"><Award size={14} /> Gold</p>
              <p className="text-[10px] text-muted-foreground uppercase mt-1">Tier Status</p>
            </div>
            <div>
              <p className="text-amber-600 dark:text-amber-400 font-bold text-sm">92nd</p>
              <p className="text-[10px] text-muted-foreground uppercase mt-1">Percentile</p>
            </div>
          </div>
        </div>

        {/* Three Pillar KPIs */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Environmental */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-t-4 border-t-emerald-500 relative overflow-hidden flex flex-col">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Droplets size={24} />
              </div>
              <span className="text-xl font-bold text-foreground">82<span className="text-sm text-muted-foreground font-normal">/100</span></span>
            </div>
            <h4 className="font-semibold text-lg mb-1">Environmental</h4>
            <p className="text-sm text-muted-foreground mb-6 flex-1">Focus on Scope 1 Emissions & Water Stewardship.</p>
            <div>
              <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: loaded ? '82%' : '0%' }}></div>
              </div>
              <div className="flex items-center text-emerald-700 dark:text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded-md w-fit">
                <TrendingUp size={12} className="mr-1" /> Strong logistics reduction
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-t-4 border-t-blue-500 relative overflow-hidden flex flex-col">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Users size={24} />
              </div>
              <span className="text-xl font-bold text-foreground">74<span className="text-sm text-muted-foreground font-normal">/100</span></span>
            </div>
            <h4 className="font-semibold text-lg mb-1">Social</h4>
            <p className="text-sm text-muted-foreground mb-6 flex-1">Diversity & Inclusion and Community Impact.</p>
            <div>
              <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: loaded ? '74%' : '0%' }}></div>
              </div>
              <div className="flex items-center text-amber-600 dark:text-amber-400 text-xs font-medium bg-amber-500/10 px-2 py-1 rounded-md w-fit">
                Hiring goals 12% behind target
              </div>
            </div>
          </div>

          {/* Governance */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-t-4 border-t-purple-500 relative overflow-hidden flex flex-col">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <Shield size={24} />
              </div>
              <span className="text-xl font-bold text-foreground">88<span className="text-sm text-muted-foreground font-normal">/100</span></span>
            </div>
            <h4 className="font-semibold text-lg mb-1">Governance</h4>
            <p className="text-sm text-muted-foreground mb-6 flex-1">Policy adherence and Board Transparency.</p>
            <div>
              <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-purple-500 rounded-full transition-all duration-1000" style={{ width: loaded ? '88%' : '0%' }}></div>
              </div>
              <div className="flex items-center text-emerald-700 dark:text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded-md w-fit">
                <Shield size={12} className="mr-1" /> Zero non-conformity
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Emissions Trend Line Chart */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-semibold text-lg">Emissions Intensity Trend</h3>
              <p className="text-sm text-muted-foreground">Carbon intensity per unit of revenue (tCO2e/$M)</p>
            </div>
            <div className="flex gap-1 bg-black/5 dark:bg-black/40 p-1 rounded-lg border border-white/5">
              <button className="px-3 py-1 text-xs bg-white dark:bg-white/10 rounded-md font-medium text-foreground shadow-sm">1Y</button>
              <button className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground rounded-md transition-colors" onClick={() => toast("Timeframe switching requires backend data.", "info")}>3Y</button>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a1a1aa" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#a1a1aa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--glass-bg)', backdropFilter: 'blur(8px)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--fg-color)' }}
                  itemStyle={{ color: 'var(--fg-color)' }}
                />
                <Area type="monotone" dataKey="target" stroke="#a1a1aa" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorTarget)" name="SBTi Target" />
                <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" name="Actual Emissions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Intelligence Feed</h3>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
          </div>
          
          <div className="flex-1 space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted-foreground/20 before:to-transparent">
            {/* Item 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-8">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 backdrop-blur-md z-10">
                <FileText size={16} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl glass-panel shadow cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toast("Opening Logistics report...", "info")}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-foreground">Logistics</span>
                  <span className="text-[10px] text-muted-foreground font-mono">2h ago</span>
                </div>
                <p className="text-sm text-muted-foreground leading-snug">Uploaded Q3 emissions dataset for European hubs.</p>
              </div>
            </div>
            
            {/* Item 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-8">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-amber-500/20 text-amber-600 dark:text-amber-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 backdrop-blur-md z-10">
                <Shield size={16} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl glass-panel shadow cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toast("Opening Governance alert...", "info")}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-foreground">Governance</span>
                  <span className="text-[10px] text-muted-foreground font-mono">5h ago</span>
                </div>
                <p className="text-sm text-muted-foreground leading-snug">Flagged missing vendor certification in Supply Chain B.</p>
              </div>
            </div>
          </div>
          
          <button onClick={() => toast("Ledger fetching from API...", "info")} className="mt-4 w-full py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
            View Complete Ledger
          </button>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department ESG Ranking Bar Chart */}
        <div className="lg:col-span-12 glass-panel p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-semibold text-lg">Business Unit Performance</h3>
              <p className="text-sm text-muted-foreground">ESG score distribution across core departments</p>
            </div>
          </div>
          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'rgba(128,128,128,0.1)'}}
                  contentStyle={{ backgroundColor: 'var(--glass-bg)', backdropFilter: 'blur(8px)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--fg-color)' }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Assistant Modal */}
      <Modal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} title="EcoSphere AI Assistant" maxWidth="max-w-2xl">
        <div className="flex flex-col h-[60vh]">
          <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-2">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-primary/20 text-primary' : 'bg-black/10 dark:bg-white/10 text-foreground'}`}>
                  {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'glass-panel bg-white/50 dark:bg-black/50'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendAiMessage} className="mt-4 flex gap-2">
            <input 
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              placeholder="Ask about emissions, metrics, or anomalies..." 
              className="flex-1 bg-background border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button type="submit" disabled={!aiMessage.trim()} className="bg-primary text-primary-foreground p-2.5 rounded-lg hover:bg-emerald-400 disabled:opacity-50 transition-colors">
              <Send size={18} />
            </button>
          </form>
        </div>
      </Modal>
      
    </div>
  );
}
