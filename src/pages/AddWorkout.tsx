
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useWorkout } from "@/context/WorkoutContext";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Exercise, WorkoutType } from "@/types/workout";
import { toast } from "@/components/ui/use-toast";

const AddWorkout: React.FC = () => {
  const navigate = useNavigate();
  const { addWorkout } = useWorkout();
  const [date, setDate] = useState<Date>(new Date());
  const [exercises, setExercises] = useState<Partial<Exercise>[]>([]);
  
  const handleAddExercise = (type: WorkoutType) => {
    if (type === "Strength") {
      setExercises([...exercises, { 
        exerciseType: "Strength", 
        name: "", 
        sets: 3, 
        reps: 10, 
        weight: 0 
      }]);
    } else if (type === "Cardio") {
      setExercises([...exercises, { 
        exerciseType: "Cardio", 
        name: "", 
        durationMinutes: 30,
        distance: 0
      }]);
    } else {
      setExercises([...exercises, { 
        exerciseType: type, 
        name: "", 
        durationMinutes: 30
      }]);
    }
  };
  
  const handleUpdateExercise = (index: number, field: string, value: any) => {
    const updatedExercises = [...exercises];
    (updatedExercises[index] as any)[field] = value;
    setExercises(updatedExercises);
  };
  
  const handleRemoveExercise = (index: number) => {
    const updatedExercises = [...exercises];
    updatedExercises.splice(index, 1);
    setExercises(updatedExercises);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (exercises.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one exercise",
        variant: "destructive"
      });
      return;
    }
    
    // Validate exercises
    const invalidExercises = exercises.filter(ex => !ex.name);
    if (invalidExercises.length > 0) {
      toast({
        title: "Error",
        description: "Please enter a name for all exercises",
        variant: "destructive"
      });
      return;
    }
    
    // Add workout and redirect to dashboard
    addWorkout({
      date: format(date, "yyyy-MM-dd"),
      exercises: exercises as Exercise[]
    });
    
    navigate("/");
  };
  
  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add New Workout</h1>
        <p className="text-muted-foreground">Record your workout details and track your progress.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workout Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {exercises.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Exercises</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {exercises.map((exercise, index) => (
                    <div key={index} className="border rounded-md p-4 relative">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveExercise(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>

                      <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Exercise Type</Label>
                            <div className="font-medium">{exercise.exerciseType}</div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`name-${index}`}>Exercise Name</Label>
                            <Input
                              id={`name-${index}`}
                              value={exercise.name || ""}
                              onChange={(e) => handleUpdateExercise(index, "name", e.target.value)}
                              placeholder="e.g. Bench Press, Running..."
                              required
                            />
                          </div>
                        </div>
                        
                        {exercise.exerciseType === "Strength" && (
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`sets-${index}`}>Sets</Label>
                              <Input
                                id={`sets-${index}`}
                                type="number"
                                min="1"
                                value={(exercise as any).sets}
                                onChange={(e) => handleUpdateExercise(index, "sets", parseInt(e.target.value))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`reps-${index}`}>Reps</Label>
                              <Input
                                id={`reps-${index}`}
                                type="number"
                                min="1"
                                value={(exercise as any).reps}
                                onChange={(e) => handleUpdateExercise(index, "reps", parseInt(e.target.value))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`weight-${index}`}>Weight (lbs)</Label>
                              <Input
                                id={`weight-${index}`}
                                type="number"
                                min="0"
                                step="2.5"
                                value={(exercise as any).weight}
                                onChange={(e) => handleUpdateExercise(index, "weight", parseFloat(e.target.value))}
                              />
                            </div>
                          </div>
                        )}
                        
                        {(exercise.exerciseType === "Cardio" || exercise.exerciseType === "Yoga" || 
                          exercise.exerciseType === "HIIT" || exercise.exerciseType === "Stretching" || 
                          exercise.exerciseType === "Other") && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`duration-${index}`}>Duration (minutes)</Label>
                              <Input
                                id={`duration-${index}`}
                                type="number"
                                min="1"
                                value={(exercise as any).durationMinutes}
                                onChange={(e) => handleUpdateExercise(index, "durationMinutes", parseInt(e.target.value))}
                              />
                            </div>
                            
                            {exercise.exerciseType === "Cardio" && (
                              <div className="space-y-2">
                                <Label htmlFor={`distance-${index}`}>Distance (miles)</Label>
                                <Input
                                  id={`distance-${index}`}
                                  type="number"
                                  min="0"
                                  step="0.1"
                                  value={(exercise as any).distance || ""}
                                  onChange={(e) => handleUpdateExercise(index, "distance", parseFloat(e.target.value) || 0)}
                                />
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <Label htmlFor={`notes-${index}`}>Notes</Label>
                          <Textarea
                            id={`notes-${index}`}
                            value={exercise.notes || ""}
                            onChange={(e) => handleUpdateExercise(index, "notes", e.target.value)}
                            placeholder="How did it feel? Any improvements?"
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Add Exercises</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col gap-1"
                    onClick={() => handleAddExercise("Strength")}
                  >
                    <span className="text-xl">🏋️</span>
                    <span>Strength</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col gap-1"
                    onClick={() => handleAddExercise("Cardio")}
                  >
                    <span className="text-xl">🏃</span>
                    <span>Cardio</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col gap-1"
                    onClick={() => handleAddExercise("Yoga")}
                  >
                    <span className="text-xl">🧘</span>
                    <span>Yoga</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col gap-1"
                    onClick={() => handleAddExercise("HIIT")}
                  >
                    <span className="text-xl">⚡</span>
                    <span>HIIT</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col gap-1"
                    onClick={() => handleAddExercise("Stretching")}
                  >
                    <span className="text-xl">🤸</span>
                    <span>Stretching</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col gap-1"
                    onClick={() => handleAddExercise("Other")}
                  >
                    <span className="text-xl">➕</span>
                    <span>Other</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={exercises.length === 0}>
              Save Workout
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddWorkout;
