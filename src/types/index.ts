export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employer' | 'employee' | 'indicated';
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  id: string;
  userId: string;
  employers: string[]; // IDs dos empregadores
  address: Address;
  documents: Document[];
  contractStart: Date;
  contractEnd?: Date;
  salary: number;
  workSchedule: WorkSchedule;
  status: 'active' | 'inactive';
}

export interface Employer {
  id: string;
  userId: string;
  employees: string[]; // IDs dos empregados
  address: Address;
  preferences: EmployerPreferences;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface Document {
  id: string;
  type: string;
  title: string;
  url: string;
  userId: string;
  uploadedAt: Date;
  expiresAt?: Date;
}

export interface WorkSchedule {
  sunday?: DaySchedule;
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
}

export interface DaySchedule {
  start: string; // formato HH:mm
  end: string; // formato HH:mm
  breakStart?: string;
  breakEnd?: string;
}

export interface EmployerPreferences {
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  locationValidation: boolean;
  wifiValidation: boolean;
  autoApproveTimesheet: boolean;
} 