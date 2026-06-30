/** 뱃지 — 설계서 GAME-04 (7/30/100일 달성). 최고 연속 일수(maxStreak) 기준 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from './Card';
import { colors, fontSize, radius, spacing } from '../constants/theme';

const BADGES = [
  { days: 7, emoji: '🔥', label: '7일' },
  { days: 30, emoji: '⭐', label: '30일' },
  { days: 100, emoji: '👑', label: '100일' },
];

export function BadgeCard({ maxStreak }: { maxStreak: number }) {
  const earned = BADGES.filter((b) => maxStreak >= b.days).length;
  const next = BADGES.find((b) => maxStreak < b.days);

  return (
    <Card elevation="sm" style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>🏅 뱃지</Text>
        <Text style={styles.count}>{earned}/{BADGES.length}</Text>
      </View>

      <View style={styles.row}>
        {BADGES.map((b) => {
          const unlocked = maxStreak >= b.days;
          return (
            <View key={b.days} style={styles.badge}>
              <View style={[styles.circle, unlocked ? styles.circleOn : styles.circleOff]}>
                <Text style={[styles.emoji, !unlocked && styles.emojiOff]}>
                  {unlocked ? b.emoji : '🔒'}
                </Text>
              </View>
              <Text style={[styles.label, unlocked && styles.labelOn]}>{b.label}</Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.progress}>
        {next
          ? `최고 연속 ${maxStreak}일 · ${next.label} 뱃지까지 ${next.days - maxStreak}일!`
          : '모든 뱃지를 달성했어요! 🎉'}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: fontSize.subtitle, fontWeight: '800', color: colors.textPrimary },
  count: { fontSize: fontSize.body, fontWeight: '800', color: colors.primary },
  row: { flexDirection: 'row', justifyContent: 'space-around' },
  badge: { alignItems: 'center', gap: spacing.xs },
  circle: { width: 60, height: 60, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  circleOn: { backgroundColor: colors.accentSoft, borderWidth: 2, borderColor: colors.accent },
  circleOff: { backgroundColor: colors.surfaceAlt },
  emoji: { fontSize: 28 },
  emojiOff: { fontSize: 22, opacity: 0.5 },
  label: { fontSize: fontSize.caption, color: colors.textSecondary, fontWeight: '700' },
  labelOn: { color: colors.textPrimary },
  progress: { fontSize: fontSize.caption, color: colors.textSecondary, textAlign: 'center' },
});
