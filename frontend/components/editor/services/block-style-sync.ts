/**
 * Block Style Synchronization Service
 * 
 * Service professionnel pour synchroniser les propriétés des blocs
 * avec les styles des éléments dans l'éditeur et le preview.
 */

import { ElementStyle } from '@/lib/stores/editor-store';
import { BlockPropertyValues, BlockProperty } from '../elements/block-properties';
import { getBlockDefinition } from '../elements/block-property-registry';

/**
 * Mapping entre les propriétés de bloc et les propriétés CSS
 */
const PROPERTY_TO_CSS_MAPPING: Record<string, string | ((value: any) => Record<string, string>)> = {
  // Layout
  height: 'height',
  minHeight: 'minHeight',
  position: 'position',
  
  // Colors
  backgroundColor: 'backgroundColor',
  color: 'color',
  borderColor: 'borderColor',
  
  // Typography
  fontSize: 'fontSize',
  fontWeight: 'fontWeight',
  fontFamily: 'fontFamily',
  textAlign: 'textAlign',
  logoSize: 'fontSize', // Logo size maps to font size
  
  // Spacing
  padding: 'padding',
  margin: 'margin',
  
  // Border
  borderRadius: 'borderRadius',
  borderWidth: 'borderWidth',
  
  // Effects
  opacity: 'opacity',
  boxShadow: 'boxShadow',
  
  // Custom mappings
  showBorder: (value: boolean) => ({
    borderBottom: value ? '1px solid' : 'none'
  })
};

/**
 * Extrait les styles par défaut d'un élément existant
 */
export function extractDefaultStyles(element: any): BlockPropertyValues {
  const templateId = element.templateId || element.type;
  const blockDefinition = getBlockDefinition(templateId);
  
  if (!blockDefinition?.properties) {
    return {};
  }
  
  const defaultValues: BlockPropertyValues = {};
  const currentStyles = element.styles?.desktop || {};
  
  // Pour chaque propriété définie dans le bloc
  Object.entries(blockDefinition.properties).forEach(([key, property]) => {
    // Essayer de récupérer la valeur depuis les styles existants
    const cssProperty = PROPERTY_TO_CSS_MAPPING[key];
    
    if (typeof cssProperty === 'string' && currentStyles[cssProperty as keyof ElementStyle]) {
      defaultValues[key] = currentStyles[cssProperty as keyof ElementStyle];
    } else {
      // Utiliser la valeur par défaut définie dans le schéma
      defaultValues[key] = property.default || getDefaultValueForType(property);
    }
  });
  
  return defaultValues;
}

/**
 * Convertit les propriétés de bloc en styles CSS
 */
export function convertBlockPropertiesToStyles(
  properties: BlockPropertyValues,
  templateId: string
): Partial<ElementStyle> {
  const blockDefinition = getBlockDefinition(templateId);
  if (!blockDefinition?.properties) {
    return {};
  }
  
  const styles: Partial<ElementStyle> = {};
  
  Object.entries(properties).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    
    const mapping = PROPERTY_TO_CSS_MAPPING[key];
    
    if (typeof mapping === 'string') {
      // Mapping direct
      styles[mapping as keyof ElementStyle] = formatCSSValue(value, blockDefinition.properties![key]);
    } else if (typeof mapping === 'function') {
      // Mapping personnalisé
      const customStyles = mapping(value);
      Object.assign(styles, customStyles);
    }
  });
  
  return styles;
}

/**
 * Applique les propriétés de bloc à un élément
 */
export function applyBlockPropertiesToElement(
  element: any,
  properties: BlockPropertyValues,
  breakpoint: 'desktop' | 'tablet' | 'mobile' = 'desktop'
): any {
  const templateId = element.templateId || element.type;
  const newStyles = convertBlockPropertiesToStyles(properties, templateId);
  
  return {
    ...element,
    styles: {
      ...element.styles,
      [breakpoint]: {
        ...element.styles[breakpoint],
        ...newStyles
      }
    }
  };
}

/**
 * Synchronise les propriétés avec les styles en temps réel
 */
export function syncPropertiesWithStyles(
  element: any,
  propertyKey: string,
  propertyValue: any,
  breakpoint: 'desktop' | 'tablet' | 'mobile' = 'desktop'
): Partial<ElementStyle> {
  const mapping = PROPERTY_TO_CSS_MAPPING[propertyKey];
  
  if (!mapping) {
    console.warn(`No CSS mapping found for property: ${propertyKey}`);
    return {};
  }
  
  if (typeof mapping === 'string') {
    const templateId = element.templateId || element.type;
    const blockDefinition = getBlockDefinition(templateId);
    const property = blockDefinition?.properties?.[propertyKey];
    
    return {
      [mapping]: formatCSSValue(propertyValue, property)
    };
  } else if (typeof mapping === 'function') {
    return mapping(propertyValue);
  }
  
  return {};
}

/**
 * Formate une valeur pour CSS selon le type de propriété
 */
function formatCSSValue(value: any, property?: BlockProperty): string {
  if (!property) return String(value);
  
  switch (property.type) {
    case 'range':
    case 'number':
      return property.unit ? `${value}${property.unit}` : String(value);
    
    case 'color':
      return String(value);
    
    case 'select':
      return String(value);
    
    case 'boolean':
      return value ? '1' : '0';
    
    case 'text':
    default:
      return String(value);
  }
}

/**
 * Obtient une valeur par défaut selon le type de propriété
 */
function getDefaultValueForType(property: BlockProperty): any {
  switch (property.type) {
    case 'range':
    case 'number':
      return property.min || 0;
    
    case 'color':
      return '#000000';
    
    case 'select':
      return property.options?.[0]?.value || '';
    
    case 'boolean':
      return false;
    
    case 'text':
    default:
      return '';
  }
}

/**
 * Valide qu'une propriété est compatible avec un élément
 */
export function isPropertyCompatible(
  element: any,
  propertyKey: string
): boolean {
  const templateId = element.templateId || element.type;
  const blockDefinition = getBlockDefinition(templateId);
  
  return !!(blockDefinition?.properties?.[propertyKey]);
}

/**
 * Obtient les propriétés modifiées par rapport aux valeurs par défaut
 */
export function getModifiedProperties(
  element: any,
  currentProperties: BlockPropertyValues
): BlockPropertyValues {
  const defaultProperties = extractDefaultStyles(element);
  const modified: BlockPropertyValues = {};
  
  Object.entries(currentProperties).forEach(([key, value]) => {
    if (value !== defaultProperties[key]) {
      modified[key] = value;
    }
  });
  
  return modified;
}

/**
 * Réinitialise les propriétés aux valeurs par défaut
 */
export function resetPropertiesToDefaults(element: any): BlockPropertyValues {
  return extractDefaultStyles(element);
}