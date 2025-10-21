"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-in-up" | "fade-in-left" | "fade-in-right" | "scale-in" | "slide-in-blur";
  delay?: number;
  threshold?: number;
  once?: boolean;
}

export function ScrollAnimation({
  children,
  className = "",
  animation = "fade-in-up",
  delay = 0,
  threshold = 0.1,
  once = true,
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Ajouter l'animation
            setTimeout(() => {
              element.classList.add(`animate-${animation}`);
              element.classList.add("scroll-animate-visible");
              element.style.opacity = "1";
            }, delay);

            // Si once=true, arrêter d'observer après la première animation
            if (once) {
              observer.unobserve(element);
            }
          } else if (!once) {
            // Si once=false, réinitialiser l'animation quand l'élément sort
            element.classList.remove(`animate-${animation}`);
            element.classList.remove("scroll-animate-visible");
            element.style.opacity = "0";
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px", // Commence l'animation un peu avant que l'élément soit visible
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [animation, delay, threshold, once]);

  return (
    <div
      ref={ref}
      className={`scroll-animate ${className}`}
      style={{ opacity: 0 }}
    >
      {children}
    </div>
  );
}

