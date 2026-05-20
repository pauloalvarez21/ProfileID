import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 24,
    color: '#2D3748',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  scrollContent: {
    paddingBottom: 50,
  },
  imageSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  miniLogo: {
    width: 44,
    height: 44,
    backgroundColor: '#000',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  photoContainer: {
    width: 140,
    height: 140,
    position: 'relative',
    marginBottom: 16,
  },
  dashedBorder: {
    width: 140,
    height: 140,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#CBD5E0',
    borderStyle: 'dashed',
    backgroundColor: '#EDF2F7',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  selectedImage: {
    width: 140,
    height: 140,
    borderRadius: 16,
  },
  cameraIconContainer: {
    alignItems: 'center',
  },
  cameraEmoji: {
    fontSize: 32,
    color: '#718096',
  },
  plusSign: {
    fontSize: 14,
    fontWeight: '800',
    color: '#718096',
    marginTop: -8,
  },
  editIconBadge: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#4E576B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  pencilEmoji: {
    color: '#FFF',
    fontSize: 16,
  },
  uploadText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#718096',
    letterSpacing: 1,
    marginTop: 8,
  },
  form: {
    paddingHorizontal: 24,
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F1F4F8',
    height: 52,
    borderRadius: 4,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#2D3748',
  },
  bioInput: {
    height: 120,
    paddingTop: 16,
  },
});
