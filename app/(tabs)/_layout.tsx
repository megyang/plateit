import { Tabs, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

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
          backgroundColor: '#6AA84F',
          height: 50,
        },
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === 'index') iconName = 'home';
          else if (route.name === 'explore') iconName = 'search';
          else if (route.name === 'post') iconName = 'add-circle';
          else if (route.name === 'saved') iconName = 'folder';
          else if (route.name === 'profile') iconName = 'person';
          else if (route.name === 'recipe') iconName = 'book';

          return <Ionicons name={iconName} size={size} color={color} />;
        },

        tabBarActiveTintColor: '#9F5549',
        tabBarInactiveTintColor: '#FEFADF',
        headerShown: false,
      })}
    />
  );
}
