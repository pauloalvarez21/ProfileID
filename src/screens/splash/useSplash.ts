import { useEffect } from 'react';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useProfileStore } from '../../store/useProfileStore';

export const useSplash = (replace: (screen: keyof RootStackParamList) => void) => {
  const { profile } = useProfileStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (profile && profile.name) {
        // Si hay perfil con nombre, ir directo al perfil
        replace('ProfileDetail');
      } else if (profile) {
        // Si hay perfil pero sin nombre (incompleto), ir a editar
        replace('EditProfile', { isEdit: true });
      } else {
        // Sin perfil, ir a Login para crear uno nuevo
        replace('Login');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [replace, profile]);
};
