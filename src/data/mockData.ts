
import { FoodItem, Notification, Task, User, UserRole } from "@/types";

// Mock Users
export const users: User[] = [
  {
    id: "1",
    name: "John Donor",
    email: "john@example.com",
    role: "donor",
    location: "Downtown",
    phone: "555-1234",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100",
  },
  {
    id: "2",
    name: "Sarah Volunteer",
    email: "sarah@example.com",
    role: "volunteer",
    location: "Uptown",
    phone: "555-5678",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
  },
  {
    id: "3",
    name: "Mike Beneficiary",
    email: "mike@example.com",
    role: "beneficiary",
    location: "Midtown",
    phone: "555-9012",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100",
  },
  {
    id: "4",
    name: "Emma Donor",
    email: "emma@example.com",
    role: "donor",
    location: "West End",
    phone: "555-3456",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100",
  },
  {
    id: "5",
    name: "Alex Volunteer",
    email: "alex@example.com",
    role: "volunteer",
    location: "East Side",
    phone: "555-7890",
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=100",
  },
];

// Mock Food Items
export const foodItems: FoodItem[] = [
  {
    id: "1",
    title: "Fresh Vegetables",
    description: "Assorted vegetables from local farm",
    quantity: "5 kg",
    foodType: "Produce",
    expiryDate: "2025-04-18",
    pickupLocation: "123 Main St, Downtown",
    pickupTimeFrom: "10:00",
    pickupTimeTo: "14:00",
    status: "available",
    donorId: "1",
    donorName: "John Donor",
    createdAt: "2025-04-12T08:30:00Z",
    image: "https://images.unsplash.com/photo-1567306226408-28f7c7334c2c?q=80&w=300",
  },
  {
    id: "2",
    title: "Bread and Pastries",
    description: "Assorted bread and pastries from local bakery",
    quantity: "10 items",
    foodType: "Bakery",
    expiryDate: "2025-04-14",
    pickupLocation: "456 Oak St, West End",
    pickupTimeFrom: "16:00",
    pickupTimeTo: "18:00",
    status: "assigned",
    donorId: "4",
    donorName: "Emma Donor",
    createdAt: "2025-04-12T09:45:00Z",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=300",
  },
  {
    id: "3",
    title: "Canned Goods",
    description: "Various canned soups and vegetables",
    quantity: "15 cans",
    foodType: "Non-perishable",
    expiryDate: "2025-10-30",
    pickupLocation: "789 Pine St, Uptown",
    pickupTimeFrom: "09:00",
    pickupTimeTo: "12:00",
    status: "available",
    donorId: "1",
    donorName: "John Donor",
    createdAt: "2025-04-11T14:20:00Z",
    image: "https://images.unsplash.com/photo-1584263347416-85a696b4fbc2?q=80&w=300",
  },
  {
    id: "4",
    title: "Dairy Products",
    description: "Milk, cheese, and yogurt",
    quantity: "8 items",
    foodType: "Dairy",
    expiryDate: "2025-04-16",
    pickupLocation: "321 Elm St, Midtown",
    pickupTimeFrom: "13:00",
    pickupTimeTo: "15:00",
    status: "completed",
    donorId: "4",
    donorName: "Emma Donor",
    createdAt: "2025-04-10T16:10:00Z",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=300",
  },
  {
    id: "5",
    title: "Rice and Pasta",
    description: "5kg of rice and assorted pasta packages",
    quantity: "8 packages",
    foodType: "Grains",
    expiryDate: "2025-12-20",
    pickupLocation: "654 Maple St, East Side",
    pickupTimeFrom: "11:00",
    pickupTimeTo: "13:00",
    status: "available",
    donorId: "1",
    donorName: "John Donor",
    createdAt: "2025-04-12T11:05:00Z",
    image: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=300",
  },
];

// Mock Tasks
export const tasks: Task[] = [
  {
    id: "1",
    foodItemId: "2",
    volunteerId: "2",
    status: "accepted",
    createdAt: "2025-04-12T10:00:00Z",
    scheduledPickupTime: "2025-04-13T17:00:00Z",
  },
  {
    id: "2",
    foodItemId: "4",
    volunteerId: "5",
    status: "completed",
    createdAt: "2025-04-10T17:00:00Z",
    scheduledPickupTime: "2025-04-11T14:00:00Z",
  },
  {
    id: "3",
    foodItemId: "1",
    status: "pending",
    createdAt: "2025-04-12T09:00:00Z",
  },
  {
    id: "4",
    foodItemId: "3",
    status: "pending",
    createdAt: "2025-04-11T15:00:00Z",
  },
  {
    id: "5",
    foodItemId: "5",
    status: "pending",
    createdAt: "2025-04-12T12:00:00Z",
  },
];

// Mock Notifications
export const notifications: Notification[] = [
  {
    id: "1",
    userId: "2",
    message: "New food donation available in your area",
    read: false,
    createdAt: "2025-04-12T09:05:00Z",
    type: "food_available",
    actionUrl: "/tasks",
  },
  {
    id: "2",
    userId: "2",
    message: "You have been assigned a pickup task",
    read: true,
    createdAt: "2025-04-12T10:05:00Z",
    type: "task_assigned",
    actionUrl: "/tasks/1",
  },
  {
    id: "3",
    userId: "3",
    message: "New food available near you: Fresh Vegetables",
    read: false,
    createdAt: "2025-04-12T08:35:00Z",
    type: "food_available",
    actionUrl: "/food/1",
  },
  {
    id: "4",
    userId: "5",
    message: "Pickup for Dairy Products completed",
    read: true,
    createdAt: "2025-04-11T14:05:00Z",
    type: "pickup_scheduled",
    actionUrl: "/tasks/2",
  },
  {
    id: "5",
    userId: "3",
    message: "New food available near you: Rice and Pasta",
    read: false,
    createdAt: "2025-04-12T11:10:00Z",
    type: "food_available",
    actionUrl: "/food/5",
  },
];

// Current user state (will be used for authentication in the prototype)
export let currentUser: User | null = null;

// Mock authentication function
export const login = (email: string, password: string): User | null => {
  // In a real app, you would verify the password
  const user = users.find((u) => u.email === email);
  if (user) {
    currentUser = user;
    return user;
  }
  return null;
};

export const logout = () => {
  currentUser = null;
};

export const register = (
  name: string,
  email: string,
  password: string,
  role: UserRole
): User | null => {
  // Check if email already exists
  if (users.some((u) => u.email === email)) {
    return null;
  }

  // In a real app, you would hash the password
  const newUser: User = {
    id: (users.length + 1).toString(),
    name,
    email,
    role,
  };

  users.push(newUser);
  currentUser = newUser;
  return newUser;
};

// Helper functions for data manipulation
export const getFoodItemsByStatus = (status: FoodItem["status"]) => {
  return foodItems.filter((item) => item.status === status);
};

export const getFoodItemsByDonor = (donorId: string) => {
  return foodItems.filter((item) => item.donorId === donorId);
};

export const getTasksByVolunteer = (volunteerId: string) => {
  return tasks.filter((task) => task.volunteerId === volunteerId);
};

export const getNotificationsByUser = (userId: string) => {
  return notifications.filter((notification) => notification.userId === userId);
};

export const getUnreadNotificationCount = (userId: string) => {
  return notifications.filter((notification) => notification.userId === userId && !notification.read).length;
};

export const markNotificationAsRead = (notificationId: string) => {
  const notification = notifications.find((n) => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
};

export const addFoodItem = (foodItem: Omit<FoodItem, "id" | "createdAt">): FoodItem => {
  const newFoodItem: FoodItem = {
    ...foodItem,
    id: (foodItems.length + 1).toString(),
    createdAt: new Date().toISOString(),
  };
  foodItems.push(newFoodItem);
  
  // Create a task for this food item
  const newTask: Task = {
    id: (tasks.length + 1).toString(),
    foodItemId: newFoodItem.id,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  
  // Create notifications for volunteers and beneficiaries
  users.forEach((user) => {
    if (user.role === "volunteer" || user.role === "beneficiary") {
      const newNotification: Notification = {
        id: (notifications.length + 1).toString(),
        userId: user.id,
        message: `New food available: ${foodItem.title}`,
        read: false,
        createdAt: new Date().toISOString(),
        type: "food_available",
        actionUrl: user.role === "volunteer" ? "/tasks" : `/food/${newFoodItem.id}`,
      };
      notifications.push(newNotification);
    }
  });
  
  return newFoodItem;
};

export const acceptTask = (taskId: string, volunteerId: string) => {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.volunteerId = volunteerId;
    task.status = "accepted";
    
    // Update the corresponding food item
    const foodItem = foodItems.find((f) => f.id === task.foodItemId);
    if (foodItem) {
      foodItem.status = "assigned";
    }
    
    // Notify the donor
    if (foodItem) {
      const newNotification: Notification = {
        id: (notifications.length + 1).toString(),
        userId: foodItem.donorId,
        message: `A volunteer has accepted to pick up your donation: ${foodItem.title}`,
        read: false,
        createdAt: new Date().toISOString(),
        type: "task_assigned",
        actionUrl: `/food/${foodItem.id}`,
      };
      notifications.push(newNotification);
    }
    
    return task;
  }
  return null;
};

export const completeTask = (taskId: string) => {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.status = "completed";
    
    // Update the corresponding food item
    const foodItem = foodItems.find((f) => f.id === task.foodItemId);
    if (foodItem) {
      foodItem.status = "completed";
    }
    
    // Notify the donor
    if (foodItem) {
      const newNotification: Notification = {
        id: (notifications.length + 1).toString(),
        userId: foodItem.donorId,
        message: `Your donation has been picked up: ${foodItem.title}`,
        read: false,
        createdAt: new Date().toISOString(),
        type: "pickup_scheduled",
        actionUrl: `/food/${foodItem.id}`,
      };
      notifications.push(newNotification);
    }
    
    return task;
  }
  return null;
};
