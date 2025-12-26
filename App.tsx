import './global.css';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import './src/services/i18n';

import WelcomeScreen from './src/app/screens/WelcomeScreen';
import WhoAmIScreen from './src/app/screens/WhoAmIScreen';
import PaywallScreen from './src/app/screens/PaywallScreen';
import ReadyScreen from './src/app/screens/ReadyScreen';
import HomeScreen from './src/app/screens/HomeScreen';
import FocusScreen from './src/app/screens/FocusScreen';
import AnalyticsScreen from './src/app/screens/AnalyticsScreen';
import ProfileScreen from './src/app/screens/ProfileScreen';
import { RootStackParamList } from './src/types/types';
import { configureRevenueCat } from './src/services/revenueCat';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    configureRevenueCat();
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
      setIsOnboardingComplete(onboardingComplete === 'true');
    } catch (error) {
      console.log('Error checking onboarding status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName={isOnboardingComplete ? 'Home' : 'Welcome'}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="WhoAmI" component={WhoAmIScreen} />
          <Stack.Screen name="Paywall" component={PaywallScreen} />
          <Stack.Screen name="Ready" component={ReadyScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Focus" component={FocusScreen} />
          <Stack.Screen name="Analytics" component={AnalyticsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
