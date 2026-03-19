import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Search, Command, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserButton, useUser, useClerk } from '@clerk/clerk-react'; // Added Clerk Imports

import DeathClockNavbar from './DeathClockNavbar'; 
import YearProgress from '../../features/dashboard/components/YearProgress'; 

const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const { user } = useUser(); // Get user details (name, image)
  const { signOut } = useClerk(); // Get sign out function
  
  const [showJourney, setShowJourney] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Updated Logout for Clerk
  const handleLogout = async () => {
    await signOut({ redirectUrl: "/" });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (onSearch) onSearch(val);
  };

  const clearSearch = () => {
    setLocalSearch("");
    if (onSearch) onSearch("");
  };

  return (
    <>
      {/* --- MAIN NAVBAR --- */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 px-6 py-4 ${
        scrolled 
          ? 'bg-[#0a0c10]/80 backdrop-blur-xl border-b border-emerald-500/10 py-3' 
          : 'bg-transparent border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-8">
          
          {/* LEFT: Logo & Journey Trigger */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="group flex items-center gap-2">
               <div className="relative">
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)] group-hover:scale-125 transition-transform"></div>
                 <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-20"></div>
               </div>
               <span className="text-xl font-bold text-white tracking-tight italic">REMINDO</span>
            </Link>

            <button 
              onClick={() => setShowJourney(true)}
              className="group hidden sm:flex items-center gap-3 bg-slate-800/40 hover:bg-emerald-500/10 border border-slate-700/50 hover:border-emerald-500/40 px-4 py-1.5 rounded-full transition-all duration-300"
            >
              <div className="opacity-80 group-hover:opacity-100">
                <DeathClockNavbar /> 
              </div>
              <div className="h-4 w-[1px] bg-slate-700 group-hover:bg-emerald-500/30"></div>
              <span className="text-[10px] text-slate-400 group-hover:text-emerald-400 uppercase font-bold tracking-widest transition-colors">
                Life Pulse
              </span>
            </button>
          </div>

          {/* RIGHT: Search & Clerk User Profile */}
          <div className="flex items-center gap-6 flex-1 justify-end">
            
            {/* --- ZEN SEARCH BAR --- */}
            <div className="relative group w-full max-w-md hidden lg:block">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
              </div>
              
              <input 
                type="text" 
                value={localSearch}
                onChange={handleSearchChange}
                placeholder="Search through your insights..." 
                className="w-full bg-slate-900/40 border border-slate-800 text-slate-200 pl-11 pr-12 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30 focus:bg-slate-900/80 transition-all placeholder:text-slate-600 text-sm"
              />

              <div className="absolute inset-y-0 right-4 flex items-center gap-2">
                {localSearch ? (
                  <button onClick={clearSearch} className="text-slate-500 hover:text-emerald-400 transition-colors">
                    <X size={16} />
                  </button>
                ) : (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-800 bg-slate-900/50 text-[10px] text-slate-500 font-mono">
                    <Command size={10} />
                    <span>K</span>
                  </div>
                )}
              </div>
            </div>

            {/* CLERK USER SECTION */}
            <div className="flex items-center gap-4 border-l border-slate-800 pl-6 ml-2">
              <div className="hidden xl:flex flex-col items-end mr-1">
                <span className="text-xs font-bold text-white leading-none mb-1 flex items-center gap-1">
                  {user?.firstName || "Gardener"} <Sparkles size={10} className="text-emerald-400" />
                </span>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Mindful Session</span>
              </div>

              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 border border-emerald-500/20 hover:border-emerald-500/50 transition-all",
                    userButtonPopoverCard: "bg-[#0d1117] border border-slate-800",
                    userButtonPopoverActionButtonText: "text-slate-300",
                    userButtonPopoverFooter: "hidden"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* --- THE JOURNEY MODAL (Zen Overlay) --- */}
      <AnimatePresence>
        {showJourney && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#050608]/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl bg-[#0d1117] rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden border border-slate-800"
            >
              <button 
                onClick={() => setShowJourney(false)}
                className="absolute top-6 right-6 text-slate-500 hover:text-white z-[110] bg-slate-800/50 p-2 rounded-full transition-all hover:rotate-90 hover:bg-emerald-500/20 hover:text-emerald-400"
              >
                <X size={24} />
              </button>
              <div className="max-h-[85vh] overflow-y-auto custom-scrollbar">
                 <YearProgress />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;