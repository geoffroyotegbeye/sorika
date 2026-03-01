/**
 * Block Properties Example - Demonstrates how to integrate the block properties system
 * 
 * This example shows how to use the block properties system in a real editor component.
 * It can be used as a reference for integrating with your existing editor.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { PropertyPanelSelector } from '../properties/PropertyPanelSelector';
import { useBlockProperties } from '../hooks/useBlockProperties';
import { SelectionContext } from '../elements/selection-context';
import { BlockPropertyChangeEvent } from '../elements/block-property-manager';

// Import the CSS
import '../properties/block-properties.css';

// ─────────────────────────────────────────────
// MOCK ELEMENT PROPERTIES COMPONENT
// ─────────────────────────────────────────────

// This would be your existing element properties component
const MockElementPropertiesComponent: React.FC<{ element: HTMLElement }> = ({ element }) => {
  const [elementType, setElementType] = useState('');
  
  useEffect(() => {
    setElementType(element.tagName.toLowerCase());
  }, [element]);
  
  return (
    <div className="element-properties-mock">
      <h4>Propriétés de l'élément</h4>
      <div className="property-item">
        <label className="property-label">Type d'élément</label>
        <input 
          type="text" 
          value={elementType} 
          readOnly 
          className="text-input"
        />
      </div>
      <div className="property-item">
        <label className="property-label">Couleur de fond</label>
        <input 
          type="color" 
          defaultValue="#ffffff"
          className="color-input"
        />
      </div>
      <div className="property-item">
        <label className="property-label">Taille de police</label>
        <input 
          type="range" 
          min="12" 
          max="24" 
          defaultValue="16"
          className="range-input"
        />
      </div>
      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '16px' }}>
        Ceci est un exemple de composant de propriétés d'élément. 
        Remplacez-le par votre composant existant.
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────
// MOCK EDITOR CANVAS
// ─────────────────────────────────────────────

const MockEditorCanvas: React.FC<{ 
  onElementSelect: (element: HTMLElement | null) => void;
  selectedElement: HTMLElement | null;
}> = ({ onElementSelect, selectedElement }) => {
  
  const handleElementClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const target = event.currentTarget;
    onElementSelect(target);
  };
  
  const handleCanvasClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onElementSelect(null);
    }
  };
  
  return (
    <div 
      className="mock-editor-canvas"
      onClick={handleCanvasClick}
      style={{
        flex: 1,
        padding: '20px',
        backgroundColor: '#f8fafc',
        border: '2px dashed #e2e8f0',
        borderRadius: '8px',
        minHeight: '600px',
        position: 'relative'
      }}
    >
      <h3 style={{ margin: '0 0 20px 0', color: '#64748b' }}>
        Cliquez sur les éléments pour voir leurs propriétés
      </h3>
      
      {/* Header Block Example */}
      <header 
        data-template-id="header-nav-light"
        onClick={handleElementClick}
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px 24px',
          marginBottom: '20px',
          borderRadius: '8px',
          cursor: 'pointer',
          border: selectedElement?.getAttribute('data-template-id') === 'header-nav-light' 
            ? '2px solid #2563eb' : '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span 
          onClick={handleElementClick}
          style={{ 
            fontSize: '22px', 
            fontWeight: '800', 
            color: '#2563eb',
            cursor: 'pointer',
            border: selectedElement?.tagName === 'SPAN' && 
                   selectedElement?.parentElement?.getAttribute('data-template-id') === 'header-nav-light'
              ? '2px solid #f59e0b' : 'none',
            padding: '2px 4px',
            borderRadius: '4px'
          }}
        >
          Votre Marque
        </span>
        
        <nav style={{ display: 'flex', gap: '16px' }}>
          <a href="#" onClick={handleElementClick} style={{ 
            textDecoration: 'none', 
            color: '#475569',
            cursor: 'pointer',
            border: selectedElement?.tagName === 'A' ? '2px solid #f59e0b' : 'none',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            Accueil
          </a>
          <a href="#" onClick={handleElementClick} style={{ 
            textDecoration: 'none', 
            color: '#475569',
            cursor: 'pointer',
            border: selectedElement?.tagName === 'A' ? '2px solid #f59e0b' : 'none',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            Services
          </a>
        </nav>
        
        <button 
          onClick={handleElementClick}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            border: selectedElement?.tagName === 'BUTTON' ? '2px solid #f59e0b' : 'none'
          }}
        >
          Contact
        </button>
      </header>
      
      {/* Hero Block Example */}
      <section 
        data-template-id="hero-centered"
        onClick={handleElementClick}
        style={{
          backgroundColor: '#f8fafc',
          padding: '60px 24px',
          textAlign: 'center',
          borderRadius: '8px',
          marginBottom: '20px',
          cursor: 'pointer',
          border: selectedElement?.getAttribute('data-template-id') === 'hero-centered' 
            ? '2px solid #2563eb' : '1px solid #e2e8f0',
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <h1 
          onClick={handleElementClick}
          style={{ 
            fontSize: '48px', 
            fontWeight: '700', 
            marginBottom: '16px',
            cursor: 'pointer',
            border: selectedElement?.tagName === 'H1' ? '2px solid #f59e0b' : 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block'
          }}
        >
          Titre Principal
        </h1>
        <p 
          onClick={handleElementClick}
          style={{ 
            fontSize: '18px', 
            color: '#64748b', 
            marginBottom: '24px',
            cursor: 'pointer',
            border: selectedElement?.tagName === 'P' ? '2px solid #f59e0b' : 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block'
          }}
        >
          Description de votre service ou produit
        </p>
        <button 
          onClick={handleElementClick}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            border: selectedElement?.tagName === 'BUTTON' && 
                   selectedElement?.parentElement?.getAttribute('data-template-id') === 'hero-centered'
              ? '2px solid #f59e0b' : 'none'
          }}
        >
          Commencer
        </button>
      </section>
      
      {/* Pricing Block Example */}
      <section 
        data-template-id="pricing-table"
        onClick={handleElementClick}
        style={{
          backgroundColor: '#ffffff',
          padding: '40px 24px',
          borderRadius: '8px',
          cursor: 'pointer',
          border: selectedElement?.getAttribute('data-template-id') === 'pricing-table' 
            ? '2px solid #2563eb' : '1px solid #e2e8f0'
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>Nos Tarifs</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[1, 2, 3].map(i => (
            <div 
              key={i}
              onClick={handleElementClick}
              style={{
                padding: '24px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <h3>Plan {i}</h3>
              <div style={{ fontSize: '32px', fontWeight: '700', margin: '16px 0' }}>
                {i * 10}€
              </div>
              <button style={{
                width: '100%',
                padding: '8px 16px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px'
              }}>
                Choisir
              </button>
            </div>
          ))}
        </div>
      </section>
      
      <div style={{ 
        position: 'absolute', 
        bottom: '10px', 
        right: '10px', 
        fontSize: '12px', 
        color: '#9ca3af' 
      }}>
        💡 Bordure bleue = bloc sélectionné | Bordure orange = élément sélectionné
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN EXAMPLE COMPONENT
// ─────────────────────────────────────────────

export const BlockPropertiesExample: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  
  // Use the block properties hook
  const {
    selectionContext,
    hasBlockProperties,
    hasElementProperties,
    updateSelection,
    clearSelection
  } = useBlockProperties({
    autoInitialize: true,
    debounceDelay: 100,
    onSelectionChange: (context) => {
      console.log('Selection changed:', context);
    },
    onPropertyChange: (event) => {
      console.log('Property changed:', event);
    }
  });
  
  // Handle element selection
  const handleElementSelect = (element: HTMLElement | null) => {
    setSelectedElement(element);
    updateSelection(element);
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      {/* Editor Canvas */}
      <MockEditorCanvas 
        onElementSelect={handleElementSelect}
        selectedElement={selectedElement}
      />
      
      {/* Properties Panel */}
      <div style={{ 
        width: '320px', 
        borderLeft: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {selectionContext ? (
          <PropertyPanelSelector
            selectionContext={selectionContext}
            ElementPropertiesComponent={MockElementPropertiesComponent}
            onPanelChange={(panelType) => {
              console.log('Panel changed to:', panelType);
            }}
          />
        ) : (
          <div style={{ 
            padding: '40px 20px', 
            textAlign: 'center', 
            color: '#6b7280' 
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
              Aucune sélection
            </h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Cliquez sur un élément ou un bloc pour voir ses propriétés
            </p>
          </div>
        )}
      </div>
      
      {/* Debug Info */}
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 1000
      }}>
        <div>Sélection: {selectionContext?.primary.type || 'aucune'}</div>
        <div>Bloc: {hasBlockProperties ? '✅' : '❌'}</div>
        <div>Élément: {hasElementProperties ? '✅' : '❌'}</div>
        {selectionContext?.block && (
          <div>Template: {selectionContext.block.templateId}</div>
        )}
      </div>
    </div>
  );
};

export default BlockPropertiesExample;