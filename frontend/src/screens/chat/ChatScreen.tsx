/** 채팅방 목록 — 설계서 2.5 / 4.5 CHAT-01 (관계별 채팅방) */
import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ChatStackParamList } from '../../navigation/types';
import { useChatStore } from '../../store/chatStore';
import { colors, fontSize, radius, spacing } from '../../constants/theme';
import type { ChatRoom, MessageType } from '../../types';

type Props = NativeStackScreenProps<ChatStackParamList, 'ChatRooms'>;

const preview = (type: MessageType, content?: string | null): string => {
  switch (type) {
    case 'IMAGE':
      return '[이미지]';
    case 'WORKOUT_CARD':
      return '[운동 기록]';
    case 'ROUTINE_CARD':
      return '[루틴]';
    default:
      return content ?? '';
  }
};

export function ChatScreen({ navigation }: Props) {
  const { rooms, loadingRooms, loadRooms } = useChatStore();

  useFocusEffect(
    useCallback(() => {
      loadRooms();
    }, [loadRooms]),
  );

  const renderRoom = ({ item }: { item: ChatRoom }) => (
    <TouchableOpacity
      style={styles.room}
      onPress={() =>
        navigation.navigate('ChatRoom', {
          relationId: item.relationId,
          title: item.partner?.name ?? '채팅',
        })
      }
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.partner?.name?.charAt(0) ?? '💬'}</Text>
      </View>
      <View style={styles.roomBody}>
        <Text style={styles.partnerName}>{item.partner?.name ?? '채팅방'}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage
            ? preview(item.lastMessage.messageType, item.lastMessage.content)
            : '대화를 시작해보세요'}
        </Text>
      </View>
      {item.unreadCount > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.unreadCount}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>채팅</Text>
      <FlatList
        data={rooms}
        keyExtractor={(r) => String(r.relationId)}
        renderItem={renderRoom}
        contentContainerStyle={styles.list}
        refreshing={loadingRooms}
        onRefresh={loadRooms}
        ListEmptyComponent={
          !loadingRooms ? (
            <Text style={styles.empty}>아직 채팅방이 없어요.{'\n'}커플을 연결하면 채팅을 시작할 수 있어요 💞</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  title: {
    fontSize: fontSize.title,
    fontWeight: '800',
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  list: { padding: spacing.lg, flexGrow: 1 },
  room: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.white, fontSize: fontSize.subtitle, fontWeight: '800' },
  roomBody: { flex: 1, marginLeft: spacing.md },
  partnerName: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.textPrimary },
  lastMessage: { fontSize: fontSize.body, color: colors.textSecondary, marginTop: 2 },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { color: colors.white, fontSize: fontSize.caption, fontWeight: '700' },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: spacing.xl, lineHeight: 22 },
});
