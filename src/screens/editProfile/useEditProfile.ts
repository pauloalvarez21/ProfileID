import { useState, useEffect } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import { useTranslation } from 'react-i18next';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import { useProfileStore } from '../../store/useProfileStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { isValidEmail, isValidUrl, validateFieldLength, containsDangerousContent, sanitizeInput, FIELD_LIMITS } from './validation';

export const useEditProfile = (
  isEditMode: boolean = false,
  navigation: NativeStackNavigationProp<RootStackParamList>
) => {
  const { t } = useTranslation();
  const { profile, saveProfile, clearProfile } = useProfileStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [shouldNavigateBack, setShouldNavigateBack] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  const [primaryButtonText, setPrimaryButtonText] = useState('');
  const [secondaryButtonText, setSecondaryButtonText] = useState<string | undefined>(undefined);

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneRaw, setPhoneRaw] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [website, setWebsite] = useState('');
  const [profileImage, setProfileImage] = useState<Asset | { uri: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && profile) {
      setName(profile.name || '');
      setLastName(profile.lastName || '');
      setTitle(profile.title || '');
      setCompany(profile.company || '');
      setBio(profile.bio || '');
      setEmail(profile.email || '');
      setPhoneNumber(profile.phoneNumber || '');
      setPhoneRaw(profile.phoneRaw || '');
      setLinkedIn(profile.linkedIn || '');
      setWebsite(profile.website || '');
      setProfileImage(profile.profileImageUri ? { uri: profile.profileImageUri } : null);
    } else if (!isEditMode) {
      setName('');
      setLastName('');
      setTitle('');
      setCompany('');
      setBio('');
      setEmail('');
      setPhoneNumber('');
      setPhoneRaw('');
      setLinkedIn('');
      setWebsite('');
      setProfileImage(null);
    }
  }, [isEditMode, profile]);

  const openCamera = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: t('editProfile.cameraPermissionTitle', 'Camera Permission'),
          message: t('editProfile.cameraPermissionMessage', 'This app needs access to your camera to take a profile photo.'),
          buttonPositive: t('common.allow', 'Allow'),
          buttonNegative: t('common.deny', 'Deny'),
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          t('editProfile.cameraPermissionTitle', 'Camera Permission'),
          t('editProfile.cameraPermissionDenied', 'Camera permission was denied. Please enable it in your device settings.')
        );
        return;
      }
    }
    launchCamera(
      { mediaType: 'photo', quality: 0.7, maxWidth: 1200, maxHeight: 1200 },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setProfileImage(response.assets[0]);
        }
      }
    );
  };

  const handleSelectImage = () => {
    Alert.alert(
      t('editProfile.uploadPhoto'),
      '',
      [
        {
          text: t('editProfile.takePhoto', 'Take Photo'),
          onPress: openCamera,
        },
        {
          text: t('editProfile.gallery', 'Gallery'),
          onPress: () => {
            launchImageLibrary({
              mediaType: 'photo',
              quality: 0.7,
              maxWidth: 1200,
              maxHeight: 1200
            }, (response) => {
              if (response.assets && response.assets.length > 0) {
                setProfileImage(response.assets[0]);
              }
            });
          },
        },
        {
          text: t('common.cancel', 'Cancel'),
          style: 'cancel',
        },
      ]
    );
  };

  const validateForm = (data: any) => {
    if (!data.name || !data.phoneNumber || !data.email) {
      showModalError(t('editProfile.errors.mandatoryFields', 'Please fill in all mandatory fields (*).'));
      return false;
    }

    const fieldLimits = ['name', 'lastName', 'title', 'company', 'bio', 'linkedIn', 'website'];
    for (const field of fieldLimits) {
      const value = data[field as keyof typeof data] || '';
      if (!validateFieldLength(field, value)) {
        const limit = FIELD_LIMITS[field as keyof typeof FIELD_LIMITS];
        showModalError(`${field} exceeds maximum length of ${limit} characters`);
        return false;
      }
    }

    for (const field of ['name', 'lastName', 'title', 'company', 'bio', 'linkedIn', 'website']) {
      const value = data[field as keyof typeof data] || '';
      if (containsDangerousContent(value)) {
        showModalError(t('editProfile.errors.invalidInput', 'Invalid characters detected in field.'));
        return false;
      }
    }

    if (!isValidEmail(data.email)) {
      showModalError(t('editProfile.errors.invalidEmail', 'Please enter a valid email address.'));
      return false;
    }

    if (!isValidUrl(data.linkedIn)) {
      showModalError(t('editProfile.errors.invalidUrl', 'Please enter a valid LinkedIn URL.'));
      return false;
    }

    if (!isValidUrl(data.website)) {
      showModalError(t('editProfile.errors.invalidUrl', 'Please enter a valid website URL.'));
      return false;
    }

    return true;
  };

  const showModalError = (message: string) => {
    setModalTitle(t('common.error', 'Error'));
    setModalMessage(message);
    setModalType('error');
    setPrimaryButtonText(t('common.close'));
    setSecondaryButtonText(undefined);
    setShouldNavigateBack(false);
    setModalVisible(true);
  };

  const handleShowLinkedInTooltip = () => {
    setModalTitle(t('profileDetail.linkedin'));
    setModalMessage(t('editProfile.tooltips.linkedIn'));
    setModalType('success');
    setPrimaryButtonText(t('common.close'));
    setSecondaryButtonText(undefined);
    setShouldNavigateBack(false);
    setModalVisible(true);
  };

  const handleShowImageTooltip = () => {
    setModalTitle(t('editProfile.uploadPhoto'));
    setModalMessage(t('editProfile.tooltips.profileImage'));
    setModalType('success');
    setPrimaryButtonText(t('common.close'));
    setSecondaryButtonText(undefined);
    setShouldNavigateBack(false);
    setModalVisible(true);
  };

  const handleShowProfessionalTitleTooltip = () => {
    setModalTitle(t('editProfile.professionalTitle'));
    setModalMessage(t('editProfile.tooltips.professionalTitle'));
    setModalType('success');
    setPrimaryButtonText(t('common.close'));
    setSecondaryButtonText(undefined);
    setShouldNavigateBack(false);
    setModalVisible(true);
  };

  const handleShowBriefBioTooltip = () => {
    setModalTitle(t('editProfile.briefBio'));
    setModalMessage(t('editProfile.tooltips.briefBio'));
    setModalType('success');
    setPrimaryButtonText(t('common.close'));
    setSecondaryButtonText(undefined);
    setShouldNavigateBack(false);
    setModalVisible(true);
  };

  const handleSave = () => {
    const formValues = { name, lastName, title, company, bio, email, phoneNumber, phoneRaw, linkedIn, website };
    const trimmed = Object.fromEntries(
      Object.entries(formValues).map(([key, value]) => [key, value.trim()])
    ) as typeof formValues;

    if (!validateForm(trimmed)) return;

    const sanitized = {
      ...trimmed,
      name: sanitizeInput(trimmed.name),
      lastName: sanitizeInput(trimmed.lastName),
      title: sanitizeInput(trimmed.title),
      company: sanitizeInput(trimmed.company),
      bio: sanitizeInput(trimmed.bio),
      linkedIn: sanitizeInput(trimmed.linkedIn),
      website: sanitizeInput(trimmed.website),
    } as typeof trimmed;

    saveProfile({
      ...sanitized,
      profileImageUri: (profileImage as any)?.uri || null,
      id: isEditMode ? profile?.id : Date.now(),
    });

    setModalTitle(t('common.success', 'Success!'));
    setModalType('success');
    setModalMessage(isEditMode ? t('editProfile.success.updated') : t('editProfile.success.created'));
    setPrimaryButtonText(isEditMode ? t('editProfile.viewProfile') : t('editProfile.viewCard'));
    setSecondaryButtonText(undefined);
    setShouldNavigateBack(true);
    setModalVisible(true);
  };

  const handleConfirmModal = () => {
    setModalVisible(false);
    if (shouldNavigateBack) {
      if (isEditMode) {
        navigation.goBack();
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'ProfileDetail' }],
        });
      }
    }
  };

  const handleDeleteProfile = () => {
    if (!profile) return;

    Alert.alert(
      t('editProfile.deleteTitle', 'Delete Profile'),
      t('editProfile.deleteDescription', 'Are you sure you want to delete your profile? This action cannot be undone.'),
      [
        {
          text: t('common.cancel', 'Cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete', 'Delete'),
          onPress: () => {
            clearProfile();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
          style: 'destructive',
        },
      ]
    );
  };

  return {
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
    modal: {
      visible: modalVisible,
      title: modalTitle,
      message: modalMessage,
      type: modalType,
      primaryButtonText,
      secondaryButtonText,
      handleConfirm: handleConfirmModal,
      onClose: () => setModalVisible(false),
    },
    form: {
      name, setName,
      lastName, setLastName,
      title, setTitle,
      company, setCompany,
      bio, setBio,
      email, setEmail,
      phoneNumber, setPhoneNumber,
      phoneRaw, setPhoneRaw,
      linkedIn, setLinkedIn,
      website, setWebsite,
    }
  };
};
