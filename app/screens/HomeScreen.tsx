import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const [userName, setUserName] = useState("");

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
      source={require("../assets/firstfocusfallback.png")}
      className="flex-1"
      resizeMode="cover"
    >
      {/* hider */}
      <View className="flex-1 p-5">
        <Text className="text-xl text-[#91908b] mt-12 mb-2">
          Welcome {userName}!
        </Text>
        <Text className="text-4xl font-bold text-black mb-1">Focus App</Text>
        <Text className="text-lg text-[#a0a0a0] mb-10">🎵 Focus Timer</Text>

        {/* Button */}
        <View className="flex-1 items-center justify-end pb-20">
          <TouchableOpacity
            onPress={() => navigation.navigate("Focus")}
            activeOpacity={0.7}
          >
            <Image
              source={require("../assets/buttonsfocus.png")}
              className="w-[140px] h-[140px]"
            />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
