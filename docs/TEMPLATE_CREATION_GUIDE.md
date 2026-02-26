# Guide de création de templates Sorika

## Structure de base

```typescript
{
  id: 'unique-id',           // ID unique
  label: 'Nom du template',  // Nom affiché
  category: 'Hero',          // Catégorie (Header, Hero, Features, etc.)
  icon: Rocket,              // Icône Lucide
  template: {
    type: 'section',
    tag: 'section',
    styles: {
      desktop: { /* styles */ },
      tablet: { /* styles optionnels */ },
      mobile: { /* styles optionnels */ }
    },
    children: [/* éléments enfants */]
  }
}
```

## Exemple: Pricing Card

```typescript
{
  id: 'pricing-3-cards',
  label: 'Pricing 3 Cartes',
  category: 'Pricing',
  icon: DollarSign,
  template: {
    type: 'section',
    tag: 'section',
    styles: {
      desktop: {
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
            content: 'Nos Tarifs',
            styles: {
              desktop: {
                fontSize: '36px',
                fontWeight: '700',
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
              mobile: {
                gridTemplateColumns: '1fr',
              },
            },
            children: [
              // Carte 1
              {
                type: 'vflex',
                tag: 'div',
                styles: {
                  desktop: {
                    padding: '32px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                  },
                },
                children: [
                  {
                    type: 'heading',
                    tag: 'h3',
                    content: 'Starter',
                    styles: {
                      desktop: {
                        fontSize: '24px',
                        fontWeight: '600',
                        marginBottom: '8px',
                      },
                    },
                    children: [],
                  },
                  {
                    type: 'heading',
                    tag: 'h4',
                    content: '29€/mois',
                    styles: {
                      desktop: {
                        fontSize: '36px',
                        fontWeight: '700',
                        color: '#3b82f6',
                        marginBottom: '24px',
                      },
                    },
                    children: [],
                  },
                  {
                    type: 'paragraph',
                    tag: 'p',
                    content: '✓ Fonctionnalité 1<br>✓ Fonctionnalité 2<br>✓ Fonctionnalité 3',
                    styles: {
                      desktop: {
                        fontSize: '14px',
                        color: '#64748b',
                        marginBottom: '24px',
                        lineHeight: '1.8',
                      },
                    },
                    children: [],
                  },
                  {
                    type: 'button',
                    tag: 'button',
                    content: 'Choisir',
                    styles: {
                      desktop: {
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#3b82f6',
                        color: '#ffffff',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                      },
                    },
                    children: [],
                  },
                ],
              },
              // Répéter pour carte 2 et 3...
            ],
          },
        ],
      },
    ],
  },
}
```

## Propriétés CSS courantes

### Layout
- `display`: 'block', 'flex', 'grid', 'inline-block'
- `flexDirection`: 'row', 'column'
- `justifyContent`: 'center', 'space-between', 'flex-start', 'flex-end'
- `alignItems`: 'center', 'flex-start', 'flex-end', 'stretch'
- `gap`: '16px', '24px', '32px'

### Dimensions
- `width`: '100%', '50%', '300px'
- `height`: 'auto', '400px'
- `maxWidth`: '1200px', '800px'
- `minHeight`: '100vh', '400px'

### Spacing
- `padding`: '20px', '40px 20px'
- `margin`: '0 auto', '24px 0'
- `marginBottom`: '16px', '24px', '32px'

### Typography
- `fontSize`: '14px', '16px', '24px', '36px'
- `fontWeight`: '400', '500', '600', '700', '800'
- `lineHeight`: '1.5', '1.7'
- `textAlign`: 'left', 'center', 'right'
- `color`: '#1e293b', '#64748b', '#ffffff'

### Background
- `backgroundColor`: '#ffffff', '#f8fafc', '#3b82f6'
- `background`: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

### Border
- `border`: '1px solid #e2e8f0'
- `borderRadius`: '8px', '12px', '50%'

### Effects
- `boxShadow`: '0 4px 6px rgba(0,0,0,0.1)'
- `cursor`: 'pointer'

## Responsive Design

```typescript
styles: {
  desktop: {
    gridTemplateColumns: 'repeat(3, 1fr)',
    fontSize: '36px',
    padding: '80px 20px',
  },
  tablet: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    fontSize: '28px',
    padding: '60px 16px',
  },
  mobile: {
    gridTemplateColumns: '1fr',
    fontSize: '24px',
    padding: '40px 12px',
  },
}
```

## Checklist avant d'ajouter un template

- [ ] ID unique
- [ ] Label descriptif
- [ ] Catégorie correcte
- [ ] Icône appropriée
- [ ] Tous les `children: []` présents
- [ ] Propriétés CSS en camelCase
- [ ] Styles responsive (si nécessaire)
- [ ] Testé dans l'éditeur
