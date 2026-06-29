/** 커플 연결 — 설계서 3.2 REL-01/REL-02 (초대코드 생성 / 코드 입력 연결) */
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { useRelationStore } from '../../store/relationStore';
import { getErrorMessage } from '../../utils/error';
import { colors, fontSize, radius, spacing } from '../../constants/theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'CoupleConnect'>;

export function CoupleConnectScreen({ navigation }: Props) {
  const { createInvite, connectCouple } = useRelationStore();
  const [code, setCode] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const onGenerate = async () => {
    setGenerating(true);
    try {
      const invite = await createInvite();
      setCode(invite.code);
    } catch (e) {
      Alert.alert('오류', getErrorMessage(e));
    } finally {
      setGenerating(false);
    }
  };

  const onConnect = async () => {
    setError(null);
    setConnecting(true);
    try {
      await connectCouple(input.trim().toUpperCase());
      Alert.alert('연결 완료', '커플로 연결되었어요! 💞', [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setConnecting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* 초대코드 생성 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>내 초대코드 만들기</Text>
          <Text style={styles.desc}>코드를 상대방에게 공유하세요. (24시간 동안 유효)</Text>
          {code ? (
            <View style={styles.codeBox}>
              <Text style={styles.code}>{code}</Text>
            </View>
          ) : null}
          <Button
            title={code ? '새 코드 생성' : '초대코드 생성'}
            variant="secondary"
            onPress={onGenerate}
            loading={generating}
            style={styles.gap}
          />
        </View>

        <View style={styles.divider} />

        {/* 코드 입력 연결 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>상대방 코드 입력</Text>
          <Text style={styles.desc}>받은 6자리 코드를 입력해 연결하세요.</Text>
          <TextField
            value={input}
            onChangeText={(t) => setInput(t.toUpperCase())}
            placeholder="예: ABC123"
            autoCapitalize="characters"
            maxLength={6}
            errorText={error ?? undefined}
            style={styles.codeInput}
          />
          <Button
            title="연결하기"
            onPress={onConnect}
            loading={connecting}
            disabled={input.trim().length < 6}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionTitle: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.textPrimary },
  desc: { fontSize: fontSize.caption, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.md },
  codeBox: {
    backgroundColor: '#FFEEF1',
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  code: { fontSize: 36, fontWeight: '800', color: colors.primary, letterSpacing: 6 },
  gap: { marginTop: spacing.sm },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  codeInput: { letterSpacing: 4, fontWeight: '700' },
});
