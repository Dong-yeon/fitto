/** MY — 미니멀·발랄. 설계서 2.2 (프로필 + 로그아웃/탈퇴) */
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '../../components/Avatar';
import { Card } from '../../components/Card';
import { useAuthStore } from '../../store/authStore';
import { getErrorMessage } from '../../utils/error';
import { colors, fontSize, spacing } from '../../constants/theme';

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
        <Text style={styles.title}>MY</Text>

        <Card elevation="md" style={styles.profile}>
          <Avatar name={user?.name} imageUrl={user?.profileImageUrl} size={80} />
          <Text style={styles.name}>{user?.name ?? '사용자'}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>
          {user?.role === 'TRAINER' ? <Text style={styles.badge}>🏋️ 트레이너</Text> : null}
        </Card>

        <Card elevation="sm" style={styles.menu}>
          <Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]} onPress={onLogout}>
            <Text style={styles.menuText}>로그아웃</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]} onPress={onWithdraw}>
            <Text style={[styles.menuText, styles.danger]}>회원 탈퇴</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </Card>

        <Text style={styles.footer}>Fitto · 함께라서 더 건강해 💖</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, flexGrow: 1 },
  title: { fontSize: fontSize.heading, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5, marginBottom: spacing.lg },
  profile: { alignItems: 'center', paddingVertical: spacing.xl },
  name: { fontSize: fontSize.title, fontWeight: '800', color: colors.textPrimary, marginTop: spacing.md },
  email: { fontSize: fontSize.body, color: colors.textSecondary, marginTop: spacing.xs },
  badge: { marginTop: spacing.sm, color: colors.secondary, fontWeight: '800' },
  menu: { marginTop: spacing.lg, padding: 0 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  pressed: { backgroundColor: colors.surfaceAlt },
  menuText: { fontSize: fontSize.subtitle, color: colors.textPrimary, fontWeight: '600' },
  danger: { color: colors.danger },
  chevron: { fontSize: 22, color: colors.textTertiary },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.lg },
  footer: { textAlign: 'center', color: colors.textTertiary, fontSize: fontSize.caption, marginTop: 'auto', paddingTop: spacing.xl },
});
