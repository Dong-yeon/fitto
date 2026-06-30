import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../constants/theme';

interface Props extends TextInputProps {
  label?: string;
  errorText?: string;
}

export function TextField({ label, errorText, style, onFocus, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textTertiary}
        style={[
          styles.input,
          focused && styles.inputFocused,
          !!errorText && styles.inputError,
          style,
        ]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  label: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
    fontWeight: '700',
  },
  input: {
    height: 54,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.subtitle,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceAlt,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  inputError: { borderColor: colors.danger, backgroundColor: colors.surface },
  error: { color: colors.danger, fontSize: fontSize.caption, marginTop: spacing.xs, marginLeft: spacing.xs },
});
