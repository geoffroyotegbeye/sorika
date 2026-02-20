'use client';

import { use, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Globe, Settings, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  
  // Unwrap params Promise
  const { slug } = use(params);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser.user);
    
    // Trouver l'entreprise correspondante
    const currentCompany = parsedUser.companies?.find((c: any) => c.slug === slug);
    if (!currentCompany) {
      router.push('/login');
      return;
    }
    setCompany(currentCompany);
  }, [slug, router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const navigation = [
    { name: 'Accueil', href: `/dashboard/${slug}`, icon: Home },
    { name: 'Paramètres', href: `/dashboard/${slug}/settings`, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-slate-200">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">{company.name}</h1>
              <p className="text-xs text-slate-500">sorika.bj/{company.slug}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* User info & Logout */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-slate-600 font-semibold">
                  {user.firstName?.[0] || user.email[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user.firstName || user.email}
                </p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
