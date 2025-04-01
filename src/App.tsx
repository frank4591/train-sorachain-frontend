
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import StakeToEarn from "./pages/StakeToEarn";
import StakeToDevelop from "./pages/StakeToDevelop";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ProtectedLayout from "./components/ProtectedLayout";

// Create a new QueryClient instance for React Query
const queryClient = new QueryClient();

// Auth redirection handler component
const AuthRedirectionHandler = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Store current path for redirecting after login if needed
    if (location.pathname !== '/login' && location.pathname !== '/register') {
      sessionStorage.setItem('redirectPath', location.pathname);
    }
  }, [location]);
  
  return null;
};

// The main App component
const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <AuthRedirectionHandler />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes with navbar */}
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/stake-to-earn" element={<StakeToEarn />} />
              <Route path="/stake-to-develop" element={<StakeToDevelop />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
