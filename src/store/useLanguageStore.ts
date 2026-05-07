import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import i18n from '../i18n';
import { mmkvStorage } from '../config';

interface LanguageState {
  language: string;
  setLanguage: (lang: string) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: i18n.language || 'es',
      setLanguage: (lang: string) => {
        i18n.changeLanguage(lang);
        set({ language: lang });
      },
      toggleLanguage: () => {
        const newLang = get().language === 'es' ? 'en' : 'es';
        i18n.changeLanguage(newLang);
        set({ language: newLang });
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
