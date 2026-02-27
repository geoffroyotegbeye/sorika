import { DollarSign, LucideIcon } from 'lucide-react';

export interface LayoutTemplate {
  id: string;
  label: string;
  category: string;
  icon: LucideIcon;
  template: any;
}

export const PRICING_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'pricing-3-cards',
    label: 'Tarifs 3 Cartes',
    category: 'Pricing',
    icon: DollarSign,
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
            // En-tête
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
                  marginBottom: '60px',
                },
              },
              children: [
                {
                  type: 'heading',
                  tag: 'h2',
                  content: 'Des tarifs clairs et transparents',
                  styles: {
                    desktop: { fontSize: '40px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0' },
                    tablet: { fontSize: '32px' },
                    mobile: { fontSize: '26px' },
                  },
                  children: [],
                },
                {
                  type: 'text',
                  tag: 'div',
                  content: 'Commencez gratuitement, évoluez selon vos besoins. Pas de frais cachés.',
                  styles: {
                    desktop: { fontSize: '17px', color: '#475569', marginBottom: '0' },
                  },
                  children: [],
                },
              ],
            },
            // 3 cards
            {
              type: 'grid',
              tag: 'div',
              styles: {
                desktop: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '24px',
                  alignItems: 'start',
                },
                tablet: { gridTemplateColumns: '1fr', maxWidth: '480px', margin: '0 auto' },
                mobile: { gridTemplateColumns: '1fr' },
              },
              children: [
                // Starter
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: {
                    desktop: {
                      padding: '36px',
                      backgroundColor: '#ffffff',
                      borderRadius: '20px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                    },
                  },
                  children: [
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '6px', padding: '0' } },
                      children: [
                        { type: 'heading', tag: 'h3', content: 'Starter', styles: { desktop: { fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                        { type: 'text', tag: 'div', content: 'Parfait pour démarrer', styles: { desktop: { fontSize: '14px', color: '#64748b', marginBottom: '0' } }, children: [] },
                      ],
                    },
                    {
                      type: 'hflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', alignItems: 'baseline', gap: '4px', padding: '0' } },
                      children: [
                        { type: 'heading', tag: 'span', content: '0€', styles: { desktop: { fontSize: '40px', fontWeight: '800', color: '#0f172a', marginBottom: '0' } }, children: [] },
                        { type: 'text', tag: 'span', content: '/mois', styles: { desktop: { fontSize: '14px', color: '#64748b' } }, children: [] },
                      ],
                    },
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '0', borderTop: '1px solid #f1f5f9', paddingTop: '20px' } },
                      children: [
                        { type: 'text', tag: 'span', content: '✓  1 site web', styles: { desktop: { fontSize: '14px', color: '#334155' } }, children: [] },
                        { type: 'text', tag: 'span', content: '✓  5 pages maximum', styles: { desktop: { fontSize: '14px', color: '#334155' } }, children: [] },
                        { type: 'text', tag: 'span', content: '✓  Sous-domaine inclus', styles: { desktop: { fontSize: '14px', color: '#334155' } }, children: [] },
                        { type: 'text', tag: 'span', content: '✓  Templates de base', styles: { desktop: { fontSize: '14px', color: '#334155' } }, children: [] },
                        { type: 'text', tag: 'span', content: '✕  Nom de domaine custom', styles: { desktop: { fontSize: '14px', color: '#94a3b8' } }, children: [] },
                      ],
                    },
                    {
                      type: 'button',
                      tag: 'button',
                      content: 'Commencer gratuitement',
                      styles: {
                        desktop: { width: '100%', padding: '12px', fontSize: '15px', fontWeight: '600', color: '#2563eb', backgroundColor: '#eff6ff', border: 'none', borderRadius: '10px', cursor: 'pointer' },
                      },
                      children: [],
                    },
                  ],
                },
                // Pro (mis en avant)
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: {
                    desktop: {
                      padding: '36px',
                      backgroundColor: '#2563eb',
                      borderRadius: '20px',
                      border: '1px solid #2563eb',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                      position: 'relative',
                    },
                  },
                  children: [
                    {
                      type: 'text',
                      tag: 'span',
                      content: '⭐  Le plus populaire',
                      styles: {
                        desktop: {
                          display: 'inline-block',
                          padding: '4px 12px',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '99px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#ffffff',
                        },
                      },
                      children: [],
                    },
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '6px', padding: '0' } },
                      children: [
                        { type: 'heading', tag: 'h3', content: 'Pro', styles: { desktop: { fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '0' } }, children: [] },
                        { type: 'text', tag: 'div', content: 'Pour les professionnels', styles: { desktop: { fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '0' } }, children: [] },
                      ],
                    },
                    {
                      type: 'hflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', alignItems: 'baseline', gap: '4px', padding: '0' } },
                      children: [
                        { type: 'heading', tag: 'span', content: '29€', styles: { desktop: { fontSize: '40px', fontWeight: '800', color: '#ffffff', marginBottom: '0' } }, children: [] },
                        { type: 'text', tag: 'span', content: '/mois', styles: { desktop: { fontSize: '14px', color: 'rgba(255,255,255,0.7)' } }, children: [] },
                      ],
                    },
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '0', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '20px' } },
                      children: [
                        { type: 'text', tag: 'span', content: '✓  Sites illimités', styles: { desktop: { fontSize: '14px', color: '#ffffff' } }, children: [] },
                        { type: 'text', tag: 'span', content: '✓  Pages illimitées', styles: { desktop: { fontSize: '14px', color: '#ffffff' } }, children: [] },
                        { type: 'text', tag: 'span', content: '✓  Domaine custom inclus', styles: { desktop: { fontSize: '14px', color: '#ffffff' } }, children: [] },
                        { type: 'text', tag: 'span', content: '✓  Tous les templates', styles: { desktop: { fontSize: '14px', color: '#ffffff' } }, children: [] },
                        { type: 'text', tag: 'span', content: '✓  Analytics avancés', styles: { desktop: { fontSize: '14px', color: '#ffffff' } }, children: [] },
                      ],
                    },
                    {
                      type: 'button',
                      tag: 'button',
                      content: 'Démarrer l\'essai gratuit',
                      styles: {
                        desktop: { width: '100%', padding: '12px', fontSize: '15px', fontWeight: '600', color: '#2563eb', backgroundColor: '#ffffff', border: 'none', borderRadius: '10px', cursor: 'pointer' },
                      },
                      children: [],
                    },
                  ],
                },
                // Business
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: {
                    desktop: {
                      padding: '36px',
                      backgroundColor: '#ffffff',
                      borderRadius: '20px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                    },
                  },
                  children: [
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '6px', padding: '0' } },
                      children: [
                        { type: 'heading', tag: 'h3', content: 'Business', styles: { desktop: { fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '0' } }, children: [] },
                        { type: 'text', tag: 'div', content: 'Pour les équipes et agences', styles: { desktop: { fontSize: '14px', color: '#64748b', marginBottom: '0' } }, children: [] },
                      ],
                    },
                    {
                      type: 'hflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', alignItems: 'baseline', gap: '4px', padding: '0' } },
                      children: [
                        { type: 'heading', tag: 'span', content: '79€', styles: { desktop: { fontSize: '40px', fontWeight: '800', color: '#0f172a', marginBottom: '0' } }, children: [] },
                        { type: 'text', tag: 'span', content: '/mois', styles: { desktop: { fontSize: '14px', color: '#64748b' } }, children: [] },
                      ],
                    },
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '0', borderTop: '1px solid #f1f5f9', paddingTop: '20px' } },
                      children: [
                        { type: 'text', tag: 'span', content: '✓  Tout le plan Pro', styles: { desktop: { fontSize: '14px', color: '#334155' } }, children: [] },
                        { type: 'text', tag: 'span', content: '✓  10 membres d\'équipe', styles: { desktop: { fontSize: '14px', color: '#334155' } }, children: [] },
                        { type: 'text', tag: 'span', content: '✓  Marque blanche', styles: { desktop: { fontSize: '14px', color: '#334155' } }, children: [] },
                        { type: 'text', tag: 'span', content: '✓  API & Intégrations', styles: { desktop: { fontSize: '14px', color: '#334155' } }, children: [] },
                        { type: 'text', tag: 'span', content: '✓  Support prioritaire', styles: { desktop: { fontSize: '14px', color: '#334155' } }, children: [] },
                      ],
                    },
                    {
                      type: 'button',
                      tag: 'button',
                      content: 'Contacter les ventes',
                      styles: {
                        desktop: { width: '100%', padding: '12px', fontSize: '15px', fontWeight: '600', color: '#0f172a', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '10px', cursor: 'pointer' },
                      },
                      children: [],
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
