import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../config';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export interface UserProfile {
  id?: number;
  name: string;
  lastName: string;
  title: string;
  company: string;
  bio: string;
  email: string;
  phoneNumber: string;   // Full E.164 format: +573001234567
  phoneRaw?: string;     // National number only: 3001234567
  linkedIn?: string;
  website?: string;
  profileImageUri: string | null;
  password?: string;
  needsSync?: boolean;
}

interface ProfileState {
  profile: UserProfile | null;
  saveProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
  // Nueva función para establecer el token y el usuario en MMKV
  setAuthData: (accessToken: string, user: Omit<UserProfile, 'password'>) => void;
}



export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      saveProfile: (newProfile: UserProfile) => set({ profile: newProfile }),
      clearProfile: () => {
        set({ profile: null });
        storage.delete('accessToken');
        storage.delete('user');
      },
      setAuthData: (accessToken, user) => {
        storage.set('accessToken', accessToken);
        storage.set('user', JSON.stringify(user));
        set({ profile: user as UserProfile });
      },
    }),
    {
      name: 'user-profile-storage', // Clave persistida en MMKV
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
