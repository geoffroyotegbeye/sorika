/**
 * Selection Context System - Determines whether user selected an element or a block
 * 
 * This system analyzes the selected element to determine:
 * - Is it an individual element (button, text, image) -> Show element properties
 * - Is it a block container (header, hero, pricing) -> Show block properties
 * - What type of properties panel should be displayed
 */

import { findBlockDefinitionBySelector } from './block-property-registry';

// ─────────────────────────────────────────────
// SELECTION CONTEXT TYPES
// ─────────────────────────────────────────────

export type SelectionType = 'element' | 'block' | 'unknown';

export interface ElementContext {
  type: SelectionType;
  element: HTMLElement;
  elementType?: string; // button, text, image, etc.
  blockContext?: BlockContext;
}

export interface BlockContext {
  templateId: string;
  blockElement: HTMLElement;
  blockName: string;
  category: string;
}

export interface SelectionContext {
  primary: ElementContext;
  block?: BlockContext;
  hasBlockProperties: boolean;
  hasElementProperties: boolean;
  recommendedPanel: 'element' | 'block';
}

// ─────────────────────────────────────────────
// ELEMENT TYPE DETECTION
// ─────────────────────────────────────────────

/**
 * Detect the type of element based on tag, classes, and attributes
 */
function detectElementType(element: HTMLElement): string {
  const tagName = element.tagName.toLowerCase();
  const classList = Array.from(element.classList);
  
  // Direct tag mapping
  const tagTypeMap: Record<string, string> = {
    'button': 'button',
    'a': 'text-link',
    'img': 'image',
    'video': 'video',
    'h1': 'heading',
    'h2': 'heading',
    'h3': 'heading',
    'h4': 'heading',
    'h5': 'heading',
    'h6': 'heading',
    'p': 'paragraph',
    'span': 'text',
    'div': 'div',
    'section': 'section',
    'header': 'header',
    'footer': 'footer',
    'nav': 'navbar',
    'form': 'form',
    'input': 'input',
    'textarea': 'textarea',
    'select': 'select'
  };

  // Check for specific classes that override tag type
  const classTypeMap: Record<string, string> = {
    'btn': 'button',
    'button': 'button',
    'text-link': 'text-link',
    'link-block': 'link-block',
    'container': 'container',
    'grid': 'grid',
    'vflex': 'vflex',
    'hflex': 'hflex',
    'navbar': 'navbar'
  };

  // Check classes first (more specific)
  for (const className of classList) {
    if (classTypeMap[className]) {
      return classTypeMap[className];
    }
  }

  // Fall back to tag name
  return tagTypeMap[tagName] || 'div';
}

/**
 * Check if element is a block container (template root)
 */
function isBlockContainer(element: HTMLElement): boolean {
  // Check for template ID data attribute
  if (element.hasAttribute('data-template-id')) {
    return true;
  }

  // Check if element matches any block selector
  const blockDefinition = findBlockDefinitionBySelector(element);
  return blockDefinition !== undefined;
}

/**
 * Find the nearest block container ancestor
 */
function findBlockContainer(element: HTMLElement): HTMLElement | null {
  let current: HTMLElement | null = element;
  
  while (current && current !== document.body) {
    if (isBlockContainer(current)) {
      return current;
    }
    current = current.parentElement;
  }
  
  return null;
}

// ─────────────────────────────────────────────
// SELECTION CONTEXT ANALYZER
// ─────────────────────────────────────────────

export class SelectionContextAnalyzer {
  
  /**
   * Analyze the selected element and determine context
   */
  static analyze(element: HTMLElement): { templateId: string | null; elementId: string } {
    const templateId = element.getAttribute('data-template-id') || 
                      element.getAttribute('data-element-id')?.split('-')[0] ||
                      null;
    const elementId = element.getAttribute('data-element-id') || element.id || `el-${Date.now()}`;
    
    return { templateId, elementId };
  }
  
