import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/types";
import { checkEntitlement } from "../services/revenueCat";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from 'react-i18next';


type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const [userName, setUserName] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const name = await AsyncStorage.getItem("userName");
      if (name) {
        setUserName(name);
      }
    } catch (error) {
      console.log("Error loading name:", error);
    }
  };

  const handleAnalyticsPress = async () => {
    const isPremium = await checkEntitlement();
    
    if (!isPremium) {
      Alert.alert(
        t('home.premiumFeature'),
        t('home.analyticsMessage'),
        [
          { text: t('home.cancel'), style: "cancel" },
          { 
            text: t('home.getPremium'), 
            onPress: () => navigation.navigate("Paywall")
          }
        ]
      );
      return;
    }
    
    navigation.navigate("Analytics");
  };

  return (
    <ImageBackground
      source={require("../../assets/firstfocusfallback.png")}
      className="flex-1"
      resizeMode="cover"
    >
      {/* Header with Profile Button */}
      <View className="flex-row justify-between items-center px-5 pt-12">
        <View>
          <View className="top-4 left-0 right-0">

          <Text className="text-xl text-[#91908b] mb-2">
            {t('home.welcome', { name: userName })}
          </Text>
          <Text className="text-4xl font-bold text-black mb-1">{t('home.title')}</Text>
          <Text className="text-lg text-[#a0a0a0]">{t('home.subtitle')}</Text>
          </View>
        </View>
        
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          className="bg-[#e8ddd0] rounded-full p-3"
        >
          <Ionicons name="person" size={28} color="#6a5f53" />
        </TouchableOpacity>
      </View>

      {/* Button */}
      <View className="flex-1 items-center justify-end pb-20">
        <TouchableOpacity
          onPress={() => navigation.navigate("Focus")}
          activeOpacity={0.7}
        >
          <Image
            source={require("../../assets/buttonsfocus.png")}
            className="w-[140px] h-[140px]"
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
