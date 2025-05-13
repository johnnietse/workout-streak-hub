
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Workout, WorkoutSummary, PersonalRecord, Exercise } from '../types/workout';
import { toast } from "sonner";

// Initial data
const initialWorkouts: Workout[] = [
  {
    id: '1',
    date: '2025-05-10',
    exercises: [
      {
        exerciseType: 'Strength',
        name: 'Bench Press',
        sets: 3,
        reps: 10,
        weight: 135,
        notes: 'Felt strong today'
      },
      {
        exerciseType: 'Strength',
        name: 'Squats',
        sets: 3,
        reps: 12,
        weight: 185,
        notes: 'Increased weight from last session'
      }
    ]
  },
  {
    id: '2',
    date: '2025-05-09',
    exercises: [
      {
        exerciseType: 'Cardio',
        name: 'Running',
        durationMinutes: 25,
        distance: 3.1,
        notes: 'Morning run'
      }
    ]
  },
  {
    id: '3',
    date: '2025-05-07',
    exercises: [
      {
        exerciseType: 'Yoga',
        name: 'Vinyasa Flow',
        durationMinutes: 45,
        notes: 'Evening session for recovery'
      }
    ]
  }
];

const initialSummary: WorkoutSummary = {
  totalWorkouts: initialWorkouts.length,
  currentStreak: 2,
  longestStreak: 2,
  personalRecords: [
    {
      exerciseName: 'Bench Press',
      value: 135,
      unit: 'lbs',
      date: '2025-05-10',
      type: 'weight'
    },
    {
      exerciseName: 'Squats',
      value: 185,
      unit: 'lbs',
      date: '2025-05-10',
      type: 'weight'
    },
    {
      exerciseName: 'Running',
      value: 3.1,
      unit: 'miles',
      date: '2025-05-09',
      type: 'distance'
    }
  ],
  weeklyWorkoutCount: [1, 0, 1, 0, 0, 1, 0],
  monthlyWorkoutCount: [2, 4, 3, 5, 6, 3, 4, 5, 2, 3, 5, 3]
};

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

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [summary, setSummary] = useState<WorkoutSummary>(initialSummary);

  // Calculate stats and summary when workouts change
  useEffect(() => {
    calculateSummary();
  }, [workouts]);

  const calculateSummary = () => {
    // Sort workouts by date (newest first)
    const sortedWorkouts = [...workouts].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Calculate current streak
    let currentStreak = 0;
    let longestStreak = summary.longestStreak;
    
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
    
    longestStreak = Math.max(currentStreak, longestStreak);
    
    // Find personal records
    const personalRecords: PersonalRecord[] = [];
    
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (exercise.exerciseType === 'Strength') {
          // Check if this is a new PR for weight
          const existingPR = personalRecords.find(
            pr => pr.exerciseName === exercise.name && pr.type === 'weight'
          );
          
          if (!existingPR || exercise.weight > existingPR.value) {
            if (existingPR) {
              existingPR.value = exercise.weight;
              existingPR.date = workout.date;
            } else {
              personalRecords.push({
                exerciseName: exercise.name,
                value: exercise.weight,
                unit: 'lbs',
                date: workout.date,
                type: 'weight'
              });
            }
          }
        } else if (exercise.exerciseType === 'Cardio' && exercise.distance) {
          // Check if this is a new PR for distance
          const existingPR = personalRecords.find(
            pr => pr.exerciseName === exercise.name && pr.type === 'distance'
          );
          
          if (!existingPR || exercise.distance > existingPR.value) {
            if (existingPR) {
              existingPR.value = exercise.distance;
              existingPR.date = workout.date;
            } else {
              personalRecords.push({
                exerciseName: exercise.name,
                value: exercise.distance,
                unit: 'miles',
                date: workout.date,
                type: 'distance'
              });
            }
          }
        }
      });
    });
    
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
    const newWorkout = {
      ...workout,
      id: Math.random().toString(36).substring(2, 9)
    };
    
    setWorkouts(prev => [...prev, newWorkout]);
    toast.success('Workout added successfully!');
  };

  const updateWorkout = (workout: Workout) => {
    setWorkouts(prev => 
      prev.map(w => w.id === workout.id ? workout : w)
    );
    toast.success('Workout updated!');
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
    toast.success('Workout deleted!');
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
        searchWorkouts
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
