import { Tabs, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    Cakecafe: require('../../assets/fonts/Cakecafe.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: colors.darkPrimary,
          height: 50,
        },
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === 'index') iconName = 'home';
          // else if (route.name === 'explore') iconName = 'search';
          else if (route.name === 'post') iconName = 'add-circle';
          else if (route.name === 'saved') iconName = 'heart';
          else if (route.name === 'profile') iconName = 'person';
          else if (route.name === 'recipe') iconName = 'book';

          return <Ionicons name={iconName} size={size} color={color} />;
        },

        tabBarActiveTintColor: colors.lightSecondary,
        tabBarInactiveTintColor: colors.lightPrimary,
        headerShown: false,
      })}
    />
  );
}
