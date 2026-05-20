import { useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useProfileStore } from '../../store/useProfileStore';

export const useResetPassword = (navigation: any, route: any) => {
  const { t } = useTranslation();
  const { profile, saveProfile } = useProfileStore();
  const email = route.params?.email || '';

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!code || !newPassword || !confirmPassword) {
      Alert.alert(t('common.error'), t('forgotPassword.resetPassword.errors.missingFields'));
      return;
    }

    const codeRegex = /^\d{6}$/;
    if (!codeRegex.test(code)) {
      Alert.alert(t('common.error'), t('forgotPassword.resetPassword.errors.invalidCode'));
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(t('common.error'), t('forgotPassword.resetPassword.errors.passwordTooShort'));
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t('common.error'), t('forgotPassword.resetPassword.errors.passwordMismatch'));
      return;
    }

    setLoading(true);
    try {
      // Simular reset (offline mode) - actualizar password localmente
      if (profile) {
        saveProfile({
          ...profile,
          password: newPassword,
        });
      }

      Alert.alert(
        t('common.success'),
        t('forgotPassword.resetPassword.success'),
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      console.error('Reset password error:', error);
      Alert.alert(
        t('common.error'),
        t('forgotPassword.resetPassword.errors.generic', 'Error al restablecer contraseña.')
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    code,
    setCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    handleReset,
    email,
    t,
  };
};
