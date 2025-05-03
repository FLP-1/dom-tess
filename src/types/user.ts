import { IBaseEntity, EStatus } from './common';
import { User as FirebaseUser } from 'firebase/auth';

// Enums
export enum EUserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
  GUEST = 'guest'
}

// Tipos
export type TFirebaseUser = FirebaseUser;

// Interfaces
export interface IUserPreferences {
  theme?: 'light' | 'dark';
  language?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    desktop?: boolean;
  };
  taskView?: 'list' | 'board' | 'calendar';
  timezone?: string;
}

export interface IUserPoints {
  total: number;
  level: number;
  lastUpdated: Date;
  history: Array<{
    points: number;
    reason: string;
    timestamp: Date;
  }>;
}

export interface IUser extends IBaseEntity {
  email: string;
  displayName?: string;
  photoURL?: string;
  role: EUserRole;
  status: EStatus;
  preferences?: IUserPreferences;
  points?: IUserPoints;
  phoneNumber?: string;
  lastLoginAt?: Date;
  metadata?: Record<string, unknown>;
} 