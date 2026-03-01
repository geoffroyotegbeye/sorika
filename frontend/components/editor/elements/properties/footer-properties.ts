/**
 * Footer Block Properties
 * 
 * Propriétés spécifiques aux blocs de pied de page
 */

import { BlockPropertySchema, BlockDefinition } from '../block-properties';

export const FOOTER_PROPERTIES: BlockPropertySchema = {
  layout: {
    type: 'select',
    label: 'Disposition',
    description: 'Disposition du footer',
    default: 'full',
    options: [
      { value: 'full', label: 'Complet (4 colonnes)' },
      { value: 'minimal', label: 'Minimal (1 ligne)' },
      { value: 'simple', label: 'Simple (2 colonnes)' },
      { value: 'newsletter', label: 'Avec newsletter' }
    ],
    group: 'layout'
  },

  backgroundColor: {
    type: 'color',
    label: 'Couleur de fond',
    description: 'Couleur de fond du footer',
    default: '#0f172a',
    palette: ['#0f172a', '#1e293b', '#374151', '#ffffff', '#f8fafc'],
    allowCustom: true,
    group: 'appearance'
  },

  textColor: {
    type: 'color',
    label: 'Couleur du texte',
    description: 'Couleur du texte principal',
    default: '#64748b',
    palette: ['#ffffff', '#e2e8f0', '#94a3b8', '#64748b', '#0f172a'],
    allowCustom: true,
    group: 'appearance'
  },

  linkColor: {
    type: 'color',
    label: 'Couleur des liens',
    description: 'Couleur des liens de navigation',
    default: '#64748b',
    palette: ['#ffffff', '#e2e8f0', '#94a3b8', '#64748b', '#2563eb'],
    allowCustom: true,
    group: 'appearance'
  },

  showBranding: {
    type: 'boolean',
    label: 'Afficher la marque',
    description: 'Affiche le logo et la description',
    default: true,
    group: 'content'
  },

  showSocialLinks: {
    type: 'boolean',
    label: 'Liens sociaux',
    description: 'Affiche les liens vers les réseaux sociaux',
    default: true,
    group: 'content'
  },

  showCopyright: {
    type: 'boolean',
    label: 'Copyright',
    description: 'Affiche la mention de copyright',
    default: true,
    group: 'content'
  },

  showLegalLinks: {
    type: 'boolean',
    label: 'Liens légaux',
    description: 'Affiche les liens légaux (CGU, Confidentialité)',
    default: true,
    group: 'content'
  },

  columnsCount: {
    type: 'range',
    label: 'Nombre de colonnes',
    description: 'Nombre de colonnes de liens',
    min: 2,
    max: 5,
    step: 1,
    default: 4,
    group: 'layout'
  },

  padding: {
    type: 'range',
    label: 'Espacement vertical',
    description: 'Espacement haut et bas',
    min: 32,
    max: 96,
    step: 8,
    unit: 'px',
    default: 72,
    group: 'layout'
  }
};

export const FOOTER_BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  'footer-full': {
    id: 'footer-full',
    name: 'Footer Complet',
    category: 'Footer',
    selector: '.s_footer_full, [data-template-id="footer-full"]',
    properties: FOOTER_PROPERTIES
  },

  'footer-minimal': {
    id: 'footer-minimal',
    name: 'Footer Minimal',
    category: 'Footer',
    selector: '.s_footer_minimal, [data-template-id="footer-minimal"]',
    properties: FOOTER_PROPERTIES
  }
};