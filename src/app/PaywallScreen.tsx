import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, ImageBackground, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import { checkEntitlement } from '../services/revenueCat';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { useTranslation } from 'react-i18next';
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import { presentPaywall } from '../services/paywall';

type PaywallScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Paywall'>;
};

export default function PaywallScreen({ navigation }: PaywallScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'focusapp_monthly' | 'focusapp_yearly'>('focusapp_yearly');
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    checkIfAlreadyPro();
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null && offerings.current.availablePackages.length > 0) {
        setPackages(offerings.current.availablePackages);
      }
    } catch (e) {
      console.error('Error loading packages:', e);
    }
  };

  const checkIfAlreadyPro = async () => {
    const hasPro = await checkEntitlement();
    if (hasPro) {
      navigation.replace('Ready');
    }
  };

  const handleSubscribe = async () => {
  setIsLoading(true);
  try {
    // 1. Trouver le package correspondant au plan sélectionné
    const packageToBuy = packages.find(pkg => 
      pkg.identifier === (selectedPlan === 'focusapp_yearly' ? '$rc_annual' : '$rc_monthly')
    );

    if (packageToBuy) {
      // 2. Lancer l'achat directement sans ouvrir d'autre interface
      const { customerInfo } = await Purchases.purchasePackage(packageToBuy);
      
      // 3. Vérifier si l'abonnement est actif
      if (typeof customerInfo.entitlements.active['pro'] !== "undefined") {
        await AsyncStorage.setItem('hasFreeTrial', 'false');
        navigation.replace('Ready');
      }
    } else {
      Alert.alert("Erreur", "Offre non disponible pour le moment.");
    }
  } catch (e: any) {
    if (!e.userCancelled) {
      Alert.alert("Erreur", e.message);
    }
  } finally {
    setIsLoading(false);
  }
};

  const handleMaybeLater = async () => {
    // Set free trial mode - limited access
    await AsyncStorage.setItem('hasFreeTrial', 'true');
    navigation.navigate('Ready');
  };

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      className="flex-1"
      resizeMode="cover"
    >
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 pt-20 pb-8 justify-between">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="bg-[#e8ddd0] rounded-full w-24 h-24 items-center justify-center mb-6">
              <Ionicons name="flash" size={48} color="#91908b" />
            </View>
            <Text className="text-[#91908b] text-4xl font-bold text-center mb-4">
              {t('paywall.title')}
            </Text>
            <Text className="text-[#6a5f53] text-lg text-center leading-6 px-4">
              {t('paywall.subtitle')}
            </Text>
            <TouchableOpacity className="absolute top-15 right-2" onPress={() => navigation.goBack()}>
              <AntDesign name="close-circle" size={24} color="#91908b" />
            </TouchableOpacity>
          </View>

          {/* Pricing Cards */}
          <View className="mb-8">
            {/* Yearly Plan */}
            <TouchableOpacity
              onPress={() => setSelectedPlan('focusapp_yearly')}
              className={`rounded-3xl p-6 mb-4 border-2 ${
                selectedPlan === 'focusapp_yearly' 
                  ? 'bg-[#91908b] border-[#91908b]' 
                  : 'bg-[#e8ddd0] border-[#d4c9ba]'
              }`}
            >
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                  <Text className={`text-2xl font-bold ${
                    selectedPlan === 'focusapp_yearly' ? 'text-white' : 'text-[#91908b]'
                  }`}>
                    {t('paywall.yearlyPlan')}
                  </Text>
                  <View className="bg-[#6a5f53] px-3 py-1 rounded-full ml-3">
                    <Text className="text-white text-xs font-bold">{t('paywall.savePercent', { percent: '50' })}</Text>
                  </View>
                </View>
                <View className={`w-6 h-6 rounded-full border-2 ${
                  selectedPlan === 'focusapp_yearly' 
                    ? 'bg-white border-white' 
                    : 'border-[#91908b]'
                }`}>
                  {selectedPlan === 'focusapp_yearly' && (
                    <Ionicons name="checkmark" size={20} color="#91908b" />
                  )}
                </View>
              </View>
              <Text className={`text-3xl font-bold ${
                selectedPlan === 'focusapp_yearly' ? 'text-white' : 'text-[#91908b]'
              }`}>
                $79.99/year
              </Text>
              <Text className={`text-sm mt-1 ${
                selectedPlan === 'focusapp_yearly' ? 'text-white/80' : 'text-[#6a5f53]'
              }`}>
                Just $6.67/month
              </Text>
            </TouchableOpacity>

            {/* Monthly Plan */}
            <TouchableOpacity
              onPress={() => setSelectedPlan('focusapp_monthly')}
              className={`rounded-3xl p-6 border-2 ${
                selectedPlan === 'focusapp_monthly' 
                  ? 'bg-[#91908b] border-[#91908b]' 
                  : 'bg-[#e8ddd0] border-[#d4c9ba]'
              }`}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className={`text-2xl font-bold ${
                  selectedPlan === 'focusapp_monthly' ? 'text-white' : 'text-[#91908b]'
                }`}>
                  {t('paywall.monthlyPlan')}
                </Text>
                <View className={`w-6 h-6 rounded-full border-2 ${
                  selectedPlan === 'focusapp_monthly' 
                    ? 'bg-white border-white' 
                    : 'border-[#91908b]'
                }`}>
                  {selectedPlan === 'focusapp_monthly' && (
                    <Ionicons name="checkmark" size={20} color="#91908b" />
                  )}
                </View>
              </View>
              <Text className={`text-3xl font-bold ${
                selectedPlan === 'focusapp_monthly' ? 'text-white' : 'text-[#91908b]'
              }`}>
                $9.99/month
              </Text>
              <Text className={`text-sm mt-1 ${
                selectedPlan === 'focusapp_monthly' ? 'text-white/80' : 'text-[#6a5f53]'
              }`}>
                Billed monthly
              </Text>
            </TouchableOpacity>
          </View>

          {/* Features */}
          <View className="bg-[#e8ddd0]/50 rounded-2xl p-5 mb-6">
            <FeatureItem icon="checkmark-circle" text={t('paywall.feature1')} />
            <FeatureItem icon="checkmark-circle" text={t('paywall.feature2')} />
            <FeatureItem icon="checkmark-circle" text={t('paywall.feature3')} />
            <FeatureItem icon="checkmark-circle" text={t('paywall.feature4')} />
          </View>

          {/* CTA Buttons */}
          <View>
            <TouchableOpacity
              onPress={handleSubscribe}
              disabled={isLoading}
              className="bg-[#91908b] rounded-2xl py-5 px-8 mb-4 shadow-lg"
              style={{ elevation: 5 }}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text className="text-white text-xl font-bold text-center">
                  {t('paywall.subscribe')} - {selectedPlan === 'focusapp_yearly' ? t('paywall.yearlyPlan') : t('paywall.monthlyPlan')}
                </Text>
              )}
            </TouchableOpacity>

            {/* Maybe Later Button */}
            <TouchableOpacity
              onPress={handleMaybeLater}
              disabled={isLoading}
              className="py-4"
            >
              <Text className="text-[#6a5f53] text-base text-center font-semibold">
                {t('paywall.maybeLater')}
              </Text>
            </TouchableOpacity>

            {/* Footer */}
            <Text className="text-[#b5a99a] text-xs text-center mt-2">
              {t('paywall.termsAndPrivacy')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

interface FeatureItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}

function FeatureItem({ icon, text }: FeatureItemProps) {
  return (
    <View className="flex-row items-center mb-3">
      <Ionicons name={icon} size={20} color="#91908b" />
      <Text className="text-[#6a5f53] text-base ml-3 flex-1">
        {text}
      </Text>
    </View>
  );
}
