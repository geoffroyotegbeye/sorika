/**
 * Block Property Manager - Handles property application and state management
 * 
 * This manager is responsible for:
 * - Applying property changes to DOM elements
 * - Managing property state
 * - Validating property values
 * - Handling property change events
 */

import { 
  BlockProperty, 
  BlockPropertyValues, 
  BlockPropertyChangeEvent, 
  BlockPropertyChangeHandler,
  PropertyApplicationContext,
  PropertyValidationResult
} from './block-properties';
import { getBlockDefinition, findBlockDefinitionBySelector } from './block-property-registry';

// ─────────────────────────────────────────────
// PROPERTY APPLICATION STRATEGIES
// ─────────────────────────────────────────────

/**
 * Default property application strategies for different property types
 */
const PROPERTY_APPLIERS = {
  color: (context: PropertyApplicationContext) => {
    const { blockElement, propertyKey, value } = context;
    
    // Map property keys to CSS properties
    const cssPropertyMap: Record<string, string> = {
      backgroundColor: 'backgroundColor',
      borderColor: 'borderColor',
      textColor: 'color',
      color: 'color'
    };
    
    const cssProperty = cssPropertyMap[propertyKey] || propertyKey;
    blockElement.style[cssProperty as any] = value;
  },

  select: (context: PropertyApplicationContext) => {
    const { blockElement, propertyKey, value } = context;
    
    // Handle special select properties
    switch (propertyKey) {
      case 'height':
        blockElement.style.height = typeof value === 'number' ? `${value}px` : value;
        break;
      case 'position':
        blockElement.style.position = value;
        break;
      case 'textAlign':
        blockElement.style.textAlign = value;
        break;
      case 'columns':
        // For grid layouts
        blockElement.style.gridTemplateColumns = `repeat(${value}, 1fr)`;
        break;
      default:
        // Generic class-based approach
        blockElement.setAttribute(`data-${propertyKey}`, value);
    }
  },

  range: (context: PropertyApplicationContext) => {
    const { blockElement, propertyKey, value, property } = context;
    const unit = (property as any).unit || '';
    
    // Map range properties to CSS
    const cssPropertyMap: Record<string, string> = {
      height: 'height',
      minHeight: 'minHeight',
      logoSize: 'fontSize',
      spacing: 'gap',
      fontSize: 'fontSize'
    };
    
    const cssProperty = cssPropertyMap[propertyKey];
    if (cssProperty) {
      blockElement.style[cssProperty as any] = `${value}${unit}`;
    }
  },

  boolean: (context: PropertyApplicationContext) => {
    const { blockElement, propertyKey, value } = context;
    
    // Handle boolean properties
    switch (propertyKey) {
      case 'showBorder':
        if (value) {
          const borderColor = blockElement.style.borderColor || '#e2e8f0';
          blockElement.style.borderBottom = `1px solid ${borderColor}`;
        } else {
          blockElement.style.borderBottom = 'none';
        }
        break;
      case 'showButton':
        const button = blockElement.querySelector('button, .btn');
        if (button) {
          (button as HTMLElement).style.display = value ? 'inline-block' : 'none';
        }
        break;
      default:
        // Generic data attribute approach
        blockElement.setAttribute(`data-${propertyKey}`, value.toString());
    }
  },

  text: (context: PropertyApplicationContext) => {
    const { blockElement, propertyKey, value } = context;
    
    // Handle text properties
    switch (propertyKey) {
      case 'currency':
        const currencyElements = blockElement.querySelectorAll('.currency, [data-currency]');
        currencyElements.forEach(el => {
          el.textContent = value;
        });
        break;
      default:
        blockElement.setAttribute(`data-${propertyKey}`, value);
    }
  },

  number: (context: PropertyApplicationContext) => {
    const { blockElement, propertyKey, value, property } = context;
    const unit = (property as any).unit || '';
    
    // Similar to range but for number inputs
    blockElement.style.setProperty(`--${propertyKey}`, `${value}${unit}`);
  }
};

// ─────────────────────────────────────────────
// BLOCK PROPERTY MANAGER CLASS
// ─────────────────────────────────────────────

export class BlockPropertyManager {
  private changeHandlers: BlockPropertyChangeHandler[] = [];
  private propertyStates: Map<string, BlockPropertyValues> = new Map();

  /**
   * Apply a property value to a block element
   */
  applyProperty(
    element: HTMLElement, 
    templateId: string, 
    propertyKey: string, 
    value: any
  ): boolean {
    const definition = getBlockDefinition(templateId);
    if (!definition) {
      console.warn(`No block definition found for template: ${templateId}`);
      return false;
    }

    const property = definition.properties[propertyKey];
    if (!property) {
      console.warn(`Property ${propertyKey} not found in template ${templateId}`);
      return false;
    }

    // Validate the value
    const validation = this.validatePropertyValue(property, value);
    if (!validation.isValid) {
      console.error(`Invalid value for property ${propertyKey}: ${validation.error}`);
      return false;
    }

    // Get previous value for change event
    const blockId = this.getBlockId(element);
    const previousValue = this.getPropertyValue(blockId, propertyKey);

    // Apply the property using the appropriate strategy
    const context: PropertyApplicationContext = {
      blockElement: element,
      templateId,
      property,
      propertyKey,
      value,
      previousValue
    };

    try {
      // Use custom applier if defined, otherwise use default strategy
      if (definition.applyProperty) {
        definition.applyProperty(element, propertyKey, value);
      } else {
        const applier = PROPERTY_APPLIERS[property.type as keyof typeof PROPERTY_APPLIERS];
        if (applier) {
          applier(context);
        } else {
          console.warn(`No applier found for property type: ${property.type}`);
          return false;
        }
      }

      // Update property state
      this.setPropertyValue(blockId, propertyKey, value);

      // Emit change event
      this.emitPropertyChange({
        blockId,
        templateId,
        propertyKey,
        value,
        previousValue,
        element
      });

      return true;
    } catch (error) {
      console.error(`Error applying property ${propertyKey}:`, error);
      return false;
    }
  }

