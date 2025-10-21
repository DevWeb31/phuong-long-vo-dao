/**
 * Configuration des métadonnées pour Phuong Long Vo Dao
 */

export const siteConfig = {
  name: "Phuong Long Vo Dao",
  description: "Fédération française de Vo Dao vietnamien - Arts martiaux traditionnels",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/images/og-image.jpg",
  links: {
    twitter: "https://twitter.com/phuonglongvodao",
    facebook: "https://facebook.com/phuonglongvodao",
    instagram: "https://instagram.com/phuonglongvodao",
    youtube: "https://youtube.com/phuonglongvodao",
  },
  keywords: [
    "Vo Dao",
    "Arts martiaux vietnamiens",
    "Phuong Long",
    "Kung Fu",
    "Vietnam",
    "Fédération française",
    "Arts martiaux traditionnels",
    "Self-défense",
    "Philosophie martiale",
  ],
  authors: [
    {
      name: "Phuong Long Vo Dao",
      url: "https://phuonglongvodao.fr",
    },
  ],
  creator: "Phuong Long Vo Dao",
  publisher: "Phuong Long Vo Dao",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    title: "Phuong Long Vo Dao - Fédération française de Vo Dao vietnamien",
    description: "Découvrez les arts martiaux vietnamiens traditionnels avec Phuong Long Vo Dao. Cours, événements et philosophie martiale.",
    siteName: "Phuong Long Vo Dao",
  },
  twitter: {
    card: "summary_large_image",
    title: "Phuong Long Vo Dao - Arts martiaux vietnamiens",
    description: "Fédération française de Vo Dao vietnamien",
    creator: "@phuonglongvodao",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
} as const;

export type SiteConfig = typeof siteConfig;
