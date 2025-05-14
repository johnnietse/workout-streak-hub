
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WorkoutProvider } from "./context/WorkoutContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CalendarView from "./pages/CalendarView";
import AddWorkout from "./pages/AddWorkout";
import Search from "./pages/Search";
import Achievements from "./pages/Achievements";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WorkoutProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/calendar" element={<Layout><CalendarView /></Layout>} />
          <Route path="/add-workout" element={<Layout><AddWorkout /></Layout>} />
          <Route path="/search" element={<Layout><Search /></Layout>} />
          <Route path="/achievements" element={<Layout><Achievements /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </WorkoutProvider>
  </QueryClientProvider>
);

export default App;
