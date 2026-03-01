/**
 * Banner Block Properties
 * 
 * Propriétés spécifiques aux blocs de bannière d'annonce
 */

import { BlockPropertySchema, BlockDefinition } from '../block-properties';

export const BANNER_PROPERTIES: BlockPropertySchema = {
  backgroundColor: {
    type: 'color',
    label: 'Couleur de fond',
    description: 'Couleur de fond de la bannière',
    default: '#2563eb',
    palette: ['#2563eb', '#7c3aed', '#059669', '#dc2626', '#ea580c', '#0f172a'],
    allowCustom: true,
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

  padding: {
    type: 'range',
    label: 'Espacement vertical',
    description: 'Espacement haut et bas de la bannière',
    min: 8,
    max: 24,
    step: 2,
    unit: 'px',
    default: 12,
    group: 'layout'
  },

  showIcon: {
    type: 'boolean',
    label: 'Afficher l\'icône',
    description: 'Affiche l\'icône au début du texte',
    default: true,
    group: 'content'
  },

  iconText: {
    type: 'text',
    label: 'Icône/Emoji',
    description: 'Icône ou emoji à afficher',
    default: '🎉',
    maxLength: 5,
    group: 'content'
  },

  showLink: {
    type: 'boolean',
    label: 'Afficher le lien',
    description: 'Affiche le lien "En savoir plus"',
    default: true,
    group: 'content'
  },

  linkText: {
    type: 'text',
    label: 'Texte du lien',
    description: 'Texte du lien d\'action',
    default: 'En savoir plus →',
    maxLength: 30,
    group: 'content'
  },

  position: {
    type: 'select',
    label: 'Position',
    description: 'Position de la bannière sur la page',
    default: 'top',
    options: [
      { value: 'top', label: 'En haut' },
      { value: 'bottom', label: 'En bas' },
      { value: 'fixed-top', label: 'Fixe en haut' },
      { value: 'fixed-bottom', label: 'Fixe en bas' }
    ],
    group: 'layout'
  }
};

export const BANNER_BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  'banner-announcement': {
    id: 'banner-announcement',
    name: 'Bannière Annonce',
    category: 'Banner',
    selector: '.s_banner_announcement, [data-template-id="banner-announcement"]',
    properties: BANNER_PROPERTIES
  }
};