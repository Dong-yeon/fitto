/** 홈 — 미니멀·발랄. 설계서 2.3 (오늘의 한마디 · 스트릭 · 커플 카드 · 빠른 기록) */
import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList, MainTabParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Avatar } from '../../components/Avatar';
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
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
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
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />}
      >
        {/* 인사 + 오늘의 한마디 */}
        <Text style={styles.greeting}>안녕하세요{user?.name ? `, ${user.name}님` : ''} 👋</Text>
        <Text style={styles.cheer}>{cheerOfTheDay()}</Text>

        {/* 개인 스트릭 */}
        <Card tint="yellow" elevation="sm" style={styles.streakCard}>
          <Text style={styles.streakFire}>🔥</Text>
          <View style={styles.flex}>
            <Text style={styles.streakCount}>{myStreak?.currentCount ?? 0}일째</Text>
            <Text style={styles.streakLabel}>연속 운동 중 · 최고 {myStreak?.maxCount ?? 0}일</Text>
          </View>
          {myCompletedToday ? <Text style={styles.todayBadge}>오늘 완료 ✓</Text> : null}
        </Card>

        {/* 커플 카드 */}
        {couple?.partner ? (
          <Card elevation="md" style={styles.coupleCard}>
            <View style={styles.coupleHeader}>
              <Avatar name={couple.partner.name} imageUrl={couple.partner.profileImageUrl} size={44} />
              <View style={styles.flex}>
                <Text style={styles.coupleName}>{couple.partner.name} 님과 함께 💞</Text>
                {coupleStreak && coupleStreak.currentCount > 0 ? (
                  <Text style={styles.coupleStreak}>🔥 함께 {coupleStreak.currentCount}일째!</Text>
                ) : (
                  <Text style={styles.coupleSub}>오늘 둘 다 운동하면 커플 스트릭 시작!</Text>
                )}
              </View>
            </View>

            <View style={styles.statusRow}>
              <StatusPill label="나" done={myCompletedToday} />
              <StatusPill label={partner?.partnerName ?? '상대방'} done={!!partner?.completed} />
            </View>
          </Card>
        ) : (
          <Card tint="pink" elevation="sm" style={styles.connectCard}>
            <Text style={styles.connectEmoji}>💌</Text>
            <Text style={styles.connectTitle}>커플을 연결해보세요</Text>
            <Text style={styles.connectDesc}>초대코드를 만들거나 상대방 코드를 입력해 연결하면{'\n'}함께 운동을 응원할 수 있어요.</Text>
            <Button title="커플 연결하기" onPress={() => navigation.navigate('CoupleConnect')} style={styles.connectBtn} />
          </Card>
        )}

        {/* 빠른 기록 */}
        <Button
          title={myCompletedToday ? '운동 더 기록하기' : '＋ 오늘 운동 완료!'}
          variant={myCompletedToday ? 'soft' : 'primary'}
          onPress={() => navigation.navigate('Workout', { screen: 'WorkoutRecord' })}
          style={styles.quick}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusPill({ label, done }: { label: string; done: boolean }) {
  return (
    <View style={[styles.pill, done && styles.pillDone]}>
      <Text style={styles.pillLabel}>{label}</Text>
      <Text style={[styles.pillValue, done && styles.pillValueDone]}>
        {done ? '✅ 운동 완료!' : '아직 운동 전'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  container: { padding: spacing.lg, paddingBottom: spacing.xl },
  greeting: { fontSize: fontSize.heading, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  cheer: { fontSize: fontSize.body, color: colors.textSecondary, marginTop: spacing.xs },

  streakCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.lg },
  streakFire: { fontSize: 40 },
  streakCount: { fontSize: fontSize.title, fontWeight: '800', color: '#E89A1C' },
  streakLabel: { fontSize: fontSize.caption, color: '#B58A3E', marginTop: 2 },
  todayBadge: { fontSize: fontSize.caption, fontWeight: '800', color: colors.success },

  coupleCard: { marginTop: spacing.md, gap: spacing.md },
  coupleHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  coupleName: { fontSize: fontSize.subtitle, fontWeight: '800', color: colors.textPrimary },
  coupleStreak: { fontSize: fontSize.body, color: colors.accent, fontWeight: '800', marginTop: 2 },
  coupleSub: { fontSize: fontSize.caption, color: colors.textSecondary, marginTop: 2 },
  statusRow: { flexDirection: 'row', gap: spacing.sm },
  pill: { flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: spacing.md },
  pillDone: { backgroundColor: colors.secondarySoft },
  pillLabel: { fontSize: fontSize.caption, color: colors.textSecondary, fontWeight: '700' },
  pillValue: { fontSize: fontSize.body, color: colors.textPrimary, marginTop: 2, fontWeight: '600' },
  pillValueDone: { color: colors.success, fontWeight: '800' },

  connectCard: { marginTop: spacing.md, alignItems: 'center' },
  connectEmoji: { fontSize: 40 },
  connectTitle: { fontSize: fontSize.subtitle, fontWeight: '800', color: colors.textPrimary, marginTop: spacing.sm },
  connectDesc: { fontSize: fontSize.caption, color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center', lineHeight: 19 },
  connectBtn: { marginTop: spacing.md, alignSelf: 'stretch' },

  quick: { marginTop: spacing.lg },
});
