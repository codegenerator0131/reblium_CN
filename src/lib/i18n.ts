import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import your translation files
import enCommon from "../locales/en/common.json";
import jaCommon from "../locales/ja/common.json";
import nlCommon from "../locales/nl/common.json";
import zhCommon from "../locales/zh/common.json";

const resources = {
  en: {
    common: enCommon,
  },
  ja: {
    common: jaCommon,
  },
  nl: {
    common: nlCommon,
  },
  zh: {
    common: zhCommon,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",

    interpolation: {
      escapeValue: false,
    },

    defaultNS: "common",
    ns: ["common"],
  });

export default i18n;
