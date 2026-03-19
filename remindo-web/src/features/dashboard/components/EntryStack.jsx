import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, Clock, AlertCircle } from "lucide-react";
import FlashcardModal from "./FlashcardModal";

export default function EntryStack({ entries, onReviewComplete }) {
  const [expandedDate, setExpandedDate] = useState(
    entries.length > 0 ? new Date(entries[0].date).toDateString() : null
  );
  const [reviewSession, setReviewSession] = useState(null);

  // Group Entries by Date
  const groupedEntries = entries.reduce((groups, entry) => {
    const dateStr = new Date(entry.date).toDateString();
    if (!groups[dateStr]) groups[dateStr] = [];
    groups[dateStr].push(entry);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedEntries).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <>
      <div className="relative space-y-6 pl-8">
        <div className="absolute left-3 top-2 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/50 via-white/10 to-transparent" />
        {sortedDates.map((date) => (
          <DailyCapsule 
            key={date} date={date} 
            entries={groupedEntries[date]} 
            isOpen={expandedDate === date} 
            onToggle={() => setExpandedDate(expandedDate === date ? null : date)} 
            onCardClick={(index) => setReviewSession({ entries: groupedEntries[date], startIndex: index })}
          />
        ))}
      </div>

      {reviewSession && (
        <FlashcardModal 
          entries={reviewSession.entries}
          startIndex={reviewSession.startIndex}
          isOpen={!!reviewSession} 
          onClose={() => setReviewSession(null)}
          onReviewComplete={onReviewComplete}
        />
      )}
    </>
  );
}

// Sub-Component: Daily Capsule
function DailyCapsule({ date, entries, isOpen, onToggle, onCardClick }) {
  const hasDueReviews = entries.some(
    (e) => e.srs?.nextReviewDate && new Date(e.srs.nextReviewDate) <= new Date()
  );

  return (
    <div className="relative">
      <div className={`absolute -left-[29px] top-4 h-5 w-5 rounded-full border-4 border-[#050505] transition duration-500 ${hasDueReviews ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : 'bg-purple-600'}`}></div>
      <button 
        onClick={onToggle}
        className={`group relative flex w-full items-center justify-between rounded-xl border p-4 transition-all duration-300 ${isOpen ? "border-purple-500/30 bg-purple-900/10" : "border-white/5 bg-white/5 hover:border-white/10"}`}
      >
        <div className="flex items-center gap-4">
          <div className={`rounded-lg p-2 transition ${isOpen ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-zinc-400'}`}>
            <Calendar size={20} />
          </div>
          <div className="text-left">
            <h3 className={`font-semibold transition ${isOpen ? 'text-white' : 'text-zinc-300'}`}>{date}</h3>
            <p className="text-xs text-zinc-500">{entries.length} Memories</p>
          </div>
        </div>
        <ChevronDown size={20} className={`text-zinc-500 transition duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-4 grid gap-4">
              {entries.map((entry, index) => (
                <div 
                  key={entry._id} 
                  onClick={() => onCardClick(index)}
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl border p-5 backdrop-blur-md transition hover:scale-[1.01] hover:shadow-lg ${new Date(entry.srs?.nextReviewDate) <= new Date() ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-white/5 bg-black/20 hover:border-purple-500/30'}`}
                >
                  <div className="mb-3 flex items-center justify-between text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                      <Clock size={12} />
                      {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {new Date(entry.srs?.nextReviewDate) <= new Date() && <div className="h-2 w-2 rounded-full bg-yellow-500 shadow-[0_0_5px_#eab308]"></div>}
                  </div>
                  <p className="line-clamp-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">{entry.content}</p>
                </div>
              ))}
            </div>
            <div className="h-4"></div> 
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}