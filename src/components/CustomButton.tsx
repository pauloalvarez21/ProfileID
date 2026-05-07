import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
}

const CustomButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  style, 
  textStyle,
  icon,
  loading = false,
  disabled = false
}: CustomButtonProps) => {
  const isPrimary = variant === 'primary';
  
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        isPrimary ? styles.primaryButton : styles.secondaryButton, 
        style,
        (loading || disabled) && styles.disabledButton
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#4E576B'} />
      ) : (
        <Text style={[
          styles.text, 
          isPrimary ? styles.primaryText : styles.secondaryText, 
          textStyle
        ]}>
          <Text>{title}</Text>
          {icon ? <Text style={styles.icon}>{`  ${icon}`}</Text> : null}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  disabledButton: {
    opacity: 0.7,
  },
  primaryButton: {
    backgroundColor: '#4E576B',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#2D3748',
  },
  icon: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default CustomButton;
