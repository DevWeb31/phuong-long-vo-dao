import { Event } from "@/types/database.types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import { Link } from "@/i18n/routing";

interface EventCardProps {
  event: Event & {
    organization?: {
      name: string;
      slug: string;
    };
  };
  showOrganization?: boolean;
  locale: string;
}

export function EventCard({ event, showOrganization = false }: EventCardProps) {
  const isUpcoming = new Date(event.start_at) > new Date();

  const statusColors = {
    draft: "outline",
    published: "primary",
    cancelled: "destructive",
    completed: "outline",
  } as const;

  return (
    <Card className="overflow-hidden transition-all duration-300 phoenix-hover group relative h-full">
      {/* Effet de fond avec les couleurs du logo */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
        <div className="absolute inset-0 phoenix-gradient"></div>
      </div>
      
      {event.cover_url && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={event.cover_url}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute right-2 top-2">
            <Badge 
              variant={statusColors[event.status]} 
              className={`transition-all duration-300 ${
                event.status === 'published' ? 'bg-primary/90 hover:bg-primary' : 
                event.status === 'cancelled' ? 'bg-destructive/90 hover:bg-destructive' :
                'bg-secondary/90 hover:bg-secondary'
              }`}
            >
              {event.status}
            </Badge>
          </div>
        </div>
      )}

      <CardContent className="p-6 relative z-10 flex-1 flex flex-col">
        {showOrganization && event.organization && (
          <p className="mb-2 text-sm font-medium text-primary transition-colors duration-300 group-hover:text-secondary">
            {event.organization.name}
          </p>
        )}

        <h3 className="mb-2 text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:from-secondary group-hover:to-accent transition-all duration-300">
          {event.title}
        </h3>

        <div className="mb-4 space-y-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-accent transition-colors duration-300 group-hover:text-tertiary flex-shrink-0"
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
            <span className="transition-colors duration-300 group-hover:text-foreground">
              {formatDateTime(event.start_at)}
            </span>
          </p>

          {event.capacity && (
            <p className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-primary transition-colors duration-300 group-hover:text-secondary flex-shrink-0"
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
              <span className="transition-colors duration-300 group-hover:text-foreground">
                {event.capacity} places
              </span>
            </p>
          )}

          {event.price !== null && event.price > 0 && (
            <p className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-tertiary transition-colors duration-300 group-hover:text-accent flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="transition-colors duration-300 group-hover:text-foreground font-semibold">
                {event.price.toFixed(2)} €
              </span>
            </p>
          )}
        </div>

        {event.description && (
          <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground flex-1">
            {event.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0 relative z-10">
        <Link href={`/events/${event.slug}`} className="w-full">
          <Button 
            className={`w-full transition-all duration-300 transform group-hover:scale-105 ${
              isUpcoming 
                ? "phoenix-gradient hover:shadow-lg hover:shadow-secondary/25" 
                : "shield-gradient hover:shadow-lg hover:shadow-accent/25"
            }`}
            variant={isUpcoming ? "primary" : "outline"}
          >
            {isUpcoming ? "S'inscrire" : "Voir les détails"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

