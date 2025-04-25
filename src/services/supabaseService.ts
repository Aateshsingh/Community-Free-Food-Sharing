import { supabase } from "@/integrations/supabase/client";
import { FoodItem, Notification, Task, User, UserRole } from "@/types";
import { Views } from '../types/supabase';
import { Database } from '@/types/database.types';

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

export type RecentDonor = Database['public']['Views']['recent_donors']['Row'];
export type ActiveVolunteer = Database['public']['Views']['active_volunteers']['Row'];
export type CommunityMember = Database['public']['Tables']['community_members']['Row'];

// Default profile images separated by gender
const defaultProfileImages = {
  donor: {
    male: [
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop', // Professional man 1
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', // Professional man 2
      'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop', // Professional man 3
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop', // Professional man 4
    ],
    female: [
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop', // Professional woman 1
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', // Professional woman 2
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop', // Professional woman 3
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop', // Professional woman 4
    ]
  },
  volunteer: {
    male: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop', // Young man 1
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', // Young man 2
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', // Young man 3
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop', // Young man 4
    ],
    female: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', // Young woman 1
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', // Young woman 2
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', // Young woman 3
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop', // Young woman 4
    ]
  }
};

// Keep track of used images to avoid duplicates
const usedImages = new Set<string>();

// Simple function to guess gender from name
const guessGenderFromName = (name: string): 'male' | 'female' => {
  // Common Indian male name endings
  const maleIndicators = ['kumar', 'singh', 'raj', 'dev', 'deep', 'sh', 'am', 'ul'];
  // Common Indian female name endings
  const femaleIndicators = ['i', 'a', 'ee', 'ki', 'ni', 'ta', 'ri', 'ja'];
  
  const lowerName = name.toLowerCase();
  const firstName = lowerName.split(' ')[0];
  
  // Check male indicators
  if (maleIndicators.some(indicator => firstName.includes(indicator))) {
    return 'male';
  }
  
  // Check female indicators
  if (femaleIndicators.some(indicator => firstName.endsWith(indicator))) {
    return 'female';
  }
  
  // Default to male if we can't determine (you can adjust this default as needed)
  return 'male';
};

// Helper function to get a unique random profile image based on gender
const getUniqueRandomImage = (role: 'donor' | 'volunteer', name: string): string => {
  const gender = guessGenderFromName(name);
  const images = defaultProfileImages[role][gender];
  const availableImages = images.filter(img => !usedImages.has(img));
  
  // If all images have been used, clear the set and start over
  if (availableImages.length === 0) {
    usedImages.clear();
    return getUniqueRandomImage(role, name);
  }
  
  const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
  usedImages.add(randomImage);
  return randomImage;
};

export const getCommunityMembers = async (): Promise<CommunityMember[]> => {
  try {
    const { data, error } = await supabase
      .from('community_members')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching community members:', error);
      throw error;
    }

    // Add default profile images if none exists
    return data.map(member => ({
      ...member,
      image_url: member.image_url || getUniqueRandomImage(member.role, member.name)
    }));
  } catch (error) {
    console.error('Error in getCommunityMembers:', error);
    throw error;
  }
};

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

    // Clear used images before assigning new ones
    usedImages.clear();

    // Add unique default profile images if none exists
    return (data || []).map(donor => ({
      ...donor,
      image_url: donor.image_url || getUniqueRandomImage('donor', donor.name)
    }));
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

    // Clear used images before assigning new ones
    usedImages.clear();

    // Add unique default profile images if none exists
    return (data || []).map(volunteer => ({
      ...volunteer,
      image_url: volunteer.image_url || getUniqueRandomImage('volunteer', volunteer.name)
    }));
  } catch (error) {
    console.error('Error in getActiveVolunteers:', error);
    throw error;
  }
};
