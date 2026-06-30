/** 운동 기록 입력 — 설계서 2.4 / WORKOUT-01 (운동 선택·세트·시간) */
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { WorkoutStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { useWorkoutStore } from '../../store/workoutStore';
import { getErrorMessage } from '../../utils/error';
import { toast } from '../../store/toastStore';
import { toDateString } from '../../utils/date';
import { colors, fontSize, radius, spacing } from '../../constants/theme';

type Props = NativeStackScreenProps<WorkoutStackParamList, 'WorkoutRecord'>;

const CATEGORIES = ['근력', '유산소', '유연성'];

interface SetForm {
  exerciseName: string;
  category?: string;
  sets: string;
  reps: string;
  weightKg: string;
}

const emptySet = (): SetForm => ({ exerciseName: '', sets: '', reps: '', weightKg: '' });

export function WorkoutRecordScreen({ navigation }: Props) {
  const save = useWorkoutStore((s) => s.save);
  const [sets, setSets] = useState<SetForm[]>([emptySet()]);
  const [duration, setDuration] = useState('');
  const [memo, setMemo] = useState('');
  const [saving, setSaving] = useState(false);

  const updateSet = (idx: number, patch: Partial<SetForm>) => {
    setSets((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };
  const addSet = () => setSets((prev) => [...prev, emptySet()]);
  const removeSet = (idx: number) => setSets((prev) => prev.filter((_, i) => i !== idx));

  const onSave = async () => {
    const filled = sets.filter((s) => s.exerciseName.trim().length > 0);
    if (filled.length === 0) {
      Alert.alert('알림', '운동명을 최소 1개 입력해주세요.');
      return;
    }
    setSaving(true);
    try {
      await save({
        workoutDate: toDateString(),
        totalDurationMin: duration ? Number(duration) : undefined,
        memo: memo.trim() || undefined,
        sets: filled.map((s, i) => ({
          exerciseName: s.exerciseName.trim(),
          category: s.category ?? null,
          sets: s.sets ? Number(s.sets) : null,
          reps: s.reps ? Number(s.reps) : null,
          weightKg: s.weightKg ? Number(s.weightKg) : null,
          orderNo: i + 1,
        })),
      });
      toast.success('운동 기록 완료! 🔥');
      navigation.goBack();
    } catch (e) {
      Alert.alert('오류', getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.date}>📅 {toDateString()}</Text>

          {sets.map((s, idx) => (
            <View key={idx} style={styles.setCard}>
              <View style={styles.setHeader}>
                <Text style={styles.setNo}>운동 {idx + 1}</Text>
                {sets.length > 1 ? (
                  <TouchableOpacity onPress={() => removeSet(idx)}>
                    <Text style={styles.remove}>삭제</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              <TextField
                placeholder="운동명 (예: 벤치프레스)"
                value={s.exerciseName}
                onChangeText={(t) => updateSet(idx, { exerciseName: t })}
              />

              <View style={styles.catRow}>
                {CATEGORIES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.catChip, s.category === c && styles.catChipActive]}
                    onPress={() => updateSet(idx, { category: s.category === c ? undefined : c })}
                  >
                    <Text style={[styles.catText, s.category === c && styles.catTextActive]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.row}>
                <View style={styles.flex1}>
                  <TextField
                    label="세트"
                    placeholder="3"
                    keyboardType="number-pad"
                    value={s.sets}
                    onChangeText={(t) => updateSet(idx, { sets: t.replace(/[^0-9]/g, '') })}
                  />
                </View>
                <View style={styles.flex1}>
                  <TextField
                    label="횟수"
                    placeholder="10"
                    keyboardType="number-pad"
                    value={s.reps}
                    onChangeText={(t) => updateSet(idx, { reps: t.replace(/[^0-9]/g, '') })}
                  />
                </View>
                <View style={styles.flex1}>
                  <TextField
                    label="무게(kg)"
                    placeholder="40"
                    keyboardType="decimal-pad"
                    value={s.weightKg}
                    onChangeText={(t) => updateSet(idx, { weightKg: t.replace(/[^0-9.]/g, '') })}
                  />
                </View>
              </View>
            </View>
          ))}

          <Button title="＋ 운동 추가" variant="ghost" onPress={addSet} />

          <View style={styles.meta}>
            <TextField
              label="총 운동 시간 (분)"
              placeholder="40"
              keyboardType="number-pad"
              value={duration}
              onChangeText={(t) => setDuration(t.replace(/[^0-9]/g, ''))}
            />
            <TextField
              label="메모"
              placeholder="오늘의 한마디"
              value={memo}
              onChangeText={setMemo}
              multiline
            />
          </View>

          <Button title="완료!" onPress={onSave} loading={saving} style={styles.save} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  container: { padding: spacing.lg, paddingBottom: spacing.xl },
  date: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  setCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  setHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  setNo: { fontSize: fontSize.body, fontWeight: '700', color: colors.primary },
  remove: { color: colors.danger, fontSize: fontSize.caption },
  catRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  catChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catChipActive: { borderColor: colors.secondary, backgroundColor: '#E6F7F2' },
  catText: { color: colors.textSecondary, fontSize: fontSize.caption },
  catTextActive: { color: colors.secondary, fontWeight: '700' },
  row: { flexDirection: 'row', gap: spacing.sm },
  flex1: { flex: 1 },
  meta: { marginTop: spacing.sm },
  save: { marginTop: spacing.md },
});
