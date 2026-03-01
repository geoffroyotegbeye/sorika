/**
 * Blog Block Properties
 * 
 * Propriétés spécifiques aux blocs de blog/articles
 */

import { BlockPropertySchema, BlockDefinition } from '../block-properties';

export const BLOG_PROPERTIES: BlockPropertySchema = {
  columns: {
    type: 'select',
    label: 'Nombre de colonnes',
    description: 'Nombre d\'articles par ligne',
    default: 3,
    options: [
      { value: 1, label: '1 colonne' },
      { value: 2, label: '2 colonnes' },
      { value: 3, label: '3 colonnes' },
      { value: 4, label: '4 colonnes' }
    ],
    group: 'layout'
  },

  articlesCount: {
    type: 'range',
    label: 'Nombre d\'articles',
    description: 'Nombre d\'articles à afficher',
    min: 1,
    max: 12,
    step: 1,
    default: 3,
    group: 'content'
  },

  showImages: {
    type: 'boolean',
    label: 'Afficher les images',
    description: 'Affiche les images des articles',
    default: true,
    group: 'content'
  },

  imageHeight: {
    type: 'range',
    label: 'Hauteur des images',
    description: 'Hauteur des images d\'articles',
    min: 150,
    max: 300,
    step: 10,
    unit: 'px',
    default: 200,
    group: 'content'
  },

  showDate: {
    type: 'boolean',
    label: 'Afficher la date',
    description: 'Affiche la date de publication',
    default: true,
    group: 'content'
  },

  showReadTime: {
    type: 'boolean',
    label: 'Afficher le temps de lecture',
    description: 'Affiche le temps de lecture estimé',
    default: true,
    group: 'content'
  },

  showExcerpt: {
    type: 'boolean',
    label: 'Afficher l\'extrait',
    description: 'Affiche un extrait de l\'article',
    default: true,
    group: 'content'
  },

  showReadMore: {
    type: 'boolean',
    label: 'Afficher "Lire la suite"',
    description: 'Affiche le lien vers l\'article complet',
    default: true,
    group: 'content'
  },

  cardStyle: {
    type: 'select',
    label: 'Style des cartes',
    description: 'Style visuel des cartes d\'articles',
    default: 'bordered',
    options: [
      { value: 'flat', label: 'Plat' },
      { value: 'bordered', label: 'Avec bordure' },
      { value: 'shadow', label: 'Avec ombre' },
      { value: 'elevated', label: 'Surélevé' }
    ],
    group: 'appearance'
  },

  spacing: {
    type: 'range',
    label: 'Espacement entre cartes',
    description: 'Espacement entre les cartes d\'articles',
    min: 16,
    max: 48,
    step: 4,
    unit: 'px',
    default: 32,
    group: 'layout'
  }
};

export const BLOG_BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  'blog-grid-3': {
    id: 'blog-grid-3',
    name: 'Blog Grille 3 Articles',
    category: 'Blog',
    selector: '.s_blog_grid_3, [data-template-id="blog-grid-3"]',
    properties: BLOG_PROPERTIES
  }
};