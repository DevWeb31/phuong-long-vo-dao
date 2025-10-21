"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const t = useTranslations("auth.signIn");
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Vérifier les erreurs dans l'URL
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      let errorMessage = "Une erreur est survenue lors de la connexion.";
      
      switch (error) {
        case "otp_expired":
          errorMessage = "Le lien magique a expiré. Veuillez en demander un nouveau.";
          break;
        case "access_denied":
          errorMessage = "Accès refusé. Veuillez réessayer.";
          break;
        case "exchange_failed":
          errorMessage = "Échec de l'échange de code. Veuillez réessayer.";
          break;
        case "callback_failed":
          errorMessage = "Erreur lors du callback d'authentification.";
          break;
        default:
          errorMessage = `Erreur: ${error}`;
      }
      
      setMessage({ type: "error", text: errorMessage });
    }
  }, [searchParams]);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/fr/auth/callback`,
      },
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: t("success") });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-bold text-white">
            PL
          </div>
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {message && (
              <div
                className={`rounded-lg p-3 text-sm ${
                  message.type === "success"
                    ? "bg-primary/10 text-primary"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {message.text}
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
              {isLoading ? "Envoi en cours..." : t("magicLink")}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">{t("noAccount")} </span>
            <Link href="/sign-up" className="text-primary hover:underline">
              {t("signUp")}
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

