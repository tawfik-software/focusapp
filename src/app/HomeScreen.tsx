import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from 'react-i18next';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// ID de bloc d'annonces AdMob
const BANNER_AD_UNIT_ID = __DEV__ 
  ? TestIds.ADAPTIVE_BANNER 
  : 'ca-app-pub-2359836796711365/7844407987';


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

      {/* Bannière publicitaire AdMob */}
      <View className="absolute bottom-0 left-0 right-0 items-center bg-white/95 py-2">
        <BannerAd
          unitId={BANNER_AD_UNIT_ID}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
    </ImageBackground>
  );
}
