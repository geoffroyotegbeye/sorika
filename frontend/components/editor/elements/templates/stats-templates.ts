import { BarChart2 } from 'lucide-react';
import { LayoutTemplate } from '../layout-templates';

export const STATS_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'stats-4-cols',
    label: 'Stats 4 Colonnes',
    category: 'Stats',
    icon: BarChart2,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: { display: 'block', padding: '80px 20px', backgroundColor: '#0f172a' },
        tablet: { padding: '60px 20px' },
        mobile: { padding: '48px 16px' },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: { desktop: { maxWidth: '1200px', margin: '0 auto' } },
          children: [
            {
              type: 'grid',
              tag: 'div',
              styles: {
                desktop: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '48px' },
                tablet: { gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' },
                mobile: { gridTemplateColumns: '1fr', gap: '24px' },
              },
              children: [
                [{
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px', padding: '0' } },
                  children: [
                    { type: 'heading', tag: 'div', content: '10K+', styles: { desktop: { fontSize: '48px', fontWeight: '900', color: '#ffffff', marginBottom: '0' } }, children: [] },
                    { type: 'text', tag: 'span', content: 'Clients actifs', styles: { desktop: { fontSize: '15px', color: '#94a3b8', fontWeight: '500' } }, children: [] },
                  ],
                }],
                [{
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px', padding: '0' } },
                  children: [
                    { type: 'heading', tag: 'div', content: '50M+', styles: { desktop: { fontSize: '48px', fontWeight: '900', color: '#ffffff', marginBottom: '0' } }, children: [] },
                    { type: 'text', tag: 'span', content: 'Pages vues/mois', styles: { desktop: { fontSize: '15px', color: '#94a3b8', fontWeight: '500' } }, children: [] },
                  ],
                }],
                [{
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px', padding: '0' } },
                  children: [
                    { type: 'heading', tag: 'div', content: '99.9%', styles: { desktop: { fontSize: '48px', fontWeight: '900', color: '#ffffff', marginBottom: '0' } }, children: [] },
                    { type: 'text', tag: 'span', content: 'Uptime garanti', styles: { desktop: { fontSize: '15px', color: '#94a3b8', fontWeight: '500' } }, children: [] },
                  ],
                }],
                [{
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px', padding: '0' } },
                  children: [
                    { type: 'heading', tag: 'div', content: '24/7', styles: { desktop: { fontSize: '48px', fontWeight: '900', color: '#ffffff', marginBottom: '0' } }, children: [] },
                    { type: 'text', tag: 'span', content: 'Support disponible', styles: { desktop: { fontSize: '15px', color: '#94a3b8', fontWeight: '500' } }, children: [] },
                  ],
                }],
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: 'stats-cards',
    label: 'Stats Cartes',
    category: 'Stats',
    icon: BarChart2,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: { display: 'block', padding: '96px 20px', backgroundColor: '#f8fafc' },
        tablet: { padding: '64px 20px' },
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
              styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '0', marginBottom: '56px' } },
              children: [
                { type: 'heading', tag: 'h2', content: 'Des résultats qui parlent', styles: { desktop: { fontSize: '40px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0' }, mobile: { fontSize: '28px' } }, children: [] },
              ],
            },
            {
              type: 'grid',
              tag: 'div',
              styles: {
                desktop: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' },
                tablet: { gridTemplateColumns: 'repeat(2, 1fr)' },
                mobile: { gridTemplateColumns: '1fr' },
              },
              children: [
                [{
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { padding: '32px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center' } },
                  children: [
                    { type: 'div', tag: 'div', styles: { desktop: { width: '56px', height: '56px', backgroundColor: '#dbeafe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '24px' } }, children: [{ type: 'text', tag: 'span', content: '🚀', styles: { desktop: { fontSize: '24px' } }, children: [] }] },
                    { type: 'heading', tag: 'div', content: '3 minutes', styles: { desktop: { fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '0' } }, children: [] },
                    { type: 'text', tag: 'div', content: 'Temps moyen pour publier un site', styles: { desktop: { fontSize: '14px', color: '#64748b', marginBottom: '0' } }, children: [] },
                  ],
                }],
                [{
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { padding: '32px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center' } },
                  children: [
                    { type: 'div', tag: 'div', styles: { desktop: { width: '56px', height: '56px', backgroundColor: '#dcfce7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' } }, children: [{ type: 'text', tag: 'span', content: '📈', styles: { desktop: { fontSize: '24px' } }, children: [] }] },
                    { type: 'heading', tag: 'div', content: '+40%', styles: { desktop: { fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '0' } }, children: [] },
                    { type: 'text', tag: 'div', content: 'Augmentation moyenne des conversions', styles: { desktop: { fontSize: '14px', color: '#64748b', marginBottom: '0' } }, children: [] },
                  ],
                }],
                [{
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { padding: '32px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center' } },
                  children: [
                    { type: 'div', tag: 'div', styles: { desktop: { width: '56px', height: '56px', backgroundColor: '#ede9fe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' } }, children: [{ type: 'text', tag: 'span', content: '⭐', styles: { desktop: { fontSize: '24px' } }, children: [] }] },
                    { type: 'heading', tag: 'div', content: '4.9/5', styles: { desktop: { fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '0' } }, children: [] },
                    { type: 'text', tag: 'div', content: 'Note moyenne de satisfaction', styles: { desktop: { fontSize: '14px', color: '#64748b', marginBottom: '0' } }, children: [] },
                  ],
                }],
              ],
            },
          ],
        },
      ],
    },
  },
];
