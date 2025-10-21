import { createClient } from "@/lib/supabase/server";
import { EventCard } from "@/components/marketing/event-card";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("marketing.events");

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const t = await getTranslations("marketing.events");

  // Événements à venir
  const { data: upcomingEvents } = await supabase
    .from("events")
    .select(
      `
      *,
      organization:organizations(name, slug)
    `
    )
    .eq("status", "published")
    .gte("start_at", new Date().toISOString())
    .order("start_at");

  // Événements passés
  const { data: pastEvents } = await supabase
    .from("events")
    .select(
      `
      *,
      organization:organizations(name, slug)
    `
    )
    .eq("status", "published")
    .lt("start_at", new Date().toISOString())
    .order("start_at", { ascending: false })
    .limit(6);

  return (
    <div className="py-20 md:py-32">
      <div className="container">
        {/* Header */}
        <ScrollAnimation animation="slide-in-blur">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h1 className="mb-5 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">{t("title")}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">{t("subtitle")}</p>
          </div>
        </ScrollAnimation>

        <div className="max-w-7xl mx-auto">
          {/* Événements à venir */}
          {upcomingEvents && upcomingEvents.length > 0 && (
            <section className="mb-20">
              <ScrollAnimation animation="fade-in-up">
                <h2 className="mb-10 text-3xl font-bold text-center sm:text-4xl">{t("upcoming")}</h2>
              </ScrollAnimation>
              <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event, index) => (
                  <ScrollAnimation 
                    key={event.id}
                    animation={index % 2 === 0 ? "fade-in-left" : "fade-in-right"}
                    delay={index * 100}
                  >
                    <EventCard event={event} showOrganization locale={locale} />
                  </ScrollAnimation>
                ))}
              </div>
            </section>
          )}

          {/* Événements passés */}
          {pastEvents && pastEvents.length > 0 && (
            <section>
              <ScrollAnimation animation="fade-in-up">
                <h2 className="mb-10 text-3xl font-bold text-center sm:text-4xl">{t("past")}</h2>
              </ScrollAnimation>
              <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event, index) => (
                  <ScrollAnimation 
                    key={event.id}
                    animation="scale-in"
                    delay={index * 100}
                  >
                    <EventCard event={event} showOrganization locale={locale} />
                  </ScrollAnimation>
                ))}
              </div>
            </section>
          )}

          {(!upcomingEvents || upcomingEvents.length === 0) &&
            (!pastEvents || pastEvents.length === 0) && (
              <ScrollAnimation animation="fade-in-up">
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground">
                    Aucun événement disponible pour le moment. Revenez bientôt !
                  </p>
                </div>
              </ScrollAnimation>
            )}
        </div>
      </div>
    </div>
  );
}

