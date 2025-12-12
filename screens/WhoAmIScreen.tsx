import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WhoAmIScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'WhoAmI'>;
};

export default function WhoAmIScreen({ navigation }: WhoAmIScreenProps) {
  const [name, setName] = useState('');

  const handleNext = async () => {
    if (name.trim() === '') {
      Alert.alert('Erreur', 'Veuillez entrer votre nom');
      return;
    }

    try {
      await AsyncStorage.setItem('userName', name);
      navigation.navigate('Ready');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder votre nom');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 items-center justify-center px-5">
        <Text className="text-black text-3xl font-bold mb-5">
          Who am I?
        </Text>
        <Text className="text-black text-lg mb-5">
          What is your name?
        </Text>
        
        <TextInput
          className="w-full bg-[#6a5f53] text-white text-lg p-4 rounded-xl mb-8 border-2 border-[#6a5f53]"
          placeholder="Enter your name"
          placeholderTextColor="#FFF"
          value={name}
          onChangeText={setName}
          autoFocus
        />

        <TouchableOpacity 
          className={`px-10 py-4 rounded-3xl ${name.trim() === '' ? 'bg-[#6a5f53]' : 'bg-[#6a5f53]'}`}
          onPress={handleNext}
        >
          <Text className="text-white text-lg font-bold">next</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
