
// This file is kept for backward compatibility
// It re-exports from the new modular structure
import { AuthProvider, useAuth } from './auth';
import type { UserData, UserRole, CreditEvent, AuthContextType } from './auth/types';

export { 
  AuthProvider,
  useAuth
};

export type {
  UserData,
  UserRole,
  CreditEvent,
  AuthContextType
};
