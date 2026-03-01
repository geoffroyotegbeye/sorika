# Guide d'utilisation du système de propriétés des blocs

Ce guide explique comment utiliser et intégrer le système de propriétés des blocs inspiré d'Odoo dans votre éditeur.

## Vue d'ensemble

Le système de propriétés des blocs permet à chaque bloc/template d'avoir son propre panneau de propriétés contextuel, exactement comme dans Odoo. Quand un utilisateur clique sur un bloc, le panneau de propriétés affiche automatiquement les options spécifiques à ce type de bloc.

## Architecture du système

```
frontend/components/editor/
├── block-properties/           # Point d'entrée principal
│   ├── index.ts               # Exports principaux
│   └── README.md              # Documentation technique
├── elements/                  # Logique métier
│   ├── block-properties.ts    # Types et interfaces
│   ├── block-property-registry.ts  # Registre des schémas
│   ├── block-property-manager.ts   # Application des propriétés
│   └── selection-context.ts   # Analyse de sélection
├── properties/                # Composants UI
│   ├── BlockPropertyPanel.tsx # Panneau principal
│   ├── PropertyPanelSelector.tsx # Sélecteur de templates
│   └── block-properties.css   # Styles
├── hooks/                     # Hooks React
│   └── useBlockProperties.ts  # Hook principal
├── examples/                  # Exemples d'usage
│   └── BlockPropertiesExample.tsx
├── BlockPropertiesIntegration.tsx  # Composant d'intégration
└── EditorWithBlockProperties.tsx   # Exemple complet
```

## Intégration rapide

### 1. Intégration basique

```tsx
import React, { useState } from 'react';
import BlockPropertiesIntegration from './components/editor/BlockPropertiesIntegration';

function MonEditeur() {
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);

  const handleElementClick = (event: React.MouseEvent<HTMLElement>) => {
    setSelectedElement(event.currentTarget);
  };

  const handlePropertyChange = (elementId: string, property: string, value: any) => {
    console.log('Propriété modifiée:', { elementId, property, value });
    // Ici, vous pouvez sauvegarder les changements
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Zone d'édition */}
      <div style={{ flex: 1 }}>
        <div 
          data-template-id="hero-centered"
          onClick={handleElementClick}
        >
          Mon bloc héro
        </div>
      </div>

      {/* Panneau de propriétés */}
      <div style={{ width: '320px' }}>
        <BlockPropertiesIntegration
          selectedElement={selectedElement}
          onPropertyChange={handlePropertyChange}
          mode="sidebar"
        />
      </div>
    </div>
  );
}
```

### 2. Utilisation avec l'exemple complet

```tsx
import { EditorDemo } from './components/editor/EditorWithBlockProperties';

function App() {
  return <EditorDemo />;
}
```

## Configuration des templates

### 1. Ajouter l'attribut data-template-id

Chaque template doit avoir un attribut `data-template-id` pour être détecté :

```typescript
// Dans vos templates
template: {
  type: 'section',
  tag: 'section',
  attributes: {
    'data-template-id': 'hero-centered'  // ← Important !
  },
  styles: {
    // ...
  }
}
```

### 2. Définir le schéma de propriétés

Les propriétés sont automatiquement générées à partir du registre. Vous pouvez personnaliser le schéma :

```typescript
import { BlockPropertyRegistry } from './elements/block-property-registry';

// Ajouter des propriétés personnalisées
BlockPropertyRegistry.registerSchema('mon-bloc-custom', {
  layout: {
    label: 'Mise en page',
    icon: '📐',
    properties: {
      padding: {
        type: 'range',
        label: 'Espacement interne',
        min: 0,
        max: 100,
        step: 4,
        unit: 'px',
        defaultValue: 20
      },
      backgroundColor: {
        type: 'color',
        label: 'Couleur de fond',
        defaultValue: '#ffffff'
      }
    }
  }
});
```

## Types de propriétés disponibles

### 1. Couleur
```typescript
{
  type: 'color',
  label: 'Couleur de fond',
  defaultValue: '#ffffff',
  palette: ['#ffffff', '#000000', '#2563eb'] // Optionnel
}
```

### 2. Plage (Range)
```typescript
{
  type: 'range',
  label: 'Taille',
  min: 0,
  max: 100,
  step: 1,
  unit: 'px',
  defaultValue: 16
}
```

### 3. Sélection
```typescript
{
  type: 'select',
  label: 'Alignement',
  options: [
    { value: 'left', label: 'Gauche' },
    { value: 'center', label: 'Centre' },
    { value: 'right', label: 'Droite' }
  ],
  defaultValue: 'center'
}
```

