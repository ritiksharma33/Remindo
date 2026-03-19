import React from 'react';

export default function StatsCard({ icon: Icon, label, value, color }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className={`mb-2 flex items-center gap-2 text-sm ${color}`}>
        <Icon size={18} />
        {label}
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}