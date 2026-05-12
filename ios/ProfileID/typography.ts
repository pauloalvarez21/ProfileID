import { Platform } from 'react-native';

export const Typography = {
  thin: {
    fontFamily: 'Inter-Thin',
    fontWeight: '100' as const,
  },
  extraLight: {
    fontFamily: 'Inter-ExtraLight',
    fontWeight: '200' as const,
  },
  light: {
    fontFamily: 'Inter-Light',
    fontWeight: '300' as const,
  },
  regular: {
    fontFamily: 'Inter-Regular',
    fontWeight: '400' as const,
  },
  medium: {
    fontFamily: 'Inter-Medium',
    fontWeight: '500' as const,
  },
  semiBold: {
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600' as const,
  },
  bold: {
    fontFamily: 'Inter-Bold',
    fontWeight: '700' as const,
  },
  extraBold: {
    fontFamily: 'Inter-ExtraBold',
    fontWeight: '800' as const,
  },
  black: {
    fontFamily: 'Inter-Black',
    fontWeight: '900' as const,
  },
};

// Nota: En Android, el fontFamily debe coincidir exactamente con el nombre del archivo.