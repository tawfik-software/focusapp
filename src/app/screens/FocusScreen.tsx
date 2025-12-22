import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { AntDesign } from "@react-native-vector-icons/ant-design";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, FocusSession } from "../../types/types";
import { AudioPlayer, useAudioPlayer } from "expo-audio";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkEntitlement } from "../../services/revenueCat";

// Define navigation prop type
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// FocusScreen component
const FocusScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [focusTime, setFocusTime] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [userName, setUserName] = useState("");
  const [musicModalVisible, setMusicModalVisible] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState("music1");
  const [hasFreeTrial, setHasFreeTrial] = useState(true);
  const [hasPremium, setHasPremium] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const player = useAudioPlayer(require("../../../assets/music/music1.mp3"));

  // Music library
  const musicLibrary = [
    {
      id: "music1",
      name: "music1",
      source: require("../../../assets/music/music1.mp3"),
    },
    {
      id: "music2",
      name: "music2",
      source: require("../../../assets/music/music2.mp3"),
    },
    {
      id: "music3",
      name: "music3",
      source: require("../../../assets/music/music3.mp3"),
    },
    {
      id: "music4",
      name: "music4",
      source: require("../../../assets/music/music4.mp3"),
    },
    {
      id: "music5",
      name: "music5",
      source: require("../../../assets/music/music5.mp3"),
    },
    {
      id: "music6",
      name: "music6",
      source: require("../../../assets/music/music6.mp3"),
    },
    {
      id: "music7",
      name: "music7",
      source: require("../../../assets/music/music7.mp3"),
    },
    {
      id: "music8",
      name: "music8",
      source: require("../../../assets/music/music8.mp3"),
    },
    {
      id: "music9",
      name: "music9",
      source: require("../../../assets/music/music9.mp3"),
    },
    {
      id: "music10",
      name: "music10",
      source: require("../../../assets/music/music10.mp3"),
    },
    {
      id: "music11",
      name: "music11",
      source: require("../../../assets/music/music11.mp3"),
    },
    {
      id: "music12",
      name: "music12",
      source: require("../../../assets/music/music12.mp3"),
    },
    {
      id: "music13",
      name: "music13",
      source: require("../../../assets/music/music13.mp3"),
    },
    {
      id: "music14",
      name: "music14",
      source: require("../../../assets/music/music14.mp3"),
    },
  ];

  // Load permission status on mount
  useEffect(() => {
    loadPermissionStatus();
    loadUserName();
    checkSubscriptionStatus();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      try {
        if (player) {
          player.remove();
        }
      } catch (error) {
        console.log("Error removing player:", error);
      }
    };
  }, []);

  // Load permission status from storage
  const loadPermissionStatus = async () => {
    try {
      const permissionGranted = await AsyncStorage.getItem(
        "@screen_time_permission"
      );
      if (permissionGranted === "true") {
        setHasPermission(true);
      }
    } catch (error) {
      console.log("Error loading permission status:", error);
    }
  };

  // Load user name
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

  // Check subscription status
  const checkSubscriptionStatus = async () => {
    try {
      const freeTrialStatus = await AsyncStorage.getItem("hasFreeTrial");
      const isPremium = await checkEntitlement();
      
      setHasFreeTrial(freeTrialStatus === "true");
      setHasPremium(isPremium);
    } catch (error) {
      console.log("Error checking subscription:", error);
    }
  };

  // Save permission status to storage
  const savePermissionStatus = async (granted: boolean) => {
    try {
      await AsyncStorage.setItem("@screen_time_permission", granted.toString());
    } catch (error) {
      console.log("Error saving permission status:", error);
    }
  };

  // Request Screen Time permission (iOS)
  const requestScreenTimePermission = () => {
    // If permission already granted, start directly
    if (hasPermission) {
      startTimer();
      return;
    }

    // Show permission modal only on iOS and if not already granted
    if (Platform.OS === "ios") {
      setPermissionModalVisible(true);
    } else {
      // Android doesn't need permission, start directly
      startTimer();
    }
  };

  // Handle permission grant
  const handlePermissionGranted = async () => {
    setHasPermission(true);
    setPermissionModalVisible(false);
    await savePermissionStatus(true);
    startTimer();
  };

  // Handle permission denied
  const handlePermissionDenied = () => {
    setPermissionModalVisible(false);
    Alert.alert(
      "Permission requise",
      "L'accès au suivi du temps est nécessaire pour utiliser cette fonctionnalité.",
      [{ text: "OK" }]
    );
  };

  // Toggle volume control visibility
  const toggleVolumeControl = () => {
    if (!hasPremium) {
      Alert.alert(
        "Premium Feature",
        "Volume control is only available for premium subscribers.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Get Premium", 
            onPress: () => navigation.navigate("Paywall")
          }
        ]
      );
      return;
    }
    setShowVolumeControl(!showVolumeControl);
  };

  // Update volume
  const updateVolume = async (newVolume: number) => {
    if (!hasPremium) {
      return;
    }
    setVolume(newVolume);
    player.volume = newVolume;
  };

  // Handle music selection
  const handleMusicSelection = async (musicId: string) => {
    // Only allow music1 for free trial users
    if (!hasPremium && musicId !== "music1") {
      Alert.alert(
        "Premium Feature",
        "Premium music tracks are only available for subscribers. Upgrade to access all 14 ambient tracks!",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Get Premium", 
            onPress: () => navigation.navigate("Paywall")
          }
        ]
      );
      return;
    }

    if (isRunning) {
      Alert.alert(
        "Session en cours",
        "Veuillez arrêter la session actuelle pour changer de musique.",
        [{ text: "OK" }]
      );
      return;
    }
    setSelectedMusic(musicId);
    setMusicModalVisible(false);

    // Reload player with new music
    try {
      const selectedMusicData = musicLibrary.find((m) => m.id === musicId);
      if (selectedMusicData) {
        await player.replace(selectedMusicData.source);
      }
    } catch (error) {
      console.log("Error changing music:", error);
    }
  };

  // Start timer function
  const startTimer = async () => {
    setIsRunning(true);
    setSeconds(0);
    const startTime = Date.now();
    setSessionStartTime(startTime);

    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // Play background music
    try {
      player.volume = volume;
      player.loop = true;
      player.play();
    } catch (error) {
      console.log("Error playing audio:", error);
    }
  };

  // Stop timer function
  const stopTimer = async () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Stop background music
    try {
      player.pause();
    } catch (error) {
      console.log("Error stopping audio:", error);
    }

    // Save the session
    await saveFocusSession();

    setFocusTime(seconds);
    setModalVisible(true);
  };

  // Save focus session to AsyncStorage
  const saveFocusSession = async () => {
    if (!sessionStartTime || seconds === 0) return;

    try {
      const endTime = Date.now();
      const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      const session: FocusSession = {
        id: `${sessionStartTime}-${endTime}`,
        userName: userName || "User",
        startTime: sessionStartTime,
        endTime: endTime,
        duration: seconds,
        date: date,
      };

      // Load existing sessions
      const existingData = await AsyncStorage.getItem("@focus_sessions");
      const sessions: FocusSession[] = existingData
        ? JSON.parse(existingData)
        : [];

      // Add new session
      sessions.push(session);

      // Save back to storage
      await AsyncStorage.setItem("@focus_sessions", JSON.stringify(sessions));
      console.log("Session saved successfully:", session);
    } catch (error) {
      console.log("Error saving session:", error);
    }
  };

  // Format time function with improved formatting
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    // Format with leading zeros
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(secs).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  // Get time display with units
  const getTimeWithUnits = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/focusfallback.png")}
      className="flex-1"
      resizeMode="cover"
    >
      {/* Header buttons */}
      <View className="flex-row justify-between items-center top-16 px-5">
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <AntDesign name="left-circle" size={30} color="#6a5f53" />
        </TouchableOpacity>
        <View>
          <View className="flex-row gap-4">
            <TouchableOpacity onPress={() => setMusicModalVisible(true)}>
              <MaterialCommunityIcons
                name="playlist-music-outline"
                size={30}
                color="#6a5f53"
              />
            </TouchableOpacity>
            {/* Analytics Button */}
            <TouchableOpacity onPress={async () => {
              if (!hasPremium) {
                Alert.alert(
                  "Premium Feature",
                  "Analytics are only available for premium subscribers. Upgrade to track your focus progress!",
                  [
                    { text: "Cancel", style: "cancel" },
                    { 
                      text: "Get Premium", 
                      onPress: () => navigation.navigate("Paywall")
                    }
                  ]
                );
                return;
              }
              navigation.navigate("Analytics");
            }}>
              <AntDesign name="bar-chart" size={30} color="#6a5f53" />
            </TouchableOpacity>
            {/* Volume Control */}
            <TouchableOpacity onPress={toggleVolumeControl}>
              <AntDesign name="sound" size={30} color="#6a5f53" />
            </TouchableOpacity>
          </View>

          {/* Volume Control Vertical */}
          {showVolumeControl && (
            <View
              className="absolute top-12 right-0 bg-white/90 rounded-2xl p-3 shadow-lg"
              style={{ width: 50 }}
            >
              <View className="items-center">
                {/* Volume indicator */}
                <Text className="text-[#6a5f53] text-xs font-bold mb-2">
                  {Math.round(volume * 100)}%
                </Text>

                {/* Vertical volume bar */}
                <View
                  className="relative bg-gray-200 rounded-full"
                  style={{ width: 8, height: 120 }}
                >
                  {/* Filled volume */}
                  <View
                    className="absolute bottom-0 bg-[#91908b] rounded-full"
                    style={{
                      width: 8,
                      height: `${volume * 100}%`,
                    }}
                  />
                </View>

                {/* Volume buttons */}
                <View className="mt-3 gap-2">
                  <TouchableOpacity
                    onPress={() => updateVolume(Math.min(volume + 0.1, 1))}
                    className="bg-[#91908b] rounded-full p-1"
                  >
                    <AntDesign name="plus" size={16} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => updateVolume(Math.max(volume - 0.1, 0))}
                    className="bg-[#91908b] rounded-full p-1"
                  >
                    <AntDesign name="minus" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
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
            onPress={requestScreenTimePermission}
          >
            <Text className="text-white text-lg font-bold">START FOCUS</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal de permission Screen Time */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={permissionModalVisible}
        onRequestClose={() => setPermissionModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-black rounded-2xl p-8 mx-5 items-center w-80">
            <Text className="text-3xl mb-4">⏱️</Text>
            <Text className="text-2xl font-bold text-[#6a5f53] mb-4 text-center">
              Accès au suivi du temps
            </Text>
            <Text className="text-gray-600 mb-6 text-center">
              Pour suivre votre temps de concentration, nous avons besoin
              d'accéder au suivi du temps sur votre appareil.
            </Text>
            <View className="w-full gap-3">
              <TouchableOpacity
                className="bg-[#91908b] px-8 py-3 rounded-lg w-full"
                onPress={handlePermissionGranted}
              >
                <Text className="text-black text-center font-bold text-lg">
                  Autoriser
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-white px-8 py-3 rounded-lg w-full"
                onPress={handlePermissionDenied}
              >
                <Text className="text-gray-700 text-center font-bold text-lg">
                  Refuser
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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

      {/* Modal de sélection de musique */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={musicModalVisible}
        onRequestClose={() => setMusicModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl p-6 max-h-[70%]">
            <TouchableOpacity
              onPress={() => setMusicModalVisible(false)}
              className="absolute top-4 right-4 z-10"
            >
              <AntDesign name="close" size={26} color="black" />
            </TouchableOpacity>
            {/* Title */}
            <Text className="text-2xl font-bold text-black text-center mb-6">
              🎧 Choose Focus Music
            </Text>

            {/* Music List */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="gap-3">
                {musicLibrary.map((music, index) => (
                  <TouchableOpacity
                    key={music.id}
                    onPress={() => handleMusicSelection(music.id)}
                    activeOpacity={0.8}
                    className={`flex-row justify-between items-center p-4 rounded-xl border
                     ${
                       selectedMusic === music.id
                         ? "border-black bg-gray-100"
                         : "border-gray-300 bg-white"
                    }
                    `}
                  >
                    <View>
                      <Text className="text-black font-semibold text-lg">
                        Music {index + 1}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        Chapter {index + 1}
                      </Text>
                    </View>

                    {selectedMusic === music.id && (
                      <AntDesign
                        name="check-circle"
                        size={30}
                        color="#6a5f53"
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default FocusScreen;
