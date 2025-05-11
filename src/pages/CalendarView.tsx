
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWorkout } from "@/context/WorkoutContext";
import { format, parseISO, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

const CalendarView: React.FC = () => {
  const { workouts } = useWorkout();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Get workouts for selected date
  const selectedWorkouts = workouts.filter(
    (workout) => selectedDate && isSameDay(parseISO(workout.date), selectedDate)
  );
  
  // Create a map of dates with workouts for calendar highlighting
  const workoutDates = workouts.reduce((acc, workout) => {
    const date = parseISO(workout.date);
    acc[format(date, "yyyy-MM-dd")] = {
      count: (acc[format(date, "yyyy-MM-dd")]?.count || 0) + 1,
      types: [
        ...(acc[format(date, "yyyy-MM-dd")]?.types || []),
        ...workout.exercises.map(ex => ex.exerciseType)
      ]
    };
    return acc;
  }, {} as Record<string, { count: number, types: string[] }>);
  
  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">View and manage your workout schedule.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Workout Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border shadow-sm pointer-events-auto"
              modifiers={{
                workout: (date) => !!workoutDates[format(date, "yyyy-MM-dd")]
              }}
              modifiersStyles={{
                workout: { 
                  fontWeight: "bold",
                  backgroundColor: "rgba(59, 130, 246, 0.1)"
                }
              }}
              components={{
                DayContent: ({ date, ...props }) => {
                  const formattedDate = format(date, "yyyy-MM-dd");
                  const hasWorkout = workoutDates[formattedDate];
                  
                  return (
                    <div className="relative flex items-center justify-center h-8 w-8">
                      <div {...props}>
                        {date.getDate()}
                      </div>
                      {hasWorkout && (
                        <div className="absolute bottom-0.5 flex space-x-0.5">
                          {Array.from(new Set(hasWorkout.types)).slice(0, 3).map((type, idx) => (
                            <div
                              key={idx}
                              className={cn("w-1.5 h-1.5 rounded-full", {
                                "bg-blue-500": type === "Strength",
                                "bg-green-500": type === "Cardio",
                                "bg-purple-500": type === "Yoga",
                                "bg-orange-500": type === "HIIT",
                                "bg-gray-500": type === "Stretching" || type === "Other"
                              })}
                              aria-hidden
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
              }}
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs">Strength</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs">Cardio</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-xs">Yoga</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-xs">HIIT</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-xs">Other</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate
                ? format(selectedDate, "MMMM d, yyyy")
                : "Select a date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedWorkouts.length > 0 ? (
              <div className="space-y-4">
                {selectedWorkouts.map((workout) => (
                  <div key={workout.id} className="workout-card">
                    {workout.exercises.map((exercise, idx) => (
                      <div key={idx} className="py-2 border-b last:border-0">
                        <div className="flex justify-between">
                          <span className="font-medium">{exercise.name}</span>
                          <Badge variant="outline" className={cn({
                            "bg-blue-50 text-blue-700 hover:bg-blue-50": exercise.exerciseType === "Strength",
                            "bg-green-50 text-green-700 hover:bg-green-50": exercise.exerciseType === "Cardio",
                            "bg-purple-50 text-purple-700 hover:bg-purple-50": exercise.exerciseType === "Yoga",
                            "bg-orange-50 text-orange-700 hover:bg-orange-50": exercise.exerciseType === "HIIT",
                            "bg-gray-50 text-gray-700 hover:bg-gray-50": exercise.exerciseType === "Stretching" || exercise.exerciseType === "Other",
                          })}>
                            {exercise.exerciseType}
                          </Badge>
                        </div>
                        
                        <div className="mt-1 text-sm">
                          {'sets' in exercise ? (
                            <div className="flex flex-wrap gap-1">
                              <span>{exercise.sets} sets</span>
                              <span>•</span>
                              <span>{exercise.reps} reps</span>
                              {exercise.weight && (
                                <>
                                  <span>•</span>
                                  <span>{exercise.weight} lbs</span>
                                </>
                              )}
                            </div>
                          ) : 'durationMinutes' in exercise ? (
                            <div>
                              {exercise.durationMinutes} minutes
                              {exercise.distance && <span> • {exercise.distance} miles</span>}
                            </div>
                          ) : null}
                        </div>
                        
                        {exercise.notes && (
                          <div className="mt-2 text-xs text-muted-foreground italic">
                            "{exercise.notes}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : selectedDate ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No workouts recorded for this date.</p>
                <a href="/add-workout" className="inline-block mt-2 text-sm text-primary">
                  Add a workout for this day
                </a>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Select a date to view workouts</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;
