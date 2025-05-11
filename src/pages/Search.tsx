
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkout } from "@/context/WorkoutContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO, subMonths } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Search as SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Workout, WorkoutType } from "@/types/workout";
import { DateRange } from "react-day-picker";

const Search: React.FC = () => {
  const { workouts, searchWorkouts } = useWorkout();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>(workouts);
  const [exerciseTypeFilter, setExerciseTypeFilter] = useState<WorkoutType | "All">("All");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });
  
  const handleSearch = () => {
    let results = searchQuery ? searchWorkouts(searchQuery) : workouts;
    
    // Apply exercise type filter
    if (exerciseTypeFilter !== "All") {
      results = results.filter(workout =>
        workout.exercises.some(exercise => exercise.exerciseType === exerciseTypeFilter)
      );
    }
    
    // Apply date range filter - Added null checks to prevent runtime errors
    if (dateRange && (dateRange.from || dateRange.to)) {
      results = results.filter(workout => {
        const workoutDate = new Date(workout.date).getTime();
        
        if (dateRange.from && dateRange.to) {
          return workoutDate >= dateRange.from.getTime() && workoutDate <= dateRange.to.getTime();
        } else if (dateRange.from) {
          return workoutDate >= dateRange.from.getTime();
        } else if (dateRange.to) {
          return workoutDate <= dateRange.to.getTime();
        }
        
        return true;
      });
    }
    
    setFilteredWorkouts(results);
  };
  
  React.useEffect(() => {
    handleSearch();
  }, [workouts, exerciseTypeFilter, dateRange]);
  
  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Search Workouts</h1>
        <p className="text-muted-foreground">Find and filter your past workouts.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by exercise name, notes..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Select
                  value={exerciseTypeFilter}
                  onValueChange={(value) => setExerciseTypeFilter(value as WorkoutType | "All")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="Strength">Strength</SelectItem>
                    <SelectItem value="Cardio">Cardio</SelectItem>
                    <SelectItem value="Yoga">Yoga</SelectItem>
                    <SelectItem value="HIIT">HIIT</SelectItem>
                    <SelectItem value="Stretching">Stretching</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd")} -{" "}
                            {format(dateRange.to, "LLL dd")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-4">
          Search Results 
          <Badge variant="outline" className="ml-2">
            {filteredWorkouts.length} workouts
          </Badge>
        </h2>
        
        {filteredWorkouts.length > 0 ? (
          <div className="space-y-4">
            {filteredWorkouts.map((workout) => (
              <Card key={workout.id} className="workout-card hover:bg-accent/5">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-medium">
                        {workout.exercises
                          .map((ex) => ex.name)
                          .slice(0, 2)
                          .join(", ")}
                        {workout.exercises.length > 2 && "..."}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(workout.date), "EEEE, MMMM d, yyyy")}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(new Set(workout.exercises.map(ex => ex.exerciseType))).map((type, idx) => (
                        <Badge 
                          key={idx} 
                          variant="outline"
                          className={cn({
                            "bg-blue-50 text-blue-700 hover:bg-blue-50": type === "Strength",
                            "bg-green-50 text-green-700 hover:bg-green-50": type === "Cardio",
                            "bg-purple-50 text-purple-700 hover:bg-purple-50": type === "Yoga",
                            "bg-orange-50 text-orange-700 hover:bg-orange-50": type === "HIIT",
                            "bg-gray-50 text-gray-700 hover:bg-gray-50": type === "Stretching" || type === "Other",
                          })}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-sm">
                      <span className="font-medium">{workout.exercises.length}</span> exercise
                      {workout.exercises.length !== 1 && "s"}
                    </div>
                    
                    <div className="mt-2">
                      {workout.exercises.map((exercise, idx) => (
                        <div key={idx} className="mt-2 text-sm">
                          <span className="font-medium">{exercise.name}</span>
                          {': '}
                          {'sets' in exercise ? (
                            <span>
                              {exercise.sets} sets x {exercise.reps} reps {exercise.weight ? `@ ${exercise.weight} lbs` : ''}
                            </span>
                          ) : 'durationMinutes' in exercise ? (
                            <span>
                              {exercise.durationMinutes} min
                              {exercise.exerciseType === 'Cardio' && 'distance' in exercise && exercise.distance ? ` • ${exercise.distance} miles` : ''}
                            </span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium">No workouts found</h3>
            <p className="text-muted-foreground">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
