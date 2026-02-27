import { LucideIcon, Menu } from 'lucide-react';

export interface LayoutTemplate {
  id: string;
  label: string;
  category: string;
  icon: LucideIcon;
  template: any;
}

export const HEADER_TEMPLATES: LayoutTemplate[] = [
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
];