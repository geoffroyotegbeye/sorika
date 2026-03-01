/**
 * Test simple du système de propriétés avec synchronisation
 */

import React, { useState } from 'react';
import { SimpleBlockProperties } from '../properties/SimpleBlockProperties';

// Éléments de test simples
const mockElements = [
  {
    id: 'header-1',
    type: 'header',
    tag: 'header',
    content: 'Header Test',
    attributes: { class: 'header' },
    styles: {
      desktop: { backgroundColor: '#ffffff', height: '68px', padding: '0 20px' }
    },
    children: []
  },
  {
    id: 'hero-1', 
    type: 'section',
    tag: 'section',
    content: 'Hero Section',
    attributes: { class: 'hero' },
    styles: {
      desktop: { minHeight: '400px', backgroundColor: '#f8fafc', padding: '60px 20px' }
    },
    children: []
  },
  {
    id: 'pricing-1',
    type: 'section',
    tag: 'section', 
    content: 'Pricing',
    attributes: { class: 'pricing' },
    styles: {
      desktop: { padding: '40px 20px', backgroundColor: '#ffffff' }
    },
    children: []
  }
];

export const PropertiesPanelTest: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState(mockElements[0]);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui' }}>
      {/* Liste des éléments */}
      <div style={{ width: '250px', borderRight: '1px solid #e2e8f0', padding: '16px', backgroundColor: '#f8fafc' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
          Test Propriétés
        </h3>
        
        {mockElements.map(element => (
          <div
            key={element.id}
            onClick={() => setSelectedElement(element)}
            style={{
              padding: '12px',
              marginBottom: '8px',
              backgroundColor: selectedElement.id === element.id ? '#dbeafe' : '#ffffff',
              border: selectedElement.id === element.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
              {element.type}
            </div>
            <div style={{ color: '#64748b', fontSize: '11px' }}>
              {element.content}
            </div>
          </div>
        ))}
      </div>

      {/* Panel de propriétés */}
      <div style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
            Propriétés Synchronisées
          </h3>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
            {selectedElement.type} ({selectedElement.id})
          </p>
        </div>
        
        <SimpleBlockProperties
          key={selectedElement.id}
          element={selectedElement}
          onPropertyChange={(key, value) => {
            console.log('Property changed:', key, '=', value);
          }}
        />
      </div>
    </div>
  );
};

export default PropertiesPanelTest;