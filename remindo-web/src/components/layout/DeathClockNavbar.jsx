import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const DailyPulseNavbar = () => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      const msLeft = endOfDay - now;
      const h = Math.floor((msLeft / (1000 * 60 * 60)) % 24);
      const m = Math.floor((msLeft / (1000 * 60)) % 60);
      const s = Math.floor((msLeft / 1000) % 60);
      
      // Pad numbers with leading zeros for a cleaner digital look
      const hh = h.toString().padStart(2, '0');
      const mm = m.toString().padStart(2, '0');
      const ss = s.toString().padStart(2, '0');
      
      setTimeLeft(`${hh}:${mm}:${ss}`);
    };

    updateTime(); // Run immediately
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2.5 bg-emerald-500/5 border border-emerald-500/20 px-3 py-1.5 rounded-full text-emerald-400 font-mono text-xs font-medium transition-all group-hover:bg-emerald-500/10 group-hover:border-emerald-500/40">
      <div className="relative flex items-center justify-center">
        <Clock size={14} className="relative z-10" />
        {/* Subtle glowing ring behind the icon */}
        <div className="absolute inset-0 bg-emerald-400/20 blur-sm rounded-full scale-150 animate-pulse"></div>
      </div>
      
      <div className="flex flex-col leading-none">
        <span className="text-[8px] uppercase tracking-[0.2em] text-emerald-500/70 font-bold mb-0.5">Remaining</span>
        <span className="tracking-widest">{timeLeft}</span>
      </div>
    </div>
  );
};

export default DailyPulseNavbar;