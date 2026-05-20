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

  // Legal modal state (static content for offline mode)
  const [legalVisible, setLegalVisible] = useState(false);
  const [legalLoading, setLegalLoading] = useState(false);
  const [legalContent, setLegalContent] = useState('');
  const [legalTitle, setLegalTitle] = useState('');

  const getStaticLegalContent = (type: 'privacy' | 'terms' | 'security'): string => {
    switch (type) {
      case 'privacy':
        return t('legal.privacyContent') || 'Política de Privacidad\n\nSus datos se almacenan localmente en su dispositivo. No compartimos información con terceros.';
      case 'terms':
        return t('legal.termsContent') || 'Términos de Uso\n\nEsta aplicación funciona sin conexión. Los datos se guardan localmente en su dispositivo.';
      case 'security':
        return t('legal.securityContent') || 'Seguridad\n\nSu información está protegida en el almacenamiento local de su dispositivo.';
      default:
        return '';
    }
  };

  const fetchLegalContent = async (type: 'privacy' | 'terms' | 'security') => {
    const titleMap = {
      privacy: t('common.privacy'),
      terms: t('common.terms'),
      security: t('common.security'),
    };

    setLegalTitle(titleMap[type]);
    setLegalVisible(true);
    setLegalLoading(true);
    setLegalContent('');

    setTimeout(() => {
      setLegalContent(getStaticLegalContent(type));
      setLegalLoading(false);
    }, 300);
  };

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

      // Si ya hay un perfil guardado, ir directo al perfil
      if (profile) {
        navigate('ProfileDetail');
      } else {
        // Si no hay perfil, guardamos el email y vamos a crear perfil
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
    legalVisible,
    setLegalVisible,
    legalLoading,
    legalContent,
    legalTitle,
    fetchLegalContent,
  };
};
