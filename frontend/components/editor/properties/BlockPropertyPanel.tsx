/**
 * Block Property Panel - UI component for displaying and editing block properties
 * 
 * This component renders a contextual property panel based on the selected block type,
 * similar to Odoo's snippet options panel.
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BlockProperty, 
  BlockPropertyValues, 
  ColorProperty, 
  SelectProperty, 
  RangeProperty, 
  BooleanProperty, 
  TextProperty, 
  NumberProperty 
} from '../elements/block-properties';
import { getBlockDefinition } from '../elements/block-property-registry';

// ─────────────────────────────────────────────
// PROPERTY COMPONENT INTERFACES
// ─────────────────────────────────────────────

interface PropertyComponentProps {
  property: BlockProperty;
  propertyKey: string;
  value: any;
  onChange: (value: any) => void;
}

// ─────────────────────────────────────────────
// INDIVIDUAL PROPERTY COMPONENTS
// ─────────────────────────────────────────────

const ColorPropertyComponent: React.FC<PropertyComponentProps & { property: ColorProperty }> = ({
  property,
  propertyKey,
  value,
  onChange
}) => {
  return (
    <div className="property-item">
      <label className="property-label">
        {property.label}
        {property.description && (
          <span className="property-description">{property.description}</span>
        )}
      </label>
      
      <div className="color-property">
        <input
          type="color"
          value={value || property.default}
          onChange={(e) => onChange(e.target.value)}
          className="color-input"
        />
        
        {property.palette && (
          <div className="color-palette">
            {property.palette.map((color) => (
              <button
                key={color}
                className={`color-swatch ${value === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => onChange(color)}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SelectPropertyComponent: React.FC<PropertyComponentProps & { property: SelectProperty }> = ({
  property,
  propertyKey,
  value,
  onChange
}) => {
  return (
    <div className="property-item">
      <label className="property-label">
        {property.label}
        {property.description && (
          <span className="property-description">{property.description}</span>
        )}
      </label>
      
      <select
        value={value || property.default}
        onChange={(e) => {
          const selectedOption = property.options.find(opt => opt.value.toString() === e.target.value);
          onChange(selectedOption?.value);
        }}
        className="select-input"
      >
        {property.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const RangePropertyComponent: React.FC<PropertyComponentProps & { property: RangeProperty }> = ({
  property,
  propertyKey,
  value,
  onChange
}) => {
  const currentValue = value !== undefined ? value : property.default;
  
  return (
    <div className="property-item">
      <label className="property-label">
        {property.label}
        {property.description && (
          <span className="property-description">{property.description}</span>
        )}
      </label>
      
      <div className="range-property">
        <input
          type="range"
          min={property.min}
          max={property.max}
          step={property.step || 1}
          value={currentValue}
          onChange={(e) => onChange(Number(e.target.value))}
          className="range-input"
        />
        <span className="range-value">
          {currentValue}{property.unit || ''}
        </span>
      </div>
    </div>
  );
};

const BooleanPropertyComponent: React.FC<PropertyComponentProps & { property: BooleanProperty }> = ({
  property,
  propertyKey,
  value,
  onChange
}) => {
  const currentValue = value !== undefined ? value : property.default;
  
  return (
    <div className="property-item">
      <label className="property-label checkbox-label">
        <input
          type="checkbox"
          checked={currentValue}
          onChange={(e) => onChange(e.target.checked)}
          className="checkbox-input"
        />
        <span className="checkbox-custom"></span>
        {property.label}
        {property.description && (
          <span className="property-description">{property.description}</span>
        )}
      </label>
    </div>
  );
};

const TextPropertyComponent: React.FC<PropertyComponentProps & { property: TextProperty }> = ({
  property,
  propertyKey,
  value,
  onChange
}) => {
  return (
    <div className="property-item">
      <label className="property-label">
        {property.label}
        {property.description && (
          <span className="property-description">{property.description}</span>
        )}
      </label>
      
      <input
        type="text"
        value={value || property.default}
        onChange={(e) => onChange(e.target.value)}
        placeholder={property.placeholder}
        maxLength={property.maxLength}
        className="text-input"
      />
    </div>
  );
};

const NumberPropertyComponent: React.FC<PropertyComponentProps & { property: NumberProperty }> = ({
  property,
  propertyKey,
  value,
  onChange
}) => {
  return (
    <div className="property-item">
      <label className="property-label">
        {property.label}
        {property.description && (
          <span className="property-description">{property.description}</span>
        )}
      </label>
      
      <div className="number-property">
        <input
          type="number"
          min={property.min}
          max={property.max}
          step={property.step || 1}
          value={value !== undefined ? value : property.default}
          onChange={(e) => onChange(Number(e.target.value))}
          className="number-input"
        />
        {property.unit && <span className="number-unit">{property.unit}</span>}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PROPERTY COMPONENT FACTORY
// ─────────────────────────────────────────────

const PropertyComponent: React.FC<PropertyComponentProps> = (props) => {
  switch (props.property.type) {
    case 'color':
      return <ColorPropertyComponent {...props} property={props.property as ColorProperty} />;
    case 'select':
      return <SelectPropertyComponent {...props} property={props.property as SelectProperty} />;
    case 'range':
      return <RangePropertyComponent {...props} property={props.property as RangeProperty} />;
    case 'boolean':
      return <BooleanPropertyComponent {...props} property={props.property as BooleanProperty} />;
    case 'text':
      return <TextPropertyComponent {...props} property={props.property as TextProperty} />;
    case 'number':
      return <NumberPropertyComponent {...props} property={props.property as NumberProperty} />;
    default:
      return (
        <div className="property-item">
          <span className="property-error">
            Type de propriété non supporté: {props.property.type}
          </span>
        </div>
      );
  }
};

// ─────────────────────────────────────────────
// MAIN BLOCK PROPERTY PANEL COMPONENT
// ─────────────────────────────────────────────

interface BlockPropertyPanelProps {
  /** ID du template du bloc sélectionné */
  templateId: string;
  /** Valeurs actuelles des propriétés */
  properties: BlockPropertyValues;
  /** ID de la company pour les uploads */
  companyId?: string | null;
  /** Callback appelé quand une propriété change */
  onPropertyChange?: (propertyKey: string, value: any) => void;
  /** Classes CSS additionnelles */
  className?: string;
}

