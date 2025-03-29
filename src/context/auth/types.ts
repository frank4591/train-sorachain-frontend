
// Auth-related type definitions
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

export interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  generateAuthKey: () => string;
  addCredits: (amount: number, reason?: string) => Promise<void>;
}
