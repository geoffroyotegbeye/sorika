'use client';

import { useEditorStore } from '@/lib/stores/editor-store';
import { ElementContextMenu } from './ElementContextMenu';
import { CSSProperties, useState, useRef, useEffect } from 'react';

export function Canvas() {
  const { elements, selectedElementId, selectElement, currentBreakpoint, addElement, deleteElement, duplicateElement, showLabels, addElementAt, updateElement, updateElementContent, moveElement } = useEditorStore();
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

  const getBreakpointWidth = () => {
    switch (currentBreakpoint) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      case 'desktop':
        return '100%';
    }
  };

  const isLayoutElement = (type: string) => {
    return ['header', 'section', 'container', 'grid', 'vflex', 'hflex', 'div', 'link-block', 'form', 'list', 'navbar'].includes(type);
  };

  const canContainChildren = (type: string) => {
    return ['header', 'section', 'container', 'grid', 'vflex', 'hflex', 'div', 'link-block', 'form', 'list', 'navbar'].includes(type);
  };

  const canAcceptChild = (parentType: string, childType: string) => {
    // Header peut contenir des layouts et navbar
    if (parentType === 'header') {
      return ['container', 'vflex', 'hflex', 'navbar', 'div'].includes(childType);
    }
    
    // Section peut contenir des layouts
    if (parentType === 'section') {
      return ['container', 'vflex', 'hflex', 'grid', 'div'].includes(childType);
    }
    
    // Layouts flexibles peuvent contenir presque tout
    if (['container', 'vflex', 'hflex', 'div'].includes(parentType)) {
      return !['section'].includes(childType); // Tout sauf section
    }
    
    // Grid peut contenir des éléments et layouts
    if (parentType === 'grid') {
      return !['section', 'container'].includes(childType);
    }
    
    // Link-block peut contenir des éléments inline et block
    if (parentType === 'link-block') {
      return ['heading', 'paragraph', 'text', 'image', 'div', 'vflex', 'hflex'].includes(childType);
    }
    
    // Form peut contenir des inputs et layouts
    if (parentType === 'form') {
      return ['input', 'textarea', 'checkbox', 'file-upload', 'button', 'div', 'vflex', 'hflex'].includes(childType);
    }
    
    // List peut contenir des list items (on utilise div comme list item)
    if (parentType === 'list') {
      return ['div', 'text', 'text-link'].includes(childType);
    }
    
    // Navbar peut contenir des liens et layouts
    if (parentType === 'navbar') {
      return ['link-block', 'text-link', 'button', 'div', 'hflex'].includes(childType);
    }
    
    return false;
  };

  const getDefaultContent = (type: string) => {
    const content: Record<string, string> = {
      heading: 'Nouveau titre',
      paragraph: 'Nouveau paragraphe de texte.',
      text: 'Texte',
      button: 'Cliquez ici',
      'text-link': 'Lien',
      blockquote: 'Citation importante',
    };
    return content[type] || '';
  };

  const getDefaultStyles = (type: string) => {
    const base = { display: 'block', boxSizing: 'border-box' };
    const styles: Record<string, any> = {
      header: { 
        ...base, 
        width: '100%', 
        padding: '16px 20px', 
        backgroundColor: '#ffffff', 
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: '0',
        zIndex: '1000'
      },
      section: { ...base, width: '100%', padding: '80px 20px', backgroundColor: '#ffffff' },
      container: { ...base, width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '20px' },
      grid: { display: 'grid', boxSizing: 'border-box', width: '100%', gridTemplateColumns: '1fr', gap: '20px', minHeight: '100px' },
      vflex: { display: 'flex', boxSizing: 'border-box', width: '100%', flexDirection: 'column', gap: '16px', padding: '20px' },
      hflex: { display: 'flex', boxSizing: 'border-box', width: '100%', flexDirection: 'row', gap: '16px', padding: '20px', alignItems: 'center' },
      div: { ...base, width: '100%', padding: '20px' },
      'link-block': { ...base, width: '100%', textDecoration: 'none', color: 'inherit' },
      heading: { ...base, width: '100%', fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' },
      paragraph: { ...base, width: '100%', fontSize: '16px', lineHeight: '1.6', color: '#475569' },
      text: { display: 'inline', boxSizing: 'border-box', fontSize: '16px', color: '#1e293b' },
      'text-link': { display: 'inline', boxSizing: 'border-box', color: '#3b82f6', textDecoration: 'underline', cursor: 'pointer' },
      blockquote: { ...base, width: '100%', borderLeft: '4px solid #3b82f6', paddingLeft: '16px', fontStyle: 'italic', color: '#475569' },
      button: { display: 'inline-block', boxSizing: 'border-box', padding: '12px 24px', backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', border: 'none' },
      image: { ...base, width: '100%', height: 'auto' },
      video: { ...base, width: '100%', height: 'auto' },
      list: { ...base, width: '100%', paddingLeft: '20px' },
      form: { ...base, width: '100%', padding: '20px' },
      input: { ...base, width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px' },
      textarea: { ...base, width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', minHeight: '100px' },
      checkbox: { display: 'inline-block', boxSizing: 'border-box', width: '16px', height: '16px' },
      'file-upload': { ...base, width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px' },
      navbar: { ...base, width: '100%', padding: '16px 20px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' },
    };
    return styles[type] || base;
  };

  const renderElement = (element: any, parentId?: string) => {
    const Tag = element.tag as keyof JSX.IntrinsicElements;
    const isSelected = element.id === selectedElementId;
    const isHovered = element.id === hoveredElementId;
    const isLayout = isLayoutElement(element.type);
    const isEmpty = canContainChildren(element.type) && element.children?.length === 0;
    const isDropTarget = element.id === dropTargetId;
    
    // Styles de base avec responsive
    let baseStyles = {
      ...element.styles.desktop,
      ...(currentBreakpoint === 'tablet' && element.styles.tablet ? element.styles.tablet : {}),
      ...(currentBreakpoint === 'mobile' && element.styles.mobile ? element.styles.mobile : {}),
    };

    // Comportement responsive automatique pour les grids
    if (element.type === 'grid') {
      if (currentBreakpoint === 'mobile') {
        baseStyles.gridTemplateColumns = '1fr';
      } else if (currentBreakpoint === 'tablet') {
        const desktopCols = element.styles.desktop.gridTemplateColumns || '1fr';
        const colCount = desktopCols.split(' ').length;
        baseStyles.gridTemplateColumns = colCount > 2 ? 'repeat(2, 1fr)' : desktopCols;
      }
    }
    
    const styles: CSSProperties = {
      ...baseStyles,
      position: 'relative',
      cursor: 'pointer',
      outline: isSelected ? '2px solid #3b82f6' : isDropTarget ? '2px solid #10b981' : isHovered ? '1px dashed #94a3b8' : isLayout ? '1px dashed #e2e8f0' : 'none',
      outlineOffset: isSelected ? '2px' : '0',
      transition: 'outline 0.15s ease',
      minHeight: isEmpty ? '100px' : undefined,
      backgroundColor: isDropTarget ? 'rgba(16, 185, 129, 0.05)' : element.styles[currentBreakpoint]?.backgroundColor || element.styles.desktop.backgroundColor,
      // Afficher les bordures de la grille en mode édition
      ...(element.type === 'grid' && {
        border: '1px solid #cbd5e1',
        '& > *': {
          border: '1px dashed #e2e8f0',
        }
      }),
    };

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      selectElement(element.id);
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
      e.stopPropagation();
      setHoveredElementId(element.id);
    };

    const handleMouseLeave = () => {
      setHoveredElementId(null);
    };

    const isTextElement = ['heading', 'paragraph', 'text', 'button', 'text-link', 'blockquote'].includes(element.type);

    const handleDoubleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isTextElement) {
        setEditingElementId(element.id);
      }
    };

    const handleBlur = () => {
      if (editableRefs.current[element.id] && editingElementId === element.id) {
        const newContent = editableRefs.current[element.id]?.innerText || '';
        updateElement(element.id, { content: newContent });
        setEditingElementId(null);
      }
    };

    const handleInput = () => {
      if (editableRefs.current[element.id] && editingElementId === element.id) {
        const newContent = editableRefs.current[element.id]?.innerText || '';
        updateElementContent(element.id, newContent);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && element.type !== 'paragraph') {
        e.preventDefault();
        handleBlur();
      }
      if (e.key === 'Escape') {
        setEditingElementId(null);
      }
    };

    const handleAddChild = (childType: string) => {
      const tagMap: Record<string, string> = {
        container: 'div', grid: 'div', vflex: 'div', hflex: 'div', div: 'div',
        'link-block': 'a', heading: 'h2', paragraph: 'p', text: 'span',
        'text-link': 'a', blockquote: 'blockquote', button: 'button',
        image: 'img', video: 'video', list: 'ul', form: 'form',
        input: 'input', textarea: 'textarea', checkbox: 'input',
        'file-upload': 'input', navbar: 'nav',
      };
      
      const newElement = {
        id: `${childType}-${Date.now()}`,
        type: childType,
        tag: tagMap[childType] || childType,
        content: getDefaultContent(childType),
        styles: { desktop: getDefaultStyles(childType) },
        children: [],
      };
      addElement(newElement, element.id);
    };

    const handleAddBefore = (childType: string) => {
      const tagMap: Record<string, string> = {
        container: 'div', grid: 'div', vflex: 'div', hflex: 'div', div: 'div',
        'link-block': 'a', heading: 'h2', paragraph: 'p', text: 'span',
        'text-link': 'a', blockquote: 'blockquote', button: 'button',
        image: 'img', video: 'video', list: 'ul', form: 'form',
        input: 'input', textarea: 'textarea', checkbox: 'input',
        'file-upload': 'input', navbar: 'nav',
      };
      
      const newElement = {
        id: `${childType}-${Date.now()}`,
        type: childType,
        tag: tagMap[childType] || childType,
        content: getDefaultContent(childType),
        styles: { desktop: getDefaultStyles(childType) },
        children: [],
      };
      addElementAt(newElement, parentId, element.id, 'before');
    };

    const handleAddAfter = (childType: string) => {
      const tagMap: Record<string, string> = {
        container: 'div', grid: 'div', vflex: 'div', hflex: 'div', div: 'div',
        'link-block': 'a', heading: 'h2', paragraph: 'p', text: 'span',
        'text-link': 'a', blockquote: 'blockquote', button: 'button',
        image: 'img', video: 'video', list: 'ul', form: 'form',
        input: 'input', textarea: 'textarea', checkbox: 'input',
        'file-upload': 'input', navbar: 'nav',
      };
      
      const newElement = {
        id: `${childType}-${Date.now()}`,
        type: childType,
        tag: tagMap[childType] || childType,
        content: getDefaultContent(childType),
        styles: { desktop: getDefaultStyles(childType) },
        children: [],
      };
      addElementAt(newElement, parentId, element.id, 'after');
    };

    const handleDelete = () => {
      deleteElement(element.id);
    };

    const handleDuplicate = () => {
      duplicateElement(element.id);
    };

    const handleMoveUp = () => {
      const index = elements.findIndex(el => el.id === element.id);
      if (index > 0) {
        moveElement(element.id, undefined, index - 1);
      }
    };

    const handleMoveDown = () => {
      const index = elements.findIndex(el => el.id === element.id);
      if (index < elements.length - 1) {
        moveElement(element.id, undefined, index + 1);
      }
    };

    // Drag & Drop handlers
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const draggedType = e.dataTransfer.getData('elementType');
      if (!draggedType) return;
      
      // Vérifier si cet élément peut accepter le type d'enfant
      if (canContainChildren(element.type) && canAcceptChild(element.type, draggedType)) {
        setDropTargetId(element.id);
        setDropPosition('inside');
      } else if (element.type === 'section' && draggedType === 'section') {
        // Permettre de déposer une section avant/après une autre section
        const rect = e.currentTarget.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        setDropPosition(e.clientY < midpoint ? 'before' : 'after');
        setDropTargetId(element.id);
      }
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.stopPropagation();
      setDropTargetId(null);
      setDropPosition(null);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const draggedType = e.dataTransfer.getData('elementType');
      const draggedTag = e.dataTransfer.getData('elementTag');
      
      const newElement = {
        id: `${draggedType}-${Date.now()}`,
        type: draggedType,
        tag: draggedTag,
        content: getDefaultContent(draggedType),
        styles: {
          desktop: getDefaultStyles(draggedType),
        },
        children: [],
      };

      if (dropPosition === 'inside' && canContainChildren(element.type)) {
        addElement(newElement, element.id);
      } else if (dropPosition === 'before' || dropPosition === 'after') {
        addElement(newElement, parentId);
      }

      setDropTargetId(null);
      setDropPosition(null);
    };

    // Label de l'élément - Visible selon le toggle
    const renderLabel = () => {
      if (!showLabels) return null;
      
      // Déterminer si l'élément peut être déplacé
      let canMoveUp = false;
      let canMoveDown = false;
      
      if (parentId) {
        // Élément imbriqué : chercher parmi les enfants du parent
        const findParent = (items: Element[]): Element | null => {
          for (const item of items) {
            if (item.id === parentId) return item;
            if (item.children.length > 0) {
              const found = findParent(item.children);
              if (found) return found;
            }
          }
          return null;
        };
        
        const parent = findParent(elements);
        if (parent) {
          const index = parent.children.findIndex(el => el.id === element.id);
          canMoveUp = index > 0;
          canMoveDown = index < parent.children.length - 1;
        }
      } else {
        // Élément top-level
        const index = elements.findIndex(el => el.id === element.id);
        canMoveUp = index > 0;
        canMoveDown = index < elements.length - 1;
      }
      
      return (
        <span 
          className="absolute top-0 left-0 px-2 py-0.5 text-xs font-medium bg-blue-600 text-white rounded-br z-10 flex items-center gap-1"
          style={{ pointerEvents: 'auto' }}
        >
          <span>{element.type}</span>
          {(canMoveUp || canMoveDown) && (
            <span className="flex gap-0.5 ml-1">
              {canMoveUp && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleMoveUp(); }}
                  className="hover:bg-blue-700 px-1 rounded"
                  title="Monter"
                >
                  ↑
                </button>
              )}
              {canMoveDown && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleMoveDown(); }}
                  className="hover:bg-blue-700 px-1 rounded"
                  title="Descendre"
                >
                  ↓
                </button>
              )}
            </span>
          )}
        </span>
      );
    };

    // Message pour les layouts vides
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

    // Pour les images
    if (element.tag === 'img') {
      const hasImage = element.attributes?.src;
      
      // Calculer si l'élément peut être déplacé
      let canMoveUpImg = false;
      let canMoveDownImg = false;
      
      if (parentId) {
        const findParent = (items: Element[]): Element | null => {
          for (const item of items) {
            if (item.id === parentId) return item;
            if (item.children.length > 0) {
              const found = findParent(item.children);
              if (found) return found;
            }
          }
          return null;
        };
        
        const parent = findParent(elements);
        if (parent) {
          const index = parent.children.findIndex(el => el.id === element.id);
          canMoveUpImg = index > 0;
          canMoveDownImg = index < parent.children.length - 1;
        }
      } else {
        const index = elements.findIndex(el => el.id === element.id);
        canMoveUpImg = index > 0;
        canMoveDownImg = index < elements.length - 1;
      }
      
      return (
        <ElementContextMenu
          key={element.id}
          elementType={element.type}
          elementId={element.id}
          parentId={parentId}
          onAddChild={handleAddChild}
          onAddBefore={handleAddBefore}
          onAddAfter={handleAddAfter}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onMoveUp={canMoveUpImg ? handleMoveUp : undefined}
          onMoveDown={canMoveDownImg ? handleMoveDown : undefined}
          canMoveUp={canMoveUpImg}
          canMoveDown={canMoveDownImg}
        >
          <div
            style={{ ...styles, display: 'block', position: 'relative' }}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {renderLabel()}
            {hasImage ? (
              <Tag
                style={{ width: '100%', height: 'auto', display: 'block' }}
                src={element.attributes.src}
                alt={element.attributes?.alt || 'Image'}
              />
            ) : (
              <div
                style={{
                  width: styles.width || '100%',
                  height: styles.height || '300px',
                  backgroundColor: '#f1f5f9',
                  border: '2px dashed #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <div className="text-center text-slate-400">
                  <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-medium">Cliquez pour ajouter une image</p>
                  <p className="text-xs mt-1">Utilisez le panneau de droite</p>
                </div>
              </div>
            )}
          </div>
        </ElementContextMenu>
      );
    }

    // Pour les vidéos
    if (element.tag === 'video') {
      const hasVideo = element.attributes?.src;
      
      let canMoveUpVid = false;
      let canMoveDownVid = false;
      
      if (parentId) {
        const findParent = (items: Element[]): Element | null => {
          for (const item of items) {
            if (item.id === parentId) return item;
            if (item.children.length > 0) {
              const found = findParent(item.children);
              if (found) return found;
            }
          }
          return null;
        };
        
        const parent = findParent(elements);
        if (parent) {
          const index = parent.children.findIndex(el => el.id === element.id);
          canMoveUpVid = index > 0;
          canMoveDownVid = index < parent.children.length - 1;
        }
      } else {
        const index = elements.findIndex(el => el.id === element.id);
        canMoveUpVid = index > 0;
        canMoveDownVid = index < elements.length - 1;
      }
      
      return (
        <ElementContextMenu
          key={element.id}
          elementType={element.type}
          elementId={element.id}
          parentId={parentId}
          onAddChild={handleAddChild}
          onAddBefore={handleAddBefore}
          onAddAfter={handleAddAfter}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onMoveUp={canMoveUpVid ? handleMoveUp : undefined}
          onMoveDown={canMoveDownVid ? handleMoveDown : undefined}
          canMoveUp={canMoveUpVid}
          canMoveDown={canMoveDownVid}
        >
          <div
            style={{ ...styles, display: 'block', position: 'relative' }}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {renderLabel()}
            {hasVideo ? (
              <Tag
                style={{ width: '100%', height: 'auto', display: 'block' }}
                src={element.attributes.src}
                poster={element.attributes?.poster}
                controls={element.attributes?.controls !== false}
                autoPlay={element.attributes?.autoplay}
                loop={element.attributes?.loop}
                muted={element.attributes?.muted}
              />
            ) : (
              <div
                style={{
                  width: styles.width || '100%',
                  height: styles.height || '300px',
                  backgroundColor: '#0f172a',
                  border: '2px dashed #475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <div className="text-center text-slate-400">
                  <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-medium">Cliquez pour ajouter une vidéo</p>
                  <p className="text-xs mt-1">Utilisez le panneau de droite</p>
                </div>
              </div>
            )}
          </div>
        </ElementContextMenu>
      );
    }

    // Pour les autres éléments
    const isEditing = editingElementId === element.id;
    
    // Calculer si l'élément peut être déplacé
    let canMoveUpEl = false;
    let canMoveDownEl = false;
    
    if (parentId) {
      const findParent = (items: Element[]): Element | null => {
        for (const item of items) {
          if (item.id === parentId) return item;
          if (item.children.length > 0) {
            const found = findParent(item.children);
            if (found) return found;
          }
        }
        return null;
      };
      
      const parent = findParent(elements);
      if (parent) {
        const index = parent.children.findIndex(el => el.id === element.id);
        canMoveUpEl = index > 0;
        canMoveDownEl = index < parent.children.length - 1;
      }
    } else {
      const index = elements.findIndex(el => el.id === element.id);
      canMoveUpEl = index > 0;
      canMoveDownEl = index < elements.length - 1;
    }

    return (
      <ElementContextMenu
        key={element.id}
        elementType={element.type}
        onAddChild={handleAddChild}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onMoveUp={canMoveUpEl ? handleMoveUp : undefined}
        onMoveDown={canMoveDownEl ? handleMoveDown : undefined}
        canMoveUp={canMoveUpEl}
        canMoveDown={canMoveDownEl}
      >
        <Tag 
          style={styles} 
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
            <div
              ref={(el) => { editableRefs.current[element.id] = el; }}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              style={{ outline: 'none', cursor: 'text' }}
            >
              {element.content}
            </div>
          ) : (
            element.content
          )}
          {element.children?.length > 0 && element.children.map((child: any) => (
            <div 
              key={child.id}
              className={element.type === 'grid' ? 'grid-cell' : ''}
              style={element.type === 'grid' ? {
                border: '1px dashed #cbd5e1',
                minHeight: '80px',
                padding: '8px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              } : undefined}
            >
              {renderElement(child, element.id)}
            </div>
          ))}
          {/* Afficher les cellules vides pour les grids */}
          {element.type === 'grid' && (() => {
            const cols = (element.styles[currentBreakpoint]?.gridTemplateColumns || element.styles.desktop?.gridTemplateColumns || '1fr').split(' ').length;
            const rows = (element.styles[currentBreakpoint]?.gridTemplateRows || element.styles.desktop?.gridTemplateRows || 'auto').split(' ').length;
            const totalCells = cols * rows;
            const emptyCells = totalCells - (element.children?.length || 0);
            
            return Array.from({ length: emptyCells }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="grid-cell"
                style={{
                  border: '1px dashed #cbd5e1',
                  minHeight: '80px',
                  padding: '8px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f8fafc',
                }}
              >
                <span className="text-xs text-slate-400 text-center">
                  Cellule {(element.children?.length || 0) + index + 1}<br/>
                  Glissez un élément ici
                </span>
              </div>
            ));
          })()}
        </Tag>
      </ElementContextMenu>
    );
  };

  return (
    <div className="flex-1 bg-slate-100 overflow-auto flex flex-col" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style jsx global>{`
        .flex-1::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="min-h-full flex items-start justify-center p-8">
          <div
            className="bg-white shadow-lg transition-all duration-300"
            style={{
              width: getBreakpointWidth(),
              minHeight: '100vh',
              overflow: 'hidden',
            }}
            onClick={() => selectElement(null)}
          >
            {elements.length === 0 ? (
              <div className="h-screen flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">Canvas vide</p>
                  <p className="text-sm">Ajoutez des éléments depuis le panneau de gauche</p>
                </div>
              </div>
            ) : (
              elements.map(renderElement)
            )}
          </div>
        </div>
    </div>
  );
}
