import { create } from "zustand";
import { authService } from "@/Service/authService";
import { ProfileData } from "@/Type/profile";

interface UserState {
  profile: ProfileData | null;
  isLoading: boolean;
  fetchProfile: () => Promise<void>;
  setProfile: (profile: ProfileData) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: false,
  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const res = await authService.getProfile();
      set({ profile: res.data.user, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }), 
}));