import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CoachCard } from "@/components/marketing/coach-card";
import { Schedule } from "@/components/marketing/schedule";
import { FacebookEmbed } from "@/components/shared/facebook-embed";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import Image from "next/image";

interface Props {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: club } = await supabase
    .from("organizations")
    .select("name, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!club) {
    return {
      title: "Club introuvable",
    };
  }

  return {
    title: club.name,
    description: club.description || undefined,
  };
}

export default async function ClubPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Récupérer les détails du club
  const { data: club } = await supabase
    .from("organizations")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!club) {
    notFound();
  }

  // Récupérer les lieux
  const { data: locations } = await supabase
    .from("locations")
    .select("*")
    .eq("organization_id", club.id)
    .eq("is_active", true)
    .order("name");

  // Récupérer les coaches
  const { data: coaches } = await supabase
    .from("coaches")
    .select("*")
    .eq("organization_id", club.id)
    .eq("is_active", true)
    .order("name");

  // Récupérer les cours
  const { data: classes } = await supabase
    .from("classes")
    .select(
      `
      *,
      coach:coaches(name),
      location:locations(name)
    `
    )
    .eq("organization_id", club.id)
    .eq("is_active", true)
    .order("day_of_week")
    .order("start_time");

  const hasFacebookGroup = club.facebook_group_url;
  const hasFacebookPage = club.facebook_page_url;

  return (
    <div>
      {/* Hero avec cover */}
      {club.cover_url && (
        <div className="relative h-64 w-full md:h-96">
          <Image
            src={club.cover_url}
            alt={club.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      <div className="container py-12">
        {/* En-tête du club */}
        <div className="mb-12">
          <div className="flex items-start gap-6">
            {club.logo_url && (
              <Image
                src={club.logo_url}
                alt={club.name}
                width={120}
                height={120}
                className="rounded-lg"
              />
            )}
            <div className="flex-1">
              <h1 className="mb-4 text-4xl font-bold">{club.name}</h1>
              {club.description && <p className="text-lg text-muted-foreground">{club.description}</p>}
            </div>
          </div>

          {/* Coordonnées */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {club.address && (
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <p className="font-medium">Adresse</p>
                  <p className="text-sm text-muted-foreground">
                    {club.address}
                    <br />
                    {club.postal_code} {club.city}
                  </p>
                </div>
              </div>
            )}

            {club.phones.length > 0 && (
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div>
                  <p className="font-medium">Téléphone</p>
                  {club.phones.map((phone: string, i: number) => (
                    <a
                      key={i}
                      href={`tel:${phone}`}
                      className="block text-sm text-muted-foreground hover:text-primary"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {club.emails.length > 0 && (
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
                  {club.emails.map((email: string, i: number) => (
                    <a
                      key={i}
                      href={`mailto:${email}`}
                      className="block text-sm text-muted-foreground hover:text-primary"
                    >
                      {email}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Planning des cours */}
        {classes && classes.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-3xl font-bold">Planning des cours</h2>
            <Schedule classes={classes} />
          </section>
        )}

        {/* Équipe de coaches */}
        {coaches && coaches.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-3xl font-bold">Notre équipe</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {coaches.map((coach) => (
                <CoachCard key={coach.id} coach={coach} />
              ))}
            </div>
          </section>
        )}

        {/* Lieux d'entraînement */}
        {locations && locations.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-3xl font-bold">Lieux d&apos;entraînement</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className="rounded-lg border border-border bg-card p-6"
                >
                  <h3 className="mb-2 text-xl font-semibold">{location.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {location.address}
                    <br />
                    {location.postal_code} {location.city}
                  </p>
                  {location.description && (
                    <p className="mt-3 text-sm">{location.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Facebook Integration */}
        {(hasFacebookGroup || hasFacebookPage) && (
          <section className="mb-12">
            <h2 className="mb-6 text-3xl font-bold">Rejoignez notre communauté</h2>
            <div className="flex justify-center">
              {hasFacebookGroup ? (
                <FacebookEmbed type="group" url={club.facebook_group_url!} />
              ) : hasFacebookPage ? (
                <FacebookEmbed type="page" url={club.facebook_page_url!} />
              ) : null}
            </div>
          </section>
        )}

        {/* CTA Contact */}
        <section className="rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Intéressé par nos cours ?</h2>
          <p className="mb-6 text-muted-foreground">
            Contactez-nous pour plus d&apos;informations ou pour vous inscrire à un cours
            d&apos;essai gratuit.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            {club.phones.length > 0 && (
              <a href={`tel:${club.phones[0]}`}>
                <Button variant="primary">Nous appeler</Button>
              </a>
            )}
            {club.emails.length > 0 && (
              <a href={`mailto:${club.emails[0]}`}>
                <Button variant="outline">Nous écrire</Button>
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

