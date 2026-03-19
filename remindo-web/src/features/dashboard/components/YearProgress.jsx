import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, Leaf, Trash2, Plus, X, Calendar, ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { api } from '../../../services/api'; 

const YearProgress = ({ initialMissionId }) => {
  // --- GLOBAL STATE ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState("");
  const [missions, setMissions] = useState([]);
  
  // --- UI STATE ---
  const [showForm, setShowForm] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  
  // --- FORM STATE ---
  const [newMission, setNewMission] = useState({ 
    title: "", 
    startDate: new Date().toISOString().split('T')[0], 
    deadline: "" 
  });
  
  const [formDuration, setFormDuration] = useState(0);

  // 1. INITIAL LOAD & TIMER
  useEffect(() => {
    fetchMissions();
    const timer = setInterval(() => updateTimer(), 50);
    return () => clearInterval(timer);
  }, []);

  // 2. AUTO-SELECT MISSION (The Bridge Logic)
  useEffect(() => {
    if (initialMissionId && missions.length > 0) {
      const target = missions.find(m => m._id === initialMissionId);
      if (target) {
        setSelectedMission(target);
        setShowForm(false); 
      }
    }
  }, [initialMissionId, missions]);

  const fetchMissions = async () => {
    try {
      const res = await api.getMissions();
      const data = await res.json();
      setMissions(data);
    } catch (err) { console.error("Failed to load goals"); }
  };

  const updateTimer = () => {
    const now = new Date();
    setCurrentDate(now);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const msLeft = endOfDay - now;
    const h = Math.floor((msLeft / (1000 * 60 * 60)) % 24);
    const m = Math.floor((msLeft / (1000 * 60)) % 60);
    const s = Math.floor((msLeft / 1000) % 60);
    const ms = Math.floor((msLeft % 1000) / 10);
    setTimeLeft(`${h}h ${m}m ${s}s ${ms}`);
  };

  // --- ACTIONS ---
  const handleAddMission = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createMission(newMission);
      const saved = await res.json();
      setMissions([...missions, saved]);
      setShowForm(false);
      setNewMission({ title: "", startDate: new Date().toISOString().split('T')[0], deadline: "" });
      setFormDuration(0);
    } catch (err) { console.error("Failed to add"); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Remove this goal from your journey?")) return;
    try {
      await api.deleteMission(id);
      setMissions(missions.filter(m => m._id !== id));
      setSelectedMission(null);
    } catch (err) { console.error("Failed to remove"); }
  };

  // --- SMART FORM HELPERS ---
  const setQuickDeadline = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setNewMission({ ...newMission, deadline: date.toISOString().split('T')[0] });
    setFormDuration(days);
  };

  const calculateDaysFromDate = (dateStr) => {
    if (!dateStr) return 0;
    const end = new Date(dateStr);
    const start = new Date();
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    setFormDuration(diff);
  };

  const getMissionStats = (mission) => {
    const start = new Date(mission.startDate || mission.createdAt);
    const end = new Date(mission.deadline);
    const now = new Date();
    const totalDuration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
    const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return { totalDuration, daysPassed, daysLeft, start, end };
  };

  // --- RENDERERS ---
  const renderForm = () => (
    <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-xl border border-emerald-500/20 animate-in zoom-in duration-300 relative overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30"></div>
       
       <div className="flex justify-between items-start mb-8">
         <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
           <Leaf className="text-emerald-400" /> Start New Journey
         </h3>
         <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white transition-colors">
           <X size={24} />
         </button>
       </div>
       
       <form onSubmit={handleAddMission} className="space-y-8">
          <div className="group relative">
             <input 
               className="w-full bg-transparent border-b border-slate-700 py-2 text-2xl font-medium text-white focus:border-emerald-500 outline-none placeholder-slate-700 transition-colors"
               placeholder="What would you like to achieve?"
               value={newMission.title}
               onChange={(e) => setNewMission({...newMission, title: e.target.value})}
               required
               autoFocus
             />
             <div className="absolute right-0 bottom-3 text-[10px] text-slate-600 font-mono uppercase group-focus-within:text-emerald-500">
                Awaiting your goal
             </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-3 block flex items-center gap-2">
               <Clock size={12} /> Set a Timeframe
            </label>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
               {[30, 60, 90, 180, 365].map(days => (
                 <button 
                   type="button"
                   key={days}
                   onClick={() => setQuickDeadline(days)}
                   className={`
                     px-4 py-2 rounded-full text-xs font-bold border transition-all
                     ${formDuration === days 
                       ? 'bg-emerald-500 text-slate-900 border-emerald-500' 
                       : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'}
                   `}
                 >
                   {days} DAYS
                 </button>
               ))}
            </div>

            <div className="flex items-center gap-4 bg-slate-900/50 p-3 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
               <Calendar size={16} className="text-slate-500" />
               <input 
                 type="date"
                 className="bg-transparent text-white text-sm outline-none w-full font-mono"
                 value={newMission.deadline}
                 onChange={(e) => {
                   setNewMission({...newMission, deadline: e.target.value});
                   calculateDaysFromDate(e.target.value);
                 }}
                 required
               />
               <div className="text-right whitespace-nowrap">
                  <span className="text-2xl font-bold text-emerald-400">{formDuration > 0 ? formDuration : "--"}</span>
                  <span className="text-[10px] text-slate-500 block uppercase">Total Days</span>
               </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold tracking-wide rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
          >
            <CheckCircle size={18} /> BEGIN THIS PATH
          </button>
       </form>
    </div>
  );

  const renderMissionView = () => {
    const stats = getMissionStats(selectedMission);
    
    return (
      <div className="animate-in fade-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
          <button 
            onClick={() => setSelectedMission(null)}
            className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400 transition-colors font-bold text-sm"
          >
            <ArrowLeft size={16} /> Back to Overview
          </button>
          <div className="text-right">
             <h2 className="text-xl font-bold text-white tracking-tight">{selectedMission.title}</h2>
             <p className="text-xs text-slate-500 font-mono uppercase">Goal Date: {new Date(stats.end).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/30 p-4 border border-slate-700/50 rounded-xl text-center">
             <div className="text-2xl font-bold text-white">{stats.totalDuration}</div>
             <div className="text-[10px] text-slate-500 uppercase">Duration</div>
          </div>
          <div className="bg-slate-800/30 p-4 border border-slate-700/50 rounded-xl text-center">
             <div className="text-2xl font-bold text-sky-400">{stats.daysPassed}</div>
             <div className="text-[10px] text-slate-500 uppercase">Days Invested</div>
          </div>
          <div className="bg-emerald-500/5 p-4 border border-emerald-500/20 rounded-xl text-center">
             <div className="text-2xl font-bold text-emerald-400">{stats.daysLeft}</div>
             <div className="text-[10px] text-slate-500 uppercase">Days Remaining</div>
          </div>
        </div>

        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 h-[300px] overflow-y-auto custom-scrollbar mb-6">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(30px,1fr))] gap-2">
            {Array.from({ length: stats.totalDuration }).map((_, i) => {
              const dayNum = i + 1;
              const isPast = dayNum <= stats.daysPassed;
              const isToday = dayNum === stats.daysPassed; 

              return (
                <div 
                  key={dayNum}
                  className={`
                    h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono transition-all
                    ${isPast ? 'bg-sky-900/20 text-sky-700 border border-sky-900/30' : 'bg-slate-800/30 text-slate-600 border border-slate-700/50'}
                    ${isToday ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-110 z-10' : ''}
                  `}
                >
                  {isPast && !isToday ? "•" : dayNum}
                </div>
              );
            })}
          </div>
        </div>

        <button 
          onClick={() => handleDelete(selectedMission._id)}
          className="w-full py-3 border border-slate-800 text-slate-500 hover:bg-red-900/10 hover:text-red-400 hover:border-red-900/30 rounded-lg flex items-center justify-center gap-2 font-medium text-xs tracking-wider transition-all"
        >
          <Trash2 size={14} /> Remove this Goal
        </button>
      </div>
    );
  };

  const renderMainView = () => {
    const startOfYear = new Date(currentDate.getFullYear(), 0, 0);
    const diff = currentDate - startOfYear;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-end mb-2">
             <div className="text-xs text-slate-500 font-mono">CURRENT YEAR: {currentDate.getFullYear()}</div>
             <div className="text-xs text-emerald-500 font-mono">PROGRESS DAY {dayOfYear}</div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(20px,1fr))] gap-1.5 bg-slate-950 p-4 rounded-xl border border-slate-800 h-[350px] overflow-y-auto custom-scrollbar">
            {Array.from({ length: 365 }).map((_, i) => {
              const dayNum = i + 1;
              const isPast = dayNum < dayOfYear;
              const isToday = dayNum === dayOfYear;
              return (
                <div key={dayNum} className={`h-5 w-5 rounded-sm flex items-center justify-center text-[8px] font-bold ${isPast ? 'bg-slate-800/40 text-slate-700' : ''} ${isToday ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-slate-800/20'}`}>
                  {isPast ? "•" : dayNum}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm text-slate-400 font-bold uppercase tracking-widest border-b border-slate-800 pb-2">Active Focus</h3>
          <div className="h-[250px] overflow-y-auto custom-scrollbar space-y-3 pr-2">
            {missions.map(mission => {
               const stats = getMissionStats(mission);
               return (
                <div 
                  key={mission._id} 
                  onClick={() => setSelectedMission(mission)} 
                  className="bg-slate-800/20 border border-slate-700/50 p-4 rounded-xl relative group hover:border-emerald-500/40 cursor-pointer transition-all active:scale-95"
                >
                   <div className="flex justify-between items-start mb-2">
                     <span className="font-bold text-slate-200 text-sm">{mission.title}</span>
                     <Sparkles size={14} className="text-emerald-400 opacity-50" />
                   </div>
                   <div className="flex items-end gap-2">
                     <span className="text-2xl font-bold text-emerald-400">{stats.daysLeft}</span>
                     <span className="text-slate-500 text-[10px] mb-1 font-bold uppercase tracking-tighter">Days to go</span>
                   </div>
                   <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${(stats.daysPassed / stats.totalDuration) * 100}%` }}></div>
                   </div>
                </div>
               );
            })}
          </div>

          <button 
            onClick={() => setShowForm(true)}
            className="w-full py-4 border border-dashed border-slate-700 text-slate-500 text-xs rounded-xl hover:border-emerald-500/50 hover:text-emerald-400 transition-colors flex items-center justify-center gap-2 hover:bg-emerald-500/5"
          >
            <Plus size={14} /> NEW FOCUS AREA
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl border border-slate-800 shadow-2xl font-sans relative overflow-hidden w-full max-w-6xl mx-auto">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-transparent opacity-40"></div>

      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Compass className="text-emerald-400" /> 
          {selectedMission ? "Focus View" : "Yearly Journey"}
        </h2>
        <div className="flex items-center gap-3">
           <div className="text-xl font-mono font-medium text-sky-400 tracking-tight">{timeLeft}</div>
        </div>
      </div>

      {showForm ? renderForm() : (selectedMission ? renderMissionView() : renderMainView())}
    </div>
  );
};

export default YearProgress;