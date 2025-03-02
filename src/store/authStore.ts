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
        console.log('Checking session...'); // Debug log
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Error getting session:', sessionError);
            set({ user: null, isLoading: false });
            return;
          }

          if (!session) {
            console.log('No session found'); // Debug log
            set({ user: null, isLoading: false });
            return;
          }

          console.log('Session found:', session); // Debug log

          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('role')
              .eq('id', session.user.id)
              .single();

            if (userError) {
              console.error('Error getting user role:', userError);
              // Si hay error al obtener el rol, asumimos que es agente
              const userWithDefaultRole: CustomUser = {
                ...session.user,
                role: 'agent'
              };
              set({ user: userWithDefaultRole, isLoading: false });
              return;
            }

            console.log('User data from DB:', userData); // Debug log

            const userWithRole: CustomUser = {
              ...session.user,
              role: userData?.role || 'agent'
            };

            console.log('Setting user with role:', userWithRole); // Debug log
            set({ user: userWithRole, isLoading: false });
          } catch (dbError) {
            console.error('Database error:', dbError);
            set({ user: null, isLoading: false });
          }
        } catch (error) {
          console.error('Error in checkSession:', error);
          set({ user: null, isLoading: false });
        }
      },

      signIn: async (email: string, password: string) => {
        console.log('Attempting sign in...'); // Debug log
        try {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) {
            console.error('Sign in error:', signInError);
            throw signInError;
          }

          if (!data.user) {
            console.error('No user data after sign in');
            throw new Error('No user data received');
          }

          console.log('Sign in successful:', data); // Debug log

          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('role')
              .eq('id', data.user.id)
              .single();

            if (userError) {
              console.error('Error getting role:', userError);
              // Si hay error al obtener el rol, asumimos que es agente
              const userWithDefaultRole: CustomUser = {
                ...data.user,
                role: 'agent'
              };
              set({ user: userWithDefaultRole, isLoading: false });
              return;
            }

            console.log('User role data:', userData); // Debug log

            const userWithRole: CustomUser = {
              ...data.user,
              role: userData?.role || 'agent'
            };

            console.log('Setting user after sign in:', userWithRole); // Debug log
            set({ user: userWithRole, isLoading: false });
          } catch (dbError) {
            console.error('Database error during sign in:', dbError);
            throw dbError;
          }
        } catch (error) {
          console.error('Error in signIn:', error);
          throw error;
        }
      },

      signOut: async () => {
        console.log('Signing out...'); // Debug log
        try {
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error('Error during sign out:', error);
            throw error;
          }
          console.log('Sign out successful'); // Debug log
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
    }
  )
);
