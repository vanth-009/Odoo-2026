"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid } from "recharts";
import { TrendingUp, Award, Target, Droplets, Users, Shield, ArrowUpRight, Zap, FileText, Bot, Send, User, Activity } from "lucide-react";
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
  { name: 'Log', score: 88, fill: '#10b981' },
  { name: 'Sls', score: 72, fill: '#0ea5e9' },
  { name: 'Mfg', score: 64, fill: '#f43f5e' },
  { name: 'Corp', score: 94, fill: '#10b981' },
  { name: 'R&D', score: 82, fill: '#f59e0b' },
];

export default function Dashboard() {
  const [loaded, setLoaded] = useState(false);
  const { toast } = useToast();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'EcoSphere Neural Engine online. Logistics telemetry indicates a 12% drop in carbon output this quarter. Should I compile a variance report?' }
  ]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleSendAiMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;
    
    setChatHistory([...chatHistory, { role: 'user', text: aiMessage }]);
    setAiMessage("");
    
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'ai', text: 'Analysis complete: Vector modeling suggests re-routing Sector B supply chains through node 4 could yield an additional 4.2% reduction in Scope 3 emissions.' }]);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Global Overview Matrix</h2>
          <p className="text-sm font-mono text-muted-foreground mt-2 uppercase tracking-widest">ESG Telemetry / Live Stream</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => toast("Exporting core dump...", "info")} className="erp-panel px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 text-foreground active:scale-95">
            <FileText size={16} />
            Data Dump (CSV)
          </button>
          <button onClick={() => setIsAiModalOpen(true)} className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all flex items-center gap-2 active:scale-95 border border-emerald-400">
            <Zap size={16} fill="currentColor" />
            Neural Query
          </button>
        </div>
      </div>

      {/* Hero Row: Asymmetrical Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Core Index Node */}
        <div className="lg:col-span-5 erp-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
          
          <div className="w-full flex justify-between items-start mb-2 z-10">
            <h3 className="font-bold text-base tracking-wide">Aggregate Index Node</h3>
            <span className="px-2.5 py-1 rounded bg-primary/20 text-primary text-[10px] font-mono font-bold uppercase tracking-widest border border-primary/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              TIER 1 LEADER
            </span>
          </div>
          
          <div className="relative w-48 h-48 flex items-center justify-center z-10 my-4">
            <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" viewBox="0 0 100 100">
              <circle className="text-muted" cx="50" cy="50" fill="transparent" r="42" stroke="currentColor" strokeWidth="6"></circle>
              <circle 
                className="text-primary transition-all duration-[2000ms] ease-out" 
                cx="50" cy="50" fill="transparent" r="42" 
                stroke="url(#grad1)" 
                strokeLinecap="round" strokeWidth="6"
                strokeDasharray="264"
                strokeDashoffset={loaded ? 264 - (81 / 100) * 264 : 264}
              ></circle>
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-foreground tracking-tighter">81<span className="text-xl text-muted-foreground font-normal">.2</span></span>
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mt-1">Global Score</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-3 w-full text-center divide-x divide-border z-10 bg-muted/50 rounded-xl border border-border p-3 backdrop-blur-sm">
            <div>
              <p className="text-primary font-bold flex items-center justify-center text-sm"><ArrowUpRight size={14} /> 2.4%</p>
              <p className="text-[10px] font-mono text-muted-foreground uppercase mt-1">YoY Delta</p>
            </div>
            <div>
              <p className="text-sky-500 font-bold flex items-center justify-center gap-1 text-sm"><Award size={14} /> Peak</p>
              <p className="text-[10px] font-mono text-muted-foreground uppercase mt-1">Status</p>
            </div>
            <div>
              <p className="text-amber-500 font-bold text-sm">92.4</p>
              <p className="text-[10px] font-mono text-muted-foreground uppercase mt-1">PCTL Node</p>
            </div>
          </div>
        </div>

        {/* Dynamic Nodes Stack */}
        <div className="lg:col-span-7 grid grid-rows-3 gap-6">
          {/* Environmental Array */}
          <div className="erp-panel px-6 py-4 rounded-2xl border-l-4 border-l-primary flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner">
                <Droplets size={24} />
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-foreground mb-0.5 group-hover:text-primary transition-colors">Environmental Matrix</h4>
                <p className="text-xs font-mono text-muted-foreground">Scope 1-3 emissions & resource architecture.</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-foreground mb-1">82<span className="text-sm text-muted-foreground font-normal">/100</span></div>
              <div className="flex items-center gap-1.5 justify-end">
                <TrendingUp size={14} className="text-primary" />
                <span className="text-[10px] font-mono font-bold text-primary tracking-widest uppercase">Target Lock</span>
              </div>
            </div>
          </div>

          {/* Social Array */}
          <div className="erp-panel px-6 py-4 rounded-2xl border-l-4 border-l-sky-500 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center border border-sky-500/20 shadow-inner">
                <Users size={24} />
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-foreground mb-0.5 group-hover:text-sky-500 transition-colors">Social Ledger</h4>
                <p className="text-xs font-mono text-muted-foreground">D&I tracking and community hours integration.</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-foreground mb-1">74<span className="text-sm text-muted-foreground font-normal">/100</span></div>
              <div className="flex items-center gap-1.5 justify-end">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                <span className="text-[10px] font-mono font-bold text-amber-500 tracking-widest uppercase">Deviation Detected</span>
              </div>
            </div>
          </div>

          {/* Governance Array */}
          <div className="erp-panel px-6 py-4 rounded-2xl border-l-4 border-l-purple-500 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20 shadow-inner">
                <Shield size={24} />
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-foreground mb-0.5 group-hover:text-purple-500 transition-colors">Governance Audit</h4>
                <p className="text-xs font-mono text-muted-foreground">Immutable compliance adherence and risk vectors.</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-foreground mb-1">88<span className="text-sm text-muted-foreground font-normal">/100</span></div>
              <div className="flex items-center gap-1.5 justify-end">
                <Shield size={14} className="text-primary" />
                <span className="text-[10px] font-mono font-bold text-primary tracking-widest uppercase">Zero Variance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Intensity Sparkline */}
        <div className="lg:col-span-8 erp-panel p-6 rounded-2xl flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-bold text-lg">Carbon Intensity Trajectory</h3>
              <p className="text-xs font-mono text-muted-foreground mt-1">tCO2e / $M Rev (Rolling 7-Month Average)</p>
            </div>
            <div className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-bold text-primary">Live Tracking</span>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradientColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--muted-fg)', fontSize: 12, fontFamily: 'monospace'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--muted-fg)', fontSize: 12, fontFamily: 'monospace'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', backdropFilter: 'blur(16px)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--fg-color)' }}
                  itemStyle={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="step" dataKey="target" stroke="var(--muted-fg)" strokeDasharray="4 4" fillOpacity={0} name="Threshold Limit" />
                <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#gradientColor)" name="Recorded Vector" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Network Mini-Monitor */}
        <div className="lg:col-span-4 erp-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">System Telemetry</h3>
              <Activity size={18} className="text-muted-foreground" />
            </div>
            
            <div className="space-y-6">
              {/* Telemetry Nodes */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium">Logistics Core Sync</span>
                  <span className="text-[10px] font-mono font-bold text-primary">SUCCESS_OK</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1">
                  <div className="bg-primary h-full w-[100%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium">HR Workday Pipeline</span>
                  <span className="text-[10px] font-mono font-bold text-sky-500">PROCESSING (88%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1">
                  <div className="bg-sky-500 h-full w-[88%] rounded-full shadow-[0_0_8px_rgba(14,165,233,0.8)]"></div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium">Vendor Audit Certificates</span>
                  <span className="text-[10px] font-mono font-bold text-destructive">HALTED_ERR_403</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1">
                  <div className="bg-destructive h-full w-[45%] rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-background border border-border rounded-xl font-mono text-xs text-muted-foreground">
            <p className="mb-1"><span className="text-primary">{'>'}</span> init secure_connection...</p>
            <p className="mb-1"><span className="text-primary">{'>'}</span> handshake OK 43ms</p>
            <p className="animate-pulse"><span className="text-primary">{'>'}</span> awaiting next packet_</p>
          </div>
        </div>
      </div>

      {/* Neural AI Modal */}
      <Modal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} title="EcoSphere Neural Engine">
        <div className="flex flex-col h-[60vh]">
          <div className="flex-1 overflow-y-auto space-y-4 pb-4 px-2">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-muted border border-border text-foreground'}`}>
                  {msg.role === 'ai' ? <Bot size={18} /> : <User size={18} />}
                </div>
                <div className={`p-4 rounded-xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary border border-emerald-400 text-primary-foreground shadow-lg shadow-primary/20' : 'bg-background border border-border text-foreground font-mono text-xs'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendAiMessage} className="mt-4 flex gap-3 border-t border-border pt-4">
            <input 
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              placeholder="Input query command vector..." 
              className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            <button type="submit" disabled={!aiMessage.trim()} className="bg-primary text-primary-foreground px-5 py-3 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center">
              <Send size={18} />
            </button>
          </form>
        </div>
      </Modal>
      
    </div>
  );
}
