import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../config';

interface UserState {
  name: string;
  setName: (name: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: '',
      setName: (name) => set({ name }),
    }),
    {
      name: 'user-storage', // clave única
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);