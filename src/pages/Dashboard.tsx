
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkout } from "@/context/WorkoutContext";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { format, parseISO, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar, ChartBar, Award, ArrowUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard: React.FC = () => {
  const { workouts, summary } = useWorkout();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get recent workouts (last 5)
  const recentWorkouts = [...workouts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Prepare weekly data for the chart
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const weeklyData = weekDays.map((day, index) => {
    const date = subDays(today, 6 - index);
    const formattedDate = format(date, 'yyyy-MM-dd');
    const dayWorkouts = workouts.filter(w => w.date === formattedDate);
    
    let durationSum = 0;
    dayWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if ('durationMinutes' in exercise) {
          durationSum += exercise.durationMinutes;
        }
      });
    });
    
    return {
      name: day,
      workouts: dayWorkouts.length,
      duration: durationSum
    };
  });

  // Prepare monthly data for the chart
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyData = monthNames.map((month, index) => {
    return {
      name: month,
      workouts: summary.monthlyWorkoutCount[index] || 0
    };
  });
  
  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Track your fitness progress and achievements.</p>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <div className="bg-primary/10 p-2 rounded-full">
              <ChartBar className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalWorkouts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Your lifetime workout count
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <div className="bg-secondary/10 p-2 rounded-full">
              <Calendar className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.currentStreak} days</div>
            <p className="text-xs text-muted-foreground mt-1">
              Keep it up! {summary.currentStreak > 0 ? "Great consistency!" : "Start a new streak today!"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
            <div className="bg-accent/10 p-2 rounded-full">
              <Award className="h-4 w-4 text-accent-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.longestStreak} days</div>
            <p className="text-xs text-muted-foreground mt-1">
              Your record streak
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 7 Days</CardTitle>
            <div className="bg-primary/10 p-2 rounded-full">
              <Clock className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.weeklyWorkoutCount.reduce((sum, count) => sum + count, 0)} workouts
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Weekly activity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Workouts */}
      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              {recentWorkouts.length > 0 ? (
                <div className="space-y-4">
                  {recentWorkouts.map((workout) => (
                    <div key={workout.id} className="workout-card">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">
                          {workout.exercises
                            .map((ex) => ex.name)
                            .slice(0, 2)
                            .join(", ")}
                          {workout.exercises.length > 2 && "..."}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(parseISO(workout.date), "MMM dd, yyyy")}
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="text-sm">
                          <span className="font-medium">{workout.exercises.length}</span> exercise
                          {workout.exercises.length !== 1 && "s"}
                        </div>
                        <div className="mt-2 flex space-x-2 flex-wrap gap-y-2">
                          {workout.exercises.map((ex, idx) => (
                            <span
                              key={idx}
                              className={cn("px-2 py-1 rounded-md text-xs", {
                                "bg-blue-50 text-blue-700": ex.exerciseType === "Strength",
                                "bg-green-50 text-green-700": ex.exerciseType === "Cardio",
                                "bg-purple-50 text-purple-700": ex.exerciseType === "Yoga",
                                "bg-orange-50 text-orange-700": ex.exerciseType === "HIIT",
                                "bg-gray-50 text-gray-700": ex.exerciseType === "Other",
                              })}
                            >
                              {ex.exerciseType}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No workouts recorded yet.</p>
                  <Button className="mt-4" variant="outline">
                    Record Your First Workout
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Records</CardTitle>
              </CardHeader>
              <CardContent>
                {summary.personalRecords.length > 0 ? (
                  <div className="space-y-4">
                    {summary.personalRecords.slice(0, 5).map((pr, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{pr.exerciseName}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(parseISO(pr.date), "MMM dd")}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="bg-green-50 text-green-600 px-2.5 py-0.5 rounded-md text-xs font-medium flex items-center">
                            <ArrowUp className="h-3 w-3 mr-1" /> {pr.value} {pr.unit}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No personal records yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="workouts" fill="#3B82F6" name="Workouts" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="workouts" fill="#3B82F6" name="Workouts" />
                    <Bar yAxisId="right" dataKey="duration" fill="#10B981" name="Duration (mins)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="workouts" 
                      stroke="#3B82F6" 
                      name="Workouts"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
