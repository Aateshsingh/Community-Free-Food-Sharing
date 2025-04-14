
export type UserRole = 'donor' | 'volunteer' | 'beneficiary';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: string;
  phone?: string;
  image?: string;
}

export interface FoodItem {
  id: string;
  title: string;
  description: string;
  quantity: string;
  foodType: string;
  expiryDate: string;
  pickupLocation: string;
  pickupTimeFrom: string;
  pickupTimeTo: string;
  status: 'available' | 'assigned' | 'completed';
  donorId: string;
  donorName: string;
  createdAt: string;
  image?: string;
}

export interface Task {
  id: string;
  foodItemId: string;
  volunteerId?: string;
  status: 'pending' | 'accepted' | 'completed';
  createdAt: string;
  scheduledPickupTime?: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'food_available' | 'task_assigned' | 'pickup_scheduled';
  actionUrl?: string;
}
