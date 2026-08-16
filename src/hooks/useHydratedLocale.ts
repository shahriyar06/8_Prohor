import { useLanguageStore } from "@/store/languageStore";
import { useMounted } from "./useMounted";

export function useHydratedLocale() {
  const locale = useLanguageStore((state) => state.locale);
  const mounted = useMounted();

  return mounted ? locale : "en";
}