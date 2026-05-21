import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useProfileStore } from '../../store/useProfileStore';

export const useLogin = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguageStore();
  const { profile, setAuthData } = useProfileStore();

  const [loading, setLoading] = useState(false);

  const handleLogin = async (navigate?: (screen: keyof RootStackParamList, params?: any) => void) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (profile) {
        navigate?.('ProfileDetail');
      } else {
        setAuthData('', {
          name: '',
          lastName: '',
          title: '',
          company: '',
          bio: '',
          phoneNumber: '',
          profileImageUri: null,
        });
        navigate?.('EditProfile', { isEdit: false });
      }
    } catch (error: any) {
      console.warn('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = (navigate: (screen: keyof RootStackParamList, params?: any) => void) => {
    navigate('EditProfile', { isEdit: false });
  };

  return {
    t,
    loading,
    language,
    handleLogin,
    handleCreateProfile,
    toggleLanguage,
  };
};
