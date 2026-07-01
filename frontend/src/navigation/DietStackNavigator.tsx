/** 식단 탭 내부 스택 — 메인 / 기록 입력 / 캘린더 / 통계 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { DietStackParamList } from './types';
import { DietScreen } from '../screens/diet/DietScreen';
import { DietRecordScreen } from '../screens/diet/DietRecordScreen';
import { DietCalendarScreen } from '../screens/diet/DietCalendarScreen';
import { DietStatsScreen } from '../screens/diet/DietStatsScreen';
import { colors } from '../constants/theme';

const Stack = createNativeStackNavigator<DietStackParamList>();

export function DietStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="DietMain" component={DietScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="DietRecord"
        component={DietRecordScreen}
        options={{ title: '식단 기록', presentation: 'modal' }}
      />
      <Stack.Screen name="DietCalendar" component={DietCalendarScreen} options={{ title: '식단 캘린더' }} />
      <Stack.Screen name="DietStats" component={DietStatsScreen} options={{ title: '식단 통계' }} />
    </Stack.Navigator>
  );
}
