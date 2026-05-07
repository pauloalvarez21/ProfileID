import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FB',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
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
  content: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A202C',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#718096',
    lineHeight: 22,
    marginBottom: 4,
  },
  emailText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
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
  submitButton: {
    marginTop: 24,
    backgroundColor: '#4E576B', // Forzamos el negro total aquí si el componente lo permite
  },
});