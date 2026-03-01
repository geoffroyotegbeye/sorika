/**
 * Hero Block Properties
 * 
 * Propriétés spécifiques aux blocs hero/bannière principale
 */

import { BlockPropertySchema, BlockDefinition } from '../block-properties';

export const HERO_PROPERTIES: BlockPropertySchema = {
  minHeight: {
    type: 'range',
    label: 'Hauteur minimale',
    description: 'Hauteur minimale de la section hero',
    min: 300,
    max: 800,
    step: 20,
    unit: 'px',
    default: 500,
    group: 'layout'
  },

  paddingTop: {
    type: 'range',
    label: 'Espacement haut',
    description: 'Espacement en haut de la section',
    min: 40,
    max: 200,
    step: 10,
    unit: 'px',
    default: 120,
    group: 'layout'
  },

  paddingBottom: {
    type: 'range',
    label: 'Espacement bas',
    description: 'Espacement en bas de la section',
    min: 40,
    max: 200,
    step: 10,
    unit: 'px',
    default: 100,
    group: 'layout'
  },

  textAlign: {
    type: 'select',
    label: 'Alignement du texte',
    description: 'Alignement horizontal du contenu',
    default: 'center',
    options: [
      { value: 'left', label: 'Gauche' },
      { value: 'center', label: 'Centré' },
      { value: 'right', label: 'Droite' }
    ],
    group: 'layout'
  },

  backgroundColor: {
    type: 'color',
    label: 'Couleur de fond',
    description: 'Couleur de fond de la section',
    default: '#f8fafc',
    palette: ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#0f172a', '#1e1b4b'],
    allowCustom: true,
    group: 'appearance'
  },

  backgroundType: {
    type: 'select',
    label: 'Type de fond',
    description: 'Type de fond à utiliser',
    default: 'solid',
    options: [
      { value: 'solid', label: 'Couleur unie' },
      { value: 'gradient', label: 'Dégradé' },
      { value: 'image', label: 'Image' }
    ],
    group: 'appearance'
  },

  showBadge: {
    type: 'boolean',
    label: 'Afficher le badge',
    description: 'Affiche le badge au-dessus du titre',
    default: true,
    group: 'content'
  },

  badgeText: {
    type: 'text',
    label: 'Texte du badge',
    description: 'Texte affiché dans le badge',
    default: '✦ Nouveau — Version 2.0 disponible',
    maxLength: 50,
    group: 'content'
  },

  titleSize: {
    type: 'range',
    label: 'Taille du titre',
    description: 'Taille de police du titre principal',
    min: 28,
    max: 72,
    step: 4,
    unit: 'px',
    default: 56,
    group: 'typography'
  },

  showSubtitle: {
    type: 'boolean',
    label: 'Afficher le sous-titre',
    description: 'Affiche le texte descriptif sous le titre',
    default: true,
    group: 'content'
  },

  showButtons: {
    type: 'boolean',
    label: 'Afficher les boutons',
    description: 'Affiche les boutons call-to-action',
    default: true,
    group: 'content'
  },

  buttonLayout: {
    type: 'select',
    label: 'Disposition des boutons',
    description: 'Disposition des boutons CTA',
    default: 'horizontal',
    options: [
      { value: 'horizontal', label: 'Horizontal' },
      { value: 'vertical', label: 'Vertical' },
      { value: 'stacked', label: 'Empilés' }
    ],
    group: 'content'
  },

  showSocialProof: {
    type: 'boolean',
    label: 'Afficher la preuve sociale',
    description: 'Affiche les étoiles et avis clients',
    default: true,
    group: 'content'
  },

  showStats: {
    type: 'boolean',
    label: 'Afficher les statistiques',
    description: 'Affiche les statistiques en bas (pour hero gradient)',
    default: false,
    group: 'content'
  }
};

export const HERO_BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  'hero-centered': {
    id: 'hero-centered',
    name: 'Hero Centré',
    category: 'Hero',
    selector: '.s_hero_centered, [data-template-id="hero-centered"]',
    properties: HERO_PROPERTIES
  },

  'hero-split': {
    id: 'hero-split',
    name: 'Hero Split Texte + Image',
    category: 'Hero',
    selector: '.s_hero_split, [data-template-id="hero-split"]',
    properties: HERO_PROPERTIES
  },

  'hero-gradient-dark': {
    id: 'hero-gradient-dark',
    name: 'Hero Gradient Sombre',
    category: 'Hero',
    selector: '.s_hero_gradient_dark, [data-template-id="hero-gradient-dark"]',
    properties: HERO_PROPERTIES
  }
};