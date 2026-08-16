"use client";

import { NextIntlClientProvider } from "next-intl";
import { useLanguageStore } from "@/store/languageStore";
import enMessages from "@/i18n/messages/en.json";
import bnMessages from "@/i18n/messages/bn.json";

const MESSAGES = { en: enMessages, bn: bnMessages };

export function IntlProviderClient({ children }: { children: React.ReactNode }) {
  const locale = useLanguageStore((state) => state.locale);

  return (
    <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]}>
      {children}
    </NextIntlClientProvider>
  );
}