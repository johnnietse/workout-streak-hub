
import React, { useState, useEffect } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { Calendar } from "@/components/ui/calendar";
import WorkoutCard from '../components/WorkoutCard';

const CalendarView: React.FC = () => {
  const { workouts } = useWorkout();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedWorkout, setSelectedWorkout] = useState<any | null>(null);
  
  // Find workouts for the selected date
  useEffect(() => {
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      const workout = workouts.find(w => w.date === dateString);
      setSelectedWorkout(workout || null);
    } else {
      setSelectedWorkout(null);
    }
  }, [selectedDate, workouts]);
  
  // Function to determine days with workouts for calendar highlighting
  const getWorkoutDates = () => {
    return workouts.map(workout => {
      const date = new Date(workout.date);
      return date;
    });
  };
  
  const workoutDates = getWorkoutDates();

  // Handle workout deletion and update the selected workout accordingly
  const handleWorkoutDeleted = () => {
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      const workout = workouts.find(w => w.date === dateString);
      setSelectedWorkout(workout || null);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Calendar</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md"
              modifiers={{
                workout: workoutDates
              }}
              modifiersStyles={{
                workout: {
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  fontWeight: 'bold'
                }
              }}
            />
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Highlighted dates indicate workout days.
              <br />
              Click on a date to view workout details.
            </p>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {selectedDate ? (
              <span>
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            ) : 'Select a date'}
          </h2>
          
          {selectedWorkout ? (
            <WorkoutCard 
              workout={selectedWorkout} 
              onDelete={handleWorkoutDeleted}
            />
          ) : (
            <div className="bg-muted/30 p-6 rounded-lg text-center">
              <p>No workout recorded for this date.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
