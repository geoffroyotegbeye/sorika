/**
 * Test Component - Vérification du système de propriétés modulaires
 * 
 * Ce composant teste que les propriétés sont correctement chargées
 * depuis les fichiers modulaires pour chaque type de bloc.
 */

import React, { useState } from 'react';
import { BlockPropertyPanel } from '../properties/BlockPropertyPanel';
import { getBlockDefinition, getAllTemplateIds, getAllCategories } from '../elements/block-property-registry';

export const BlockPropertiesTest: React.FC = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('hero-centered');
  const [properties, setProperties] = useState<Record<string, any>>({});

  // Obtenir tous les templates disponibles
  const allTemplateIds = getAllTemplateIds();
  const allCategories = getAllCategories();

  // Obtenir la définition du bloc sélectionné
  const blockDefinition = getBlockDefinition(selectedTemplateId);

  const handlePropertyChange = (propertyKey: string, value: any) => {
    console.log(`Propriété modifiée: ${propertyKey} = ${value}`);
    setProperties(prev => ({
      ...prev,
      [propertyKey]: value
    }));
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f9fafb'
    }}>
      {/* Sélecteur de blocs */}
      <div style={{ 
        width: '300px', 
        padding: '20px', 
        backgroundColor: 'white',
        borderRight: '1px solid #e5e7eb',
        overflow: 'auto'
      }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#111827' }}>
          Test des Propriétés Modulaires
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>
            Statistiques
          </h3>
          <p style={{ margin: '0', fontSize: '12px', color: '#9ca3af' }}>
            📦 {allTemplateIds.length} blocs disponibles<br/>
            📂 {allCategories.length} catégories<br/>
            ⚙️ {blockDefinition ? Object.keys(blockDefinition.properties).length : 0} propriétés
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '14px', 
            fontWeight: '500',
            color: '#374151'
          }}>
            Sélectionner un bloc :
          </label>
          <select
            value={selectedTemplateId}
            onChange={(e) => {
              setSelectedTemplateId(e.target.value);
              setProperties({}); // Reset properties
            }}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '13px'
            }}
          >
            {allCategories.map(category => (
              <optgroup key={category} label={category}>
                {allTemplateIds
                  .filter(id => {
                    const def = getBlockDefinition(id);
                    return def?.category === category;
                  })
                  .map(templateId => {
                    const def = getBlockDefinition(templateId);
                    return (
                      <option key={templateId} value={templateId}>
                        {def?.name || templateId}
                      </option>
                    );
                  })
                }
              </optgroup>
            ))}
          </select>
        </div>

        {/* Informations sur le bloc sélectionné */}
        {blockDefinition && (
          <div style={{
            padding: '12px',
            backgroundColor: '#f3f4f6',
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#111827' }}>
              {blockDefinition.name}
            </h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              <strong>Catégorie:</strong> {blockDefinition.category}<br/>
              <strong>ID:</strong> {blockDefinition.id}<br/>
              <strong>Propriétés:</strong> {Object.keys(blockDefinition.properties).length}
            </p>
          </div>
        )}

        {/* Groupes de propriétés */}
        {blockDefinition && (
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#374151' }}>
              Groupes de propriétés :
            </h4>
            {Object.entries(
              Object.values(blockDefinition.properties).reduce((groups, prop) => {
                const group = prop.group || 'general';
                groups[group] = (groups[group] || 0) + 1;
                return groups;
              }, {} as Record<string, number>)
            ).map(([group, count]) => (
              <div key={group} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '4px 8px',
                fontSize: '12px',
                color: '#6b7280'
              }}>
                <span>{group}</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Panneau de propriétés */}
      <div style={{ 
        width: '320px', 
        backgroundColor: 'white',
        borderRight: '1px solid #e5e7eb'
      }}>
        <BlockPropertyPanel
          templateId={selectedTemplateId}
          properties={properties}
          onPropertyChange={handlePropertyChange}
        />
      </div>

      {/* Zone de prévisualisation */}
      <div style={{ 
        flex: 1, 
        padding: '20px',
        overflow: 'auto'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#111827' }}>
            Prévisualisation
          </h2>
          
          <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#111827' }}>
              Bloc simulé : {blockDefinition?.name}
            </h3>
            <div 
              data-template-id={selectedTemplateId}
              style={{
                padding: '40px 20px',
                backgroundColor: properties.backgroundColor || '#f8fafc',
                color: properties.textColor || '#111827',
                textAlign: properties.textAlign || 'center',
                borderRadius: '8px',
                border: '2px dashed #d1d5db',
                minHeight: properties.minHeight ? `${properties.minHeight}px` : 'auto',
                fontSize: properties.titleSize ? `${properties.titleSize}px` : '16px'
              }}
            >
              <p style={{ margin: 0 }}>
                Ceci est une simulation du bloc <strong>{blockDefinition?.name}</strong>
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px', opacity: 0.7 }}>
                Les propriétés modifiées dans le panneau affectent ce bloc.
              </p>
            </div>
          </div>

          {/* Valeurs actuelles des propriétés */}
          <div style={{
            padding: '16px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#111827' }}>
              Valeurs actuelles des propriétés :
            </h4>
            <pre style={{
              margin: 0,
              padding: '12px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px',
              fontSize: '12px',
              overflow: 'auto',
              maxHeight: '200px'
            }}>
              {JSON.stringify(properties, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockPropertiesTest;