export interface Database {
  public: {
    Tables: {
      food_items: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          food_type: string;
          quantity: string;
          expiry_date: string;
          pickup_location: string;
          pickup_time_from: string;
          pickup_time_to: string;
          image: string;
          status: string;
          donor_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          description: string;
          food_type: string;
          quantity: string;
          expiry_date: string;
          pickup_location: string;
          pickup_time_from: string;
          pickup_time_to: string;
          image: string;
          status?: string;
          donor_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string;
          food_type?: string;
          quantity?: string;
          expiry_date?: string;
          pickup_location?: string;
          pickup_time_from?: string;
          pickup_time_to?: string;
          image?: string;
          status?: string;
          donor_id?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          created_at: string;
          food_item_id: string;
          volunteer_id: string | null;
          status: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          food_item_id: string;
          volunteer_id?: string | null;
          status?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          food_item_id?: string;
          volunteer_id?: string | null;
          status?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          role: 'donor' | 'volunteer';
          occupation: string;
          image_url: string;
        };
        Insert: {
          id: string;
          created_at?: string;
          name: string;
          role: 'donor' | 'volunteer';
          occupation: string;
          image_url: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          role?: 'donor' | 'volunteer';
          occupation?: string;
          image_url?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          read: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          read?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: string;
          read?: boolean;
        };
      };
    };
    Views: {
      recent_donors: {
        Row: {
          id: string;
          name: string;
          role: 'donor';
          occupation: string;
          image_url: string;
          donation_count: number;
        };
      };
      active_volunteers: {
        Row: {
          id: string;
          name: string;
          role: 'volunteer';
          occupation: string;
          image_url: string;
          task_count: number;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T];
export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row']; 