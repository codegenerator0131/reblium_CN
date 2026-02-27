"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../lib/i18n"; // Import i18n configuration

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (language: string) => void;
  languages: Array<{ code: string; name: string; flag: string }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState("English");

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  ];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    const language = languages.find((lang) => lang.code === languageCode);
    if (language) {
      setCurrentLanguage(language.name);
      localStorage.setItem("selectedLanguage", languageCode);
    }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage") || "en";
    const language = languages.find((lang) => lang.code === savedLanguage);
    if (language) {
      setCurrentLanguage(language.name);
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider
      value={{ currentLanguage, changeLanguage, languages }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
