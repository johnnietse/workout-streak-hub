
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Workout, Exercise, PersonalRecord } from '@/types/workout';
import { toast } from "@/components/ui/use-toast";

export const useWorkoutData = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // For now, we'll use fallback data since the database tables aren't reflected in types yet
  const fallbackWorkouts: Workout[] = [
    {
      id: '1',
      date: '2024-01-15',
      exercises: [
        {
          exerciseType: 'Strength',
          name: 'Bench Press',
          sets: 3,
          reps: 10,
          weight: 185,
          notes: 'Felt strong today'
        },
        {
          exerciseType: 'Strength',
          name: 'Squats',
          sets: 3,
          reps: 12,
          weight: 225
        }
      ]
    },
    {
      id: '2',
      date: '2024-01-14',
      exercises: [
        {
          exerciseType: 'Cardio',
          name: 'Running',
          durationMinutes: 30,
          distance: 3.1,
          notes: '5K run in the park'
        }
      ]
    }
  ];

  const fallbackPersonalRecords: PersonalRecord[] = [
    {
      exerciseName: 'Bench Press',
      value: 225,
      unit: 'lbs',
      date: '2024-01-10',
      type: 'weight'
    },
    {
      exerciseName: 'Running',
      value: 5.2,
      unit: 'miles',
      date: '2024-01-12',
      type: 'distance'
    }
  ];

  // Fetch workouts and exercises for the current user
  const fetchWorkouts = async () => {
    if (!user) {
      setWorkouts([]);
      return;
    }

    try {
      // For now, we'll use fallback data since the tables aren't in the type system yet
      // Once the Supabase types are updated, we can use real queries
      console.log('Using fallback workout data for user:', user.id);
      setWorkouts(fallbackWorkouts);
    } catch (error: any) {
      console.error('Error fetching workouts:', error);
      toast({
        title: "Error",
        description: "Failed to load workouts",
        variant: "destructive"
      });
    }
  };

  // Fetch personal records for the current user
  const fetchPersonalRecords = async () => {
    if (!user) {
      setPersonalRecords([]);
      return;
    }

    try {
      // For now, we'll use fallback data
      console.log('Using fallback personal records for user:', user.id);
      setPersonalRecords(fallbackPersonalRecords);
    } catch (error: any) {
      console.error('Error fetching personal records:', error);
    }
  };

  // Add a new workout
  const addWorkout = async (workout: Omit<Workout, 'id'>) => {
    if (!user) return;

    try {
      // For now, we'll add to local state
      const newWorkout = {
        ...workout,
        id: Date.now().toString()
      };

      setWorkouts(prev => [newWorkout, ...prev]);

      toast({
        title: "Success",
        description: "Workout added successfully!"
      });
    } catch (error: any) {
      console.error('Error adding workout:', error);
      toast({
        title: "Error",
        description: "Failed to add workout",
        variant: "destructive"
      });
    }
  };

  // Delete workout
  const deleteWorkout = async (id: string) => {
    try {
      setWorkouts(prev => prev.filter(w => w.id !== id));
      toast({
        title: "Success",
        description: "Workout deleted!"
      });
    } catch (error: any) {
      console.error('Error deleting workout:', error);
      toast({
        title: "Error",
        description: "Failed to delete workout",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      Promise.all([fetchWorkouts(), fetchPersonalRecords()]).finally(() => {
        setIsLoading(false);
      });
    } else {
      setWorkouts([]);
      setPersonalRecords([]);
      setIsLoading(false);
    }
  }, [user]);

  return {
    workouts,
    personalRecords,
    isLoading,
    addWorkout,
    deleteWorkout,
    refetch: () => {
      fetchWorkouts();
      fetchPersonalRecords();
    }
  };
};
