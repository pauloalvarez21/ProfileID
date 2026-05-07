import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useResetPassword } from './useResetPassword';
import { styles } from './resetPasswordStyles';

const ResetPasswordScreen = ({ navigation, route }: any) => {
  const {
    code,
    setCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    handleReset,
    email,
    t
  } = useResetPassword(navigation, route);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{t('forgotPassword.resetPassword.title')}</Text>
          <Text style={styles.description}>
            {t('forgotPassword.resetPassword.description')}
          </Text>
          <Text style={styles.emailText}>{email}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('forgotPassword.resetPassword.codeLabel')}</Text>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={(text) => setCode(text.replace(/[^0-9]/g, ''))}
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('forgotPassword.resetPassword.newPasswordLabel')}</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="********"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('forgotPassword.resetPassword.confirmPasswordLabel')}</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="********"
            />
          </View>

          <CustomButton
            title={t('forgotPassword.resetPassword.resetButton')}
            onPress={handleReset}
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;