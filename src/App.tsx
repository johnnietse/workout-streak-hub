
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WorkoutProvider } from "./context/WorkoutContext";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CalendarView from "./pages/CalendarView";
import AddWorkout from "./pages/AddWorkout";
import Search from "./pages/Search";
import Achievements from "./pages/Achievements";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import { Loader2 } from "lucide-react";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={
        <Suspense fallback={<LoadingFallback />}>
          <Auth />
        </Suspense>
      } />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingFallback />}>
            <Layout>
              <Dashboard />
            </Layout>
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/calendar" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingFallback />}>
            <Layout>
              <CalendarView />
            </Layout>
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/add-workout" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingFallback />}>
            <Layout>
              <AddWorkout />
            </Layout>
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/search" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingFallback />}>
            <Layout>
              <Search />
            </Layout>
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/achievements" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingFallback />}>
            <Layout>
              <Achievements />
            </Layout>
          </Suspense>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <WorkoutProvider>
            <Toaster />
            <AppRoutes />
          </WorkoutProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
