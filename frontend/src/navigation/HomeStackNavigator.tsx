/** 홈 탭 내부 스택 — 홈 메인 + 커플 연결 (REL-01/02) */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HomeStackParamList } from './types';
import { HomeScreen } from '../screens/home/HomeScreen';
import { CoupleConnectScreen } from '../screens/home/CoupleConnectScreen';
import { colors } from '../constants/theme';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="CoupleConnect"
        component={CoupleConnectScreen}
        options={{ title: '커플 연결' }}
      />
    </Stack.Navigator>
  );
}
