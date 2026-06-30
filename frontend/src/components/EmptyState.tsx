import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '../constants/theme';

interface Props {
  emoji: string;
  title: string;
  description?: string;
}

/** 빈 상태 안내 (리스트가 비었을 때) */
export function EmptyState({ emoji, title, description }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.desc}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emoji: { fontSize: 44, marginBottom: spacing.sm },
  title: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.textPrimary },
  desc: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
    lineHeight: 20,
  },
});
