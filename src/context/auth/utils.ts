
import { supabase, generateRandomString } from "@/integrations/supabase/client";
import { UserData, CreditEvent } from "./types";

// Function to fetch user profile data from Supabase
export async function fetchUserProfile(userId: string): Promise<UserData | null> {
  try {
    // Get the user profile
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
    
    // Get credit history
    const { data: creditHistory } = await supabase
      .from('credit_history')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
      
    // Get staked tasks
    const { data: stakedTasks } = await supabase
      .from('staked_tasks')
      .select('task_id, role')
      .eq('user_id', userId);
      
    // Format the user data
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
    
    return userData;
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    return null;
  }
}

// Function to generate authentication key
export function generateAuthKey(): string {
  return "sk-" + generateRandomString(30);
}

// Convert Supabase auth events to user data
export async function handleAuthStateChange(
  event: string,
  session: any
): Promise<UserData | null> {
  if (!session?.user) return null;
  
  return await fetchUserProfile(session.user.id);
}
