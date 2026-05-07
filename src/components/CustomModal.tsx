import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { styles } from './CustomModalStyles';

interface CustomModalProps {
  visible: boolean;
  title: string;
  message: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

const CustomModal = ({
  visible,
  title,
  message,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryPress,
  onSecondaryPress,
  type = 'success',
  onClose,
}: CustomModalProps) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconPlaceholder}>
              {type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ️'}
            </Text>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            {primaryButtonText && (
              <TouchableOpacity style={styles.primaryButton} onPress={onPrimaryPress}>
                <Text style={styles.primaryButtonText}>{primaryButtonText}</Text>
              </TouchableOpacity>
            )}

            {secondaryButtonText && (
              <TouchableOpacity style={styles.secondaryButton} onPress={onSecondaryPress}>
                <Text style={styles.secondaryButtonText}>{secondaryButtonText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default CustomModal;