  /**
   * Apply multiple properties at once
   */
  applyProperties(
    element: HTMLElement, 
    templateId: string, 
    properties: BlockPropertyValues
  ): boolean {
    let success = true;
    
    for (const [propertyKey, value] of Object.entries(properties)) {
      if (!this.applyProperty(element, templateId, propertyKey, value)) {
        success = false;
      }
    }
    
    return success;
  }

  /**
   * Get current property values for a block
   */
  getBlockProperties(blockId: string): BlockPropertyValues {
    return this.propertyStates.get(blockId) || {};
  }

  /**
   * Get a specific property value
   */
  getPropertyValue(blockId: string, propertyKey: string): any {
    const properties = this.propertyStates.get(blockId);
    return properties?.[propertyKey];
  }

  /**
   * Set a property value in state
   */
  setPropertyValue(blockId: string, propertyKey: string, value: any): void {
    if (!this.propertyStates.has(blockId)) {
      this.propertyStates.set(blockId, {});
    }
    
    const properties = this.propertyStates.get(blockId)!;
    properties[propertyKey] = value;
  }

  /**
   * Initialize block properties with default values
   */
  initializeBlockProperties(element: HTMLElement, templateId: string): void {
    const definition = getBlockDefinition(templateId);
    if (!definition) return;

    const blockId = this.getBlockId(element);
    const defaultProperties: BlockPropertyValues = {};

    // Set default values for all properties
    for (const [propertyKey, property] of Object.entries(definition.properties)) {
      defaultProperties[propertyKey] = property.default;
    }

    // Apply default properties
    this.applyProperties(element, templateId, defaultProperties);
  }

  /**
   * Detect template ID from element
   */
  detectTemplateId(element: HTMLElement): string | null {
    // Try to get from data attribute first
    const dataTemplateId = element.getAttribute('data-template-id');
    if (dataTemplateId) return dataTemplateId;

    // Try to find by selector matching
    const definition = findBlockDefinitionBySelector(element);
    return definition?.id || null;
  }

  /**
   * Validate property value
   */
  validatePropertyValue(property: BlockProperty, value: any): PropertyValidationResult {
    // Required check
    if (property.required && (value === null || value === undefined || value === '')) {
      return { isValid: false, error: 'Property is required' };
    }

    // Type-specific validation
    switch (property.type) {
      case 'color':
        if (typeof value !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(value)) {
          return { isValid: false, error: 'Invalid color format' };
        }
        break;

      case 'range':
      case 'number':
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return { isValid: false, error: 'Value must be a number' };
        }
        if ('min' in property && numValue < property.min) {
          return { isValid: false, error: `Value must be >= ${property.min}` };
        }
        if ('max' in property && numValue > property.max) {
          return { isValid: false, error: `Value must be <= ${property.max}` };
        }
        break;

      case 'select':
        const validValues = property.options.map(opt => opt.value);
        if (!validValues.includes(value)) {
          return { isValid: false, error: 'Invalid option selected' };
        }
        break;

      case 'text':
        if (typeof value !== 'string') {
          return { isValid: false, error: 'Value must be a string' };
        }
        if ('maxLength' in property && value.length > property.maxLength!) {
          return { isValid: false, error: `Text too long (max ${property.maxLength} characters)` };
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          return { isValid: false, error: 'Value must be boolean' };
        }
        break;
    }

    return { isValid: true };
  }

  /**
   * Add property change handler
   */
  onPropertyChange(handler: BlockPropertyChangeHandler): void {
    this.changeHandlers.push(handler);
  }

  /**
   * Remove property change handler
   */
  offPropertyChange(handler: BlockPropertyChangeHandler): void {
    const index = this.changeHandlers.indexOf(handler);
    if (index > -1) {
      this.changeHandlers.splice(index, 1);
    }
  }

  /**
   * Emit property change event
   */
  private emitPropertyChange(event: BlockPropertyChangeEvent): void {
    this.changeHandlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('Error in property change handler:', error);
      }
    });
  }

  /**
   * Generate or get block ID
   */
  private getBlockId(element: HTMLElement): string {
    let blockId = element.getAttribute('data-block-id');
    if (!blockId) {
      blockId = `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      element.setAttribute('data-block-id', blockId);
    }
    return blockId;
  }

  /**
   * Clear all property states (useful for cleanup)
   */
  clearPropertyStates(): void {
    this.propertyStates.clear();
  }

  /**
   * Get property states for debugging
   */
  getDebugInfo(): { states: Map<string, BlockPropertyValues>, handlers: number } {
    return {
      states: this.propertyStates,
      handlers: this.changeHandlers.length
    };
  }
}

// ─────────────────────────────────────────────
// SINGLETON INSTANCE
// ─────────────────────────────────────────────

export const blockPropertyManager = new BlockPropertyManager();