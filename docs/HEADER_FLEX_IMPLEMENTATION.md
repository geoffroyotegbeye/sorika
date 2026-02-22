# Header Flexible - Plan d'implémentation

## 🎯 Objectif
Créer un header avec drag & drop complet, où chaque élément est cliquable et éditable individuellement, avec hamburger responsive automatique.

## 📋 Structure

```
Header Flexible (header-flex)
├── Logo Zone (container - accepte drag & drop)
│   └── [Éléments enfants : image, text, etc.]
├── Nav Zone (hflex - accepte drag & drop)
│   └── [Éléments enfants : text-link, button, etc.]
└── CTA Zone (container - accepte drag & drop)
    └── [Éléments enfants : button, etc.]
```

## 🔧 Implémentation

### 1. Ajouter dans element-categories.ts
```typescript
{ 
  type: 'header-flex', 
  label: 'Header (Drag & Drop)', 
  tag: 'header', 
  icon: LayoutTemplate 
}
```

### 2. Créer element-defaults.ts pour header-flex
```typescript
case 'header-flex':
  return {
    id: generateId('header-flex'),
    type: 'header-flex',
    tag: 'header',
    styles: {
      desktop: {
        width: '100%',
        padding: '16px 20px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: '0',
        zIndex: '1000',
      }
    },
    children: [
      // Container principal
      {
        id: generateId('container'),
        type: 'hflex',
        tag: 'div',
        styles: {
          desktop: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
            gap: '24px',
          }
        },
        children: [
          // Logo zone
          {
            id: generateId('logo-zone'),
            type: 'div',
            tag: 'div',
            name: 'Logo Zone',
            styles: { desktop: { display: 'flex', alignItems: 'center' }},
            children: [
              {
                id: generateId('text'),
                type: 'text',
                tag: 'span',
                content: 'Logo',
                styles: {
                  desktop: {
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1e293b',
                  }
                },
                children: []
              }
            ]
          },
          // Nav zone
          {
            id: generateId('nav-zone'),
            type: 'hflex',
            tag: 'nav',
            name: 'Nav Zone',
            attributes: { 'data-mobile-menu': 'true' }, // Marqueur pour hamburger
            styles: {
              desktop: {
                display: 'flex',
                gap: '24px',
                alignItems: 'center',
              }
            },
            children: [
              {
                id: generateId('text-link'),
                type: 'text-link',
                tag: 'a',
                content: 'Accueil',
                attributes: { href: '#' },
                styles: {
                  desktop: {
                    color: '#475569',
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: '500',
                  }
                },
                children: []
              }
            ]
          }
        ]
      }
    ]
  };
```

### 3. Créer HeaderFlexRenderer.tsx
```typescript
'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function HeaderFlexRenderer({
  element,
  styles,
  currentBreakpoint,
  renderChildren,
  ...props
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = currentBreakpoint === 'mobile' || currentBreakpoint === 'tablet';

  // Trouver la nav zone (élément avec data-mobile-menu)
  const findNavZone = (children: any[]): any => {
    for (const child of children) {
      if (child.attributes?.['data-mobile-menu']) return child;
      if (child.children?.length > 0) {
        const found = findNavZone(child.children);
        if (found) return found;
      }
    }
    return null;
  };

  const navZone = findNavZone(element.children || []);

  return (
    <header style={styles} {...props}>
      {renderLabel()}
      
      <div style={{ position: 'relative' }}>
        {/* Desktop: render tous les enfants normalement */}
        {!isMobile && renderChildren(element.children)}

        {/* Mobile: render avec hamburger */}
        {isMobile && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Render logo zone */}
              {element.children?.map((child: any) => {
                if (child.attributes?.['data-mobile-menu']) return null;
                return renderChildren([child]);
              })}

              {/* Hamburger button */}
              {navZone && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMobileMenuOpen(!isMobileMenuOpen);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                  }}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              )}
            </div>

            {/* Mobile menu dropdown */}
            {isMobileMenuOpen && navZone && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#ffffff',
                  borderBottom: '1px solid #e2e8f0',
                  padding: '16px 20px',
                  zIndex: 999,
                }}
              >
                {renderChildren([navZone])}
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}
```

### 4. Intégrer dans Canvas.tsx
```typescript
if (element.type === 'header-flex') {
  return (
    <HeaderFlexRenderer
      element={element}
      styles={styles}
      currentBreakpoint={currentBreakpoint}
      renderChildren={(children) => children.map(renderElement)}
      renderLabel={renderLabel}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}
```

### 5. Propriétés spéciales
- Marquer un élément comme "Nav Zone" via attribut `data-mobile-menu="true"`
- Cet élément sera automatiquement caché sur mobile et affiché dans le hamburger

## ✅ Avantages

1. **Flexibilité totale** : Drag & drop n'importe quel élément
2. **Chaque élément cliquable** : Toutes les propriétés disponibles
3. **Responsive automatique** : Hamburger sur mobile/tablet
4. **Réutilisable** : Basé sur les éléments existants

## 🎨 Templates prédéfinis

Créer 3-4 templates inspirés des layouts existants :
- Header Simple (logo + 3 liens)
- Header avec CTA (logo + liens + bouton)
- Header E-commerce (logo + liens + recherche + panier)
- Header Minimal (logo centré + liens en dessous)

## 📝 Noms dans l'interface

- **Header Simple** : "Header (Configuration rapide)" - Type: `responsive-header`
- **Header Flexible** : "Header (Drag & Drop)" - Type: `header-flex`
