import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface CustomUser extends User {
  role?: 'admin' | 'agent';
}

interface AuthState {
  user: CustomUser | null;
  isLoading: boolean;
  checkSession: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  checkSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Obtener el rol del usuario desde la tabla de usuarios
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        console.log('User data from DB:', userData); // Para debugging

        const userWithRole: CustomUser = {
          ...session.user,
          role: userData?.role || 'agent'
        };

        console.log('User with role:', userWithRole); // Para debugging

        set({ user: userWithRole, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      console.error('Error checking session:', error);
      set({ user: null, isLoading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (user) {
        // Obtener el rol del usuario desde la tabla de usuarios
        const { data: userData, error: roleError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        console.log('User data after login:', userData); // Para debugging

        if (roleError) {
          console.error('Error getting role:', roleError);
          throw roleError;
        }

        const userWithRole: CustomUser = {
          ...user,
          role: userData?.role || 'agent'
        };

        console.log('Setting user with role:', userWithRole); // Para debugging

        set({ user: userWithRole });
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },
}));
