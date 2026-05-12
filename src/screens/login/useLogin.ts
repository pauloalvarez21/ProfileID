import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useProfileStore } from '../../store/useProfileStore';
import { Alert } from 'react-native';
import { Config } from '../../config';
import api from '../../services/api';
import { parseApiError } from '../../services/errorService';

export const useLogin = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguageStore();
  const { setAuthData } = useProfileStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Legal modal state (Generic for Privacy, Terms, Security)
  const [legalVisible, setLegalVisible] = useState(false);
  const [legalLoading, setLegalLoading] = useState(false);
  const [legalContent, setLegalContent] = useState('');
  const [legalTitle, setLegalTitle] = useState('');

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

    try {
      const response = await api.get(`/legal/${type}`); // Axios ya parsea el JSON
      setLegalContent(response.data.content || response.data.text || response.data);
    } catch (error: any) {
      console.error(`Error fetching ${type}:`, error);
      const parsed = parseApiError(error);
      // Usamos el mensaje estandarizado si es error de red, o el mensaje de carga legal
      const errorMsg = parsed.isNetworkError 
        ? t(parsed.message)
        : t('login.errors.legalLoad', { title: titleMap[type] });
      setLegalContent(errorMsg);
    } finally {
      setLegalLoading(false);
    }
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
      const response = await api.post('/auth/login', { 
        email: trimmedEmail, 
        password: trimmedPassword 
      });
      const { accessToken, user } = response.data;
      
      console.log('--- DEBUG LOGIN ---');
      console.log('Token recibido:', accessToken ? 'SI' : 'NO');

      const imageFilename = user.profileImageUri;
      let finalImageUri = null;
      if (imageFilename) {
        // Construir la URL completa de la imagen
        finalImageUri = `${Config.BASE_URL}${Config.API_PREFIX}/images/${imageFilename}`;
      }

      // Guardar token y datos del usuario usando la nueva función del store
      // Esto actualiza MMKV para el interceptor y Zustand para la UI
      setAuthData(accessToken, { ...user, profileImageUri: finalImageUri });

      navigate('ProfileDetail');
    } catch (error: any) {
      const parsed = parseApiError(error);
      console.warn('Login error:', parsed);
      
      Alert.alert(
        t('login.errorTitle'),
        t(parsed.message)
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
