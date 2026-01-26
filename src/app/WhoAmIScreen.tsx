import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { presentPaywall } from '../services/paywall';

type WhoAmIScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'WhoAmI'>;
};

export default function WhoAmIScreen({ navigation }: WhoAmIScreenProps) {
  const [name, setName] = useState('');
  const { t } = useTranslation();

  const handleNext = async () => {
    if (name.trim() === '') {
      Alert.alert(t('whoami.errorEmpty'), t('whoami.errorEmpty'));
      return;
    }

    try {
      await AsyncStorage.setItem('userName', name);
      const subscribed = await presentPaywall();
      if (subscribed) {
        navigation.navigate('Ready');
      }
    } catch (error) {
      Alert.alert(t('whoami.errorSave'), t('whoami.errorSave'));
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 items-center justify-center px-5">
        <Text className="text-black text-3xl font-bold mb-5">
          {t('whoami.title')}
        </Text>
        <Text className="text-black text-lg mb-5">
          {t('whoami.question')}
        </Text>
        
        <TextInput
          className="w-full bg-[#6a5f53] text-white text-lg p-4 rounded-xl mb-8 border-2 border-[#6a5f53]"
          placeholder={t('whoami.placeholder')}
          placeholderTextColor="#FFF"
          value={name}
          onChangeText={setName}
          autoFocus
        />

        <TouchableOpacity 
          className={`px-10 py-4 rounded-3xl ${name.trim() === '' ? 'bg-[#6a5f53]' : 'bg-[#6a5f53]'}`}
          onPress={handleNext}
        >
          <Text className="text-white text-lg font-bold">{t('whoami.nextButton')}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
