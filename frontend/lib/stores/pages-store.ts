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

  removePage: (slug) => set((state) => ({
    pages: state.pages.filter((page) => page.slug !== slug),
    currentPageSlug: state.currentPageSlug === slug ? null : state.currentPageSlug,
  })),

  getCurrentPage: () => {
    const { pages, currentPageSlug } = get();
    return pages.find((page) => page.slug === currentPageSlug) || null;
  },
}));
