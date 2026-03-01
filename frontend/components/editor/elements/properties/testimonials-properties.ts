/**
 * Testimonials Block Properties
 * 
 * Propriétés spécifiques aux blocs de témoignages
 */

import { BlockPropertySchema, BlockDefinition } from '../block-properties';

export const TESTIMONIALS_PROPERTIES: BlockPropertySchema = {
  columns: {
    type: 'select',
    label: 'Nombre de colonnes',
    description: 'Nombre de témoignages par ligne',
    default: 3,
    options: [
      { value: 1, label: '1 colonne' },
      { value: 2, label: '2 colonnes' },
      { value: 3, label: '3 colonnes' },
      { value: 4, label: '4 colonnes' }
    ],
    group: 'layout'
  },

  testimonialsCount: {
    type: 'range',
    label: 'Nombre de témoignages',
    description: 'Nombre de témoignages à afficher',
    min: 1,
    max: 9,
    step: 1,
    default: 3,
    group: 'content'
  },

  showStars: {
    type: 'boolean',
    label: 'Afficher les étoiles',
    description: 'Affiche les étoiles de notation',
    default: true,
    group: 'content'
  },

  starsStyle: {
    type: 'select',
    label: 'Style des étoiles',
    description: 'Style d\'affichage des étoiles',
    default: 'emoji',
    options: [
      { value: 'emoji', label: 'Emoji ⭐' },
      { value: 'icons', label: 'Icônes' },
      { value: 'text', label: 'Texte (5/5)' },
      { value: 'minimal', label: 'Minimal' }
    ],
    group: 'content'
  },

  showAvatars: {
    type: 'boolean',
    label: 'Afficher les avatars',
    description: 'Affiche les photos des clients',
    default: true,
    group: 'content'
  },

  avatarStyle: {
    type: 'select',
    label: 'Style des avatars',
    description: 'Style des photos de profil',
    default: 'circle',
    options: [
      { value: 'circle', label: 'Circulaire' },
      { value: 'rounded', label: 'Arrondi' },
      { value: 'square', label: 'Carré' },
      { value: 'initials', label: 'Initiales' }
    ],
    group: 'appearance'
  },

  cardStyle: {
    type: 'select',
    label: 'Style des cartes',
    description: 'Style visuel des cartes de témoignages',
    default: 'elevated',
    options: [
      { value: 'flat', label: 'Plat' },
      { value: 'elevated', label: 'Surélevé' },
      { value: 'bordered', label: 'Avec bordure' },
      { value: 'quote', label: 'Style citation' }
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

  quoteStyle: {
    type: 'select',
    label: 'Style des citations',
    description: 'Style d\'affichage des citations',
    default: 'italic',
    options: [
      { value: 'normal', label: 'Normal' },
      { value: 'italic', label: 'Italique' },
      { value: 'quotes', label: 'Avec guillemets' },
      { value: 'minimal', label: 'Minimal' }
    ],
    group: 'typography'
  },

  showCompany: {
    type: 'boolean',
    label: 'Afficher l\'entreprise',
    description: 'Affiche le nom de l\'entreprise du client',
    default: true,
    group: 'content'
  },

  spacing: {
    type: 'range',
    label: 'Espacement entre cartes',
    description: 'Espacement entre les témoignages',
    min: 16,
    max: 40,
    step: 4,
    unit: 'px',
    default: 24,
    group: 'layout'
  }
};

export const TESTIMONIALS_BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  'testimonials-grid': {
    id: 'testimonials-grid',
    name: 'Témoignages Grille',
    category: 'Testimonials',
    selector: '.s_testimonials_grid, [data-template-id="testimonials-grid"]',
    properties: TESTIMONIALS_PROPERTIES
  }
};