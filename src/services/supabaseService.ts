import { supabase } from "@/integrations/supabase/client";
import { FoodItem, Notification, Task, User, UserRole } from "@/types";
import { Views } from '../types/supabase';

// Food Items
export const getFoodItems = async (): Promise<FoodItem[]> => {
  const { data, error } = await supabase
    .from('food_items')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching food items:", error);
    throw error;
  }
  
  // Get donor names in a separate query
  const donorIds = [...new Set(data.map(item => item.donor_id))];
  const { data: donors } = await supabase
    .from('profiles')
    .select('id, name')
    .in('id', donorIds);
    
  const donorMap = new Map();
  if (donors) {
    donors.forEach(donor => {
      donorMap.set(donor.id, donor.name);
    });
  }
  
  // Map the Supabase data to our FoodItem type
  return data.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description || "",
    quantity: item.quantity,
    foodType: item.food_type,
    expiryDate: new Date(item.expiry_date).toISOString().split('T')[0],
    pickupLocation: item.pickup_location,
    pickupTimeFrom: new Date(item.pickup_time_from).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    pickupTimeTo: new Date(item.pickup_time_to).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: item.status as "available" | "assigned" | "completed",
    donorId: item.donor_id,
    donorName: donorMap.get(item.donor_id) || "Unknown Donor",
    createdAt: item.created_at,
    image: item.image
  }));
};

