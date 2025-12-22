import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  return (
    <ImageBackground
      source={require('../assets/background.png')}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 items-center justify-center px-5">
        <Text className="text-black text-4xl font-bold mb-3 text-center">
          Welcome to Focus App
        </Text>
        <Text className="text-black text-lg mb-12 text-center">
          Your companion to stay focused
        </Text>
        
        <TouchableOpacity 
          className="bg-[#6a5f53] px-10 py-4 rounded-3xl"
          onPress={() => navigation.navigate('WhoAmI')}
        >
          <Text className="text-white text-lg font-bold">Start</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}