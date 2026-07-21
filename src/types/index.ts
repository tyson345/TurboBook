export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled';

export interface Appointment {
  id: string;
  customerName: string;
  service: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  phone?: string;
  email?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  lastVisit: string;
  avatar?: string;
  totalAppointments?: number;
}

export interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  totalCustomers: number;
}

export interface WeeklyData {
  day: string;
  appointments: number;
}

export type UserRole = 'admin' | 'customer';

export interface User {
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}
