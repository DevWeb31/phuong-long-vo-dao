import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("marketing.courses");

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

const DAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
  all: "Tous niveaux",
};

const LEVEL_COLORS: Record<string, "default" | "primary" | "secondary" | "outline"> = {
  beginner: "secondary",
  intermediate: "primary",
  advanced: "destructive" as "default",
  all: "outline",
};

export default async function CoursesPage() {
  const supabase = await createClient();
  const t = await getTranslations("marketing.courses");

  // Récupérer tous les cours actifs
  const { data: classes } = await supabase
    .from("classes")
    .select(
      `
      *,
      coach:coaches(name),
      location:locations(name, city),
      organization:organizations(name, slug)
    `
    )
    .eq("is_active", true)
    .order("day_of_week")
    .order("start_time");

  // Grouper par niveau
  type ClassType = NonNullable<typeof classes>[number];
  const classesByLevel = classes?.reduce<Record<string, ClassType[]>>(
    (acc, cls) => {
      if (!acc[cls.level]) {
        acc[cls.level] = [];
      }
      acc[cls.level].push(cls);
      return acc;
    },
    {}
  );

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
          {/* Cours par niveau */}
          {classesByLevel &&
            Object.entries(classesByLevel).map(([level, levelClasses], sectionIndex) => (
              <section key={level} className="mb-16">
                <ScrollAnimation animation="fade-in-up" delay={sectionIndex * 100}>
                  <h2 className="mb-8 flex items-center justify-center gap-3 text-3xl font-bold sm:text-4xl">
                    {LEVEL_LABELS[level]}
                    <Badge variant={LEVEL_COLORS[level]} className="text-base px-4 py-1">{levelClasses.length} cours</Badge>
                  </h2>
                </ScrollAnimation>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {levelClasses.map((cls, index) => (
                  <ScrollAnimation 
                    key={cls.id}
                    animation="scale-in"
                    delay={index * 100}
                  >
                    <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{cls.title}</CardTitle>
                      {cls.organization && (
                        <p className="text-sm text-primary">{cls.organization.name}</p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      {cls.description && (
                        <p className="text-muted-foreground">{cls.description}</p>
                      )}

                      <div className="space-y-2 border-t border-border pt-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            {DAYS[cls.day_of_week]} {cls.start_time.slice(0, 5)} -{" "}
                            {cls.end_time.slice(0, 5)}
                          </span>
                        </div>

                        {cls.coach && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <span>{cls.coach.name}</span>
                          </div>
                        )}

                        {cls.location && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <svg
                              className="h-4 w-4"
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
                            <span>
                              {cls.location.name} - {cls.location.city}
                            </span>
                          </div>
                        )}

                        {cls.capacity && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            <span>{cls.capacity} places</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  </ScrollAnimation>
                ))}
              </div>
            </section>
          ))}

          {(!classes || classes.length === 0) && (
            <ScrollAnimation animation="fade-in-up">
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">Aucun cours disponible pour le moment.</p>
              </div>
            </ScrollAnimation>
          )}
        </div>
      </div>
    </div>
  );
}

