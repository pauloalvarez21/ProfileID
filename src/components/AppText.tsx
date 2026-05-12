import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { Typography } from '../../ios/ProfileID/typography';

interface AppTextProps extends TextProps {
  variant?: keyof typeof Typography;
}

/**
 * Componente de texto global para ProfileID.
 * Aplica la fuente Inter y el peso seleccionado por defecto.
 */
const AppText: React.FC<AppTextProps> = ({ 
  variant = 'regular', 
  style, 
  ...props 
}) => {
  return (
    <RNText 
      style={[Typography[variant], style]} 
      {...props} 
    />
  );
};

export default AppText;