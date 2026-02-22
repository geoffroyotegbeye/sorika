import { create } from 'zustand';
import { Interaction } from '../interactions/types';

export interface ElementStyle {
  // Layout
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  
  // Dimensions
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  
  // Spacing
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  
  // Typography
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: string;
  textAlign?: string;
  color?: string;
  
  // Background
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  
  // Border
  border?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  
  // Effects
  boxShadow?: string;
  opacity?: string;
  transform?: string;
  transition?: string;
  
  // Position
  position?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  linkType?: 'anchor' | 'internal' | 'external';
  // Styles personnalisés
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  hoverColor?: string;
}

export interface Element {
  id: string;
  type: string; // 'section', 'container', 'heading', 'text', 'button', 'image', etc.
  tag: string; // 'section', 'div', 'h1', 'p', 'button', 'img', etc.
  content?: string;
  attributes?: Record<string, string>; // src, href, alt, etc.
  menuItems?: MenuItem[]; // Pour les headers responsives
  isLocked?: boolean; // Verrouillé (empêche modifications)
  isHidden?: boolean; // Caché (invisible dans le canvas)
  interactions?: Interaction[]; // Interactions et animations
  styles: {
    desktop: ElementStyle;
    tablet?: ElementStyle;
    mobile?: ElementStyle;
  };
  children: Element[];
}

export interface EditorState {
  // Éléments de la page
  elements: Element[];
  
  // Élément sélectionné
  selectedElementId: string | null;
  
  // Breakpoint actuel
  currentBreakpoint: 'desktop' | 'tablet' | 'mobile';
  
  // Affichage des labels
  showLabels: boolean;
  
  // Historique (undo/redo)
  history: Element[][];
  historyIndex: number;
  
  // Modifications non sauvegardées
  hasUnsavedChanges: boolean;
  
  // Presse-papier
  clipboard: Element | null;
  
  // Actions
  setElements: (elements: Element[]) => void;
  addElement: (element, parentId, cellIndex?) => void;
  addElementAt: (element: Element, parentId: string | undefined, targetId: string, position: 'before' | 'after') => void;
  updateElement: (id: string, updates: Partial<Element>) => void;
  updateElementContent: (id: string, content: string) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  setBreakpoint: (breakpoint: 'desktop' | 'tablet' | 'mobile') => void;
  toggleLabels: () => void;
  updateElementStyles: (id: string, styles: Partial<ElementStyle>) => void;
  updateElementInteractions: (id: string, interactions: Interaction[]) => void;
  moveElement: (elementId: string, newParentId: string, index: number) => void;
  duplicateElement: (id: string) => void;
  copyElement: (id: string) => void;
  pasteElement: (parentId?: string) => void;
  toggleElementLock: (id: string) => void;
  toggleElementVisibility: (id: string) => void;
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  markAsSaved: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  elements: [],
  selectedElementId: null,
  currentBreakpoint: 'desktop',
  showLabels: typeof window !== 'undefined' ? localStorage.getItem('editor-showLabels') === 'true' : false,
  history: [[]],
  historyIndex: 0,
  hasUnsavedChanges: false,
  clipboard: null,

  setElements: (elements) => {
    set({ elements, hasUnsavedChanges: false });
    get().saveToHistory();
  },

  addElement: (element, parentId, cellIndex) => {
    const { elements } = get();
    
    const uniqueElement = {
      ...element,
      id: `${element.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const addToParent = (items: Element[]): Element[] => {
      if (!parentId) {
        return [...items, uniqueElement];
      }
      
      return items.map(item => {
        if (item.id === parentId) {
          if (item.type === 'grid' && typeof cellIndex === 'number') {
            const newChildren = [...item.children];
            // Initialiser la cellule comme tableau si elle n'existe pas
            if (!Array.isArray(newChildren[cellIndex])) {
              newChildren[cellIndex] = [];
            }
            // Ajouter l'élément au tableau de la cellule
            newChildren[cellIndex] = [...newChildren[cellIndex], uniqueElement];
            return { ...item, children: newChildren };
          }
          return { ...item, children: [...item.children, uniqueElement] };
        }
        if (item.children.length > 0) {
          return { ...item, children: addToParent(item.children) };
        }
        return item;
      });
    };
    
    set({ elements: addToParent(elements), hasUnsavedChanges: true });
    get().saveToHistory();
  },

  addElementAt: (element, parentId, targetId, position) => {
    const { elements } = get();
    
    // Garantir un ID unique avec timestamp + random
    const uniqueElement = {
      ...element,
      id: `${element.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const addAtPosition = (items: Element[]): Element[] => {
      const result: Element[] = [];
      
      for (const item of items) {
        if (item.id === targetId) {
          if (position === 'before') {
            result.push(uniqueElement, item);
          } else {
            result.push(item, uniqueElement);
          }
        } else {
          if (item.children.length > 0) {
            result.push({ ...item, children: addAtPosition(item.children) });
          } else {
            result.push(item);
          }
        }
      }
      
      return result;
    };
    
    set({ elements: addAtPosition(elements), hasUnsavedChanges: true });
    get().saveToHistory();
  },

  updateElement: (id, updates) => {
    const { elements } = get();
    
    const updateInTree = (items: Element[]): Element[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        if (item.children.length > 0) {
          return { ...item, children: updateInTree(item.children) };
        }
        return item;
      });
    };
    
    set({ elements: updateInTree(elements), hasUnsavedChanges: true });
    get().saveToHistory();
  },

