import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export default function Login() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#08090a] p-4 text-slate-200">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]"></div>

      <div className="relative w-full max-w-md flex flex-col items-center">
        {/* Your Branding Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-emerald-500/10 p-4 ring-1 ring-emerald-500/20">
              <Leaf className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Remindo</h1>
          <p className="mt-2 text-sm text-slate-400 italic">Tend to your knowledge garden</p>
        </motion.div>

        {/* Clerk Pre-built Component */}
        <SignIn 
          appearance={{
            variables: {
              colorPrimary: "#10b981", // Emerald 500
              colorBackground: "#0d1117",
              colorText: "white",
              colorTextSecondary: "#94a3b8",
            },
            elements: {
              card: "border border-slate-800 shadow-2xl rounded-3xl bg-slate-900/40 backdrop-blur-xl",
              headerTitle: "text-white",
              headerSubtitle: "text-slate-400",
              socialButtonsBlockButton: "bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-white",
              formButtonPrimary: "bg-emerald-600 hover:bg-emerald-500 transition-all",
              footerActionLink: "text-emerald-400 hover:text-emerald-300",
              formFieldInput: "bg-slate-950/50 border-slate-800 text-white focus:ring-emerald-500/30"
            }
          }}
          signUpUrl="/sign-up"
          forceRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}