export const BlockPropertyPanel: React.FC<BlockPropertyPanelProps> = ({
  templateId,
  properties,
  companyId,
  onPropertyChange,
  className = ''
}) => {
  // Get block definition and properties from the modular registry
  const blockDefinition = useMemo(() => {
    return getBlockDefinition(templateId);
  }, [templateId]);
  
  // Group properties by group
  const propertyGroups = useMemo(() => {
    if (!blockDefinition) return {};
    
    const groups: Record<string, Array<[string, BlockProperty]>> = {};
    
    Object.entries(blockDefinition.properties).forEach(([key, property]) => {
      const group = property.group || 'general';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push([key, property]);
    });
    
    return groups;
  }, [blockDefinition]);
  
  // Handle property change
  const handlePropertyChange = (propertyKey: string, value: any) => {
    onPropertyChange?.(propertyKey, value);
  };
  
  if (!blockDefinition) {
    return (
      <div className={`block-property-panel ${className}`}>
        <div className="panel-content">
          <p className="no-properties">
            Aucune propriété disponible pour ce bloc (ID: {templateId}).
          </p>
          <p className="no-properties">
            Vérifiez que le bloc est enregistré dans le registre.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`block-property-panel ${className}`}>
      <div className="panel-content">
        {Object.entries(propertyGroups).map(([groupName, groupProperties]) => (
          <div key={groupName} className="property-group">
            {groupName !== 'general' && (
              <h4 className="group-title">
                {getGroupLabel(groupName)}
              </h4>
            )}
            
            {groupProperties.map(([propertyKey, property]) => (
              <PropertyComponent
                key={propertyKey}
                property={property}
                propertyKey={propertyKey}
                value={properties[propertyKey]}
                onChange={(value) => handlePropertyChange(propertyKey, value)}
              />
            ))}
          </div>
        ))}
      </div>
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <details>
            <summary>Debug - Propriétés du bloc</summary>
            <pre>
              {JSON.stringify({
                templateId,
                blockName: blockDefinition.name,
                category: blockDefinition.category,
                propertiesCount: Object.keys(blockDefinition.properties).length,
                groups: Object.keys(propertyGroups),
                currentValues: properties
              }, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────

function getGroupLabel(groupName: string): string {
  const labels: Record<string, string> = {
    layout: 'Mise en page',
    appearance: 'Apparence',
    content: 'Contenu',
    typography: 'Typographie',
    interaction: 'Interactions',
    branding: 'Marque'
  };
  
  return labels[groupName] || groupName.charAt(0).toUpperCase() + groupName.slice(1);
}

export default BlockPropertyPanel;