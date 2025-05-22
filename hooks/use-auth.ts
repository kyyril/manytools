import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useTokens } from "./use-tokens";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>; // Added initialize function
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // Changed to true initially
  error: null,

  initialize: async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;

      if (session?.user) {
        // Check and create profile if missing
        let { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (!profile) {
          // Create profile if it doesn't exist
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: session.user.id,
              name: session.user.email!.split("@")[0],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (profileError) throw profileError;
        }

        // Check and create tokens if missing
        let { data: tokens } = await supabase
          .from("tokens")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (!tokens) {
          // Create tokens if they don't exist
          const { error: tokenError } = await supabase.from("tokens").insert({
            user_id: session.user.id,
            amount: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

          if (tokenError) throw tokenError;
        }

        // Set user state
        set({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || session.user.email!.split("@")[0],
          },
          isLoading: false,
        });

        // Initialize tokens in the tokens store
        const tokensStore = useTokens.getState();
        await tokensStore.fetchTokens();
      } else {
        set({ user: null, isLoading: false });
      }

      // Set up auth state change listener
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", session.user.id)
            .single();

          set({
            user: {
              id: session.user.id,
              email: session.user.email!,
              name: profile?.name || session.user.email!.split("@")[0],
            },
            isLoading: false,
          });
        } else {
          set({ user: null, isLoading: false });
        }
      });
    } catch (error) {
      console.error("Initialize error:", error);
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", data.user.id)
          .single();

        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            name: profile?.name || email.split("@")[0],
          },
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name, // Store name in auth metadata
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User registration failed");

      // 2. Create profile and tokens in a transaction
      const { error: dbError } = await supabase.rpc("create_user_profile", {
        user_id: authData.user.id,
        user_name: name,
        initial_tokens: 3,
      });

      if (dbError) throw dbError;

      // 3. Set the user state
      set({
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          name,
        },
        isLoading: false,
      });

      // 4. Initialize tokens in the tokens store
      await useTokens.getState().fetchTokens();
    } catch (error) {
      console.error("Registration error:", error);
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
    }
  },
}));
