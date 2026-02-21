import { useState, useRef, useEffect } from 'react';
import { useEditorStore } from '@/lib/stores/editor-store';

export function useCanvasState() {
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'inside' | null>(null);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const editableRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (editingElementId && editableRefs.current[editingElementId]) {
      const el = editableRefs.current[editingElementId];
      el?.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      if (el) {
        range.selectNodeContents(el);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }, [editingElementId]);

  return {
    hoveredElementId,
    setHoveredElementId,
    dropTargetId,
    setDropTargetId,
    dropPosition,
    setDropPosition,
    editingElementId,
    setEditingElementId,
    editableRefs,
  };
}

export function useElementHandlers() {
  const { 
    elements, 
    addElement, 
    addElementAt, 
    updateElement, 
    deleteElement, 
    duplicateElement, 
    moveElement,
    selectElement 
  } = useEditorStore();

  const handleMoveUp = (elementId: string, parentId?: string) => {
    if (!parentId) {
      const index = elements.findIndex(el => el.id === elementId);
      if (index > 0) {
        const newElements = [...elements];
        const [movedElement] = newElements.splice(index, 1);
        newElements.splice(index - 1, 0, movedElement);
        useEditorStore.setState({ elements: newElements, hasUnsavedChanges: true });
      }
    } else {
      moveElement(elementId, parentId, -1);
    }
  };

  const handleMoveDown = (elementId: string, parentId?: string) => {
    if (!parentId) {
      const index = elements.findIndex(el => el.id === elementId);
      if (index < elements.length - 1) {
        const newElements = [...elements];
        const [movedElement] = newElements.splice(index, 1);
        newElements.splice(index + 1, 0, movedElement);
        useEditorStore.setState({ elements: newElements, hasUnsavedChanges: true });
      }
    } else {
      moveElement(elementId, parentId, 999);
    }
  };

  return {
    elements,
    addElement,
    addElementAt,
    updateElement,
    deleteElement,
    duplicateElement,
    moveElement,
    selectElement,
    handleMoveUp,
    handleMoveDown,
  };
}
