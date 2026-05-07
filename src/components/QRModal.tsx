import React from 'react';
import { Modal, View, Text, TouchableOpacity, ImageSourcePropType } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTranslation } from 'react-i18next';

import { styles } from './QRModalStyles';

interface QRModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  value: string;
  logo?: ImageSourcePropType;
}

const QRModal = ({ visible, onClose, title, value, logo }: QRModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        onPress={onClose} 
        activeOpacity={1}
      >
        <View style={styles.qrModalContainer} onStartShouldSetResponder={() => true}>
          <Text style={styles.qrModalTitle}>{title}</Text>
          
          {value ? (
            <QRCode
              value={value}
              size={200}
              logo={logo}
              logoSize={40}
              ecl="H"
              logoBackgroundColor="white"
              logoBorderRadius={10}
            />
          ) : null}
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>{t('common.close')}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default QRModal;
