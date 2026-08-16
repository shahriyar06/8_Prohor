import { create } from "zustand";
import Cookies from "js-cookie";

type Locale = "en" | "bn";

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  locale: (Cookies.get("locale") as Locale) || "en",
  setLocale: (locale) => {
    Cookies.set("locale", locale, { expires: 365 });
    set({ locale });
  },
}));