/** @format */

"use client";
import { publicInstance } from "@/configs/axiosConfig";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

interface Locale {
  name: string;
  code: string;
}
interface TranslationContextType {
  translations: Record<string, string>;
  locale: Locale;
  setLanguage: (language: Locale) => void;
  tran: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined,
);

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
}) => {
  const [locale, setLocale] = useState<Locale>({
    name: "English",
    code: "en",
  });

  const [translations, setTranslations] = useState<Record<string, string>>({});

  const getTranslations = React.useCallback(async (langCode: string) => {
    try {
      const response = await publicInstance.get(`/lang/${langCode}`);
      if (response?.data?.data) {
        setTranslations(response.data.data);
      }
    } catch (error) {
      setTranslations({});
      console.warn(error);
    }
  }, []);

  const setLanguage = React.useCallback(
    (language: Locale) => {
      setLocale(language);
      localStorage.setItem("language", JSON.stringify(language));
      getTranslations(language.code);
    },
    [getTranslations],
  );

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(JSON.parse(storedLanguage) as Locale);
    }
  }, [setLanguage]);

  const tran = React.useCallback(
    (key: string) => {
      if (!translations) return key;
      return translations[key] || key;
    },
    [translations],
  );

  const contextValue = React.useMemo(
    () => ({ translations, locale, setLanguage, tran }),
    [translations, locale, setLanguage, tran],
  );

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

// Custom hook to use the translation context
export const useTranslations = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error(
      "useTranslations must be used within a TranslationProvider",
    );
  }
  return context;
};
