
import React, { useState } from "react";
import { useWorkout } from "@/context/WorkoutContext";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const CalendarView: React.FC = () => {
  const { workouts } = useWorkout();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Get workouts for selected date
  const selectedDateWorkouts = workouts.filter(
    (workout) => selectedDate && workout.date === format(selectedDate, "yyyy-MM-dd")
  );
  
  // Get dates that have workouts
  const workoutDates = workouts.map((workout) => new Date(workout.date));
  
  // Custom day content to show indicators for workout days
  const DayContent = (day: Date, modifiers: { selected?: boolean; disabled?: boolean; today?: boolean }) => {
    const date = format(day, "yyyy-MM-dd");
    const hasWorkout = workouts.some((w) => w.date === date);
    
    return (
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md p-0",
          hasWorkout && !modifiers.selected && "border-2 border-primary/50",
          modifiers.selected && "bg-primary text-primary-foreground font-semibold"
        )}
      >
        <time dateTime={date}>{format(day, "d")}</time>
        {hasWorkout && (
          <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" />
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Workout Calendar</h1>
        <p className="text-muted-foreground">Track your workouts through time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full"
              components={{
                DayContent: ({ date, activeModifiers }) =>
                  DayContent(date, {
                    selected: Boolean(activeModifiers.selected),
                    disabled: Boolean(activeModifiers.disabled),
                    today: Boolean(activeModifiers.today),
                  }),
              }}
            />
          </CardContent>
        </Card>

        {/* Selected Day Workouts */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate
                ? format(selectedDate, "EEEE, MMMM d, yyyy")
                : "Select a Date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateWorkouts.length > 0 ? (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {selectedDateWorkouts.map((workout) => (
                    <div key={workout.id} className="p-4 border rounded-lg">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {Array.from(
                          new Set(workout.exercises.map((e) => e.exerciseType))
                        ).map((type, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className={cn({
                              "bg-blue-50 text-blue-700": type === "Strength",
                              "bg-green-50 text-green-700": type === "Cardio",
                              "bg-purple-50 text-purple-700": type === "Yoga",
                              "bg-orange-50 text-orange-700": type === "HIIT",
                              "bg-gray-50 text-gray-700": type === "Stretching" || type === "Other",
                            })}
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>

                      <h3 className="font-medium mb-2">Exercises:</h3>

                      <div className="space-y-2">
                        {workout.exercises.map((exercise, idx) => (
                          <div key={idx} className="text-sm">
                            <p className="font-medium">{exercise.name}</p>
                            {'sets' in exercise ? (
                              <p>
                                {exercise.sets} sets x {exercise.reps} reps
                                {exercise.weight ? ` @ ${exercise.weight} lbs` : ""}
                              </p>
                            ) : 'durationMinutes' in exercise ? (
                              <p>
                                Duration: {exercise.durationMinutes} minutes
                                {exercise.exerciseType === 'Cardio' && 'distance' in exercise && exercise.distance ? ` • Distance: ${exercise.distance} miles` : ''}
                              </p>
                            ) : null}
                            {exercise.notes && (
                              <p className="text-muted-foreground italic">
                                "{exercise.notes}"
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : selectedDate ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-2">No workouts recorded</p>
                <p>💪 Rest day or missing entry? 💪</p>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  Select a date to view workouts
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;
