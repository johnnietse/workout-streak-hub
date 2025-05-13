
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  workoutDate: string;
}

const DeleteWorkoutDialog: React.FC<DeleteWorkoutDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  workoutDate
}) => {
  const handleDelete = () => {
    onConfirm();
    onClose();
  };

  // Format the date for better readability
  const formattedDate = new Date(workoutDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Workout</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your workout from {formattedDate}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete Workout</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteWorkoutDialog;
