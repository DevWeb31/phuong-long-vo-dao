import { Class } from "@/types/database.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScheduleProps {
  classes: (Class & {
    coach?: { name: string } | null;
    location?: { name: string } | null;
  })[];
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

export function Schedule({ classes }: ScheduleProps) {
  // Grouper les cours par jour
  const classesByDay = classes.reduce(
    (acc, cls) => {
      if (!acc[cls.day_of_week]) {
        acc[cls.day_of_week] = [];
      }
      acc[cls.day_of_week].push(cls);
      return acc;
    },
    {} as Record<number, typeof classes>
  );

  // Trier les cours par heure de début
  Object.keys(classesByDay).forEach((day) => {
    classesByDay[parseInt(day)].sort((a, b) =>
      a.start_time.localeCompare(b.start_time)
    );
  });

  return (
    <div className="space-y-6">
      {Object.entries(classesByDay)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([day, dayClasses]) => (
          <Card key={day}>
            <CardHeader>
              <CardTitle className="text-xl">{DAYS[parseInt(day)]}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dayClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="flex flex-col gap-2 rounded-lg border border-border p-4 transition-colors hover:bg-accent/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold">{cls.title}</h4>
                        <Badge variant={LEVEL_COLORS[cls.level]}>
                          {LEVEL_LABELS[cls.level]}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>
                            {cls.start_time.slice(0, 5)} - {cls.end_time.slice(0, 5)}
                          </span>
                        </p>

                        {cls.coach && (
                          <p className="flex items-center gap-2">
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
                          </p>
                        )}

                        {cls.location && (
                          <p className="flex items-center gap-2">
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
                            <span>{cls.location.name}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {cls.capacity && (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">{cls.capacity}</span> places
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}

