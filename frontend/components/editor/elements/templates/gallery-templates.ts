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
              { type: 'image', tag: 'img', content: '', attributes: { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=240&fit=crop', alt: 'Galerie' }, styles: { desktop: { width: '100%', height: '240px', objectFit: 'cover', borderRadius: '12px', display: 'block' } }, children: [] },
              { type: 'image', tag: 'img', content: '', attributes: { src: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=300&h=240&fit=crop', alt: 'Galerie' }, styles: { desktop: { width: '100%', height: '240px', objectFit: 'cover', borderRadius: '12px', display: 'block' } }, children: [] },
              { type: 'image', tag: 'img', content: '', attributes: { src: 'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=300&h=240&fit=crop', alt: 'Galerie' }, styles: { desktop: { width: '100%', height: '240px', objectFit: 'cover', borderRadius: '12px', display: 'block' } }, children: [] },
              { type: 'image', tag: 'img', content: '', attributes: { src: 'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=300&h=240&fit=crop', alt: 'Galerie' }, styles: { desktop: { width: '100%', height: '240px', objectFit: 'cover', borderRadius: '12px', display: 'block' } }, children: [] },
              { type: 'image', tag: 'img', content: '', attributes: { src: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=300&h=240&fit=crop', alt: 'Galerie' }, styles: { desktop: { width: '100%', height: '240px', objectFit: 'cover', borderRadius: '12px', display: 'block' } }, children: [] },
              { type: 'image', tag: 'img', content: '', attributes: { src: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=300&h=240&fit=crop', alt: 'Galerie' }, styles: { desktop: { width: '100%', height: '240px', objectFit: 'cover', borderRadius: '12px', display: 'block' } }, children: [] },
              { type: 'image', tag: 'img', content: '', attributes: { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=240&fit=crop', alt: 'Galerie' }, styles: { desktop: { width: '100%', height: '240px', objectFit: 'cover', borderRadius: '12px', display: 'block' } }, children: [] },
              { type: 'image', tag: 'img', content: '', attributes: { src: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=300&h=240&fit=crop', alt: 'Galerie' }, styles: { desktop: { width: '100%', height: '240px', objectFit: 'cover', borderRadius: '12px', display: 'block' } }, children: [] },
            ],
          },
        ],
      }],
    },
  },
];