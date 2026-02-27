import { Mail, LucideIcon } from 'lucide-react';

export interface LayoutTemplate {
  id: string;
  label: string;
  category: string;
  icon: LucideIcon;
  template: any;
}

export const CONTACT_TEMPLATES: LayoutTemplate[] = [
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
];