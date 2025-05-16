
import React from "react";
import { Toaster } from "@/components/ui/toaster";
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

// Create a new QueryClient instance
const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/calendar" element={
        <ProtectedRoute>
          <Layout>
            <CalendarView />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/add-workout" element={
        <ProtectedRoute>
          <Layout>
            <AddWorkout />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/search" element={
        <ProtectedRoute>
          <Layout>
            <Search />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/achievements" element={
        <ProtectedRoute>
          <Layout>
            <Achievements />
          </Layout>
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
