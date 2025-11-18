import { StyleSheet } from 'react-native';
import { colors, spacing } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  content: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    color: colors.white,
  },
  name: {
    marginBottom: spacing.xs,
    color: colors.textPrimary,
  },
  formSectionTitle: {
    marginBottom: spacing.md,
    color: colors.textPrimary,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  button: {
    flex: 1,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

