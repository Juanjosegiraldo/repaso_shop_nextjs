import { es } from "@/locales/es";
import { en } from "@/locales/en";
import { pt } from "@/locales/pt";

export type Language = "es" | "en" | "pt";

// The Spanish object defines the required shape for every language.
export type Translations = typeof es;

// Record<Language, Translations> makes the compiler reject any language
// that is missing a key, keeping the three files in sync.
export const translations: Record<Language, Translations> = { es, en, pt };
