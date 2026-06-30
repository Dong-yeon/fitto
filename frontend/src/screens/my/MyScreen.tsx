/** MY — 미니멀·발랄. 프로필(이름 편집) + 로그아웃/탈퇴 */
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Avatar } from '../../components/Avatar';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { BadgeCard } from '../../components/BadgeCard';
import { useAuthStore } from '../../store/authStore';
import { streakApi } from '../../api/streak';
import { getErrorMessage } from '../../utils/error';
import { toast } from '../../store/toastStore';
import { haptics } from '../../utils/haptics';
import { pickImage, uploadImage } from '../../utils/imageUpload';
import { colors, fontSize, spacing } from '../../constants/theme';

export function MyScreen() {
  const { user, logout, withdraw, updateProfile } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [maxStreak, setMaxStreak] = useState(0);
  const [photoUploading, setPhotoUploading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      streakApi.me().then((s) => setMaxStreak(s.maxCount)).catch(() => setMaxStreak(0));
    }, []),
  );

  const startEdit = () => {
    setName(user?.name ?? '');
    setEditing(true);
  };

  const onSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await updateProfile({ name: name.trim() });
      haptics.success();
      toast.success('프로필을 수정했어요 ✨');
      setEditing(false);
    } catch (e) {
      Alert.alert('오류', getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const onChangePhoto = async () => {
    try {
      const uri = await pickImage();
      if (!uri) return;
      setPhotoUploading(true);
      const url = await uploadImage(uri);
      await updateProfile({ profileImageUrl: url });
      haptics.success();
      toast.success('프로필 사진을 변경했어요 📸');
    } catch (e) {
      Alert.alert('오류', getErrorMessage(e));
    } finally {
      setPhotoUploading(false);
    }
  };

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
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>MY</Text>

        <Card elevation="md" style={styles.profile}>
          <Pressable onPress={onChangePhoto} disabled={photoUploading} style={styles.avatarWrap}>
            <Avatar name={user?.name} imageUrl={user?.profileImageUrl} size={80} />
            <View style={styles.cameraBadge}>
              {photoUploading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.cameraIcon}>📷</Text>
              )}
            </View>
          </Pressable>

          {editing ? (
            <View style={styles.editBox}>
              <TextField value={name} onChangeText={setName} placeholder="이름" maxLength={50} />
              <View style={styles.editActions}>
                <Button title="취소" variant="ghost" size="md" onPress={() => setEditing(false)} style={styles.flex} />
                <Button title="저장" size="md" onPress={onSave} loading={saving} disabled={!name.trim()} style={styles.flex} />
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.name}>{user?.name ?? '사용자'}</Text>
              <Text style={styles.email}>{user?.email ?? ''}</Text>
              {user?.role === 'TRAINER' ? <Text style={styles.badge}>🏋️ 트레이너</Text> : null}
              <Button title="✏️ 이름 수정" variant="soft" size="md" onPress={startEdit} style={styles.editBtn} />
            </>
          )}
        </Card>

        <View style={styles.badgeWrap}>
          <BadgeCard maxStreak={maxStreak} />
        </View>

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
  avatarWrap: { position: 'relative' },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  cameraIcon: { fontSize: 13 },
  name: { fontSize: fontSize.title, fontWeight: '800', color: colors.textPrimary, marginTop: spacing.md },
  email: { fontSize: fontSize.body, color: colors.textSecondary, marginTop: spacing.xs },
  badge: { marginTop: spacing.sm, color: colors.secondary, fontWeight: '800' },
  editBtn: { marginTop: spacing.md },
  badgeWrap: { marginTop: spacing.lg },
  editBox: { alignSelf: 'stretch', marginTop: spacing.lg },
  editActions: { flexDirection: 'row', gap: spacing.sm },
  flex: { flex: 1 },
  menu: { marginTop: spacing.lg, padding: 0 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  pressed: { backgroundColor: colors.surfaceAlt },
  menuText: { fontSize: fontSize.subtitle, color: colors.textPrimary, fontWeight: '600' },
  danger: { color: colors.danger },
  chevron: { fontSize: 22, color: colors.textTertiary },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.lg },
  footer: { textAlign: 'center', color: colors.textTertiary, fontSize: fontSize.caption, marginTop: 'auto', paddingTop: spacing.xl },
});
