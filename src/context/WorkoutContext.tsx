
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Workout, WorkoutSummary, PersonalRecord } from '../types/workout';
import { useWorkoutData } from '../hooks/useWorkoutData';
import { useAuth } from './AuthContext';

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
  isLoading: boolean;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { workouts, personalRecords, isLoading, addWorkout: addWorkoutDB, deleteWorkout: deleteWorkoutDB } = useWorkoutData();
  const [summary, setSummary] = useState<WorkoutSummary>({
    totalWorkouts: 0,
    currentStreak: 0,
    longestStreak: 0,
    personalRecords: [],
    weeklyWorkoutCount: [0, 0, 0, 0, 0, 0, 0],
    monthlyWorkoutCount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  });

  // Calculate stats and summary when workouts change
  useEffect(() => {
    if (user) {
      calculateSummary();
    }
  }, [workouts, personalRecords, user]);

  const calculateSummary = () => {
    // Sort workouts by date (newest first)
    const sortedWorkouts = [...workouts].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Calculate current streak
    let currentStreak = 0;
    let longestStreak = 0;
    
    // Simple streak calculation (consecutive days with workouts)
    const today = new Date();
    let currentDate = new Date(today);
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const hasWorkout = workouts.some(workout => workout.date === dateStr);
      
      if (hasWorkout) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    // Calculate longest streak (simplified version)
    longestStreak = Math.max(currentStreak, longestStreak);
    
    // Weekly workout count (last 7 days)
    const weeklyWorkoutCount = Array(7).fill(0);
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      weeklyWorkoutCount[i] = workouts.filter(w => w.date === dateStr).length;
    }
    
    // Monthly workout count (last 12 months)
    const monthlyWorkoutCount = Array(12).fill(0);
    const currentMonth = today.getMonth();
    
    for (let i = 0; i < 12; i++) {
      const month = (currentMonth - i + 12) % 12;
      const year = today.getFullYear() - (currentMonth < month ? 1 : 0);
      
      monthlyWorkoutCount[i] = workouts.filter(w => {
        const workoutDate = new Date(w.date);
        return workoutDate.getMonth() === month && workoutDate.getFullYear() === year;
      }).length;
    }
    
    setSummary({
      totalWorkouts: workouts.length,
      currentStreak,
      longestStreak,
      personalRecords,
      weeklyWorkoutCount,
      monthlyWorkoutCount
    });
  };

  const addWorkout = (workout: Omit<Workout, 'id'>) => {
    addWorkoutDB(workout);
  };

  const updateWorkout = (workout: Workout) => {
    // TODO: Implement update in database
    console.log('Update workout not yet implemented:', workout);
  };

  const deleteWorkout = (id: string) => {
    deleteWorkoutDB(id);
  };

  const getWorkout = (id: string) => {
    return workouts.find(w => w.id === id);
  };

  const getWorkoutsByDateRange = (start: string, end: string) => {
    return workouts.filter(w => {
      const workoutDate = new Date(w.date).getTime();
      const startDate = new Date(start).getTime();
      const endDate = new Date(end).getTime();
      return workoutDate >= startDate && workoutDate <= endDate;
    });
  };

  const getWorkoutsByType = (type: string) => {
    return workouts.filter(w => 
      w.exercises.some(e => e.exerciseType.toLowerCase() === type.toLowerCase())
    );
  };

  const searchWorkouts = (query: string) => {
    if (!query) return workouts;
    
    const lowerQuery = query.toLowerCase();
    
    return workouts.filter(w => 
      // Search by exercise name
      w.exercises.some(e => e.name.toLowerCase().includes(lowerQuery)) ||
      // Search by notes
      w.exercises.some(e => e.notes?.toLowerCase().includes(lowerQuery)) ||
      // Search by date
      w.date.includes(lowerQuery)
    );
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
        getWorkoutsByDateRange,
        getWorkoutsByType,
        searchWorkouts,
        isLoading
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
