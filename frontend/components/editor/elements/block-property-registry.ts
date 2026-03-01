/**
 * Block Property Registry - Central registry for all block property definitions
 * 
 * This registry maps template IDs to their property schemas, following Odoo's
 * approach where each snippet has its own options definition.
 * 
 * Note: Individual block properties are now organized in separate files
 * in the ./properties/ directory for better maintainability.
 */

import { BlockDefinition, BlockPropertySchema } from './block-properties';
import { ALL_BLOCK_DEFINITIONS, BLOCK_DEFINITIONS_BY_CATEGORY } from './properties';

// ─────────────────────────────────────────────
// MAIN BLOCK DEFINITIONS REGISTRY
// ─────────────────────────────────────────────

/**
 * Central registry of all block definitions
 * Consolidated from individual property files
 */
export const BLOCK_DEFINITIONS: Record<string, BlockDefinition> = ALL_BLOCK_DEFINITIONS;

// ─────────────────────────────────────────────
// REGISTRY FUNCTIONS
// ─────────────────────────────────────────────

/**
 * Get block definition by template ID
 */
export function getBlockDefinition(templateId: string): BlockDefinition | undefined {
  return BLOCK_DEFINITIONS[templateId];
}

/**
 * Get all block definitions for a category
 */
export function getBlockDefinitionsByCategory(category: string): BlockDefinition[] {
  const categoryDefinitions = BLOCK_DEFINITIONS_BY_CATEGORY[category as keyof typeof BLOCK_DEFINITIONS_BY_CATEGORY];
  return categoryDefinitions ? Object.values(categoryDefinitions) : [];
}

/**
 * Get block properties by template ID
 */
export function getBlockProperties(templateId: string): BlockPropertySchema | undefined {
  const definition = getBlockDefinition(templateId);
  return definition?.properties;
}

/**
 * Register a new block definition
 */
export function registerBlockDefinition(definition: BlockDefinition): void {
  BLOCK_DEFINITIONS[definition.id] = definition;
}

/**
 * Check if a template ID has block properties defined
 */
export function hasBlockProperties(templateId: string): boolean {
  return templateId in BLOCK_DEFINITIONS;
}

/**
 * Get all available template IDs
 */
export function getAllTemplateIds(): string[] {
  return Object.keys(BLOCK_DEFINITIONS);
}

/**
 * Get all available categories
 */
export function getAllCategories(): string[] {
  return Object.keys(BLOCK_DEFINITIONS_BY_CATEGORY);
}

/**
 * Find block definition by CSS selector
 */
export function findBlockDefinitionBySelector(element: HTMLElement): BlockDefinition | undefined {
  for (const definition of Object.values(BLOCK_DEFINITIONS)) {
    if (element.matches(definition.selector)) {
      return definition;
    }
  }
  return undefined;
}

/**
 * Get template info for display purposes
 */
export function getTemplateInfo(templateId: string): { label: string; category: string; icon?: string } | null {
  const definition = getBlockDefinition(templateId);
  if (!definition) return null;
  
  return {
    label: definition.name,
    category: definition.category,
    icon: getCategoryIcon(definition.category)
  };
}

/**
 * Get icon for a category
 */
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    Header: '🧭',
    Hero: '🎯',
    Banner: '📢',
    Blog: '📝',
    Contact: '📧',
    CTA: '🚀',
    Features: '⭐',
    Footer: '📄',
    Gallery: '🖼️',
    Pricing: '💰',
    Team: '👥',
    Testimonials: '💬'
  };
  
  return icons[category] || '📦';
}

/**
 * Get schema for a template (alias for getBlockProperties)
 */
export function getSchema(templateId: string): BlockPropertySchema | undefined {
  return getBlockProperties(templateId);
}

// ─────────────────────────────────────────────
// LEGACY COMPATIBILITY
// ─────────────────────────────────────────────

/**
 * Legacy compatibility - use getBlockDefinitionsByCategory instead
 * @deprecated
 */
export const BlockPropertyRegistry = {
  getSchema: getSchema,
  getTemplateInfo: getTemplateInfo,
  registerSchema: (templateId: string, schema: BlockPropertySchema) => {
    console.warn('BlockPropertyRegistry.registerSchema is deprecated. Use registerBlockDefinition instead.');
    // For backward compatibility, create a basic definition
    const definition: BlockDefinition = {
      id: templateId,
      name: templateId,
      category: 'Custom',
      selector: `[data-template-id="${templateId}"]`,
      properties: schema
    };
    registerBlockDefinition(definition);
  }
};