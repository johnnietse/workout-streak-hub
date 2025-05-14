
import React, { useState, useEffect } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import WorkoutCard from '../components/WorkoutCard';
import { Calendar, ChevronDown, Search as SearchIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';

const Search: React.FC = () => {
  const { searchWorkouts, getWorkoutsByDateRange, getWorkoutsByType } = useWorkout();
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<'keyword' | 'date' | 'type'>('keyword');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [exerciseType, setExerciseType] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  
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

  // Calculate date range display
  const dateRangeText = startDate && endDate ? 
    `${format(new Date(startDate), 'MMM dd')} - ${format(new Date(endDate), 'MMM dd')}` : 
    'Select date range';

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Search Workouts</h1>
        <p className="text-gray-500 text-sm">Find and filter your past workouts.</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Search & Filter</h2>
        </div>
        
        <div className="p-4 grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6 relative">
            <div className="relative">
              <Input
                placeholder="Search by exercise name, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <SearchIcon className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="col-span-12 md:col-span-3">
            <Popover open={isTypeDropdownOpen} onOpenChange={setIsTypeDropdownOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  All Types
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <div className="py-1">
                  <button 
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
                    onClick={() => {
                      setExerciseType('');
                      setIsTypeDropdownOpen(false);
                    }}
                  >
                    All Types
                  </button>
                  <button 
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
                    onClick={() => {
                      setExerciseType('Strength');
                      setIsTypeDropdownOpen(false);
                    }}
                  >
                    Strength
                  </button>
                  <button 
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
                    onClick={() => {
                      setExerciseType('Cardio');
                      setIsTypeDropdownOpen(false);
                    }}
                  >
                    Cardio
                  </button>
                  <button 
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
                    onClick={() => {
                      setExerciseType('Yoga');
                      setIsTypeDropdownOpen(false);
                    }}
                  >
                    Yoga
                  </button>
                  <button 
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
                    onClick={() => {
                      setExerciseType('HIIT');
                      setIsTypeDropdownOpen(false);
                    }}
                  >
                    HIIT
                  </button>
                  <button 
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
                    onClick={() => {
                      setExerciseType('Stretching');
                      setIsTypeDropdownOpen(false);
                    }}
                  >
                    Stretching
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="col-span-12 md:col-span-3">
            <Button 
              variant="outline" 
              className="w-full justify-between"
            >
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">{dateRangeText}</span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="col-span-12">
            <Button 
              className="bg-blue-500 text-white"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
      
      {results.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Search Results</h2>
            <p className="text-sm text-gray-500">{results.length} workouts</p>
          </div>
          
          <div className="space-y-4">
            {results.map((workout) => (
              <WorkoutCard 
                key={workout.id} 
                workout={workout}
                onDelete={handleWorkoutDeleted}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
