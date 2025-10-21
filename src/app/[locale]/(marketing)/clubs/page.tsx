import { createClient } from "@/lib/supabase/server";
import { ClubCard } from "@/components/marketing/club-card";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("marketing.clubs");

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function ClubsPage() {
  const supabase = await createClient();
  const t = await getTranslations("marketing.clubs");

  const { data: clubs } = await supabase
    .from("organizations")
    .select("*")
    .eq("is_active", true)
    .order("name");

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

        {/* Clubs Grid */}
        {clubs && clubs.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
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
        ) : (
          <ScrollAnimation animation="fade-in-up">
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">{t("noClubs")}</p>
            </div>
          </ScrollAnimation>
        )}
      </div>
    </div>
  );
}

