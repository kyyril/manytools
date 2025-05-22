import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./use-auth";

interface TokenState {
  tokens: number;
  guestUsageCount: number;
  addTokens: (amount: number) => Promise<void>;
  useToken: () => Promise<boolean>;
  resetGuestUsage: () => void;
  fetchTokens: () => Promise<void>;
}

export const useTokens = create<TokenState>((set, get) => ({
  tokens: 3,
  guestUsageCount: 0,

  fetchTokens: async () => {
    const { user } = useAuth.getState();
    if (!user) {
      set({ tokens: 3 }); // Reset to default for guests
      return;
    }

    try {
      const { data, error } = await supabase
        .from("tokens")
        .select("amount")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      set({ tokens: data?.amount ?? 3 });
    } catch (error) {
      console.error("Error fetching tokens:", error);
      set({ tokens: 3 }); // Fallback to default
    }
  },

  addTokens: async (amount: number) => {
    const { user } = useAuth.getState();
    if (!user) return;

    try {
      const newAmount = get().tokens + amount;
      const { error } = await supabase
        .from("tokens")
        .update({
          amount: newAmount,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;
      set({ tokens: newAmount });
    } catch (error) {
      console.error("Error adding tokens:", error);
    }
  },

  useToken: async () => {
    const { user } = useAuth.getState();
    const { tokens, guestUsageCount } = get();

    // Guest user logic
    if (!user) {
      if (guestUsageCount < 2) {
        set((state) => ({ guestUsageCount: state.guestUsageCount + 1 }));
        return true;
      }
      return false;
    }

    // Logged in user with tokens
    if (tokens > 0) {
      try {
        const { error } = await supabase
          .from("tokens")
          .update({ amount: tokens - 1 })
          .eq("user_id", user.id);

        if (error) throw error;

        // Log usage
        await supabase
          .from("usage_logs")
          .insert([{ user_id: user.id, tool: window.location.pathname }]);

        set((state) => ({ tokens: state.tokens - 1 }));
        return true;
      } catch (error) {
        console.error("Error using token:", error);
        return false;
      }
    }

    return false;
  },

  resetGuestUsage: () => {
    set({ guestUsageCount: 0 });
  },
}));
