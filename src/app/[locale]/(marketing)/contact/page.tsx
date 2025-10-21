"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("marketing.contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simuler l'envoi du formulaire
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitted(true);

    // Réinitialiser après 3 secondes
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="py-20 md:py-32">
      <div className="container max-w-5xl">
        {/* Header */}
        <ScrollAnimation animation="slide-in-blur">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h1 className="mb-5 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">{t("title")}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">{t("subtitle")}</p>
          </div>
        </ScrollAnimation>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Formulaire de contact */}
          <ScrollAnimation animation="fade-in-left" className="lg:col-span-2">
            <Card className="h-full">
            <CardHeader>
              <CardTitle>Envoyez-nous un message</CardTitle>
              <CardDescription>
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs
                délais.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="rounded-lg bg-primary/10 p-6 text-center">
                  <svg
                    className="mx-auto mb-4 h-12 w-12 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-lg font-medium">{t("form.success")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("form.name")}</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("form.email")}</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("form.phone")}</Label>
                      <Input id="phone" name="phone" type="tel" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="club">{t("form.club")}</Label>
                      <select
                        id="club"
                        name="club"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Sélectionnez un club</option>
                        <option value="paris">Paris</option>
                        <option value="lyon">Lyon</option>
                        <option value="marseille">Marseille</option>
                        <option value="toulouse">Toulouse</option>
                        <option value="lille">Lille</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t("form.message")}</Label>
                    <Textarea id="message" name="message" rows={6} required />
                  </div>

                  <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Envoi en cours..." : t("form.send")}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
          </ScrollAnimation>

          {/* Informations de contact */}
          <ScrollAnimation animation="fade-in-right" delay={200}>
            <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href="mailto:contact@phuonglong-vodao.fr"
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      contact@phuonglong-vodao.fr
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">Horaires</p>
                    <p className="text-sm text-muted-foreground">
                      Lun - Sam: 9h - 21h
                      <br />
                      Dim: 9h - 13h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Réseaux sociaux</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>Instagram</span>
                </a>
              </CardContent>
            </Card>
          </div>
          </ScrollAnimation>
        </div>
      </div>
    </div>
  );
}

