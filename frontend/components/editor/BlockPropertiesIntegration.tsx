/**
 * Composant d'intégration principal pour le système de propriétés des blocs
 * 
 * Ce composant fait le lien entre l'éditeur existant et le nouveau système
 * de propriétés des blocs inspiré d'Odoo.
 */

import React, { useEffect, useState } from 'react';
import { BlockPropertyPanel } from './properties/BlockPropertyPanel';
import { PropertyPanelSelector } from './properties/PropertyPanelSelector';
import { useBlockProperties } from './hooks/useBlockProperties';
import { SelectionContextAnalyzer } from './elements/selection-context';
import { BlockPropertyManager } from './elements/block-property-manager';
import { getTemplateInfo } from './elements/block-property-registry';
import './properties/block-properties.css';

interface BlockPropertiesIntegrationProps {
  /** L'élément actuellement sélectionné dans l'éditeur */
  selectedElement?: HTMLElement | null;
  /** Callback appelé quand une propriété est modifiée */
  onPropertyChange?: (elementId: string, property: string, value: any) => void;
  /** Callback appelé quand la sélection change */
  onSelectionChange?: (elementId: string | null) => void;
  /** Mode d'affichage du panneau */
  mode?: 'sidebar' | 'floating' | 'modal';
  /** Position du panneau flottant */
  position?: { x: number; y: number };
}

export const BlockPropertiesIntegration: React.FC<BlockPropertiesIntegrationProps> = ({
  selectedElement,
  onPropertyChange,
  onSelectionChange,
  mode = 'sidebar',
  position
}) => {
  const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(null);
  const [elementId, setElementId] = useState<string | null>(null);
  
  const {
    properties,
    updateProperty,
    resetProperties,
    isLoading,
    updateSelection: updateBlockSelection
  } = useBlockProperties({
    autoInitialize: true,
    onPropertyChange: (event) => {
      onPropertyChange?.(event.blockId, event.propertyKey, event.value);
    }
  });

  // Analyser l'élément sélectionné pour déterminer le template
  useEffect(() => {
    if (!selectedElement) {
      setCurrentTemplateId(null);
      setElementId(null);
      updateBlockSelection(null);
      onSelectionChange?.(null);
      return;
    }

    // Mettre à jour la sélection dans le hook
    updateBlockSelection(selectedElement);

    // Analyser le contexte de sélection
    const context = SelectionContextAnalyzer.analyze(selectedElement);
    
    if (context.templateId) {
      setCurrentTemplateId(context.templateId);
      setElementId(context.elementId);
      onSelectionChange?.(context.elementId);
    } else {
      setCurrentTemplateId(null);
      setElementId(null);
      onSelectionChange?.(null);
    }
  }, [selectedElement, onSelectionChange, updateBlockSelection]);

  // Gérer les changements de propriétés
  const handlePropertyChange = (property: string, value: any) => {
    if (!currentTemplateId || !elementId || !selectedElement) return;

    // Mettre à jour la propriété dans le hook
    updateProperty(property, value);

    // Appliquer la propriété à l'élément DOM
    BlockPropertyManager.applyProperty(selectedElement, currentTemplateId, property, value);

    // Notifier le parent
    onPropertyChange?.(elementId, property, value);
  };

  // Gérer la réinitialisation des propriétés
  const handleResetProperties = () => {
    if (!currentTemplateId || !selectedElement) return;

    resetProperties();
    
    // Réinitialiser les styles de l'élément
    BlockPropertyManager.resetElement(selectedElement);
  };

  // Si aucun élément n'est sélectionné
  if (!selectedElement || !currentTemplateId) {
    return (
      <div className="block-properties-integration">
        <PropertyPanelSelector 
          onTemplateSelect={() => {}} 
          selectedTemplate={null}
        />
        <div className="no-selection-message">
          <div className="no-selection-icon">🎯</div>
          <h3>Aucun bloc sélectionné</h3>
          <p>Cliquez sur un bloc dans l'éditeur pour voir ses propriétés.</p>
        </div>
      </div>
    );
  }

  // Obtenir les informations du template
  const templateInfo = getTemplateInfo(currentTemplateId);

  return (
    <div className={`block-properties-integration block-properties-integration--${mode}`}>
      {/* En-tête avec informations du bloc */}
      <div className="block-properties-header">
        <div className="block-info">
          <div className="block-icon">
            {templateInfo?.icon || '📦'}
          </div>
          <div className="block-details">
            <h3 className="block-title">
              {templateInfo?.label || currentTemplateId}
            </h3>
            <span className="block-category">
              {templateInfo?.category || 'Bloc'}
            </span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="block-actions">
          <button 
            className="reset-button"
            onClick={handleResetProperties}
            title="Réinitialiser les propriétés"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Panneau de propriétés */}
      <div className="block-properties-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Chargement des propriétés...</p>
          </div>
        ) : (
          <BlockPropertyPanel
            templateId={currentTemplateId}
            properties={properties}
            onPropertyChange={handlePropertyChange}
          />
        )}
      </div>

      {/* Informations de debug (en mode développement) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <details>
            <summary>Debug Info</summary>
            <pre>
              {JSON.stringify({
                templateId: currentTemplateId,
                elementId,
                propertiesCount: Object.keys(properties).length,
                hasDefinition: !!getTemplateInfo(currentTemplateId)
              }, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default BlockPropertiesIntegration;