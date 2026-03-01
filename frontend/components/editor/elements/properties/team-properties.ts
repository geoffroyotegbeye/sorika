/**
 * Team Block Properties
 * 
 * Propriétés spécifiques aux blocs d'équipe
 */

import { BlockPropertySchema, BlockDefinition } from '../block-properties';

export const TEAM_PROPERTIES: BlockPropertySchema = {
  columns: {
    type: 'select',
    label: 'Nombre de colonnes',
    description: 'Nombre de membres par ligne',
    default: 4,
    options: [
      { value: 2, label: '2 colonnes' },
      { value: 3, label: '3 colonnes' },
      { value: 4, label: '4 colonnes' },
      { value: 5, label: '5 colonnes' }
    ],
    group: 'layout'
  },

  membersCount: {
    type: 'range',
    label: 'Nombre de membres',
    description: 'Nombre de membres d\'équipe à afficher',
    min: 2,
    max: 12,
    step: 1,
    default: 4,
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
      { value: 'hexagon', label: 'Hexagonal' }
    ],
    group: 'appearance'
  },

  avatarSize: {
    type: 'range',
    label: 'Taille des avatars',
    description: 'Taille des photos de profil',
    min: 60,
    max: 120,
    step: 10,
    unit: 'px',
    default: 80,
    group: 'appearance'
  },

  cardStyle: {
    type: 'select',
    label: 'Style des cartes',
    description: 'Style visuel des cartes de membres',
    default: 'elevated',
    options: [
      { value: 'flat', label: 'Plat' },
      { value: 'elevated', label: 'Surélevé' },
      { value: 'bordered', label: 'Avec bordure' },
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

  showSocialLinks: {
    type: 'boolean',
    label: 'Liens sociaux',
    description: 'Affiche les liens vers les profils sociaux',
    default: false,
    group: 'content'
  },

  showBio: {
    type: 'boolean',
    label: 'Biographie',
    description: 'Affiche une courte biographie',
    default: false,
    group: 'content'
  },

  textAlign: {
    type: 'select',
    label: 'Alignement du texte',
    description: 'Alignement du texte dans les cartes',
    default: 'center',
    options: [
      { value: 'left', label: 'Gauche' },
      { value: 'center', label: 'Centré' },
      { value: 'right', label: 'Droite' }
    ],
    group: 'layout'
  },

  spacing: {
    type: 'range',
    label: 'Espacement entre cartes',
    description: 'Espacement entre les cartes de membres',
    min: 16,
    max: 40,
    step: 4,
    unit: 'px',
    default: 24,
    group: 'layout'
  }
};

export const TEAM_BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  'team-grid': {
    id: 'team-grid',
    name: 'Équipe Grille',
    category: 'Team',
    selector: '.s_team_grid, [data-template-id="team-grid"]',
    properties: TEAM_PROPERTIES
  }
};