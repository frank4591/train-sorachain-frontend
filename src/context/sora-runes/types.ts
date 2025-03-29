
// SoraRunes-related type definitions
export interface SoraRunesData {
  totalRunes: number;
  dailyUsedRunes: number;
  lastResetDate: string | null;
}

export interface SoraRunesContextType {
  totalRunes: number;
  dailyUsedRunes: number;
  lastResetDate: string | null;
  isLoading: boolean;
  canUseRunes: boolean;
  incrementRunes: (amount?: number) => Promise<boolean>;
  useRunes: (amount?: number) => Promise<boolean>;
  fetchRunesData: () => Promise<void>;
}
