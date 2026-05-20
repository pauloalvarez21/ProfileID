import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useProfileStore } from '../../store/useProfileStore';
import { Alert } from 'react-native';
import { mmkvStorage } from '../../config';

export const useLogin = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguageStore();
  const { setAuthData, profile } = useProfileStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    // Simular carga para UX consistente
    setTimeout(() => {
      setLegalContent(getStaticLegalContent(type));
      setLegalLoading(false);
    }, 300);
  };

  const handleLogin = async (navigate: (screen: keyof RootStackParamList, params?: any) => void) => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert(
        t('common.error', 'Error'),
        t('login.errors.missingCredentials', 'Please enter your credentials.')
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
      // Simular delay para UX
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verificar si ya existe un perfil guardado con ese email
      const storedUser = mmkvStorage.getItem('user');
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email === trimmedEmail) {
          // Login exitoso con usuario existente
          navigate('ProfileDetail');
          setLoading(false);
          return;
        }
      }

      // Para login, verificamos si las credenciales coinciden con algún perfil guardado
      // En modo offline, permitimos el acceso si hay un perfil guardado
      if (profile) {
        navigate('ProfileDetail');
      } else {
        // Si no hay perfil, creamos uno básico con las credenciales
        setAuthData('local-token-' + Date.now(), {
          email: trimmedEmail,
          name: trimmedEmail.split('@')[0],
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
    password,
    setPassword,
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
