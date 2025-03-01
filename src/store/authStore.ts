import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const mockUsers = [
  {
    id: 1,
    email: 'admin@tarotcrm.com',
    password: 'admin123',
    role: 'admin',
    created_at: new Date().toISOString(),
    can_handle_payments: true,
    full_name: 'Administrador Principal'
  }
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      set({ user: userWithoutPassword as User, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    localStorage.removeItem('user');
    set({ user: null, isLoading: false });
  },

  checkSession: async () => {
    set({ isLoading: true });
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        set({ user: JSON.parse(savedUser) as User, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  }
}));
