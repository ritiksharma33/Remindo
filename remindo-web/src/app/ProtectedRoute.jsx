import { useAuth } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isSignedIn, isLoaded } = useAuth();

  // Wait for Clerk to load before deciding to redirect
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center text-emerald-500 font-mono text-xs uppercase tracking-widest">
        Verifying Garden Access...
      </div>
    );
  }

  // If not signed in, bounce them back to the login page
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  // If signed in, let them through
  return <Outlet />;
};

export default ProtectedRoute;