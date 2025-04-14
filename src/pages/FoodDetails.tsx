import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, MapPin, ArrowLeft, AlertCircle, Share2, Facebook, Twitter, Instagram } from 'lucide-react';
import { FoodItem, Task } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '@/context/NotificationContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFoodItemById, acceptTask } from '@/services/supabaseService';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

const FoodDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refetchNotifications } = useNotifications();
  const queryClient = useQueryClient();
  
  const { 
    data: foodItem, 
    isLoading: isLoadingFood,
    error: foodError 
  } = useQuery({
    queryKey: ['foodItem', id],
    queryFn: () => (id ? getFoodItemById(id) : null),
    enabled: !!id
  });
  
  const { 
    data: tasks,
    isLoading: isLoadingTasks
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      if (!foodItem) return [];
      
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('food_item_id', foodItem.id);
        
      return data || [];
    },
    enabled: !!foodItem
  });
  
  const relatedTask = tasks && tasks.length > 0 ? {
    id: tasks[0].id,
    foodItemId: tasks[0].food_item_id,
    volunteerId: tasks[0].volunteer_id,
    status: tasks[0].status,
    createdAt: tasks[0].created_at,
    scheduledPickupTime: tasks[0].scheduled_pickup_time
  } : null;
  
  const acceptTaskMutation = useMutation({
    mutationFn: (data: { taskId: string, volunteerId: string }) => 
      acceptTask(data.taskId, data.volunteerId),
    onSuccess: () => {
      toast.success('Task accepted successfully');
      queryClient.invalidateQueries({ queryKey: ['foodItem', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      refetchNotifications();
    },
    onError: (error) => {
      toast.error('Failed to accept task');
      console.error('Error accepting task:', error);
    }
  });
  
  const handleAcceptTask = () => {
    if (!user || !relatedTask) return;
    
    acceptTaskMutation.mutate({ 
      taskId: relatedTask.id, 
      volunteerId: user.id 
    });
  };
  
  const calculateExpiryStatus = (foodItem: FoodItem) => {
    const expiryDate = new Date(foodItem.expiryDate);
    const isExpired = expiryDate < new Date();
    const isExpiringSoon = (
      expiryDate.getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000 &&
      expiryDate > new Date()
    );
    
    return { isExpired, isExpiringSoon };
  };
  
  if (isLoadingFood || isLoadingTasks) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
          <div className="container mx-auto px-4 py-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center min-h-[60vh]"
            >
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary-green/30"></div>
                <div className="h-4 w-24 rounded bg-primary-green/30"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (foodError || !foodItem) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
          <div className="container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Food item not found or could not be loaded.</AlertDescription>
              </Alert>
              <Button 
                variant="outline" 
                asChild 
                className="text-white border-white/20 hover:bg-white/10"
              >
                <Link to="/food" className="flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Food Listings
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  const { isExpired, isExpiringSoon } = calculateExpiryStatus(foodItem);
  
  const statusColors = {
    available: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    assigned: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  
  return (
    <MainLayout requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button 
              variant="outline" 
              asChild 
              className="mb-8 text-white border-white/20 hover:bg-white/10 group"
            >
              <Link to="/food" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Food Listings
              </Link>
            </Button>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 shadow-xl">
                <div className="relative">
                  <img 
                    src={foodItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1080'} 
                    alt={foodItem.title} 
                    className="w-full h-64 md:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Badge 
                      className={`${statusColors[foodItem.status]} border-2 px-3 py-1 text-sm font-medium shadow-lg`}
                    >
                      {foodItem.status.charAt(0).toUpperCase() + foodItem.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <motion.h1 
                      className="text-3xl font-bold text-white mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      {foodItem.title}
                    </motion.h1>
                    <div className="text-sm text-gray-400">
                      Posted {formatDistanceToNow(new Date(foodItem.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  
                  {(isExpired || isExpiringSoon) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <Alert 
                        variant={isExpired ? "destructive" : "default"}
                        className={`mb-6 ${isExpiringSoon && !isExpired ? 'border-amber-500 text-amber-800 bg-amber-50/90 backdrop-blur-sm' : ''}`}
                      >
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>
                          {isExpired ? "Expired Food" : "Expiring Soon"}
                        </AlertTitle>
                        <AlertDescription>
                          {isExpired 
                            ? "This food has passed its expiry date." 
                            : "This food will expire soon. Please collect it as soon as possible."}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                  
                  <motion.div 
                    className="prose prose-invert max-w-none mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <p className="text-gray-300">{foodItem.description}</p>
                  </motion.div>
                  
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <div className="flex items-center p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                      <div className="w-10 h-10 rounded-full bg-primary-green/20 flex items-center justify-center mr-3 group-hover:bg-primary-green/30 transition-colors">
                        <Calendar className="h-5 w-5 text-primary-green" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Expiry Date</div>
                        <div className="font-medium text-white">{new Date(foodItem.expiryDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                      <div className="w-10 h-10 rounded-full bg-primary-green/20 flex items-center justify-center mr-3 group-hover:bg-primary-green/30 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Quantity</div>
                        <div className="font-medium text-white">{foodItem.quantity}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                      <div className="w-10 h-10 rounded-full bg-primary-green/20 flex items-center justify-center mr-3 group-hover:bg-primary-green/30 transition-colors">
                        <Clock className="h-5 w-5 text-primary-green" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Pickup Time</div>
                        <div className="font-medium text-white">{foodItem.pickupTimeFrom} - {foodItem.pickupTimeTo}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                      <div className="w-10 h-10 rounded-full bg-primary-green/20 flex items-center justify-center mr-3 group-hover:bg-primary-green/30 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Food Type</div>
                        <div className="font-medium text-white">{foodItem.foodType}</div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <h3 className="text-xl font-semibold text-white mb-4">Pickup Location</h3>
                    <div className="flex items-start p-4 rounded-lg bg-white/5 border border-white/10">
                      <MapPin className="h-5 w-5 text-primary-green mr-2 mt-0.5" />
                      <div>
                        <p className="text-gray-300">{foodItem.pickupLocation}</p>
                        
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
                <h3 className="text-xl font-semibold text-white mb-4">Donor Information</h3>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4 ring-2 ring-primary-green/20">
                    <AvatarImage src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100" alt={foodItem.donorName} />
                    <AvatarFallback className="bg-primary-green/20 text-primary-green">{foodItem.donorName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-white">{foodItem.donorName}</div>
                    <div className="text-sm text-gray-400">Donor</div>
                  </div>
                </div>
              </div>
              
              {user?.role === 'volunteer' && foodItem.status === 'available' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">Volunteer Actions</h3>
                  <p className="text-gray-300 mb-4">
                    Help redistribute this food by accepting this task and coordinating the pickup.
                  </p>
                  <Button 
                    className="w-full bg-primary-green hover:bg-primary-green/90 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
                    onClick={handleAcceptTask}
                    disabled={acceptTaskMutation.isPending}
                  >
                    {acceptTaskMutation.isPending ? 'Processing...' : 'Accept Task'}
                  </Button>
                </motion.div>
              )}
              
              {(foodItem.status === 'assigned' || foodItem.status === 'completed') && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {foodItem.status === 'assigned' ? 'Task Assigned' : 'Task Completed'}
                  </h3>
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200">
                    <p>
                      {foodItem.status === 'assigned' 
                        ? 'A volunteer has accepted to pick up this food.' 
                        : 'This food has been picked up by a volunteer.'}
                    </p>
                  </div>
                </motion.div>
              )}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Share This Food</h3>
                  <Share2 className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-gray-300 mb-6">
                  Help spread the word about this available food to those who might need it.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-blue-400 transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-blue-400 transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-pink-400 transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FoodDetails;
