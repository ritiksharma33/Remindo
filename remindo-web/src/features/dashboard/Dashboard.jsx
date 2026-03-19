import { useEffect, useState } from "react";
import { Sparkles, Sun, Plus, Compass, X, Leaf } from "lucide-react"; 
import { useNavigate } from "react-router-dom"; 
import { useAuth, useClerk } from "@clerk/clerk-react"; 

// Components
import YearProgress from './components/YearProgress'; 
import TopMissions from './components/TopMissions';
import Navbar from "../../components/layout/Navbar"; 
import StatsCard from "./components/StatsCard";
import EntryStack from "./components/EntryStack";
import AddEntryModal from "./components/AddEntryModal";
import ReviewBanner from "./components/ReviewBanner";
import { api } from "../../services/api"; 

export default function Dashboard() {
  const navigate = useNavigate();
  const { getToken } = useAuth(); // Clerk token helper
  const { signOut } = useClerk(); // Clerk logout helper
  
  const [entries, setEntries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // --- MISSION MODAL STATE ---
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [selectedMissionId, setSelectedMissionId] = useState(null);
  
  // --- SEARCH STATE ---
  const [searchQuery, setSearchQuery] = useState(""); 

  // Initial load
  useEffect(() => { 
    fetchEntries(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const token = await getToken(); // Get the token STRING
      const res = await api.getEntries(token); // Pass string to API
      
      if(res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (error) { 
      console.error("Error fetching entries:", error); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleOpenMission = (missionId) => {
    setSelectedMissionId(missionId); 
    setIsMissionModalOpen(true);     
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this memory from your archive?")) return;
    try {
      const token = await getToken(); // Resolve token
      const res = await api.deleteEntry(token, id); // Pass to API
      if (res.ok) {
        setEntries(entries.filter(e => e._id !== id)); 
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = async (id, newContent) => {
    const updatedText = window.prompt("Refine your thought:", newContent);
    if (!updatedText || updatedText === newContent) return;

    try {
      const token = await getToken(); // Resolve token
      const res = await api.updateEntry(token, id, { content: updatedText });
      if (res.ok) {
        const updatedEntry = await res.json();
        setEntries(entries.map(e => e._id === id ? updatedEntry : e));
      }
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const handleNewEntry = (newEntry) => { 
    setEntries([newEntry, ...entries]); 
  };

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/" }); // Clerk sign out
  };

  const calculateStreak = () => {
    if (entries.length === 0) return 0;
    const uniqueDates = [...new Set(entries.map(e => new Date(e.date).toDateString()))];
    uniqueDates.sort((a, b) => new Date(b) - new Date(a));
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const lastEntryDate = uniqueDates[0];
    if (lastEntryDate !== today && lastEntryDate !== yesterday) return 0;
    let streak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const diffDays = Math.ceil(Math.abs(new Date(uniqueDates[i]) - new Date(uniqueDates[i+1])) / (1000 * 60 * 60 * 24)); 
      if (diffDays === 1) streak++; else break;
    }
    return streak;
  };

  const dueCount = entries.filter(e => e.srs?.nextReviewDate && new Date(e.srs.nextReviewDate) <= new Date()).length;

  const filteredEntries = entries.filter(entry => 
    entry.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#08090a] text-slate-200 relative font-sans">
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>

      <Navbar 
        onLogout={handleLogout} 
        onSearch={setSearchQuery}
        onOpenTerminal={() => { setSelectedMissionId(null); setIsMissionModalOpen(true); }} 
      />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-8 pb-12">
        
        {/* Missions Section */}
        <div className="mb-10">
          <TopMissions onMissionClick={handleOpenMission} />
        </div>

        <ReviewBanner count={dueCount} />

        {/* Growth Stats */}
        <section className="mb-12 grid gap-6 sm:grid-cols-3">
          <StatsCard icon={Sun} label="Daily Momentum" value={`${calculateStreak()} Days`} color="text-amber-400" />
          <StatsCard icon={Compass} label="Total Insights" value={entries.length} color="text-sky-400" />
          <StatsCard icon={Sparkles} label="Ready for Review" value={dueCount} color="text-emerald-400" />
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between border-b border-slate-800/50 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
              <Leaf size={20} className="text-emerald-500"/> Your Knowledge Garden
            </h2>
          </div>
          
          {loading ? (
             <div className="text-center py-20 text-slate-500 animate-pulse font-mono text-sm uppercase tracking-widest">Gathering your thoughts...</div>
          ) : (
             <EntryStack 
               entries={filteredEntries} 
               onReviewComplete={fetchEntries} 
               onDelete={handleDelete} 
               onEdit={handleEdit}
             />
          )}
        </section>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-20 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-900/20 transition-all hover:scale-110 hover:bg-emerald-500 active:scale-95 group"
      >
        <Plus size={28} className="transition-transform group-hover:rotate-90" />
      </button>

      <AddEntryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onEntryAdded={handleNewEntry}
      />

      {/* --- THE MISSION TERMINAL MODAL --- */}
      {isMissionModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl bg-[#0d1117] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-800">
            <button 
              onClick={() => setIsMissionModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white z-20 bg-slate-800/50 p-2 rounded-full hover:bg-emerald-500/20 hover:text-emerald-400 transition-all"
            >
              <X size={20} />
            </button>
            <div className="max-h-[85vh] overflow-y-auto custom-scrollbar">
               {/* YearProgress can now use useAuth internally to fetch its own data */}
               <YearProgress initialMissionId={selectedMissionId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}