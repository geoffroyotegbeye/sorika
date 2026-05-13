'use client';

import { create } from 'zustand';

interface SidebarState {
  isCollapsed: boolean;
  toggle: () => void;
  setCollapsed: (collapsed: boolean) => void;
  initialize: () => void;
}

export const useSidebar = create<SidebarState>((set) => ({
  isCollapsed: false,
  toggle: () => {
    set((state) => {
      const newState = !state.isCollapsed;
      // Sauvegarder pour l'utilisateur actuel
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsed = JSON.parse(userData);
          localStorage.setItem(`sidebar-collapsed-${parsed.id}`, String(newState));
        }
      }
      return { isCollapsed: newState };
    });
  },
  setCollapsed: (collapsed: boolean) => set({ isCollapsed: collapsed }),
  initialize: () => {
    // Charger l'état depuis localStorage pour l'utilisateur actuel
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsed = JSON.parse(userData);
        const saved = localStorage.getItem(`sidebar-collapsed-${parsed.id}`);
        if (saved !== null) {
          set({ isCollapsed: saved === 'true' });
        }
      }
    }
  },
}));
