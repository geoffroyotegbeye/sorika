/**
 * CTA Block Properties
 * 
 * Propriétés spécifiques aux blocs call-to-action
 */

import { BlockPropertySchema, BlockDefinition } from '../block-properties';

export const CTA_PROPERTIES: BlockPropertySchema = {
  layout: {
    type: 'select',
    label: 'Disposition',
    description: 'Disposition du contenu CTA',
    default: 'centered',
    options: [
      { value: 'centered', label: 'Centré' },
      { value: 'split', label: 'Texte + Bouton séparés' },
      { value: 'banner', label: 'Bandeau horizontal' }
    ],
    group: 'layout'
  },

  backgroundColor: {
    type: 'color',
    label: 'Couleur de fond',
    description: 'Couleur de fond de la section',
    default: '#2563eb',
    palette: ['#2563eb', '#7c3aed', '#059669', '#dc2626', '#0f172a', '#1e1b4b'],
    allowCustom: true,
    group: 'appearance'
  },

  backgroundType: {
    type: 'select',
    label: 'Type de fond',
    description: 'Type de fond à utiliser',
    default: 'gradient',
    options: [
      { value: 'solid', label: 'Couleur unie' },
      { value: 'gradient', label: 'Dégradé' },
      { value: 'image', label: 'Image' }
    ],
    group: 'appearance'
  },

  textColor: {
    type: 'color',
    label: 'Couleur du texte',
    description: 'Couleur du texte principal',
    default: '#ffffff',
    palette: ['#ffffff', '#f8fafc', '#e2e8f0', '#0f172a'],
    allowCustom: true,
    group: 'appearance'
  },

  titleSize: {
    type: 'range',
    label: 'Taille du titre',
    description: 'Taille de police du titre',
    min: 24,
    max: 56,
    step: 4,
    unit: 'px',
    default: 44,
    group: 'typography'
  },

  showSubtitle: {
    type: 'boolean',
    label: 'Afficher le sous-titre',
    description: 'Affiche le texte descriptif',
    default: true,
    group: 'content'
  },

  buttonCount: {
    type: 'select',
    label: 'Nombre de boutons',
    description: 'Nombre de boutons à afficher',
    default: 2,
    options: [
      { value: 1, label: '1 bouton' },
      { value: 2, label: '2 boutons' },
      { value: 3, label: '3 boutons' }
    ],
    group: 'content'
  },

  buttonLayout: {
    type: 'select',
    label: 'Disposition des boutons',
    description: 'Disposition des boutons',
    default: 'horizontal',
    options: [
      { value: 'horizontal', label: 'Horizontal' },
      { value: 'vertical', label: 'Vertical' },
      { value: 'stacked', label: 'Empilés' }
    ],
    group: 'content'
  },

  showTrustSignals: {
    type: 'boolean',
    label: 'Signaux de confiance',
    description: 'Affiche les signaux de confiance (essai gratuit, etc.)',
    default: true,
    group: 'content'
  },

  padding: {
    type: 'range',
    label: 'Espacement vertical',
    description: 'Espacement haut et bas',
    min: 40,
    max: 120,
    step: 8,
    unit: 'px',
    default: 96,
    group: 'layout'
  }
};

export const CTA_BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  'cta-centered': {
    id: 'cta-centered',
    name: 'CTA Centré',
    category: 'CTA',
    selector: '.s_cta_centered, [data-template-id="cta-centered"]',
    properties: CTA_PROPERTIES
  },

  'cta-split': {
    id: 'cta-split',
    name: 'CTA Bandeau Split',
    category: 'CTA',
    selector: '.s_cta_split, [data-template-id="cta-split"]',
    properties: CTA_PROPERTIES
  }
};