"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  translations,
  type Language,
  type Translations,
} from "@/locales/translations";

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  // `text` holds the active language strings (clearer than the usual `t`).
  text: Translations;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);
const STORAGE_KEY = "shopnova_language";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");

  // Restore the chosen language on first mount.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "es" || saved === "en" || saved === "pt") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (next: Language) => {
    localStorage.setItem(STORAGE_KEY, next);
    setLanguageState(next);
  };

  const value: I18nContextValue = {
    language,
    setLanguage,
    text: translations[language],
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return ctx;
}