### 4. Texte
```typescript
{
  type: 'text',
  label: 'Titre',
  placeholder: 'Entrez le titre...',
  defaultValue: ''
}
```

### 5. Nombre
```typescript
{
  type: 'number',
  label: 'Largeur',
  min: 0,
  max: 1200,
  step: 1,
  unit: 'px',
  defaultValue: 300
}
```

### 6. Booléen (Checkbox)
```typescript
{
  type: 'boolean',
  label: 'Afficher l\'ombre',
  defaultValue: false
}
```

## Modes d'affichage

### 1. Sidebar (par défaut)
```tsx
<BlockPropertiesIntegration mode="sidebar" />
```

### 2. Flottant
```tsx
<BlockPropertiesIntegration 
  mode="floating" 
  position={{ x: 100, y: 100 }} 
/>
```

### 3. Modal
```tsx
<BlockPropertiesIntegration mode="modal" />
```

## Événements et callbacks

### onPropertyChange
Appelé quand une propriété est modifiée :

```tsx
const handlePropertyChange = (elementId: string, property: string, value: any) => {
  // Sauvegarder dans votre store/état
  updateElementProperty(elementId, property, value);
  
  // Ou appliquer directement au DOM
  const element = document.querySelector(`[data-element-id="${elementId}"]`);
  if (element) {
    (element as HTMLElement).style[property] = value;
  }
};
```

### onSelectionChange
Appelé quand la sélection change :

```tsx
const handleSelectionChange = (elementId: string | null) => {
  setCurrentSelection(elementId);
  
  // Mettre à jour l'interface utilisateur
  updateSelectionIndicator(elementId);
};
```

## Personnalisation avancée

### 1. Créer des propriétés personnalisées

```typescript
// Créer un nouveau type de propriété
export interface CustomProperty extends BaseProperty {
  type: 'custom';
  customConfig: any;
}

// L'ajouter au registre
BlockPropertyRegistry.registerCustomType('custom', CustomPropertyComponent);
```

### 2. Styles personnalisés

```css
/* Personnaliser l'apparence */
.block-properties-integration {
  --bp-primary: #your-brand-color;
  --bp-border-radius: 12px;
}

/* Thème sombre */
.dark-theme .block-properties-integration {
  background: #1a1a1a;
  color: #ffffff;
}
```

### 3. Validation des propriétés

```typescript
const schema = {
  layout: {
    properties: {
      width: {
        type: 'number',
        label: 'Largeur',
        validate: (value: number) => {
          if (value < 100) return 'La largeur doit être d\'au moins 100px';
          if (value > 1200) return 'La largeur ne peut pas dépasser 1200px';
          return null;
        }
      }
    }
  }
};
```

## Bonnes pratiques

### 1. Nommage des templates
- Utilisez des IDs descriptifs : `hero-centered`, `features-3-cols`
- Préfixez par catégorie : `blog-grid-3`, `contact-form`

### 2. Organisation des propriétés
- Groupez logiquement : `layout`, `appearance`, `content`, `typography`
- Limitez à 5-7 propriétés par groupe
- Utilisez des labels clairs et des descriptions

### 3. Performance
- Les propriétés sont appliquées en temps réel
- Évitez les propriétés trop complexes qui ralentissent l'interface
- Utilisez `debounce` pour les propriétés de type `range`

### 4. Accessibilité
- Tous les contrôles sont accessibles au clavier
- Les labels sont associés aux contrôles
- Les couleurs ont un contraste suffisant

## Dépannage

### Le panneau ne s'affiche pas
1. Vérifiez que l'élément a l'attribut `data-template-id`
2. Vérifiez que le template est enregistré dans le registre
3. Vérifiez la console pour les erreurs

### Les propriétés ne s'appliquent pas
1. Vérifiez que `BlockPropertyManager.applyProperty()` est appelé
2. Vérifiez que l'élément DOM existe
3. Vérifiez les styles CSS en conflit

### Erreurs de TypeScript
1. Importez les types depuis `./elements/block-properties`
2. Vérifiez que tous les schémas sont bien typés
3. Utilisez `BlockPropertySchema` pour les définitions

## Exemples complets

Consultez les fichiers d'exemple :
- `BlockPropertiesExample.tsx` - Exemple basique
- `EditorWithBlockProperties.tsx` - Intégration complète
- `examples/` - Autres exemples d'usage

## Support et contribution

Pour signaler des bugs ou proposer des améliorations :
1. Vérifiez les issues existantes
2. Créez une issue détaillée avec un exemple reproductible
3. Proposez une pull request avec tests

---

Ce système est conçu pour être extensible et facile à intégrer. N'hésitez pas à l'adapter selon vos besoins spécifiques !