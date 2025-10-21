import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { formatDate } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("marketing.news");

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function NewsPage() {
  const supabase = await createClient();
  const t = await getTranslations("marketing.news");

  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      *,
      organization:organizations(name, slug)
    `
    )
    .eq("status", "published")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

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

        {/* Posts Grid */}
        {posts && posts.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {posts.map((post, index) => (
              <ScrollAnimation
                key={post.id}
                animation={index % 3 === 0 ? "fade-in-left" : index % 3 === 1 ? "fade-in-up" : "fade-in-right"}
                delay={index * 100}
              >
              <Card className="overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
                {post.cover_url && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.cover_url}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}

                <CardContent className="p-6">
                  {post.organization && (
                    <Badge variant="outline" className="mb-3">
                      {post.organization.name}
                    </Badge>
                  )}

                  <h2 className="mb-2 text-xl font-bold">{post.title}</h2>

                  {post.excerpt && (
                    <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{formatDate(post.published_at!)}</span>
                    <Link
                      href={`/news/${post.slug}`}
                      className="text-primary hover:underline"
                    >
                      {t("readMore")} →
                    </Link>
                  </div>
                </CardContent>
              </Card>
              </ScrollAnimation>
            ))}
          </div>
        ) : (
          <ScrollAnimation animation="fade-in-up">
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">Aucune actualité disponible pour le moment.</p>
            </div>
          </ScrollAnimation>
        )}
      </div>
    </div>
  );
}

