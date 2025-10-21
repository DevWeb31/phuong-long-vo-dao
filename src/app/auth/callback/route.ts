import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Route de callback pour l'authentification par magic link
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const origin = requestUrl.origin;

  // Gérer les erreurs d'authentification
  if (error) {
    console.error("Auth error:", error, errorDescription);
    // Rediriger vers la page de connexion avec un message d'erreur
    return NextResponse.redirect(`${origin}/fr/sign-in?error=${error}`);
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error("Exchange error:", exchangeError);
        return NextResponse.redirect(`${origin}/fr/sign-in?error=exchange_failed`);
      }
    } catch (err) {
      console.error("Auth callback error:", err);
      return NextResponse.redirect(`${origin}/fr/sign-in?error=callback_failed`);
    }
  }

  // Rediriger vers le dashboard après authentification réussie
  return NextResponse.redirect(`${origin}/fr/dashboard`);
}

