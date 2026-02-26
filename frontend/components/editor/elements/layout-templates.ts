import {
  LucideIcon,
  Menu,
  LayoutGrid,
  Mail,
  Megaphone,
  Copyright,
  Rocket,
  SplitSquareHorizontal,
  Sparkles,
  DollarSign,
  Users,
  Star,
  MessageSquare,
  Zap,
  BarChart2,
  Globe,
  Image,
  Layers,
  List,
  ArrowRight,
} from 'lucide-react';

export interface LayoutTemplate {
  id: string;
  label: string;
  category: string;
  icon: LucideIcon;
  template: any;
}

// ─────────────────────────────────────────────
// COULEURS & TOKENS GLOBAUX (cohérence visuelle)
// ─────────────────────────────────────────────
// Primaire  : #2563eb (bleu professionnel)
// Accentué  : #7c3aed (violet)
// Neutre dk : #0f172a / #1e293b
// Neutre md : #475569 / #94a3b8
// Neutre lt : #f1f5f9 / #ffffff
// Success   : #10b981
// Warning   : #f59e0b

export const LAYOUT_TEMPLATES: LayoutTemplate[] = [

  // ══════════════════════════════════════════════
  // HEADERS
  // ══════════════════════════════════════════════

  {
    id: 'header-nav-light',
    label: 'Header Clair',
    category: 'Header',
    icon: Menu,
    template: {
      type: 'section',
      tag: 'header',
      styles: {
        desktop: {
          display: 'block',
          width: '100%',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: '0',
          zIndex: '100',
        },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: {
            desktop: {
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 32px',
              height: '68px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
            tablet: { padding: '0 20px' },
            mobile: { padding: '0 16px' },
          },
          children: [
            // Logo
            {
              type: 'heading',
              tag: 'span',
              content: 'Votre Marque',
              styles: {
                desktop: {
                  fontSize: '22px',
                  fontWeight: '800',
                  color: '#2563eb',
                  letterSpacing: '-0.02em',
                  cursor: 'pointer',
                },
              },
              children: [],
            },
            // Nav
            {
              type: 'navbar',
              tag: 'nav',
              styles: {
                desktop: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                },
                mobile: { display: 'none' },
              },
              children: [
                {
                  type: 'text-link',
                  tag: 'a',
                  content: 'Accueil',
                  styles: {
                    desktop: {
                      padding: '8px 14px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#0f172a',
                      textDecoration: 'none',
                      borderRadius: '6px',
                    },
                  },
                  children: [],
                },
                {
                  type: 'text-link',
                  tag: 'a',
                  content: 'Fonctionnalités',
                  styles: {
                    desktop: {
                      padding: '8px 14px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#475569',
                      textDecoration: 'none',
                      borderRadius: '6px',
                    },
                  },
                  children: [],
                },
                {
                  type: 'text-link',
                  tag: 'a',
                  content: 'Tarifs',
                  styles: {
                    desktop: {
                      padding: '8px 14px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#475569',
                      textDecoration: 'none',
                      borderRadius: '6px',
                    },
                  },
                  children: [],
                },
                {
                  type: 'text-link',
                  tag: 'a',
                  content: 'Blog',
                  styles: {
                    desktop: {
                      padding: '8px 14px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#475569',
                      textDecoration: 'none',
                      borderRadius: '6px',
                    },
                  },
                  children: [],
                },
              ],
            },
            // Actions
            {
              type: 'hflex',
              tag: 'div',
              styles: {
                desktop: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0',
                },
                mobile: { display: 'none' },
              },
              children: [
                {
                  type: 'button',
                  tag: 'button',
                  content: 'Connexion',
                  styles: {
                    desktop: {
                      padding: '8px 18px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#475569',
                      backgroundColor: 'transparent',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    },
                  },
                  children: [],
                },
                {
                  type: 'button',
                  tag: 'button',
                  content: 'Essai gratuit →',
                  styles: {
                    desktop: {
                      padding: '8px 18px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#ffffff',
                      backgroundColor: '#2563eb',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    },
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
    id: 'header-nav-dark',
    label: 'Header Sombre',
    category: 'Header',
    icon: Menu,
    template: {
      type: 'section',
      tag: 'header',
      styles: {
        desktop: {
          display: 'block',
          width: '100%',
          backgroundColor: '#0f172a',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'sticky',
          top: '0',
          zIndex: '100',
        },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: {
            desktop: {
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 32px',
              height: '68px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
            tablet: { padding: '0 20px' },
            mobile: { padding: '0 16px' },
          },
          children: [
            // Logo
            {
              type: 'heading',
              tag: 'span',
              content: 'Votre Marque',
              styles: {
                desktop: {
                  fontSize: '22px',
                  fontWeight: '800',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  cursor: 'pointer',
                },
              },
              children: [],
            },
            // Nav
            {
              type: 'navbar',
              tag: 'nav',
              styles: {
                desktop: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                },
                mobile: { display: 'none' },
              },
              children: [
                {
                  type: 'text-link',
                  tag: 'a',
                  content: 'Accueil',
                  styles: {
                    desktop: {
                      padding: '8px 14px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#ffffff',
                      textDecoration: 'none',
                      borderRadius: '6px',
                    },
                  },
                  children: [],
                },
                {
                  type: 'text-link',
                  tag: 'a',
                  content: 'Fonctionnalités',
                  styles: {
                    desktop: {
                      padding: '8px 14px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#94a3b8',
                      textDecoration: 'none',
                      borderRadius: '6px',
                    },
                  },
                  children: [],
                },
                {
                  type: 'text-link',
                  tag: 'a',
                  content: 'Tarifs',
                  styles: {
                    desktop: {
                      padding: '8px 14px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#94a3b8',
                      textDecoration: 'none',
                      borderRadius: '6px',
                    },
                  },
                  children: [],
                },
                {
                  type: 'text-link',
                  tag: 'a',
                  content: 'Blog',
                  styles: {
                    desktop: {
                      padding: '8px 14px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#94a3b8',
                      textDecoration: 'none',
                      borderRadius: '6px',
                    },
                  },
                  children: [],
                },
              ],
            },
            // Actions
            {
              type: 'hflex',
              tag: 'div',
              styles: {
                desktop: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0',
                },
                mobile: { display: 'none' },
              },
              children: [
                {
                  type: 'button',
                  tag: 'button',
                  content: 'Connexion',
                  styles: {
                    desktop: {
                      padding: '8px 18px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#94a3b8',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    },
                  },
                  children: [],
                },
                {
                  type: 'button',
                  tag: 'button',
                  content: 'Commencer →',
                  styles: {
                    desktop: {
                      padding: '8px 18px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#ffffff',
                      backgroundColor: '#2563eb',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    },
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

  // ══════════════════════════════════════════════
  // HERO
  // ══════════════════════════════════════════════

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


  // ══════════════════════════════════════════════
  // BLOG
  // ══════════════════════════════════════════════

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
              [{
                type: 'vflex',
                tag: 'div',
                styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '16px', padding: '0', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' } },
                children: [
                  { type: 'div', tag: 'div', styles: { desktop: { width: '100%', height: '200px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, children: [{ type: 'text', tag: 'span', content: '📷 Image', styles: { desktop: { fontSize: '14px', color: '#94a3b8' } }, children: [] }] },
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
              }],
              [{
                type: 'vflex',
                tag: 'div',
                styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '16px', padding: '0', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' } },
                children: [
                  { type: 'div', tag: 'div', styles: { desktop: { width: '100%', height: '200px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, children: [{ type: 'text', tag: 'span', content: '📷 Image', styles: { desktop: { fontSize: '14px', color: '#94a3b8' } }, children: [] }] },
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
              }],
              [{
                type: 'vflex',
                tag: 'div',
                styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '16px', padding: '0', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' } },
                children: [
                  { type: 'div', tag: 'div', styles: { desktop: { width: '100%', height: '200px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, children: [{ type: 'text', tag: 'span', content: '📷 Image', styles: { desktop: { fontSize: '14px', color: '#94a3b8' } }, children: [] }] },
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
              }],
            ],
          },
        ],
      }],
    },
  },

  // ══════════════════════════════════════════════
  // GALLERY
  // ══════════════════════════════════════════════

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
              [{ type: 'div', tag: 'div', styles: { desktop: { width: '100%', height: '240px', backgroundColor: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } }, children: [{ type: 'text', tag: 'span', content: '🖼️', styles: { desktop: { fontSize: '32px' } }, children: [] }] }],
              [{ type: 'div', tag: 'div', styles: { desktop: { width: '100%', height: '240px', backgroundColor: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } }, children: [{ type: 'text', tag: 'span', content: '🖼️', styles: { desktop: { fontSize: '32px' } }, children: [] }] }],
              [{ type: 'div', tag: 'div', styles: { desktop: { width: '100%', height: '240px', backgroundColor: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } }, children: [{ type: 'text', tag: 'span', content: '🖼️', styles: { desktop: { fontSize: '32px' } }, children: [] }] }],
              [{ type: 'div', tag: 'div', styles: { desktop: { width: '100%', height: '240px', backgroundColor: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } }, children: [{ type: 'text', tag: 'span', content: '🖼️', styles: { desktop: { fontSize: '32px' } }, children: [] }] }],
              [{ type: 'div', tag: 'div', styles: { desktop: { width: '100%', height: '240px', backgroundColor: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } }, children: [{ type: 'text', tag: 'span', content: '🖼️', styles: { desktop: { fontSize: '32px' } }, children: [] }] }],
              [{ type: 'div', tag: 'div', styles: { desktop: { width: '100%', height: '240px', backgroundColor: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } }, children: [{ type: 'text', tag: 'span', content: '🖼️', styles: { desktop: { fontSize: '32px' } }, children: [] }] }],
              [{ type: 'div', tag: 'div', styles: { desktop: { width: '100%', height: '240px', backgroundColor: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } }, children: [{ type: 'text', tag: 'span', content: '🖼️', styles: { desktop: { fontSize: '32px' } }, children: [] }] }],
              [{ type: 'div', tag: 'div', styles: { desktop: { width: '100%', height: '240px', backgroundColor: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } }, children: [{ type: 'text', tag: 'span', content: '🖼️', styles: { desktop: { fontSize: '32px' } }, children: [] }] }],
            ],
          },
        ],
      }],
    },
  },

  // ══════════════════════════════════════════════
  // BANNER
  // ══════════════════════════════════════════════

  {
    id: 'banner-announcement',
    label: 'Bannière Annonce',
    category: 'Banner',
    icon: Megaphone,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: { display: 'block', padding: '12px 20px', backgroundColor: '#2563eb', textAlign: 'center' },
        mobile: { padding: '10px 16px' },
      },
      children: [{
        type: 'container',
        tag: 'div',
        styles: { desktop: { maxWidth: '1200px', margin: '0 auto' } },
        children: [{
          type: 'hflex',
          tag: 'div',
          styles: { desktop: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '0' }, mobile: { flexDirection: 'column', gap: '8px' } },
          children: [
            { type: 'text', tag: 'span', content: '🎉 Nouveau : Découvrez notre nouvelle fonctionnalité !', styles: { desktop: { fontSize: '14px', fontWeight: '500', color: '#ffffff' } }, children: [] },
            { type: 'text-link', tag: 'a', content: 'En savoir plus →', styles: { desktop: { fontSize: '14px', fontWeight: '600', color: '#ffffff', textDecoration: 'underline' } }, children: [] },
          ],
        }],
      }],
    },
  },


  // ══════════════════════════════════════════════
  // FEATURES
  // ══════════════════════════════════════════════

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

  // ══════════════════════════════════════════════
  // PRICING
  // ══════════════════════════════════════════════

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

  // ══════════════════════════════════════════════
  // TESTIMONIALS
  // ══════════════════════════════════════════════

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

  // ══════════════════════════════════════════════
  // CTA
  // ══════════════════════════════════════════════

  {
    id: 'cta-centered',
    label: 'CTA Centré',
    category: 'CTA',
    icon: Megaphone,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: {
          display: 'block',
          padding: '96px 20px',
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          textAlign: 'center',
        },
        tablet: { padding: '64px 20px' },
        mobile: { padding: '48px 16px' },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: { desktop: { maxWidth: '640px', margin: '0 auto' } },
          children: [
            {
              type: 'heading',
              tag: 'h2',
              content: 'Prêt à créer votre site de rêve ?',
              styles: {
                desktop: { fontSize: '44px', fontWeight: '800', color: '#ffffff', lineHeight: '1.15', letterSpacing: '-0.02em', marginBottom: '20px' },
                mobile: { fontSize: '32px' },
              },
              children: [],
            },
            {
              type: 'text',
              tag: 'div',
              content: 'Rejoignez des milliers d\'entrepreneurs qui ont déjà transformé leur présence digitale. Commencez gratuitement, sans carte bancaire.',
              styles: {
                desktop: { fontSize: '17px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.7', marginBottom: '40px' },
                mobile: { fontSize: '15px' },
              },
              children: [],
            },
            {
              type: 'hflex',
              tag: 'div',
              styles: {
                desktop: { display: 'flex', gap: '12px', justifyContent: 'center', padding: '0', marginBottom: '20px' },
                mobile: { flexDirection: 'column', alignItems: 'stretch' },
              },
              children: [
                {
                  type: 'button',
                  tag: 'button',
                  content: 'Créer mon site gratuitement',
                  styles: {
                    desktop: { padding: '15px 32px', fontSize: '16px', fontWeight: '700', color: '#2563eb', backgroundColor: '#ffffff', border: 'none', borderRadius: '10px', cursor: 'pointer' },
                  },
                  children: [],
                },
                {
                  type: 'button',
                  tag: 'button',
                  content: 'Voir une démo',
                  styles: {
                    desktop: { padding: '15px 32px', fontSize: '16px', fontWeight: '600', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', cursor: 'pointer' },
                  },
                  children: [],
                },
              ],
            },
            {
              type: 'text',
              tag: 'span',
              content: '✓ 14 jours d\'essai  ·  ✓ Sans carte bancaire  ·  ✓ Annulation à tout moment',
              styles: { desktop: { fontSize: '13px', color: 'rgba(255,255,255,0.6)' } },
              children: [],
            },
          ],
        },
      ],
    },
  },

  {
    id: 'cta-split',
    label: 'CTA Bandeau Split',
    category: 'CTA',
    icon: Megaphone,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: { display: 'block', padding: '72px 20px', backgroundColor: '#0f172a' },
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
              type: 'grid',
              tag: 'div',
              styles: {
                desktop: { display: 'grid', gridTemplateColumns: '1fr auto', gap: '48px', alignItems: 'center' },
                mobile: { gridTemplateColumns: '1fr', gap: '28px' },
              },
              children: [
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '8px', padding: '0' } },
                  children: [
                    {
                      type: 'heading',
                      tag: 'h2',
                      content: 'Passez à la vitesse supérieure',
                      styles: { desktop: { fontSize: '32px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0' }, mobile: { fontSize: '24px' } },
                      children: [],
                    },
                    {
                      type: 'text',
                      tag: 'div',
                      content: 'Publiez votre premier site aujourd\'hui et commencez à convertir vos visiteurs en clients.',
                      styles: { desktop: { fontSize: '16px', color: '#94a3b8', marginBottom: '0' } },
                      children: [],
                    },
                  ],
                },
                {
                  type: 'button',
                  tag: 'button',
                  content: 'Démarrer maintenant →',
                  styles: {
                    desktop: { padding: '14px 28px', fontSize: '15px', fontWeight: '600', color: '#ffffff', backgroundColor: '#2563eb', border: 'none', borderRadius: '10px', cursor: 'pointer', whiteSpace: 'nowrap' },
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

  // ══════════════════════════════════════════════
  // CONTACT
  // ══════════════════════════════════════════════

  {
    id: 'contact-split',
    label: 'Contact Split Info + Formulaire',
    category: 'Contact',
    icon: Mail,
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
              type: 'grid',
              tag: 'div',
              styles: {
                desktop: { display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '64px', alignItems: 'start' },
                tablet: { gridTemplateColumns: '1fr', gap: '40px' },
                mobile: { gridTemplateColumns: '1fr', gap: '32px' },
              },
              children: [
                // Info
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '28px', padding: '0' } },
                  children: [
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '0' } },
                      children: [
                        { type: 'heading', tag: 'h2', content: 'Parlons de votre projet', styles: { desktop: { fontSize: '36px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0' }, mobile: { fontSize: '28px' } }, children: [] },
                        { type: 'text', tag: 'div', content: 'Notre équipe est disponible pour répondre à toutes vos questions et vous accompagner dans la création de votre site.', styles: { desktop: { fontSize: '16px', color: '#475569', lineHeight: '1.7', marginBottom: '0' } }, children: [] },
                      ],
                    },
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '16px', padding: '0' } },
                      children: [
                        {
                          type: 'hflex',
                          tag: 'div',
                          styles: { desktop: { display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '0' } },
                          children: [
                            { type: 'div', tag: 'div', styles: { desktop: { width: '40px', height: '40px', backgroundColor: '#dbeafe', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0', fontSize: '18px' } }, children: [{ type: 'text', tag: 'span', content: '📧', styles: { desktop: { fontSize: '18px' } }, children: [] }] },
                            { type: 'vflex', tag: 'div', styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '2px', padding: '0' } }, children: [{ type: 'text', tag: 'span', content: 'Email', styles: { desktop: { fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' } }, children: [] }, { type: 'text', tag: 'span', content: 'contact@votresite.com', styles: { desktop: { fontSize: '15px', fontWeight: '500', color: '#0f172a' } }, children: [] }] },
                          ],
                        },
                        {
                          type: 'hflex',
                          tag: 'div',
                          styles: { desktop: { display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '0' } },
                          children: [
                            { type: 'div', tag: 'div', styles: { desktop: { width: '40px', height: '40px', backgroundColor: '#dcfce7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' } }, children: [{ type: 'text', tag: 'span', content: '📞', styles: { desktop: { fontSize: '18px' } }, children: [] }] },
                            { type: 'vflex', tag: 'div', styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '2px', padding: '0' } }, children: [{ type: 'text', tag: 'span', content: 'Téléphone', styles: { desktop: { fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' } }, children: [] }, { type: 'text', tag: 'span', content: '+229 XX XX XX XX', styles: { desktop: { fontSize: '15px', fontWeight: '500', color: '#0f172a' } }, children: [] }] },
                          ],
                        },
                        {
                          type: 'hflex',
                          tag: 'div',
                          styles: { desktop: { display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '0' } },
                          children: [
                            { type: 'div', tag: 'div', styles: { desktop: { width: '40px', height: '40px', backgroundColor: '#ede9fe', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' } }, children: [{ type: 'text', tag: 'span', content: '📍', styles: { desktop: { fontSize: '18px' } }, children: [] }] },
                            { type: 'vflex', tag: 'div', styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '2px', padding: '0' } }, children: [{ type: 'text', tag: 'span', content: 'Adresse', styles: { desktop: { fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' } }, children: [] }, { type: 'text', tag: 'span', content: 'Cotonou, Bénin', styles: { desktop: { fontSize: '15px', fontWeight: '500', color: '#0f172a' } }, children: [] }] },
                          ],
                        },
                      ],
                    },
                  ],
                },
                // Formulaire
                {
                  type: 'form',
                  tag: 'form',
                  styles: {
                    desktop: {
                      padding: '40px',
                      backgroundColor: '#ffffff',
                      borderRadius: '20px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                    },
                    mobile: { padding: '24px' },
                  },
                  children: [
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '18px', padding: '0' } },
                      children: [
                        {
                          type: 'grid',
                          tag: 'div',
                          styles: { desktop: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }, mobile: { gridTemplateColumns: '1fr' } },
                          children: [
                            { type: 'input', tag: 'input', attributes: { type: 'text', placeholder: 'Prénom' }, styles: { desktop: { padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', backgroundColor: '#f8fafc' } }, children: [] },
                            { type: 'input', tag: 'input', attributes: { type: 'text', placeholder: 'Nom' }, styles: { desktop: { padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', backgroundColor: '#f8fafc' } }, children: [] },
                          ],
                        },
                        { type: 'input', tag: 'input', attributes: { type: 'email', placeholder: 'Adresse email' }, styles: { desktop: { padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', backgroundColor: '#f8fafc' } }, children: [] },
                        { type: 'input', tag: 'input', attributes: { type: 'text', placeholder: 'Sujet' }, styles: { desktop: { padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', backgroundColor: '#f8fafc' } }, children: [] },
                        { type: 'textarea', tag: 'textarea', attributes: { placeholder: 'Décrivez votre projet...' }, styles: { desktop: { padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', minHeight: '130px', backgroundColor: '#f8fafc' } }, children: [] },
                        {
                          type: 'button',
                          tag: 'button',
                          content: 'Envoyer le message →',
                          styles: {
                            desktop: { padding: '14px', fontSize: '15px', fontWeight: '600', color: '#ffffff', backgroundColor: '#2563eb', border: 'none', borderRadius: '10px', cursor: 'pointer' },
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
      ],
    },
  },

  {
    id: 'contact-newsletter',
    label: 'Newsletter / Email Capture',
    category: 'Contact',
    icon: Mail,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: { display: 'block', padding: '72px 20px', backgroundColor: '#eff6ff' },
        tablet: { padding: '48px 20px' },
        mobile: { padding: '40px 16px' },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: { desktop: { maxWidth: '560px', margin: '0 auto', textAlign: 'center' } },
          children: [
            { type: 'heading', tag: 'h2', content: 'Restez informé des dernières nouveautés', styles: { desktop: { fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '12px' }, mobile: { fontSize: '24px' } }, children: [] },
            { type: 'text', tag: 'div', content: 'Recevez nos conseils, tutoriels et offres exclusives directement dans votre boîte mail.', styles: { desktop: { fontSize: '16px', color: '#475569', lineHeight: '1.65', marginBottom: '32px' } }, children: [] },
            {
              type: 'hflex',
              tag: 'div',
              styles: { desktop: { display: 'flex', gap: '8px', padding: '0' }, mobile: { flexDirection: 'column' } },
              children: [
                { type: 'input', tag: 'input', attributes: { type: 'email', placeholder: 'Votre adresse email' }, styles: { desktop: { flex: '1', padding: '13px 16px', border: '1px solid #bfdbfe', borderRadius: '10px', fontSize: '15px', backgroundColor: '#ffffff' } }, children: [] },
                { type: 'button', tag: 'button', content: "S'abonner", styles: { desktop: { padding: '13px 24px', fontSize: '15px', fontWeight: '600', color: '#ffffff', backgroundColor: '#2563eb', border: 'none', borderRadius: '10px', cursor: 'pointer', whiteSpace: 'nowrap' } }, children: [] },
              ],
            },
            { type: 'text', tag: 'span', content: 'Pas de spam. Désabonnement en 1 clic.', styles: { desktop: { display: 'block', marginTop: '12px', fontSize: '13px', color: '#64748b' } }, children: [] },
          ],
        },
      ],
    },
  },

  // ══════════════════════════════════════════════
  // TEAM
  // ══════════════════════════════════════════════

  {
    id: 'team-grid',
    label: 'Équipe Grille',
    category: 'Team',
    icon: Users,
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
              styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '0', marginBottom: '56px' } },
              children: [
                { type: 'heading', tag: 'h2', content: 'Notre équipe', styles: { desktop: { fontSize: '40px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0' }, mobile: { fontSize: '28px' } }, children: [] },
                { type: 'text', tag: 'div', content: 'Des experts passionnés au service de votre réussite digitale.', styles: { desktop: { fontSize: '17px', color: '#475569', marginBottom: '0' } }, children: [] },
              ],
            },
            {
              type: 'grid',
              tag: 'div',
              styles: {
                desktop: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' },
                tablet: { gridTemplateColumns: 'repeat(2, 1fr)' },
                mobile: { gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' },
              },
              children: [
                // Membre 1
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '24px 16px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' } },
                  children: [
                    { type: 'div', tag: 'div', styles: { desktop: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' } }, children: [{ type: 'text', tag: 'span', content: '👩‍💼', styles: { desktop: { fontSize: '28px' } }, children: [] }] },
                    { type: 'vflex', tag: 'div', styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '0' } }, children: [{ type: 'text', tag: 'span', content: 'Awa Diallo', styles: { desktop: { fontSize: '15px', fontWeight: '700', color: '#0f172a' } }, children: [] }, { type: 'text', tag: 'span', content: 'CEO & Fondatrice', styles: { desktop: { fontSize: '13px', color: '#64748b' } }, children: [] }] },
                  ],
                },
                // Membre 2
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '24px 16px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' } },
                  children: [
                    { type: 'div', tag: 'div', styles: { desktop: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, children: [{ type: 'text', tag: 'span', content: '👨‍💻', styles: { desktop: { fontSize: '28px' } }, children: [] }] },
                    { type: 'vflex', tag: 'div', styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '0' } }, children: [{ type: 'text', tag: 'span', content: 'Moussa Traoré', styles: { desktop: { fontSize: '15px', fontWeight: '700', color: '#0f172a' } }, children: [] }, { type: 'text', tag: 'span', content: 'Lead Developer', styles: { desktop: { fontSize: '13px', color: '#64748b' } }, children: [] }] },
                  ],
                },
                // Membre 3
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '24px 16px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' } },
                  children: [
                    { type: 'div', tag: 'div', styles: { desktop: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, children: [{ type: 'text', tag: 'span', content: '👩‍🎨', styles: { desktop: { fontSize: '28px' } }, children: [] }] },
                    { type: 'vflex', tag: 'div', styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '0' } }, children: [{ type: 'text', tag: 'span', content: 'Fatoumata Ba', styles: { desktop: { fontSize: '15px', fontWeight: '700', color: '#0f172a' } }, children: [] }, { type: 'text', tag: 'span', content: 'Head of Design', styles: { desktop: { fontSize: '13px', color: '#64748b' } }, children: [] }] },
                  ],
                },
                // Membre 4
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '24px 16px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' } },
                  children: [
                    { type: 'div', tag: 'div', styles: { desktop: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#fef9c3', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, children: [{ type: 'text', tag: 'span', content: '👨‍📊', styles: { desktop: { fontSize: '28px' } }, children: [] }] },
                    { type: 'vflex', tag: 'div', styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '0' } }, children: [{ type: 'text', tag: 'span', content: 'Issouf Coulibaly', styles: { desktop: { fontSize: '15px', fontWeight: '700', color: '#0f172a' } }, children: [] }, { type: 'text', tag: 'span', content: 'Growth Manager', styles: { desktop: { fontSize: '13px', color: '#64748b' } }, children: [] }] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },

  // ══════════════════════════════════════════════
  // FOOTER
  // ══════════════════════════════════════════════

  {
    id: 'footer-full',
    label: 'Footer Complet',
    category: 'Footer',
    icon: Copyright,
    template: {
      type: 'section',
      tag: 'footer',
      styles: {
        desktop: { display: 'block', padding: '72px 20px 32px', backgroundColor: '#0f172a' },
        tablet: { padding: '48px 20px 24px' },
        mobile: { padding: '40px 16px 20px' },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: { desktop: { maxWidth: '1200px', margin: '0 auto' } },
          children: [
            // Colonnes
            {
              type: 'grid',
              tag: 'div',
              styles: {
                desktop: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' },
                tablet: { gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' },
                mobile: { gridTemplateColumns: '1fr', gap: '28px' },
              },
              children: [
                // Branding
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '16px', padding: '0' } },
                  children: [
                    { type: 'heading', tag: 'div', content: 'Votre Marque', styles: { desktop: { fontSize: '22px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0' } }, children: [] },
                    { type: 'text', tag: 'div', content: 'La plateforme CMS la plus intuitive pour créer des sites professionnels sans compétences techniques.', styles: { desktop: { fontSize: '14px', color: '#64748b', lineHeight: '1.7', maxWidth: '260px', marginBottom: '0' } }, children: [] },
                    {
                      type: 'hflex',
                      tag: 'div',
                      styles: { desktop: { display: 'flex', gap: '10px', padding: '0' } },
                      children: [
                        { type: 'div', tag: 'div', styles: { desktop: { width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' } }, children: [{ type: 'text', tag: 'span', content: '𝕏', styles: { desktop: { fontSize: '14px', color: '#94a3b8' } }, children: [] }] },
                        { type: 'div', tag: 'div', styles: { desktop: { width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' } }, children: [{ type: 'text', tag: 'span', content: 'in', styles: { desktop: { fontSize: '14px', fontWeight: '700', color: '#94a3b8' } }, children: [] }] },
                        { type: 'div', tag: 'div', styles: { desktop: { width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' } }, children: [{ type: 'text', tag: 'span', content: 'f', styles: { desktop: { fontSize: '15px', fontWeight: '700', color: '#94a3b8' } }, children: [] }] },
                      ],
                    },
                  ],
                },
                // Produit
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '0' } },
                  children: [
                    { type: 'text', tag: 'span', content: 'Produit', styles: { desktop: { fontSize: '13px', fontWeight: '700', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' } }, children: [] },
                    { type: 'text-link', tag: 'a', content: 'Fonctionnalités', styles: { desktop: { fontSize: '14px', color: '#64748b', textDecoration: 'none', display: 'block' } }, children: [] },
                    { type: 'text-link', tag: 'a', content: 'Tarifs', styles: { desktop: { fontSize: '14px', color: '#64748b', textDecoration: 'none', display: 'block' } }, children: [] },
                    { type: 'text-link', tag: 'a', content: 'Templates', styles: { desktop: { fontSize: '14px', color: '#64748b', textDecoration: 'none', display: 'block' } }, children: [] },
                    { type: 'text-link', tag: 'a', content: 'Changelog', styles: { desktop: { fontSize: '14px', color: '#64748b', textDecoration: 'none', display: 'block' } }, children: [] },
                  ],
                },
                // Ressources
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '0' } },
                  children: [
                    { type: 'text', tag: 'span', content: 'Ressources', styles: { desktop: { fontSize: '13px', fontWeight: '700', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' } }, children: [] },
                    { type: 'text-link', tag: 'a', content: 'Documentation', styles: { desktop: { fontSize: '14px', color: '#64748b', textDecoration: 'none', display: 'block' } }, children: [] },
                    { type: 'text-link', tag: 'a', content: 'Blog', styles: { desktop: { fontSize: '14px', color: '#64748b', textDecoration: 'none', display: 'block' } }, children: [] },
                    { type: 'text-link', tag: 'a', content: 'Support', styles: { desktop: { fontSize: '14px', color: '#64748b', textDecoration: 'none', display: 'block' } }, children: [] },
                    { type: 'text-link', tag: 'a', content: 'Status', styles: { desktop: { fontSize: '14px', color: '#64748b', textDecoration: 'none', display: 'block' } }, children: [] },
                  ],
                },
                // Entreprise
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '0' } },
                  children: [
                    { type: 'text', tag: 'span', content: 'Entreprise', styles: { desktop: { fontSize: '13px', fontWeight: '700', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' } }, children: [] },
                    { type: 'text-link', tag: 'a', content: 'À propos', styles: { desktop: { fontSize: '14px', color: '#64748b', textDecoration: 'none', display: 'block' } }, children: [] },
                    { type: 'text-link', tag: 'a', content: 'Carrières', styles: { desktop: { fontSize: '14px', color: '#64748b', textDecoration: 'none', display: 'block' } }, children: [] },
                    { type: 'text-link', tag: 'a', content: 'Contact', styles: { desktop: { fontSize: '14px', color: '#64748b', textDecoration: 'none', display: 'block' } }, children: [] },
                  ],
                },
              ],
            },
            // Bottom bar
            {
              type: 'hflex',
              tag: 'div',
              styles: {
                desktop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0 0', borderTop: '1px solid rgba(255,255,255,0.06)' },
                mobile: { flexDirection: 'column', gap: '12px', textAlign: 'center' },
              },
              children: [
                { type: 'text', tag: 'span', content: '© 2025 Votre Marque. Tous droits réservés.', styles: { desktop: { fontSize: '13px', color: '#475569' } }, children: [] },
                {
                  type: 'hflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', gap: '20px', padding: '0' } },
                  children: [
                    { type: 'text-link', tag: 'a', content: 'Confidentialité', styles: { desktop: { fontSize: '13px', color: '#475569', textDecoration: 'none' } }, children: [] },
                    { type: 'text-link', tag: 'a', content: 'CGU', styles: { desktop: { fontSize: '13px', color: '#475569', textDecoration: 'none' } }, children: [] },
                    { type: 'text-link', tag: 'a', content: 'Cookies', styles: { desktop: { fontSize: '13px', color: '#475569', textDecoration: 'none' } }, children: [] },
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
    id: 'footer-minimal',
    label: 'Footer Minimal',
    category: 'Footer',
    icon: Copyright,
    template: {
      type: 'section',
      tag: 'footer',
      styles: {
        desktop: { display: 'block', padding: '40px 20px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' },
        mobile: { padding: '28px 16px' },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: { desktop: { maxWidth: '1200px', margin: '0 auto' } },
          children: [
            {
              type: 'hflex',
              tag: 'div',
              styles: {
                desktop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0' },
                mobile: { flexDirection: 'column', gap: '16px', textAlign: 'center' },
              },
              children: [
                { type: 'text', tag: 'span', content: 'Votre Marque', styles: { desktop: { fontSize: '18px', fontWeight: '800', color: '#2563eb' } }, children: [] },
                {
                  type: 'hflex',
                  tag: 'div',
                  styles: { desktop: { display: 'flex', gap: '24px', padding: '0' } },
                  children: [
                    { type: 'text-link', tag: 'a', content: 'Accueil', styles: { desktop: { fontSize: '14px', color: '#475569', textDecoration: 'none' } }, children: [] },
                    { type: 'text-link', tag: 'a', content: 'Fonctionnalités', styles: { desktop: { fontSize: '14px', color: '#475569', textDecoration: 'none' } }, children: [] },
                    { type: 'text-link', tag: 'a', content: 'Tarifs', styles: { desktop: { fontSize: '14px', color: '#475569', textDecoration: 'none' } }, children: [] },
                    { type: 'text-link', tag: 'a', content: 'Contact', styles: { desktop: { fontSize: '14px', color: '#475569', textDecoration: 'none' } }, children: [] },
                  ],
                },
                { type: 'text', tag: 'span', content: '© 2025 Votre Marque', styles: { desktop: { fontSize: '13px', color: '#94a3b8' } }, children: [] },
              ],
            },
          ],
        },
      ],
    },
  },


];

