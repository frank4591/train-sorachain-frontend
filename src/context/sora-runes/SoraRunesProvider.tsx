
import { createContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DAILY_RUNES_LIMIT, RUNES_PER_SUBMISSION } from "@/lib/sora-constants";
import { SoraRunesContextType } from "./types";

// Create context
export const SoraRunesContext = createContext<SoraRunesContextType | undefined>(undefined);

export function SoraRunesProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [totalRunes, setTotalRunes] = useState(0);
  const [dailyUsedRunes, setDailyUsedRunes] = useState(0);
  const [lastResetDate, setLastResetDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRunesData = async () => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('sora_runes')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setTotalRunes(data.total_runes);
        setDailyUsedRunes(data.daily_used_runes);
        setLastResetDate(data.last_reset_date);
      }
    } catch (error) {
      console.error('Error fetching SoraRunes:', error);
      toast.error('Failed to load SoraRunes data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRunesData();
  }, [isAuthenticated, user]);

  const canUseRunes = dailyUsedRunes < DAILY_RUNES_LIMIT && totalRunes > 0;

  const incrementRunes = async (amount = RUNES_PER_SUBMISSION): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to earn SoraRunes');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('sora_runes')
        .update({ total_runes: totalRunes + amount })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setTotalRunes(data.total_runes);
      toast.success(`You earned ${amount} SoraRunes!`);
      return true;
    } catch (error) {
      console.error('Error incrementing SoraRunes:', error);
      toast.error('Failed to add SoraRunes');
      return false;
    }
  };

  const useRunes = async (amount = 1): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to use SoraRunes');
      return false;
    }

    if (dailyUsedRunes >= DAILY_RUNES_LIMIT) {
      toast.error(`You've reached your daily limit of ${DAILY_RUNES_LIMIT} SoraRunes`);
      return false;
    }

    if (totalRunes < amount) {
      toast.error(`You don't have enough SoraRunes`);
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('sora_runes')
        .update({ 
          total_runes: totalRunes - amount,
          daily_used_runes: dailyUsedRunes + amount
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setTotalRunes(data.total_runes);
      setDailyUsedRunes(data.daily_used_runes);
      return true;
    } catch (error) {
      console.error('Error using SoraRunes:', error);
      toast.error('Failed to use SoraRunes');
      return false;
    }
  };

  return (
    <SoraRunesContext.Provider
      value={{
        totalRunes,
        dailyUsedRunes,
        lastResetDate,
        isLoading,
        canUseRunes,
        incrementRunes,
        useRunes,
        fetchRunesData
      }}
    >
      {children}
    </SoraRunesContext.Provider>
  );
}
