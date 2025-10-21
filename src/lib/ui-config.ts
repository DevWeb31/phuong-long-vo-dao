/**
 * Configuration des composants UI
 * Centralise les variants, sizes et styles par défaut
 */

export const buttonVariants = {
  default: "bg-foreground text-background hover:bg-foreground/90",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow",
  outline: "border border-input bg-background hover:bg-accent",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow",
} as const;

export const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
} as const;

export const cardVariants = {
  default: "rounded-lg border bg-card text-card-foreground shadow-sm",
  elevated: "rounded-lg border bg-card text-card-foreground shadow-lg",
  flat: "rounded-lg border bg-card text-card-foreground",
} as const;

export const animationDelays = {
  100: "animation-delay-100",
  200: "animation-delay-200", 
  300: "animation-delay-300",
  400: "animation-delay-400",
  500: "animation-delay-500",
} as const;

export const animationTypes = {
  "fade-in": "animate-fade-in",
  "fade-in-up": "animate-fade-in-up",
  "fade-in-left": "animate-fade-in-left", 
  "fade-in-right": "animate-fade-in-right",
  "scale-in": "animate-scale-in",
  "slide-in-blur": "animate-slide-in-blur",
  "float-gentle": "animate-float-gentle",
  "glow-pulse": "animate-glow-pulse",
} as const;
