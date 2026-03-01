/**
 * Features Block Properties
 * 
 * Propriétés spécifiques aux blocs de fonctionnalités
 */

import { BlockPropertySchema, BlockDefinition } from '../block-properties';

export const FEATURES_PROPERTIES: BlockPropertySchema = {
  columns: {
    type: 'select',
    label: 'Nombre de colonnes',
    description: 'Nombre de fonctionnalités par ligne',
    default: 3,
    options: [
      { value: 2, label: '2 colonnes' },
      { value: 3, label: '3 colonnes' },
      { value: 4, label: '4 colonnes' },
      { value: 6, label: '6 colonnes' }
    ],
    group: 'layout'
  },

  featuresCount: {
    type: 'range',
    label: 'Nombre de fonctionnalités',
    description: 'Nombre de fonctionnalités à afficher',
    min: 3,
    max: 12,
    step: 1,
    default: 6,
    group: 'content'
  },

  showIcons: {
    type: 'boolean',
    label: 'Afficher les icônes',
    description: 'Affiche les icônes des fonctionnalités',
    default: true,
    group: 'content'
  },

  iconStyle: {
    type: 'select',
    label: 'Style des icônes',
    description: 'Style visuel des icônes',
    default: 'rounded',
    options: [
      { value: 'rounded', label: 'Arrondies' },
      { value: 'square', label: 'Carrées' },
      { value: 'circle', label: 'Circulaires' },
      { value: 'minimal', label: 'Minimales' }
    ],
    group: 'appearance'
  },

  cardStyle: {
    type: 'select',
    label: 'Style des cartes',
    description: 'Style visuel des cartes de fonctionnalités',
    default: 'elevated',
    options: [
      { value: 'flat', label: 'Plat' },
      { value: 'bordered', label: 'Avec bordure' },
      { value: 'elevated', label: 'Surélevé' },
      { value: 'minimal', label: 'Minimal' }
    ],
    group: 'appearance'
  },

  backgroundColor: {
    type: 'color',
    label: 'Couleur de fond',
    description: 'Couleur de fond de la section',
    default: '#ffffff',
    palette: ['#ffffff', '#f8fafc', '#f1f5f9', '#eff6ff'],
    allowCustom: true,
    group: 'appearance'
  },

  cardBackgroundColor: {
    type: 'color',
    label: 'Couleur de fond des cartes',
    description: 'Couleur de fond des cartes individuelles',
    default: '#f8fafc',
    palette: ['#ffffff', '#f8fafc', '#f1f5f9', '#eff6ff'],
    allowCustom: true,
    group: 'appearance'
  },

  spacing: {
    type: 'range',
    label: 'Espacement entre cartes',
    description: 'Espacement entre les cartes',
    min: 16,
    max: 48,
    step: 4,
    unit: 'px',
    default: 28,
    group: 'layout'
  },

  showHeader: {
    type: 'boolean',
    label: 'Afficher l\'en-tête',
    description: 'Affiche le titre et la description de la section',
    default: true,
    group: 'content'
  }
};

export const FEATURES_BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  'features-3-cols': {
    id: 'features-3-cols',
    name: 'Fonctionnalités 3 Colonnes',
    category: 'Features',
    selector: '.s_features_3_cols, [data-template-id="features-3-cols"]',
    properties: FEATURES_PROPERTIES
  }
};