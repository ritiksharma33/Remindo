import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthenticateWithRedirectCallback, SignUp } from "@clerk/clerk-react";
import Login from "../features/auth/Login";
import Dashboard from "../features/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/sign-in/*" element={<Login />} />
        
        {/* Sign Up Page (Using Clerk's default styled similar to Login) */}
        <Route path="/sign-up/*" element={
           <div className="min-h-screen bg-[#08090a] flex items-center justify-center p-4">
             <SignUp appearance={{ variables: { colorPrimary: "#10b981" } }} signInUrl="/" />
           </div>
        } />

        <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}