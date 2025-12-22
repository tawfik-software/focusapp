import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, ImageBackground } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import { presentPaywall } from '../../services/paywall';
import { checkEntitlement } from '../../services/revenueCat';
import { Ionicons } from '@expo/vector-icons';

type PaywallScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Paywall'>;
};

export default function PaywallScreen({ navigation }: PaywallScreenProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkIfAlreadyPro();
  }, []);

  const checkIfAlreadyPro = async () => {
    const hasPro = await checkEntitlement();
    if (hasPro) {
      navigation.replace('Ready');
    }
  };

  const handleGetPro = async () => {
    setIsLoading(true);
    const success = await presentPaywall();
    setIsLoading(false);

    if (success) {
      navigation.replace('Ready');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Ready');
  };

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      className="flex-1"
      resizeMode="cover"
    >
      <ScrollView className="flex-1">
        <View className="flex-1 px-6 pt-16 pb-8">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="bg-[#e8ddd0] rounded-full w-20 h-20 items-center justify-center mb-4">
              <Ionicons name="star" size={40} color="#91908b" />
            </View>
            <Text className="text-[#91908b] text-4xl font-bold text-center mb-3">
              Unlock Pro
            </Text>
            <Text className="text-[#6a5f53] text-lg text-center">
              Get unlimited access to all features
            </Text>
          </View>

          {/* Features List */}
          <View className="mb-8">
            <FeatureItem 
              icon="infinite" 
              title="Unlimited Sessions"
              description="Focus as much as you need"
            />
            <FeatureItem 
              icon="analytics" 
              title="Advanced Analytics"
              description="Track your progress in detail"
            />
            <FeatureItem 
              icon="musical-notes" 
              title="Premium Sounds"
              description="Access exclusive focus music"
            />
            <FeatureItem 
              icon="cloud-upload" 
              title="Cloud Sync"
              description="Sync across all your devices"
            />
            <FeatureItem 
              icon="notifications-off" 
              title="Ad-Free Experience"
              description="Focus without interruptions"
            />
          </View>

          {/* CTA Button */}
          <TouchableOpacity
            onPress={handleGetPro}
            disabled={isLoading}
            className="bg-[#91908b] rounded-2xl py-4 px-8 mb-4 shadow-lg"
            style={{ elevation: 5 }}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text className="text-white text-xl font-bold text-center">
                See Plans
              </Text>
            )}
          </TouchableOpacity>

          {/* Skip Button */}
          <TouchableOpacity
            onPress={handleSkip}
            disabled={isLoading}
            className="py-3"
          >
            <Text className="text-[#6a5f53] text-base text-center">
              Maybe later
            </Text>
          </TouchableOpacity>

          {/* Footer */}
          <Text className="text-[#b5a99a] text-xs text-center mt-4">
            Cancel anytime. Terms apply.
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

interface FeatureItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <View className="flex-row items-center mb-6">
      <View className="bg-[#e8ddd0] rounded-full w-12 h-12 items-center justify-center mr-4">
        <Ionicons name={icon} size={24} color="#91908b" />
      </View>
      <View className="flex-1">
        <Text className="text-[#91908b] text-lg font-semibold">
          {title}
        </Text>
        <Text className="text-[#6a5f53] text-sm">
          {description}
        </Text>
      </View>
    </View>
  );
}
