import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { colors, fontSize, radius, shadow, spacing } from '../constants/theme';

interface Props extends PressableProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft';
  size?: 'md' | 'lg';
  style?: ViewStyle;
}

export function Button({
  title,
  loading,
  variant = 'primary',
  size = 'lg',
  style,
  disabled,
  ...rest
}: Props) {
  const isDisabled = disabled || loading;
  const filled = variant === 'primary' || variant === 'secondary';
  return (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        size === 'md' ? styles.md : styles.lg,
        styles[variant],
        filled && shadow.sm,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={filled ? colors.white : colors.primary} />
      ) : (
        <Text style={[styles.text, textStyle(variant)]}>{title}</Text>
      )}
    </Pressable>
  );
}

const textStyle = (variant: Props['variant']) => {
  switch (variant) {
    case 'primary':
    case 'secondary':
      return { color: colors.white };
    case 'soft':
      return { color: colors.primaryDark };
    default:
      return { color: colors.primary };
  }
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  md: { height: 44 },
  lg: { height: 54 },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.secondary },
  soft: { backgroundColor: colors.primarySoft },
  ghost: { backgroundColor: 'transparent' },
  pressed: { transform: [{ scale: 0.97 }], opacity: 0.92 },
  disabled: { opacity: 0.45 },
  text: { fontSize: fontSize.subtitle, fontWeight: '800', letterSpacing: 0.2 },
});
