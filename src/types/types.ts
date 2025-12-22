export type RootStackParamList = {
  Welcome: undefined;
  WhoAmI: undefined;
  Paywall: undefined;
  Ready: undefined;
  Home: undefined;
  Focus: undefined;
  StartingScreen: undefined;
  Analytics: undefined;
};

export interface FocusSession {
  id: string;
  userName: string;
  startTime: number;
  endTime: number;
  duration: number; // in seconds
  date: string; // YYYY-MM-DD format
}

export interface DailyStats {
  date: string;
  totalDuration: number; // in seconds
  sessionCount: number;
  sessions: FocusSession[];
}
