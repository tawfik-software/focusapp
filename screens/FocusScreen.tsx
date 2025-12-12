import { Text, View, ImageBackground, TouchableOpacity, Modal } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

// Define navigation prop type
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// FocusScreen component
const FocusScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [focusTime, setFocusTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Start timer function
  const startTimer = () => {
    setIsRunning(true);
    setSeconds(0);
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  // Stop timer function
  const stopTimer = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setFocusTime(seconds);
    setModalVisible(true);
  };

  // Format time function
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  return (
    <ImageBackground
      source={require("../assets/focusfallback.png")}
      className="flex-1"
      resizeMode="cover"
    >
      {/* Header buttons */}
      <View className="flex-row justify-between items-center top-16 px-5">
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
        >
          <AntDesign name="left-circle" size={30} color="#6a5f53" />
        </TouchableOpacity>
        <TouchableOpacity>
          <AntDesign name="sound" size={30} color="#6a5f53" />
        </TouchableOpacity>
      </View>
      {/* Title */}
      <View className="flex-1 items-center justify-center">
        {isRunning ? (
          // timer display
          <Text className="text-[#b6ac8f] text-6xl font-bold">
            {formatTime(seconds)}
          </Text>
        ) : (
          // static display
          <Text className="text-[#6a5f53] text-2xl font-bold mb-[540px]">
            STAY FOCUSED
          </Text>
        )}
      </View>
      {/* Button */}
      <View className="items-center pb-20">
        {isRunning ? (
          // stop button
          <TouchableOpacity
            className="bg-[#b6ac8f] px-12 py-4 rounded-lg"
            activeOpacity={0.8}
            onPress={stopTimer}
          >
            <Text className="text-white text-lg font-bold">STOP FOCUS</Text>
          </TouchableOpacity>
        ) : (
          // start button
          <TouchableOpacity
            className="bg-[#91908b] px-12 py-4 rounded-lg"
            activeOpacity={0.8}
            onPress={startTimer}
          >
            <Text className="text-white text-lg font-bold">START FOCUS</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal de résultat */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Modal content */}
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-8 mx-5 items-center w-80">
            <Text className="text-2xl font-bold text-[#6a5f53] mb-4">
              Excellent work! 🎉
            </Text>
            <Text className="text-gray-600 mb-2">Focus time:</Text>
            <Text className="text-5xl font-bold text-[#6a5f53] mb-6">
              {formatTime(focusTime)}
            </Text>
            <TouchableOpacity
              className="bg-[#91908b] px-8 py-3 rounded-lg w-full"
              onPress={() => setModalVisible(false)}
            >
              {/* Close button */}
              <Text className="text-white text-center font-bold text-lg">
                close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default FocusScreen;
