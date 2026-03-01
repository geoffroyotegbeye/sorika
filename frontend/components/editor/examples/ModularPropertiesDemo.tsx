/**
 * Démonstration du système de propriétés modulaires
 * 
 * Ce composant montre que les propriétés sont correctement chargées
 * depuis les fichiers modulaires pour différents types de blocs.
 */

import React from 'react';
import { BlockPropertiesTest } from '../test/BlockPropertiesTest';

export const ModularPropertiesDemo: React.FC = () => {
  return (
    <div>
      <div style={{
        padding: '20px',
        backgroundColor: '#2563eb',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>
          🧩 Système de Propriétés Modulaires
        </h1>
        <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
          Test du système de propriétés des blocs avec architecture modulaire
        </p>
      </div>
      
      <BlockPropertiesTest />
    </div>
  );
};

export default ModularPropertiesDemo;