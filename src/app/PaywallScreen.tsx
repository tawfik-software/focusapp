import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, ImageBackground, Alert, Linking } from 'react-native';
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
      console.log('🔄 Chargement des offerings...');
      const offerings = await Purchases.getOfferings();
      
      console.log('📊 Résultat offerings:');
      console.log('  - Current offering:', offerings.current?.identifier || 'AUCUN');
      console.log('  - Tous les offerings:', Object.keys(offerings.all));
      
      if (offerings.current !== null && offerings.current.availablePackages.length > 0) {
        setPackages(offerings.current.availablePackages);
        console.log('✅ Packages disponibles:', offerings.current.availablePackages.length);
        offerings.current.availablePackages.forEach(pkg => {
          console.log(`  📦 ${pkg.packageType}:`, {
            identifier: pkg.identifier,
            productId: pkg.product.identifier,
            price: pkg.product.priceString
          });
        });
      } else {
        console.log('❌ PROBLÈME: Aucune offre disponible');
        console.log('Vérifiez:');
        console.log('1. Les produits sont "Prêt à soumettre" dans App Store Connect');
        console.log('2. Les abonnements sont attachés à votre version App Store');
        console.log('3. Le Bundle ID correspond dans Xcode, App Store Connect et RevenueCat');
      }
    } catch (e: any) {
      console.error('❌ Erreur chargement packages:', e);
      console.error('Message:', e.message);
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
    console.log('🛒 Tentative d\'achat pour:', selectedPlan);
    console.log('📦 Packages disponibles:', packages.length);
    
    if (packages.length === 0) {
      console.error('❌ Aucun package disponible - Vérifier la configuration RevenueCat');
      Alert.alert(
        'Configuration Required',
        'Subscription packages are not available. This may be due to:\n\n1. Products not configured in App Store Connect\n2. RevenueCat offering not set up\n3. Network connectivity issue\n\nPlease ensure products are "Ready to Submit" in App Store Connect and a default offering exists in RevenueCat.',
        [
          { text: 'OK' },
          { text: 'Try Again', onPress: () => loadPackages() }
        ]
      );
      setIsLoading(false);
      return;
    }
    
    // Chercher par type de package plutôt que par identifier
    const packageToBuy = selectedPlan === 'focusapp_yearly' 
      ? packages.find(pkg => pkg.packageType === 'ANNUAL')
      : packages.find(pkg => pkg.packageType === 'MONTHLY');

    if (!packageToBuy) {
      // Fallback: chercher par identifier de produit
      const productId = selectedPlan === 'focusapp_yearly' ? 'focusapp_yearly' : 'focusapp_monthly';
      const fallbackPackage = packages.find(pkg => pkg.product.identifier === productId);
      
      if (fallbackPackage) {
        console.log('✅ Package trouvé via product ID:', fallbackPackage.product.identifier);
        try {
          const { customerInfo } = await Purchases.purchasePackage(fallbackPackage);
          
          if (typeof customerInfo.entitlements.active['focusapp Pro'] !== "undefined") {
            await AsyncStorage.setItem('hasFreeTrial', 'false');
            navigation.replace('Ready');
          }
        } catch (purchaseError: any) {
          console.error('❌ Purchase error:', purchaseError);
          if (!purchaseError.userCancelled) {
            Alert.alert(
              t('paywall.error'),
              purchaseError.message || "An error occurred during purchase. Please try again."
            );
          }
        }
        return;
      }
      
      // Aucun package trouvé
      console.error('❌ Aucun package trouvé. Packages disponibles:', 
        packages.map(p => ({ id: p.identifier, type: p.packageType, productId: p.product.identifier }))
      );
      Alert.alert(
        t('paywall.error'),
        "The selected subscription is not available. Please try again or contact support."
      );
      return;
    }

    console.log('✅ Package trouvé:', packageToBuy.identifier);
    const { customerInfo } = await Purchases.purchasePackage(packageToBuy);
    
    if (typeof customerInfo.entitlements.active['focusapp Pro'] !== "undefined") {
      await AsyncStorage.setItem('hasFreeTrial', 'false');
      navigation.replace('Ready');
    }
  } catch (e: any) {
    console.error('❌ Erreur d\'achat:', e);
    console.error('Error code:', e.code);
    console.error('Error message:', e.message);
    console.error('User cancelled:', e.userCancelled);
    
    if (!e.userCancelled) {
      let errorMessage = "An error occurred during purchase. Please try again.";
      
      // Provide more specific error messages
      if (e.code === 'PRODUCT_NOT_AVAILABLE_FOR_PURCHASE') {
        errorMessage = "This subscription is not available for purchase. Please check App Store Connect configuration.";
      } else if (e.code === 'PURCHASE_NOT_ALLOWED') {
        errorMessage = "Purchases are not allowed on this device. Check your device settings.";
      } else if (e.code === 'PAYMENT_PENDING') {
        errorMessage = "Your payment is pending. Please check back later.";
      } else if (e.message) {
        errorMessage = e.message;
      }
      
      Alert.alert(t('paywall.error'), errorMessage);
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

          {/* Terms of Service Link */}
          <TouchableOpacity 
            onPress={() => Linking.openURL('https://tawfik-software.github.io/focusapp/terms.html')}
            className="items-center mb-4"
          >
            <Text className="text-[#91908b] text-sm underline">
              {t('paywall.termsOfService', 'Terms of Service')}
            </Text>
          </TouchableOpacity>

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
            <View className="mt-4">
              <Text className="text-[#6a5f53] text-xs text-center leading-5 mb-3">
                {t('paywall.autoRenew')}
              </Text>
            
              <View className="flex-row justify-center items-center space-x-2">
                <TouchableOpacity onPress={() => Linking.openURL('https://raw.githubusercontent.com/tawfik-software/focusapp/main/terms.html')}>
                  <Text className="text-[#91908b] text-xs underline">
                    {t('paywall.terms')}
                  </Text>
                </TouchableOpacity>
                <Text className="text-[#b5a99a] text-xs"> • </Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://1drv.ms/w/c/1d76045b040cc6c0/IQCVPalKvNAeRZjqx-XsoArEASOvboHjtSBoD6zm1FC9F0Y')}>
                  <Text className="text-[#91908b] text-xs underline">
                    {t('paywall.privacy')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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