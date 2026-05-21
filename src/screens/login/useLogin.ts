import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '../../store/useLanguageStore';

export const useLogin = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguageStore();

  return {
    t,
    language,
    toggleLanguage,
  };
};
