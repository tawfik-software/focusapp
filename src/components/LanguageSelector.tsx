import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage } from '../services/i18n';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
];

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export default function LanguageSelector({ visible, onClose }: LanguageSelectorProps) {
  const { t, i18n } = useTranslation();
  const currentLanguage = getCurrentLanguage();

  const handleLanguageSelect = async (languageCode: string) => {
    await changeLanguage(languageCode);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-[#6a5f53] text-2xl font-bold">
              {t('profile.changeLanguage')}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={28} color="#6a5f53" />
            </TouchableOpacity>
          </View>

          {/* Language List */}
          <FlatList
            data={languages}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleLanguageSelect(item.code)}
                className={`flex-row justify-between items-center py-4 px-4 mb-2 rounded-xl ${
                  currentLanguage === item.code ? 'bg-[#91908b]' : 'bg-[#e8ddd0]'
                }`}
              >
                <View>
                  <Text
                    className={`text-lg font-semibold ${
                      currentLanguage === item.code ? 'text-white' : 'text-[#6a5f53]'
                    }`}
                  >
                    {item.nativeName}
                  </Text>
                  <Text
                    className={`text-sm ${
                      currentLanguage === item.code ? 'text-white/80' : 'text-[#b5a99a]'
                    }`}
                  >
                    {item.name}
                  </Text>
                </View>
                {currentLanguage === item.code && (
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}
