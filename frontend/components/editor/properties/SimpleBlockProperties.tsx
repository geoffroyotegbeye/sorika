/**
 * Composant simple pour afficher les propriétés d'un bloc
 * Version simplifiée pour intégration directe dans PropertiesPanel
 */

import React from 'react';
import { BlockPropertyPanel } from './BlockPropertyPanel';
import { getBlockDefinition } from '../elements/block-property-registry';
import { getTemplateIdForElement, getTemplateDetectionInfo } from '../utils/element-template-mapping';
import { useBlockStyleSync } from '../hooks/useBlockStyleSync';
import './block-properties.css';

interface SimpleBlockPropertiesProps {
  element: any;
  companyId?: string | null;
  onPropertyChange?: (key: string, value: any) => void;
}

export const SimpleBlockProperties: React.FC<SimpleBlockPropertiesProps> = ({
  element,
  companyId,
  onPropertyChange = () => {}
}) => {
  // Déterminer le templateId à partir de l'élément
  const templateId = getTemplateIdForElement(element);
  
  // Récupérer la définition du bloc
  const blockDefinition = getBlockDefinition(templateId);
  
  // Utiliser le hook de synchronisation des styles
  const {
    properties,
    applyProperty,
    isInitialized,
    stats
  } = useBlockStyleSync(element, {
    autoSync: true,
    onPropertyChange: (key, value) => {
      console.log('Property applied:', key, '=', value);
      onPropertyChange(key, value);
    }
  });
  
  if (!blockDefinition) {
    return (
      <div className="empty-properties-panel">
        <h3>Propriétés génériques</h3>
        <p>
          Type: <strong>{element.type}</strong><br/>
          Template: <strong>{templateId}</strong><br/>
          <small>Aucune propriété spécifique définie pour ce type de bloc.</small>
        </p>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Chargement des propriétés...</p>
      </div>
    );
  }

  return (
    <div className="block-properties-integration">
      {/* Contenu des propriétés avec synchronisation */}
      <BlockPropertyPanel
        templateId={templateId}
        properties={properties}
        companyId={companyId}
        onPropertyChange={applyProperty}
        className="block-property-panel"
      />

      {/* Debug info en développement */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <details>
            <summary>Debug Info & Stats</summary>
            <pre>{JSON.stringify({
              elementType: element.type,
              elementTag: element.tag,
              templateId,
              hasDefinition: !!blockDefinition,
              propertiesCount: blockDefinition?.properties ? Object.keys(blockDefinition.properties).length : 0,
              detection: getTemplateDetectionInfo(element),
              syncStats: stats
            }, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default SimpleBlockProperties;