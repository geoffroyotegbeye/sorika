/**
 * useBlockProperties Hook - React hook for integrating block properties with the editor
 * 
 * This hook manages the integration between the selection system and block properties,
 * providing a clean interface for React components to use the block property system.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  SelectionContext, 
  selectionContextAnalyzer 
} from '../elements/selection-context';
import { 
  blockPropertyManager, 
  BlockPropertyChangeEvent 
} from '../elements/block-property-manager';
import { 
  getBlockDefinition 
} from '../elements/block-property-registry';

// ─────────────────────────────────────────────
// HOOK INTERFACES
// ─────────────────────────────────────────────

export interface UseBlockPropertiesOptions {
  // Auto-initialize block properties when a block is selected
  autoInitialize?: boolean;
  // Debounce delay for property changes (ms)
  debounceDelay?: number;
  // Callback for selection changes
  onSelectionChange?: (context: SelectionContext | null) => void;
  // Callback for property changes
  onPropertyChange?: (event: BlockPropertyChangeEvent) => void;
}

export interface UseBlockPropertiesReturn {
  // Current selection context
  selectionContext: SelectionContext | null;
  // Whether block properties are available for current selection
  hasBlockProperties: boolean;
  // Whether element properties are available for current selection
  hasElementProperties: boolean;
  // Apply a property to the current block
  applyBlockProperty: (propertyKey: string, value: any) => boolean;
  // Get current property values for the selected block
  getBlockPropertyValues: () => Record<string, any>;
  // Initialize block properties with defaults
  initializeBlockProperties: () => void;
  // Update selection (call when user selects different element)
  updateSelection: (element: HTMLElement | null) => void;
  // Clear current selection
  clearSelection: () => void;
}

// ─────────────────────────────────────────────
// MAIN HOOK
// ─────────────────────────────────────────────

export function useBlockProperties(
  templateIdOrOptions?: string | UseBlockPropertiesOptions
) {
  // Support both old and new API
  const options: UseBlockPropertiesOptions = typeof templateIdOrOptions === 'string' 
    ? { autoInitialize: true } 
    : (templateIdOrOptions || {});
    
  const {
    autoInitialize = true,
    debounceDelay = 100,
    onSelectionChange,
    onPropertyChange
  } = options;

  // State
  const [selectionContext, setSelectionContext] = useState<SelectionContext | null>(null);
  const [properties, setProperties] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs for debouncing and cleanup
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const propertyChangeHandlerRef = useRef<((event: BlockPropertyChangeEvent) => void) | null>(null);

  // ─────────────────────────────────────────────
  // PROPERTY CHANGE HANDLER
  // ─────────────────────────────────────────────

  useEffect(() => {
    // Create property change handler
    const handlePropertyChange = (event: BlockPropertyChangeEvent) => {
      onPropertyChange?.(event);
    };

    // Register handler
    propertyChangeHandlerRef.current = handlePropertyChange;
    blockPropertyManager.onPropertyChange(handlePropertyChange);

    // Cleanup
    return () => {
      if (propertyChangeHandlerRef.current) {
        blockPropertyManager.offPropertyChange(propertyChangeHandlerRef.current);
        propertyChangeHandlerRef.current = null;
      }
    };
  }, [onPropertyChange]);

  // ─────────────────────────────────────────────
  // SELECTION UPDATE FUNCTION
  // ─────────────────────────────────────────────

  const updateSelection = useCallback((element: HTMLElement | null) => {
    // Clear existing debounce
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce the selection update
    debounceTimeoutRef.current = setTimeout(() => {
      if (!element) {
        setSelectionContext(null);
        onSelectionChange?.(null);
        return;
      }

      try {
        // Analyze the selection
        const context = selectionContextAnalyzer.analyzeSelection(element);
        
        // Auto-initialize block properties if enabled
        if (autoInitialize && context.block) {
          const blockDefinition = getBlockDefinition(context.block.templateId);
          if (blockDefinition) {
            // Check if block already has properties initialized
            const blockId = context.block.blockElement.getAttribute('data-block-id');
            if (!blockId) {
              blockPropertyManager.initializeBlockProperties(
                context.block.blockElement,
                context.block.templateId
              );
            }
          }
        }

        setSelectionContext(context);
        onSelectionChange?.(context);
      } catch (error) {
        console.error('Error analyzing selection:', error);
        setSelectionContext(null);
        onSelectionChange?.(null);
      }
    }, debounceDelay);
  }, [autoInitialize, debounceDelay, onSelectionChange]);

  // ─────────────────────────────────────────────
  // CLEAR SELECTION FUNCTION
  // ─────────────────────────────────────────────

  const clearSelection = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    setSelectionContext(null);
    onSelectionChange?.(null);
  }, [onSelectionChange]);

  // ─────────────────────────────────────────────
  // BLOCK PROPERTY FUNCTIONS
  // ─────────────────────────────────────────────

  const applyBlockProperty = useCallback((propertyKey: string, value: any): boolean => {
    if (!selectionContext?.block) {
      console.warn('No block selected for property application');
      return false;
    }

    return blockPropertyManager.applyProperty(
      selectionContext.block.blockElement,
      selectionContext.block.templateId,
      propertyKey,
      value
    );
  }, [selectionContext]);

  const getBlockPropertyValues = useCallback((): Record<string, any> => {
    return properties;
  }, [properties]);
  
  const updateProperty = useCallback((propertyKey: string, value: any) => {
    setProperties(prev => ({ ...prev, [propertyKey]: value }));
    
    if (selectionContext?.block) {
      applyBlockProperty(propertyKey, value);
    }
  }, [selectionContext, applyBlockProperty]);
  
  const resetProperties = useCallback(() => {
    if (!selectionContext?.block) return;
    
    const blockDefinition = getBlockDefinition(selectionContext.block.templateId);
    if (!blockDefinition) return;
    
    const defaults: Record<string, any> = {};
    Object.entries(blockDefinition.properties).forEach(([key, prop]) => {
      defaults[key] = prop.default;
    });
    
    setProperties(defaults);
  }, [selectionContext]);

  const initializeBlockProperties = useCallback(() => {
    if (!selectionContext?.block) {
      console.warn('No block selected for initialization');
      return;
    }

    blockPropertyManager.initializeBlockProperties(
      selectionContext.block.blockElement,
      selectionContext.block.templateId
    );
  }, [selectionContext]);

  // ─────────────────────────────────────────────
  // COMPUTED VALUES
  // ─────────────────────────────────────────────

  const hasBlockProperties = selectionContext?.hasBlockProperties ?? false;
  const hasElementProperties = selectionContext?.hasElementProperties ?? false;

  // ─────────────────────────────────────────────
  // CLEANUP
  // ─────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Load properties when selection changes
  useEffect(() => {
    if (!selectionContext?.block) {
      setProperties({});
      return;
    }
    
    setIsLoading(true);
    const blockDefinition = getBlockDefinition(selectionContext.block.templateId);
    
    if (blockDefinition) {
      const defaults: Record<string, any> = {};
      Object.entries(blockDefinition.properties).forEach(([key, prop]) => {
        defaults[key] = prop.default;
      });
      setProperties(defaults);
    }
    
    setIsLoading(false);
  }, [selectionContext?.block?.templateId]);

  // ─────────────────────────────────────────────
  // RETURN HOOK INTERFACE
  // ─────────────────────────────────────────────

  return {
    selectionContext,
    hasBlockProperties,
    hasElementProperties,
    applyBlockProperty,
    getBlockPropertyValues,
    initializeBlockProperties,
    updateSelection,
    clearSelection,
    properties,
    updateProperty,
    resetProperties,
    isLoading
  };
}

// ─────────────────────────────────────────────
// ADDITIONAL UTILITY HOOKS
// ─────────────────────────────────────────────

/**
 * Hook for listening to block property changes
 */
