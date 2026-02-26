import { Rocket } from 'lucide-react';
import { LayoutTemplate } from '../layout-templates';

export const HERO_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'hero-centered',
    label: 'Hero Centré',
    category: 'Hero',
    icon: Rocket,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: { display: 'block', padding: '120px 20px', backgroundColor: '#f8fafc', textAlign: 'center' },
        mobile: { padding: '60px 16px' },
      },
      children: [{
        type: 'container',
        tag: 'div',
        styles: { desktop: { maxWidth: '760px', margin: '0 auto' } },
        children: [
          { type: 'heading', tag: 'h1', content: 'Créez des sites web professionnels', styles: { desktop: { fontSize: '56px', fontWeight: '900', color: '#0f172a', marginBottom: '24px' }, mobile: { fontSize: '32px' } }, children: [] },
          { type: 'text', tag: 'div', content: 'Notre CMS intuitif vous permet de construire sans code.', styles: { desktop: { fontSize: '18px', color: '#475569', marginBottom: '40px' } }, children: [] },
          { type: 'button', tag: 'button', content: 'Commencer gratuitement', styles: { desktop: { padding: '14px 28px', fontSize: '16px', fontWeight: '600', color: '#ffffff', backgroundColor: '#2563eb', border: 'none', borderRadius: '10px' } }, children: [] },
        ],
      }],
    },
  },
];
