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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlobalSearch } from '@/components/GlobalSearch';


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

  const { slug } = use(params);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) { router.push('/login'); return; }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser.user);
    const currentCompany = parsedUser.companies?.find((c: any) => c.slug === slug);
    if (!currentCompany) { router.push('/login'); return; }
    setCompany(currentCompany);

    // Fetch les modules frais depuis l'API (au cas où l'admin les aurait modifiés)
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/companies/slug/${slug}`)
      .then((r) => r.ok ? r.json() : null)
      .then((fresh) => {
        if (!fresh) return;
        setCompany((prev: any) => prev ? { ...prev, modules: fresh.modules } : prev);
        // Sync localStorage
        try {
          const raw = localStorage.getItem('user');
          if (!raw) return;
          const data = JSON.parse(raw);
          data.companies = data.companies.map((c: any) =>
            c.slug === slug ? { ...c, modules: fresh.modules } : c
          );
          localStorage.setItem('user', JSON.stringify(data));
        } catch {}
      })
      .catch(() => {});
  }, [slug, router]);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
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
    <div className="h-screen overflow-hidden bg-slate-50 flex flex-col">

      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="bg-white shadow-sm">
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* ── Sidebar ── */}
      {showMainSidebar && (
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 p-5 border-b border-slate-100">
          <div className="h-9 w-9 bg-linear-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-base">{company.name[0].toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-slate-900 truncate">{company.name}</p>
            <p className="text-xs text-slate-400 truncate">sorika.bj/{company.slug}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          <a
            href={`/dashboard/${slug}`}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive(`/dashboard/${slug}`) ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Home className="h-4 w-4 shrink-0" />
            Tableau de bord
          </a>
          <a
            href={`/dashboard/${slug}/members`}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname.startsWith(`/dashboard/${slug}/members`) ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Users className="h-4 w-4 shrink-0" />
            Membres
          </a>
          <a
            href={`/dashboard/${slug}/settings`}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname.startsWith(`/dashboard/${slug}/settings`) ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
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
        <header className={`sticky top-0 z-30 h-14 bg-white border-b border-slate-200 flex items-center gap-4 px-4 lg:px-6 ${!showMainSidebar ? 'lg:pl-72' : ''}`}>
          {/* Recherche globale */}
          <div className="flex-1 max-w-md">
            <GlobalSearch slug={slug} modules={company.modules ?? []} />
          </div>

          <div className="flex items-center gap-1 ml-auto">
            {/* Support */}
            <button className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors" title="Support">
              <HelpCircle className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <button className="relative h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors" title="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1" />

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="h-7 w-7 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 font-semibold text-xs">{userInitial}</span>
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:block max-w-30 truncate">{userName}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-blue-700 font-bold">{userInitial}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-900 truncate">{userName}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 space-y-1">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50">
                      <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400">Organisation</p>
                        <p className="text-sm font-medium text-slate-700 truncate">{company.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50">
                      <Shield className="h-4 w-4 text-slate-400 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-400">Rôle</p>
                        <p className="text-sm font-medium text-slate-700">{company.role || 'OWNER'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border-t border-slate-100 space-y-1">
                    <a
                      href={`/dashboard/${slug}/settings`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Paramètres du compte
                    </a>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
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
