/** 홈 — 설계서 v2.0 2.2~2.3. phase 2: 커플 연결 상태 + 진입. (스트릭/운동현황은 phase 5) */
import React, { useCallback } from 'react';
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
import { colors, fontSize, radius, spacing } from '../../constants/theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeMain'>,
  BottomTabScreenProps<MainTabParamList>
>;

export function HomeScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const { couple, loading, fetchAll } = useRelationStore();

  useFocusEffect(
    useCallback(() => {
      fetchAll();
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
              <Text style={styles.cardTitle}>💞 커플 연결됨</Text>
              <Text style={styles.partnerName}>{couple.partner.name} 님과 함께하는 중</Text>
              <Text style={styles.hint}>운동 현황과 스트릭은 다음 단계에서 추가됩니다.</Text>
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
  partnerName: {
    fontSize: fontSize.body,
    color: colors.primary,
    marginTop: spacing.sm,
    fontWeight: '600',
  },
  hint: { fontSize: fontSize.caption, color: colors.textSecondary, marginTop: spacing.sm },
  connectBtn: { marginTop: spacing.md },
});
