import { useState } from "react";
import { X, Upload, Loader2, Save, Leaf, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/clerk-react"; 
import { api } from "../../../services/api"; // Path leads from components -> dashboard -> features -> src/services

export default function AddEntryModal({ isOpen, onClose, onEntryAdded }) {
  const { getToken } = useAuth(); 
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Convert image file to Base64 string (Preserved your logic)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);

    try {
      // 1. Get the fresh token string from Clerk
      const token = await getToken(); 
      
      // 2. Pass the token string as the FIRST argument, then the data object
      const res = await api.createEntry(token, { 
        content: content.trim(), 
        image 
      });
      
      if(res.ok) {
        const data = await res.json();
        // 3. Notify Dashboard to update the list
        onEntryAdded(data); 
        
        // 4. Reset and Close
        setContent("");
        setImage(null);
        onClose();
      } else {
        const errorData = await res.json();
        console.error("Server refused the seed:", errorData.message);
      }
    } catch (error) {
      console.error("Failed to plant seed in garden:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050608]/80 backdrop-blur-md p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg rounded-3xl border border-slate-800 bg-[#0d1117] p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Top Decorative Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Leaf className="text-emerald-500" size={20} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Plant a Seed</h2>
              </div>
              <button 
                onClick={onClose} 
                className="rounded-full p-2 hover:bg-slate-800 text-slate-500 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Text Area */}
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Cultivate your thought</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What knowledge did you gather today?"
                  className="h-40 w-full resize-none rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-200 outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-slate-700 custom-scrollbar"
                ></textarea>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Visual Proof (Optional)</label>
                <div className="flex items-center gap-4">
                  <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-800 bg-slate-900/30 px-4 py-4 text-sm text-slate-400 hover:bg-emerald-500/5 hover:border-emerald-500/40 transition-all group">
                    <Upload size={16} className="group-hover:text-emerald-400 transition-colors" />
                    <span className="group-hover:text-slate-200 transition-colors">{image ? "Update Proof" : "Upload Screenshot"}</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  
                  {image && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="h-14 w-14 overflow-hidden rounded-xl border border-emerald-500/30 shadow-lg shadow-emerald-900/20"
                    >
                      <img src={image} alt="Preview" className="h-full w-full object-cover" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-sm font-bold text-white transition-all hover:bg-emerald-500 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    <Sparkles size={18} /> 
                    COMMIT TO VAULT
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}