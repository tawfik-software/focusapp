import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, FocusSession } from '../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import LanguageSelector from '../components/LanguageSelector';

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const [userName, setUserName] = useState('User');
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Load user name
      const name = await AsyncStorage.getItem('userName');
      if (name) setUserName(name);

      // Load focus sessions
      const sessionsData = await AsyncStorage.getItem('@focus_sessions');
      if (sessionsData) {
        const parsedSessions: FocusSession[] = JSON.parse(sessionsData);
        setSessions(parsedSessions);

        // Calculate total focus time
        const total = parsedSessions.reduce((acc, session) => acc + session.duration, 0);
        setTotalFocusTime(total);
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      className="flex-1"
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center px-5 pt-4 mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="left-circle" size={30} color="#6a5f53" />
          </TouchableOpacity>
          <Text className="text-[#6a5f53] text-2xl font-bold">{t('profile.title')}</Text>
          <View style={{ width: 30 }} />
        </View>

        <ScrollView className="flex-1 px-6">
          {/* User Info Card */}
          <View className="bg-white/90 rounded-2xl p-6 mb-6 items-center">
            <View className="bg-[#91908b] rounded-full w-20 h-20 items-center justify-center mb-4">
              <Ionicons name="person" size={40} color="white" />
            </View>
            <Text className="text-[#6a5f53] text-3xl font-bold mb-2">{userName}</Text>
            <View className="flex-row items-center bg-[#e8ddd0] px-4 py-2 rounded-full">
              <Ionicons
                name="star"
                size={18}
                color="#91908b"
              />
              <Text className="text-[#6a5f53] ml-2 font-semibold">
                {t('profile.freeAccount')}
              </Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View className="bg-white/90 rounded-2xl p-6 mb-6">
            <Text className="text-[#6a5f53] text-xl font-bold mb-4">📊 {t('profile.statistics')}</Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-[#91908b] text-3xl font-bold">{sessions.length}</Text>
                <Text className="text-[#b5a99a] text-sm mt-1">{t('profile.totalSessions')}</Text>
              </View>
              <View className="items-center">
                <Text className="text-[#91908b] text-3xl font-bold">{formatTime(totalFocusTime)}</Text>
                <Text className="text-[#b5a99a] text-sm mt-1">{t('profile.totalFocusTime')}</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="bg-white/90 rounded-2xl p-4 mb-6">
            <Text className="text-[#6a5f53] text-xl font-bold mb-4 px-2">⚡ Quick Actions</Text>
            
            <TouchableOpacity
              onPress={() => navigation.navigate('Analytics')}
              className="flex-row items-center justify-between py-4 px-2 border-b border-[#e8ddd0]"
            >
              <View className="flex-row items-center">
                <AntDesign name="bar-chart" size={24} color="#91908b" />
                <Text className="text-[#6a5f53] text-base ml-4">View Analytics</Text>
              </View>
              <AntDesign name="right" size={20} color="#b5a99a" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setLanguageModalVisible(true)}
              className="flex-row items-center justify-between py-4 px-2"
            >
              <View className="flex-row items-center">
                <Ionicons name="language" size={24} color="#91908b" />
                <Text className="text-[#6a5f53] text-base ml-4">{t('profile.changeLanguage')}</Text>
              </View>
              <AntDesign name="right" size={20} color="#b5a99a" />
            </TouchableOpacity>
          </View>

          {/* Recent Sessions */}
          <View className="bg-white/90 rounded-2xl p-4 mb-6">
            <Text className="text-[#6a5f53] text-xl font-bold mb-4 px-2">🕐 {t('profile.history')}</Text>
            {sessions.length === 0 ? (
              <Text className="text-[#b5a99a] text-center py-6">{t('profile.noSessions')}</Text>
            ) : (
              sessions.slice(-5).reverse().map((session) => (
                <View
                  key={session.id}
                  className="flex-row justify-between items-center py-3 px-2 border-b border-[#e8ddd0]"
                >
                  <View>
                    <Text className="text-[#6a5f53] font-semibold">{formatTime(session.duration)}</Text>
                    <Text className="text-[#b5a99a] text-xs mt-1">{formatDate(session.date)}</Text>
                  </View>
                  <Ionicons name="checkmark-circle" size={24} color="#91908b" />
                </View>
              ))
            )}
          </View>

        </ScrollView>

        {/* Language Selector Modal */}
        {languageModalVisible && (
          <View className="absolute inset-0 bg-black/60 flex-1 justify-center items-center">
            <View className="bg-white rounded-2xl p-6 w-11/12 max-w-md">
              <Text className="text-[#6a5f53] text-xl font-bold mb-4 text-center">
                {t('profile.selectLanguage')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  // Change language to English
                  i18n.changeLanguage('en');
                  setLanguageModalVisible(false);
                }}
                className="flex-row items-center justify-between py-3 px-4 rounded-lg bg-[#f3f4f6] mb-3"
              >
                <Text className="text-[#6a5f53] text-base">{t('profile.english')}</Text>
                {i18n.language === 'en' && (
                  <AntDesign name="check" size={16} color="#6a5f53" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // Change language to French
                  i18n.changeLanguage('fr');
                  setLanguageModalVisible(false);
                }}
                className="flex-row items-center justify-between py-3 px-4 rounded-lg bg-[#f3f4f6] mb-3"
              >
                <Text className="text-[#6a5f53] text-base">{t('profile.french')}</Text>
                {i18n.language === 'fr' && (
                  <AntDesign name="check" size={16} color="#6a5f53" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLanguageModalVisible(false)}
                className="mt-4 py-3 px-4 rounded-lg bg-[#6a5f53]"
              >
                <Text className="text-white text-center font-semibold">
                  {t('profile.close')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <LanguageSelector visible={languageModalVisible} onClose={() => setLanguageModalVisible(false)} />
      </SafeAreaView>
    </ImageBackground>
  );
}
