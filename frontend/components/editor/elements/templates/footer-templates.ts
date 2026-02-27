import { Copyright, LucideIcon } from 'lucide-react';

export interface LayoutTemplate {
  id: string;
  label: string;
  category: string;
  icon: LucideIcon;
  template: any;
}

export const FOOTER_TEMPLATES: LayoutTemplate[] = [
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