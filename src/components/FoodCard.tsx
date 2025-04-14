import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FoodItem } from '@/types';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface FoodCardProps {
  food: FoodItem;
  actionButton?: React.ReactNode;
}

const FoodCard: React.FC<FoodCardProps> = ({ food, actionButton }) => {
  const statusColors = {
    available: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    assigned: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const expiryDate = new Date(food.expiryDate);
  const isExpiringSoon = expiryDate.getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000; // 3 days

  return (
    <Card className="group h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 border-gray-100 hover:border-primary-green/30">
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300'} 
          alt={food.title} 
          className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/50 transition-all duration-300" />
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
          <Badge 
            className={`${statusColors[food.status]} border-2 px-3 py-1 text-sm font-medium shadow-lg`}
          >
            {food.status.charAt(0).toUpperCase() + food.status.slice(1)}
          </Badge>
          {isExpiringSoon && (
            <Badge variant="destructive" className="ml-2 border-2 border-red-200 shadow-lg">
              Expiring Soon
            </Badge>
          )}
        </div>
      </div>
      
      <CardHeader className="pb-2 space-y-2 border-b border-gray-100">
        <CardTitle className="text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-primary-green transition-colors duration-300">
          {food.title}
        </CardTitle>
        <CardDescription className="text-sm font-medium text-gray-600">
          {food.foodType} • {formatDistanceToNow(new Date(food.createdAt), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-4 flex-grow pt-4">
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 italic border-l-4 border-primary-green/20 pl-3">
          "{food.description}"
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600 group/item hover:text-primary-green transition-colors">
            <Calendar className="h-4 w-4 mr-2 text-primary-green" />
            <span>Expires: {new Date(food.expiryDate).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 group/item hover:text-primary-green transition-colors">
            <Clock className="h-4 w-4 mr-2 text-primary-green" />
            <span>Pickup: {food.pickupTimeFrom} - {food.pickupTimeTo}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 group/item hover:text-primary-green transition-colors">
            <MapPin className="h-4 w-4 mr-2 text-primary-green" />
            <span className="line-clamp-1">{food.pickupLocation}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 group/item hover:text-primary-green transition-colors">
            <User className="h-4 w-4 mr-2 text-primary-green" />
            <span>By: {food.donorName}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 border-t border-gray-100">
        {actionButton || (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full bg-white hover:bg-primary-green hover:text-white border-2 border-primary-green text-primary-green transition-colors group-hover:shadow-md"
            asChild
          >
            <Link to={`/food/${food.id}`} className="flex items-center justify-center gap-2">
              View Details
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 transition-transform group-hover:translate-x-1" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FoodCard;
