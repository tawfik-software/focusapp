import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { AntDesign } from "@react-native-vector-icons/ant-design";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, FocusSession, DailyStats } from "../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  saveAnalyticsHistory,
  getAnalyticsHistory,
  calculateDailyStats,
  clearAnalyticsHistory,
  getLastSyncDate,
} from "../utils/ananalyticsHistory";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AnalyticsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const [userName, setUserName] = useState("");
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // Sauvegarder automatiquement quand les données changent
  useEffect(() => {
    if (sessions.length > 0 && !isLoading) {
      saveAnalyticsHistory(sessions, dailyStats, totalTime);
    }
  }, [sessions, dailyStats, totalTime]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Load user name
      const name = await AsyncStorage.getItem("userName");
      if (name) {
        setUserName(name);
      }

      // Essayer de récupérer l'historique sauvegardé d'abord
      const savedHistory = await getAnalyticsHistory();
      
      if (savedHistory) {
        console.log("📂 Historique trouvé - Chargement...");
        setSessions(savedHistory.sessions);
        setDailyStats(savedHistory.dailyStats);
        setTotalTime(savedHistory.totalTime);
        
        // Afficher la date de dernière sync
        const syncDate = await getLastSyncDate();
        setLastSync(syncDate);
      } else {
        console.log("📂 Aucun historique - Chargement des sessions brutes...");
        // Si pas d'historique, charger depuis les sessions brutes
        const sessionsData = await AsyncStorage.getItem("@focus_sessions");
        if (sessionsData) {
          const parsedSessions: FocusSession[] = JSON.parse(sessionsData);
          setSessions(parsedSessions);
          
          // Calculate stats
          const { dailyStats: stats, totalTime: total } = 
            calculateDailyStats(parsedSessions);
          setDailyStats(stats);
          setTotalTime(total);
          
          // Sauvegarder l'historique pour la prochaine fois
          await saveAnalyticsHistory(parsedSessions, stats, total);
        }
      }
    } catch (error) {
      console.log("Error loading analytics data:", error);
      Alert.alert("Erreur", "Impossible de charger les données d'analyse");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Supprimer l'historique",
      "Êtes-vous sûr de vouloir supprimer tout l'historique ? Cette action est irréversible.",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            const success = await clearAnalyticsHistory();
            if (success) {
              setSessions([]);
              setDailyStats([]);
              setTotalTime(0);
              setLastSync(null);
              Alert.alert("Succès", "Historique supprimé");
            }
          },
        },
      ]
    );
  };

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateString === today.toISOString().split("T")[0]) {
      return "Today";
    } else if (dateString === yesterday.toISOString().split("T")[0]) {
      return "Yesterday";
    } else {
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        day: "numeric",
        month: "short",
      };
      return date.toLocaleDateString("fr-FR", options);
    }
  };

  const getBarHeight = (duration: number): number => {
    if (dailyStats.length === 0) return 0;
    const maxDuration = Math.max(...dailyStats.map((s) => s.totalDuration));
    return maxDuration > 0 ? (duration / maxDuration) * 120 : 0;
  };

  const formatLastSync = (dateString: string | null): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <ImageBackground
        source={require("../../assets/firstfocusfallback.png")}
        className="flex-1"
        resizeMode="cover"
      >
        <View className="flex-1 justify-center items-center">
          <Text className="text-[#6a5f53] text-lg">
            Chargement de l'historique...
          </Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/firstfocusfallback.png")}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 p-5">
        {/* Header */}
        <View className="flex-row justify-between items-center mt-12 mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="left-circle" size={30} color="#6a5f53" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-[#6a5f53]">Analytics</Text>
          <TouchableOpacity onPress={handleClearHistory}>
            <AntDesign name="delete" size={24} color="#6a5f53" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Last Sync Info */}
          {lastSync && (
            <View className="bg-blue-100/80 rounded-lg p-3 mb-3">
              <Text className="text-[#6a5f53] text-xs text-center">
                💾 Dernière sauvegarde: {formatLastSync(lastSync)}
              </Text>
            </View>
          )}

          {/* Stats Overview */}
          <View className="bg-white/80 rounded-2xl p-5 mb-5">
            <Text className="text-[#6a5f53] text-lg font-bold mb-3">
              📊 Overview
            </Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-3xl font-bold text-[#91908b]">
                  {sessions.length}
                </Text>
                <Text className="text-[#6a5f53] text-sm">Sessions</Text>
              </View>
              <View className="items-center">
                <Text className="text-3xl font-bold text-[#91908b]">
                  {formatTime(totalTime)}
                </Text>
                <Text className="text-[#6a5f53] text-sm">Temps Total</Text>
              </View>
              <View className="items-center">
                <Text className="text-3xl font-bold text-[#91908b]">
                  {dailyStats.length}
                </Text>
                <Text className="text-[#6a5f53] text-sm">Jours</Text>
              </View>
            </View>
          </View>

          {/* Bar Chart */}
          {dailyStats.length > 0 && (
            <View className="bg-white/80 rounded-2xl p-5 mb-5">
              <Text className="text-[#6a5f53] text-lg font-bold mb-4">
                📈 Last 7 days
              </Text>
              <View className="flex-row justify-around items-end h-[140px]">
                {dailyStats.slice(0, 7).reverse().map((stat, index) => (
                  <View key={index} className="items-center flex-1">
                    <View className="items-center mb-2">
                      <Text className="text-[#6a5f53] text-xs font-bold">
                        {Math.floor(stat.totalDuration / 60)}m
                      </Text>
                    </View>
                    <View
                      className="bg-[#91908b] rounded-t-lg w-8"
                      style={{
                        height: Math.max(getBarHeight(stat.totalDuration), 10),
                      }}
                    />
                    <Text className="text-[#6a5f53] text-[10px] mt-2 text-center">
                      {stat.date.split("-")[2]}/{stat.date.split("-")[1]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Daily Sessions List */}
          <View className="bg-white/80 rounded-2xl p-5 mb-5">
            <Text className="text-[#6a5f53] text-lg font-bold mb-3">
              📅 History
            </Text>
            {dailyStats.length === 0 ? (
              <View className="items-center py-8">
                <Text className="text-gray-500 text-center text-lg mb-2">
                  Aucune session enregistrée
                </Text>
                <Text className="text-gray-400 text-center text-sm">
                  Commencez une session de focus pour voir vos statistiques
                </Text>
              </View>
            ) : (
              dailyStats.map((dayStat, index) => (
                <View key={index} className="mb-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-[#6a5f53] font-bold">
                      {formatDate(dayStat.date)}
                    </Text>
                    <Text className="text-[#91908b] font-bold">
                      {formatTime(dayStat.totalDuration)}
                    </Text>
                  </View>
                  {dayStat.sessions.map((session, sessionIndex) => (
                    <View
                      key={session.id}
                      className="bg-gray-100 rounded-lg p-3 mb-2 ml-4"
                    >
                      <View className="flex-row justify-between items-center">
                        <Text className="text-gray-600 text-sm">
                          Session {sessionIndex + 1}
                        </Text>
                        <Text className="text-[#6a5f53] font-bold">
                          {formatTime(session.duration)}
                        </Text>
                      </View>
                      <Text className="text-gray-500 text-xs mt-1">
                        {new Date(session.startTime).toLocaleTimeString(
                          "fr-FR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}{" "}
                        -{" "}
                        {new Date(session.endTime).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>
                  ))}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default AnalyticsScreen;