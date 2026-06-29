/** 홈 — 설계서 2.3 (오늘의 한마디 · 커플 카드 · 스트릭 · 빠른 기록). phase 5 완성 */
import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList, MainTabParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/authStore';
import { useRelationStore } from '../../store/relationStore';
import { workoutApi } from '../../api/workout';
import { streakApi } from '../../api/streak';
import type { PartnerToday, Streak } from '../../types';
import { colors, fontSize, radius, spacing } from '../../constants/theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeMain'>,
  BottomTabScreenProps<MainTabParamList>
>;

const CHEERS = [
  '오늘도 함께라서 더 건강해요 💪',
  '작은 운동 하나가 큰 변화를 만들어요 ✨',
  '꾸준함이 최고의 재능이에요 🔥',
  '오늘의 땀은 내일의 자신감 💖',
  '함께 달리면 더 멀리 갈 수 있어요 🏃',
];

function cheerOfTheDay(): string {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return CHEERS[dayOfYear % CHEERS.length];
}

export function HomeScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const { couple, loading, fetchAll } = useRelationStore();
  const [partner, setPartner] = useState<PartnerToday | null>(null);
  const [myStreak, setMyStreak] = useState<Streak | null>(null);
  const [coupleStreak, setCoupleStreak] = useState<Streak | null>(null);
  const [myCompletedToday, setMyCompletedToday] = useState(false);

  const refresh = useCallback(() => {
    fetchAll();
    workoutApi.today().then((list) => setMyCompletedToday(list.length > 0)).catch(() => setMyCompletedToday(false));
    workoutApi.partnerToday().then(setPartner).catch(() => setPartner(null));
    streakApi.me().then(setMyStreak).catch(() => setMyStreak(null));
    streakApi.couple().then(setCoupleStreak).catch(() => setCoupleStreak(null));
  }, [fetchAll]);

  useFocusEffect(useCallback(() => refresh(), [refresh]));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      >
        <Text style={styles.greeting}>안녕하세요{user?.name ? `, ${user.name}님` : ''} 👋</Text>
        <Text style={styles.cheer}>{cheerOfTheDay()}</Text>

        {/* 개인 스트릭 */}
        <View style={styles.streakCard}>
          <Text style={styles.streakFire}>🔥</Text>
          <View style={styles.flex}>
            <Text style={styles.streakCount}>{myStreak?.currentCount ?? 0}일째</Text>
            <Text style={styles.streakLabel}>
              연속 운동 중 · 최고 {myStreak?.maxCount ?? 0}일
            </Text>
          </View>
        </View>

        {/* 커플 카드 */}
        <View style={styles.card}>
          {couple?.partner ? (
            <>
              <Text style={styles.cardTitle}>💞 {couple.partner.name} 님과 함께하는 중</Text>
              {coupleStreak && coupleStreak.currentCount > 0 ? (
                <Text style={styles.coupleStreak}>
                  🔥 함께 {coupleStreak.currentCount}일째 운동 중!
                </Text>
              ) : null}
              <View style={styles.statusRow}>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>나</Text>
                  <Text style={[styles.statusValue, myCompletedToday && styles.statusDone]}>
                    {myCompletedToday ? '✅ 오늘 운동 완료!' : '아직 운동 전'}
                  </Text>
                </View>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>{partner?.partnerName ?? '상대방'}</Text>
                  <Text style={[styles.statusValue, partner?.completed && styles.statusDone]}>
                    {partner?.completed ? '✅ 오늘 운동 완료!' : '아직 운동 전'}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.cardTitle}>아직 커플이 연결되지 않았어요</Text>
              <Text style={styles.hint}>초대코드를 만들거나 상대방 코드를 입력해 연결해보세요.</Text>
              <Button
                title="커플 연결하기"
                onPress={() => navigation.navigate('CoupleConnect')}
                style={styles.connectBtn}
              />
            </>
          )}
        </View>

        {/* 빠른 기록 (설계서 2.3 빠른 기록) */}
        <Button
          title="＋ 오늘 운동 완료!"
          onPress={() => navigation.navigate('Workout', { screen: 'WorkoutRecord' })}
          style={styles.quick}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  container: { padding: spacing.lg },
  greeting: { fontSize: fontSize.title, fontWeight: '800', color: colors.textPrimary },
  cheer: { fontSize: fontSize.body, color: colors.textSecondary, marginTop: spacing.xs },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E8',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  streakFire: { fontSize: 36 },
  streakCount: { fontSize: fontSize.title, fontWeight: '800', color: colors.accent },
  streakLabel: { fontSize: fontSize.caption, color: colors.textSecondary, marginTop: 2 },
  card: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.textPrimary },
  coupleStreak: { fontSize: fontSize.body, color: colors.accent, fontWeight: '700', marginTop: spacing.sm },
  statusRow: { flexDirection: 'row', marginTop: spacing.md, gap: spacing.md },
  statusItem: { flex: 1, backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.md },
  statusLabel: { fontSize: fontSize.caption, color: colors.textSecondary, fontWeight: '600' },
  statusValue: { fontSize: fontSize.body, color: colors.textPrimary, marginTop: spacing.xs },
  statusDone: { color: colors.success, fontWeight: '700' },
  hint: { fontSize: fontSize.caption, color: colors.textSecondary, marginTop: spacing.sm },
  connectBtn: { marginTop: spacing.md },
  quick: { marginTop: spacing.lg },
});
