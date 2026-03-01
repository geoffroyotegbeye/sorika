/**
 * Header Block Properties
 * 
 * Propriétés spécifiques aux blocs de header/navigation
 */

import { BlockPropertySchema, BlockDefinition } from '../block-properties';

export const HEADER_PROPERTIES: BlockPropertySchema = {
  height: {
    type: 'range',
    label: 'Hauteur du header',
    description: 'Définit la hauteur du header',
    min: 50,
    max: 120,
    step: 4,
    unit: 'px',
    default: 68,
    group: 'layout'
  },
  
  position: {
    type: 'select',
    label: 'Position',
    description: 'Comportement de défilement du header',
    default: 'sticky',
    options: [
      { value: 'static', label: 'Statique' },
      { value: 'sticky', label: 'Fixe en haut' },
      { value: 'fixed', label: 'Toujours visible' }
    ],
    group: 'layout'
  },

  backgroundColor: {
    type: 'color',
    label: 'Couleur de fond',
    description: 'Couleur de fond du header',
    default: '#ffffff',
    palette: ['#ffffff', '#000000', '#f8fafc', '#1e293b', '#0f172a'],
    allowCustom: true,
    group: 'appearance'
  },

  logoSize: {
    type: 'range',
    label: 'Taille du logo',
    description: 'Taille de la police du logo',
    min: 16,
    max: 36,
    step: 2,
    unit: 'px',
    default: 22,
    group: 'branding'
  },

  showBorder: {
    type: 'boolean',
    label: 'Afficher la bordure',
    description: 'Affiche une bordure en bas du header',
    default: true,
    group: 'appearance'
  },

  borderColor: {
    type: 'color',
    label: 'Couleur de bordure',
    description: 'Couleur de la bordure inférieure',
    default: '#e2e8f0',
    palette: ['#e2e8f0', '#d1d5db', '#9ca3af', 'rgba(255,255,255,0.06)'],
    allowCustom: true,
    group: 'appearance'
  }
};

export const HEADER_BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  'header-nav-light': {
    id: 'header-nav-light',
    name: 'Header Clair',
    category: 'Header',
    selector: '.s_header_nav_light, [data-template-id="header-nav-light"]',
    properties: HEADER_PROPERTIES
  },

  'header-nav-dark': {
    id: 'header-nav-dark',
    name: 'Header Sombre',
    category: 'Header',
    selector: '.s_header_nav_dark, [data-template-id="header-nav-dark"]',
    properties: HEADER_PROPERTIES
  }
};