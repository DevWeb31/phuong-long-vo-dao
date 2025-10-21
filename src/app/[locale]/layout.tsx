import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
