import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Middleware pour gérer l'authentification et l'internationalisation
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request,
  });

  // 1. Gérer la session Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Protéger les routes dashboard et admin
  if (request.nextUrl.pathname.includes("/dashboard") || 
      request.nextUrl.pathname.includes("/api/admin")) {
    if (!user) {
      const locale = request.nextUrl.pathname.split("/")[1];
      return NextResponse.redirect(new URL(`/${locale}/sign-in`, request.url));
    }
  }

  // 3. Rediriger les utilisateurs connectés loin des pages auth
  if (user && (
    request.nextUrl.pathname.includes("/sign-in") || 
    request.nextUrl.pathname.includes("/sign-up")
  )) {
    const locale = request.nextUrl.pathname.split("/")[1];
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // 4. Gérer l'i18n avec next-intl
  const intlMiddleware = createMiddleware(routing);
  const intlResponse = intlMiddleware(request);
  
  // Fusionner les cookies de Supabase avec la réponse i18n
  if (intlResponse) {
    response.cookies.getAll().forEach((cookie) => {
      intlResponse.cookies.set(cookie.name, cookie.value);
    });
    return intlResponse;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

