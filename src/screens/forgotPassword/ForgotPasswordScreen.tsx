import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomButton from '../../components/CustomButton';
import { useForgotPassword } from './useForgotPassword';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ForgotPasswordScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { email, setEmail, loading, handleResetPassword, handleBack, countdown } = useForgotPassword(navigation);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.heroSection}>
            <Text style={styles.accessPortal}>{t('forgotPassword.title').toUpperCase()}</Text>
            <Text style={styles.heroTitle}>{t('forgotPassword.title')}</Text>
            <Text style={styles.heroDescription}>{t('forgotPassword.description')}</Text>
            <View style={styles.accentLine} />
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('forgotPassword.emailLabel')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('forgotPassword.emailPlaceholder', 'example@mail.com')}
                placeholderTextColor="#A0ABC0"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>

            <CustomButton
              title={countdown > 0 
                ? t('forgotPassword.cooldown', { seconds: countdown }) 
                : t('forgotPassword.sendButton')}
              onPress={handleResetPassword}
              disabled={loading || countdown > 0}
              loading={loading}
              style={styles.submitButton}
            />

            <TouchableOpacity style={styles.backButton} onPress={handleBack} disabled={loading}>
              <Text style={styles.backButtonText}>{t('forgotPassword.backToLogin')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FB',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  heroSection: {
    paddingHorizontal: 24,
    marginTop: 40,
    marginBottom: 30,
  },
  accessPortal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#718096',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2D3748',
    marginBottom: 16,
  },
  heroDescription: {
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 24,
    marginBottom: 24,
  },
  accentLine: {
    width: 50,
    height: 3,
    backgroundColor: '#CBD5E0',
    borderRadius: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F1F4F8',
    height: 52,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#2D3748',
  },
  button: {
    backgroundColor: '#2D3748',
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#A0ABC0',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: '#4E576B',
    marginTop: 10,
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#718096',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ForgotPasswordScreen;