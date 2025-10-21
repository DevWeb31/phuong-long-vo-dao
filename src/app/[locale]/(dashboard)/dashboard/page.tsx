import { requireAuth, getUserMemberships } from "@/lib/auth/helpers";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const user = await requireAuth();
  const memberships = await getUserMemberships(user.id);
  const t = await getTranslations("dashboard");

  // Statistiques pour chaque organisation
  const stats = await Promise.all(
    memberships.map(async (membership) => {
      const supabase = await createClient();
      const orgId = membership.organization_id;

      const [
        { count: classesCount },
        { count: coachesCount },
        { count: eventsCount },
        { count: membersCount },
      ] = await Promise.all([
        supabase
          .from("classes")
          .select("*", { count: "exact", head: true })
          .eq("organization_id", orgId),
        supabase
          .from("coaches")
          .select("*", { count: "exact", head: true })
          .eq("organization_id", orgId),
        supabase
          .from("events")
          .select("*", { count: "exact", head: true })
          .eq("organization_id", orgId),
        supabase
          .from("members")
          .select("*", { count: "exact", head: true })
          .eq("organization_id", orgId),
      ]);

      return {
        organization: membership.organization,
        role: membership.role,
        stats: {
          classes: classesCount || 0,
          coaches: coachesCount || 0,
          events: eventsCount || 0,
          members: membersCount || 0,
        },
      };
    })
  );

  return (
    <div className="space-y-8">
      <div className="animate-slide-in-top">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mt-2">
          Bienvenue, <span className="font-medium text-primary">{user.email}</span>
        </p>
      </div>

      {stats.map((stat, index) => (
        <div key={stat.organization.id} className={`animate-fade-in`} style={{ animationDelay: `${index * 100}ms` }}>
          <h2 className="mb-4 text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {stat.organization.name}
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Votre rôle : <span className="font-medium text-accent">{stat.role}</span>
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="martial-hover group h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary group-hover:text-secondary transition-colors duration-300">
                  Membres
                </CardTitle>
                <svg
                  className="h-4 w-4 text-primary group-hover:text-secondary transition-colors duration-300 flex-shrink-0"
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
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary group-hover:text-secondary transition-colors duration-300">
                  {stat.stats.members}
                </div>
              </CardContent>
            </Card>

            <Card className="phoenix-hover group h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-secondary group-hover:text-accent transition-colors duration-300">
                  Cours
                </CardTitle>
                <svg
                  className="h-4 w-4 text-secondary group-hover:text-accent transition-colors duration-300 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary group-hover:text-accent transition-colors duration-300">
                  {stat.stats.classes}
                </div>
              </CardContent>
            </Card>

            <Card className="dragon-hover group h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-accent group-hover:text-tertiary transition-colors duration-300">
                  Événements
                </CardTitle>
                <svg
                  className="h-4 w-4 text-accent group-hover:text-tertiary transition-colors duration-300 flex-shrink-0"
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
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent group-hover:text-tertiary transition-colors duration-300">
                  {stat.stats.events}
                </div>
              </CardContent>
            </Card>

            <Card className="shield-hover group h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-tertiary group-hover:text-primary transition-colors duration-300">
                  Instructeurs
                </CardTitle>
                <svg
                  className="h-4 w-4 text-tertiary group-hover:text-primary transition-colors duration-300 flex-shrink-0"
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
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-tertiary group-hover:text-primary transition-colors duration-300">
                  {stat.stats.coaches}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ))}

      {memberships.length === 0 && (
        <Card className="animate-slide-in-bottom">
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
              <svg
                className="h-8 w-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground">
              Vous n&apos;êtes membre d&apos;aucun club pour le moment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

