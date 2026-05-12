'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Building2,
  LogOut,
  Shield,
  ChevronRight,
  Menu,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/theme';

const NAV_ITEMS = [
  { label: 'Dashboard',      href: '/admin',           icon: LayoutDashboard },
  { label: 'Utilisateurs',   href: '/admin/users',     icon: Users           },
  { label: 'Organisations',  href: '/admin/companies', icon: Building2       },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const [user,          setUser]          = useState<any>(null);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ── Auth check ── */
  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (!raw) { router.push('/login'); return; }
    const parsed = JSON.parse(raw);
    if (!parsed.user?.isSuperAdmin) { router.push('/login'); return; }
    setUser(parsed.user);
  }, [router]);

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  /* ── Loading ── */
  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--admin-bg)' }}
      >
        <div
          className="animate-spin rounded-full h-10 w-10 border-b-2"
          style={{ borderColor: 'var(--admin-spinner)' }}
        />
      </div>
    );
  }

  const initials = user.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : user.email[0].toUpperCase();

  const displayName = user.firstName
    ? `${user.firstName} ${user.lastName ?? ''}`.trim()
    : user.email;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--admin-bg)', color: 'var(--admin-text)' }}
    >
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ════════════════════════════════════════
          SIDEBAR
      ════════════════════════════════════════ */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          background:   'var(--admin-sidebar)',
          borderRight:  '1px solid var(--admin-sidebar-border)',
          color:        'var(--admin-sidebar-fg)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-6 py-5"
          style={{ borderBottom: '1px solid var(--admin-sidebar-border)' }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: 'var(--admin-sidebar-fg)' }}>
              Sorika Admin
            </p>
            <p className="text-xs opacity-50">Super Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon     = item.icon;
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={
                  isActive
                    ? { background: 'var(--admin-sidebar-active)', color: '#ffffff' }
                    : { color: 'var(--admin-sidebar-muted)' }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'var(--admin-sidebar-hover)';
                    (e.currentTarget as HTMLElement).style.color      = 'var(--admin-sidebar-fg)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color      = 'var(--admin-sidebar-muted)';
                  }
                }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-70" />}
              </Link>
            );
          })}
        </nav>

        {/* User card (sidebar — no logout button) */}
        <div
          className="px-3 py-4"
          style={{ borderTop: '1px solid var(--admin-sidebar-border)' }}
        >
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--admin-sidebar-fg)' }}>
                {displayName}
              </p>
              <p className="text-xs text-blue-400">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════
          MAIN AREA
      ════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Topbar ── */}
        <header
          className="h-14 flex items-center px-4 gap-4 shrink-0"
          style={{
            background:   'var(--admin-topbar)',
            borderBottom: '1px solid var(--admin-topbar-border)',
          }}
        >
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            style={{ color: 'var(--admin-text-muted)' }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--admin-text-muted)' }}>
            <span className="font-medium text-blue-500">Admin</span>
            {pathname !== '/admin' && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span style={{ color: 'var(--admin-text)' }} className="capitalize font-medium">
                  {pathname.split('/').filter(Boolean).slice(1).join(' / ').replace(/-/g, ' ')}
                </span>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">

            {/* Dark / Light toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
              style={{ color: 'var(--admin-text-muted)' }}
              className="hover:bg-[var(--admin-hover)] rounded-lg"
            >
              {theme === 'dark'
                ? <Sun  className="w-4 h-4" />
                : <Moon className="w-4 h-4" />
              }
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              style={{ color: 'var(--admin-text-muted)' }}
              className="hover:bg-[var(--admin-hover)] rounded-lg"
            >
              <Bell className="w-4 h-4" />
            </Button>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors"
                style={{
                  background: dropdownOpen ? 'var(--admin-hover)' : 'transparent',
                  color:      'var(--admin-text)',
                }}
                onMouseEnter={(e) => {
                  if (!dropdownOpen)
                    (e.currentTarget as HTMLElement).style.background = 'var(--admin-hover)';
                }}
                onMouseLeave={(e) => {
                  if (!dropdownOpen)
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {initials}
                </div>
                <span className="text-sm font-medium hidden sm:block max-w-[120px] truncate">
                  {displayName}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform hidden sm:block`}
                  style={{
                    color:     'var(--admin-text-muted)',
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-1.5 w-56 rounded-xl shadow-xl z-50 overflow-hidden"
                  style={{
                    background:  'var(--admin-surface)',
                    border:      '1px solid var(--admin-border)',
                  }}
                >
                  {/* User info header */}
                  <div
                    className="px-4 py-3"
                    style={{ borderBottom: '1px solid var(--admin-border)' }}
                  >
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--admin-text)' }}>
                      {displayName}
                    </p>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--admin-text-muted)' }}>
                      {user.email}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-1.5 text-xs bg-blue-600/15 text-blue-500 px-2 py-0.5 rounded-full">
                      <Shield className="w-3 h-3" />
                      Super Admin
                    </span>
                  </div>

                  {/* Profile link */}
                  <div className="p-1">
                    <button
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
                      style={{ color: 'var(--admin-text-muted)' }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.background = 'var(--admin-hover)')
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.background = 'transparent')
                      }
                    >
                      <User className="w-4 h-4" />
                      Mon profil
                    </button>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: '1px solid var(--admin-border)' }} className="mx-1" />

                  {/* Logout */}
                  <div className="p-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-red-500"
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)')
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.background = 'transparent')
                      }
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <main
          className="flex-1 overflow-auto"
          style={{ background: 'var(--admin-bg)' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
