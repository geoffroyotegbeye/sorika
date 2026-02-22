import { LucideIcon, Menu, LayoutGrid, Zap, Mail, Megaphone, Copyright, Rocket, SplitSquareHorizontal, Sparkles } from 'lucide-react';

export interface LayoutTemplate {
  id: string;
  label: string;
  category: string;
  icon: LucideIcon;
  template: any;
}

export const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'header-1',
    label: 'Header avec Navigation',
    category: 'Header',
    icon: Menu,
    template: {
      type: 'header',
      tag: 'header',
      styles: {
        desktop: {
          display: 'block',
          width: '100%',
          padding: '16px 20px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: '0',
          zIndex: '1000',
        },
        tablet: {
          padding: '12px 16px',
        },
        mobile: {
          padding: '10px 12px',
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
              padding: '0',
            },
          },
          children: [
            {
              type: 'hflex',
              tag: 'div',
              styles: {
                desktop: {
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '0',
                  position: 'relative',
                },
              },
              children: [
                {
                  type: 'heading',
                  tag: 'h1',
                  content: 'MonLogo',
                  styles: {
                    desktop: {
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#3b82f6',
                      margin: '0',
                    },
                    tablet: {
                      fontSize: '20px',
                    },
                    mobile: {
                      fontSize: '18px',
                    },
                  },
                  children: [],
                },
                {
                  type: 'button',
                  tag: 'button',
                  content: '☰',
                  attributes: { 'aria-label': 'Menu' },
                  styles: {
                    desktop: {
                      display: 'none',
                    },
                    tablet: {
                      display: 'none',
                    },
                    mobile: {
                      display: 'block',
                      padding: '8px 12px',
                      backgroundColor: 'transparent',
                      color: '#1e293b',
                      borderTop: '1px solid #cbd5e1',
                      borderRight: '1px solid #cbd5e1',
                      borderBottom: '1px solid #cbd5e1',
                      borderLeft: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '20px',
                      cursor: 'pointer',
                      lineHeight: '1',
                    },
                  },
                  children: [],
                },
                {
                  type: 'navbar',
                  tag: 'nav',
                  styles: {
                    desktop: {
                      display: 'flex',
                      gap: '24px',
                      alignItems: 'center',
                      padding: '0',
                      borderTop: 'none',
                      borderRight: 'none',
                      borderBottom: 'none',
                      borderLeft: 'none',
                    },
                    tablet: {
                      gap: '16px',
                    },
                    mobile: {
                      display: 'none',
                      flexDirection: 'column',
                      gap: '12px',
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      right: '0',
                      backgroundColor: '#ffffff',
                      padding: '16px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      borderTop: '1px solid #e2e8f0',
                    },
                  },
                  children: [
                    {
                      type: 'text-link',
                      tag: 'a',
                      content: 'Accueil',
                      attributes: { href: '#' },
                      styles: {
                        desktop: {
                          color: '#1e293b',
                          textDecoration: 'none',
                          fontSize: '16px',
                          fontWeight: '500',
                        },
                        tablet: {
                          fontSize: '14px',
                        },
                        mobile: {
                          fontSize: '16px',
                          padding: '8px 0',
                          display: 'block',
                          width: '100%',
                        },
                      },
                      children: [],
                    },
                    {
                      type: 'text-link',
                      tag: 'a',
                      content: 'Services',
                      attributes: { href: '#' },
                      styles: {
                        desktop: {
                          color: '#1e293b',
                          textDecoration: 'none',
                          fontSize: '16px',
                          fontWeight: '500',
                        },
                        tablet: {
                          fontSize: '14px',
                        },
                        mobile: {
                          fontSize: '16px',
                          padding: '8px 0',
                          display: 'block',
                          width: '100%',
                        },
                      },
                      children: [],
                    },
                    {
                      type: 'text-link',
                      tag: 'a',
                      content: 'À propos',
                      attributes: { href: '#' },
                      styles: {
                        desktop: {
                          color: '#1e293b',
                          textDecoration: 'none',
                          fontSize: '16px',
                          fontWeight: '500',
                        },
                        tablet: {
                          fontSize: '14px',
                        },
                        mobile: {
                          fontSize: '16px',
                          padding: '8px 0',
                          display: 'block',
                          width: '100%',
                        },
                      },
                      children: [],
                    },
                    {
                      type: 'button',
                      tag: 'button',
                      content: 'Contact',
                      styles: {
                        desktop: {
                          padding: '8px 20px',
                          backgroundColor: '#3b82f6',
                          color: '#ffffff',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          borderTop: 'none', borderRight: 'none', borderBottom: 'none', borderLeft: 'none',
                          cursor: 'pointer',
                        },
                        tablet: {
                          padding: '6px 16px',
                          fontSize: '13px',
                        },
                        mobile: {
                          display: 'block',
                          width: '100%',
                          padding: '12px',
                          fontSize: '16px',
                          marginTop: '8px',
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
      ],
    },
  },
  {
    id: 'header-2',
    label: 'Header Centré',
    category: 'Header',
    icon: Menu,
    template: {
      type: 'header',
      tag: 'header',
      styles: {
        desktop: {
          display: 'block',
          width: '100%',
          padding: '20px',
          backgroundColor: '#1e293b',
          textAlign: 'center',
        },
        tablet: {
          padding: '16px',
        },
        mobile: {
          padding: '12px',
        },
      },
      children: [
        {
          type: 'vflex',
          tag: 'div',
          styles: {
            desktop: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              padding: '0',
            },
          },
          children: [
            {
              type: 'heading',
              tag: 'h1',
              content: 'MonSite',
              styles: {
                desktop: {
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#ffffff',
                  margin: '0',
                },
                tablet: {
                  fontSize: '24px',
                },
                mobile: {
                  fontSize: '20px',
                },
              },
              children: [],
            },
            {
              type: 'navbar',
              tag: 'nav',
              styles: {
                desktop: {
                  display: 'flex',
                  gap: '20px',
                  padding: '0',
                  borderTop: 'none', borderRight: 'none', borderBottom: 'none', borderLeft: 'none',
                },
                tablet: {
                  gap: '16px',
                },
                mobile: {
                  flexDirection: 'column',
                  gap: '12px',
                },
              },
              children: [
                {
                  type: 'text-link',
                  tag: 'a',
                  content: 'Accueil',
                  attributes: { href: '#' },
                  styles: {
                    desktop: {
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontSize: '14px',
                    },
                    mobile: {
                      fontSize: '13px',
                    },
                  },
                  children: [],
                },
                {
                  type: 'text-link',
                  tag: 'a',
                  content: 'Services',
                  attributes: { href: '#' },
                  styles: {
                    desktop: {
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontSize: '14px',
                    },
                    mobile: {
                      fontSize: '13px',
                    },
                  },
                  children: [],
                },
                {
                  type: 'text-link',
                  tag: 'a',
                  content: 'Contact',
                  attributes: { href: '#' },
                  styles: {
                    desktop: {
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontSize: '14px',
                    },
                    mobile: {
                      fontSize: '13px',
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
    id: 'features-grid',
    label: 'Grille de Fonctionnalités',
    category: 'Features',
    icon: LayoutGrid,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: {
          display: 'block',
          padding: '80px 20px',
          backgroundColor: '#ffffff',
        },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: {
            desktop: { maxWidth: '1200px', margin: '0 auto' },
          },
          children: [
            {
              type: 'heading',
              tag: 'h2',
              content: 'Nos Fonctionnalités',
              styles: {
                desktop: {
                  fontSize: '36px',
                  fontWeight: '700',
                  color: '#1e293b',
                  textAlign: 'center',
                  marginBottom: '48px',
                },
              },
              children: [],
            },
            {
              type: 'grid',
              tag: 'div',
              styles: {
                desktop: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '32px',
                },
              },
              children: [
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: {
                    desktop: {
                      padding: '24px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      textAlign: 'center',
                    },
                  },
                  children: [
                    {
                      type: 'div',
                      tag: 'div',
                      styles: {
                        desktop: {
                          width: '64px',
                          height: '64px',
                          backgroundColor: '#dbeafe',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 16px',
                        },
                      },
                      children: [
                        {
                          type: 'text',
                          tag: 'span',
                          content: '⚡',
                          styles: {
                            desktop: { fontSize: '32px' },
                          },
                          children: [],
                        },
                      ],
                    },
                    {
                      type: 'heading',
                      tag: 'h3',
                      content: 'Rapide',
                      styles: {
                        desktop: {
                          fontSize: '20px',
                          fontWeight: '600',
                          color: '#1e293b',
                          marginBottom: '8px',
                        },
                      },
                      children: [],
                    },
                    {
                      type: 'paragraph',
                      tag: 'p',
                      content: 'Performance optimale',
                      styles: {
                        desktop: { fontSize: '14px', color: '#64748b' },
                      },
                      children: [],
                    },
                  ],
                },
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: {
                    desktop: {
                      padding: '24px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      textAlign: 'center',
                    },
                  },
                  children: [
                    {
                      type: 'div',
                      tag: 'div',
                      styles: {
                        desktop: {
                          width: '64px',
                          height: '64px',
                          backgroundColor: '#dbeafe',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 16px',
                        },
                      },
                      children: [
                        {
                          type: 'text',
                          tag: 'span',
                          content: '✨',
                          styles: {
                            desktop: { fontSize: '32px' },
                          },
                          children: [],
                        },
                      ],
                    },
                    {
                      type: 'heading',
                      tag: 'h3',
                      content: 'Qualité',
                      styles: {
                        desktop: {
                          fontSize: '20px',
                          fontWeight: '600',
                          color: '#1e293b',
                          marginBottom: '8px',
                        },
                      },
                      children: [],
                    },
                    {
                      type: 'paragraph',
                      tag: 'p',
                      content: 'Service premium',
                      styles: {
                        desktop: { fontSize: '14px', color: '#64748b' },
                      },
                      children: [],
                    },
                  ],
                },
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: {
                    desktop: {
                      padding: '24px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      textAlign: 'center',
                    },
                  },
                  children: [
                    {
                      type: 'div',
                      tag: 'div',
                      styles: {
                        desktop: {
                          width: '64px',
                          height: '64px',
                          backgroundColor: '#dbeafe',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 16px',
                        },
                      },
                      children: [
                        {
                          type: 'text',
                          tag: 'span',
                          content: '🎯',
                          styles: {
                            desktop: { fontSize: '32px' },
                          },
                          children: [],
                        },
                      ],
                    },
                    {
                      type: 'heading',
                      tag: 'h3',
                      content: 'Précis',
                      styles: {
                        desktop: {
                          fontSize: '20px',
                          fontWeight: '600',
                          color: '#1e293b',
                          marginBottom: '8px',
                        },
                      },
                      children: [],
                    },
                    {
                      type: 'paragraph',
                      tag: 'p',
                      content: 'Résultats garantis',
                      styles: {
                        desktop: { fontSize: '14px', color: '#64748b' },
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
    id: 'contact-1',
    label: 'Contact Simple',
    category: 'Contact',
    icon: Mail,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: {
          display: 'block',
          padding: '80px 20px',
          backgroundColor: '#f8fafc',
        },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: {
            desktop: { maxWidth: '600px', margin: '0 auto' },
          },
          children: [
            {
              type: 'heading',
              tag: 'h2',
              content: 'Contactez-nous',
              styles: {
                desktop: {
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#1e293b',
                  textAlign: 'center',
                  marginBottom: '32px',
                },
              },
              children: [],
            },
            {
              type: 'form',
              tag: 'form',
              styles: {
                desktop: {
                  display: 'block',
                  padding: '32px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                },
              },
              children: [
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: {
                    desktop: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      padding: '0',
                    },
                  },
                  children: [
                    {
                      type: 'input',
                      tag: 'input',
                      attributes: { type: 'text', placeholder: 'Votre nom' },
                      styles: {
                        desktop: {
                          padding: '12px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          fontSize: '14px',
                        },
                      },
                      children: [],
                    },
                    {
                      type: 'input',
                      tag: 'input',
                      attributes: { type: 'email', placeholder: 'Votre email' },
                      styles: {
                        desktop: {
                          padding: '12px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          fontSize: '14px',
                        },
                      },
                      children: [],
                    },
                    {
                      type: 'textarea',
                      tag: 'textarea',
                      attributes: { placeholder: 'Votre message' },
                      styles: {
                        desktop: {
                          padding: '12px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          fontSize: '14px',
                          minHeight: '120px',
                        },
                      },
                      children: [],
                    },
                    {
                      type: 'button',
                      tag: 'button',
                      content: 'Envoyer',
                      styles: {
                        desktop: {
                          padding: '14px',
                          backgroundColor: '#3b82f6',
                          color: '#ffffff',
                          borderRadius: '6px',
                          fontSize: '16px',
                          fontWeight: '600',
                          borderTop: 'none', borderRight: 'none', borderBottom: 'none', borderLeft: 'none',
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
      ],
    },
  },
  {
    id: 'contact-2',
    label: 'Contact avec Info',
    category: 'Contact',
    icon: Mail,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: {
          display: 'block',
          padding: '80px 20px',
          backgroundColor: '#ffffff',
        },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: {
            desktop: { maxWidth: '1200px', margin: '0 auto' },
          },
          children: [
            {
              type: 'heading',
              tag: 'h2',
              content: 'Contactez-nous',
              styles: {
                desktop: {
                  fontSize: '36px',
                  fontWeight: '700',
                  color: '#1e293b',
                  textAlign: 'center',
                  marginBottom: '48px',
                },
              },
              children: [],
            },
            {
              type: 'grid',
              tag: 'div',
              styles: {
                desktop: {
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '48px',
                },
              },
              children: [
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: {
                    desktop: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '24px',
                      padding: '0',
                    },
                  },
                  children: [
                    {
                      type: 'heading',
                      tag: 'h3',
                      content: 'Nos coordonnées',
                      styles: {
                        desktop: {
                          fontSize: '24px',
                          fontWeight: '600',
                          color: '#1e293b',
                          marginBottom: '8px',
                        },
                      },
                      children: [],
                    },
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: {
                        desktop: { gap: '12px', padding: '0' },
                      },
                      children: [
                        {
                          type: 'paragraph',
                          tag: 'p',
                          content: '📍 123 Rue Example, Ville',
                          styles: {
                            desktop: { fontSize: '16px', color: '#64748b' },
                          },
                          children: [],
                        },
                        {
                          type: 'paragraph',
                          tag: 'p',
                          content: '📞 +229 XX XX XX XX',
                          styles: {
                            desktop: { fontSize: '16px', color: '#64748b' },
                          },
                          children: [],
                        },
                        {
                          type: 'paragraph',
                          tag: 'p',
                          content: '✉️ contact@exemple.com',
                          styles: {
                            desktop: { fontSize: '16px', color: '#64748b' },
                          },
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'form',
                  tag: 'form',
                  styles: {
                    desktop: {
                      display: 'block',
                      padding: '32px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                    },
                  },
                  children: [
                    {
                      type: 'vflex',
                      tag: 'div',
                      styles: {
                        desktop: {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '16px',
                          padding: '0',
                        },
                      },
                      children: [
                        {
                          type: 'input',
                          tag: 'input',
                          attributes: { type: 'text', placeholder: 'Nom' },
                          styles: {
                            desktop: {
                              padding: '12px',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              fontSize: '14px',
                              backgroundColor: '#ffffff',
                            },
                          },
                          children: [],
                        },
                        {
                          type: 'input',
                          tag: 'input',
                          attributes: { type: 'email', placeholder: 'Email' },
                          styles: {
                            desktop: {
                              padding: '12px',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              fontSize: '14px',
                              backgroundColor: '#ffffff',
                            },
                          },
                          children: [],
                        },
                        {
                          type: 'textarea',
                          tag: 'textarea',
                          attributes: { placeholder: 'Message' },
                          styles: {
                            desktop: {
                              padding: '12px',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              fontSize: '14px',
                              minHeight: '120px',
                              backgroundColor: '#ffffff',
                            },
                          },
                          children: [],
                        },
                        {
                          type: 'button',
                          tag: 'button',
                          content: 'Envoyer',
                          styles: {
                            desktop: {
                              padding: '14px',
                              backgroundColor: '#3b82f6',
                              color: '#ffffff',
                              borderRadius: '6px',
                              fontSize: '16px',
                              fontWeight: '600',
                              borderTop: 'none', borderRight: 'none', borderBottom: 'none', borderLeft: 'none',
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
          ],
        },
      ],
    },
  },
  {
    id: 'hero-1',
    label: 'Hero Centré',
    category: 'Hero',
    icon: Rocket,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: {
          display: 'block',
          padding: '120px 20px',
          backgroundColor: '#f8fafc',
          textAlign: 'center',
        },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: {
            desktop: { maxWidth: '800px', margin: '0 auto' },
          },
          children: [
            {
              type: 'heading',
              tag: 'h1',
              content: 'Bienvenue sur notre plateforme',
              styles: {
                desktop: { fontSize: '48px', fontWeight: '800', color: '#1e293b', marginBottom: '24px' },
              },
              children: [],
            },
            {
              type: 'paragraph',
              tag: 'p',
              content: 'Découvrez une solution innovante pour votre entreprise',
              styles: {
                desktop: { fontSize: '20px', color: '#64748b', marginBottom: '32px' },
              },
              children: [],
            },
            {
              type: 'button',
              tag: 'button',
              content: 'Commencer maintenant',
              styles: {
                desktop: { display: 'inline-block', padding: '16px 32px', backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: '8px', fontSize: '18px', fontWeight: '600', cursor: 'pointer', borderTop: 'none', borderRight: 'none', borderBottom: 'none', borderLeft: 'none' },
              },
              children: [],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'hero-2',
    label: 'Hero Split',
    category: 'Hero',
    icon: SplitSquareHorizontal,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: {
          display: 'block',
          padding: '80px 20px',
          backgroundColor: '#ffffff',
        },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: {
            desktop: { maxWidth: '1200px', margin: '0 auto' },
          },
          children: [
            {
              type: 'grid',
              tag: 'div',
              styles: {
                desktop: {
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '48px',
                  alignItems: 'center',
                },
              },
              children: [
                {
                  type: 'vflex',
                  tag: 'div',
                  styles: {
                    desktop: { gap: '24px', padding: '0' },
                  },
                  children: [
                    {
                      type: 'heading',
                      tag: 'h1',
                      content: 'Transformez votre business',
                      styles: {
                        desktop: { fontSize: '42px', fontWeight: '800', color: '#1e293b', marginBottom: '0' },
                      },
                      children: [],
                    },
                    {
                      type: 'paragraph',
                      tag: 'p',
                      content: 'Une solution complète pour développer votre activité en ligne',
                      styles: {
                        desktop: { fontSize: '18px', color: '#64748b', lineHeight: '1.7' },
                      },
                      children: [],
                    },
                    {
                      type: 'hflex',
                      tag: 'div',
                      styles: {
                        desktop: { gap: '12px', padding: '0', alignItems: 'center' },
                      },
                      children: [
                        {
                          type: 'button',
                          tag: 'button',
                          content: 'Démarrer',
                          styles: {
                            desktop: { padding: '14px 28px', backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: '8px', fontSize: '16px', fontWeight: '600', borderTop: 'none', borderRight: 'none', borderBottom: 'none', borderLeft: 'none', cursor: 'pointer' },
                          },
                          children: [],
                        },
                        {
                          type: 'button',
                          tag: 'button',
                          content: 'En savoir plus',
                          styles: {
                            desktop: { padding: '14px 28px', backgroundColor: 'transparent', color: '#3b82f6', borderRadius: '8px', fontSize: '16px', fontWeight: '600', border: '2px solid #3b82f6', cursor: 'pointer' },
                          },
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'div',
                  tag: 'div',
                  styles: {
                    desktop: { width: '100%', height: '400px', backgroundColor: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#64748b', fontWeight: '500' },
                  },
                  children: [
                    {
                      type: 'text',
                      tag: 'span',
                      content: 'Image placeholder',
                      styles: { desktop: {} },
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
    id: 'hero-3',
    label: 'Hero Gradient',
    category: 'Hero',
    icon: Sparkles,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: {
          display: 'block',
          padding: '120px 20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          textAlign: 'center',
        },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: {
            desktop: { maxWidth: '900px', margin: '0 auto' },
          },
          children: [
            {
              type: 'heading',
              tag: 'h1',
              content: 'Créez quelque chose d\'extraordinaire',
              styles: {
                desktop: { fontSize: '56px', fontWeight: '900', color: '#ffffff', marginBottom: '24px', lineHeight: '1.2' },
              },
              children: [],
            },
            {
              type: 'paragraph',
              tag: 'p',
              content: 'Rejoignez des milliers d\'entrepreneurs qui ont choisi notre plateforme',
              styles: {
                desktop: { fontSize: '20px', color: '#e0e7ff', marginBottom: '40px' },
              },
              children: [],
            },
            {
              type: 'button',
              tag: 'button',
              content: 'Essayer gratuitement',
              styles: {
                desktop: { display: 'inline-block', padding: '18px 40px', backgroundColor: '#ffffff', color: '#667eea', borderRadius: '50px', fontSize: '18px', fontWeight: '700', cursor: 'pointer', borderTop: 'none', borderRight: 'none', borderBottom: 'none', borderLeft: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
              },
              children: [],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'contact-3',
    label: 'Contact Compact',
    category: 'Contact',
    icon: Mail,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: {
          display: 'block',
          padding: '60px 20px',
          backgroundColor: '#1e293b',
        },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: {
            desktop: { maxWidth: '800px', margin: '0 auto', textAlign: 'center' },
          },
          children: [
            {
              type: 'heading',
              tag: 'h2',
              content: 'Une question ?',
              styles: {
                desktop: {
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '16px',
                },
              },
              children: [],
            },
            {
              type: 'paragraph',
              tag: 'p',
              content: 'Nous sommes là pour vous aider',
              styles: {
                desktop: {
                  fontSize: '16px',
                  color: '#94a3b8',
                  marginBottom: '32px',
                },
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
                  padding: '0',
                  justifyContent: 'center',
                  maxWidth: '500px',
                  margin: '0 auto',
                },
              },
              children: [
                {
                  type: 'input',
                  tag: 'input',
                  attributes: { type: 'email', placeholder: 'Votre email' },
                  styles: {
                    desktop: {
                      flex: '1',
                      padding: '14px 16px',
                      borderTop: 'none', borderRight: 'none', borderBottom: 'none', borderLeft: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#ffffff',
                    },
                  },
                  children: [],
                },
                {
                  type: 'button',
                  tag: 'button',
                  content: 'Envoyer',
                  styles: {
                    desktop: {
                      padding: '14px 32px',
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      borderTop: 'none', borderRight: 'none', borderBottom: 'none', borderLeft: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
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
    id: 'cta-1',
    label: 'Call to Action',
    category: 'CTA',
    icon: Megaphone,
    template: {
      type: 'section',
      tag: 'section',
      styles: {
        desktop: {
          display: 'block',
          padding: '80px 20px',
          backgroundColor: '#3b82f6',
          textAlign: 'center',
        },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: {
            desktop: { maxWidth: '600px', margin: '0 auto' },
          },
          children: [
            {
              type: 'heading',
              tag: 'h2',
              content: 'Prêt à commencer ?',
              styles: {
                desktop: { fontSize: '36px', fontWeight: '700', color: '#ffffff', marginBottom: '16px' },
              },
              children: [],
            },
            {
              type: 'paragraph',
              tag: 'p',
              content: 'Rejoignez des milliers d\'utilisateurs satisfaits',
              styles: {
                desktop: { fontSize: '18px', color: '#e0e7ff', marginBottom: '24px' },
              },
              children: [],
            },
            {
              type: 'button',
              tag: 'button',
              content: 'Inscription gratuite',
              styles: {
                desktop: { display: 'inline-block', padding: '14px 28px', backgroundColor: '#ffffff', color: '#3b82f6', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', borderTop: 'none', borderRight: 'none', borderBottom: 'none', borderLeft: 'none' },
              },
              children: [],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'footer-1',
    label: 'Footer',
    category: 'Footer',
    icon: Copyright,
    template: {
      type: 'section',
      tag: 'footer',
      styles: {
        desktop: {
          display: 'block',
          padding: '60px 20px 30px',
          backgroundColor: '#1e293b',
          color: '#ffffff',
        },
        tablet: {
          padding: '40px 16px 20px',
        },
        mobile: {
          padding: '30px 12px 16px',
        },
      },
      children: [
        {
          type: 'container',
          tag: 'div',
          styles: {
            desktop: { maxWidth: '1200px', margin: '0 auto' },
          },
          children: [
            {
              type: 'grid',
              tag: 'div',
              styles: {
                desktop: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', marginBottom: '40px' },
                tablet: { gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', marginBottom: '30px' },
                mobile: { gridTemplateColumns: '1fr', gap: '24px', marginBottom: '24px' },
              },
              children: [
                {
                  type: 'div',
                  tag: 'div',
                  styles: { desktop: {} },
                  children: [
                    {
                      type: 'heading',
                      tag: 'h3',
                      content: 'À propos',
                      styles: {
                        desktop: { fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '12px' },
                        mobile: { fontSize: '16px', marginBottom: '10px' },
                      },
                      children: [],
                    },
                    {
                      type: 'paragraph',
                      tag: 'p',
                      content: 'Votre partenaire de confiance',
                      styles: {
                        desktop: { fontSize: '14px', color: '#94a3b8' },
                        mobile: { fontSize: '13px' },
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              type: 'paragraph',
              tag: 'p',
              content: '© 2024 Tous droits réservés',
              styles: {
                desktop: { fontSize: '14px', color: '#64748b', textAlign: 'center', borderTop: '1px solid #334155', paddingTop: '20px' },
                mobile: { fontSize: '12px', paddingTop: '16px' },
              },
              children: [],
            },
          ],
        },
      ],
    },
  },
];
