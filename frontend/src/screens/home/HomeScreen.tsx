/** 홈 — 비트윈 스타일 커플 메인 (배경 · D+ 카운터 · 커플 프로필 · 오늘 운동 상태) */
import React, { useCallback, useEffect, useState } from 'react';
import {
  ImageBackground,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList, MainTabParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Avatar } from '../../components/Avatar';
import { useAuthStore } from '../../store/authStore';
import { useRelationStore } from '../../store/relationStore';
import { workoutApi } from '../../api/workout';
import { streakApi } from '../../api/streak';
import { pickImage, uploadImage } from '../../utils/imageUpload';
import { toast } from '../../store/toastStore';
import { getErrorMessage } from '../../utils/error';
import type { PartnerToday, Streak } from '../../types';
import { colors, fontSize, radius, spacing } from '../../constants/theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeMain'>,
  BottomTabScreenProps<MainTabParamList>
>;

const BG_KEY = 'fitto.coupleBg';
const GRADIENT: [string, string, string] = ['#FF9AAE', '#FF7A93', '#FF6FA0'];

function daysTogether(connectedAt?: string | null): number {
  if (!connectedAt) return 0;
  const diff = Date.now() - new Date(connectedAt).getTime();
  return Math.max(1, Math.floor(diff / 86400000) + 1);
}

