/** 스플래시 — 설계서 2.1 (로고 + 슬로건 '함께라서 더 건강해') */
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/types';
import { colors, fontSize } from '../../constants/theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Login'), 1500);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>💑 Fitto</Text>
      <Text style={styles.slogan}>함께라서 더 건강해</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  logo: { fontSize: fontSize.heading, fontWeight: '800', color: colors.white },
  slogan: { fontSize: fontSize.subtitle, color: colors.white, marginTop: 8, opacity: 0.9 },
});
