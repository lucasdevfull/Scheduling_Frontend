import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dcefe0',
    padding: 24,
    justifyContent: 'center',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e1e1e',
    marginBottom: 30,
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#c3d6c8',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },

  inputFocused: {
    borderColor: '#22c55e',
    shadowColor: '#22c55e',
    shadowOpacity: 0.15,
  },

  errorText: {
    color: '#ef4444',
    fontSize: 13,
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3b82f6',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
    letterSpacing: 0.3,
  },

  link: {
    color: '#2563eb',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 15,
    fontWeight: '500',
  },

  secondaryText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 8,
  },
})
