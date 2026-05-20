import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-native-qrcode-svg';

import { useProfileStore } from '../../store/useProfileStore';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { styles } from './styles';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import QRModal from '../../components/QRModal';
import SafeImage from '../../components/SafeImage';
import CustomModal from '../../components/CustomModal';
import AppText from '../../components/AppText';

const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-2899284558865652/3693319723';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileDetail'>;

const normalizeUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/^https?:\/\//i, (match) => match.toLowerCase());
  }
  return `https://${trimmed}`;
};

const getLinkedInProfileUrl = (linkedInValue: string) => {
  const trimmed = linkedInValue.trim();
  if (!trimmed) return '';
  if (trimmed.toLowerCase().includes('linkedin.com/in/') || trimmed.toLowerCase().includes('linkedin.com/company/')) {
    return normalizeUrl(trimmed);
  }
  return `https://www.linkedin.com/in/${trimmed}`;
};

const ProfileDetailScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const { profile, clearProfile } = useProfileStore();

  const [whatsappModalVisible, setWhatsappModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [linkedInModalVisible, setLinkedInModalVisible] = useState(false);
  const [websiteModalVisible, setWebsiteModalVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
    primaryText?: string;
    secondaryText?: string;
    onPrimary?: () => void;
    onSecondary?: () => void;
  }>({
    title: '',
    message: '',
    type: 'info',
  });

  const handleMenuPress = () => {
    setModalConfig({
      title: t('profileDetail.header'),
      message: '',
      type: 'info',
      primaryText: t('editProfile.titleEdit'),
      secondaryText: t('common.logout'),
      onPrimary: () => {
        setModalVisible(false);
        navigation.navigate('EditProfile', { isEdit: true });
      },
      onSecondary: () => {
        setModalVisible(false);
        handleLogout();
      },
    });
    setModalVisible(true);
  };

  const handleLogout = () => {
    clearProfile();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleCall = () => {
    if (profile?.phoneNumber) {
      Linking.openURL(`tel:${profile.phoneNumber}`);
    }
  };

  const handleEmail = () => {
    if (profile?.email) {
      Linking.openURL(`mailto:${profile.email}`);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Profile of ${profile?.name}\nEmail: ${profile?.email}\nPhone: ${profile?.phoneNumber}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLinkedIn = () => {
    if (profile?.linkedIn) {
      Linking.openURL(getLinkedInProfileUrl(profile.linkedIn));
    }
  };

  const handleWebsite = () => {
    if (profile?.website) {
      Linking.openURL(normalizeUrl(profile.website));
    }
  };

  const vCardValue = useMemo(() => `BEGIN:VCARD
VERSION:3.0
FN:${profile?.name || ''} ${profile?.lastName || ''}
ORG:${profile?.company || ''}
TITLE:${profile?.title || ''}
TEL;TYPE=CELL:${profile?.phoneNumber || ''}
EMAIL:${profile?.email || ''}
URL:${profile?.website ? normalizeUrl(profile.website) : ''}
NOTE:LinkedIn: ${profile?.linkedIn ? getLinkedInProfileUrl(profile.linkedIn) : ''} | Bio: ${profile?.bio || ''}
END:VCARD`, [profile]);

  const renderInfoItem = (label: string, value: string | undefined, icon: string, onPress: () => void) => {
    if (!value) return null;

    return (
      <TouchableOpacity style={styles.infoItem} onPress={onPress}>
        <View style={styles.infoIconContainer}>
          <AppText style={styles.infoIcon}>{icon}</AppText>
        </View>
        <View style={styles.infoContent}>
          <AppText variant="medium" style={styles.infoLabel}>{label}</AppText>
          <AppText style={styles.infoValue}>{value}</AppText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <AppText variant="semiBold" style={styles.headerTitle}>{t('profileDetail.header')}</AppText>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <AppText style={styles.headerTitle}>⋮</AppText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.imageContainer}>
            <SafeImage
              source={profile?.profileImageUri ? { uri: profile.profileImageUri } : undefined}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>

          <AppText variant="bold" style={styles.name}>
            {profile?.name || profile?.lastName ? `${profile.name} ${profile.lastName}` : 'User Name'}
          </AppText>
          <AppText variant="medium" style={styles.title}>{profile?.title || 'Professional Title'}</AppText>

          {profile?.bio && (
            <AppText style={styles.headerBio}>{profile?.bio}</AppText>
          )}
        </View>

        <View style={styles.infoSection}>
          {renderInfoItem(t('profileDetail.call'), profile?.phoneNumber, '📞', () => setWhatsappModalVisible(true))}
          {renderInfoItem(t('profileDetail.email'), profile?.email, '✉️', () => setEmailModalVisible(true))}
          {renderInfoItem(t('profileDetail.linkedin'), profile?.linkedIn, '🔗', () => setLinkedInModalVisible(true))}
          {renderInfoItem(t('profileDetail.website'), profile?.website, '🌐', () => setWebsiteModalVisible(true))}

          {profile?.company && (
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}><AppText style={styles.infoIcon}>🏢</AppText></View>
              <View style={styles.infoContent}>
                <AppText variant="medium" style={styles.infoLabel}>{t('editProfile.company')}</AppText>
                <AppText style={styles.infoValue}>{profile?.company}</AppText>
              </View>
            </View>
          )}
        </View>

        <View style={styles.qrSection}>
          <View style={styles.qrCardBase}>
            <View style={styles.qrCard}>
              <QRCode
                value={vCardValue}
                size={200}
                color="#1A202C"
                backgroundColor="white"
              />
            </View>
            <View style={styles.qrTextContainer}>
              <AppText variant="bold" style={styles.qrTitle}>{t('profileDetail.scanConnect')}</AppText>
              <AppText style={styles.qrSubtitle}>{t('profileDetail.instantTransfer')}</AppText>
            </View>
          </View>
        </View>
      </ScrollView>

      <QRModal
        visible={whatsappModalVisible}
        onClose={() => setWhatsappModalVisible(false)}
        title="WhatsApp"
        value={`https://wa.me/${profile?.phoneNumber?.replace(/\D/g, '') || ''}`}
        logo={require('../../../assets/images/whatsapp.jpeg')}
      />

      <QRModal
        visible={emailModalVisible}
        onClose={() => setEmailModalVisible(false)}
        title={t('profileDetail.email')}
        value={`mailto:${profile?.email || ''}?subject=Hola, vi tu perfil`}
        logo={require('../../../assets/images/email.jpeg')}
      />

      <QRModal
        visible={linkedInModalVisible}
        onClose={() => setLinkedInModalVisible(false)}
        title="LinkedIn"
        value={profile?.linkedIn ? getLinkedInProfileUrl(profile.linkedIn) : ''}
        logo={require('../../../assets/images/linkedin.jpeg')}
      />

      <QRModal
        visible={websiteModalVisible}
        onClose={() => setWebsiteModalVisible(false)}
        title={t('profileDetail.website')}
        value={profile?.website ? normalizeUrl(profile.website) : ''}
        logo={require('../../../assets/images/website.jpeg')}
      />

      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          networkExtras: {
            collapsible: 'bottom',
          },
        }}
      />

      <CustomModal
        visible={modalVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        primaryButtonText={modalConfig.primaryText}
        secondaryButtonText={modalConfig.secondaryText}
        onPrimaryPress={modalConfig.onPrimary}
        onSecondaryPress={modalConfig.onSecondary}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default ProfileDetailScreen;
