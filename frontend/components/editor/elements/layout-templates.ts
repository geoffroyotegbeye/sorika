export const LAYOUT_TEMPLATES = [
  {
    id: 'hero-1',
    label: 'Hero Section',
    category: 'Hero',
    thumbnail: 'Hero',
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
                desktop: { display: 'inline-block', padding: '16px 32px', backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: '8px', fontSize: '18px', fontWeight: '600', cursor: 'pointer', border: 'none' },
              },
              children: [],
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
    thumbnail: 'CTA',
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
                desktop: { display: 'inline-block', padding: '14px 28px', backgroundColor: '#ffffff', color: '#3b82f6', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', border: 'none' },
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
    thumbnail: 'Footer',
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
                      },
                      children: [],
                    },
                    {
                      type: 'paragraph',
                      tag: 'p',
                      content: 'Votre partenaire de confiance',
                      styles: {
                        desktop: { fontSize: '14px', color: '#94a3b8' },
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
              },
              children: [],
            },
          ],
        },
      ],
    },
  },
];
