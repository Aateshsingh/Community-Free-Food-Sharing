import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import FoodCard from '@/components/FoodCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, FilterX } from 'lucide-react';
import { FoodItem } from '@/types';
import { useAuth } from '@/context/AuthContext';
import EmptyState from '@/components/EmptyState';
import { getFoodItems } from '@/services/supabaseService';
import { useQuery } from '@tanstack/react-query';

const FoodList = () => {
  const { user } = useAuth();
  const [filteredFoodItems, setFilteredFoodItems] = useState<FoodItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [foodType, setFoodType] = useState('all');
  const [location, setLocation] = useState('all');
  
  // Use React Query to fetch food items
  const { data: foodItems, isLoading, error } = useQuery({
    queryKey: ['foodItems'],
    queryFn: getFoodItems
  });
  
  // Get available food items
  const availableFoodItems = foodItems?.filter(item => item.status === 'available') || [];
  
  // Aggregate all available food types and locations for filters
  const foodTypes = foodItems 
    ? Array.from(new Set(foodItems.map(item => item.foodType)))
    : [];
    
  const locations = foodItems
    ? Array.from(new Set(foodItems.map(item => {
        const locationParts = item.pickupLocation.split(',');
        return locationParts[locationParts.length - 1].trim();
      })))
    : [];
  
  useEffect(() => {
    if (!availableFoodItems.length) return;
    
    let filtered = [...availableFoodItems];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.foodType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply food type filter
    if (foodType !== 'all') {
      filtered = filtered.filter(item => item.foodType === foodType);
    }
    
    // Apply location filter
    if (location !== 'all') {
      filtered = filtered.filter(item => {
        const locationParts = item.pickupLocation.split(',');
        const itemLocation = locationParts[locationParts.length - 1].trim();
        return itemLocation === location;
      });
    }
    
    setFilteredFoodItems(filtered);
  }, [searchTerm, foodType, location, availableFoodItems]);
  
  const resetFilters = () => {
    setSearchTerm('');
    setFoodType('all');
    setLocation('all');
  };
  
  const hasActiveFilters = searchTerm || foodType !== 'all' || location !== 'all';
  
  if (isLoading) {
    return (
      <MainLayout requireAuth={false}>
        <div className="container mx-auto px-4 mt-8">
          <div className="flex justify-center">
            <div className="animate-pulse space-y-6 w-full max-w-5xl">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-80 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (error) {
    return (
      <MainLayout requireAuth={false}>
        <div className="container mx-auto px-4 mt-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> Failed to load food items. Please try again later.</span>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-green to-secondary-orange bg-clip-text text-transparent mb-4">
                Available Food
              </h1>
              <p className="text-lg text-gray-300">
                Find available food donations in your community
              </p>
            </div>
            
            {user && user.role === 'donor' && (
              <Button asChild className="mt-4 md:mt-0 bg-primary-green hover:bg-primary-green/90 shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to="/donations/new">
                  Donate Food
                </Link>
              </Button>
            )}
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-8 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, description, or food type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-gray-700 text-gray-200 placeholder:text-gray-400 focus:border-primary-green focus:ring-primary-green/20"
                  />
                </div>
              </div>
              
              <div>
                <Select 
                  value={foodType} 
                  onValueChange={setFoodType}
                >
                  <SelectTrigger className="bg-white/10 border-gray-700 text-gray-200 focus:border-primary-green focus:ring-primary-green/20">
                    <SelectValue placeholder="Food Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all" className="text-gray-200">All Food Types</SelectItem>
                    {foodTypes.map(type => (
                      <SelectItem key={type} value={type} className="text-gray-200">{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select 
                  value={location} 
                  onValueChange={setLocation}
                >
                  <SelectTrigger className="bg-white/10 border-gray-700 text-gray-200 focus:border-primary-green focus:ring-primary-green/20">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all" className="text-gray-200">All Locations</SelectItem>
                    {locations.map(loc => (
                      <SelectItem key={loc} value={loc} className="text-gray-200">{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {hasActiveFilters && (
              <div className="mt-6 flex items-center">
                <div className="flex flex-wrap gap-2 mr-4">
                  {searchTerm && (
                    <Badge variant="secondary" className="px-3 py-1 bg-primary-green/20 text-primary-green border border-primary-green/30">
                      Search: {searchTerm}
                    </Badge>
                  )}
                  
                  {foodType !== 'all' && (
                    <Badge variant="secondary" className="px-3 py-1 bg-secondary-orange/20 text-secondary-orange border border-secondary-orange/30">
                      Type: {foodType}
                    </Badge>
                  )}
                  
                  {location !== 'all' && (
                    <Badge variant="secondary" className="px-3 py-1 bg-accent-blue/20 text-accent-blue border border-accent-blue/30">
                      Location: {location}
                    </Badge>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-gray-400 hover:text-gray-200 flex items-center gap-2"
                >
                  <FilterX className="h-4 w-4" />
                  Reset Filters
                </Button>
              </div>
            )}
          </div>

          {filteredFoodItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredFoodItems.map(food => (
                <div key={food.id} className="transform hover:-translate-y-1 transition-all duration-300">
                  <FoodCard food={food} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Food Items Found"
              description="Try adjusting your filters or check back later for new donations."
              icon={
                <div className="w-16 h-16 bg-primary-green/20 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-primary-green" />
                </div>
              }
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default FoodList;
