import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import {
  addUser,
  verifyLogin,
  logLoginSession,
  findUserByContact,
  updateUserPassword,
  logPasswordReset,
} from '../lib/excelStore';

interface SignUpInput {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  purpose: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, serviceType: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (input: SignUpInput) => Promise<{ ok: boolean; error?: string }>;
  resetPassword: (contact: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('turbobook_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('turbobook_user');
      }
    }
  }, []);

  const login: AuthContextType['login'] = async (email, password, serviceType) => {
    await new Promise((r) => setTimeout(r, 500));
    const stored = verifyLogin(email, password);
    if (!stored) return { ok: false, error: 'Invalid email or password' };
    const userData: User = { email: stored.email, name: stored.fullName };
    setUser(userData);
    localStorage.setItem('turbobook_user', JSON.stringify(userData));
    logLoginSession(stored.email, serviceType);
    return { ok: true };
  };

  const signup: AuthContextType['signup'] = async (input) => {
    await new Promise((r) => setTimeout(r, 500));
    const existing = findUserByContact(input.email) || findUserByContact(input.phone);
    if (existing) return { ok: false, error: 'An account with this email or phone already exists' };
    addUser(input);
    const userData: User = { email: input.email, name: input.fullName };
    setUser(userData);
    localStorage.setItem('turbobook_user', JSON.stringify(userData));
    logLoginSession(input.email, 'Account Created');
    return { ok: true };
  };

  const resetPassword: AuthContextType['resetPassword'] = async (contact, newPassword) => {
    await new Promise((r) => setTimeout(r, 500));
    const existing = findUserByContact(contact);
    if (!existing) return { ok: false, error: 'No account found for this email or phone' };
    updateUserPassword(contact, newPassword);
    const contactType = /\S+@\S+\.\S+/.test(contact) ? 'email' : 'phone';
    logPasswordReset(contact, contactType);
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('turbobook_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
