/** 식단 메인 — 오늘 기록 + 히스토리 + 캘린더/통계 진입. 운동(WorkoutScreen) 미러링 */
import React, { useCallback } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DietStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { MealCard } from '../../components/MealCard';
import { EmptyState } from '../../components/EmptyState';
import { useDietStore } from '../../store/dietStore';
import { getErrorMessage } from '../../utils/error';
import { colors, fontSize, spacing } from '../../constants/theme';
import type { Meal } from '../../types';

type Props = NativeStackScreenProps<DietStackParamList, 'DietMain'>;

export function DietScreen({ navigation }: Props) {
  const { today, history, loading, loadingMore, fetchToday, fetchHistory, loadMoreHistory, remove } =
    useDietStore();

  useFocusEffect(
    useCallback(() => {
      fetchToday();
      fetchHistory();
    }, [fetchToday, fetchHistory]),
  );

  const onLongPress = (m: Meal) => {
    Alert.alert('식단 기록 삭제', `${m.mealTypeLabel} 기록을 삭제할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await remove(m.id);
          } catch (e) {
            Alert.alert('오류', getErrorMessage(e));
          }
        },
      },
    ]);
  };

  const todayCalories = today.reduce((sum, m) => sum + (m.calories ?? 0), 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>식단</Text>
        <View style={styles.headerLinks}>
          <TouchableOpacity onPress={() => navigation.navigate('DietStats')}>
            <Text style={styles.link}>📊 통계</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('DietCalendar')}>
            <Text style={styles.link}>📅 캘린더</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={history}
        keyExtractor={(m) => String(m.id)}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={() => {
          fetchToday();
          fetchHistory();
        }}
        onEndReachedThreshold={0.3}
        onEndReached={loadMoreHistory}
        ListHeaderComponent={
          <View>
            <View style={styles.todayHeader}>
              <Text style={styles.sectionTitle}>오늘</Text>
              {todayCalories > 0 ? (
                <Text style={styles.todayCal}>총 {todayCalories} kcal</Text>
              ) : null}
            </View>
            {today.length > 0 ? (
              today.map((m) => <MealCard key={m.id} meal={m} onLongPress={onLongPress} />)
            ) : (
              <View style={styles.emptyToday}>
                <Text style={styles.emptyText}>오늘 식단 기록이 아직 없어요 🍽️</Text>
              </View>
            )}
            <Text style={[styles.sectionTitle, styles.historyTitle]}>히스토리</Text>
          </View>
        }
        renderItem={({ item }) => <MealCard meal={item} onLongPress={onLongPress} showDate />}
        ListEmptyComponent={
          !loading ? (
            <EmptyState emoji="🍽️" title="아직 식단 기록이 없어요" description="아래 버튼으로 첫 식단을 기록해보세요!" />
          ) : null
        }
        ListFooterComponent={loadingMore ? <Text style={styles.footer}>불러오는 중…</Text> : null}
      />

      <View style={styles.fabWrap}>
        <Button title="＋ 식단 기록하기" onPress={() => navigation.navigate('DietRecord')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  title: { fontSize: fontSize.title, fontWeight: '800', color: colors.textPrimary },
  headerLinks: { flexDirection: 'row', gap: spacing.md },
  link: { fontSize: fontSize.body, color: colors.primary, fontWeight: '600' },
  list: { padding: spacing.lg, paddingBottom: 120 },
  todayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  todayCal: { fontSize: fontSize.body, color: colors.accent, fontWeight: '800' },
  sectionTitle: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.textPrimary },
  historyTitle: { marginTop: spacing.lg, marginBottom: spacing.sm },
  emptyToday: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  emptyText: { color: colors.textSecondary, fontSize: fontSize.body },
  footer: { textAlign: 'center', color: colors.textSecondary, paddingVertical: spacing.md },
  fabWrap: { position: 'absolute', left: spacing.lg, right: spacing.lg, bottom: spacing.lg },
});
