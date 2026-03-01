/**
 * Exemple d'intégration du système de propriétés des blocs dans l'éditeur
 * 
 * Ce composant montre comment intégrer le système de propriétés avec
 * l'éditeur existant pour créer une expérience similaire à Odoo.
 */

import React, { useState, useRef, useCallback } from 'react';
import BlockPropertiesIntegration from './BlockPropertiesIntegration';
import { BlockPropertyRegistry } from './elements/block-property-registry';

// Simuler l'éditeur existant
interface EditorElement {
  id: string;
  type: string;
  templateId?: string;
  content: string;
  styles: Record<string, any>;
}

interface EditorWithBlockPropertiesProps {
  /** Mode d'affichage du panneau de propriétés */
  propertiesPanelMode?: 'sidebar' | 'floating' | 'modal';
  /** Éléments initiaux de l'éditeur */
  initialElements?: EditorElement[];
}

export const EditorWithBlockProperties: React.FC<EditorWithBlockPropertiesProps> = ({
  propertiesPanelMode = 'sidebar',
  initialElements = []
}) => {
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [elements, setElements] = useState<EditorElement[]>(initialElements);
  const editorRef = useRef<HTMLDivElement>(null);

  // Gérer la sélection d'un élément
  const handleElementClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const target = event.currentTarget;
    const elementId = target.getAttribute('data-element-id');
    
    // Retirer la sélection précédente
    if (selectedElement) {
      selectedElement.classList.remove('selected-element');
    }
    
    // Ajouter la sélection à l'élément cliqué
    target.classList.add('selected-element');
    setSelectedElement(target);
    setSelectedElementId(elementId);
  }, [selectedElement]);

  // Gérer les changements de propriétés
  const handlePropertyChange = useCallback((elementId: string, property: string, value: any) => {
    console.log('Property changed:', { elementId, property, value });
    
    // Mettre à jour l'état des éléments
    setElements(prev => prev.map(el => 
      el.id === elementId 
        ? { ...el, styles: { ...el.styles, [property]: value } }
        : el
    ));
  }, []);

  // Gérer les changements de sélection
  const handleSelectionChange = useCallback((elementId: string | null) => {
    setSelectedElementId(elementId);
  }, []);

  // Rendu d'un élément de l'éditeur
  const renderElement = (element: EditorElement) => {
    const templateInfo = element.templateId 
      ? BlockPropertyRegistry.getTemplateInfo(element.templateId)
      : null;

    return (
      <div
        key={element.id}
        data-element-id={element.id}
        data-template-id={element.templateId}
        className="editor-element"
        onClick={handleElementClick}
        style={{
          ...element.styles,
          cursor: 'pointer',
          position: 'relative',
          minHeight: '60px',
          padding: '16px',
          margin: '8px 0',
          border: '2px dashed #e2e8f0',
          borderRadius: '8px',
          transition: 'all 0.2s ease'
        }}
      >
        {/* Indicateur de template */}
        {templateInfo && (
          <div className="template-indicator" style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            background: '#2563eb',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '600'
          }}>
            {templateInfo.category}
          </div>
        )}
        
        {/* Contenu de l'élément */}
        <div className="element-content">
          <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>
            {element.type} {element.templateId ? `(${element.templateId})` : ''}
          </h4>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
            {element.content}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="editor-with-block-properties" style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Zone d'édition principale */}
      <div 
        ref={editorRef}
        className="editor-canvas"
        style={{
          flex: propertiesPanelMode === 'sidebar' ? '1' : '1',
          padding: '20px',
          backgroundColor: '#f9fafb',
          overflow: 'auto'
        }}
      >
        <div className="editor-header" style={{
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 8px 0', color: '#111827' }}>
            Éditeur avec Propriétés de Blocs
          </h2>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Cliquez sur un bloc pour voir ses propriétés dans le panneau de droite.
          </p>
        </div>

        {/* Éléments de l'éditeur */}
        <div className="editor-elements">
          {elements.length > 0 ? (
            elements.map(renderElement)
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6b7280'
            }}>
              <p>Aucun élément dans l'éditeur.</p>
              <p>Ajoutez des blocs pour tester le système de propriétés.</p>
            </div>
          )}
        </div>

        {/* Zone de drop pour nouveaux éléments */}
        <div 
          className="drop-zone"
          style={{
            padding: '40px',
            border: '2px dashed #d1d5db',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#6b7280',
            marginTop: '20px'
          }}
        >
          <p>Glissez-déposez des blocs ici</p>
          <p style={{ fontSize: '12px', margin: '8px 0 0 0' }}>
            (Fonctionnalité à implémenter)
          </p>
        </div>
      </div>

      {/* Panneau de propriétés */}
      {propertiesPanelMode === 'sidebar' && (
        <div 
          className="properties-sidebar"
          style={{
            width: '320px',
            backgroundColor: 'white',
            borderLeft: '1px solid #e5e7eb',
            overflow: 'auto'
          }}
        >
          <BlockPropertiesIntegration
            selectedElement={selectedElement}
            onPropertyChange={handlePropertyChange}
            onSelectionChange={handleSelectionChange}
            mode="sidebar"
          />
        </div>
      )}
    </div>
  );
};

// Composant de démonstration avec des éléments pré-remplis
export const EditorDemo: React.FC = () => {
  const demoElements: EditorElement[] = [
    {
      id: 'hero-1',
      type: 'Hero Section',
      templateId: 'hero-centered',
      content: 'Section héro centrée avec titre et boutons',
      styles: {
        backgroundColor: '#f3f4f6',
        padding: '60px 20px',
        textAlign: 'center'
      }
    },
    {
      id: 'features-1',
      type: 'Features Section',
      templateId: 'features-3-cols',
      content: 'Section fonctionnalités avec 3 colonnes',
      styles: {
        backgroundColor: 'white',
        padding: '80px 20px'
      }
    },
    {
      id: 'cta-1',
      type: 'Call to Action',
      templateId: 'cta-centered',
      content: 'Appel à l\'action centré avec boutons',
      styles: {
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        padding: '60px 20px',
        textAlign: 'center',
        color: 'white'
      }
    },
    {
      id: 'footer-1',
      type: 'Footer',
      templateId: 'footer-minimal',
      content: 'Footer minimal avec liens',
      styles: {
        backgroundColor: '#f8fafc',
        padding: '40px 20px',
        borderTop: '1px solid #e2e8f0'
      }
    }
  ];

  return (
    <EditorWithBlockProperties 
      initialElements={demoElements}
      propertiesPanelMode="sidebar"
    />
  );
};

export default EditorWithBlockProperties;