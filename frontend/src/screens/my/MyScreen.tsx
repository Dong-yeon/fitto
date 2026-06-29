/** MY — 설계서 v2.0 2.2. phase 2: 프로필 표시 + 로그아웃/탈퇴. (통계·설정은 추후) */
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/authStore';
import { getErrorMessage } from '../../utils/error';
import { colors, fontSize, radius, spacing } from '../../constants/theme';

export function MyScreen() {
  const { user, logout, withdraw } = useAuthStore();

  const onLogout = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠어요?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const onWithdraw = () => {
    Alert.alert('회원 탈퇴', '탈퇴하면 연결된 관계도 해제됩니다. 계속할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '탈퇴',
        style: 'destructive',
        onPress: async () => {
          try {
            await withdraw();
          } catch (e) {
            Alert.alert('오류', getErrorMessage(e));
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) ?? '👤'}</Text>
          </View>
          <Text style={styles.name}>{user?.name ?? '사용자'}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>
          {user?.role === 'TRAINER' ? <Text style={styles.badge}>🏋️ 트레이너</Text> : null}
        </View>

        <View style={styles.actions}>
          <Button title="로그아웃" variant="ghost" onPress={onLogout} />
          <Text style={styles.withdraw} onPress={onWithdraw}>
            회원 탈퇴
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, flexGrow: 1 },
  profile: { alignItems: 'center', marginTop: spacing.xl },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: fontSize.heading, color: colors.white, fontWeight: '800' },
  name: { fontSize: fontSize.title, fontWeight: '800', color: colors.textPrimary, marginTop: spacing.md },
  email: { fontSize: fontSize.body, color: colors.textSecondary, marginTop: spacing.xs },
  badge: { marginTop: spacing.sm, color: colors.secondary, fontWeight: '700' },
  actions: { marginTop: 'auto', alignItems: 'center', gap: spacing.md },
  withdraw: { color: colors.textSecondary, fontSize: fontSize.caption, padding: spacing.sm },
});
