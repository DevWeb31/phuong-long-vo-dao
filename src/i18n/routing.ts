import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // Liste des locales supportées
  locales: ["fr", "en"],

  // Locale par défaut
  defaultLocale: "fr",

  // Utiliser le préfixe pour toutes les locales
  localePrefix: "always",
});

// Navigation helpers typés
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

