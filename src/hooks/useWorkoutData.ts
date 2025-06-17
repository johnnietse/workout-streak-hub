
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

  // Fetch workouts and exercises for the current user
  const fetchWorkouts = async () => {
    if (!user) return;

    try {
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .select(`
          *,
          exercises (*)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (workoutError) throw workoutError;

      const formattedWorkouts: Workout[] = workoutData.map(workout => ({
        id: workout.id,
        date: workout.date,
        exercises: workout.exercises.map((ex: any) => ({
          exerciseType: ex.exercise_type,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          durationMinutes: ex.duration_minutes,
          distance: ex.distance,
          notes: ex.notes
        }))
      }));

      setWorkouts(formattedWorkouts);
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
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('personal_records')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedRecords: PersonalRecord[] = data.map(record => ({
        exerciseName: record.exercise_name,
        value: record.value,
        unit: record.unit,
        date: record.date,
        type: record.type as 'weight' | 'distance' | 'time'
      }));

      setPersonalRecords(formattedRecords);
    } catch (error: any) {
      console.error('Error fetching personal records:', error);
    }
  };

  // Add a new workout
  const addWorkout = async (workout: Omit<Workout, 'id'>) => {
    if (!user) return;

    try {
      // Insert workout
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          date: workout.date
        })
        .select()
        .single();

      if (workoutError) throw workoutError;

      // Insert exercises
      const exercisesToInsert = workout.exercises.map(exercise => ({
        workout_id: workoutData.id,
        exercise_type: exercise.exerciseType,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        duration_minutes: exercise.durationMinutes,
        distance: exercise.distance,
        notes: exercise.notes
      }));

      const { error: exerciseError } = await supabase
        .from('exercises')
        .insert(exercisesToInsert);

      if (exerciseError) throw exerciseError;

      // Update personal records if needed
      await updatePersonalRecords(workout.exercises);

      // Refresh data
      await fetchWorkouts();
      await fetchPersonalRecords();

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

  // Update personal records based on new exercises
  const updatePersonalRecords = async (exercises: Exercise[]) => {
    if (!user) return;

    for (const exercise of exercises) {
      if (exercise.exerciseType === 'Strength' && exercise.weight) {
        await upsertPersonalRecord({
          user_id: user.id,
          exercise_name: exercise.name,
          value: exercise.weight,
          unit: 'lbs',
          type: 'weight',
          date: new Date().toISOString().split('T')[0]
        });
      } else if (exercise.exerciseType === 'Cardio' && exercise.distance) {
        await upsertPersonalRecord({
          user_id: user.id,
          exercise_name: exercise.name,
          value: exercise.distance,
          unit: 'miles',
          type: 'distance',
          date: new Date().toISOString().split('T')[0]
        });
      }
    }
  };

  // Upsert personal record
  const upsertPersonalRecord = async (record: any) => {
    try {
      const { error } = await supabase
        .from('personal_records')
        .upsert(record, {
          onConflict: 'user_id,exercise_name,type'
        });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error updating personal record:', error);
    }
  };

  // Delete workout
  const deleteWorkout = async (id: string) => {
    try {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchWorkouts();
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
