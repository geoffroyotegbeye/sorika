import { Star, LucideIcon } from 'lucide-react';

export interface LayoutTemplate {
  id: string;
  label: string;
  category: string;
  icon: LucideIcon;
  template: any;
}

export const TESTIMONIALS_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'testimonials-grid',
    label: 'Témoignages Grille',
    category: 'Testimonials',
    icon: Star,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: { display: 'block', padding: '96px 20px', backgroundColor: '#ffffff' },
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
              styles: {
                desktop: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '16px',
                  padding: '0',
                  marginBottom: '56px',
                },
              },
              children: [
                {
                  type: 'heading',
                  tag: 'h2',
                  content: 'Ils nous font confiance',
                  styles: { desktop: { fontSize: '40px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0' }, mobile: { fontSize: '28px' } },
                  children: [],
                },
                {
                  type: 'text',
                  tag: 'div',
                  content: 'Plus de 10 000 entrepreneurs ont choisi notre plateforme. Voici ce qu\'ils en pensent.',
                  styles: { desktop: { fontSize: '17px', color: '#475569', marginBottom: '0' } },
                  children: [],
                },
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
                // Témoignage 1
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: {
                    desktop: {
                      padding: '28px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    },
                  },
                  children: [
                    { type: 'text', tag: 'span', content: '⭐⭐⭐⭐⭐', styles: { desktop: { fontSize: '14px' } }, children: [] },
                    {
                      type: 'text',
                      tag: 'div',
                      content: '"J\'ai lancé mon site e-commerce en une journée. Le résultat est bluffant et mes ventes ont augmenté de 40% dès le premier mois."',
                      styles: { desktop: { fontSize: '15px', color: '#334155', lineHeight: '1.7', fontStyle: 'italic', marginBottom: '0' } },
                      children: [],
                    },
                    {
                      type: 'hflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', alignItems: 'center', gap: '12px', padding: '0' } },
                      children: [
                        {
                          type: 'div',
                          tag: 'div',
                          styles: {
                            desktop: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' },
                          },
                          children: [
                            { type: 'text', tag: 'span', content: 'AS', styles: { desktop: { fontSize: '13px', fontWeight: '700', color: '#ffffff' } }, children: [] },
                          ],
                        },
                        {
                          type: 'vflex',
                          tag: 'div',
                          styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '2px', padding: '0' } },
                          children: [
                            { type: 'text', tag: 'span', content: 'Amina Sow', styles: { desktop: { fontSize: '14px', fontWeight: '600', color: '#0f172a' } }, children: [] },
                            { type: 'text', tag: 'span', content: 'Fondatrice, Boutique Élégance', styles: { desktop: { fontSize: '12px', color: '#64748b' } }, children: [] },
                          ],
                        },
                      ],
                    },
                  ],
                },
                // Témoignage 2
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: {
                    desktop: {
                      padding: '28px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    },
                  },
                  children: [
                    { type: 'text', tag: 'span', content: '⭐⭐⭐⭐⭐', styles: { desktop: { fontSize: '14px' } }, children: [] },
                    {
                      type: 'text',
                      tag: 'div',
                      content: '"En tant qu\'agence, nous gérons 20 sites clients depuis un seul tableau de bord. Un gain de temps considérable et nos clients adorent le résultat."',
                      styles: { desktop: { fontSize: '15px', color: '#334155', lineHeight: '1.7', fontStyle: 'italic', marginBottom: '0' } },
                      children: [],
                    },
                    {
                      type: 'hflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', alignItems: 'center', gap: '12px', padding: '0' } },
                      children: [
                        {
                          type: 'div',
                          tag: 'div',
                          styles: { desktop: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' } },
                          children: [
                            { type: 'text', tag: 'span', content: 'KD', styles: { desktop: { fontSize: '13px', fontWeight: '700', color: '#ffffff' } }, children: [] },
                          ],
                        },
                        {
                          type: 'vflex',
                          tag: 'div',
                          styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '2px', padding: '0' } },
                          children: [
                            { type: 'text', tag: 'span', content: 'Kofi Danso', styles: { desktop: { fontSize: '14px', fontWeight: '600', color: '#0f172a' } }, children: [] },
                            { type: 'text', tag: 'span', content: 'CEO, Digit Agency', styles: { desktop: { fontSize: '12px', color: '#64748b' } }, children: [] },
                          ],
                        },
                      ],
                    },
                  ],
                },
                // Témoignage 3
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: {
                    desktop: {
                      padding: '28px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    },
                  },
                  children: [
                    { type: 'text', tag: 'span', content: '⭐⭐⭐⭐⭐', styles: { desktop: { fontSize: '14px' } }, children: [] },
                    {
                      type: 'text',
                      tag: 'div',
                      content: '"Le support est exceptionnel. Chaque fois que j\'ai un problème, l\'équipe répond en moins de 2 heures. Je recommande à 100%."',
                      styles: { desktop: { fontSize: '15px', color: '#334155', lineHeight: '1.7', fontStyle: 'italic', marginBottom: '0' } },
                      children: [],
                    },
                    {
                      type: 'hflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', alignItems: 'center', gap: '12px', padding: '0' } },
                      children: [
                        {
                          type: 'div',
                          tag: 'div',
                          styles: { desktop: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' } },
                          children: [
                            { type: 'text', tag: 'span', content: 'MB', styles: { desktop: { fontSize: '13px', fontWeight: '700', color: '#ffffff' } }, children: [] },
                          ],
                        },
                        {
                          type: 'vflex',
                          tag: 'div',
                          styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '2px', padding: '0' } },
                          children: [
                            { type: 'text', tag: 'span', content: 'Marie Bassène', styles: { desktop: { fontSize: '14px', fontWeight: '600', color: '#0f172a' } }, children: [] },
                            { type: 'text', tag: 'span', content: 'Coach business en ligne', styles: { desktop: { fontSize: '12px', color: '#64748b' } }, children: [] },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
];