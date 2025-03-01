import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  full_name?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  checkSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  checkSession: async () => {
    set({ isLoading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name
          },
          isLoading: false
        });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      console.error('Error checking session:', error);
      set({ user: null, error: error.message, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name
          },
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Error logging in:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();
      set({ user: null, isLoading: false });
    } catch (error) {
      console.error('Error logging out:', error);
      set({ error: error.message, isLoading: false });
    }
  },
}));
