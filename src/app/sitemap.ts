import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const supabase = await createClient();

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/fr`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/fr/clubs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/fr/events`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fr/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Pages dynamiques - Clubs
  const { data: clubs } = await supabase
    .from("organizations")
    .select("slug, updated_at")
    .eq("is_active", true);

  const clubPages: MetadataRoute.Sitemap =
    clubs?.map((club) => ({
      url: `${baseUrl}/fr/clubs/${club.slug}`,
      lastModified: new Date(club.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })) || [];

  // Pages dynamiques - Événements
  const { data: events } = await supabase
    .from("events")
    .select("slug, organization_id, updated_at")
    .eq("status", "published");

  const eventPages: MetadataRoute.Sitemap =
    events?.map((event) => ({
      url: `${baseUrl}/fr/events/${event.slug}`,
      lastModified: new Date(event.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) || [];

  return [...staticPages, ...clubPages, ...eventPages];
}

