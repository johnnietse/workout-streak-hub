
import React, { useState, useEffect } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import WorkoutCard from '../components/WorkoutCard';
import { Search as SearchIcon, Calendar as CalendarIcon, Tag, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "@/components/ui/use-toast";

const Search: React.FC = () => {
  const { searchWorkouts, getWorkoutsByDateRange, getWorkoutsByType } = useWorkout();
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<'keyword' | 'date' | 'type'>('keyword');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [exerciseType, setExerciseType] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
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
    setIsSearching(true);
    
    setTimeout(() => {
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
      setIsSearching(false);
    }, 500); // Simulate a search delay for better UX
  };
  
  // Clear results when search type changes
  useEffect(() => {
    setResults([]);
  }, [searchType]);
  
  // Handle workout deletion and refresh results
  const handleWorkoutDeleted = () => {
    // Re-run the search to refresh results
    handleSearch();
    toast({
      title: "Workout deleted",
      description: "The workout has been successfully removed from your records."
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Search Workouts</h1>
      <p className="text-muted-foreground mb-6">Find your past workout sessions</p>
      
      <Card className="mb-6 overflow-hidden border-0 shadow-md">
        <CardHeader className="bg-primary/5 border-b pb-4">
          <CardTitle className="text-xl">Search Filters</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={searchType === 'keyword' ? 'default' : 'outline'}
                onClick={() => setSearchType('keyword')}
                className="gap-2 transition-all duration-300"
                size="sm"
              >
                <SearchIcon className="w-4 h-4" />
                By Keyword
              </Button>
              <Button
                variant={searchType === 'date' ? 'default' : 'outline'}
                onClick={() => setSearchType('date')}
                className="gap-2 transition-all duration-300"
                size="sm"
              >
                <CalendarIcon className="w-4 h-4" />
                By Date Range
              </Button>
              <Button
                variant={searchType === 'type' ? 'default' : 'outline'}
                onClick={() => setSearchType('type')}
                className="gap-2 transition-all duration-300"
                size="sm"
              >
                <Tag className="w-4 h-4" />
                By Exercise Type
              </Button>
            </div>
            
            <div className="space-y-4">
              {searchType === 'keyword' && (
                <div className="animate-slide-in">
                  <Label htmlFor="keyword-search" className="text-sm font-medium mb-1.5 block">Search for exercises, notes, or dates</Label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="keyword-search"
                      placeholder="E.g. bench press, morning run, etc."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
              
              {searchType === 'date' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-in">
                  <div>
                    <Label htmlFor="start-date" className="text-sm font-medium mb-1.5 block">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date" className="text-sm font-medium mb-1.5 block">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {searchType === 'type' && (
                <div className="animate-slide-in">
                  <Label htmlFor="exercise-type" className="text-sm font-medium mb-1.5 block">Exercise Type</Label>
                  <Select value={exerciseType} onValueChange={setExerciseType}>
                    <SelectTrigger id="exercise-type" className="w-full">
                      <SelectValue placeholder="Select Exercise Type" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="Strength">Strength Training</SelectItem>
                      <SelectItem value="Cardio">Cardio</SelectItem>
                      <SelectItem value="Yoga">Yoga</SelectItem>
                      <SelectItem value="HIIT">HIIT</SelectItem>
                      <SelectItem value="Stretching">Stretching</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full sm:w-auto"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Search Results</h2>
          {results.length > 0 && (
            <span className="text-sm text-muted-foreground">{results.length} workout{results.length !== 1 ? 's' : ''} found</span>
          )}
        </div>
        
        {isSearching ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {results.map((workout) => (
              <div key={workout.id} className="transform transition-all duration-300 hover:translate-y-[-2px]">
                <WorkoutCard 
                  workout={workout}
                  onDelete={handleWorkoutDeleted}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/30 py-12 text-center border border-dashed">
            <CardContent>
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <SearchIcon className="h-12 w-12 mb-3 text-muted-foreground/70" />
                <p className="text-lg font-medium">No workouts found</p>
                <p className="text-sm mt-1">Try adjusting your search criteria</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Search;