  /**
   * Analyze the selected element and determine context (full version)
   */
  analyzeSelection(element: HTMLElement): SelectionContext {
    const elementType = detectElementType(element);
    const isBlock = isBlockContainer(element);
    
    let primary: ElementContext;
    let blockContext: BlockContext | undefined;
    
    if (isBlock) {
      // User selected a block container
      primary = {
        type: 'block',
        element,
        elementType,
        blockContext: this.createBlockContext(element)
      };
      blockContext = primary.blockContext;
    } else {
      // User selected an individual element
      primary = {
        type: 'element',
        element,
        elementType
      };
      
      // Try to find parent block
      const blockContainer = findBlockContainer(element);
      if (blockContainer) {
        blockContext = this.createBlockContext(blockContainer);
        primary.blockContext = blockContext;
      }
    }
    
    const hasBlockProperties = blockContext !== undefined;
    const hasElementProperties = this.hasElementProperties(elementType);
    
    // Determine recommended panel
    let recommendedPanel: 'element' | 'block';
    if (primary.type === 'block' && hasBlockProperties) {
      recommendedPanel = 'block';
    } else if (hasElementProperties) {
      recommendedPanel = 'element';
    } else if (hasBlockProperties) {
      recommendedPanel = 'block';
    } else {
      recommendedPanel = 'element'; // fallback
    }
    
    return {
      primary,
      block: blockContext,
      hasBlockProperties,
      hasElementProperties,
      recommendedPanel
    };
  }
  
  /**
   * Create block context from block element
   */
  private createBlockContext(element: HTMLElement): BlockContext | undefined {
    const blockDefinition = findBlockDefinitionBySelector(element);
    if (!blockDefinition) {
      // Try to get template ID from data attribute
      const templateId = element.getAttribute('data-template-id');
      if (templateId) {
        return {
          templateId,
          blockElement: element,
          blockName: templateId,
          category: 'Unknown'
        };
      }
      return undefined;
    }
    
    return {
      templateId: blockDefinition.id,
      blockElement: element,
      blockName: blockDefinition.name,
      category: blockDefinition.category
    };
  }
  
  /**
   * Check if element type has properties available
   */
  private hasElementProperties(elementType: string): boolean {
    // These element types have properties in the existing system
    const elementsWithProperties = [
      'button', 'text-link', 'heading', 'paragraph', 'text', 'image', 'video',
      'container', 'grid', 'vflex', 'hflex', 'div', 'section', 'header', 'footer'
    ];
    
    return elementsWithProperties.includes(elementType);
  }
  
  /**
   * Get selection priority score (higher = more specific)
   */
  getSelectionPriority(context: SelectionContext): number {
    let score = 0;
    
    // Block selection gets higher priority if it has properties
    if (context.primary.type === 'block' && context.hasBlockProperties) {
      score += 100;
    }
    
    // Element selection gets medium priority
    if (context.primary.type === 'element' && context.hasElementProperties) {
      score += 50;
    }
    
    // Bonus for having both types available (gives user choice)
    if (context.hasBlockProperties && context.hasElementProperties) {
      score += 25;
    }
    
    return score;
  }
  
  /**
   * Check if two contexts are equivalent
   */
  isEquivalentContext(a: SelectionContext, b: SelectionContext): boolean {
    return (
      a.primary.element === b.primary.element &&
      a.primary.type === b.primary.type &&
      a.block?.templateId === b.block?.templateId
    );
  }
}

// ─────────────────────────────────────────────
// SELECTION CONTEXT UTILITIES
// ─────────────────────────────────────────────

/**
 * Get human-readable description of selection context
 */
export function getContextDescription(context: SelectionContext): string {
  const { primary, block } = context;
  
  if (primary.type === 'block' && block) {
    return `Bloc ${block.blockName} (${block.category})`;
  }
  
  if (primary.type === 'element') {
    const elementName = primary.elementType || 'élément';
    if (block) {
      return `${elementName} dans ${block.blockName}`;
    }
    return elementName;
  }
  
  return 'Sélection inconnue';
}

/**
 * Get available property panels for context
 */
export function getAvailablePanels(context: SelectionContext): Array<'element' | 'block'> {
  const panels: Array<'element' | 'block'> = [];
  
  if (context.hasElementProperties) {
    panels.push('element');
  }
  
  if (context.hasBlockProperties) {
    panels.push('block');
  }
  
  return panels;
}

/**
 * Check if context supports block properties
 */
export function supportsBlockProperties(context: SelectionContext): boolean {
  return context.hasBlockProperties && context.block !== undefined;
}

/**
 * Check if context supports element properties
 */
export function supportsElementProperties(context: SelectionContext): boolean {
  return context.hasElementProperties;
}

// ─────────────────────────────────────────────
// SINGLETON INSTANCE
// ─────────────────────────────────────────────

export const selectionContextAnalyzer = new SelectionContextAnalyzer();