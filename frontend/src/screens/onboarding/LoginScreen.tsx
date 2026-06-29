/** 로그인 — 설계서 2.1 / 3.1 (이메일 로그인. 소셜 로그인은 추후) */
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { useAuthStore } from '../../store/authStore';
import { getErrorMessage } from '../../utils/error';
import { colors, fontSize, spacing } from '../../constants/theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      // 성공 시 RootNavigator 가 자동으로 메인으로 전환
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = email.length > 0 && password.length > 0 && !loading;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.logo}>💑 Fitto</Text>
          <Text style={styles.subtitle}>함께라서 더 건강해</Text>

          <View style={styles.form}>
            <TextField
              label="이메일"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <TextField
              label="비밀번호"
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호"
              secureTextEntry
              errorText={error ?? undefined}
            />
            <Button title="로그인" onPress={onSubmit} loading={loading} disabled={!canSubmit} />
            <Button
              title="이메일로 회원가입"
              variant="ghost"
              onPress={() => navigation.navigate('Register')}
              style={styles.gap}
            />
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
  logo: { fontSize: fontSize.heading, fontWeight: '800', color: colors.primary, textAlign: 'center' },
  subtitle: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  form: { marginTop: spacing.lg },
  gap: { marginTop: spacing.sm },
});
