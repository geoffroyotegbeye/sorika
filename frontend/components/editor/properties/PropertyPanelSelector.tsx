/**
 * Property Panel Selector - Manages switching between element and block property panels
 * 
 * This component provides a tabbed interface to switch between:
 * - Element properties (existing system)
 * - Block properties (new system)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { SelectionContext, getAvailablePanels, getContextDescription } from '../elements/selection-context';
import { BlockPropertyPanel } from './BlockPropertyPanel';

// ─────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────

interface PropertyPanelSelectorProps {
  selectionContext: SelectionContext;
  // Existing element properties component (to be passed from parent)
  ElementPropertiesComponent?: React.ComponentType<{ element: HTMLElement }>;
  onPanelChange?: (panelType: 'element' | 'block') => void;
  className?: string;
}

type PanelType = 'element' | 'block';

// ─────────────────────────────────────────────
// PANEL TAB COMPONENT
// ─────────────────────────────────────────────

interface PanelTabProps {
  type: PanelType;
  label: string;
  isActive: boolean;
  isAvailable: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

const PanelTab: React.FC<PanelTabProps> = ({
  type,
  label,
  isActive,
  isAvailable,
  onClick,
  icon
}) => {
  return (
    <button
      className={`panel-tab ${isActive ? 'active' : ''} ${!isAvailable ? 'disabled' : ''}`}
      onClick={isAvailable ? onClick : undefined}
      disabled={!isAvailable}
      title={!isAvailable ? 'Aucune propriété disponible' : undefined}
    >
      {icon && <span className="tab-icon">{icon}</span>}
      <span className="tab-label">{label}</span>
    </button>
  );
};

// ─────────────────────────────────────────────
// EMPTY STATE COMPONENT
// ─────────────────────────────────────────────

const EmptyPropertiesPanel: React.FC<{ type: PanelType }> = ({ type }) => {
  return (
    <div className="empty-properties-panel">
      <div className="empty-icon">
        {type === 'element' ? '🎨' : '🧩'}
      </div>
      <h3>Aucune propriété disponible</h3>
      <p>
        {type === 'element' 
          ? 'Cet élément ne possède pas de propriétés modifiables.'
          : 'Ce bloc ne possède pas d\'options configurables.'
        }
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export const PropertyPanelSelector: React.FC<PropertyPanelSelectorProps> = ({
  selectionContext,
  ElementPropertiesComponent,
  onPanelChange,
  className = ''
}) => {
  const [activePanel, setActivePanel] = useState<PanelType>('element');
  
  // Get available panels
  const availablePanels = getAvailablePanels(selectionContext);
  const contextDescription = getContextDescription(selectionContext);
  
  // Update active panel based on context and availability
  useEffect(() => {
    // If current panel is not available, switch to recommended or first available
    if (!availablePanels.includes(activePanel)) {
      if (availablePanels.includes(selectionContext.recommendedPanel)) {
        setActivePanel(selectionContext.recommendedPanel);
      } else if (availablePanels.length > 0) {
        setActivePanel(availablePanels[0]);
      }
    }
  }, [selectionContext, availablePanels, activePanel]);
  
  // Handle panel change
  const handlePanelChange = (panelType: PanelType) => {
    if (availablePanels.includes(panelType)) {
      setActivePanel(panelType);
      onPanelChange?.(panelType);
    }
  };
  
  // If no panels are available, show empty state
  if (availablePanels.length === 0) {
    return (
      <div className={`property-panel-selector ${className}`}>
        <div className="panel-header">
          <h2>Propriétés</h2>
          <p className="selection-context">{contextDescription}</p>
        </div>
        <EmptyPropertiesPanel type="element" />
      </div>
    );
  }
  
  // If only one panel is available, don't show tabs
  if (availablePanels.length === 1) {
    const singlePanelType = availablePanels[0];
    
    return (
      <div className={`property-panel-selector single-panel ${className}`}>
        <div className="panel-header">
          <h2>
            {singlePanelType === 'element' ? 'Propriétés de l\'élément' : 'Options du bloc'}
          </h2>
          <p className="selection-context">{contextDescription}</p>
        </div>
        
        <div className="panel-content">
          {singlePanelType === 'element' ? (
            selectionContext.hasElementProperties && ElementPropertiesComponent ? (
              <ElementPropertiesComponent element={selectionContext.primary.element} />
            ) : (
              <EmptyPropertiesPanel type="element" />
            )
          ) : (
            selectionContext.block ? (
              <BlockPropertyPanel 
                blockContext={selectionContext.block}
                onPropertyChange={(key, value) => {
                  console.log(`Block property changed: ${key} = ${value}`);
                }}
              />
            ) : (
              <EmptyPropertiesPanel type="block" />
            )
          )}
        </div>
      </div>
    );
  }
  
  // Multiple panels available - show tabbed interface
  return (
    <div className={`property-panel-selector multi-panel ${className}`}>
      <div className="panel-header">
        <h2>Propriétés</h2>
        <p className="selection-context">{contextDescription}</p>
      </div>
      
      {/* Panel Tabs */}
      <div className="panel-tabs">
        <PanelTab
          type="element"
          label="Élément"
          isActive={activePanel === 'element'}
          isAvailable={availablePanels.includes('element')}
          onClick={() => handlePanelChange('element')}
          icon="🎨"
        />
        <PanelTab
          type="block"
          label="Bloc"
          isActive={activePanel === 'block'}
          isAvailable={availablePanels.includes('block')}
          onClick={() => handlePanelChange('block')}
          icon="🧩"
        />
      </div>
      
      {/* Panel Content */}
      <div className="panel-content">
        {activePanel === 'element' ? (
          selectionContext.hasElementProperties && ElementPropertiesComponent ? (
            <ElementPropertiesComponent element={selectionContext.primary.element} />
          ) : (
            <EmptyPropertiesPanel type="element" />
          )
        ) : (
          selectionContext.block ? (
            <BlockPropertyPanel 
              blockContext={selectionContext.block}
              onPropertyChange={(key, value) => {
                console.log(`Block property changed: ${key} = ${value}`);
              }}
            />
          ) : (
            <EmptyPropertiesPanel type="block" />
          )
        )}
      </div>
      
      {/* Panel Info */}
      {availablePanels.length > 1 && (
        <div className="panel-info">
          <small>
            {activePanel === 'element' 
              ? 'Modifiez les propriétés CSS de l\'élément sélectionné'
              : 'Configurez les options spécifiques à ce type de bloc'
            }
          </small>
        </div>
      )}
    </div>
  );
};

export default PropertyPanelSelector;