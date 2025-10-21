"use client";

import { useEffect, useState } from "react";

interface FacebookEmbedProps {
  type?: "group" | "page";
  url: string;
  width?: number;
  height?: number;
  tabs?: string;
  showFacepile?: boolean;
  className?: string;
}

/**
 * Composant d'intégration Facebook (Group Plugin ou Page Plugin)
 * Utilise les plugins officiels Facebook sans dépendance à l'API Graph
 */
export function FacebookEmbed({
  type = "group",
  url,
  width = 340,
  height = 500,
  tabs = "timeline",
  showFacepile = true,
  className = "",
}: FacebookEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Charger le SDK Facebook
    if (typeof window !== "undefined" && !window.FB) {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v18.0";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";

      script.onload = () => {
        setIsLoaded(true);
        if (window.FB) {
          window.FB.XFBML.parse();
        }
      };

      script.onerror = () => {
        setHasError(true);
      };

      document.body.appendChild(script);
    } else if (window.FB) {
      setIsLoaded(true);
      // Re-parse si le SDK est déjà chargé
      window.FB.XFBML.parse();
    }
  }, []);

  if (hasError) {
    return (
      <div className={`rounded-lg border border-border bg-muted p-6 text-center ${className}`}>
        <p className="text-sm text-muted-foreground">
          Impossible de charger le contenu Facebook.
          <br />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-primary hover:underline"
          >
            Visiter sur Facebook →
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className={`facebook-embed ${className}`}>
      <div id="fb-root"></div>

      {type === "group" ? (
        <div
          className="fb-group"
          data-href={url}
          data-width={width}
          data-height={height}
          data-show-metadata="true"
          data-show-social-context={showFacepile.toString()}
          data-skin="light"
        />
      ) : (
        <div
          className="fb-page"
          data-href={url}
          data-tabs={tabs}
          data-width={width}
          data-height={height}
          data-small-header="false"
          data-adapt-container-width="true"
          data-hide-cover="false"
          data-show-facepile={showFacepile.toString()}
        />
      )}

      {!isLoaded && (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-border bg-muted">
          <div className="text-center">
            <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-muted-foreground border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Chargement...</p>
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-primary hover:underline"
        >
          Voir sur Facebook →
        </a>
      </div>
    </div>
  );
}

// Déclaration TypeScript pour window.FB
declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: () => void;
      };
    };
  }
}

