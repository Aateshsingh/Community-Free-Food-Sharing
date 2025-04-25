export interface Database {
  public: {
    Tables: {
      food_items: {
        Row: {
          id: string;
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
          created_at: string;
        };
        Insert: {
          id?: string;
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
          created_at?: string;
        };
        Update: {
          id?: string;
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
          created_at?: string;
        };
      };
      community_members: {
        Row: {
          id: string;
          name: string;
          role: 'donor' | 'volunteer';
          occupation: string;
          image_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: 'donor' | 'volunteer';
          occupation: string;
          image_url: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: 'donor' | 'volunteer';
          occupation?: string;
          image_url?: string;
          created_at?: string;
          updated_at?: string;
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
          created_at: string;
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
          created_at: string;
        };
      };
    };
  };
} 