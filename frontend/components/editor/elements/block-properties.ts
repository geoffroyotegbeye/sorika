/**
 * Block Properties System - Inspired by Odoo's snippet options architecture
 * 
 * This system allows each block template to define its own set of customizable properties
 * that appear in a contextual panel when the block is selected.
 * 
 * Architecture:
 * - Each block type has its own property schema
 * - Properties are strongly typed with validation
 * - UI components are automatically generated based on property types
 * - Changes are applied in real-time to the selected block
 */

// ─────────────────────────────────────────────
// CORE INTERFACES
// ─────────────────────────────────────────────

export interface BlockPropertyBase {
  type: string;
  label: string;
  description?: string;
  default: any;
  required?: boolean;
  group?: string; // For organizing properties in sections
}

export interface ColorProperty extends BlockPropertyBase {
  type: 'color';
  default: string;
  palette?: string[]; // Predefined color options
  allowCustom?: boolean;
}

export interface SelectProperty extends BlockPropertyBase {
  type: 'select';
  options: Array<{
    value: any;
    label: string;
    description?: string;
  }>;
  default: any;
}

export interface RangeProperty extends BlockPropertyBase {
  type: 'range';
  min: number;
  max: number;
  step?: number;
  unit?: string;
  default: number;
}

export interface BooleanProperty extends BlockPropertyBase {
  type: 'boolean';
  default: boolean;
}

export interface TextProperty extends BlockPropertyBase {
  type: 'text';
  default: string;
  placeholder?: string;
  maxLength?: number;
}

export interface NumberProperty extends BlockPropertyBase {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  default: number;
}

// Union type for all property types
export type BlockProperty = 
  | ColorProperty 
  | SelectProperty 
  | RangeProperty 
  | BooleanProperty 
  | TextProperty 
  | NumberProperty;

// ─────────────────────────────────────────────
// BLOCK PROPERTY SCHEMA
// ─────────────────────────────────────────────

export interface BlockPropertySchema {
  [propertyKey: string]: BlockProperty;
}

export interface BlockDefinition {
  id: string;
  name: string;
  category: string;
  properties: BlockPropertySchema;
  // CSS selector to target the block in the DOM
  selector: string;
  // Optional: Custom property application logic
  applyProperty?: (element: HTMLElement, property: string, value: any) => void;
}

// ─────────────────────────────────────────────
// PROPERTY VALUES & STATE
// ─────────────────────────────────────────────

export interface BlockPropertyValues {
  [propertyKey: string]: any;
}

export interface BlockState {
  blockId: string;
  templateId: string;
  properties: BlockPropertyValues;
  element?: HTMLElement;
}

// ─────────────────────────────────────────────
// PROPERTY APPLICATION CONTEXT
// ─────────────────────────────────────────────

export interface PropertyApplicationContext {
  blockElement: HTMLElement;
  templateId: string;
  property: BlockProperty;
  propertyKey: string;
  value: any;
  previousValue?: any;
}

// ─────────────────────────────────────────────
// EVENTS & CALLBACKS
// ─────────────────────────────────────────────

export interface BlockPropertyChangeEvent {
  blockId: string;
  templateId: string;
  propertyKey: string;
  value: any;
  previousValue?: any;
  element: HTMLElement;
}

export type BlockPropertyChangeHandler = (event: BlockPropertyChangeEvent) => void;

// ─────────────────────────────────────────────
// UTILITY TYPES
// ─────────────────────────────────────────────

export type PropertyType = BlockProperty['type'];

export interface PropertyValidationResult {
  isValid: boolean;
  error?: string;
}

export interface PropertyUIConfig {
  component: string; // Component name to render
  props?: Record<string, any>; // Additional props for the component
}