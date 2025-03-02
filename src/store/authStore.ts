import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { persist } from 'zustand/middleware';

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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,

      checkSession: async () => {
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Error getting session:', sessionError);
            set({ user: null, isLoading: false });
            return;
          }

          if (!session) {
            set({ user: null, isLoading: false });
            return;
          }

          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('role')
              .eq('id', session.user.id)
              .single();

            if (userError) {
              const userWithDefaultRole: CustomUser = {
                ...session.user,
                role: 'agent'
              };
              set({ user: userWithDefaultRole, isLoading: false });
              return;
            }

            const role = userData?.role && ['admin', 'agent'].includes(userData.role) 
              ? userData.role as 'admin' | 'agent'
              : 'agent';

            const userWithRole: CustomUser = {
              ...session.user,
              role
            };

            set({ user: userWithRole, isLoading: false });
          } catch (dbError) {
            console.error('Database error:', dbError);
            const userWithDefaultRole: CustomUser = {
              ...session.user,
              role: 'agent'
            };
            set({ user: userWithDefaultRole, isLoading: false });
          }
        } catch (error) {
          console.error('Error in checkSession:', error);
          set({ user: null, isLoading: false });
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) throw signInError;
          if (!data.user) throw new Error('No user data received');

          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('role')
              .eq('id', data.user.id)
              .single();

            if (userError) {
              const userWithDefaultRole: CustomUser = {
                ...data.user,
                role: 'agent'
              };
              set({ user: userWithDefaultRole, isLoading: false });
              return;
            }

            const role = userData?.role && ['admin', 'agent'].includes(userData.role)
              ? userData.role as 'admin' | 'agent'
              : 'agent';

            const userWithRole: CustomUser = {
              ...data.user,
              role
            };

            set({ user: userWithRole, isLoading: false });
          } catch (dbError) {
            console.error('Database error during sign in:', dbError);
            const userWithDefaultRole: CustomUser = {
              ...data.user,
              role: 'agent'
            };
            set({ user: userWithDefaultRole, isLoading: false });
          }
        } catch (error) {
          console.error('Error in signIn:', error);
          throw error;
        }
      },

      signOut: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null, isLoading: false });
        } catch (error) {
          console.error('Error in signOut:', error);
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);
