import { Image, LucideIcon } from 'lucide-react';

export interface LayoutTemplate {
  id: string;
  label: string;
  category: string;
  icon: LucideIcon;
  template: any;
}

export const GALLERY_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'gallery-grid-4',
    label: 'Galerie 4 Colonnes',
    category: 'Gallery',
    icon: Image,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: { display: 'block', padding: '96px 20px', backgroundColor: '#f8fafc' },
        tablet: { padding: '64px 20px' },
        mobile: { padding: '48px 16px' },
      },
      children: [{
        type: 'container',
        tag: 'div',
        styles: { desktop: { maxWidth: '1200px', margin: '0 auto' } },
        children: [
          {
            type: 'vflex',
            tag: 'div',
            styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '0', marginBottom: '48px' } },
            children: [
              { type: 'heading', tag: 'h2', content: 'Notre galerie', styles: { desktop: { fontSize: '40px', fontWeight: '800', color: '#0f172a', marginBottom: '0' }, mobile: { fontSize: '28px' } }, children: [] },
              { type: 'text', tag: 'div', content: 'Découvrez nos réalisations.', styles: { desktop: { fontSize: '17px', color: '#475569', marginBottom: '0' } }, children: [] },
            ],
          },
          {
            type: 'grid',
            tag: 'div',
            styles: {
              desktop: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
              tablet: { gridTemplateColumns: 'repeat(2, 1fr)' },
              mobile: { gridTemplateColumns: '1fr' },
            },
            children: [
              { type: 'div', tag: 'div', styles: { desktop: { width: '100%', height: '240px', backgroundColor: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } }, children: [{ type: 'text', tag: 'span', content: '🖼️', styles: { desktop: { fontSize: '32px' } }, children: [] }] },
              { type: 'div', tag: 'div', styles: { desktop: { width: '100%', height: '240px', backgroundColor: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } }, children: [{ type: 'text', tag: 'span', content: '🖼️', styles: { desktop: { fontSize: '32px' } }, children: [] }] },
              { type: 'div', tag: 'div', styles: { desktop: { width: '100%', height: '240px', backgroundColor: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } }, children: [{ type: 'text', tag: 'span', content: '🖼️', styles: { desktop: { fontSize: '32px' } }, children: [] }] },
              { type: 'div', tag: 'div', styles: { desktop: { width: '100%', height: '240px', backgroundColor: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } }, children: [{ type: 'text', tag: 'span', content: '🖼️', styles: { desktop: { fontSize: '32px' } }, children: [] }] },
              { type: 'div', tag: 'div', styles: { desktop: { width: '100%', height: '240px', backgroundColor: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } }, children: [{ type: 'text', tag: 'span', content: '🖼️', styles: { desktop: { fontSize: '32px' } }, children: [] }] },
              { type: 'div', tag: 'div', styles: { desktop: { width: '100%', height: '240px', backgroundColor: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } }, children: [{ type: 'text', tag: 'span', content: '🖼️', styles: { desktop: { fontSize: '32px' } }, children: [] }] },
              { type: 'div', tag: 'div', styles: { desktop: { width: '100%', height: '240px', backgroundColor: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } }, children: [{ type: 'text', tag: 'span', content: '🖼️', styles: { desktop: { fontSize: '32px' } }, children: [] }] },
              { type: 'div', tag: 'div', styles: { desktop: { width: '100%', height: '240px', backgroundColor: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } }, children: [{ type: 'text', tag: 'span', content: '🖼️', styles: { desktop: { fontSize: '32px' } }, children: [] }] },
            ],
          },
        ],
      }],
    },
  },
];