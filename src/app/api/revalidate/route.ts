import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * API route pour la revalidation manuelle du cache
 * Utilisé pour invalider le cache après des mises à jour de contenu
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, tag } = body;

    // Vérifier le token de sécurité (optionnel mais recommandé)
    const token = request.headers.get("authorization");
    if (token !== `Bearer ${process.env.REVALIDATE_TOKEN}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (path) {
      revalidatePath(path);
    }

    if (tag) {
      revalidateTag(tag);
    }

    return NextResponse.json({
      revalidated: true,
      path,
      tag,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating", error: String(err) },
      { status: 500 }
    );
  }
}

