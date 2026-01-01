import AsyncStorage from "@react-native-async-storage/async-storage";
import { FocusSession, DailyStats } from "../types/types";

// Clés de stockage
const STORAGE_KEYS = {
  SESSIONS: "@focus_sessions",
  ANALYTICS_HISTORY: "@analytics_history",
  LAST_SYNC: "@analytics_last_sync",
};

// Types pour l'historique
interface AnalyticsHistory {
  totalSessions: number;
  totalTime: number;
  totalDays: number;
  lastUpdated: string;
  sessions: FocusSession[];
  dailyStats: DailyStats[];
}

/**
 * Sauvegarde l'historique complet des analytics
 */
export async function saveAnalyticsHistory(
  sessions: FocusSession[],
  dailyStats: DailyStats[],
  totalTime: number
): Promise<boolean> {
  try {
    const history: AnalyticsHistory = {
      totalSessions: sessions.length,
      totalTime: totalTime,
      totalDays: dailyStats.length,
      lastUpdated: new Date().toISOString(),
      sessions: sessions,
      dailyStats: dailyStats,
    };

    await AsyncStorage.setItem(
      STORAGE_KEYS.ANALYTICS_HISTORY,
      JSON.stringify(history)
    );

    await AsyncStorage.setItem(
      STORAGE_KEYS.LAST_SYNC,
      new Date().toISOString()
    );

    console.log("✅ Historique des analytics sauvegardé");
    return true;
  } catch (error) {
    console.error("❌ Erreur lors de la sauvegarde de l'historique:", error);
    return false;
  }
}

/**
 * Récupère l'historique complet des analytics
 */
export async function getAnalyticsHistory(): Promise<AnalyticsHistory | null> {
  try {
    const historyData = await AsyncStorage.getItem(
      STORAGE_KEYS.ANALYTICS_HISTORY
    );

    if (!historyData) {
      console.log("ℹ️ Aucun historique trouvé");
      return null;
    }

    const history: AnalyticsHistory = JSON.parse(historyData);
    console.log("✅ Historique récupéré:", history.totalSessions, "sessions");
    return history;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération de l'historique:", error);
    return null;
  }
}

/**
 * Ajoute une nouvelle session à l'historique existant
 */
export async function addSessionToHistory(
  newSession: FocusSession
): Promise<boolean> {
  try {
    // Récupérer les sessions existantes
    const sessionsData = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
    let sessions: FocusSession[] = sessionsData
      ? JSON.parse(sessionsData)
      : [];

    // Ajouter la nouvelle session
    sessions.push(newSession);

    // Sauvegarder
    await AsyncStorage.setItem(
      STORAGE_KEYS.SESSIONS,
      JSON.stringify(sessions)
    );

    console.log("✅ Nouvelle session ajoutée à l'historique");
    return true;
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de la session:", error);
    return false;
  }
}

/**
 * Calcule les statistiques à partir des sessions
 */
export function calculateDailyStats(sessions: FocusSession[]): {
  dailyStats: DailyStats[];
  totalTime: number;
} {
  const grouped: { [key: string]: FocusSession[] } = {};
  let totalTime = 0;

  sessions.forEach((session) => {
    if (!grouped[session.date]) {
      grouped[session.date] = [];
    }
    grouped[session.date].push(session);
    totalTime += session.duration;
  });

  const dailyStats: DailyStats[] = Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a))
    .map((date) => {
      const daySessions = grouped[date];
      const totalDuration = daySessions.reduce((sum, s) => sum + s.duration, 0);
      return {
        date,
        totalDuration,
        sessionCount: daySessions.length,
        sessions: daySessions,
      };
    });

  return { dailyStats, totalTime };
}

/**
 * Supprime l'historique complet (pour reset)
 */
export async function clearAnalyticsHistory(): Promise<boolean> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.SESSIONS,
      STORAGE_KEYS.ANALYTICS_HISTORY,
      STORAGE_KEYS.LAST_SYNC,
    ]);

    console.log("✅ Historique supprimé");
    return true;
  } catch (error) {
    console.error("❌ Erreur lors de la suppression:", error);
    return false;
  }
}

/**
 * Obtient la date de la dernière synchronisation
 */
export async function getLastSyncDate(): Promise<string | null> {
  try {
    const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    return lastSync;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération de la date de sync:", error);
    return null;
  }
}

/**
 * Exporte les données en format JSON (pour backup)
 */
export async function exportAnalyticsData(): Promise<string | null> {
  try {
    const history = await getAnalyticsHistory();
    if (!history) {
      return null;
    }

    return JSON.stringify(history, null, 2);
  } catch (error) {
    console.error("❌ Erreur lors de l'export:", error);
    return null;
  }
}

/**
 * Importe des données depuis un backup
 */
export async function importAnalyticsData(
  jsonData: string
): Promise<boolean> {
  try {
    const history: AnalyticsHistory = JSON.parse(jsonData);

    // Valider les données
    if (!history.sessions || !Array.isArray(history.sessions)) {
      throw new Error("Format de données invalide");
    }

    await AsyncStorage.setItem(
      STORAGE_KEYS.ANALYTICS_HISTORY,
      JSON.stringify(history)
    );

    await AsyncStorage.setItem(
      STORAGE_KEYS.SESSIONS,
      JSON.stringify(history.sessions)
    );

    console.log("✅ Données importées avec succès");
    return true;
  } catch (error) {
    console.error("❌ Erreur lors de l'import:", error);
    return false;
  }
}

/**
 * Obtient les statistiques pour une période spécifique
 */
export async function getStatsByDateRange(
  startDate: string,
  endDate: string
): Promise<DailyStats[]> {
  try {
    const history = await getAnalyticsHistory();
    if (!history) {
      return [];
    }

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    return history.dailyStats.filter((stat) => {
      const statDate = new Date(stat.date).getTime();
      return statDate >= start && statDate <= end;
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération par période:", error);
    return [];
  }
}