  updateElementContent: (id, content) => {
    const { elements } = get();
    
    const updateInTree = (items: Element[]): Element[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, content };
        }
        if (item.children.length > 0) {
          return { ...item, children: updateInTree(item.children) };
        }
        return item;
      });
    };
    
    set({ elements: updateInTree(elements) });
  },

  deleteElement: (id) => {
    const { elements } = get();
    
    const deleteFromTree = (items: Element[]): Element[] => {
      return items
        .filter(item => item.id !== id)
        .map(item => ({
          ...item,
          children: deleteFromTree(item.children),
        }));
    };
    
    set({ elements: deleteFromTree(elements), selectedElementId: null, hasUnsavedChanges: true });
    get().saveToHistory();
  },

  selectElement: (id) => {
    if (id) {
      const { elements } = get();
      const findElement = (items: Element[]): Element | null => {
        for (const item of items) {
          if (item.id === id) return item;
          if (item.children.length > 0) {
            const found = findElement(item.children);
            if (found) return found;
          }
        }
        return null;
      };
      const element = findElement(elements);
      if (element?.isLocked) return;
    }
    set({ selectedElementId: id });
  },

  setBreakpoint: (breakpoint) => set({ currentBreakpoint: breakpoint }),

  toggleLabels: () => set((state) => {
    const newValue = !state.showLabels;
    if (typeof window !== 'undefined') {
      localStorage.setItem('editor-showLabels', String(newValue));
    }
    return { showLabels: newValue };
  }),

  updateElementStyles: (id, styles) => {
    const { elements, currentBreakpoint } = get();
    
    const updateStylesInTree = (items: Element[]): Element[] => {
      return items.map(item => {
        if (item.id === id) {
          return {
            ...item,
            styles: {
              ...item.styles,
              [currentBreakpoint]: {
                ...item.styles[currentBreakpoint],
                ...styles,
              },
            },
          };
        }
        if (item.children.length > 0) {
          return { ...item, children: updateStylesInTree(item.children) };
        }
        return item;
      });
    };
    
    set({ elements: updateStylesInTree(elements), hasUnsavedChanges: true });
    get().saveToHistory();
  },

  updateElementInteractions: (id, interactions) => {
    const { elements } = get();
    
    const updateInTree = (items: Element[]): Element[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, interactions };
        }
        if (item.children.length > 0) {
          return { ...item, children: updateInTree(item.children) };
        }
        return item;
      });
    };
    
    set({ elements: updateInTree(elements), hasUnsavedChanges: true });
    get().saveToHistory();
  },

  moveElement: (elementId, newParentId, index) => {
    const { elements } = get();
    
    let elementToMove: Element | null = null;
    let parentId: string | null = null;
    
    // Trouver l'élément et son parent
    const findElementAndParent = (items: Element[], parent: string | null = null): boolean => {
      for (const item of items) {
        if (item.id === elementId) {
          elementToMove = JSON.parse(JSON.stringify(item));
          parentId = parent;
          return true;
        }
        if (item.children.length > 0) {
          if (findElementAndParent(item.children, item.id)) {
            return true;
          }
        }
      }
      return false;
    };
    
    findElementAndParent(elements);
    if (!elementToMove) return;
    
    // Supprimer l'élément de sa position actuelle
    const removeElement = (items: Element[]): Element[] => {
      return items.filter(item => item.id !== elementId).map(item => ({
        ...item,
        children: item.children.length > 0 ? removeElement(item.children) : item.children,
      }));
    };
    
    let newElements = removeElement(JSON.parse(JSON.stringify(elements)));
    
    // Réinsérer l'élément
    if (parentId) {
      // Déplacement dans un parent (enfants)
      const moveInParent = (items: Element[]): Element[] => {
        return items.map(item => {
          if (item.id === parentId) {
            const siblings = [...item.children];
            const currentIndex = siblings.findIndex(el => el.id === elementId);
            
            if (index === -1 && currentIndex > 0) {
              // Monter
              siblings.splice(currentIndex - 1, 0, elementToMove!);
            } else if (index === 999 && currentIndex < siblings.length - 1) {
              // Descendre
              siblings.splice(currentIndex + 1, 0, elementToMove!);
            } else if (typeof index === 'number' && index >= 0) {
              siblings.splice(index, 0, elementToMove!);
            }
            
            return { ...item, children: siblings };
          }
          if (item.children.length > 0) {
            return { ...item, children: moveInParent(item.children) };
          }
          return item;
        });
      };
      
      newElements = moveInParent(newElements);
    } else {
      // Déplacement au niveau racine
      const currentIndex = newElements.findIndex(el => el.id === elementId);
      
      if (index === -1 && currentIndex > 0) {
        newElements.splice(currentIndex - 1, 0, elementToMove);
      } else if (index === 999 && currentIndex < newElements.length - 1) {
        newElements.splice(currentIndex + 1, 0, elementToMove);
      } else if (typeof index === 'number' && index >= 0) {
        newElements.splice(index, 0, elementToMove);
      }
    }
    
    set({ elements: newElements, hasUnsavedChanges: true });
    get().saveToHistory();
  },

  duplicateElement: (id) => {
    const { elements } = get();
    
    // Fonction pour régénérer tous les IDs récursivement
    const regenerateIds = (element: Element): Element => {
      return {
        ...element,
        id: `${element.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        children: element.children.map(regenerateIds),
      };
    };
    
    const findAndDuplicate = (items: Element[]): Element[] => {
      const result: Element[] = [];
      
      for (const item of items) {
        result.push(item);
        
        if (item.id === id) {
          const duplicate = regenerateIds(JSON.parse(JSON.stringify(item)));
          result.push(duplicate);
        }
        
        if (item.children.length > 0) {
          result[result.length - 1].children = findAndDuplicate(item.children);
        }
      }
      
      return result;
    };
    
    set({ elements: findAndDuplicate(elements), hasUnsavedChanges: true });
    get().saveToHistory();
  },

  copyElement: (id) => {
    const { elements } = get();
    
    const findElement = (items: Element[]): Element | null => {
      for (const item of items) {
        if (item.id === id) return JSON.parse(JSON.stringify(item));
        if (item.children.length > 0) {
          const found = findElement(item.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    const element = findElement(elements);
    if (element) {
      set({ clipboard: element });
    }
  },

  pasteElement: (parentId) => {
    const { clipboard, elements } = get();
    if (!clipboard) return;
    
    // Fonction pour régénérer tous les IDs récursivement
    const regenerateIds = (element: Element): Element => {
      const newElement = {
        ...element,
        id: `${element.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        children: [] as Element[],
      };
      
      // Régénérer les IDs des enfants
      if (element.children && element.children.length > 0) {
        newElement.children = element.children.map(child => regenerateIds(child));
      }
      
      return newElement;
    };
    
    const newElement = regenerateIds(clipboard);
    
    if (parentId) {
      // Coller dans un parent spécifique
      const pasteInParent = (items: Element[]): Element[] => {
        return items.map(item => {
          if (item.id === parentId) {
            return { ...item, children: [...item.children, newElement] };
          }
          if (item.children.length > 0) {
            return { ...item, children: pasteInParent(item.children) };
          }
          return item;
        });
      };
      
      set({ elements: pasteInParent(elements), hasUnsavedChanges: true });
    } else {
      // Coller au niveau racine
      set({ elements: [...elements, newElement], hasUnsavedChanges: true });
    }
    
    get().saveToHistory();
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({ elements: history[newIndex], historyIndex: newIndex });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({ elements: history[newIndex], historyIndex: newIndex });
    }
  },

  saveToHistory: () => {
    const { elements, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(elements)));
    
    // Limiter l'historique à 50 états
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  markAsSaved: () => {
    set({ hasUnsavedChanges: false });
  },

  toggleElementLock: (id) => {
    const { elements } = get();
    const toggleInTree = (items: Element[]): Element[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, isLocked: !item.isLocked };
        }
        if (item.children.length > 0) {
          return { ...item, children: toggleInTree(item.children) };
        }
        return item;
      });
    };
    set({ elements: toggleInTree(elements), hasUnsavedChanges: true });
  },

  toggleElementVisibility: (id) => {
    const { elements } = get();
    const toggleInTree = (items: Element[]): Element[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, isHidden: !item.isHidden };
        }
        if (item.children.length > 0) {
          return { ...item, children: toggleInTree(item.children) };
        }
        return item;
      });
    };
    set({ elements: toggleInTree(elements), hasUnsavedChanges: true });
  },
}));
