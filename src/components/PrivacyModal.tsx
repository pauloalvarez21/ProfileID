import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface PrivacyModalProps {
  visible: boolean;
  onClose: () => void;
  content: string;
  loading: boolean;
  title: string;
  closeText: string;
}

const { height } = Dimensions.get('window');

const PrivacyModal = ({
  visible,
  onClose,
  content,
  loading,
  title,
  closeText,
}: PrivacyModalProps) => {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <Text style={styles.iconText}>🔒</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
          </View>

          {/* Content */}
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#4A5568" />
            </View>
          ) : (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.bodyText}>{content}</Text>
            </ScrollView>
          )}

          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.closeButtonText}>{closeText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 32, 44, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: height * 0.85,
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 12,
    elevation: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
  },
  handleBar: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E0',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D3E4FF',
  },
  iconText: {
    fontSize: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Outfit-Bold',
    fontWeight: '800',
    color: '#1A202C',
    flex: 1,
  },
  loaderContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    maxHeight: height * 0.55,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  bodyText: {
    fontSize: 15,
    fontFamily: 'Outfit-Regular',
    color: '#4A5568',
    lineHeight: 26,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2D3748',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default PrivacyModal;
