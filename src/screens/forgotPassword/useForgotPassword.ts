import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

export const useForgotPassword = (navigation: any) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleBack = () => {
    navigation.navigate('Login');
  };

  const handleResetPassword = async () => {
    if (countdown > 0) return;

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert(
        t('common.error', 'Error'),
        t('login.errors.missingCredentials', 'Por favor ingresa tu correo electrónico.')
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
      // Simular envío de correo (offline mode)
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCountdown(60);

      Alert.alert(
        t('common.success', '¡Éxito!'),
        t('forgotPassword.successMessage', 'En modo offline, no se envía correo real. Continúa para restablecer contraseña.'),
        [{ text: 'OK', onPress: () => navigation.navigate('ResetPassword', { email: trimmedEmail }) }]
      );
    } catch (error: any) {
      console.error('Forgot password error:', error);
      Alert.alert(
        t('common.error'),
        t('forgotPassword.errors.generic', 'Error al procesar solicitud.')
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    loading,
    handleResetPassword,
    handleBack,
    countdown,
  };
};
