
import React from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import WorkoutCard from '../components/WorkoutCard';

const Dashboard = () => {
  const { workouts, summary } = useWorkout();
  
  // Sort workouts by date (newest first)
  const sortedWorkouts = [...workouts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get recent workouts (last 5)
  const recentWorkouts = sortedWorkouts.slice(0, 5);
  
  // Format weekly workout data for chart
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyData = summary.weeklyWorkoutCount.map((count, index) => {
    // Calculate the day index (starting from today and going backward)
    const todayIndex = new Date().getDay();
    const dayIndex = (todayIndex - index + 7) % 7;
    
    return {
      day: daysOfWeek[dayIndex],
      workouts: count,
    };
  }).reverse();

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Fitness Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalWorkouts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.currentStreak} days</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.longestStreak} days</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="workouts" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Personal Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary.personalRecords.length > 0 ? (
                summary.personalRecords.map((record, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{record.exerciseName}</div>
                      <div className="text-sm text-muted-foreground">
                        {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {record.value} {record.unit}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No personal records yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Recent Workouts</h2>
      <div className="space-y-4">
        {recentWorkouts.length > 0 ? (
          recentWorkouts.map(workout => (
            <WorkoutCard 
              key={workout.id} 
              workout={workout}
            />
          ))
        ) : (
          <p className="text-muted-foreground">No workouts recorded yet. Start by adding a new workout!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
