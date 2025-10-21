import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";

export const metadata: Metadata = {
  title: {
    template: "%s | Phuong Long Vo Dao",
    default: "Phuong Long Vo Dao - Arts Martiaux Vietnamiens en France",
  },
  description:
    "Découvrez l'art martial vietnamien Phuong Long Vo Dao. 5 clubs en France proposant des cours pour tous âges et tous niveaux.",
  keywords: [
    "vo dao",
    "arts martiaux",
    "vietnam",
    "phuong long",
    "kung fu",
    "self-défense",
    "france",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          defaultTheme="system"
          storageKey="phuong-long-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
