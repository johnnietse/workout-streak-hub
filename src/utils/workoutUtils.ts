
import { Workout, WorkoutSummary, PersonalRecord } from '../types/workout';

/**
 * Calculate workout summary statistics from workout data
 */
export const calculateWorkoutSummary = (workouts: Workout[]): WorkoutSummary => {
  if (workouts.length === 0) {
    return {
      totalWorkouts: 0,
      currentStreak: 0,
      longestStreak: 0,
      personalRecords: [],
      weeklyWorkoutCount: [0, 0, 0, 0, 0, 0, 0],
      monthlyWorkoutCount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
  }
  
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
  
  return {
    totalWorkouts: workouts.length,
    currentStreak,
    longestStreak,
    personalRecords,
    weeklyWorkoutCount,
    monthlyWorkoutCount
  };
};

/**
 * Filter workouts by date range
 */
export const getWorkoutsByDateRange = (workouts: Workout[], start: string, end: string): Workout[] => {
  return workouts.filter(w => {
    const workoutDate = new Date(w.date).getTime();
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    return workoutDate >= startDate && workoutDate <= endDate;
  });
};

/**
 * Filter workouts by exercise type
 */
export const getWorkoutsByType = (workouts: Workout[], type: string): Workout[] => {
  return workouts.filter(w => 
    w.exercises.some(e => e.exerciseType.toLowerCase() === type.toLowerCase())
  );
};

/**
 * Search workouts by query string
 */
export const searchWorkouts = (workouts: Workout[], query: string): Workout[] => {
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
