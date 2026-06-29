/** 온보딩 스택 — 설계서 v2.0 2.1 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from './types';
import { SplashScreen } from '../screens/onboarding/SplashScreen';
import { LoginScreen } from '../screens/onboarding/LoginScreen';
import { RegisterScreen } from '../screens/onboarding/RegisterScreen';
import { RelationSelectScreen } from '../screens/onboarding/RelationSelectScreen';
import { CoupleConnectScreen } from '../screens/onboarding/CoupleConnectScreen';
import { TrainerRegisterScreen } from '../screens/onboarding/TrainerRegisterScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="RelationSelect" component={RelationSelectScreen} />
      <Stack.Screen name="CoupleConnect" component={CoupleConnectScreen} />
      <Stack.Screen name="TrainerRegister" component={TrainerRegisterScreen} />
    </Stack.Navigator>
  );
}
