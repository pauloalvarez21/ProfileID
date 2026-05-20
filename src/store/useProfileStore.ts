import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../config';

export interface UserProfile {
  id?: number;
  name: string;
  lastName: string;
  title: string;
  company: string;
  bio: string;
  email: string;
  phoneNumber: string;
  phoneRaw?: string;
  linkedIn?: string;
  website?: string;
  profileImageUri: string | null;
}

interface ProfileState {
  profile: UserProfile | null;
  saveProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
  setAuthData: (email: string, user: Omit<UserProfile, 'id'>) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      saveProfile: (newProfile: UserProfile) => set({ profile: newProfile }),
      clearProfile: () => {
        set({ profile: null });
      },
      setAuthData: (email, user) => {
        set({ profile: { ...user, email } as UserProfile });
      },
    }),
    {
      name: 'user-profile-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
