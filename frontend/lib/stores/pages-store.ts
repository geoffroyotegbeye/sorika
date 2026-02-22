import { create } from 'zustand';

export interface Page {
  id: string;
  slug: string;
  title: string;
  description?: string;
  elements: any[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  isHomePage: boolean;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface PagesState {
  pages: Page[];
  currentPageSlug: string | null;
  isLoading: boolean;
  
  // Actions
  setPages: (pages: Page[]) => void;
  setCurrentPage: (slug: string) => void;
  addPage: (page: Page) => void;
  updatePage: (slug: string, updates: Partial<Page>) => void;
  removePage: (slug: string) => void;
  getCurrentPage: () => Page | null;
  getRedirectSlug: () => string | null;
}

export const usePagesStore = create<PagesState>((set, get) => ({
  pages: [],
  currentPageSlug: null,
  isLoading: false,

  setPages: (pages) => set({ pages }),

  setCurrentPage: (slug) => set({ currentPageSlug: slug }),

  addPage: (page) => set((state) => ({
    pages: [...state.pages, page],
  })),

  updatePage: (slug, updates) => set((state) => ({
    pages: state.pages.map((page) =>
      page.slug === slug ? { ...page, ...updates } : page
    ),
  })),

  removePage: (slug) => set((state) => {
    const isCurrentPage = state.currentPageSlug === slug;
    const remainingPages = state.pages.filter((page) => page.slug !== slug);
    
    // Si on supprime la page active, rediriger vers la page d'accueil ou la première page
    let newCurrentSlug = state.currentPageSlug;
    if (isCurrentPage && remainingPages.length > 0) {
      const homePage = remainingPages.find((p) => p.isHomePage);
      newCurrentSlug = homePage?.slug || remainingPages[0].slug;
    } else if (remainingPages.length === 0) {
      newCurrentSlug = null;
    }
    
    return {
      pages: remainingPages,
      currentPageSlug: newCurrentSlug,
    };
  }),

  getCurrentPage: () => {
    const { pages, currentPageSlug } = get();
    return pages.find((page) => page.slug === currentPageSlug) || null;
  },

  getRedirectSlug: () => {
    const { pages } = get();
    if (pages.length === 0) return null;
    const homePage = pages.find((p) => p.isHomePage);
    return homePage?.slug || pages[0].slug;
  },
}));
