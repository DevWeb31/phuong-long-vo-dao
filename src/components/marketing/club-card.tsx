import { Organization } from "@/types/database.types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from "@/i18n/routing";

interface ClubCardProps {
  club: Organization;
}

export function ClubCard({ club }: ClubCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-500 martial-hover group relative h-full hover:shadow-2xl hover:shadow-primary/10 border-2 border-transparent hover:border-primary/20">
      {/* Effet de fond avec les couleurs du logo */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
        <div className="absolute inset-0 martial-gradient"></div>
      </div>
      
      <div className="relative h-56 w-full bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 overflow-hidden">
        {club.cover_url ? (
          <Image
            src={club.cover_url}
            alt={club.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : club.logo_url ? (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
            <Image
              src={club.logo_url}
              alt={club.name}
              width={140}
              height={140}
              className="object-contain transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-xl"
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-7xl font-bold text-primary/30 transition-all duration-500 group-hover:text-primary/50 group-hover:scale-110">
              {club.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        
        {/* Overlay avec effet martial */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      <CardContent className="p-7 relative z-10 flex-1 flex flex-col gap-4">
        <h3 className="mb-1 text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:from-secondary group-hover:to-accent transition-all duration-500">
          {club.name}
        </h3>

        {club.city && (
          <p className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <svg
              className="h-4 w-4 text-accent transition-colors duration-500 group-hover:text-tertiary flex-shrink-0"
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
            <span className="transition-colors duration-500 group-hover:text-foreground font-medium">
              {club.city}
              {club.postal_code && ` (${club.postal_code})`}
            </span>
          </p>
        )}

        {club.description && (
          <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed transition-colors duration-500 group-hover:text-foreground/90 flex-1">
            {club.description}
          </p>
        )}

        {(club.phones.length > 0 || club.emails.length > 0) && (
          <div className="space-y-1 border-t border-border pt-4 text-sm mt-auto">
            {club.phones.length > 0 && (
              <p className="flex items-center gap-2 text-muted-foreground">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href={`tel:${club.phones[0]}`}
                  className="hover:text-primary hover:underline transition-all duration-300"
                >
                  {club.phones[0]}
                </a>
              </p>
            )}
            {club.emails.length > 0 && (
              <p className="flex items-center gap-2 text-muted-foreground">
                <svg
                  className="h-4 w-4 text-secondary transition-colors duration-300 group-hover:text-accent flex-shrink-0"
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
                <a
                  href={`mailto:${club.emails[0]}`}
                  className="hover:text-secondary hover:underline transition-all duration-300"
                >
                  {club.emails[0]}
                </a>
              </p>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0 relative z-10">
        <Link href={`/clubs/${club.slug}`} className="w-full">
          <Button 
            variant="primary" 
            className="w-full dragon-gradient hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform group-hover:scale-105"
          >
            Découvrir le club
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

