/** 채팅방 목록 — 미니멀·발랄. 설계서 2.5 / 4.5 CHAT-01 */
import React, { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ChatStackParamList } from '../../navigation/types';
import { Avatar } from '../../components/Avatar';
import { EmptyState } from '../../components/EmptyState';
import { useChatStore } from '../../store/chatStore';
import { colors, fontSize, radius, spacing } from '../../constants/theme';
import type { ChatRoom, MessageType } from '../../types';

type Props = NativeStackScreenProps<ChatStackParamList, 'ChatRooms'>;

const preview = (type: MessageType, content?: string | null): string => {
  switch (type) {
    case 'IMAGE':
      return '📷 사진';
    case 'WORKOUT_CARD':
      return '💪 운동 기록';
    case 'ROUTINE_CARD':
      return '📋 루틴';
    default:
      return content ?? '';
  }
};

export function ChatScreen({ navigation }: Props) {
  const { rooms, loadingRooms, loadRooms } = useChatStore();

  useFocusEffect(useCallback(() => { loadRooms(); }, [loadRooms]));

  const renderRoom = ({ item }: { item: ChatRoom }) => (
    <Pressable
      style={({ pressed }) => [styles.room, pressed && styles.pressed]}
      onPress={() => navigation.navigate('ChatRoom', { relationId: item.relationId, title: item.partner?.name ?? '채팅' })}
    >
      <Avatar name={item.partner?.name} imageUrl={item.partner?.profileImageUrl} size={52} />
      <View style={styles.roomBody}>
        <Text style={styles.partnerName}>{item.partner?.name ?? '채팅방'}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage ? preview(item.lastMessage.messageType, item.lastMessage.content) : '대화를 시작해보세요 ✨'}
        </Text>
      </View>
      {item.unreadCount > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.unreadCount > 99 ? '99+' : item.unreadCount}</Text>
        </View>
      ) : null}
    </Pressable>
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
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={
          !loadingRooms ? (
            <EmptyState emoji="💬" title="아직 채팅방이 없어요" description="커플을 연결하면 채팅을 시작할 수 있어요 💞" />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: fontSize.heading, fontWeight: '800', color: colors.textPrimary, paddingHorizontal: spacing.lg, paddingTop: spacing.sm, letterSpacing: -0.5 },
  list: { padding: spacing.md, flexGrow: 1 },
  room: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: radius.lg },
  pressed: { backgroundColor: colors.surfaceAlt, transform: [{ scale: 0.99 }] },
  roomBody: { flex: 1, marginLeft: spacing.md },
  partnerName: { fontSize: fontSize.subtitle, fontWeight: '800', color: colors.textPrimary },
  lastMessage: { fontSize: fontSize.body, color: colors.textSecondary, marginTop: 3 },
  badge: { minWidth: 24, height: 24, borderRadius: radius.pill, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 7 },
  badgeText: { color: colors.white, fontSize: fontSize.caption, fontWeight: '800' },
  sep: { height: spacing.xs },
});
