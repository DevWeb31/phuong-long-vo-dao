/**
 * Constantes globales du projet Phuong Long Vo Dao
 */

// Configuration de l'application
export const APP_CONFIG = {
  name: "Phuong Long Vo Dao",
  description: "Fédération française de Vo Dao vietnamien",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locales: ["fr", "en"] as const,
  defaultLocale: "fr" as const,
} as const;

// Configuration des thèmes
export const THEME_CONFIG = {
  storageKey: "phuong-long-theme",
  defaultTheme: "system" as const,
  themes: ["light", "dark", "system"] as const,
} as const;

// Configuration des couleurs martiales
export const MARTIAL_COLORS = {
  primary: "Dragon Red", // Rouge Dragon (Long)
  secondary: "Phoenix Blue", // Bleu Phoenix (Phượng) 
  accent: "Shield Green", // Vert Shield
  tertiary: "Vietnam Yellow", // Jaune Vietnam
} as const;

// Configuration des animations
export const ANIMATION_CONFIG = {
  defaultDuration: 300,
  staggerDelay: 100,
  scrollThreshold: 0.1,
  once: true,
} as const;

// Configuration des pages
export const PAGE_CONFIG = {
  itemsPerPage: 12,
  maxFeaturedItems: 3,
  maxRecentItems: 6,
} as const;

// Configuration des rôles utilisateur
export const USER_ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin", 
  MODERATOR: "moderator",
  INSTRUCTOR: "instructor",
  MEMBER: "member",
} as const;

// Configuration des niveaux de cours
export const COURSE_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate", 
  ADVANCED: "advanced",
  EXPERT: "expert",
} as const;

// Configuration des statuts
export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  PUBLISHED: "published",
  DRAFT: "draft",
} as const;
