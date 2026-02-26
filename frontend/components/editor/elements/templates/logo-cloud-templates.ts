import { Globe } from 'lucide-react';
import { LayoutTemplate } from '../layout-templates';

export const LOGO_CLOUD_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'logo-cloud-simple',
    label: 'Logos Partenaires',
    category: 'Logo Cloud',
    icon: Globe,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: { display: 'block', padding: '64px 20px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' },
        tablet: { padding: '48px 20px' },
        mobile: { padding: '40px 16px' },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: { desktop: { maxWidth: '1100px', margin: '0 auto' } },
          children: [
            {
              type: 'text',
              tag: 'div',
              content: 'Ils nous font confiance',
              styles: {
                desktop: { fontSize: '13px', fontWeight: '600', color: '#64748b', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '40px' },
              },
              children: [],
            },
            {
              type: 'grid',
              tag: 'div',
              styles: {
                desktop: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '48px', alignItems: 'center' },
                tablet: { gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' },
                mobile: { gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' },
              },
              children: [
                [{
                  type: 'div',
                  tag: 'div',
                  styles: { desktop: { height: '48px', backgroundColor: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                  children: [{ type: 'text', tag: 'span', content: 'Logo 1', styles: { desktop: { fontSize: '14px', color: '#94a3b8', fontWeight: '600' } }, children: [] }],
                }],
                [{
                  type: 'div',
                  tag: 'div',
                  styles: { desktop: { height: '48px', backgroundColor: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                  children: [{ type: 'text', tag: 'span', content: 'Logo 2', styles: { desktop: { fontSize: '14px', color: '#94a3b8', fontWeight: '600' } }, children: [] }],
                }],
                [{
                  type: 'div',
                  tag: 'div',
                  styles: { desktop: { height: '48px', backgroundColor: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                  children: [{ type: 'text', tag: 'span', content: 'Logo 3', styles: { desktop: { fontSize: '14px', color: '#94a3b8', fontWeight: '600' } }, children: [] }],
                }],
                [{
                  type: 'div',
                  tag: 'div',
                  styles: { desktop: { height: '48px', backgroundColor: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                  children: [{ type: 'text', tag: 'span', content: 'Logo 4', styles: { desktop: { fontSize: '14px', color: '#94a3b8', fontWeight: '600' } }, children: [] }],
                }],
                [{
                  type: 'div',
                  tag: 'div',
                  styles: { desktop: { height: '48px', backgroundColor: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                  children: [{ type: 'text', tag: 'span', content: 'Logo 5', styles: { desktop: { fontSize: '14px', color: '#94a3b8', fontWeight: '600' } }, children: [] }],
                }],
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: 'logo-cloud-cards',
    label: 'Logos avec Cartes',
    category: 'Logo Cloud',
    icon: Globe,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: { display: 'block', padding: '80px 20px', backgroundColor: '#f8fafc' },
        tablet: { padding: '60px 20px' },
        mobile: { padding: '48px 16px' },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: { desktop: { maxWidth: '1100px', margin: '0 auto' } },
          children: [
            {
              type: 'vflex',
              tag: 'div',
              styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '0', marginBottom: '48px' } },
              children: [
                { type: 'heading', tag: 'h2', content: 'Utilisé par les meilleures entreprises', styles: { desktop: { fontSize: '36px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0' }, mobile: { fontSize: '26px' } }, children: [] },
                { type: 'text', tag: 'div', content: 'Plus de 500 entreprises nous font confiance pour leur présence en ligne.', styles: { desktop: { fontSize: '16px', color: '#475569', marginBottom: '0' } }, children: [] },
              ],
            },
            {
              type: 'grid',
              tag: 'div',
              styles: {
                desktop: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' },
                tablet: { gridTemplateColumns: 'repeat(2, 1fr)' },
                mobile: { gridTemplateColumns: '1fr' },
              },
              children: [
                [{
                  type: 'div',
                  tag: 'div',
                  styles: { desktop: { padding: '32px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px' } },
                  children: [{ type: 'text', tag: 'span', content: 'Entreprise A', styles: { desktop: { fontSize: '15px', color: '#64748b', fontWeight: '600' } }, children: [] }],
                }],
                [{
                  type: 'div',
                  tag: 'div',
                  styles: { desktop: { padding: '32px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px' } },
                  children: [{ type: 'text', tag: 'span', content: 'Entreprise B', styles: { desktop: { fontSize: '15px', color: '#64748b', fontWeight: '600' } }, children: [] }],
                }],
                [{
                  type: 'div',
                  tag: 'div',
                  styles: { desktop: { padding: '32px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px' } },
                  children: [{ type: 'text', tag: 'span', content: 'Entreprise C', styles: { desktop: { fontSize: '15px', color: '#64748b', fontWeight: '600' } }, children: [] }],
                }],
                [{
                  type: 'div',
                  tag: 'div',
                  styles: { desktop: { padding: '32px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px' } },
                  children: [{ type: 'text', tag: 'span', content: 'Entreprise D', styles: { desktop: { fontSize: '15px', color: '#64748b', fontWeight: '600' } }, children: [] }],
                }],
              ],
            },
          ],
        },
      ],
    },
  },
];
