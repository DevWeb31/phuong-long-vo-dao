import { createClient } from "@/lib/supabase/server";
import { UserRole } from "@/types/database.types";
import { redirect } from "next/navigation";

/**
 * Récupère l'utilisateur actuel côté serveur
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Récupère la session côté serveur
 */
export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Vérifie si l'utilisateur est authentifié
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return user;
}

/**
 * Récupère les memberships de l'utilisateur
 */
export async function getUserMemberships(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select(
      `
      *,
      organization:organizations(*)
    `
    )
    .eq("user_id", userId)
    .eq("status", "active");

  if (error) {
    console.error("Error fetching memberships:", error);
    return [];
  }

  return data || [];
}

/**
 * Vérifie si l'utilisateur a un rôle spécifique dans une organisation
 */
export async function hasRole(
  userId: string,
  organizationId: string,
  roles: UserRole[]
): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("members")
    .select("role")
    .eq("user_id", userId)
    .eq("organization_id", organizationId)
    .eq("status", "active")
    .single();

  if (!data) return false;

  return roles.includes(data.role as UserRole);
}

/**
 * Vérifie si l'utilisateur est superadmin
 */
export async function isSuperAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("members")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "superadmin")
    .eq("status", "active")
    .single();

  return !!data;
}

