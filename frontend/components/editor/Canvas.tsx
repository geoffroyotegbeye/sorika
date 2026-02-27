'use client';

import { useEditorStore } from '@/lib/stores/editor-store';
import { ElementContextMenu } from './ElementContextMenu';
import { ImageRenderer, VideoRenderer } from './MediaRenderers';
import { MobileMenuToggle } from './MobileMenuToggle';
import { useCanvasState, useElementHandlers } from './canvas-hooks';
import { 
  isLayoutElement, 
  canContainChildren, 
  canAcceptChild, 
  getBreakpointWidth,
  canMoveElement 
} from './canvas-utils';
import { getDefaultContent, getDefaultStyles, getDefaultListItems } from './elements/element-defaults';
import { CSSProperties, useEffect, useRef } from 'react';
import { interactionEngine } from '@/lib/interactions/engine';
import { cleanStyleConflicts } from '@/lib/utils/style-utils';

export function Canvas() {
  const { selectedElementId, currentBreakpoint, showLabels, elements } = useEditorStore();
  const canvasState = useCanvasState();
  const handlers = useElementHandlers();
  const elementRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Debug: log des éléments
  useEffect(() => {
    console.log('Canvas - Elements from store:', elements);
    console.log('Canvas - Elements from handlers:', handlers.elements);
  }, [elements, handlers.elements]);

  // Appliquer les interactions en mode preview
  useEffect(() => {
    // Petit délai pour s'assurer que les refs sont prêtes
    const timer = setTimeout(() => {
      const applyInteractions = (els: any[]) => {
        els.forEach(el => {
          if (el.interactions && el.interactions.length > 0) {
            const domElement = elementRefs.current.get(el.id);
            if (domElement) {
              interactionEngine.setInteractions(el.id, el.interactions);
              interactionEngine.applyInteractions(el.id, domElement);
            }
          }
          if (el.children?.length > 0) {
            applyInteractions(el.children);
          }
        });
      };

      applyInteractions(elements);
    }, 100);

    return () => {
      clearTimeout(timer);
      interactionEngine.clearAll();
    };
  }, [elements]);

  const renderElement = (element: any, parentId?: string, parentType?: string, parentLocked = false, parentHidden = false): JSX.Element => {
    // Si l'élément ou son parent est caché, ne pas le rendre
    if (element.isHidden || parentHidden) {
      return <div key={element.id} style={{ display: 'none' }} />;
    }
    
    const Tag = element.tag as keyof JSX.IntrinsicElements;
    const isSelected = element.id === selectedElementId;
    const isHovered = element.id === canvasState.hoveredElementId;
    const isEmpty = canContainChildren(element.type) && element.children?.length === 0;
    const isDropTarget = element.id === canvasState.dropTargetId;
    const isLocked = element.isLocked || parentLocked;
    
    let baseStyles = {
      ...element.styles.desktop,
      ...(currentBreakpoint === 'tablet' && element.styles.tablet ? element.styles.tablet : {}),
      ...(currentBreakpoint === 'mobile' && element.styles.mobile ? element.styles.mobile : {}),
    };

    // Nettoyer les conflits de propriétés CSS
    baseStyles = cleanStyleConflicts(baseStyles);

    // Filtrer les propriétés non-CSS valides (comme les tableaux ou objets)
    const validStyles: Record<string, any> = {};
    Object.keys(baseStyles).forEach(key => {
      const value = baseStyles[key];
      // Ne garder que les valeurs primitives (string, number, boolean, undefined, null)
      if (value === null || value === undefined || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        validStyles[key] = value;
      }
    });
    baseStyles = validStyles;

    if (element.type === 'grid') {
      if (currentBreakpoint === 'mobile') {
        baseStyles.gridTemplateColumns = '1fr';
      } else if (currentBreakpoint === 'tablet') {
        const desktopCols = element.styles.desktop.gridTemplateColumns || '1fr';
        const colCount = desktopCols.split(' ').length;
        baseStyles.gridTemplateColumns = colCount > 2 ? 'repeat(2, 1fr)' : desktopCols;
      }
    }
    
  // Séparer les propriétés border pour éviter les conflits
    const { border, borderTop, borderRight, borderBottom, borderLeft, ...baseStylesWithoutBorder } = baseStyles;
    
    // Forcer position: relative pour les hflex qui contiennent un menu mobile
    if (element.type === 'hflex' && currentBreakpoint === 'mobile') {
      const hasNav = element.children?.some((child: any) => child.type === 'navbar');
      if (hasNav && !baseStylesWithoutBorder.position) {
        baseStylesWithoutBorder.position = 'relative';
      }
    }
    
    const styles: CSSProperties = {
      ...baseStylesWithoutBorder,
      position: 'relative',
      cursor: isLocked ? 'not-allowed' : 'pointer',
      outline: (isSelected && !isLocked) ? '2px solid #3b82f6' : isHovered ? '1px dashed #94a3b8' : 'none',
      outlineOffset: (isSelected && !isLocked) ? '2px' : '0',
      transition: 'outline 0.15s ease, border 0.15s ease, background-color 0.15s ease',
      minHeight: isEmpty ? '100px' : undefined,
      backgroundColor: isDropTarget && canvasState.dropPosition === 'inside' ? 'rgba(16, 185, 129, 0.05)' : baseStyles.backgroundColor,
      ...(border && !isDropTarget ? { border } : {}),
      ...(borderTop && !isDropTarget ? { borderTop } : {}),
      ...(borderRight && !isDropTarget ? { borderRight } : {}),
      ...(borderLeft && !isDropTarget ? { borderLeft } : {}),
      borderBottom: isDropTarget && canvasState.dropPosition === 'after' ? '3px solid #10b981' : borderBottom,
    };

    // Filtre final pour s'assurer qu'aucune valeur invalide ne passe
    const finalStyles: Record<string, string | number> = {};
    
    // Liste blanche des propriétés CSS valides
    const validCSSProps = new Set([
      'display', 'position', 'top', 'right', 'bottom', 'left',
      'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
      'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
      'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft',
      'borderWidth', 'borderStyle', 'borderColor', 'borderRadius',
      'backgroundColor', 'background', 'backgroundImage', 'backgroundSize', 'backgroundPosition',
      'color', 'fontSize', 'fontWeight', 'fontFamily', 'fontStyle',
      'lineHeight', 'letterSpacing', 'textAlign', 'textDecoration', 'textTransform',
      'listStyleType', 'listStylePosition', 'listStyle',
      'cursor', 'outline', 'outlineOffset', 'transition', 'transform',
      'flexDirection', 'flexWrap', 'flex', 'flexShrink', 'flexGrow',
      'alignItems', 'justifyContent', 'alignSelf', 'gap',
      'gridTemplateColumns', 'gridTemplateRows', 'gridColumn', 'gridRow',
      'objectFit', 'boxSizing', 'overflow', 'overflowX', 'overflowY',
      'zIndex', 'opacity', 'boxShadow', 'textShadow',
      'backdropFilter', 'filter', 'perspective',
      'WebkitBackgroundClip', 'WebkitTextFillColor'
    ]);
    
    Object.keys(styles).forEach(key => {
      const value = (styles as any)[key];
      
      // Ne garder que les propriétés CSS valides avec des valeurs primitives
      if (validCSSProps.has(key) && (typeof value === 'string' || typeof value === 'number')) {
        finalStyles[key] = value;
      }
    });

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isLocked) {
        handlers.selectElement(element.id);
      }
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
      e.stopPropagation();
      canvasState.setHoveredElementId(element.id);
    };

    const handleMouseLeave = () => {
      canvasState.setHoveredElementId(null);
    };

    const isTextElement = ['heading', 'paragraph', 'text', 'button', 'text-link', 'blockquote'].includes(element.type);

    const handleDoubleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isTextElement && !isLocked) {
        canvasState.setEditingElementId(element.id);
      }
    };

    const handleBlur = () => {
      if (canvasState.editableRefs.current[element.id] && canvasState.editingElementId === element.id) {
        const newContent = canvasState.editableRefs.current[element.id]?.innerText || '';
        handlers.updateElement(element.id, { content: newContent });
        canvasState.setEditingElementId(null);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && element.type !== 'paragraph') {
        e.preventDefault();
        handleBlur();
      }
      if (e.key === 'Escape') {
        canvasState.setEditingElementId(null);
      }
    };

    const createNewElement = (childType: string) => {
      const tagMap: Record<string, string> = {
        container: 'div', grid: 'div', vflex: 'div', hflex: 'div', div: 'div',
        'link-block': 'a', heading: 'h2', paragraph: 'p', text: 'span',
        'text-link': 'a', blockquote: 'blockquote', button: 'button',
        image: 'img', video: 'video', list: 'ul', form: 'form',
        input: 'input', textarea: 'textarea', checkbox: 'input',
        'file-upload': 'input', navbar: 'nav',
      };
      
      return {
        id: `${childType}-${Date.now()}`,
        type: childType,
        tag: tagMap[childType] || childType,
        content: getDefaultContent(childType),
        styles: { desktop: getDefaultStyles(childType) },
        children: [],
        ...(childType === 'list' ? { listItems: getDefaultListItems(childType) } : {}),
      };
    };

    const handleAddChild = (childType: string) => {
      handlers.addElement(createNewElement(childType), element.id);
    };

    const handleAddBefore = (childType: string) => {
      handlers.addElementAt(createNewElement(childType), parentId, element.id, 'before');
    };

    const handleAddAfter = (childType: string) => {
      handlers.addElementAt(createNewElement(childType), parentId, element.id, 'after');
    };

    const handleDelete = () => {
      handlers.deleteElement(element.id);
    };

    const handleDuplicate = () => {
      handlers.duplicateElement(element.id);
    };

    const handleMoveUp = () => {
      handlers.handleMoveUp(element.id, parentId);
    };

    const handleMoveDown = () => {
      handlers.handleMoveDown(element.id, parentId);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const height = rect.height;
      
      if (canContainChildren(element.type)) {
        if (y < height * 0.25) {
          canvasState.setDropPosition('before');
        } else if (y > height * 0.75) {
          canvasState.setDropPosition('after');
        } else {
          canvasState.setDropPosition('inside');
        }
      } else {
        if (y < height / 2) {
          canvasState.setDropPosition('before');
        } else {
          canvasState.setDropPosition('after');
        }
      }
      
      canvasState.setDropTargetId(element.id);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.stopPropagation();
      canvasState.setDropTargetId(null);
      canvasState.setDropPosition(null);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const draggedType = e.dataTransfer.getData('elementType');
      const draggedTag = e.dataTransfer.getData('elementTag');
      
      if (!draggedType || !draggedTag) {
        canvasState.setDropTargetId(null);
        canvasState.setDropPosition(null);
        return;
      }
      
      const canAccept = canAcceptChild(element.type, draggedType);
      
      const newElement = {
        id: `${draggedType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: draggedType,
        tag: draggedTag,
        content: getDefaultContent(draggedType),
        styles: {
          desktop: getDefaultStyles(draggedType),
        },
        children: [],
        ...(draggedType === 'list' ? { listItems: getDefaultListItems(draggedType) } : {}),
      };

      if (canvasState.dropPosition === 'inside' && canContainChildren(element.type) && canAccept) {
        handlers.addElement(newElement, element.id);
      } else if (canvasState.dropPosition === 'before') {
        handlers.addElementAt(newElement, parentId, element.id, 'before');
      } else if (canvasState.dropPosition === 'after') {
        handlers.addElementAt(newElement, parentId, element.id, 'after');
      }

      canvasState.setDropTargetId(null);
      canvasState.setDropPosition(null);
    };

    const renderLabel = () => {
      if (!showLabels) return null;
      
      const { canMoveUp, canMoveDown } = canMoveElement(handlers.elements, element.id, parentId);
      
      return (
        <span 
          className="absolute top-0 left-0 px-2 py-0.5 text-xs font-medium bg-blue-600 text-white rounded-br z-10 flex items-center gap-1"
          style={{ pointerEvents: 'auto' }}
        >
          <span>{element.type}</span>
          {isLocked && (
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z" />
            </svg>
          )}
          {(canMoveUp || canMoveDown) && !isLocked && (
            <span className="flex gap-0.5 ml-1">
              {canMoveUp && (
                <span
                  onClick={(e) => { e.stopPropagation(); handleMoveUp(); }}
                  className="hover:bg-blue-700 px-1 rounded cursor-pointer"
                  title="Monter"
                >
                  ↑
                </span>
              )}
              {canMoveDown && (
                <span
                  onClick={(e) => { e.stopPropagation(); handleMoveDown(); }}
                  className="hover:bg-blue-700 px-1 rounded cursor-pointer"
                  title="Descendre"
                >
                  ↓
                </span>
              )}
            </span>
          )}
        </span>
      );
    };

    const renderEmptyState = () => {
      if (!isEmpty) return null;
      
      return (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-sm text-slate-400">
            Glissez des éléments ici
          </span>
        </span>
      );
    };

    const mediaProps = {
      element,
      elements: handlers.elements,
      styles: finalStyles,
      parentId,
      parentType,
      handleClick,
      handleMouseEnter,
      handleMouseLeave,
      handleAddChild,
      handleAddBefore,
      handleAddAfter,
      handleDelete,
      handleDuplicate,
      handleMoveUp,
      handleMoveDown,
      renderLabel,
    };

    if (element.tag === 'img') {
      return <ImageRenderer {...mediaProps} />;
    }

    if (element.tag === 'video') {
      return <VideoRenderer {...mediaProps} />;
    }

    const isEditing = canvasState.editingElementId === element.id;
    const { canMoveUp, canMoveDown } = canMoveElement(handlers.elements, element.id, parentId);
    
    // Éléments void qui ne peuvent pas avoir d'enfants
    const isVoidElement = ['input', 'textarea'].includes(element.type);

    // Pour les éléments void, rendre sans children
    if (isVoidElement) {
      return (
        <ElementContextMenu
          key={element.id}
          elementType={element.type}
          elementId={element.id}
          parentType={parentType}
          onAddChild={handleAddChild}
          onAddBefore={handleAddBefore}
          onAddAfter={handleAddAfter}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onMoveUp={canMoveUp ? handleMoveUp : undefined}
          onMoveDown={canMoveDown ? handleMoveDown : undefined}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
        >
          <div style={{ position: 'relative', pointerEvents: isLocked ? 'none' : 'auto' }}>
            {renderLabel()}
            <Tag 
              ref={(el) => el && elementRefs.current.set(element.id, el)}
              data-element-id={element.id}
              style={finalStyles} 
              onClick={handleClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              {...(element.attributes || {})}
            />
          </div>
        </ElementContextMenu>
      );
    }

    return (
      <ElementContextMenu
        key={element.id}
        elementType={element.type}
        elementId={element.id}
        parentType={parentType}
        onAddChild={handleAddChild}
        onAddBefore={handleAddBefore}
        onAddAfter={handleAddAfter}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onMoveUp={canMoveUp ? handleMoveUp : undefined}
        onMoveDown={canMoveDown ? handleMoveDown : undefined}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      >
        <div style={{ position: 'relative', pointerEvents: isLocked ? 'none' : 'auto' }}>
          <Tag 
            ref={(el) => el && elementRefs.current.set(element.id, el)}
            data-element-id={element.id}
            style={finalStyles} 
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={element.type === 'grid' ? 'editor-grid' : ''}
          >
            {renderLabel()}
            {renderEmptyState()}
            {isTextElement && isEditing ? (
              <span
                ref={(el) => { 
                  canvasState.editableRefs.current[element.id] = el;
                  if (el && element.content && el.innerHTML !== element.content) {
                    el.innerHTML = element.content;
                    // Placer le curseur à la fin
                    const range = document.createRange();
                    const sel = window.getSelection();
                    if (el.childNodes.length > 0) {
                      range.selectNodeContents(el);
                      range.collapse(false);
                      sel?.removeAllRanges();
                      sel?.addRange(range);
                    }
                    el.focus();
                  }
                }}
                contentEditable
                suppressContentEditableWarning
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                style={{ outline: 'none', cursor: 'text', display: 'block', width: '100%' }}
              />
            ) : element.type === 'list' ? (
              element.listItems?.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))
            ) : isTextElement ? (
              <div dangerouslySetInnerHTML={{ __html: element.content || '' }} />
            ) : (
              element.content
            )}
            {element.type === 'grid' ? (() => {
              const cols = (element.styles[currentBreakpoint]?.gridTemplateColumns || element.styles.desktop?.gridTemplateColumns || '1fr').split(' ').length;
              const rows = (element.styles[currentBreakpoint]?.gridTemplateRows || element.styles.desktop?.gridTemplateRows || 'auto').split(' ').length;
              const totalCells = cols * rows;
              
              return Array.from({ length: totalCells }).map((_, cellIndex) => {
                const cellChildren = Array.isArray(element.children?.[cellIndex]) ? element.children[cellIndex] : [];
                const isEmpty = cellChildren.length === 0;
                
                return (
                  <div
                    key={`cell-${cellIndex}`}
                    className="grid-cell"
                    style={{
                      border: '1px dashed #cbd5e1',
                      minHeight: '80px',
                      padding: '8px',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      alignItems: 'stretch',
                      backgroundColor: isEmpty ? '#f8fafc' : undefined,
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      const draggedType = e.dataTransfer.getData('elementType');
                      const draggedTag = e.dataTransfer.getData('elementTag');
                      
                      if (draggedType && draggedTag) {
                        const newElement = {
                          id: `${draggedType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                          type: draggedType,
                          tag: draggedTag,
                          content: getDefaultContent(draggedType),
                          styles: {
                            desktop: getDefaultStyles(draggedType),
                          },
                          children: [],
                          ...(draggedType === 'list' ? { listItems: getDefaultListItems(draggedType) } : {}),
                        };
                        handlers.addElement(newElement, element.id, cellIndex);
                      }
                    }}
                  >
                    {isEmpty ? (
                      <span className="text-xs text-slate-400 text-center m-auto">
                        Cellule {cellIndex + 1}<br/>
                        Glissez un élément ici
                      </span>
                    ) : (
                      cellChildren.map((child: any, childIndex: number) => child && (
                        <div key={child.id || `child-${childIndex}`}>
                          {renderElement(child, element.id, element.type, isLocked, element.isHidden)}
                        </div>
                      ))
                    )}
                  </div>
                );
              });
            })() : (
              element.children?.length > 0 && element.children.map((child: any) => (
                <div key={child.id}>
                  {renderElement(child, element.id, element.type, isLocked, element.isHidden)}
                </div>
              ))
            )}
          </Tag>
        </div>
      </ElementContextMenu>
    );
  };

  const handleAddFirstSection = () => {
    const newSection = {
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'section',
      tag: 'section',
      content: '',
      styles: { 
        desktop: { 
          display: 'block', 
          boxSizing: 'border-box', 
          width: '100%', 
          padding: '80px 20px', 
          backgroundColor: '#ffffff' 
        } 
      },
      children: [],
    };
    handlers.addElement(newSection);
  };

  return (
    <MobileMenuToggle currentBreakpoint={currentBreakpoint}>
      <div 
        className="flex-1 bg-slate-100 overflow-auto flex flex-col" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      onDragOver={(e) => {
        if (handlers.elements.length === 0) {
          e.preventDefault();
        }
      }}
      onDrop={(e) => {
        if (handlers.elements.length === 0) {
          e.preventDefault();
          const draggedType = e.dataTransfer.getData('elementType');
          const draggedTag = e.dataTransfer.getData('elementTag');
          
          if (draggedType && draggedTag) {
            const newElement = {
              id: `${draggedType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: draggedType,
              tag: draggedTag,
              content: getDefaultContent(draggedType),
              styles: {
                desktop: getDefaultStyles(draggedType),
              },
              children: [],
              ...(draggedType === 'list' ? { listItems: getDefaultListItems(draggedType) } : {}),
            };
            handlers.addElement(newElement);
          }
        }
      }}
    >
      <style jsx global>{`
        .flex-1::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="min-h-full flex items-start justify-center p-8">
          <div
            className="bg-white shadow-lg transition-all duration-300"
            style={{
              width: getBreakpointWidth(currentBreakpoint),
              minHeight: '100vh',
              overflow: 'visible',
              paddingBottom: '200px',
            }}
            onClick={() => handlers.selectElement(null)}
          >
            {handlers.elements.length === 0 ? (
              <div className="h-screen flex items-center justify-center text-slate-400">
                <div className="text-center space-y-6">
                  <div>
                    <svg className="mx-auto h-24 w-24 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    <p className="text-xl font-semibold text-slate-600 mb-2">Votre page est vide</p>
                    <p className="text-sm text-slate-500 mb-6">Commencez par ajouter une section pour structurer votre contenu</p>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleAddFirstSection}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Ajouter une section
                    </button>
                    
                    <p className="text-xs text-slate-400">
                      Ou glissez-déposez des éléments depuis le panneau de gauche
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {console.log('Rendering elements:', handlers.elements)}
                {handlers.elements.map((element, index) => {
                  console.log(`Rendering element ${index}:`, element);
                  return (
                    <div key={element.id}>
                      {renderElement(element)}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </MobileMenuToggle>
  );
}
