/**
 * Hooks personnalisés pour Phuong Long Vo Dao
 */

import { useEffect, useState } from "react";
import { useTheme, type Theme } from "@/lib/theme-provider";

/**
 * Hook pour gérer les animations au scroll
 */
export function useScrollAnimation(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    const element = document.getElementById("scroll-trigger");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold]);

  return isVisible;
}

/**
 * Hook pour gérer les animations avec délai
 */
export function useStaggeredAnimation(items: unknown[], delay = 100) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    const timers = items.map((_, index) => 
      setTimeout(() => {
        setVisibleItems(prev => [...prev, index]);
      }, index * delay)
    );

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [items, delay]);

  return visibleItems;
}

/**
 * Hook pour gérer les thèmes avec animations
 */
export function useThemeWithAnimation() {
  const { theme, setTheme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const changeTheme = (newTheme: Theme) => {
    setIsTransitioning(true);
    setTheme(newTheme);
    
    // Délai pour permettre la transition CSS
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  return { theme, changeTheme, isTransitioning };
}

/**
 * Hook pour gérer les données avec loading et erreur
 */
export function useAsyncData<T>(
  asyncFn: () => Promise<T>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await asyncFn();
        
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
