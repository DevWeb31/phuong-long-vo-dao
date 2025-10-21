import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ClubCard } from "@/components/marketing/club-card";
import { EventCard } from "@/components/marketing/event-card";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("marketing.hero");

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function HomePage() {
  const supabase = await createClient();
  const t = await getTranslations("marketing");

  // Récupérer les clubs actifs
  const { data: clubs } = await supabase
    .from("organizations")
    .select("*")
    .eq("is_active", true)
    .order("name")
    .limit(3);

  // Récupérer les événements à venir
  const { data: events } = await supabase
    .from("events")
    .select(
      `
      *,
      organization:organizations(name, slug)
    `
    )
    .eq("status", "published")
    .gte("start_at", new Date().toISOString())
    .order("start_at")
    .limit(3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-24 md:py-40">
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <ScrollAnimation animation="slide-in-blur">
              <h1 className="mb-8 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl leading-tight">
                {t("hero.title")}
              </h1>
            </ScrollAnimation>
            
            <ScrollAnimation animation="fade-in-up" delay={200}>
              <p className="mb-10 text-xl text-muted-foreground sm:text-2xl leading-relaxed max-w-3xl mx-auto">
                {t("hero.subtitle")}
              </p>
            </ScrollAnimation>
            
            <ScrollAnimation animation="fade-in-up" delay={400}>
              <div className="flex flex-col gap-5 sm:flex-row sm:justify-center">
                <Link href="/clubs">
                  <Button size="lg" variant="primary" className="text-base px-10 py-6 h-auto hover:scale-105 transition-transform duration-300">
                    {t("hero.cta")}
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="text-base px-10 py-6 h-auto hover:scale-105 transition-transform duration-300">
                    {t("hero.ctaSecondary")}
                  </Button>
                </Link>
              </div>
            </ScrollAnimation>
          </div>
        </div>

        {/* Éléments décoratifs */}
        <div className="absolute left-0 top-0 -z-10 h-full w-full">
          <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl animate-float-gentle"></div>
          <div className="absolute right-1/4 top-1/2 h-[600px] w-[600px] rounded-full bg-accent/5 blur-3xl animate-float-gentle" style={{animationDelay: '1.5s'}}></div>
        </div>
      </section>

      {/* Section Clubs */}
      {clubs && clubs.length > 0 && (
        <section className="py-20 md:py-32">
          <div className="container">
            <ScrollAnimation animation="fade-in-up">
              <div className="mb-16 text-center max-w-3xl mx-auto">
                <h2 className="mb-5 text-4xl font-bold tracking-tight sm:text-5xl">
                  {t("clubs.title")}
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">{t("clubs.subtitle")}</p>
              </div>
            </ScrollAnimation>

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {clubs.map((club, index) => (
                <ScrollAnimation 
                  key={club.id} 
                  animation="scale-in" 
                  delay={index * 100}
                >
                  <ClubCard club={club} />
                </ScrollAnimation>
              ))}
            </div>

            <ScrollAnimation animation="fade-in-up" delay={400}>
              <div className="mt-16 text-center">
                <Link href="/clubs">
                  <Button variant="outline" size="lg" className="text-base px-10 py-6 h-auto hover:scale-105 transition-transform duration-300">
                    {t("clubs.viewClub")} →
                  </Button>
                </Link>
              </div>
            </ScrollAnimation>
          </div>
        </section>
      )}

      {/* Section Événements */}
      {events && events.length > 0 && (
        <section className="bg-muted/30 py-20 md:py-32">
          <div className="container">
            <ScrollAnimation animation="fade-in-up">
              <div className="mb-16 text-center max-w-3xl mx-auto">
                <h2 className="mb-5 text-4xl font-bold tracking-tight sm:text-5xl">
                  {t("events.title")}
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">{t("events.subtitle")}</p>
              </div>
            </ScrollAnimation>

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event, index) => (
                <ScrollAnimation 
                  key={event.id} 
                  animation={index % 2 === 0 ? "fade-in-left" : "fade-in-right"}
                  delay={index * 100}
                >
                  <EventCard event={event} showOrganization locale="fr" />
                </ScrollAnimation>
              ))}
            </div>

            <ScrollAnimation animation="fade-in-up" delay={400}>
              <div className="mt-16 text-center">
                <Link href="/events">
                  <Button variant="outline" size="lg" className="text-base px-10 py-6 h-auto hover:scale-105 transition-transform duration-300">
                    {t("common.actions.viewMore")} →
                  </Button>
                </Link>
              </div>
            </ScrollAnimation>
          </div>
        </section>
      )}

      {/* Section CTA */}
      <section className="py-20 md:py-32">
        <div className="container">
          <ScrollAnimation animation="scale-in">
            <div className="rounded-3xl bg-gradient-to-r from-primary via-secondary to-accent p-10 text-center text-primary-foreground md:p-16 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
              <h2 className="mb-6 text-4xl font-bold sm:text-5xl leading-tight">
                Prêt à commencer votre voyage martial ?
              </h2>
              <p className="mb-10 text-xl opacity-95 max-w-2xl mx-auto leading-relaxed">
                Rejoignez l&apos;un de nos clubs et découvrez la richesse du Vo Dao vietnamien.
              </p>
              <div className="flex flex-col gap-5 sm:flex-row sm:justify-center">
                <Link href="/clubs">
                  <Button size="lg" variant="secondary" className="text-base px-10 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                    Trouver un club
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-2 border-primary hover:bg-primary hover:text-primary-foreground dark:border-white dark:hover:bg-white/10 text-base px-10 py-6 h-auto font-semibold transition-all duration-300 hover:scale-110" style={{ color: 'hsl(var(--foreground))' }}>
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}

