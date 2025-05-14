
import React from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import WorkoutCard from '../components/WorkoutCard';
import { ChevronRight, TrendingUp, Award } from 'lucide-react';

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
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm">Track your fitness progress and achievements.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Workouts</p>
                <p className="text-2xl font-bold">{summary.totalWorkouts}</p>
                <p className="text-xs text-gray-500">Your lifetime workout count</p>
              </div>
              <div className="bg-blue-100 rounded-full p-2">
                <ChevronRight className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Current Streak</p>
                <p className="text-2xl font-bold">{summary.currentStreak} days</p>
                <p className="text-xs text-gray-500">Keep it up! Start a new streak today!</p>
              </div>
              <div className="bg-green-100 rounded-full p-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Longest Streak</p>
                <p className="text-2xl font-bold">{summary.longestStreak} days</p>
                <p className="text-xs text-gray-500">Your record streak</p>
              </div>
              <div className="bg-purple-100 rounded-full p-2">
                <Award className="w-4 h-4 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Last 7 Days</p>
                <p className="text-2xl font-bold">{summary.weeklyWorkoutCount.reduce((a, b) => a + b, 0)} workouts</p>
                <p className="text-xs text-gray-500">Weekly activity</p>
              </div>
              <div className="bg-blue-100 rounded-full p-2">
                <ChevronRight className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Weekly Activity section */}
          <div className="mb-8">
            <div className="flex mb-4 items-center">
              <h2 className="text-lg font-semibold">Weekly Activity</h2>
              <div className="ml-auto flex">
                <button className="px-3 py-1 text-sm text-primary bg-white border rounded-l-md">Overview</button>
                <button className="px-3 py-1 text-sm text-gray-500 bg-gray-100 border rounded-r-md">Monthly</button>
              </div>
            </div>
            
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="workouts" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent workouts section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Workouts</h2>
            <div className="space-y-4">
              {recentWorkouts.length > 0 ? (
                recentWorkouts.map(workout => (
                  <WorkoutCard 
                    key={workout.id} 
                    workout={workout}
                  />
                ))
              ) : (
                <div className="bg-white p-6 rounded-lg text-center">
                  <p className="text-gray-500">No workouts recorded yet. Start by adding a new workout!</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Personal records section */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Personal Records</h2>
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="space-y-4">
                {summary.personalRecords.length > 0 ? (
                  summary.personalRecords.map((record, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium">{record.exerciseName}</div>
                        <div className="text-sm text-gray-500">
                          {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {record.value} {record.unit}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No personal records yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
