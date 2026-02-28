import { Layers, LucideIcon } from 'lucide-react';

export interface LayoutTemplate {
  id: string;
  label: string;
  category: string;
  icon: LucideIcon;
  template: any;
}

export const BLOG_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'blog-grid-3',
    label: 'Blog Grille 3 Articles',
    category: 'Blog',
    icon: Layers,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: { display: 'block', padding: '96px 20px', backgroundColor: '#ffffff' },
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
            styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '0', marginBottom: '56px' } },
            children: [
              { type: 'heading', tag: 'h2', content: 'Derniers articles', styles: { desktop: { fontSize: '40px', fontWeight: '800', color: '#0f172a', marginBottom: '0' }, mobile: { fontSize: '28px' } }, children: [] },
              { type: 'text', tag: 'div', content: 'Découvrez nos conseils et actualités.', styles: { desktop: { fontSize: '17px', color: '#475569', marginBottom: '0' } }, children: [] },
            ],
          },
          {
            type: 'grid',
            tag: 'div',
            styles: {
              desktop: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' },
              tablet: { gridTemplateColumns: 'repeat(2, 1fr)' },
              mobile: { gridTemplateColumns: '1fr' },
            },
            children: [
              {
                type: 'vflex',
                tag: 'div',
                styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '16px', padding: '0', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' } },
                children: [
                  { 
                    type: 'image', 
                    tag: 'img', 
                    content: '',
                    attributes: {
                      src: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=200&fit=crop',
                      alt: 'Article de blog'
                    },
                    styles: { 
                      desktop: { 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover',
                        display: 'block'
                      } 
                    }, 
                    children: [] 
                  },
                  {
                    type: 'vflex',
                    tag: 'div',
                    styles: { desktop: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' } },
                    children: [
                      { type: 'text', tag: 'span', content: '5 min • 15 Jan 2025', styles: { desktop: { fontSize: '13px', color: '#64748b' } }, children: [] },
                      { type: 'heading', tag: 'h3', content: 'Comment créer un site performant', styles: { desktop: { fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                      { type: 'text', tag: 'div', content: 'Découvrez les meilleures pratiques pour optimiser les performances de votre site web.', styles: { desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.6', marginBottom: '0' } }, children: [] },
                      { type: 'text-link', tag: 'a', content: 'Lire la suite →', styles: { desktop: { fontSize: '14px', fontWeight: '600', color: '#2563eb', textDecoration: 'none' } }, children: [] },
                    ],
                  },
                ],
              },
              {
                type: 'vflex',
                tag: 'div',
                styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '16px', padding: '0', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' } },
                children: [
                  { 
                    type: 'image', 
                    tag: 'img', 
                    content: '',
                    attributes: {
                      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=200&fit=crop',
                      alt: 'Article de blog'
                    },
                    styles: { 
                      desktop: { 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover',
                        display: 'block'
                      } 
                    }, 
                    children: [] 
                  },
                  {
                    type: 'vflex',
                    tag: 'div',
                    styles: { desktop: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' } },
                    children: [
                      { type: 'text', tag: 'span', content: '8 min • 12 Jan 2025', styles: { desktop: { fontSize: '13px', color: '#64748b' } }, children: [] },
                      { type: 'heading', tag: 'h3', content: 'Les tendances design 2025', styles: { desktop: { fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                      { type: 'text', tag: 'div', content: 'Explorez les nouvelles tendances qui vont marquer le design web cette année.', styles: { desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.6', marginBottom: '0' } }, children: [] },
                      { type: 'text-link', tag: 'a', content: 'Lire la suite →', styles: { desktop: { fontSize: '14px', fontWeight: '600', color: '#2563eb', textDecoration: 'none' } }, children: [] },
                    ],
                  },
                ],
              },
              {
                type: 'vflex',
                tag: 'div',
                styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '16px', padding: '0', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' } },
                children: [
                  { 
                    type: 'image', 
                    tag: 'img', 
                    content: '',
                    attributes: {
                      src: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=400&h=200&fit=crop',
                      alt: 'Article de blog'
                    },
                    styles: { 
                      desktop: { 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover',
                        display: 'block'
                      } 
                    }, 
                    children: [] 
                  },
                  {
                    type: 'vflex',
                    tag: 'div',
                    styles: { desktop: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' } },
                    children: [
                      { type: 'text', tag: 'span', content: '6 min • 10 Jan 2025', styles: { desktop: { fontSize: '13px', color: '#64748b' } }, children: [] },
                      { type: 'heading', tag: 'h3', content: 'SEO : Guide complet 2025', styles: { desktop: { fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                      { type: 'text', tag: 'div', content: 'Maîtrisez les techniques SEO essentielles pour améliorer votre visibilité.', styles: { desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.6', marginBottom: '0' } }, children: [] },
                      { type: 'text-link', tag: 'a', content: 'Lire la suite →', styles: { desktop: { fontSize: '14px', fontWeight: '600', color: '#2563eb', textDecoration: 'none' } }, children: [] },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }],
    },
  },
];