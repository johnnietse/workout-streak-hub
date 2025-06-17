
export type WorkoutType = 'Strength' | 'Cardio' | 'Yoga' | 'HIIT' | 'Stretching' | 'Other';

export interface StrengthExercise {
  exerciseType: 'Strength';
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
}

export interface CardioExercise {
  exerciseType: 'Cardio';
  name: string;
  durationMinutes: number;
  distance?: number;
  notes?: string;
}

export interface OtherExercise {
  exerciseType: 'Yoga' | 'HIIT' | 'Stretching' | 'Other';
  name: string;
  durationMinutes: number;
  notes?: string;
}

export type Exercise = StrengthExercise | CardioExercise | OtherExercise;

export interface Workout {
  id: string;
  date: string;
  exercises: Exercise[];
}

export interface PersonalRecord {
  exerciseName: string;
  value: number;
  unit: string;
  date: string;
  type: 'weight' | 'distance' | 'time';
}

export interface WorkoutSummary {
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  personalRecords: PersonalRecord[];
  weeklyWorkoutCount: number[];
  monthlyWorkoutCount: number[];
}
