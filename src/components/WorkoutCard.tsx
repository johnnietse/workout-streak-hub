
import React, { useState } from 'react';
import { Workout } from '../types/workout';
import { useWorkout } from '../context/WorkoutContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DeleteWorkoutDialog from './DeleteWorkoutDialog';
import { Trash2 } from 'lucide-react';

interface WorkoutCardProps {
  workout: Workout;
  onDelete?: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onDelete }) => {
  const { deleteWorkout } = useWorkout();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    deleteWorkout(workout.id);
    if (onDelete) {
      onDelete();
    }
  };

  // Format the date for display
  const formattedDate = new Date(workout.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">{formattedDate}</CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsDeleteDialogOpen(true)}
              aria-label="Delete workout"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {workout.exercises.map((exercise, index) => (
            <div key={index} className="mb-2 last:mb-0">
              <h3 className="font-medium">{exercise.name}</h3>
              {exercise.exerciseType === 'Strength' && (
                <p className="text-sm text-muted-foreground">
                  {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight} lbs
                </p>
              )}
              {exercise.exerciseType === 'Cardio' && (
                <p className="text-sm text-muted-foreground">
                  {exercise.durationMinutes} mins
                  {exercise.distance && ` • ${exercise.distance} miles`}
                </p>
              )}
              {['Yoga', 'HIIT', 'Stretching', 'Other'].includes(exercise.exerciseType) && (
                <p className="text-sm text-muted-foreground">
                  {exercise.durationMinutes} mins • {exercise.exerciseType}
                </p>
              )}
              {exercise.notes && (
                <p className="text-xs italic mt-1">{exercise.notes}</p>
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter className="pt-0 text-xs text-muted-foreground">
          {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
        </CardFooter>
      </Card>

      <DeleteWorkoutDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        workoutDate={workout.date}
      />
    </>
  );
};

export default WorkoutCard;
