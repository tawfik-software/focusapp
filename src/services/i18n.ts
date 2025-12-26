import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../locales/en.json';
import fr from '../locales/fr.json';
import it from '../locales/it.json';
import ar from '../locales/ar.json';
import es from '../locales/es.json';

const LANGUAGE_STORAGE_KEY = '@app_language';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  it: { translation: it },
  ar: { translation: ar },
  es: { translation: es },
};

// Get device language
const getDeviceLanguage = () => {
  const locales = Localization.getLocales();
  if (locales && locales.length > 0) {
    const languageCode = locales[0].languageCode;
    // Map language codes to supported languages
    if (languageCode === 'fr') return 'fr';
    if (languageCode === 'it') return 'it';
    if (languageCode === 'ar') return 'ar';
    if (languageCode === 'es') return 'es';
  }
  return 'en'; // Default to English
};

// Initialize i18n
const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  
  if (!savedLanguage) {
    savedLanguage = getDeviceLanguage();
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, savedLanguage);
  }

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
};

initI18n();

// Function to change language
export const changeLanguage = async (languageCode: string) => {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
  await i18n.changeLanguage(languageCode);
};

// Function to get current language
export const getCurrentLanguage = () => {
  return i18n.language;
};

export default i18n;
