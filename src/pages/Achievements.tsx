
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useWorkout } from "@/context/WorkoutContext";
import { format, parseISO, differenceInDays } from "date-fns";
import { Award, Calendar, CheckCircle, Clock, Dumbbell, Trophy, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementCardProps {
  title: string;
  description: string;
  progress: number;
  icon: React.ReactNode;
  unlocked: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  progress,
  icon,
  unlocked
}) => {
  return (
    <Card className={cn(
      "transition-all duration-300 border",
      unlocked 
        ? "bg-accent/20 border-accent" 
        : "bg-card hover:bg-accent/5"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={cn(
            "rounded-full p-2.5",
            unlocked ? "bg-accent text-accent-foreground" : "bg-muted"
          )}>
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold">{title}</h3>
              {unlocked && (
                <div className="rounded-full bg-green-100 text-green-700 text-xs px-2 py-1 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Unlocked
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{Math.min(100, progress)}%</span>
              </div>
              <Progress value={Math.min(100, progress)} className="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Achievements: React.FC = () => {
  const { workouts, summary } = useWorkout();
  
  // Calculate metrics for achievements
  const totalWorkouts = workouts.length;
  const totalExercises = workouts.reduce((sum, workout) => sum + workout.exercises.length, 0);
  
  // Sort workouts by date
  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Calculate the total duration
  let totalDuration = 0;
  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      if ('durationMinutes' in exercise) {
        totalDuration += exercise.durationMinutes;
      }
    });
  });
  
  // Calculate streak
  const currentStreak = summary.currentStreak;
  
  // Count workout types
  const workoutTypeCount: Record<string, number> = {};
  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      workoutTypeCount[exercise.exerciseType] = (workoutTypeCount[exercise.exerciseType] || 0) + 1;
    });
  });
  
  // Define achievements
  const achievements = [
    {
      title: "First Workout",
      description: "Complete your first workout session",
      progress: totalWorkouts > 0 ? 100 : 0,
      icon: <Dumbbell className="h-5 w-5" />,
      unlocked: totalWorkouts > 0
    },
    {
      title: "Getting Started",
      description: "Complete 5 workouts",
      progress: (totalWorkouts / 5) * 100,
      icon: <Zap className="h-5 w-5" />,
      unlocked: totalWorkouts >= 5
    },
    {
      title: "Consistency King",
      description: "Maintain a 7-day workout streak",
      progress: (currentStreak / 7) * 100,
      icon: <Calendar className="h-5 w-5" />,
      unlocked: currentStreak >= 7
    },
    {
      title: "Workout Warrior",
      description: "Complete 20 total workouts",
      progress: (totalWorkouts / 20) * 100,
      icon: <Trophy className="h-5 w-5" />,
      unlocked: totalWorkouts >= 20
    },
    {
      title: "Exercise Explorer",
      description: "Try 5 different workout types",
      progress: (Object.keys(workoutTypeCount).length / 5) * 100,
      icon: <Award className="h-5 w-5" />,
      unlocked: Object.keys(workoutTypeCount).length >= 5
    },
    {
      title: "10 Hour Club",
      description: "Accumulate 10 hours (600 minutes) of workout time",
      progress: (totalDuration / 600) * 100,
      icon: <Clock className="h-5 w-5" />,
      unlocked: totalDuration >= 600
    },
    {
      title: "Strength Master",
      description: "Complete 15 strength training workouts",
      progress: ((workoutTypeCount["Strength"] || 0) / 15) * 100,
      icon: <Dumbbell className="h-5 w-5" />,
      unlocked: (workoutTypeCount["Strength"] || 0) >= 15
    },
    {
      title: "Cardio Champion",
      description: "Complete 15 cardio workouts",
      progress: ((workoutTypeCount["Cardio"] || 0) / 15) * 100,
      icon: <Zap className="h-5 w-5" />,
      unlocked: (workoutTypeCount["Cardio"] || 0) >= 15
    },
  ];
  
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  
  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground">Track your progress and earn achievements.</p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Achievement Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="text-4xl font-bold">{unlockedAchievements.length}</div>
            <div className="ml-3">
              <div className="font-medium">Achievements Unlocked</div>
              <div className="text-sm text-muted-foreground">
                {Math.round((unlockedAchievements.length / achievements.length) * 100)}% complete
              </div>
            </div>
            <div className="ml-auto">
              <div className="text-right">
                <div className="font-medium">{achievements.length - unlockedAchievements.length}</div>
                <div className="text-sm text-muted-foreground">
                  Remaining
                </div>
              </div>
            </div>
          </div>
          <Progress 
            value={(unlockedAchievements.length / achievements.length) * 100} 
            className="h-2 mt-4" 
          />
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-muted-foreground text-sm">Total Workouts</div>
            <div className="text-2xl font-bold mt-1">{totalWorkouts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-muted-foreground text-sm">Total Exercises</div>
            <div className="text-2xl font-bold mt-1">{totalExercises}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-muted-foreground text-sm">Workout Streak</div>
            <div className="text-2xl font-bold mt-1">{currentStreak} days</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-muted-foreground text-sm">Total Duration</div>
            <div className="text-2xl font-bold mt-1">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">All Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <AchievementCard key={index} {...achievement} />
          ))}
        </div>
      </div>
      
      {/* Motivational Quote */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="text-lg font-medium text-center italic">
            "The only bad workout is the one that didn't happen."
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Achievements;
