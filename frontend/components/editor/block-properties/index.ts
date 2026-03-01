/**
 * Block Properties System - Main Export File
 * 
 * This file exports all the components, hooks, and utilities needed to use
 * the block properties system in your editor.
 */

// ─────────────────────────────────────────────
// CORE TYPES AND INTERFACES
// ─────────────────────────────────────────────

export type {
  BlockProperty,
  BlockPropertyBase,
  ColorProperty,
  SelectProperty,
  RangeProperty,
  BooleanProperty,
  TextProperty,
  NumberProperty,
  BlockPropertySchema,
  BlockDefinition,
  BlockPropertyValues,
  BlockState,
  PropertyApplicationContext,
  BlockPropertyChangeEvent,
  BlockPropertyChangeHandler,
  PropertyType,
  PropertyValidationResult,
  PropertyUIConfig
} from '../elements/block-properties';

export type {
  SelectionType,
  ElementContext,
  BlockContext,
  SelectionContext
} from '../elements/selection-context';

// ─────────────────────────────────────────────
// REGISTRY AND MANAGEMENT
// ─────────────────────────────────────────────

export {
  BLOCK_DEFINITIONS,
  getBlockDefinition,
  getBlockDefinitionsByCategory,
  getBlockProperties,
  registerBlockDefinition,
  hasBlockProperties,
  getAllTemplateIds,
  findBlockDefinitionBySelector
} from '../elements/block-property-registry';

export {
  BlockPropertyManager,
  blockPropertyManager
} from '../elements/block-property-manager';

// ─────────────────────────────────────────────
// SELECTION CONTEXT
// ─────────────────────────────────────────────

export {
  SelectionContextAnalyzer,
  selectionContextAnalyzer,
  getContextDescription,
  getAvailablePanels,
  supportsBlockProperties,
  supportsElementProperties
} from '../elements/selection-context';

// ─────────────────────────────────────────────
// REACT COMPONENTS
// ─────────────────────────────────────────────

export { BlockPropertyPanel } from '../properties/BlockPropertyPanel';
export { PropertyPanelSelector } from '../properties/PropertyPanelSelector';

// ─────────────────────────────────────────────
// REACT HOOKS
// ─────────────────────────────────────────────

export {
  useBlockProperties,
  useBlockPropertyChanges,
  useBlockPropertyState,
  useBlockDetection
} from '../hooks/useBlockProperties';

export type {
  UseBlockPropertiesOptions,
  UseBlockPropertiesReturn
} from '../hooks/useBlockProperties';

// ─────────────────────────────────────────────
// EXAMPLE COMPONENT (FOR REFERENCE)
// ─────────────────────────────────────────────

export { BlockPropertiesExample } from '../examples/BlockPropertiesExample';

// ─────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────

/**
 * Initialize the block properties system
 * Call this once when your editor starts up
 */
export function initializeBlockPropertiesSystem() {
  console.log('Block Properties System initialized');
  console.log(`Registered ${getAllTemplateIds().length} block definitions`);
  
  // You can add any global initialization logic here
  // For example, registering custom property appliers or validators
}

/**
 * Register a new block definition at runtime
 * Useful for plugins or dynamic block registration
 */
export function registerCustomBlock(definition: BlockDefinition) {
  registerBlockDefinition(definition);
  console.log(`Registered custom block: ${definition.id}`);
}

/**
 * Get debug information about the current state
 */
export function getSystemDebugInfo() {
  return {
    registeredBlocks: getAllTemplateIds(),
    managerState: blockPropertyManager.getDebugInfo()
  };
}

// ─────────────────────────────────────────────
// VERSION INFO
// ─────────────────────────────────────────────

export const BLOCK_PROPERTIES_VERSION = '1.0.0';

// ─────────────────────────────────────────────
// CSS IMPORT HELPER
// ─────────────────────────────────────────────

/**
 * Import this to include the default styles for block properties
 * 
 * Usage:
 * import 'path/to/block-properties/styles';
 * 
 * Or import the CSS file directly:
 * import '../properties/block-properties.css';
 */