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
  const { profile, saveProfile } = useProfileStore();
  
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
    if (!trimmedEmail || !password.trim()) {
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
      const response = await api.post('/auth/login', { email, password }); // Axios ya parsea el JSON
      
      console.log('--- DEBUG LOGIN ---');
      console.log('Respuesta completa del servidor:', response.data);
      console.log('Campo profileImageUri (crudo):', response.data.profileImageUri);

      const finalImageUri = response.data.profileImageUri 
        ? `${Config.BASE_URL}/uploads/profiles/${response.data.profileImageUri}`
        : null;
      
      console.log('URL Final construida para mostrar:', finalImageUri);

      // Save valid data to store
      saveProfile({
        ...response.data,
        profileImageUri: finalImageUri,
      });

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
