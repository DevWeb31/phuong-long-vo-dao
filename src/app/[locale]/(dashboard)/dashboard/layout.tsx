import { requireAuth } from "@/lib/auth/helpers";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function DashboardNav() {
  const navigation = [
    { name: "Vue d'ensemble", href: "/dashboard", icon: "📊", color: "primary" },
    { name: "Cours", href: "/dashboard/classes", icon: "📚", color: "secondary" },
    { name: "Instructeurs", href: "/dashboard/coaches", icon: "👥", color: "accent" },
    { name: "Événements", href: "/dashboard/events", icon: "📅", color: "tertiary" },
    { name: "Actualités", href: "/dashboard/posts", icon: "📰", color: "primary" },
    { name: "Médias", href: "/dashboard/media", icon: "🖼️", color: "secondary" },
    { name: "Paramètres", href: "/dashboard/settings", icon: "⚙️", color: "accent" },
  ];

  return (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 group ${
            item.color === 'primary' ? 'text-muted-foreground hover:bg-primary/10 hover:text-primary' :
            item.color === 'secondary' ? 'text-muted-foreground hover:bg-secondary/10 hover:text-secondary' :
            item.color === 'accent' ? 'text-muted-foreground hover:bg-accent/10 hover:text-accent' :
            'text-muted-foreground hover:bg-tertiary/10 hover:text-tertiary'
          }`}
        >
          <span className="text-lg transition-transform duration-300 group-hover:scale-110 flex-shrink-0">{item.icon}</span>
          <span className="truncate">{item.name}</span>
        </Link>
      ))}
    </nav>
  );
}

async function SignOutButton() {
  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/sign-in");
  }

  return (
    <form action={signOut}>
      <Button variant="outline" className="w-full dragon-hover" type="submit">
        Se déconnecter
      </Button>
    </form>
  );
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r border-border bg-muted/30 lg:block relative overflow-hidden">
        {/* Effet de fond avec les couleurs du logo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 martial-gradient"></div>
        </div>
        
        <div className="flex h-full flex-col relative z-10">
          <div className="border-b border-border p-6">
            <Link href="/" className="flex items-center gap-2 martial-hover">
              <div className="flex h-10 w-10 items-center justify-center rounded-full martial-gradient text-sm font-bold text-white animate-phoenix-rise">
                <span className="drop-shadow-lg">PL</span>
              </div>
              <span className="font-semibold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Phuong Long
              </span>
            </Link>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <DashboardNav />
          </div>

          <div className="border-t border-border p-4">
            <div className="mb-4 text-sm">
              <p className="font-medium text-foreground">{user.email}</p>
              <p className="text-muted-foreground">Administrateur</p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <h2 className="text-lg font-semibold lg:hidden bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Dashboard
            </h2>
            <div className="flex items-center gap-4 ml-auto">
              <ThemeToggle />
              <Link href="/">
                <Button variant="ghost" size="sm" className="phoenix-hover">
                  ← Retour au site
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="p-6 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

