import { Megaphone, LucideIcon } from 'lucide-react';

export interface LayoutTemplate {
  id: string;
  label: string;
  category: string;
  icon: LucideIcon;
  template: any;
}

export const CTA_TEMPLATES: LayoutTemplate[] = [
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
              styles: { desktop: { fontSize: '13px', color: 'rgba(255,255,255,0.7)' } },
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
];