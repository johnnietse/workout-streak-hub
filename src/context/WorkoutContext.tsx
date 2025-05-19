
import React, { createContext, useState, useEffect } from 'react';
import { Workout, WorkoutSummary } from '../types/workout';
import { toast } from "sonner";
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { initialWorkouts, initialSummary } from '../data/initialWorkouts';
import { calculateWorkoutSummary, getWorkoutsByDateRange, getWorkoutsByType, searchWorkouts } from '../utils/workoutUtils';

interface WorkoutContextType {
  workouts: Workout[];
  summary: WorkoutSummary;
  addWorkout: (workout: Omit<Workout, 'id'>) => void;
  updateWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  getWorkout: (id: string) => Workout | undefined;
  getWorkoutsByDateRange: (start: string, end: string) => Workout[];
  getWorkoutsByType: (type: string) => Workout[];
  searchWorkouts: (query: string) => Workout[];
}

export const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [summary, setSummary] = useState<WorkoutSummary>(initialSummary);
  const { user } = useAuth();
  
  // Load initial data when user logs in or changes
  useEffect(() => {
    if (user) {
      // For development purposes, generate user-specific data
      const userWorkouts = initialWorkouts.map(workout => ({
        ...workout,
        id: `${workout.id}-${user.id.substring(0, 6)}`,
      }));
      
      setWorkouts(userWorkouts);
      
      // In a real app, you would fetch from Supabase here instead
      // Example:
      // const fetchUserWorkouts = async () => {
      //   const { data, error } = await supabase
      //     .from('workouts')
      //     .select('*')
      //     .eq('user_id', user.id);
      //   
      //   if (error) {
      //     console.error('Error fetching workouts:', error);
      //     return;
      //   }
      //   
      //   setWorkouts(data || []);
      // };
      // 
      // fetchUserWorkouts();
    } else {
      // Clear workouts when user logs out
      setWorkouts([]);
      setSummary(initialSummary);
    }
  }, [user]);

  // Calculate stats and summary when workouts change
  useEffect(() => {
    const newSummary = calculateWorkoutSummary(workouts);
    setSummary(newSummary);
  }, [workouts]);

  const addWorkout = (workout: Omit<Workout, 'id'>) => {
    if (!user) {
      toast("You must be logged in to add a workout");
      return;
    }
    
    const newWorkout = {
      ...workout,
      id: Math.random().toString(36).substring(2, 9)
    };
    
    setWorkouts(prev => [...prev, newWorkout]);
    toast("Workout added successfully!");
    
    // In a real app, you would save to Supabase here
    // Example:
    // const saveWorkout = async () => {
    //   const { error } = await supabase
    //     .from('workouts')
    //     .insert({
    //       ...workout,
    //       user_id: user.id
    //     });
    //   
    //   if (error) {
    //     console.error('Error saving workout:', error);
    //     toast("Failed to save workout");
    //   }
    // };
    // 
    // saveWorkout();
  };

  const updateWorkout = (workout: Workout) => {
    if (!user) {
      toast("You must be logged in to update a workout");
      return;
    }
    
    setWorkouts(prev => 
      prev.map(w => w.id === workout.id ? workout : w)
    );
    toast("Workout updated!");
    
    // In a real app, you would update in Supabase here
  };

  const deleteWorkout = (id: string) => {
    if (!user) {
      toast("You must be logged in to delete a workout");
      return;
    }
    
    setWorkouts(prev => prev.filter(w => w.id !== id));
    toast("Workout deleted!");
    
    // In a real app, you would delete from Supabase here
  };

  const getWorkout = (id: string) => {
    return workouts.find(w => w.id === id);
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        summary,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        getWorkout,
        getWorkoutsByDateRange: (start, end) => getWorkoutsByDateRange(workouts, start, end),
        getWorkoutsByType: (type) => getWorkoutsByType(workouts, type),
        searchWorkouts: (query) => searchWorkouts(workouts, query)
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

// Export the hook from here to maintain backward compatibility
export { useWorkout } from '../hooks/useWorkoutContext';
