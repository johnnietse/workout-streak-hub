
import React, { useState, useEffect } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { Calendar } from "@/components/ui/calendar";
import WorkoutCard from '../components/WorkoutCard';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, Check, Info } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from '@/lib/utils';
import { toast } from "@/components/ui/use-toast";

const CalendarView: React.FC = () => {
  const { workouts } = useWorkout();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedWorkout, setSelectedWorkout] = useState<any | null>(null);
  const [selectedDateString, setSelectedDateString] = useState<string>('');
  
  // Find workouts for the selected date
  useEffect(() => {
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      setSelectedDateString(dateString);
      const workout = workouts.find(w => w.date === dateString);
      setSelectedWorkout(workout || null);
    } else {
      setSelectedWorkout(null);
    }
  }, [selectedDate, workouts]);
  
  // Function to determine days with workouts for calendar highlighting
  const getWorkoutDates = () => {
    return workouts.map(workout => {
      return new Date(workout.date);
    });
  };
  
  const workoutDates = getWorkoutDates();

  // Handle workout deletion and update the selected workout accordingly
  const handleWorkoutDeleted = () => {
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      const workout = workouts.find(w => w.date === dateString);
      setSelectedWorkout(workout || null);
      toast({
        title: "Workout deleted",
        description: "The workout has been successfully removed."
      });
    }
  };
  
  // Get the current month for the header
  const currentMonth = selectedDate ? selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' }) : '';

  return (
    <div className="container mx-auto p-4 max-w-4xl animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Calendar</h1>
          <p className="text-muted-foreground">Track your fitness journey over time</p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0">
          <div className="flex items-center space-x-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-primary/20"></div>
            <span className="text-sm text-muted-foreground">Workout Day</span>
          </div>
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="flex items-center text-sm text-muted-foreground">
                <Info className="h-4 w-4 mr-1" />
                Help
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Calendar View Guide</h4>
                <p className="text-sm text-muted-foreground">
                  Click on any date to view workout details for that day. 
                  Highlighted dates indicate days with recorded workouts.
                </p>
                <div className="flex items-center pt-2">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Click on any date to view details</span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="order-2 md:order-1">
          <Card className="overflow-hidden shadow-md border-0">
            <div className="bg-primary/5 p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                <h3 className="font-medium">{currentMonth}</h3>
              </div>
            </div>
            <CardContent className="p-0">
              <div className="p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="w-full"
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
            </CardContent>
          </Card>
        </div>
        
        <div className="order-1 md:order-2">
          <div className="sticky top-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              {selectedDate ? (
                <span className="text-foreground">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              ) : 'Select a date'}
            </h2>
            
            <ScrollArea className="h-[500px] pr-4">
              {selectedWorkout ? (
                <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                  <WorkoutCard 
                    workout={selectedWorkout} 
                    onDelete={handleWorkoutDeleted}
                  />
                </div>
              ) : (
                <Card className="bg-muted/30 p-6 border border-dashed">
                  <CardContent className="p-0 flex flex-col items-center justify-center text-center min-h-[200px]">
                    <div className="bg-muted/50 p-4 rounded-full mb-3">
                      <CalendarIcon className="h-8 w-8 text-muted-foreground/70" />
                    </div>
                    <p className="font-medium text-lg">No workout recorded</p>
                    <p className="text-muted-foreground text-sm mt-1">There's no workout data for this date.</p>
                    <a 
                      href="/add-workout" 
                      className="mt-4 text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center"
                    >
                      Record a workout for this day
                    </a>
                  </CardContent>
                </Card>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
