
import { useContext } from 'react';
import { WorkoutContext } from '../context/WorkoutContext';

/**
 * Custom hook for accessing the workout context
 */
export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
