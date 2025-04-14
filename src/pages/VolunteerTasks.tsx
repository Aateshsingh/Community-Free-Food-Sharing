import React from 'react';
import MainLayout from '@/components/MainLayout';
import TaskCard from '@/components/TaskCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Task } from '@/types';
import { useAuth } from '@/context/AuthContext';
import EmptyState from '@/components/EmptyState';
import { CheckCircle2, Clock, ClipboardList, Sparkles } from 'lucide-react';
import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { getTasks, getTasksByVolunteer } from '@/services/supabaseService';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const VolunteerTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState('pending');

  // Fetch all pending tasks
  const { data: allTasks, isLoading: isLoadingAllTasks } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: getTasks,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error: Error) => {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch available tasks');
    }
  } as UseQueryOptions<Task[]>);

  // Fetch volunteer-specific tasks
  const { data: volunteerTasks, isLoading: isLoadingVolunteerTasks } = useQuery<Task[]>({
    queryKey: ['tasks', 'volunteer', user?.id],
    queryFn: () => user?.id ? getTasksByVolunteer(user.id) : Promise.resolve([]),
    enabled: !!user?.id,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error: Error) => {
      console.error('Error fetching volunteer tasks:', error);
      toast.error('Failed to fetch your tasks');
    }
  } as UseQueryOptions<Task[]>);

  // Organize tasks into categories
  const pendingTasks = allTasks?.filter(task => task.status === 'pending') || [];
  const acceptedTasks = volunteerTasks?.filter(task => task.status === 'accepted') || [];
  const completedTasks = volunteerTasks?.filter(task => task.status === 'completed') || [];

  // Refresh tasks when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    if (user?.id) {
      queryClient.invalidateQueries({ queryKey: ['tasks', 'volunteer', user.id] });
    }
  };

  // Function to handle navigation to pending tasks
  const handleNavigateToPending = () => {
    setActiveTab('pending');
  };

  return (
    <MainLayout requireAuth>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="container mx-auto px-4 py-12 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-green/20 text-primary-green mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Volunteer Dashboard</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Volunteer Tasks</h1>
            <p className="text-xl text-gray-300">
              Help distribute food by taking on available tasks
            </p>
          </motion.div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8 bg-gray-800/50 p-1 rounded-lg">
              <TabsTrigger 
                value="pending"
                className="data-[state=active]:bg-primary-green data-[state=active]:text-white text-gray-300"
              >
                Available
                {pendingTasks.length > 0 && (
                  <span className="ml-2 bg-yellow-500/20 text-yellow-500 text-xs py-0.5 px-2 rounded-full border border-yellow-500/20">
                    {pendingTasks.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="accepted"
                className="data-[state=active]:bg-accent-blue data-[state=active]:text-white text-gray-300"
              >
                My Tasks
                {acceptedTasks.length > 0 && (
                  <span className="ml-2 bg-accent-blue/20 text-accent-blue text-xs py-0.5 px-2 rounded-full border border-accent-blue/20">
                    {acceptedTasks.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="completed"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-300"
              >
                Completed
                {completedTasks.length > 0 && (
                  <span className="ml-2 bg-green-500/20 text-green-500 text-xs py-0.5 px-2 rounded-full border border-green-500/20">
                    {completedTasks.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              {isLoadingAllTasks ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-green"></div>
                </div>
              ) : pendingTasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <EmptyState
                    title="No available tasks"
                    description="There are currently no available tasks. Check back later."
                    icon={
                      <div className="w-16 h-16 bg-primary-green/20 rounded-full flex items-center justify-center">
                        <ClipboardList className="h-8 w-8 text-primary-green" />
                      </div>
                    }
                  />
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {pendingTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <TaskCard 
                        task={task} 
                        onUpdate={() => {
                          queryClient.invalidateQueries({ queryKey: ['tasks'] });
                          if (user?.id) {
                            queryClient.invalidateQueries({ queryKey: ['tasks', 'volunteer', user.id] });
                          }
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
            
            <TabsContent value="accepted">
              {isLoadingVolunteerTasks ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-blue"></div>
                </div>
              ) : acceptedTasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <EmptyState
                    title="No active tasks"
                    description="You haven't accepted any tasks yet. Browse available tasks to get started."
                    icon={
                      <div className="w-16 h-16 bg-accent-blue/20 rounded-full flex items-center justify-center">
                        <Clock className="h-8 w-8 text-accent-blue" />
                      </div>
                    }
                    action={{
                      label: "Browse Available Tasks",
                      href: "#"
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {acceptedTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <TaskCard 
                        task={task} 
                        onUpdate={() => {
                          queryClient.invalidateQueries({ queryKey: ['tasks'] });
                          if (user?.id) {
                            queryClient.invalidateQueries({ queryKey: ['tasks', 'volunteer', user.id] });
                          }
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {isLoadingVolunteerTasks ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : completedTasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <EmptyState
                    title="No completed tasks"
                    description="You haven't completed any tasks yet."
                    icon={
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                      </div>
                    }
                    action={{
                      label: "View Available Tasks",
                      href: "#"
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {completedTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <TaskCard 
                        task={task}
                        onUpdate={() => {
                          queryClient.invalidateQueries({ queryKey: ['tasks'] });
                          if (user?.id) {
                            queryClient.invalidateQueries({ queryKey: ['tasks', 'volunteer', user.id] });
                          }
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default VolunteerTasks;
