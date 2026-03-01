/**
 * Pricing Block Properties
 * 
 * Propriétés spécifiques aux blocs de tarification
 */

import { BlockPropertySchema, BlockDefinition } from '../block-properties';

export const PRICING_PROPERTIES: BlockPropertySchema = {
  columns: {
    type: 'select',
    label: 'Nombre de colonnes',
    description: 'Nombre de plans tarifaires à afficher',
    default: 3,
    options: [
      { value: 1, label: '1 colonne' },
      { value: 2, label: '2 colonnes' },
      { value: 3, label: '3 colonnes' },
      { value: 4, label: '4 colonnes' }
    ],
    group: 'layout'
  },

  currency: {
    type: 'text',
    label: 'Symbole monétaire',
    description: 'Symbole de la devise à afficher',
    default: '€',
    placeholder: '€, $, £...',
    maxLength: 3,
    group: 'content'
  },

  showPopular: {
    type: 'boolean',
    label: 'Badge "Populaire"',
    description: 'Affiche un badge sur le plan recommandé',
    default: true,
    group: 'content'
  },

  popularText: {
    type: 'text',
    label: 'Texte du badge populaire',
    description: 'Texte affiché sur le plan populaire',
    default: '⭐  Le plus populaire',
    maxLength: 30,
    group: 'content'
  },

  cardStyle: {
    type: 'select',
    label: 'Style des cartes',
    description: 'Style visuel des cartes tarifaires',
    default: 'elevated',
    options: [
      { value: 'flat', label: 'Plat' },
      { value: 'elevated', label: 'Surélevé' },
      { value: 'bordered', label: 'Avec bordure' },
      { value: 'gradient', label: 'Dégradé' }
    ],
    group: 'appearance'
  },

  spacing: {
    type: 'range',
    label: 'Espacement entre cartes',
    description: 'Espacement entre les cartes tarifaires',
    min: 16,
    max: 48,
    step: 4,
    unit: 'px',
    default: 24,
    group: 'layout'
  },

  backgroundColor: {
    type: 'color',
    label: 'Couleur de fond',
    description: 'Couleur de fond de la section',
    default: '#f8fafc',
    palette: ['#ffffff', '#f8fafc', '#f1f5f9', '#eff6ff'],
    allowCustom: true,
    group: 'appearance'
  },

  highlightColor: {
    type: 'color',
    label: 'Couleur du plan populaire',
    description: 'Couleur de fond du plan mis en avant',
    default: '#2563eb',
    palette: ['#2563eb', '#7c3aed', '#059669', '#dc2626'],
    allowCustom: true,
    group: 'appearance'
  },

  showFeatures: {
    type: 'boolean',
    label: 'Afficher les fonctionnalités',
    description: 'Affiche la liste des fonctionnalités incluses',
    default: true,
    group: 'content'
  },

  featuresStyle: {
    type: 'select',
    label: 'Style des fonctionnalités',
    description: 'Style d\'affichage des fonctionnalités',
    default: 'checkmarks',
    options: [
      { value: 'checkmarks', label: 'Avec coches' },
      { value: 'bullets', label: 'Avec puces' },
      { value: 'icons', label: 'Avec icônes' },
      { value: 'minimal', label: 'Minimal' }
    ],
    group: 'content'
  },

  buttonStyle: {
    type: 'select',
    label: 'Style des boutons',
    description: 'Style des boutons d\'action',
    default: 'varied',
    options: [
      { value: 'uniform', label: 'Uniforme' },
      { value: 'varied', label: 'Varié selon le plan' },
      { value: 'outline', label: 'Contour' },
      { value: 'minimal', label: 'Minimal' }
    ],
    group: 'appearance'
  }
};

export const PRICING_BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  'pricing-3-cards': {
    id: 'pricing-3-cards',
    name: 'Tarifs 3 Cartes',
    category: 'Pricing',
    selector: '.s_pricing_3_cards, [data-template-id="pricing-3-cards"]',
    properties: PRICING_PROPERTIES
  }
};