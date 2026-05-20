import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useProfileStore } from '../../store/useProfileStore';
import { Alert } from 'react-native';

export const useLogin = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguageStore();
  const { profile, setAuthData } = useProfileStore();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (navigate: (screen: keyof RootStackParamList, params?: any) => void) => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert(
        t('common.error', 'Error'),
        t('login.errors.missingEmail', 'Por favor ingresa tu correo electrónico.')
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert(
        t('common.error', 'Error'),
        t('forgotPassword.invalidEmail', 'Por favor ingresa un correo electrónico válido.')
      );
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (profile) {
        navigate('ProfileDetail');
      } else {
        setAuthData(trimmedEmail, {
          name: '',
          lastName: '',
          title: '',
          company: '',
          bio: '',
          phoneNumber: '',
          profileImageUri: null,
        });
        navigate('EditProfile', { isEdit: false });
      }
    } catch (error: any) {
      console.warn('Login error:', error);
      Alert.alert(
        t('login.errorTitle'),
        t('login.errors.generic', 'Error al iniciar sesión.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = (navigate: (screen: keyof RootStackParamList, params?: any) => void) => {
    navigate('EditProfile', { isEdit: false });
  };

  return {
    t,
    email,
    setEmail,
    loading,
    language,
    handleLogin,
    handleCreateProfile,
    toggleLanguage,
  };
};
