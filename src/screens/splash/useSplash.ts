import { useEffect } from 'react';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useProfileStore } from '../../store/useProfileStore';

export const useSplash = (replace: (screen: keyof RootStackParamList) => void) => {
  const { profile } = useProfileStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (profile) {
        replace('ProfileDetail');
      } else {
        replace('Login');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [replace, profile]);
};
