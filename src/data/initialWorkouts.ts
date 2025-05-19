
import { Workout, WorkoutSummary } from '../types/workout';

/**
 * Sample workout data for development purposes
 */
export const initialWorkouts: Workout[] = [
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

/**
 * Initial workout summary state
 */
export const initialSummary: WorkoutSummary = {
  totalWorkouts: 0,
  currentStreak: 0,
  longestStreak: 0,
  personalRecords: [],
  weeklyWorkoutCount: [0, 0, 0, 0, 0, 0, 0],
  monthlyWorkoutCount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};
