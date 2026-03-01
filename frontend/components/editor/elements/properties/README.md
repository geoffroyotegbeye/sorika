# Block Properties - Structure Modulaire

Ce dossier contient les définitions de propriétés pour chaque type de bloc, organisées de manière modulaire pour une meilleure maintenabilité.

## 📁 Structure

```
properties/
├── index.ts                    # Point d'entrée centralisé
├── README.md                   # Cette documentation
├── header-properties.ts        # Propriétés des blocs header
├── hero-properties.ts          # Propriétés des blocs hero
├── banner-properties.ts        # Propriétés des blocs banner
├── blog-properties.ts          # Propriétés des blocs blog
├── contact-properties.ts       # Propriétés des blocs contact
├── cta-properties.ts           # Propriétés des blocs CTA
├── features-properties.ts      # Propriétés des blocs features
├── footer-properties.ts        # Propriétés des blocs footer
├── gallery-properties.ts       # Propriétés des blocs gallery
├── pricing-properties.ts       # Propriétés des blocs pricing
├── team-properties.ts          # Propriétés des blocs team
└── testimonials-properties.ts  # Propriétés des blocs testimonials
```

## 🎯 Avantages de cette structure

### 1. **Maintenabilité**
- Chaque type de bloc a son propre fichier
- Plus facile de trouver et modifier les propriétés d'un bloc spécifique
- Réduction des conflits lors du travail en équipe

### 2. **Lisibilité**
- Fichiers plus courts et focalisés
- Structure claire et logique
- Documentation spécifique par type de bloc

### 3. **Extensibilité**
- Facile d'ajouter de nouveaux types de blocs
- Possibilité de créer des sous-catégories
- Import sélectif possible

### 4. **Performance**
- Import à la demande (tree-shaking)
- Chargement plus rapide
- Moins de mémoire utilisée

## 🔧 Comment ajouter un nouveau type de bloc

### 1. Créer le fichier de propriétés

```typescript
// frontend/components/editor/elements/properties/mon-bloc-properties.ts

import { BlockPropertySchema, BlockDefinition } from '../block-properties';

export const MON_BLOC_PROPERTIES: BlockPropertySchema = {
  // Définir les propriétés ici
  backgroundColor: {
    type: 'color',
    label: 'Couleur de fond',
    default: '#ffffff',
    group: 'appearance'
  },
  // ... autres propriétés
};

export const MON_BLOC_DEFINITIONS: Record<string, BlockDefinition> = {
  'mon-bloc-id': {
    id: 'mon-bloc-id',
    name: 'Mon Bloc',
    category: 'MaCategorie',
    selector: '[data-template-id="mon-bloc-id"]',
    properties: MON_BLOC_PROPERTIES
  }
};
```

### 2. Ajouter l'export dans index.ts

```typescript
// frontend/components/editor/elements/properties/index.ts

// Ajouter l'import
export * from './mon-bloc-properties';
import { MON_BLOC_DEFINITIONS } from './mon-bloc-properties';

// Ajouter aux définitions consolidées
export const ALL_BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  // ... autres définitions
  ...MON_BLOC_DEFINITIONS
};

// Ajouter à la catégorisation
export const BLOCK_DEFINITIONS_BY_CATEGORY = {
  // ... autres catégories
  MaCategorie: MON_BLOC_DEFINITIONS
};
```

### 3. Le bloc sera automatiquement disponible

Le nouveau bloc sera automatiquement disponible dans le système de propriétés sans modification supplémentaire.

## 📋 Format standard d'un fichier de propriétés

Chaque fichier suit cette structure :

```typescript
/**
 * [Type] Block Properties
 * 
 * Propriétés spécifiques aux blocs de [type]
 */

import { BlockPropertySchema, BlockDefinition } from '../block-properties';

// Schéma des propriétés
export const [TYPE]_PROPERTIES: BlockPropertySchema = {
  // Propriétés groupées logiquement
  // layout, appearance, content, typography, interaction
};

// Définitions des blocs utilisant ces propriétés
export const [TYPE]_BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  'template-id': {
    id: 'template-id',
    name: 'Nom Affiché',
    category: 'Catégorie',
    selector: '.css-selector, [data-template-id="template-id"]',
    properties: [TYPE]_PROPERTIES
  }
};
```

## 🎨 Groupes de propriétés recommandés

### `layout` - Mise en page
- Dimensions, espacement, positionnement
- Colonnes, grilles, alignement

### `appearance` - Apparence
- Couleurs, bordures, ombres
- Styles visuels, thèmes

### `content` - Contenu
- Affichage d'éléments, textes
- Nombre d'items, options de contenu

### `typography` - Typographie
- Tailles de police, styles de texte
- Alignement du texte

### `interaction` - Interactions
- Effets au survol, animations
- Comportements utilisateur

### `branding` - Marque (pour headers/footers)
- Logo, couleurs de marque
- Éléments d'identité

## 🔄 Migration depuis l'ancien système

L'ancien fichier `block-property-registry.ts` a été refactorisé pour utiliser cette nouvelle structure modulaire. Toutes les fonctions existantes continuent de fonctionner grâce à la compatibilité maintenue.

## 🧪 Tests et validation

Chaque fichier de propriétés peut être testé indépendamment :

```typescript
import { HEADER_PROPERTIES, HEADER_BLOCK_DEFINITIONS } from './header-properties';

// Valider le schéma
console.log('Propriétés header:', Object.keys(HEADER_PROPERTIES));

// Valider les définitions
console.log('Blocs header:', Object.keys(HEADER_BLOCK_DEFINITIONS));
```

## 📚 Documentation des propriétés

Chaque propriété doit inclure :
- `label` : Nom affiché dans l'interface
- `description` : Explication de l'effet
- `group` : Groupe logique
- `default` : Valeur par défaut

Exemple complet :
```typescript
backgroundColor: {
  type: 'color',
  label: 'Couleur de fond',
  description: 'Couleur de fond de la section',
  default: '#ffffff',
  palette: ['#ffffff', '#f8fafc', '#f1f5f9'],
  allowCustom: true,
  group: 'appearance'
}
```

---

Cette structure modulaire rend le système plus maintenable et extensible, tout en conservant la compatibilité avec l'existant.