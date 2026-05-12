import { useProfileStore } from '../../store/useProfileStore';
import { Config } from '../../config';
import api from '../../services/api';
import { Platform } from 'react-native';
import { parseApiError } from '../../services/errorService';

export const useSyncManager = () => {
  const { profile, saveProfile } = useProfileStore();

  const handleBackgroundSync = async () => {
    if (!profile) return;

    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('lastName', profile.lastName || '');
      formData.append('title', profile.title);
      formData.append('email', profile.email);
      formData.append('phoneNumber', profile.phoneNumber);
      formData.append('company', profile.company || '');
      formData.append('bio', profile.bio || '');
      formData.append('linkedIn', profile.linkedIn || '');
      formData.append('website', profile.website || '');

      if (profile.password) {
        formData.append('password', profile.password);
      }

      if (profile.profileImageUri && !profile.profileImageUri.startsWith('http')) {
        const uri = profile.profileImageUri;
        formData.append('image', {
          uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
          name: 'profile.jpg',
          type: 'image/jpeg',
        } as any);
      }

      const isUpdating = !!profile.id;
      const url = isUpdating ? `/profiles/${profile.id}` : '/profiles';
      const method = isUpdating ? 'put' : 'post';

      const response = await api({
        method,
        url,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Actualizar localmente para limpiar la bandera needsSync
      saveProfile({
        ...profile,
        id: response.data.id,
        needsSync: false,
        profileImageUri: response.data.profileImageUri 
          ? `${Config.BASE_URL}${Config.API_PREFIX}/images/${response.data.profileImageUri}`
          : profile.profileImageUri
      });
      
      console.log('[SyncManager] Sincronización exitosa');
    } catch (error: any) {
      const customError = parseApiError(error);
      console.error('[SyncManager] Error:', customError.message);
      throw customError; // Relanzamos el error aumentado
    }
  };

  return { handleBackgroundSync };
};