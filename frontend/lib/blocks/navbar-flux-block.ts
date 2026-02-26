export const NAVBAR_FLUX_BLOCK = {
  id: 'header-flux',
  type: 'header',
  tag: 'header',
  styles: {
    desktop: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      zIndex: '100',
      height: '72px',
      backgroundColor: 'rgba(10, 10, 15, 0.82)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    },
  },
  children: [
    {
      id: 'nav-inner',
      type: 'hflex',
      tag: 'div',
      styles: {
        desktop: {
          maxWidth: '1200px',
          margin: '0 auto',
          height: '100%',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '48px',
        },
        mobile: {
          padding: '0 20px',
        },
      },
      children: [
        // Logo
        {
          id: 'logo',
          type: 'link-block',
          tag: 'a',
          attributes: { href: '#' },
          styles: {
            desktop: {
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
            },
          },
          children: [
            {
              id: 'logo-mark',
              type: 'container',
              tag: 'div',
              styles: {
                desktop: {
                  width: '36px',
                  height: '36px',
                  backgroundColor: '#6c63ff',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              },
              children: [
                {
                  id: 'logo-icon',
                  type: 'text',
                  tag: 'span',
                  content: '◆',
                  styles: {
                    desktop: {
                      fontSize: '18px',
                      color: '#ffffff',
                    },
                  },
                  children: [],
                },
              ],
            },
            {
              id: 'logo-text',
              type: 'heading',
              tag: 'h1',
              content: 'Flux<span style="color:#6c63ff">UI</span>',
              styles: {
                desktop: {
                  fontWeight: '800',
                  fontSize: '1.2rem',
                  color: '#f0f0f8',
                  margin: '0',
                },
              },
              children: [],
            },
          ],
        },

        // Nav Links
        {
          id: 'nav-links',
          type: 'navbar',
          tag: 'nav',
          styles: {
            desktop: {
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flex: '1',
            },
            mobile: {
              display: 'none',
            },
          },
          menuItems: [
            { id: 'menu-1', label: 'Accueil', href: '#', linkType: 'anchor', color: '#f0f0f8', hoverColor: '#6c63ff' },
            { id: 'menu-2', label: 'Produits', href: '#', linkType: 'anchor', color: '#7a7a99', hoverColor: '#f0f0f8' },
            { id: 'menu-3', label: 'Ressources', href: '#', linkType: 'anchor', color: '#7a7a99', hoverColor: '#f0f0f8' },
            { id: 'menu-4', label: 'Tarifs', href: '#', linkType: 'anchor', color: '#7a7a99', hoverColor: '#f0f0f8' },
            { id: 'menu-5', label: 'Blog', href: '#', linkType: 'anchor', color: '#7a7a99', hoverColor: '#f0f0f8' },
          ],
          children: [],
        },

        // Actions
        {
          id: 'nav-actions',
          type: 'hflex',
          tag: 'div',
          styles: {
            desktop: {
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginLeft: 'auto',
            },
            mobile: {
              display: 'none',
            },
          },
          children: [
            {
              id: 'btn-login',
              type: 'button',
              tag: 'button',
              content: 'Connexion',
              styles: {
                desktop: {
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.87rem',
                  fontWeight: '500',
                  color: '#7a7a99',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                },
              },
              children: [],
            },
            {
              id: 'btn-cta',
              type: 'button',
              tag: 'button',
              content: 'Commencer →',
              styles: {
                desktop: {
                  padding: '9px 20px',
                  borderRadius: '9px',
                  fontSize: '0.87rem',
                  fontWeight: '600',
                  color: '#ffffff',
                  backgroundColor: '#6c63ff',
                  border: 'none',
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
};
