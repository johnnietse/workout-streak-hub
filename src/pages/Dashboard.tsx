
import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import WorkoutCard from '../components/WorkoutCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChartIcon, CalendarIcon, InfoIcon } from 'lucide-react';

const Dashboard = () => {
  const { workouts, summary } = useWorkout();
  const [activeTab, setActiveTab] = useState("overview");
  
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
      // Adding a dummy duration for the chart
      duration: Math.floor(Math.random() * 30) + 15 // Random duration between 15-45 mins
    };
  }).reverse();

  // Format monthly data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = months.map(month => ({
    month,
    workouts: month === 'Jan' ? 3 : month === 'Feb' ? 1 : 0
  }));

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Track your fitness progress and achievements.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalWorkouts}</div>
            <div className="text-xs text-muted-foreground">Your lifetime workout count</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.currentStreak} days</div>
            <div className="text-xs text-muted-foreground">Keep it up! Start a new streak today!</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Longest Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.longestStreak} days</div>
            <div className="text-xs text-muted-foreground">Your record streak</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weeklyData.reduce((total, day) => total + day.workouts, 0)} workouts
            </div>
            <div className="text-xs text-muted-foreground">Weekly activity</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <InfoIcon className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <BarChartIcon className="w-4 h-4" />
            Monthly
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="border rounded-lg p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
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
            
            <Card>
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
        </TabsContent>
        
        <TabsContent value="weekly" className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Weekly Activity</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="workouts" name="Workouts" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="duration" name="Duration (mins)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="monthly" className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Monthly Activity</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="workouts" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
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
    </div>
  );
};

export default Dashboard;
