import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Task, FoodItem } from '@/types';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useNotifications } from '@/context/NotificationContext';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { acceptTask, completeTask, getFoodItemById } from '@/services/supabaseService';

interface TaskCardProps {
  task: Task;
  onUpdate?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate }) => {
  const { user } = useAuth();
  const { refetchNotifications } = useNotifications();
  const queryClient = useQueryClient();
  
  // Fetch food item details
  const { data: foodItem, isLoading } = useQuery({
    queryKey: ['foodItem', task.foodItemId],
    queryFn: () => getFoodItemById(task.foodItemId)
  });
  
  // Mutations for task actions
  const acceptTaskMutation = useMutation({
    mutationFn: (data: { taskId: string, volunteerId: string }) => 
      acceptTask(data.taskId, data.volunteerId),
    onSuccess: () => {
      toast.success('Task accepted successfully');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['foodItem', task.foodItemId] });
      refetchNotifications();
      if (onUpdate) onUpdate();
    },
    onError: (error) => {
      toast.error('Failed to accept task');
      console.error('Error accepting task:', error);
    }
  });
  
  const completeTaskMutation = useMutation({
    mutationFn: (taskId: string) => completeTask(taskId),
    onSuccess: () => {
      toast.success('Task marked as completed');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['foodItem', task.foodItemId] });
      refetchNotifications();
      if (onUpdate) onUpdate();
    },
    onError: (error) => {
      toast.error('Failed to complete task');
      console.error('Error completing task:', error);
    }
  });
  
  const handleAcceptTask = () => {
    if (user) {
      acceptTaskMutation.mutate({ taskId: task.id, volunteerId: user.id });
    }
  };
  
  const handleCompleteTask = () => {
    completeTaskMutation.mutate(task.id);
  };
  
  if (isLoading || !foodItem) {
    return (
      <Card className="h-full flex flex-col overflow-hidden bg-white/10 backdrop-blur-sm border-white/10 animate-pulse">
        <div className="p-6 space-y-6">
          <div className="h-6 bg-gray-700/50 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
          <div className="h-20 bg-gray-700/50 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700/50 rounded w-full"></div>
            <div className="h-4 bg-gray-700/50 rounded w-full"></div>
          </div>
        </div>
      </Card>
    );
  }
  
  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20',
    accepted: 'bg-accent-blue/20 text-accent-blue border-accent-blue/20',
    completed: 'bg-green-500/20 text-green-500 border-green-500/20',
  };
  
  return (
    <Card className="group h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/10 backdrop-blur-sm border-2 border-white/10 hover:border-primary-green/30">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-white group-hover:text-primary-green transition-colors duration-300">
            {foodItem.title}
          </CardTitle>
          <Badge 
            className={`ml-2 border-2 px-3 py-1 text-sm font-medium shadow-lg ${statusColors[task.status]}`}
          >
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </Badge>
        </div>
        <p className="text-sm text-gray-400">
          Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
        </p>
      </CardHeader>
      
      <CardContent className="pb-4 flex-grow">
        <p className="text-sm text-gray-300 line-clamp-2 mb-4 italic border-l-4 border-primary-green/20 pl-3">
          "{foodItem.description}"
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-300 group/item hover:text-primary-green transition-colors">
            <Calendar className="h-4 w-4 mr-2 text-primary-green" />
            <span>Expires: {new Date(foodItem.expiryDate).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-300 group/item hover:text-primary-green transition-colors">
            <Clock className="h-4 w-4 mr-2 text-primary-green" />
            <span>Pickup: {foodItem.pickupTimeFrom} - {foodItem.pickupTimeTo}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-300 group/item hover:text-primary-green transition-colors">
            <MapPin className="h-4 w-4 mr-2 text-primary-green" />
            <span className="line-clamp-1">{foodItem.pickupLocation}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 border-t border-white/10">
        <div className="w-full flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Donor: {foodItem.donorName}
          </div>
          
          {task.status === 'pending' && user?.role === 'volunteer' && (
            <Button 
              variant="default" 
              size="sm"
              onClick={handleAcceptTask}
              disabled={acceptTaskMutation.isPending}
              className="bg-primary-green hover:bg-primary-green/90 text-white flex items-center gap-2 group-hover:translate-x-1 transition-all duration-300"
            >
              {acceptTaskMutation.isPending ? 'Processing...' : (
                <>
                  Accept Task
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </>
              )}
            </Button>
          )}
          
          {task.status === 'accepted' && task.volunteerId === user?.id && (
            <Button 
              variant="default" 
              size="sm"
              onClick={handleCompleteTask}
              disabled={completeTaskMutation.isPending}
              className="bg-accent-blue hover:bg-accent-blue/90 text-white flex items-center gap-2 group-hover:translate-x-1 transition-all duration-300"
            >
              {completeTaskMutation.isPending ? 'Processing...' : (
                <>
                  Mark Completed
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </>
              )}
            </Button>
          )}
        </div>
        
        {task.scheduledPickupTime && (
          <div className="w-full mt-4 text-sm bg-accent-blue/20 text-accent-blue p-3 rounded-lg border border-accent-blue/20">
            Scheduled pickup: {new Date(task.scheduledPickupTime).toLocaleString()}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
