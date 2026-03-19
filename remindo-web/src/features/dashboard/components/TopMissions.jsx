import React, { useState, useEffect } from 'react';
import { Flame, Calendar } from 'lucide-react';
import { api } from '../../../services/api';

const TopMissions = ({ onMissionClick }) => { // Accept Prop
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopMissions = async () => {
      try {
        const res = await api.getMissions();
        const data = await res.json();
        const sorted = data
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
          .slice(0, 5);
        setMissions(sorted);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchTopMissions();
  }, []);

  const getMissionVisuals = (mission) => {
    const start = new Date(mission.startDate || mission.createdAt);
    const end = new Date(mission.deadline);
    const now = new Date();
    const totalDuration = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const daysPassed = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
    const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    
    const maxCubes = 15; 
    const progressPercent = Math.min(100, Math.max(0, (daysPassed / totalDuration) * 100));
    const cubesFilled = Math.floor((progressPercent / 100) * maxCubes);

    return { daysLeft, cubesFilled, maxCubes, deadlineDate: end };
  };

  if (loading) return <div className="h-24 bg-white/5 backdrop-blur-sm rounded-lg animate-pulse mb-6"></div>;
  if (missions.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {missions.map((mission, index) => {
        const { daysLeft, cubesFilled, maxCubes, deadlineDate } = getMissionVisuals(mission);
        const isUrgent = daysLeft <= 7;

        return (
          <div 
            key={mission._id}
            onClick={() => onMissionClick(mission._id)} // Click Handler
            className={`
              relative p-3 rounded-xl border flex flex-col justify-between overflow-hidden group hover:-translate-y-1 transition-all duration-300
              backdrop-blur-md cursor-pointer
              ${isUrgent 
                ? 'bg-red-500/10 border-red-500/30 shadow-[0_4px_20px_rgba(220,38,38,0.2)]' 
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-orange-500/30 hover:shadow-[0_4px_20px_rgba(249,115,22,0.1)]'}
            `}
          >
            {/* Glass Reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

            {/* Top Row */}
            <div className="flex justify-between items-start mb-2 relative z-10">
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${isUrgent ? 'bg-red-500/20 text-red-300 border-red-500/20' : 'bg-black/30 text-gray-400 border-white/10'}`}>
                #{index + 1}
              </span>
              {isUrgent && <Flame size={12} className="text-red-400 animate-pulse drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]" />}
            </div>
            
            {/* Middle: Data */}
            <div className="mb-3 relative z-10">
              <h3 className="text-xs font-bold text-gray-200 truncate mb-1 drop-shadow-md" title={mission.title}>
                {mission.title}
              </h3>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-black font-mono leading-none tracking-tight drop-shadow-lg ${isUrgent ? "text-red-400" : "text-white"}`}>
                  {daysLeft}
                </span>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wide">Days Left</span>
              </div>
              
              <div className="flex items-center gap-1 mt-1.5 text-[9px] text-gray-500 font-mono">
                 <Calendar size={8} /> {deadlineDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </div>
            </div>

            {/* Bottom: Progress Bar */}
            <div className="flex gap-px h-1.5 mt-auto relative z-10">
              {Array.from({ length: maxCubes }).map((_, i) => (
                <div 
                  key={i}
                  className={`
                    flex-1 rounded-[1px] transition-colors duration-300
                    ${i < cubesFilled 
                      ? (isUrgent ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.6)]') 
                      : 'bg-white/10'}
                  `}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopMissions;