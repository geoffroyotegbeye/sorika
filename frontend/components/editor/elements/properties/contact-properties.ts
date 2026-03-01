/**
 * Contact Block Properties
 * 
 * Propriétés spécifiques aux blocs de contact et formulaires
 */

import { BlockPropertySchema, BlockDefinition } from '../block-properties';

export const CONTACT_PROPERTIES: BlockPropertySchema = {
  layout: {
    type: 'select',
    label: 'Disposition',
    description: 'Disposition du contenu',
    default: 'split',
    options: [
      { value: 'split', label: 'Info + Formulaire' },
      { value: 'form-only', label: 'Formulaire seul' },
      { value: 'info-only', label: 'Informations seules' },
      { value: 'newsletter', label: 'Newsletter' }
    ],
    group: 'layout'
  },

  backgroundColor: {
    type: 'color',
    label: 'Couleur de fond',
    description: 'Couleur de fond de la section',
    default: '#f8fafc',
    palette: ['#ffffff', '#f8fafc', '#f1f5f9', '#eff6ff', '#0f172a'],
    allowCustom: true,
    group: 'appearance'
  },

  showContactInfo: {
    type: 'boolean',
    label: 'Afficher les infos de contact',
    description: 'Affiche email, téléphone et adresse',
    default: true,
    group: 'content'
  },

  showEmail: {
    type: 'boolean',
    label: 'Afficher l\'email',
    description: 'Affiche l\'adresse email',
    default: true,
    group: 'content'
  },

  showPhone: {
    type: 'boolean',
    label: 'Afficher le téléphone',
    description: 'Affiche le numéro de téléphone',
    default: true,
    group: 'content'
  },

  showAddress: {
    type: 'boolean',
    label: 'Afficher l\'adresse',
    description: 'Affiche l\'adresse physique',
    default: true,
    group: 'content'
  },

  formStyle: {
    type: 'select',
    label: 'Style du formulaire',
    description: 'Style visuel du formulaire',
    default: 'card',
    options: [
      { value: 'card', label: 'Carte avec ombre' },
      { value: 'flat', label: 'Plat' },
      { value: 'bordered', label: 'Avec bordure' },
      { value: 'minimal', label: 'Minimal' }
    ],
    group: 'appearance'
  },

  formFields: {
    type: 'select',
    label: 'Champs du formulaire',
    description: 'Champs à inclure dans le formulaire',
    default: 'complete',
    options: [
      { value: 'minimal', label: 'Email seulement' },
      { value: 'basic', label: 'Nom + Email' },
      { value: 'complete', label: 'Formulaire complet' },
      { value: 'custom', label: 'Personnalisé' }
    ],
    group: 'content'
  },

  buttonText: {
    type: 'text',
    label: 'Texte du bouton',
    description: 'Texte du bouton d\'envoi',
    default: 'Envoyer le message →',
    maxLength: 30,
    group: 'content'
  },

  showPrivacyNote: {
    type: 'boolean',
    label: 'Note de confidentialité',
    description: 'Affiche une note sur la confidentialité',
    default: true,
    group: 'content'
  }
};

export const CONTACT_BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  'contact-split': {
    id: 'contact-split',
    name: 'Contact Split Info + Formulaire',
    category: 'Contact',
    selector: '.s_contact_split, [data-template-id="contact-split"]',
    properties: CONTACT_PROPERTIES
  },

  'contact-newsletter': {
    id: 'contact-newsletter',
    name: 'Newsletter / Email Capture',
    category: 'Contact',
    selector: '.s_contact_newsletter, [data-template-id="contact-newsletter"]',
    properties: CONTACT_PROPERTIES
  }
};