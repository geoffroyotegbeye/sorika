import { Menu } from 'lucide-react';
import { LayoutTemplate } from '../layout-templates';

export const HEADER_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'header-nav-light',
    label: 'Header Clair',
    category: 'Header',
    icon: Menu,
    template: {
      type: 'section',
      tag: 'header',
      styles: {
        desktop: { display: 'block', width: '100%', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: '0', zIndex: '100' },
      },
      children: [{
        type: 'container',
        tag: 'div',
        styles: {
          desktop: { maxWidth: '1200px', margin: '0 auto', padding: '0 32px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
          mobile: { padding: '0 16px' },
        },
        children: [
          { type: 'heading', tag: 'span', content: 'Votre Marque', styles: { desktop: { fontSize: '22px', fontWeight: '800', color: '#2563eb' } }, children: [] },
          {
            type: 'navbar',
            tag: 'nav',
            styles: { desktop: { display: 'flex', gap: '4px' }, mobile: { display: 'none' } },
            children: [
              { type: 'text-link', tag: 'a', content: 'Accueil', styles: { desktop: { padding: '8px 14px', fontSize: '14px', color: '#0f172a', textDecoration: 'none' } }, children: [] },
              { type: 'text-link', tag: 'a', content: 'Fonctionnalités', styles: { desktop: { padding: '8px 14px', fontSize: '14px', color: '#475569', textDecoration: 'none' } }, children: [] },
            ],
          },
          { type: 'button', tag: 'button', content: 'Connexion', styles: { desktop: { padding: '8px 18px', fontSize: '14px', color: '#ffffff', backgroundColor: '#2563eb', border: 'none', borderRadius: '8px' } }, children: [] },
        ],
      }],
    },
  },
];
