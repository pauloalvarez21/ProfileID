import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import { useProfileStore } from '../../store/useProfileStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Config } from '../../config'; // Asegúrate de que esta ruta sea correcta según tu estructura
import api from '../../services/api';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { isValidEmail } from './validation';
import { parseApiError } from '../../services/errorService';


export const useEditProfile = (
  isEditMode: boolean = false, 
  navigation: NativeStackNavigationProp<RootStackParamList>
) => {
  const { t, i18n } = useTranslation();
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
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<Asset | { uri: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const currentLanguage = i18n.language;

  useEffect(() => {
    if (isEditMode && profile) {
      setName(profile.name || '');
      setLastName(profile.lastName || '');
      setTitle(profile.title || '');
      setCompany(profile.company || '');
      setBio(profile.bio || '');
      setEmail(profile.email || '');
      setPhoneNumber(profile.phoneNumber || '');
      setPhoneRaw(profile.phoneRaw || ''); // Asegura que phoneRaw se inicialice
      setLinkedIn(profile.linkedIn || '');
      setWebsite(profile.website || '');
      setProfileImage(profile.profileImageUri ? { uri: profile.profileImageUri } : null);
      // Las contraseñas no se pre-rellenan por seguridad.
    } else if (!isEditMode) {
      // Limpiar los campos del formulario cuando no estamos en modo edición (creando un nuevo perfil)
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
      setPassword('');
      setConfirmPassword('');
    }
  }, [isEditMode, profile]); // Este efecto se ejecutará cuando isEditMode o profile cambien

  const handleSelectImage = () => {
    Alert.alert(
      t('editProfile.uploadPhoto'),
      '',
      [
        {
          text: t('editProfile.takePhoto', 'Take Photo'),
          onPress: () => {
            launchCamera({ 
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

    if (!isValidEmail(data.email)) {
      showModalError(t('editProfile.errors.invalidEmail', 'Please enter a valid email address.'));
      return false;
    }

    // Si es creación, la contraseña es obligatoria
    if (!isEditMode && !data.password) {
      showModalError(t('editProfile.errors.passwordRequired'));
      return false;
    }

    if (data.password && data.password.length < 8) {
      showModalError(t('editProfile.errors.passwordTooShort'));
      return false;
    }

    if (data.password && data.password !== confirmPassword.trim()) {
      showModalError(t('editProfile.errors.passwordMismatch', 'Passwords do not match.'));
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
    setModalType('success'); // O un tipo 'info' si tu CustomModal lo soporta
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
    setModalType('success'); // O un tipo 'info' si tu CustomModal lo soporta
    setPrimaryButtonText(t('common.close'));
    setSecondaryButtonText(undefined);
    setShouldNavigateBack(false);
    setModalVisible(true);
  };

  const handleShowBriefBioTooltip = () => {
    setModalTitle(t('editProfile.briefBio'));
    setModalMessage(t('editProfile.tooltips.briefBio'));
    setModalType('success'); // O un tipo 'info' si tu CustomModal lo soporta
    setPrimaryButtonText(t('common.close'));
    setSecondaryButtonText(undefined);
    setShouldNavigateBack(false);
    setModalVisible(true);
  };

  const handleShowPasswordTooltip = () => {
    setModalTitle(t('editProfile.password'));
    setModalMessage(t('editProfile.tooltips.passwordRequirements'));
    setModalType('success'); // O un tipo 'info' si tu CustomModal lo soporta
    setPrimaryButtonText(t('common.close'));
    setSecondaryButtonText(undefined);
    setShouldNavigateBack(false);
    setModalVisible(true);
  };

  const handleSave = () => {
    // Aplicación masiva de trim() a todos los campos de texto
    const formValues = { name, lastName, title, company, bio, email, phoneNumber, phoneRaw, linkedIn, website, password };
    const trimmed = Object.fromEntries(
      Object.entries(formValues).map(([key, value]) => [key, value.trim()])
    ) as typeof formValues;

    if (!validateForm(trimmed)) return;

    const saveLocally = (backendData?: any) => {
      saveProfile({
        ...trimmed,
        profileImageUri:
          backendData?.profileImageUri &&
          typeof backendData.profileImageUri === 'string' &&
          !backendData.profileImageUri.startsWith('http')
            ? `${Config.BASE_URL}${Config.API_PREFIX}/images/${backendData.profileImageUri}`
            : (profileImage as any)?.uri || null,
        id: backendData?.id || (isEditMode ? profile?.id : undefined),
        password: backendData?.password || (trimmed.password || undefined),
        needsSync: !backendData,
      });

      setModalTitle(t('common.success', 'Success!'));
      setModalType('success');

      let message = '';
      if (!backendData) {
        message = t('editProfile.success.localOnlySuccess');
      } else {
        message = isEditMode ? t('editProfile.success.updated') : t('editProfile.success.created');
      }

      setModalMessage(message);
      setPrimaryButtonText(isEditMode ? t('editProfile.viewProfile') : t('editProfile.viewCard'));
      setSecondaryButtonText(undefined);
      setShouldNavigateBack(true);
      setModalVisible(true);
    };

    const handleCloudSave = async () => {
      setLoading(true);
      const isUpdating = isEditMode && profile?.id;
      const url = isUpdating ? `/profiles/${profile.id}` : '/profiles'; // La URL base ya está en el interceptor de Axios
      const method = isUpdating ? 'put' : 'post';

      try {
        const formData = new FormData();
        
        // Añadir campos ya limpios al FormData
        Object.entries(trimmed).forEach(([key, value]) => {
          if (value || key === 'website') { // Mantenemos website aunque sea vacío si así lo requiere el backend
            formData.append(key, value);
          }
        });

        if (profileImage && 'uri' in profileImage && profileImage.uri) {
          const uri = profileImage.uri as string;

          // Only upload if it's a local file (not a remote URL)
          if (!uri.startsWith('http')) {
            const fileName = (profileImage as Asset).fileName || uri.split('/').pop() || 'profile.jpg';
            const fileType = (profileImage as Asset).type || 'image/jpeg';

            console.log('--- DEBUG UPLOAD ---');
            console.log('Preparando archivo para subir:', { uri, fileName, fileType });

            formData.append('image', {
              uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
              name: fileName,
              type: fileType,
            } as any);
          }
        }

        console.log('Enviando FormData al servidor...');
        
        const response = await api({
          method,
          url,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data', // Axios manejará el boundary automáticamente
          },
        });

        console.log('Respuesta del servidor tras guardar:', response.data);

        saveLocally(response.data);
      } catch (error: any) {
        const parsed = parseApiError(error);
        console.error('Cloud save error:', parsed);

        Alert.alert(
          t('editProfile.syncError', 'Sync Error'),
          parsed.isNetworkError 
            ? t('editProfile.errors.networkFallback', 'Could not connect to the server, but it will be saved locally.')
            : t(parsed.message),
          parsed.isNetworkError 
            ? [
                { text: t('common.cancel', 'Cancel'), style: 'cancel' },
                { text: t('common.close', 'Save Locally'), onPress: () => saveLocally() }
              ]
            : [{ text: 'OK' }]
        );
      } finally {
        setLoading(false);
      }
    };

    Alert.alert(
      t('editProfile.saveTitle', 'Save Profile'),
      t('editProfile.saveDescription', 'Do you want to save a copy to the cloud?'),
      [
        {
          text: t('editProfile.localOnly', 'Local Only'),
          onPress: () => saveLocally(),
        },
        {
          text: t('editProfile.localCloud', 'Local + Cloud'),
          onPress: () => handleCloudSave(),
        },
        {
          text: t('common.cancel', 'Cancel'),
          style: 'cancel',
        },
      ]
    );
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

    const deleteLocally = () => {
      clearProfile();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    };

    const deleteCloudAndLocal = async () => {
      if (!profile.id) {
        deleteLocally();
        return;
      }

      setLoading(true);
      try {
        await api.delete(`/profiles/${profile.id}`);

        // Si la respuesta es exitosa (Axios no lanza error para 2xx), procedemos
        if (profile.id) { // Solo si el perfil tenía un ID en la nube
          deleteLocally();
        }

        deleteLocally();
      } catch (error: any) {
        console.error('Cloud delete error:', error);
        Alert.alert(
          t('common.error', 'Error'),
          error.isNetworkError 
            ? t('errors.networkError') 
            : t(error.message || 'editProfile.errors.cloudDeleteFailed')
        );
      } finally {
        setLoading(false);
      }
    };

    Alert.alert(
      t('editProfile.deleteTitle', 'Delete Profile'),
      t('editProfile.deleteDescription', 'Do you want to delete your profile locally or also in the cloud?'),
      [
        {
          text: t('editProfile.localOnly', 'Local Only'),
          onPress: deleteLocally,
          style: 'destructive',
        },
        {
          text: t('editProfile.localCloud', 'Local + Cloud'),
          onPress: deleteCloudAndLocal,
          style: 'destructive',
        },
        {
          text: t('common.cancel', 'Cancel'),
          style: 'cancel',
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
    handleShowPasswordTooltip,
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
      password, setPassword,
      confirmPassword, setConfirmPassword,
    }
  };
};
