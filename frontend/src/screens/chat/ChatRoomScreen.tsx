/** 채팅 대화 — 설계서 2.5 / 4.5 CHAT-02 (실시간 메시지) */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ChatStackParamList } from '../../navigation/types';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { colors, fontSize, radius, spacing } from '../../constants/theme';
import type { ChatMessage } from '../../types';

type Props = NativeStackScreenProps<ChatStackParamList, 'ChatRoom'>;

const timeOf = (iso: string): string => {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

export function ChatRoomScreen({ navigation, route }: Props) {
  const { relationId, title } = route.params;
  const myId = useAuthStore((s) => s.user?.id);
  const messages = useChatStore((s) => s.messages[relationId] ?? []);
  const { openRoom, closeRoom, send, markRead } = useChatStore();
  const [text, setText] = useState('');
  // 이미 읽음 처리한 최대 메시지 id — 중복 PUT 방지
  const markedUpToRef = useRef(0);

  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  useEffect(() => {
    openRoom(relationId);
    return () => closeRoom(relationId);
  }, [relationId, openRoom, closeRoom]);

  // 새 메시지 도착 시 상대방 최신 메시지까지 읽음 처리 (id 게이트로 중복 호출 방지)
  useEffect(() => {
    const latestIncoming = messages.find((m) => m.senderId !== myId); // 최신순이라 첫 항목
    if (latestIncoming && latestIncoming.id > markedUpToRef.current) {
      markedUpToRef.current = latestIncoming.id;
      markRead(latestIncoming.id).catch(() => {
        markedUpToRef.current = 0; // 실패 시 다음 변경에서 재시도
      });
    }
  }, [messages, myId, markRead]);

  const onSend = () => {
    const content = text.trim();
    if (!content) return;
    const ok = send(relationId, { messageType: 'TEXT', content });
    if (ok) {
      setText('');
    } else {
      Alert.alert('전송 실패', '연결이 끊겼어요. 잠시 후 다시 시도해주세요.');
    }
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const mine = item.senderId === myId;
    return (
      <View style={[styles.row, mine ? styles.rowMine : styles.rowTheirs]}>
        <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={[styles.msgText, mine && styles.msgTextMine]}>{item.content}</Text>
        </View>
        <Text style={styles.time}>{timeOf(item.createdAt)}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          style={styles.flex}
          data={messages}
          inverted
          keyExtractor={(m) => String(m.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="메시지를 입력하세요"
            placeholderTextColor={colors.textSecondary}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !text.trim() && styles.sendDisabled]}
            onPress={onSend}
            disabled={!text.trim()}
          >
            <Text style={styles.sendText}>전송</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  list: { padding: spacing.md },
  row: { marginVertical: spacing.xs, maxWidth: '80%', flexDirection: 'row', alignItems: 'flex-end' },
  rowMine: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  rowTheirs: { alignSelf: 'flex-start' },
  bubble: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.lg },
  bubbleMine: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 4 },
  msgText: { fontSize: fontSize.body, color: colors.textPrimary },
  msgTextMine: { color: colors.white },
  time: { fontSize: 10, color: colors.textSecondary, marginHorizontal: spacing.xs },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    minHeight: 40,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    fontSize: fontSize.body,
    color: colors.textPrimary,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: { opacity: 0.4 },
  sendText: { color: colors.white, fontWeight: '700' },
});
