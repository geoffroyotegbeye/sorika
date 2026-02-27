import { LucideIcon, Rocket, Sparkles, SplitSquareHorizontal } from 'lucide-react';

export interface LayoutTemplate {
  id: string;
  label: string;
  category: string;
  icon: LucideIcon;
  template: any;
}

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
        desktop: {
          display: 'block',
          padding: '120px 20px 100px',
          backgroundColor: '#f8fafc',
          textAlign: 'center',
        },
        tablet: { padding: '80px 20px' },
        mobile: { padding: '60px 16px' },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: {
            desktop: { maxWidth: '760px', margin: '0 auto' },
          },
          children: [
            // Badge
            {
              type: 'hflex',
              tag: 'div',
              styles: {
                desktop: {
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '99px',
                  marginBottom: '28px',
                },
              },
              children: [
                {
                  type: 'text',
                  tag: 'span',
                  content: '✦ Nouveau — Version 2.0 disponible',
                  styles: {
                    desktop: {
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#2563eb',
                    },
                  },
                  children: [],
                },
              ],
            },
            // Titre
            {
              type: 'heading',
              tag: 'h1',
              content: 'Créez des sites web professionnels en quelques minutes',
              styles: {
                desktop: {
                  fontSize: '56px',
                  fontWeight: '900',
                  color: '#0f172a',
                  lineHeight: '1.1',
                  letterSpacing: '-0.03em',
                  marginBottom: '24px',
                },
                tablet: { fontSize: '40px' },
                mobile: { fontSize: '32px' },
              },
              children: [],
            },
            // Sous-titre
            {
              type: 'text',
              tag: 'div',
              content: 'Notre CMS intuitif vous permet de construire, personnaliser et publier votre site sans une ligne de code. Rejoignez plus de 10 000 entrepreneurs qui nous font confiance.',
              styles: {
                desktop: {
                  fontSize: '18px',
                  color: '#475569',
                  lineHeight: '1.75',
                  marginBottom: '40px',
                  maxWidth: '600px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                },
                mobile: { fontSize: '16px' },
              },
              children: [],
            },
            // Boutons
            {
              type: 'hflex',
              tag: 'div',
              styles: {
                desktop: {
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '0',
                  marginBottom: '48px',
                },
                mobile: { flexDirection: 'column', alignItems: 'stretch' },
              },
              children: [
                {
                  type: 'button',
                  tag: 'button',
                  content: 'Commencer gratuitement',
                  styles: {
                    desktop: {
                      padding: '14px 28px',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#ffffff',
                      backgroundColor: '#2563eb',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                    },
                  },
                  children: [],
                },
                {
                  type: 'button',
                  tag: 'button',
                  content: '▶  Voir la démo',
                  styles: {
                    desktop: {
                      padding: '14px 28px',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#0f172a',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      cursor: 'pointer',
                    },
                  },
                  children: [],
                },
              ],
            },
            // Preuves sociales
            {
              type: 'hflex',
              tag: 'div',
              styles: {
                desktop: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '0',
                },
              },
              children: [
                {
                  type: 'text',
                  tag: 'span',
                  content: '⭐⭐⭐⭐⭐',
                  styles: { desktop: { fontSize: '14px' } },
                  children: [],
                },
                {
                  type: 'text',
                  tag: 'span',
                  content: '4.9/5 — Plus de 2 000 avis vérifiés',
                  styles: {
                    desktop: { fontSize: '14px', color: '#64748b', fontWeight: '500' },
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: 'hero-split',
    label: 'Hero Split Texte + Image',
    category: 'Hero',
    icon: SplitSquareHorizontal,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: { display: 'block', padding: '80px 20px', backgroundColor: '#ffffff' },
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
                desktop: {
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '64px',
                  alignItems: 'center',
                },
                tablet: { gridTemplateColumns: '1fr', gap: '40px' },
                mobile: { gridTemplateColumns: '1fr', gap: '32px' },
              },
              children: [
                // Colonne texte
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: {
                    desktop: { display: 'flex', flexDirection: 'column', gap: '24px', padding: '0' },
                  },
                  children: [
                    {
                      type: 'text',
                      tag: 'span',
                      content: '🚀  La solution N°1 pour les entrepreneurs',
                      styles: {
                        desktop: {
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#2563eb',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                        },
                      },
                      children: [],
                    },
                    {
                      type: 'heading',
                      tag: 'h1',
                      content: 'Développez votre activité avec un site qui convertit',
                      styles: {
                        desktop: {
                          fontSize: '46px',
                          fontWeight: '900',
                          color: '#0f172a',
                          lineHeight: '1.15',
                          letterSpacing: '-0.02em',
                          marginBottom: '0',
                        },
                        tablet: { fontSize: '36px' },
                        mobile: { fontSize: '30px' },
                      },
                      children: [],
                    },
                    {
                      type: 'text',
                      tag: 'div',
                      content: 'Créez, personnalisez et publiez votre site en toute autonomie. Notre éditeur drag & drop vous donne le contrôle total sans complexité technique.',
                      styles: {
                        desktop: {
                          fontSize: '17px',
                          color: '#475569',
                          lineHeight: '1.75',
                          marginBottom: '0',
                        },
                      },
                      children: [],
                    },
                    // Checklist
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: {
                        desktop: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '0' },
                      },
                      children: [
                        {
                          type: 'text',
                          tag: 'span',
                          content: '✓  Aucune compétence technique requise',
                          styles: { desktop: { fontSize: '15px', color: '#334155', fontWeight: '500' } },
                          children: [],
                        },
                        {
                          type: 'text',
                          tag: 'span',
                          content: '✓  Hébergement & SSL inclus',
                          styles: { desktop: { fontSize: '15px', color: '#334155', fontWeight: '500' } },
                          children: [],
                        },
                        {
                          type: 'text',
                          tag: 'span',
                          content: '✓  Support client 7j/7',
                          styles: { desktop: { fontSize: '15px', color: '#334155', fontWeight: '500' } },
                          children: [],
                        },
                      ],
                    },
                    // CTA
                    {
                      type: 'hflex',
                      tag: 'div',
                      styles: {
                        desktop: { display: 'flex', gap: '12px', padding: '0', alignItems: 'center' },
                        mobile: { flexDirection: 'column', alignItems: 'stretch' },
                      },
                      children: [
                        {
                          type: 'button',
                          tag: 'button',
                          content: 'Démarrer maintenant',
                          styles: {
                            desktop: {
                              padding: '14px 28px',
                              fontSize: '15px',
                              fontWeight: '600',
                              color: '#ffffff',
                              backgroundColor: '#2563eb',
                              border: 'none',
                              borderRadius: '10px',
                              cursor: 'pointer',
                            },
                          },
                          children: [],
                        },
                        {
                          type: 'text',
                          tag: 'span',
                          content: 'Essai 14 jours gratuit, sans CB',
                          styles: { desktop: { fontSize: '13px', color: '#64748b' } },
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                // Colonne image
                {
                  type: 'div',
                  tag: 'div',
                  styles: {
                    desktop: {
                      width: '100%',
                      height: '480px',
                      background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #e2e8f0',
                    },
                    tablet: { height: '320px' },
                    mobile: { height: '240px' },
                  },
                  children: [
                    {
                      type: 'text',
                      tag: 'span',
                      content: '🖼  Votre image ici',
                      styles: {
                        desktop: { fontSize: '16px', color: '#94a3b8', fontWeight: '500' },
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

  {
    id: 'hero-gradient-dark',
    label: 'Hero Gradient Sombre',
    category: 'Hero',
    icon: Sparkles,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: {
          display: 'block',
          padding: '130px 20px 110px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          textAlign: 'center',
        },
        tablet: { padding: '80px 20px' },
        mobile: { padding: '60px 16px' },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: { desktop: { maxWidth: '820px', margin: '0 auto' } },
          children: [
            {
              type: 'text',
              tag: 'span',
              content: '✦  Plateforme tout-en-un',
              styles: {
                desktop: {
                  display: 'inline-block',
                  padding: '6px 16px',
                  backgroundColor: 'rgba(99,102,241,0.15)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: '99px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#a5b4fc',
                  marginBottom: '32px',
                },
              },
              children: [],
            },
            {
              type: 'heading',
              tag: 'h1',
              content: 'Le CMS qui transforme votre vision en réalité digitale',
              styles: {
                desktop: {
                  fontSize: '60px',
                  fontWeight: '900',
                  color: '#ffffff',
                  lineHeight: '1.1',
                  letterSpacing: '-0.03em',
                  marginBottom: '24px',
                },
                tablet: { fontSize: '42px' },
                mobile: { fontSize: '32px' },
              },
              children: [],
            },
            {
              type: 'text',
              tag: 'div',
              content: 'Construisez des expériences web exceptionnelles avec notre éditeur visuel puissant. Zéro code. Résultats professionnels.',
              styles: {
                desktop: {
                  fontSize: '18px',
                  color: '#94a3b8',
                  lineHeight: '1.75',
                  marginBottom: '48px',
                },
                mobile: { fontSize: '16px' },
              },
              children: [],
            },
            {
              type: 'hflex',
              tag: 'div',
              styles: {
                desktop: {
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                  padding: '0',
                  marginBottom: '56px',
                },
                mobile: { flexDirection: 'column', alignItems: 'stretch' },
              },
              children: [
                {
                  type: 'button',
                  tag: 'button',
                  content: 'Créer mon site gratuitement',
                  styles: {
                    desktop: {
                      padding: '15px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#ffffff',
                      backgroundColor: '#4f46e5',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                    },
                  },
                  children: [],
                },
                {
                  type: 'button',
                  tag: 'button',
                  content: 'Voir les exemples',
                  styles: {
                    desktop: {
                      padding: '15px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#e2e8f0',
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                    },
                  },
                  children: [],
                },
              ],
            },
            // Stats
            {
              type: 'grid',
              tag: 'div',
              styles: {
                desktop: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '24px',
                  padding: '32px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.06)',
                },
                mobile: { gridTemplateColumns: '1fr', padding: '20px' },
              },
              children: [
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '0', textAlign: 'center' } },
                  children: [
                    {
                      type: 'heading',
                      tag: 'div',
                      content: '10 000+',
                      styles: { desktop: { fontSize: '28px', fontWeight: '800', color: '#ffffff', marginBottom: '0' } },
                      children: [],
                    },
                    {
                      type: 'text',
                      tag: 'span',
                      content: 'Clients actifs',
                      styles: { desktop: { fontSize: '13px', color: '#64748b' } },
                      children: [],
                    },
                  ],
                },
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '0', textAlign: 'center' } },
                  children: [
                    {
                      type: 'heading',
                      tag: 'div',
                      content: '98%',
                      styles: { desktop: { fontSize: '28px', fontWeight: '800', color: '#ffffff', marginBottom: '0' } },
                      children: [],
                    },
                    {
                      type: 'text',
                      tag: 'span',
                      content: 'Taux de satisfaction',
                      styles: { desktop: { fontSize: '13px', color: '#64748b' } },
                      children: [],
                    },
                  ],
                },
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '0', textAlign: 'center' } },
                  children: [
                    {
                      type: 'heading',
                      tag: 'div',
                      content: '3 min',
                      styles: { desktop: { fontSize: '28px', fontWeight: '800', color: '#ffffff', marginBottom: '0' } },
                      children: [],
                    },
                    {
                      type: 'text',
                      tag: 'span',
                      content: 'Pour publier un site',
                      styles: { desktop: { fontSize: '13px', color: '#64748b' } },
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