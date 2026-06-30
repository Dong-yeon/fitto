/** 클립보드 복사 / 공유 — 플랫폼별 처리 */
import { Platform, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';

export async function copyText(text: string): Promise<void> {
  await Clipboard.setStringAsync(text);
}

/** OS 공유 시트. 웹은 navigator.share, 없으면 클립보드 복사로 폴백. */
export async function shareText(message: string): Promise<'shared' | 'copied'> {
  if (Platform.OS === 'web') {
    const nav = typeof navigator !== 'undefined' ? (navigator as Navigator & { share?: (d: { text: string }) => Promise<void> }) : undefined;
    if (nav?.share) {
      try {
        await nav.share({ text: message });
        return 'shared';
      } catch {
        // 사용자가 취소했거나 미지원 → 복사 폴백
      }
    }
    await copyText(message);
    return 'copied';
  }
  await Share.share({ message });
  return 'shared';
}
