import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ReadyScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Ready'>;
};

export default function ReadyScreen({ navigation }: ReadyScreenProps) {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      if (name) {
        setUserName(name);
      }
    } catch (error) {
      console.log('Error loading name:', error);
    }
  };

  const handleStart = async () => {
    try {
      await AsyncStorage.setItem('onboardingComplete', 'true');
      navigation.replace('Home');
    } catch (error) {
      console.log('Error saving onboarding status:', error);
    }
  }; 

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 items-center justify-center px-5">
        <Text className="text-[#91908b] text-3xl font-bold mb-5 text-center">
          Are you ready to do this with me?
        </Text>
        {userName && (
          <Text className="text-[#6a5f53] text-xl mb-12">
            hello {userName}! 👋
          </Text>
        )}
        
        <TouchableOpacity 
          className="bg-[#6a5f53] px-10 py-4 rounded-3xl flex-row items-center gap-3"
          onPress={handleStart}
        >
          <Image 
            source={require('../assets/icon.png')} 
            className="w-8 h-8"
          />
          <Text className="text-white text-lg font-bold">Let's Focus!</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
