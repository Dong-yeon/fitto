/** 홈 — 설계서 v2.0 2.2~2.3. phase 2: 커플 연결 상태 + 진입. (스트릭/운동현황은 phase 5) */
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
import type { PartnerToday } from '../../types';
import { colors, fontSize, radius, spacing } from '../../constants/theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeMain'>,
  BottomTabScreenProps<MainTabParamList>
>;

export function HomeScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const { couple, loading, fetchAll } = useRelationStore();
  const [partner, setPartner] = useState<PartnerToday | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchAll();
      workoutApi
        .partnerToday()
        .then(setPartner)
        .catch(() => setPartner(null));
    }, [fetchAll]),
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchAll} />}
      >
        <Text style={styles.greeting}>안녕하세요{user?.name ? `, ${user.name}님` : ''} 👋</Text>
        <Text style={styles.subGreeting}>오늘도 함께 건강해져요</Text>

        <View style={styles.card}>
          {couple?.partner ? (
            <>
              <Text style={styles.cardTitle}>💞 {couple.partner.name} 님과 함께하는 중</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>나</Text>
                  <Text style={styles.statusValue}>오늘 운동을 기록해보세요</Text>
                </View>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>{partner?.partnerName ?? '상대방'}</Text>
                  <Text style={[styles.statusValue, partner?.completed && styles.statusDone]}>
                    {partner?.completed ? '✅ 오늘 운동 완료!' : '아직 운동 전'}
                  </Text>
                </View>
              </View>
              <Text style={styles.hint}>커플 스트릭은 다음 단계에서 추가됩니다.</Text>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg },
  greeting: { fontSize: fontSize.title, fontWeight: '800', color: colors.textPrimary },
  subGreeting: { fontSize: fontSize.body, color: colors.textSecondary, marginTop: spacing.xs },
  card: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.textPrimary },
  statusRow: { flexDirection: 'row', marginTop: spacing.md, gap: spacing.md },
  statusItem: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  statusLabel: { fontSize: fontSize.caption, color: colors.textSecondary, fontWeight: '600' },
  statusValue: { fontSize: fontSize.body, color: colors.textPrimary, marginTop: spacing.xs },
  statusDone: { color: colors.success, fontWeight: '700' },
  hint: { fontSize: fontSize.caption, color: colors.textSecondary, marginTop: spacing.md },
  connectBtn: { marginTop: spacing.md },
});