export function useBlockPropertyChanges(
  callback: (event: BlockPropertyChangeEvent) => void
) {
  useEffect(() => {
    blockPropertyManager.onPropertyChange(callback);
    
    return () => {
      blockPropertyManager.offPropertyChange(callback);
    };
  }, [callback]);
}

/**
 * Hook for managing block property state
 */
export function useBlockPropertyState(blockId: string | null) {
  const [properties, setProperties] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!blockId) {
      setProperties({});
      return;
    }

    // Get initial properties
    const initialProperties = blockPropertyManager.getBlockProperties(blockId);
    setProperties(initialProperties);

    // Listen for changes to this specific block
    const handleChange = (event: BlockPropertyChangeEvent) => {
      if (event.blockId === blockId) {
        setProperties(prev => ({
          ...prev,
          [event.propertyKey]: event.value
        }));
      }
    };

    blockPropertyManager.onPropertyChange(handleChange);

    return () => {
      blockPropertyManager.offPropertyChange(handleChange);
    };
  }, [blockId]);

  return properties;
}

/**
 * Hook for detecting if an element is a block container
 */
export function useBlockDetection(element: HTMLElement | null) {
  const [isBlock, setIsBlock] = useState(false);
  const [templateId, setTemplateId] = useState<string | null>(null);

  useEffect(() => {
    if (!element) {
      setIsBlock(false);
      setTemplateId(null);
      return;
    }

    const context = selectionContextAnalyzer.analyzeSelection(element);
    const blockContext = context.primary.type === 'block' ? context.primary.blockContext : context.block;
    
    setIsBlock(blockContext !== undefined);
    setTemplateId(blockContext?.templateId || null);
  }, [element]);

  return { isBlock, templateId };
}