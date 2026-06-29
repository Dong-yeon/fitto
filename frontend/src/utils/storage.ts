/**
 * 토큰 저장소 — 플랫폼별 분기.
 * 네이티브(iOS/Android): expo-secure-store(보안 저장).
 * 웹: AsyncStorage(localStorage) — SecureStore 는 웹 미지원.
 */
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const isWeb = Platform.OS === 'web';

export const storage = {
  getItem: (key: string): Promise<string | null> =>
    isWeb ? AsyncStorage.getItem(key) : SecureStore.getItemAsync(key),

  setItem: (key: string, value: string): Promise<void> =>
    isWeb ? AsyncStorage.setItem(key, value) : SecureStore.setItemAsync(key, value),

  removeItem: (key: string): Promise<void> =>
    isWeb ? AsyncStorage.removeItem(key) : SecureStore.deleteItemAsync(key),
};
