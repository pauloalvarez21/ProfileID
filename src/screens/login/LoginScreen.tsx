import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import PrivacyModal from '../../components/PrivacyModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

import { useLogin } from './useLogin';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const {
    t,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin,
    handleCreateProfile,
    language,
    toggleLanguage,
    legalVisible,
    setLegalVisible,
    legalLoading,
    legalContent,
    legalTitle,
    fetchLegalContent,
  } = useLogin();

  const currentYear = new Date().getFullYear();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.navBar}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <View style={styles.logoCircle} />
            </View>
            <Text style={styles.logoText}>SlateID</Text>
          </View>

          <TouchableOpacity onPress={toggleLanguage} style={styles.langToggle}>
            <View style={styles.langPill}>
              <Text style={styles.langText}>{language.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>{t('login.heroTitle')}</Text>
          <Text style={styles.heroDescription}>{t('login.heroDescription')}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('login.emailLabel')}</Text>
            <TextInput
              style={styles.input}
              placeholder="name@nexus-slate.com"
              placeholderTextColor="#A0ABC0"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{t('login.passwordLabel')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} disabled={loading}>
                <Text style={styles.forgotText}>{t('login.forgot')}</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#A0ABC0"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <CustomButton
            title={t('login.loginButton')}
            onPress={() => handleLogin(navigation.navigate)}
            loading={loading}
            icon="→"
            style={{ marginTop: 10 }}
          />

          <View style={styles.divider} />

          <View style={styles.signupContainer}>
            <Text style={styles.newToText}>{t('login.newToEcosystem')}</Text>
            <CustomButton
              title={t('login.createProfile')}
              onPress={() => handleCreateProfile(navigation.navigate)}
              variant="secondary"
              icon="+"
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>Gaelectronica {'\u00a9'} 2024 - {new Date().getFullYear()}</Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => fetchLegalContent('privacy')}>
              <Text style={[styles.footerLink, styles.footerLinkTappable]}>{t('common.privacy')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => fetchLegalContent('terms')}>
              <Text style={[styles.footerLink, styles.footerLinkTappable]}>{t('common.terms')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => fetchLegalContent('security')}>
              <Text style={[styles.footerLink, styles.footerLinkTappable]}>{t('common.security')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <PrivacyModal
        visible={legalVisible}
        onClose={() => setLegalVisible(false)}
        content={legalContent}
        loading={legalLoading}
        title={legalTitle}
        closeText={t('common.close')}
      />
    </SafeAreaView>
  );
};

export default LoginScreen;
