import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, generateRandomString } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Type definitions
export type UserRole = 'client' | 'delegator' | 'validator' | 'aggregator' | 'admin';

export type CreditEvent = {
  id: string;
  amount: number;
  reason: string;
  timestamp: string;
};

export type UserData = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  credits: number;
  authKey: string;
  tasks: string[]; // IDs of assigned tasks
  stakedTasks: string[]; // IDs of tasks the user has staked for
  taskRoles: Record<string, UserRole>; // Map of taskId -> role
  dateOfBirth?: string;
  country?: string;
  phoneNumber?: string;
  creditHistory: CreditEvent[];
};

type AuthContextType = {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  generateAuthKey: () => string;
  addCredits: (amount: number, reason?: string) => Promise<void>;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error("Error fetching user profile:", error);
            setIsLoading(false);
            return;
          }
          
          if (profileData) {
            // Get credit history
            const { data: creditHistory } = await supabase
              .from('credit_history')
              .select('*')
              .eq('user_id', session.user.id)
              .order('timestamp', { ascending: false });
              
            // Get staked tasks
            const { data: stakedTasks } = await supabase
              .from('staked_tasks')
              .select('task_id, role')
              .eq('user_id', session.user.id);
              
            const userData: UserData = {
              id: profileData.id,
              email: profileData.email,
              name: profileData.name || '',
              role: profileData.role,
              credits: profileData.credits,
              authKey: profileData.auth_key || '',
              dateOfBirth: profileData.date_of_birth || '',
              country: profileData.country || '',
              phoneNumber: profileData.phone_number || '',
              tasks: [],
              stakedTasks: stakedTasks?.map(t => t.task_id) || [],
              taskRoles: stakedTasks?.reduce((acc, t) => ({...acc, [t.task_id]: t.role}), {}) || {},
              creditHistory: creditHistory?.map(ce => ({
                id: ce.id,
                amount: ce.amount,
                reason: ce.reason,
                timestamp: ce.timestamp
              })) || []
            };
            
            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUser();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoading(true);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          // Get credit history
          const { data: creditHistory } = await supabase
            .from('credit_history')
            .select('*')
            .eq('user_id', session.user.id)
            .order('timestamp', { ascending: false });
            
          // Get staked tasks
          const { data: stakedTasks } = await supabase
            .from('staked_tasks')
            .select('task_id, role')
            .eq('user_id', session.user.id);
            
          const userData: UserData = {
            id: profile.id,
            email: profile.email,
            name: profile.name || '',
            role: profile.role,
            credits: profile.credits,
            authKey: profile.auth_key || '',
            dateOfBirth: profile.date_of_birth || '',
            country: profile.country || '',
            phoneNumber: profile.phone_number || '',
            tasks: [],
            stakedTasks: stakedTasks?.map(t => t.task_id) || [],
            taskRoles: stakedTasks?.reduce((acc, t) => ({...acc, [t.task_id]: t.role}), {}) || {},
            creditHistory: creditHistory?.map(ce => ({
              id: ce.id,
              amount: ce.amount,
              reason: ce.reason,
              timestamp: ce.timestamp
            })) || []
          };
          
          setUser(userData);
        }
        setIsLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login handler
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Successfully logged in
      toast.success("Welcome back!");
      
      // Navigate to the requested page or dashboard
      const storedRedirectPath = sessionStorage.getItem('redirectPath');
      if (storedRedirectPath) {
        navigate(storedRedirectPath);
        sessionStorage.removeItem('redirectPath');
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      // First, sign up the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });
      
      if (error) throw error;
      
      // If signup is successful but we need to manually create the profile
      // This is a fallback in case the database trigger fails
      if (data.user) {
        try {
          // Check if profile already exists
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (!existingProfile) {
            // Create profile manually
            const authKey = `${data.user.id}-${generateRandomString(16)}`;
            
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email,
                name,
                auth_key: authKey
              });
              
            if (profileError) {
              console.error("Error creating profile:", profileError);
              toast.error("Account created but profile setup failed. Please contact support.");
            }
          }
        } catch (profileErr) {
          console.error("Profile creation error:", profileErr);
        }
      }
      
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.info("You've been logged out");
    navigate("/");
  };

  // Update user data
  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          date_of_birth: data.dateOfBirth,
          country: data.country,
          phone_number: data.phoneNumber
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setUser({ ...user, ...data });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  // Add credits to user
  const addCredits = async (amount: number, reason: string = "System credit") => {
    if (!user) return;
    
    try {
      // First create a credit history entry
      const { data: creditData, error: creditError } = await supabase
        .from('credit_history')
        .insert({
          user_id: user.id,
          amount,
          reason
        })
        .select()
        .single();
        
      if (creditError) throw creditError;
      
      // Then update the user's credit total
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          credits: user.credits + amount 
        })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Update local state
      const newCreditHistory = [
        {
          id: creditData.id,
          amount,
          reason,
          timestamp: creditData.timestamp
        },
        ...user.creditHistory
      ];
      
      setUser({
        ...user,
        credits: user.credits + amount,
        creditHistory: newCreditHistory
      });
      
      toast.success(`Added ${amount} credits: ${reason}`);
    } catch (error) {
      console.error("Error adding credits:", error);
      toast.error("Failed to add credits");
    }
  };

  // Generate authentication key
  const generateAuthKey = () => {
    return "sk-" + generateRandomString(30);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUserData,
        generateAuthKey,
        addCredits
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
