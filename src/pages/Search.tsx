
import React, { useState, useEffect } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import WorkoutCard from '../components/WorkoutCard';

const Search: React.FC = () => {
  const { searchWorkouts, getWorkoutsByDateRange, getWorkoutsByType } = useWorkout();
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<'keyword' | 'date' | 'type'>('keyword');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [exerciseType, setExerciseType] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  
  // Set default dates when search type changes to date
  useEffect(() => {
    if (searchType === 'date') {
      // Default to last 30 days
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      
      setEndDate(end.toISOString().split('T')[0]);
      setStartDate(start.toISOString().split('T')[0]);
    }
  }, [searchType]);
  
  // Handle search
  const handleSearch = () => {
    if (searchType === 'keyword') {
      if (searchQuery.trim()) {
        const searchResults = searchWorkouts(searchQuery);
        setResults(searchResults || []);
      } else {
        setResults([]);
      }
    } else if (searchType === 'date') {
      if (startDate && endDate) {
        const dateResults = getWorkoutsByDateRange(startDate, endDate);
        setResults(dateResults || []);
      }
    } else if (searchType === 'type') {
      if (exerciseType) {
        const typeResults = getWorkoutsByType(exerciseType);
        setResults(typeResults || []);
      }
    }
  };
  
  // Clear results when search type changes
  useEffect(() => {
    setResults([]);
  }, [searchType]);
  
  // Handle workout deletion and refresh results
  const handleWorkoutDeleted = () => {
    // Re-run the search to refresh results
    handleSearch();
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Search Workouts</h1>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-6">
        <div className="mb-4">
          <div className="flex flex-wrap gap-4 mb-4">
            <Button
              variant={searchType === 'keyword' ? 'default' : 'outline'}
              onClick={() => setSearchType('keyword')}
            >
              By Keyword
            </Button>
            <Button
              variant={searchType === 'date' ? 'default' : 'outline'}
              onClick={() => setSearchType('date')}
            >
              By Date Range
            </Button>
            <Button
              variant={searchType === 'type' ? 'default' : 'outline'}
              onClick={() => setSearchType('type')}
            >
              By Exercise Type
            </Button>
          </div>
          
          {searchType === 'keyword' && (
            <div>
              <div className="mb-4">
                <Label htmlFor="keyword-search">Search for exercises, notes, or dates</Label>
                <Input
                  id="keyword-search"
                  placeholder="E.g. bench press, morning run, etc."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}
          
          {searchType === 'date' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}
          
          {searchType === 'type' && (
            <div className="mb-4">
              <Label htmlFor="exercise-type">Exercise Type</Label>
              <Select value={exerciseType} onValueChange={setExerciseType}>
                <SelectTrigger id="exercise-type" className="mt-1">
                  <SelectValue placeholder="Select Exercise Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Strength">Strength</SelectItem>
                  <SelectItem value="Cardio">Cardio</SelectItem>
                  <SelectItem value="Yoga">Yoga</SelectItem>
                  <SelectItem value="HIIT">HIIT</SelectItem>
                  <SelectItem value="Stretching">Stretching</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <Button onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Search Results</h2>
        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((workout) => (
              <WorkoutCard 
                key={workout.id} 
                workout={workout}
                onDelete={handleWorkoutDeleted}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No workouts found matching your search criteria.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
