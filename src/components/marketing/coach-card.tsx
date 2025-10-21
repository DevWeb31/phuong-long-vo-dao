import { Coach } from "@/types/database.types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface CoachCardProps {
  coach: Coach;
}

export function CoachCard({ coach }: CoachCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 shield-hover group relative h-full">
      {/* Effet de fond avec les couleurs du logo */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
        <div className="absolute inset-0 shield-gradient"></div>
      </div>
      
      <div className="relative h-48 w-full bg-gradient-to-br from-accent/20 via-tertiary/10 to-primary/20 overflow-hidden">
        {coach.photo_url ? (
          <Image
            src={coach.photo_url}
            alt={coach.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full shield-gradient text-4xl font-bold text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/25">
              {coach.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
          </div>
        )}
        
        {/* Overlay avec effet martial */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <CardContent className="p-6 relative z-10 flex-1 flex flex-col">
        <div className="mb-2">
          <h3 className="text-xl font-bold bg-gradient-to-r from-accent to-tertiary bg-clip-text text-transparent group-hover:from-tertiary group-hover:to-primary transition-all duration-300">
            {coach.name}
          </h3>
          {coach.grade && (
            <p className="text-sm font-medium text-primary transition-colors duration-300 group-hover:text-secondary">
              {coach.grade}
            </p>
          )}
        </div>

        {coach.specialties && coach.specialties.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {coach.specialties.map((specialty, index) => (
              <span
                key={index}
                className="rounded-full px-2 py-1 text-xs font-medium transition-all duration-300 hover:scale-105 vietnam-gradient text-white shadow-sm"
              >
                {specialty}
              </span>
            ))}
          </div>
        )}

        {coach.bio && (
          <p className="mb-4 line-clamp-3 text-sm text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground flex-1">
            {coach.bio}
          </p>
        )}

        {(coach.email || coach.phone) && (
          <div className="space-y-1 border-t border-border pt-4 text-sm mt-auto">
            {coach.email && (
              <p className="text-muted-foreground">
                <span className="font-medium text-accent transition-colors duration-300 group-hover:text-tertiary">Email:</span>{" "}
                <a 
                  href={`mailto:${coach.email}`} 
                  className="text-primary hover:text-secondary hover:underline transition-all duration-300"
                >
                  {coach.email}
                </a>
              </p>
            )}
            {coach.phone && (
              <p className="text-muted-foreground">
                <span className="font-medium text-secondary transition-colors duration-300 group-hover:text-accent">Tél:</span>{" "}
                <a 
                  href={`tel:${coach.phone}`} 
                  className="text-primary hover:text-secondary hover:underline transition-all duration-300"
                >
                  {coach.phone}
                </a>
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

