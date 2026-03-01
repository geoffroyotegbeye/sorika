/**
 * Hook pour la synchronisation des styles de bloc
 * 
 * Hook professionnel qui gère la synchronisation bidirectionnelle
 * entre les propriétés de bloc et les styles d'élément.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useEditorStore } from '@/lib/stores/editor-store';
import { BlockPropertyValues } from '../elements/block-properties';
import {
  extractDefaultStyles,
  applyBlockPropertiesToElement,
  syncPropertiesWithStyles,
  isPropertyCompatible
} from '../services/block-style-sync';

interface UseBlockStyleSyncOptions {
  /** Activer la synchronisation automatique */
  autoSync?: boolean;
  /** Breakpoint à utiliser */
  breakpoint?: 'desktop' | 'tablet' | 'mobile';
  /** Callback appelé lors des changements */
  onPropertyChange?: (key: string, value: any) => void;
}

export function useBlockStyleSync(
  element: any,
  options: UseBlockStyleSyncOptions = {}
) {
  const {
    autoSync = true,
    breakpoint = 'desktop',
    onPropertyChange
  } = options;

  const { updateElement, updateElementStyles } = useEditorStore();
  
  // État local des propriétés
  const [properties, setProperties] = useState<BlockPropertyValues>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Extraire les styles par défaut de l'élément
  const defaultProperties = useMemo(() => {
    if (!element) return {};
    return extractDefaultStyles(element);
  }, [element?.id, element?.templateId, element?.type]);

  // Initialiser les propriétés depuis l'élément
  useEffect(() => {
    if (element && !isInitialized) {
      setProperties(defaultProperties);
      setIsInitialized(true);
    }
  }, [element, defaultProperties, isInitialized]);

  // Fonction pour appliquer une propriété
  const applyProperty = useCallback((key: string, value: any) => {
    if (!element || !isPropertyCompatible(element, key)) {
      console.warn(`Property ${key} is not compatible with element ${element?.type}`);
      return false;
    }

    // Mettre à jour l'état local
    setProperties(prev => ({
      ...prev,
      [key]: value
    }));

    // Synchroniser avec les styles CSS
    if (autoSync) {
      const cssStyles = syncPropertiesWithStyles(element, key, value, breakpoint);
      
      if (Object.keys(cssStyles).length > 0) {
        updateElementStyles(element.id, cssStyles);
      }
    }

    // Callback externe
    onPropertyChange?.(key, value);

    return true;
  }, [element, autoSync, breakpoint, updateElementStyles, onPropertyChange]);

  // Fonction pour appliquer toutes les propriétés
  const applyAllProperties = useCallback((newProperties: BlockPropertyValues) => {
    if (!element) return false;

    setProperties(newProperties);

    if (autoSync) {
      const updatedElement = applyBlockPropertiesToElement(
        element,
        newProperties,
        breakpoint
      );
      
      updateElement(element.id, {
        styles: updatedElement.styles
      });
    }

    return true;
  }, [element, autoSync, breakpoint, updateElement]);

  // Fonction pour réinitialiser aux valeurs par défaut
  const resetToDefaults = useCallback(() => {
    if (!element) return;

    const defaults = extractDefaultStyles(element);
    setProperties(defaults);

    if (autoSync) {
      applyAllProperties(defaults);
    }
  }, [element, autoSync, applyAllProperties]);

  // Fonction pour obtenir la valeur actuelle d'une propriété
  const getPropertyValue = useCallback((key: string) => {
    return properties[key] ?? defaultProperties[key];
  }, [properties, defaultProperties]);

  // Fonction pour vérifier si une propriété a été modifiée
  const isPropertyModified = useCallback((key: string) => {
    return properties[key] !== defaultProperties[key];
  }, [properties, defaultProperties]);

  // Obtenir toutes les propriétés modifiées
  const modifiedProperties = useMemo(() => {
    const modified: BlockPropertyValues = {};
    Object.keys(properties).forEach(key => {
      if (isPropertyModified(key)) {
        modified[key] = properties[key];
      }
    });
    return modified;
  }, [properties, isPropertyModified]);

  // Statistiques pour le debug
  const stats = useMemo(() => ({
    totalProperties: Object.keys(defaultProperties).length,
    modifiedCount: Object.keys(modifiedProperties).length,
    isInitialized,
    elementId: element?.id,
    templateId: element?.templateId || element?.type
  }), [defaultProperties, modifiedProperties, isInitialized, element]);

  return {
    // État
    properties,
    defaultProperties,
    modifiedProperties,
    isInitialized,
    
    // Actions
    applyProperty,
    applyAllProperties,
    resetToDefaults,
    
    // Utilitaires
    getPropertyValue,
    isPropertyModified,
    
    // Debug
    stats
  };
}