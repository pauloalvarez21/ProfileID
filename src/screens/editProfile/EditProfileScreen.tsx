import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import PhoneInput from 'react-native-phone-number-input';

import CustomButton from '../../components/CustomButton';
import CustomModal from '../../components/CustomModal';
import SafeImage from '../../components/SafeImage';
import { useEditProfile } from './useEditProfile';
import { styles } from './styles';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-2899284558865652/3693319723';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

const EditProfileScreen = ({ navigation, route }: Props) => {
  const isEditParam = route.params?.isEdit ?? false;

  const {
    t,
    isEditMode,
    profileImage,
    loading,
    handleSelectImage,
    handleSave,
    handleDeleteProfile,
    handleShowLinkedInTooltip,
    handleShowProfessionalTitleTooltip,
    handleShowBriefBioTooltip,
    handleShowImageTooltip,
    modal,
    form
  } = useEditProfile(isEditParam, navigation);

  return (
    <SafeAreaView style={styles.container}>
      <CustomModal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        primaryButtonText={modal.primaryButtonText}
        onPrimaryPress={modal.handleConfirm}
        onSecondaryPress={modal.onClose}
        secondaryButtonText={modal.secondaryButtonText}
        type={modal.type}
      />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Login')}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? t('editProfile.titleEdit') : t('editProfile.titleCreate')}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <View style={styles.miniLogo}>
            <View style={styles.logoCircle} />
          </View>

          <TouchableOpacity style={styles.photoContainer} onPress={handleSelectImage}>
            <View style={styles.dashedBorder}>
              <SafeImage 
                source={profileImage} 
                style={styles.selectedImage} 
              />
            </View>
            <View style={styles.editIconBadge}>
              <Text style={styles.pencilEmoji}>✎</Text>
            </View>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.uploadText}>{t('editProfile.uploadPhoto')}</Text>
            <TouchableOpacity 
              onPress={handleShowImageTooltip}
              style={{ marginLeft: 8 }}
            >
              <Text style={{ fontSize: 16, color: '#A0ABC0' }}>ⓘ</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('editProfile.fullName')}</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Julian Voss"
              placeholderTextColor="#A0ABC0"
              value={form.name}
              onChangeText={form.setName}
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('editProfile.lastName')}</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Voss"
              placeholderTextColor="#A0ABC0"
              value={form.lastName}
              onChangeText={form.setLastName}
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={[styles.label, { marginBottom: 0 }]}>{t('editProfile.professionalTitle')}</Text>
              <TouchableOpacity
                onPress={handleShowProfessionalTitleTooltip}
                style={{ marginLeft: 8 }}
              >
                <Text style={{ fontSize: 16, color: '#A0ABC0' }}>ⓘ</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g. Principal Architect"
              placeholderTextColor="#A0ABC0"
              value={form.title}
              onChangeText={form.setTitle}
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('editProfile.company')}</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Slate & Steel Studio"
              placeholderTextColor="#A0ABC0"
              value={form.company}
              onChangeText={form.setCompany}
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('editProfile.email')}</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#A0ABC0"
              value={form.email}
              onChangeText={form.setEmail}
              keyboardType='email-address'
              autoCapitalize='none'
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('editProfile.phoneNumber')}</Text>
            <PhoneInput
              value={form.phoneRaw}
              defaultCode="CO"
              layout="first"
              onChangeText={(text) => {
                form.setPhoneRaw(text);
              }}
              onChangeFormattedText={(text) => {
                form.setPhoneNumber(text);
              }}
              containerStyle={[styles.input, { padding: 0, overflow: 'hidden', width: '100%' }]}
              textContainerStyle={{ backgroundColor: 'transparent', paddingVertical: 0 }}
              textInputStyle={{ color: '#2D3748', height: 50, fontSize: 16 }}
              codeTextStyle={{ color: '#2D3748' }}
              placeholder="300 000 0000"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={[styles.label, { marginBottom: 0 }]}>LINKEDIN</Text>
              <TouchableOpacity 
                onPress={handleShowLinkedInTooltip}
                style={{ marginLeft: 8 }}
              >
                <Text style={{ fontSize: 16, color: '#A0ABC0' }}>ⓘ</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="username"
              placeholderTextColor="#A0ABC0"
              value={form.linkedIn}
              onChangeText={form.setLinkedIn}
              autoCapitalize="none"
              maxLength={200}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>WEBSITE</Text>
            <TextInput
              style={styles.input}
              placeholder="www.yourwebsite.com"
              placeholderTextColor="#A0ABC0"
              value={form.website}
              onChangeText={form.setWebsite}
              autoCapitalize="none"
              keyboardType="url"
              maxLength={200}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={[styles.label, { marginBottom: 0 }]}>{t('editProfile.briefBio')}</Text>
              <TouchableOpacity
                onPress={handleShowBriefBioTooltip}
                style={{ marginLeft: 8 }}
              >
                <Text style={{ fontSize: 16, color: '#A0ABC0' }}>ⓘ</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Briefly describe your professional ethos..."
              placeholderTextColor="#A0ABC0"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={form.bio}
              onChangeText={form.setBio}
              maxLength={500}
            />
          </View>

          <CustomButton
            title={isEditMode ? t('editProfile.updateButton') : t('editProfile.createButton')}
            onPress={handleSave}
            loading={loading}
            style={{ marginBottom: isEditMode ? 16 : 40 }}
          />

          {isEditMode && (
            <CustomButton
              title={t('editProfile.deleteProfile')}
              onPress={handleDeleteProfile}
              loading={loading}
              variant="secondary"
              textStyle={{ color: '#ef4444' }}
              style={{ marginBottom: 40, borderColor: '#ef4444' }}
            />
          )}
        </View>
      </ScrollView>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          networkExtras: {
            collapsible: 'bottom',
          },
        }}
      />
    </SafeAreaView>
  );
};

export default EditProfileScreen;
