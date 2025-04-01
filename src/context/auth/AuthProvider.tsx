
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, generateRandomString } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthContextType, UserData } from "./types";
import { fetchUserProfile, generateAuthKey as genAuthKey } from "./utils";

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        // First set up auth state change listener (important for catching events)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state changed:", event, session?.user?.id);
          
          if (event === 'SIGNED_IN' && session) {
            // Don't get profile in the callback to avoid Supabase deadlocks
            // Just update session state synchronously
            setTimeout(async () => {
              const userData = await fetchUserProfile(session.user.id);
              if (userData) {
                setUser(userData);
                console.log("User profile fetched:", userData);
              } else {
                console.log("No user profile found, might be a new registration");
              }
              setIsLoading(false);
            }, 0);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setIsLoading(false);
          }
        });

        // Then check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const userData = await fetchUserProfile(session.user.id);
          if (userData) {
            setUser(userData);
          }
        }
        
        setIsLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Session check error:", error);
        setIsLoading(false);
      }
    };
    
    checkUser();
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
      console.log("Stored redirect path:", storedRedirectPath);
      
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
      console.log("Starting registration process", { email, name });
      
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
      
      console.log("Registration response:", data);
      
      // If signup is successful but we need to manually create the profile
      if (data.user) {
        try {
          // Check if profile already exists
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          
          console.log("Existing profile check:", existingProfile);
            
          if (!existingProfile) {
            // Create profile manually
            const authKey = `${data.user.id}-${generateRandomString(16)}`;
            
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email,
                name,
                auth_key: authKey,
                credits: 0,
                role: 'client'
              });
              
            if (profileError) {
              console.error("Error creating profile:", profileError);
              toast.error("Account created but profile setup failed. Please contact support.");
            } else {
              console.log("Profile created successfully");
            }
          }
        } catch (profileErr) {
          console.error("Profile creation error:", profileErr);
        }
      }
      
      toast.success("Registration successful!");
      
      // Redirect to the page they were trying to access, or dashboard as fallback
      const storedRedirectPath = sessionStorage.getItem('redirectPath');
      
      setTimeout(() => {
        if (storedRedirectPath) {
          navigate(storedRedirectPath);
          sessionStorage.removeItem('redirectPath');
        } else {
          navigate("/dashboard");
        }
      }, 100);
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
      console.error("Register error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.info("You've been logged out");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
    return genAuthKey();
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
