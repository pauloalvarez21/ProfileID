import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

import { useLogin } from './useLogin';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const {
    t,
    language,
    toggleLanguage,
  } = useLogin();

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
          <View style={styles.signupContainer}>
            <Text style={styles.newToText}>{t('login.newToEcosystem')}</Text>
            <CustomButton
              title={t('login.createProfile')}
              onPress={() => navigation.navigate('EditProfile', { isEdit: false })}
              variant="secondary"
              icon="+"
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>Gaelectronica {'\u00a9'} 2024 - {new Date().getFullYear()}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
