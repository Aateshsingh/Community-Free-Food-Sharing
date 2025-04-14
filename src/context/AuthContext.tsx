import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<User | null>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check for existing session first
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) throw profileError;
          
          if (profileData && mounted) {
            const userData: User = {
              id: session.user.id,
              name: profileData.name,
              email: session.user.email || '',
              role: profileData.role as UserRole,
              location: profileData.location || undefined,
              phone: profileData.phone || undefined,
              image: profileData.image || undefined
            };
            setUser(userData);
          }
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        if (mounted) {
          setError("Failed to initialize authentication");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (session?.user) {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (profileError) throw profileError;
            
            if (profileData) {
              const userData: User = {
                id: session.user.id,
                name: profileData.name,
                email: session.user.email || '',
                role: profileData.role as UserRole,
                location: profileData.location || undefined,
                phone: profileData.phone || undefined,
                image: profileData.image || undefined
              };
              setUser(userData);
            }
          } catch (err) {
            console.error("Error fetching profile:", err);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) {
        setError(signInError.message);
        return null;
      }
      
      if (data.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileData) {
          const userData: User = {
            id: data.user.id,
            name: profileData.name,
            email: data.user.email || '',
            role: profileData.role as UserRole,
            location: profileData.location || undefined,
            phone: profileData.phone || undefined,
            image: profileData.image || undefined
          };
          setUser(userData);
          return userData;
        }
      }
      return null;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });
      
      if (signUpError) {
        setError(signUpError.message);
        return null;
      }
      
      if (data.user) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          toast.error("Registration successful, but could not log in automatically. Please log in manually.");
          return null;
        }
        
        if (signInData.user) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', signInData.user.id)
            .single();
            
          if (profileData) {
            const userData: User = {
              id: signInData.user.id,
              name: profileData.name,
              email: signInData.user.email || '',
              role: profileData.role as UserRole,
              location: profileData.location || undefined,
              phone: profileData.phone || undefined,
              image: profileData.image || undefined
            };
            setUser(userData);
            toast.success("Registration successful! You are now logged in.");
            return userData;
          }
        }
        
        toast.success("Registration successful! Check your email for confirmation.");
        return null;
      }
      return null;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
