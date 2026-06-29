/** 회원가입 — 설계서 2.1 / 3.1 AUTH-03 (이메일·비밀번호·이름·성별) */
import React, { useState } from 'react';
import {
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
import type { OnboardingStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { useAuthStore } from '../../store/authStore';
import { getErrorMessage } from '../../utils/error';
import { colors, fontSize, radius, spacing } from '../../constants/theme';
import type { Gender } from '../../types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const register = useAuthStore((s) => s.register);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    setLoading(true);
    try {
      await register({ email: email.trim(), password, name: name.trim(), gender });
      // 성공 시 RootNavigator 가 메인으로 전환 (커플 연결은 홈에서 진행)
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = !!email && !!password && !!name && !loading;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>회원가입</Text>
          <Text style={styles.subtitle}>함께 운동할 준비를 시작해요</Text>

          <View style={styles.form}>
            <TextField
              label="이메일"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextField
              label="비밀번호 (8자 이상)"
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호"
              secureTextEntry
            />
            <TextField label="이름" value={name} onChangeText={setName} placeholder="이름/닉네임" />

            <Text style={styles.fieldLabel}>성별 (선택)</Text>
            <View style={styles.genderRow}>
              {(['MALE', 'FEMALE'] as const).map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderChip, gender === g && styles.genderChipActive]}
                  onPress={() => setGender(gender === g ? undefined : g)}
                >
                  <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                    {g === 'MALE' ? '남성' : '여성'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
              title="가입하고 시작하기"
              onPress={onSubmit}
              loading={loading}
              disabled={!canSubmit}
              style={styles.submit}
            />
            <Button title="이미 계정이 있어요" variant="ghost" onPress={() => navigation.goBack()} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl },
  title: { fontSize: fontSize.heading, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: fontSize.body, color: colors.textSecondary, marginTop: spacing.xs },
  form: { marginTop: spacing.lg },
  fieldLabel: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  genderRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  genderChip: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  genderChipActive: { borderColor: colors.primary, backgroundColor: '#FFEEF1' },
  genderText: { color: colors.textSecondary, fontWeight: '600' },
  genderTextActive: { color: colors.primary },
  error: { color: colors.danger, fontSize: fontSize.caption, marginBottom: spacing.sm },
  submit: { marginTop: spacing.sm },
});
