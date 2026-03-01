/**
 * Gallery Block Properties
 * 
 * Propriétés spécifiques aux blocs de galerie d'images
 */

import { BlockPropertySchema, BlockDefinition } from '../block-properties';

export const GALLERY_PROPERTIES: BlockPropertySchema = {
  columns: {
    type: 'select',
    label: 'Nombre de colonnes',
    description: 'Nombre d\'images par ligne',
    default: 4,
    options: [
      { value: 2, label: '2 colonnes' },
      { value: 3, label: '3 colonnes' },
      { value: 4, label: '4 colonnes' },
      { value: 5, label: '5 colonnes' },
      { value: 6, label: '6 colonnes' }
    ],
    group: 'layout'
  },

  imagesCount: {
    type: 'range',
    label: 'Nombre d\'images',
    description: 'Nombre d\'images à afficher',
    min: 4,
    max: 24,
    step: 2,
    default: 8,
    group: 'content'
  },

  imageHeight: {
    type: 'range',
    label: 'Hauteur des images',
    description: 'Hauteur fixe des images',
    min: 180,
    max: 320,
    step: 20,
    unit: 'px',
    default: 240,
    group: 'appearance'
  },

  imageStyle: {
    type: 'select',
    label: 'Style des images',
    description: 'Style visuel des images',
    default: 'rounded',
    options: [
      { value: 'square', label: 'Carrées' },
      { value: 'rounded', label: 'Arrondies' },
      { value: 'circle', label: 'Circulaires' },
      { value: 'minimal', label: 'Sans bordure' }
    ],
    group: 'appearance'
  },

  spacing: {
    type: 'range',
    label: 'Espacement entre images',
    description: 'Espacement entre les images',
    min: 8,
    max: 32,
    step: 4,
    unit: 'px',
    default: 16,
    group: 'layout'
  },

  backgroundColor: {
    type: 'color',
    label: 'Couleur de fond',
    description: 'Couleur de fond de la section',
    default: '#f8fafc',
    palette: ['#ffffff', '#f8fafc', '#f1f5f9', '#0f172a'],
    allowCustom: true,
    group: 'appearance'
  },

  showLightbox: {
    type: 'boolean',
    label: 'Lightbox',
    description: 'Ouvre les images en grand au clic',
    default: true,
    group: 'interaction'
  },

  showCaptions: {
    type: 'boolean',
    label: 'Légendes',
    description: 'Affiche les légendes des images',
    default: false,
    group: 'content'
  },

  hoverEffect: {
    type: 'select',
    label: 'Effet au survol',
    description: 'Effet visuel au survol des images',
    default: 'zoom',
    options: [
      { value: 'none', label: 'Aucun' },
      { value: 'zoom', label: 'Zoom' },
      { value: 'fade', label: 'Fondu' },
      { value: 'slide', label: 'Glissement' }
    ],
    group: 'interaction'
  }
};

export const GALLERY_BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  'gallery-grid-4': {
    id: 'gallery-grid-4',
    name: 'Galerie 4 Colonnes',
    category: 'Gallery',
    selector: '.s_gallery_grid_4, [data-template-id="gallery-grid-4"]',
    properties: GALLERY_PROPERTIES
  }
};