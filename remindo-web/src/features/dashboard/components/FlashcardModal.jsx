import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, CheckCircle, Calendar, ChevronRight, ChevronLeft, Edit2, Trash2, Save } from "lucide-react";
import { api } from "../../../services/api";

export default function FlashcardModal({ entries, startIndex, isOpen, onClose, onReviewComplete }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");

  // Sync index when opening a new card from the list
  useEffect(() => { setCurrentIndex(startIndex); }, [startIndex]);

  // 1. DIRECT SOURCE OF TRUTH (No "Local Entry" middleman)
  const currentEntry = entries[currentIndex];

  // Logic Helpers
  const isLast = currentIndex === entries.length - 1;
  const isFirst = currentIndex === 0;
  const isDue = currentEntry && new Date(currentEntry.srs?.nextReviewDate) <= new Date();

  // Reset Edit Mode when switching cards
  useEffect(() => {
    setIsEditing(false);
    if (currentEntry) setEditContent(currentEntry.content);
  }, [currentIndex, currentEntry]);

  // Keyboard Navigation
  useEffect(() => {
    if (!isOpen || isEditing) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" && !isLast) handleNext();
      if (e.key === "ArrowLeft" && !isFirst) handlePrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, isLast, isFirst, isEditing]);

  if (!isOpen || !currentEntry) return null;

  // --- ACTIONS ---

  const handleNext = () => { if (!isLast) setCurrentIndex((prev) => prev + 1); };
  const handlePrev = () => { if (!isFirst) setCurrentIndex((prev) => prev - 1); };

  // 2. DELETE LOGIC (Simple & Direct)
  const handleDelete = async () => {
    if (!window.confirm("Permanently delete this card?")) return;
    try {
      // Call API using the REAL ID
      await api.deleteEntry(currentEntry._id);
      
      // Refresh Parent Data
      if (onReviewComplete) onReviewComplete(); 
      
      // Close Modal immediately (Safest behavior after delete)
      onClose();
    } catch (err) { 
      console.error("Delete failed", err);
    }
  };

  // 3. EDIT LOGIC (Direct Update)
  const handleSave = async () => {
    try {
      await api.updateEntry(currentEntry._id, { content: editContent });
      
      // Optimistically update the current object so UI reflects change instantly
      currentEntry.content = editContent;
      
      setIsEditing(false);
      
      // Sync with database in background
      if (onReviewComplete) onReviewComplete();
    } catch (err) { 
      console.error("Edit failed", err);
    }
  };

  const handleReviewAction = async (rating) => {
    try {
      await api.reviewEntry(currentEntry._id, rating);
      if (onReviewComplete) onReviewComplete();
      if (!isLast) handleNext();
      else onClose();
    } catch (err) { console.error(err); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />

          <motion.div
            key={currentEntry._id} // Important: Re-renders component when card changes
            initial={{ scale: 0.95, opacity: 0, x: 20 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.95, opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] shadow-2xl ring-1 ring-white/10"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-500/20 p-2 text-purple-300">
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">
                    {isEditing ? "Editing Mode" : "Flashcard Mode"}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {new Date(currentEntry.date).toDateString()}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-8 max-h-[60vh] min-h-[300px] flex flex-col items-center justify-center">
              {currentEntry.image && !isEditing && (
                <div className="mb-6 w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-black">
                  <img src={currentEntry.image} alt="Memory" className="h-full w-full object-contain" />
                </div>
              )}

              {isEditing ? (
                <textarea 
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="h-64 w-full resize-none rounded-xl border border-white/10 bg-black/50 p-6 text-lg leading-relaxed text-zinc-200 outline-none focus:border-purple-500/50"
                  autoFocus
                />
              ) : (
                <p className="whitespace-pre-wrap text-xl leading-relaxed text-zinc-200 text-center max-w-2xl">
                  {currentEntry.content}
                </p>
              )}
            </div>

            {/* FOOTER */}
            <div className="border-t border-white/5 bg-black/40 px-6 py-5 backdrop-blur-xl">
              
              {isEditing ? (
                // EDIT MODE BUTTONS
                <div className="flex items-center justify-end gap-3">
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2 text-sm font-bold text-white hover:bg-purple-500">
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              ) : (
                // VIEW MODE BUTTONS
                <div className="flex items-center justify-between">
                  
                  {/* Left: Review Actions */}
                  <div className="flex gap-2">
                    {isDue ? (
                      <>
                        <button onClick={() => handleReviewAction('Again')} className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 border border-red-500/20 hover:bg-red-500/20">
                          <RotateCcw size={16} /> Forgot
                        </button>
                        <button onClick={() => handleReviewAction('Good')} className="flex items-center gap-2 rounded-xl bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400 border border-green-500/20 hover:bg-green-500/20">
                          <CheckCircle size={16} /> Recalled
                        </button>
                      </>
                    ) : (
                      <span className="flex items-center gap-2 text-xs text-zinc-500 px-2">
                        <CheckCircle size={14} /> Reviewed
                      </span>
                    )}
                  </div>

                  {/* Center: Edit / Delete */}
                  <div className="flex gap-2">
                     <button 
                       onClick={() => setIsEditing(true)} 
                       className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition"
                     >
                       <Edit2 size={14} /> Edit
                     </button>
                     <button 
                       onClick={handleDelete} 
                       className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition"
                     >
                       <Trash2 size={14} /> Delete
                     </button>
                  </div>

                  {/* Right: Navigation */}
                  <div className="flex items-center gap-1">
                    <button onClick={handlePrev} disabled={isFirst} className="p-2 text-zinc-400 hover:text-white disabled:opacity-30">
                      <ChevronLeft size={24} />
                    </button>
                    <span className="text-xs text-zinc-500 min-w-[30px] text-center">
                      {currentIndex + 1}/{entries.length}
                    </span>
                    <button onClick={handleNext} disabled={isLast} className="p-2 text-zinc-400 hover:text-white disabled:opacity-30">
                      <ChevronRight size={24} />
                    </button>
                  </div>

                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}