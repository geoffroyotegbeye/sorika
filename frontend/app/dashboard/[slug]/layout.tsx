'use client';

import { use, useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  LogOut,
  Menu,
  X,
  Bell,
  HelpCircle,
  ChevronDown,
  Building2,
  Shield,
  Settings,
  Users,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlobalSearch } from '@/components/GlobalSearch';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { setTheme } = useTheme();

  const { slug } = use(params);

  const normalizeDashboardTheme = (u: Record<string, unknown> | null) => {
    if (!u) return null;
    return {
      ...u,
      dashboardTheme: u.dashboardTheme === 'DARK' ? 'DARK' : 'LIGHT',
    };
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) { router.push('/login'); return; }
    const parsedUser = JSON.parse(userData);
    setUser(normalizeDashboardTheme(parsedUser.user));
    const rawCompany = parsedUser.companies?.find((c: any) => c.slug === slug);
    if (!rawCompany) { router.push('/login'); return; }
    setCompany(rawCompany);

    // Modules à jour (API)
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/companies/slug/${slug}`)
      .then((r) => r.ok ? r.json() : null)
      .then((fresh) => {
        if (!fresh) return;
        setCompany((prev: any) =>
          prev ? { ...prev, modules: fresh.modules } : prev,
        );
        try {
          const raw = localStorage.getItem('user');
          if (!raw) return;
          const data = JSON.parse(raw);
          data.companies = data.companies.map((c: any) =>
            c.slug === slug ? { ...c, modules: fresh.modules } : c,
          );
          localStorage.setItem('user', JSON.stringify(data));
        } catch {}
      })
      .catch(() => {});
  }, [slug, router]);

  useEffect(() => {
    if (!user?.dashboardTheme) return;
    setTheme(user.dashboardTheme === 'DARK' ? 'dark' : 'light');
  }, [user?.dashboardTheme, setTheme]);

  const toggleDashboardTheme = async () => {
    if (!user) return;
    const prev: 'LIGHT' | 'DARK' = user.dashboardTheme === 'DARK' ? 'DARK' : 'LIGHT';
    const next: 'LIGHT' | 'DARK' = prev === 'DARK' ? 'LIGHT' : 'DARK';

    setTheme(next === 'DARK' ? 'dark' : 'light');
    setUser((p: any) => ({ ...p, dashboardTheme: next }));
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const data = JSON.parse(raw);
        data.user = { ...data.user, dashboardTheme: next };
        localStorage.setItem('user', JSON.stringify(data));
      }
    } catch {
      /* ignore */
    }

    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${base}/auth/me/dashboard-theme`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(userId ? { 'x-user-id': userId } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ dashboardTheme: next }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Erreur');
      }
    } catch (e: unknown) {
      setTheme(prev === 'DARK' ? 'dark' : 'light');
      setUser((p: any) => ({ ...p, dashboardTheme: prev }));
      try {
        const raw = localStorage.getItem('user');
        if (raw) {
          const data = JSON.parse(raw);
          data.user = { ...data.user, dashboardTheme: prev };
          localStorage.setItem('user', JSON.stringify(data));
        }
      } catch {
        /* ignore */
      }
      const msg = e instanceof Error ? e.message : 'Impossible d\'enregistrer le thème';
      toast.error(msg);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // Détecter si on est dans un module avec sa propre sidebar
  const isInModuleWithSidebar = () => {
    const modulesWithSidebar: string[] = [];
    const pathParts = pathname.replace(`/dashboard/${slug}`, '').split('/').filter(Boolean);
    return pathParts.length > 0 && modulesWithSidebar.includes(pathParts[0]);
  };

  const showMainSidebar = !isInModuleWithSidebar();

  const isActive = (href: string) => pathname === href;
  const userInitial = user.firstName?.[0] || user.email[0].toUpperCase();
  const userName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email;

  return (
    <div className="h-screen overflow-hidden bg-muted/40 flex flex-col">

      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="bg-card shadow-sm">
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* ── Sidebar ── */}
      {showMainSidebar && (
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 p-5 border-b border-sidebar-border">
          <div className="h-9 w-9 bg-linear-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-base">{company.name[0].toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-sidebar-foreground truncate">{company.name}</p>
            <p className="truncate text-xs text-sidebar-foreground/60">sorika.bj/{company.slug}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          <a
            href={`/dashboard/${slug}`}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive(`/dashboard/${slug}`) ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'}`}
          >
            <Home className="h-4 w-4 shrink-0" />
            Tableau de bord
          </a>
          <a
            href={`/dashboard/${slug}/members`}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname.startsWith(`/dashboard/${slug}/members`) ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'}`}
          >
            <Users className="h-4 w-4 shrink-0" />
            Membres
          </a>
          <a
            href={`/dashboard/${slug}/settings`}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname.startsWith(`/dashboard/${slug}/settings`) ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'}`}
          >
            <Settings className="h-4 w-4 shrink-0" />
            Paramètres
          </a>
        </nav>
      </aside>
      )}

      {/* ── Zone principale ── */}
      <div className={`flex flex-col flex-1 min-h-0 overflow-hidden ${showMainSidebar ? 'lg:pl-64' : ''}`}>

        {/* ── Topbar ── */}
        <header className={`sticky top-0 z-30 h-14 bg-background border-b border-border flex items-center gap-4 px-4 lg:px-6 ${!showMainSidebar ? 'lg:pl-72' : ''}`}>
          {/* Recherche globale */}
          <div className="flex-1 max-w-md">
            <GlobalSearch slug={slug} modules={company.modules ?? []} />
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <button
              type="button"
              onClick={() => void toggleDashboardTheme()}
              className="h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title={user.dashboardTheme === 'DARK' ? 'Passer en mode clair' : 'Passer en mode sombre'}
            >
              {user.dashboardTheme === 'DARK' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Support */}
            <button className="h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Support">
              <HelpCircle className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <button className="relative h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
            </button>

            <div className="h-6 w-px bg-border mx-1" />

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="h-7 w-7 bg-primary/15 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold text-xs">{userInitial}</span>
                </div>
                <span className="text-sm font-medium text-foreground hidden sm:block max-w-30 truncate">{userName}</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-popover text-popover-foreground rounded-xl border border-border shadow-lg overflow-hidden z-50">
                  <div className="p-4 border-b border-border bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary/15 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-primary font-bold">{userInitial}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{userName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 space-y-1">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/50">
                      <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Organisation</p>
                        <p className="text-sm font-medium text-foreground truncate">{company.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/50">
                      <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Rôle</p>
                        <p className="text-sm font-medium text-foreground">{company.role || 'OWNER'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border-t border-border space-y-1">
                    <a
                      href={`/dashboard/${slug}/settings`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Paramètres du compte
                    </a>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Contenu ── */}
        <main className={`flex-1 overflow-auto ${showMainSidebar ? 'p-3 lg:p-4' : 'p-0'}`}>
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