export const getFoodItemById = async (id: string): Promise<FoodItem | null> => {
  const { data, error } = await supabase
    .from('food_items')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching food item with id ${id}:`, error);
    return null;
  }
  
  if (!data) return null;
  
  // Get donor name
  const { data: donor } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', data.donor_id)
    .single();
    
  return {
    id: data.id,
    title: data.title,
    description: data.description || "",
    quantity: data.quantity,
    foodType: data.food_type,
    expiryDate: new Date(data.expiry_date).toISOString().split('T')[0],
    pickupLocation: data.pickup_location,
    pickupTimeFrom: new Date(data.pickup_time_from).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    pickupTimeTo: new Date(data.pickup_time_to).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: data.status as "available" | "assigned" | "completed",
    donorId: data.donor_id,
    donorName: donor ? donor.name : "Unknown Donor",
    createdAt: data.created_at,
    image: data.image
  };
};

export const getFoodItemsByDonor = async (donorId: string): Promise<FoodItem[]> => {
  const { data, error } = await supabase
    .from('food_items')
    .select('*')
    .eq('donor_id', donorId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error(`Error fetching food items for donor ${donorId}:`, error);
    throw error;
  }
  
  // Get donor name
  const { data: donor } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', donorId)
    .single();
    
  const donorName = donor ? donor.name : "Unknown Donor";
  
  return data.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description || "",
    quantity: item.quantity,
    foodType: item.food_type,
    expiryDate: new Date(item.expiry_date).toISOString().split('T')[0],
    pickupLocation: item.pickup_location,
    pickupTimeFrom: new Date(item.pickup_time_from).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    pickupTimeTo: new Date(item.pickup_time_to).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: item.status as "available" | "assigned" | "completed",
    donorId: item.donor_id,
    donorName: donorName,
    createdAt: item.created_at,
    image: item.image
  }));
};

export const addFoodItem = async (foodItem: Omit<FoodItem, "id" | "createdAt" | "donorName">): Promise<FoodItem> => {
  // Prepare data for Supabase (snake_case)
  const newItem = {
    title: foodItem.title,
    description: foodItem.description,
    quantity: foodItem.quantity,
    food_type: foodItem.foodType,
    expiry_date: new Date(foodItem.expiryDate).toISOString(),
    pickup_location: foodItem.pickupLocation,
    pickup_time_from: convertTimeToISO(foodItem.expiryDate, foodItem.pickupTimeFrom),
    pickup_time_to: convertTimeToISO(foodItem.expiryDate, foodItem.pickupTimeTo),
    status: foodItem.status,
    donor_id: foodItem.donorId,
    image: foodItem.image
  };
  
  const { data, error } = await supabase
    .from('food_items')
    .insert(newItem)
    .select('*')
    .single();
    
  if (error) {
    console.error("Error adding food item:", error);
    throw error;
  }
  
  // Get donor name
  const { data: donor } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', data.donor_id)
    .single();
    
  return {
    id: data.id,
    title: data.title,
    description: data.description || "",
    quantity: data.quantity,
    foodType: data.food_type,
    expiryDate: new Date(data.expiry_date).toISOString().split('T')[0],
    pickupLocation: data.pickup_location,
    pickupTimeFrom: new Date(data.pickup_time_from).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    pickupTimeTo: new Date(data.pickup_time_to).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: data.status as "available" | "assigned" | "completed",
    donorId: data.donor_id,
    donorName: donor ? donor.name : "Unknown Donor",
    createdAt: data.created_at,
    image: data.image
  };
};

// Tasks
export const getTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
  
  return data.map(task => ({
    id: task.id,
    foodItemId: task.food_item_id,
    volunteerId: task.volunteer_id || undefined,
    status: task.status as "pending" | "accepted" | "completed",
    createdAt: task.created_at,
    scheduledPickupTime: task.scheduled_pickup_time || undefined
  }));
};

export const getTasksByVolunteer = async (volunteerId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('volunteer_id', volunteerId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error(`Error fetching tasks for volunteer ${volunteerId}:`, error);
    throw error;
  }
  
  return data.map(task => ({
    id: task.id,
    foodItemId: task.food_item_id,
    volunteerId: task.volunteer_id || undefined,
    status: task.status as "pending" | "accepted" | "completed",
    createdAt: task.created_at,
    scheduledPickupTime: task.scheduled_pickup_time || undefined
  }));
};

export const acceptTask = async (taskId: string, volunteerId: string): Promise<Task | null> => {
  const now = new Date().toISOString();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const scheduledTime = tomorrow.toISOString();
  
  // First, update the task
  const { data: taskData, error: taskError } = await supabase
    .from('tasks')
    .update({
      volunteer_id: volunteerId,
      status: 'accepted',
      scheduled_pickup_time: scheduledTime
    })
    .eq('id', taskId)
    .select()
    .single();
    
  if (taskError) {
    console.error(`Error accepting task ${taskId}:`, taskError);
    throw taskError;
  }
  
  // Then, update the food item status
  const { error: foodError } = await supabase
    .from('food_items')
    .update({ status: 'assigned' })
    .eq('id', taskData.food_item_id);
    
  if (foodError) {
    console.error(`Error updating food item for task ${taskId}:`, foodError);
    throw foodError;
  }
  
  // Get the food item details for the notification
  const { data: foodItem } = await supabase
    .from('food_items')
    .select('title, donor_id')
    .eq('id', taskData.food_item_id)
    .single();
  
  // Create notification for the donor
  if (foodItem) {
    await supabase
      .from('notifications')
      .insert({
        user_id: foodItem.donor_id,
        message: `A volunteer has accepted to pick up your donation: ${foodItem.title}`,
        type: 'task_assigned',
        action_url: `/food/${taskData.food_item_id}`,
        created_at: now
      });
  }
  
  return {
    id: taskData.id,
    foodItemId: taskData.food_item_id,
    volunteerId: taskData.volunteer_id || undefined,
    status: taskData.status as "pending" | "accepted" | "completed",
    createdAt: taskData.created_at,
    scheduledPickupTime: taskData.scheduled_pickup_time || undefined
  };
};

export const completeTask = async (taskId: string): Promise<Task | null> => {
  // First, update the task
  const { data: taskData, error: taskError } = await supabase
    .from('tasks')
    .update({ status: 'completed' })
    .eq('id', taskId)
    .select()
    .single();
    
  if (taskError) {
    console.error(`Error completing task ${taskId}:`, taskError);
    throw taskError;
  }
  
  // Then, update the food item status
  const { error: foodError } = await supabase
    .from('food_items')
    .update({ status: 'completed' })
    .eq('id', taskData.food_item_id);
    
  if (foodError) {
    console.error(`Error updating food item for task ${taskId}:`, foodError);
    throw foodError;
  }
  
  // Get the food item details for the notification
  const { data: foodItem } = await supabase
    .from('food_items')
    .select('title, donor_id')
    .eq('id', taskData.food_item_id)
    .single();
  
  // Create notification for the donor
  if (foodItem) {
    await supabase
      .from('notifications')
      .insert({
        user_id: foodItem.donor_id,
        message: `Your donation has been picked up: ${foodItem.title}`,
        type: 'pickup_scheduled',
        action_url: `/food/${taskData.food_item_id}`,
        created_at: new Date().toISOString()
      });
  }
  
  return {
    id: taskData.id,
    foodItemId: taskData.food_item_id,
    volunteerId: taskData.volunteer_id || undefined,
    status: taskData.status as "pending" | "accepted" | "completed",
    createdAt: taskData.created_at,
    scheduledPickupTime: taskData.scheduled_pickup_time || undefined
  };
};

// Notifications
export const getNotificationsByUser = async (userId: string): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error(`Error fetching notifications for user ${userId}:`, error);
    throw error;
  }
  
  return data.map(notification => ({
    id: notification.id,
    userId: notification.user_id,
    message: notification.message,
    read: notification.read,
    createdAt: notification.created_at,
    type: notification.type as "food_available" | "task_assigned" | "pickup_scheduled",
    actionUrl: notification.action_url || undefined
  }));
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);
    
  if (error) {
    console.error(`Error marking notification ${notificationId} as read:`, error);
    throw error;
  }
};

// Helper function to convert time string to ISO format
function convertTimeToISO(dateStr: string, timeStr: string): string {
  const date = new Date(dateStr);
  const [hours, minutes] = timeStr.split(':').map(Number);
  date.setHours(hours, minutes);
  return date.toISOString();
}

export interface CommunityMember {
  id: string;
  name: string;
  role: 'donor' | 'volunteer';
  occupation: string;
  image_url: string;
  donation_count?: number;
  task_count?: number;
}

export type RecentDonor = Views<'recent_donors'>;
export type ActiveVolunteer = Views<'active_volunteers'>;

export const getRecentDonors = async (): Promise<RecentDonor[]> => {
  try {
    const { data, error } = await supabase
      .from('recent_donors')
      .select('*')
      .limit(10);

    if (error) {
      console.error('Error fetching recent donors:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getRecentDonors:', error);
    throw error;
  }
};

export const getActiveVolunteers = async (): Promise<ActiveVolunteer[]> => {
  try {
    const { data, error } = await supabase
      .from('active_volunteers')
      .select('*')
      .limit(10);

    if (error) {
      console.error('Error fetching active volunteers:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getActiveVolunteers:', error);
    throw error;
  }
};
