import { Megaphone, LucideIcon } from 'lucide-react';

export interface LayoutTemplate {
  id: string;
  label: string;
  category: string;
  icon: LucideIcon;
  template: any;
}

export const BANNER_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'banner-announcement',
    label: 'Bannière Annonce',
    category: 'Banner',
    icon: Megaphone,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: { display: 'block', padding: '12px 20px', backgroundColor: '#2563eb', textAlign: 'center' },
        mobile: { padding: '10px 16px' },
      },
      children: [{
        type: 'container',
        tag: 'div',
        styles: { desktop: { maxWidth: '1200px', margin: '0 auto' } },
        children: [{
          type: 'hflex',
          tag: 'div',
          styles: { desktop: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '0' }, mobile: { flexDirection: 'column', gap: '8px' } },
          children: [
            { type: 'text', tag: 'span', content: '🎉 Nouveau : Découvrez notre nouvelle fonctionnalité !', styles: { desktop: { fontSize: '14px', fontWeight: '500', color: '#ffffff' } }, children: [] },
            { type: 'text-link', tag: 'a', content: 'En savoir plus →', styles: { desktop: { fontSize: '14px', fontWeight: '600', color: '#ffffff', textDecoration: 'underline' } }, children: [] },
          ],
        }],
      }],
    },
  },
];