/** 식단 캘린더 — 월별 기록 캘린더. 운동(WorkoutCalendarScreen) 미러링 */
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dietApi } from '../../api/diet';
import { colors, fontSize, radius, spacing } from '../../constants/theme';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function DietCalendarScreen() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());

  useEffect(() => {
    let active = true;
    dietApi
      .calendar(year, month)
      .then((days) => {
        if (!active) return;
        const set = new Set(days.filter((d) => d.completed).map((d) => Number(d.date.slice(8, 10))));
        setCompletedDays(set);
      })
      .catch(() => active && setCompletedDays(new Set()));
    return () => {
      active = false;
    };
  }, [year, month]);

  const cells = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const arr: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [year, month]);

  const changeMonth = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    setMonth(m);
    setYear(y);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth(-1)} hitSlop={12}>
          <Text style={styles.nav}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {year}년 {month}월
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)} hitSlop={12}>
          <Text style={styles.nav}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((w) => (
          <Text key={w} style={styles.weekday}>
            {w}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((day, i) => (
          <View key={i} style={styles.cell}>
            {day ? (
              <View style={[styles.dayCircle, completedDays.has(day) && styles.dayDone]}>
                <Text style={[styles.dayText, completedDays.has(day) && styles.dayTextDone]}>
                  {day}
                </Text>
              </View>
            ) : null}
          </View>
        ))}
      </View>

      <View style={styles.legend}>
        <View style={[styles.dayCircle, styles.dayDone, styles.legendDot]} />
        <Text style={styles.legendText}>식단 기록한 날</Text>
      </View>
    </SafeAreaView>
  );
}

const CELL = `${100 / 7}%`;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  nav: { fontSize: 28, color: colors.primary, paddingHorizontal: spacing.md },
  title: { fontSize: fontSize.subtitle, fontWeight: '800', color: colors.textPrimary },
  weekRow: { flexDirection: 'row' },
  weekday: { width: CELL, textAlign: 'center', color: colors.textSecondary, fontSize: fontSize.caption },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
  cell: { width: CELL, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  dayCircle: { width: 36, height: 36, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  dayDone: { backgroundColor: colors.accent },
  dayText: { fontSize: fontSize.body, color: colors.textPrimary },
  dayTextDone: { color: colors.white, fontWeight: '700' },
  legend: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xl, gap: spacing.sm },
  legendDot: { width: 20, height: 20 },
  legendText: { color: colors.textSecondary, fontSize: fontSize.caption },
});