export function HomeScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const { couple, loading, fetchAll } = useRelationStore();
  const [partner, setPartner] = useState<PartnerToday | null>(null);
  const [myStreak, setMyStreak] = useState<Streak | null>(null);
  const [coupleStreak, setCoupleStreak] = useState<Streak | null>(null);
  const [myDone, setMyDone] = useState(false);
  const [bgUrl, setBgUrl] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(BG_KEY).then(setBgUrl).catch(() => undefined);
  }, []);

  const refresh = useCallback(() => {
    fetchAll();
    workoutApi.today().then((l) => setMyDone(l.length > 0)).catch(() => setMyDone(false));
    workoutApi.partnerToday().then(setPartner).catch(() => setPartner(null));
    streakApi.me().then(setMyStreak).catch(() => setMyStreak(null));
    streakApi.couple().then(setCoupleStreak).catch(() => setCoupleStreak(null));
  }, [fetchAll]);

  useFocusEffect(useCallback(() => refresh(), [refresh]));

  const onChangeBg = async () => {
    try {
      const uri = await pickImage();
      if (!uri) return;
      const url = await uploadImage(uri);
      await AsyncStorage.setItem(BG_KEY, url);
      setBgUrl(url);
      toast.success('배경을 변경했어요 🖼️');
    } catch (e) {
      toast.error(getErrorMessage(e, '배경 변경에 실패했어요.'));
    }
  };

  const connected = !!couple?.partner;
  const dday = daysTogether(couple?.connectedAt);

  const content = (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.white} />}
      >
        {/* 상단: 배경 변경 */}
        <View style={styles.topBar}>
          <Pressable style={styles.bgBtn} onPress={onChangeBg}>
            <Text style={styles.bgBtnText}>🖼️ 배경</Text>
          </Pressable>
        </View>

        {connected ? (
          <>
            {/* D+ 카운터 */}
            <View style={styles.ddayWrap}>
              <Text style={styles.ddayLabel}>함께한 지</Text>
              <Text style={styles.dday}>D+{dday}</Text>
              <Text style={styles.cheer}>오늘도 함께라서 더 건강해요 💪</Text>
            </View>

            {/* 커플 프로필 두 개 */}
            <View style={styles.coupleRow}>
              <CoupleProfile name={user?.name ?? '나'} imageUrl={user?.profileImageUrl} done={myDone} />
              <Text style={styles.heart}>❤️</Text>
              <CoupleProfile name={partner?.partnerName ?? couple?.partner?.name ?? '상대방'} imageUrl={couple?.partner?.profileImageUrl} done={!!partner?.completed} />
            </View>

            {/* 커플 스트릭 */}
            {coupleStreak && coupleStreak.currentCount > 0 ? (
              <View style={styles.streakChip}>
                <Text style={styles.streakChipText}>🔥 함께 {coupleStreak.currentCount}일째 운동 중!</Text>
              </View>
            ) : (
              <View style={styles.streakChip}>
                <Text style={styles.streakChipText}>오늘 둘 다 운동하면 커플 스트릭 시작 ✨</Text>
              </View>
            )}

            {/* 내 연속 */}
            <Text style={styles.myStreak}>🔥 내 연속 {myStreak?.currentCount ?? 0}일 · 최고 {myStreak?.maxCount ?? 0}일</Text>

            {/* 빠른 기록 */}
            <Button
              title={myDone ? '운동 더 기록하기' : '＋ 오늘 운동 완료!'}
              variant={myDone ? 'soft' : 'secondary'}
              onPress={() => navigation.navigate('Workout', { screen: 'WorkoutRecord' })}
              style={styles.quick}
            />
          </>
        ) : (
          <View style={styles.connectWrap}>
            <Text style={styles.connectEmoji}>💌</Text>
            <Text style={styles.connectTitle}>커플을 연결해보세요</Text>
            <Text style={styles.connectDesc}>초대코드를 만들거나 상대방 코드를 입력해{'\n'}함께 운동을 응원할 수 있어요.</Text>
            <Button title="커플 연결하기" variant="soft" onPress={() => navigation.navigate('CoupleConnect')} style={styles.connectBtn} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );

  if (bgUrl) {
    return (
      <ImageBackground source={{ uri: bgUrl }} style={styles.bg} resizeMode="cover">
        <View style={styles.overlay} />
        {content}
      </ImageBackground>
    );
  }
  return (
    <LinearGradient colors={GRADIENT} style={styles.bg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      {content}
    </LinearGradient>
  );
}

function CoupleProfile({ name, imageUrl, done }: { name: string; imageUrl?: string | null; done: boolean }) {
  return (
    <View style={styles.profile}>
      <View>
        <Avatar name={name} imageUrl={imageUrl} size={88} color={colors.primaryDark} />
        {done ? (
          <View style={styles.doneBadge}>
            <Text style={styles.doneCheck}>✓</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.profileName} numberOfLines={1}>{name}</Text>
      <Text style={[styles.profileStatus, done && styles.profileStatusDone]}>
        {done ? '운동 완료!' : '운동 전'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.28)' },
  safe: { flex: 1 },
  container: { flexGrow: 1, padding: spacing.lg },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end' },
  bgBtn: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  bgBtnText: { color: colors.white, fontSize: fontSize.caption, fontWeight: '700' },

  ddayWrap: { alignItems: 'center', marginTop: spacing.xl },
  ddayLabel: { color: 'rgba(255,255,255,0.9)', fontSize: fontSize.body, fontWeight: '600' },
  dday: { color: colors.white, fontSize: 56, fontWeight: '800', letterSpacing: -1, textShadowColor: 'rgba(0,0,0,0.15)', textShadowRadius: 6, textShadowOffset: { width: 0, height: 2 } },
  cheer: { color: 'rgba(255,255,255,0.95)', fontSize: fontSize.body, marginTop: spacing.xs },

  coupleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.xl, gap: spacing.md },
  heart: { fontSize: 26 },
  profile: { alignItems: 'center', width: 110 },
  profileName: { color: colors.white, fontSize: fontSize.subtitle, fontWeight: '800', marginTop: spacing.sm },
  profileStatus: { color: 'rgba(255,255,255,0.85)', fontSize: fontSize.caption, marginTop: 2, fontWeight: '600' },
  profileStatusDone: { color: '#EAFFF4' },
  doneBadge: { position: 'absolute', right: -2, bottom: -2, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.white },
  doneCheck: { color: colors.white, fontWeight: '800' },

  streakChip: { alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, marginTop: spacing.xl },
  streakChipText: { color: colors.white, fontWeight: '800', fontSize: fontSize.body },
  myStreak: { color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: spacing.md, fontSize: fontSize.caption, fontWeight: '600' },

  quick: { marginTop: 'auto' },

  connectWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: spacing.xxl },
  connectEmoji: { fontSize: 56 },
  connectTitle: { color: colors.white, fontSize: fontSize.title, fontWeight: '800', marginTop: spacing.md },
  connectDesc: { color: 'rgba(255,255,255,0.92)', fontSize: fontSize.body, textAlign: 'center', marginTop: spacing.sm, lineHeight: 21 },
  connectBtn: { marginTop: spacing.lg, alignSelf: 'stretch' },
});
