/**
 * Expo 푸시 등록 — 설계서 CHAT-06.
 * NOTE: 웹은 미지원, Expo Go(SDK 53+)는 원격 푸시 미지원 →
 * 실제 발송은 EAS 네이티브 빌드 + projectId 가 있을 때 동작한다.
 * 어떤 경우에도 앱을 크래시시키지 않도록 조용히 실패한다.
 */
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { notificationApi } from '../api/notification';

// 포그라운드에서도 알림 배너 표시 (네이티브)
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function registerForPush(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const current = await Notifications.getPermissionsAsync();
    let granted = current.granted;
    if (!granted) {
      granted = (await Notifications.requestPermissionsAsync()).granted;
    }
    if (!granted) return;

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    const { data: token } = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    await notificationApi.registerToken(token, Platform.OS);
  } catch {
    // Expo Go / projectId 없음 / 권한 거부 등 → 무시
  }
}
