/** 메인 하단 탭 — 설계서 2.2 (홈 🏠 / 운동 💪 / 채팅 💬 / MY 👤) */
import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from './types';
import { colors } from '../constants/theme';
import { HomeStackNavigator } from './HomeStackNavigator';
import { WorkoutStackNavigator } from './WorkoutStackNavigator';
import { ChatScreen } from '../screens/chat/ChatScreen';
import { MyScreen } from '../screens/my/MyScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const icon =
  (emoji: string) =>
  ({ focused }: { focused: boolean }) => (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.4 }}>{emoji}</Text>
  );

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ title: '홈', tabBarIcon: icon('🏠') }}
      />
      <Tab.Screen
        name="Workout"
        component={WorkoutStackNavigator}
        options={{ title: '운동', tabBarIcon: icon('💪') }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: '채팅', tabBarIcon: icon('💬') }}
      />
      <Tab.Screen
        name="My"
        component={MyScreen}
        options={{ title: 'MY', tabBarIcon: icon('👤') }}
      />
    </Tab.Navigator>
  );
}
