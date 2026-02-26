import { NAVBAR_FLUX_BLOCK } from './navbar-flux-block';

export interface BlockDefinition {
  id: string;
  category: 'header' | 'hero' | 'features' | 'pricing' | 'testimonials' | 'cta' | 'footer';
  name: string;
  description: string;
  thumbnail?: string;
  template: any;
}

export const BLOCKS_LIBRARY: BlockDefinition[] = [
  {
    id: 'navbar-flux',
    category: 'header',
    name: 'Navbar FluxUI',
    description: 'Header moderne avec logo, navigation et actions. Responsive avec menu hamburger.',
    thumbnail: '/blocks/navbar-flux.png',
    template: NAVBAR_FLUX_BLOCK,
  },
];

export const getBlocksByCategory = (category: string) => {
  return BLOCKS_LIBRARY.filter(block => block.category === category);
};

export const getBlockById = (id: string) => {
  return BLOCKS_LIBRARY.find(block => block.id === id);
};
