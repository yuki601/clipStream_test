import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageCode } from '@/constants/languages';
import { getTranslation, Translation } from '@/constants/i18n';

const LANGUAGE_STORAGE_KEY = 'app_language';

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [translations, setTranslations] = useState<Translation>(getTranslation('en'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage) {
        const languageCode = savedLanguage as LanguageCode;
        setCurrentLanguage(languageCode);
        setTranslations(getTranslation(languageCode));
      }
    } catch (error) {
      console.error('Error loading saved language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (languageCode: LanguageCode) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
      setCurrentLanguage(languageCode);
      setTranslations(getTranslation(languageCode));
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  return {
    currentLanguage,
    translations,
    changeLanguage,
    isLoading,
  };
}