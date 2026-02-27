import { LayoutGrid, LucideIcon } from 'lucide-react';

export interface LayoutTemplate {
  id: string;
  label: string;
  category: string;
  icon: LucideIcon;
  template: any;
}

export const FEATURES_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'features-3-cols',
    label: 'Fonctionnalités 3 Colonnes',
    category: 'Features',
    icon: LayoutGrid,
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
          styles: { desktop: { maxWidth: '1200px', margin: '0 auto' } },
          children: [
            // En-tête section
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
                  marginBottom: '64px',
                },
              },
              children: [
                {
                  type: 'text',
                  tag: 'span',
                  content: 'FONCTIONNALITÉS',
                  styles: {
                    desktop: {
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#2563eb',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    },
                  },
                  children: [],
                },
                {
                  type: 'heading',
                  tag: 'h2',
                  content: 'Tout ce dont vous avez besoin pour réussir en ligne',
                  styles: {
                    desktop: {
                      fontSize: '40px',
                      fontWeight: '800',
                      color: '#0f172a',
                      maxWidth: '600px',
                      lineHeight: '1.2',
                      letterSpacing: '-0.02em',
                      marginBottom: '0',
                    },
                    tablet: { fontSize: '32px' },
                    mobile: { fontSize: '26px' },
                  },
                  children: [],
                },
                {
                  type: 'text',
                  tag: 'div',
                  content: 'Une suite complète d\'outils pour créer, gérer et développer votre présence en ligne.',
                  styles: {
                    desktop: {
                      fontSize: '17px',
                      color: '#475569',
                      maxWidth: '520px',
                      lineHeight: '1.7',
                      marginBottom: '0',
                    },
                  },
                  children: [],
                },
              ],
            },
            // Grille 3 colonnes
            {
              type: 'grid',
              tag: 'div',
              styles: {
                desktop: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '28px',
                },
                tablet: { gridTemplateColumns: 'repeat(2, 1fr)' },
                mobile: { gridTemplateColumns: '1fr' },
              },
              children: [
                // Card 1
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: {
                    desktop: {
                      padding: '32px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    },
                  },
                  children: [
                    {
                      type: 'div',
                      tag: 'div',
                      styles: {
                        desktop: {
                          width: '48px',
                          height: '48px',
                          backgroundColor: '#dbeafe',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '22px',
                        },
                      },
                      children: [
                        { type: 'text', tag: 'span', content: '⚡', styles: { desktop: { fontSize: '22px' } }, children: [] },
                      ],
                    },
                    {
                      type: 'heading',
                      tag: 'h3',
                      content: 'Ultra rapide',
                      styles: {
                        desktop: { fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '0' },
                      },
                      children: [],
                    },
                    {
                      type: 'text',
                      tag: 'div',
                      content: 'Sites optimisés Core Web Vitals avec un score Lighthouse > 95. Vos visiteurs ne patientent jamais.',
                      styles: {
                        desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.65', marginBottom: '0' },
                      },
                      children: [],
                    },
                  ],
                },
                // Card 2
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: {
                    desktop: {
                      padding: '32px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    },
                  },
                  children: [
                    {
                      type: 'div',
                      tag: 'div',
                      styles: {
                        desktop: {
                          width: '48px',
                          height: '48px',
                          backgroundColor: '#ede9fe',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                      },
                      children: [
                        { type: 'text', tag: 'span', content: '🎨', styles: { desktop: { fontSize: '22px' } }, children: [] },
                      ],
                    },
                    {
                      type: 'heading',
                      tag: 'h3',
                      content: 'Design professionnel',
                      styles: {
                        desktop: { fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '0' },
                      },
                      children: [],
                    },
                    {
                      type: 'text',
                      tag: 'div',
                      content: 'Des dizaines de templates conçus par des designers experts, entièrement personnalisables selon votre identité.',
                      styles: {
                        desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.65', marginBottom: '0' },
                      },
                      children: [],
                    },
                  ],
                },
                // Card 3
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: {
                    desktop: {
                      padding: '32px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    },
                  },
                  children: [
                    {
                      type: 'div',
                      tag: 'div',
                      styles: {
                        desktop: {
                          width: '48px',
                          height: '48px',
                          backgroundColor: '#dcfce7',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                      },
                      children: [
                        { type: 'text', tag: 'span', content: '📈', styles: { desktop: { fontSize: '22px' } }, children: [] },
                      ],
                    },
                    {
                      type: 'heading',
                      tag: 'h3',
                      content: 'SEO intégré',
                      styles: {
                        desktop: { fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '0' },
                      },
                      children: [],
                    },
                    {
                      type: 'text',
                      tag: 'div',
                      content: 'Balises méta, sitemap automatique, Open Graph et données structurées pour dominer les résultats Google.',
                      styles: {
                        desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.65', marginBottom: '0' },
                      },
                      children: [],
                    },
                  ],
                },
                // Card 4
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: {
                    desktop: {
                      padding: '32px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    },
                  },
                  children: [
                    {
                      type: 'div',
                      tag: 'div',
                      styles: {
                        desktop: {
                          width: '48px',
                          height: '48px',
                          backgroundColor: '#fef9c3',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                      },
                      children: [
                        { type: 'text', tag: 'span', content: '📱', styles: { desktop: { fontSize: '22px' } }, children: [] },
                      ],
                    },
                    {
                      type: 'heading',
                      tag: 'h3',
                      content: '100% Responsive',
                      styles: {
                        desktop: { fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '0' },
                      },
                      children: [],
                    },
                    {
                      type: 'text',
                      tag: 'div',
                      content: 'Vos pages s\'adaptent parfaitement à tous les écrans : mobile, tablette et desktop.',
                      styles: {
                        desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.65', marginBottom: '0' },
                      },
                      children: [],
                    },
                  ],
                },
                // Card 5
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: {
                    desktop: {
                      padding: '32px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    },
                  },
                  children: [
                    {
                      type: 'div',
                      tag: 'div',
                      styles: {
                        desktop: {
                          width: '48px',
                          height: '48px',
                          backgroundColor: '#ffe4e6',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                      },
                      children: [
                        { type: 'text', tag: 'span', content: '🔒', styles: { desktop: { fontSize: '22px' } }, children: [] },
                      ],
                    },
                    {
                      type: 'heading',
                      tag: 'h3',
                      content: 'Sécurité maximale',
                      styles: {
                        desktop: { fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '0' },
                      },
                      children: [],
                    },
                    {
                      type: 'text',
                      tag: 'div',
                      content: 'SSL/TLS, sauvegardes automatiques quotidiennes et protection DDoS incluses dans tous les plans.',
                      styles: {
                        desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.65', marginBottom: '0' },
                      },
                      children: [],
                    },
                  ],
                },
                // Card 6
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: {
                    desktop: {
                      padding: '32px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    },
                  },
                  children: [
                    {
                      type: 'div',
                      tag: 'div',
                      styles: {
                        desktop: {
                          width: '48px',
                          height: '48px',
                          backgroundColor: '#e0f2fe',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                      },
                      children: [
                        { type: 'text', tag: 'span', content: '🤝', styles: { desktop: { fontSize: '22px' } }, children: [] },
                      ],
                    },
                    {
                      type: 'heading',
                      tag: 'h3',
                      content: 'Support humain',
                      styles: {
                        desktop: { fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '0' },
                      },
                      children: [],
                    },
                    {
                      type: 'text',
                      tag: 'div',
                      content: 'Une équipe dédiée disponible par chat, email ou téléphone pour vous accompagner à chaque étape.',
                      styles: {
                        desktop: { fontSize: '15px', color: '#64748b', lineHeight: '1.65', marginBottom: '0' },
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