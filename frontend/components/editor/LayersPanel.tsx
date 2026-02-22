'use client';

import { useState } from 'react';
import { Layers, ChevronRight, ChevronDown, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { useEditorStore } from '@/lib/stores/editor-store';
import { ScrollArea } from '@/components/ui/scroll-area';

export function LayersPanel() {
  const { elements, selectedElementId, selectElement, toggleElementVisibility, toggleElementLock, moveElement } = useEditorStore();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'inside' | null>(null);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleDragStart = (e: React.DragEvent, elementId: string) => {
    e.stopPropagation();
    setDraggedId(elementId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetId: string, hasChildren: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedId === targetId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;

    if (hasChildren && y > height * 0.3 && y < height * 0.7) {
      setDropPosition('inside');
    } else if (y < height / 2) {
      setDropPosition('before');
    } else {
      setDropPosition('after');
    }

    setDropTargetId(targetId);
  };

  const handleDragLeave = () => {
    setDropTargetId(null);
    setDropPosition(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string, parentId?: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedId || draggedId === targetId) return;

    // Utiliser la fonction moveElement existante
    // Elle attend: (elementId, newParentId, index)
    // index: -1 = monter, 999 = descendre, nombre = position exacte
    
    if (dropPosition === 'inside') {
      // Déplacer à l'intérieur du target
      moveElement(draggedId, targetId, 0);
    } else if (dropPosition === 'before') {
      // Déplacer avant le target (même parent)
      moveElement(draggedId, parentId || '', -1);
    } else if (dropPosition === 'after') {
      // Déplacer après le target (même parent)  
      moveElement(draggedId, parentId || '', 999);
    }

    setDraggedId(null);
    setDropTargetId(null);
    setDropPosition(null);
  };

  const renderLayer = (element: any, depth = 0, parentId?: string) => {
    const hasChildren = element.children?.length > 0;
    const isExpanded = expandedIds.has(element.id);
    const isSelected = selectedElementId === element.id;
    const isDragging = draggedId === element.id;
    const isDropTarget = dropTargetId === element.id;

    return (
      <div key={element.id}>
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, element.id)}
          onDragOver={(e) => handleDragOver(e, element.id, hasChildren)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, element.id, parentId)}
          className={`
            flex items-center gap-1 px-2 py-1.5 cursor-pointer hover:bg-slate-100 relative
            ${isSelected ? 'bg-blue-50 border-l-2 border-blue-500' : ''}
            ${isDragging ? 'opacity-50' : ''}
            ${isDropTarget && dropPosition === 'before' ? 'border-t-2 border-blue-500' : ''}
            ${isDropTarget && dropPosition === 'after' ? 'border-b-2 border-blue-500' : ''}
            ${isDropTarget && dropPosition === 'inside' ? 'bg-blue-100' : ''}
          `}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={(e) => {
            e.stopPropagation();
            selectElement(element.id);
          }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(element.id);
              }}
              className="p-0.5 hover:bg-slate-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}
          
          <Layers className="h-3 w-3 text-slate-400 flex-shrink-0" />
          
          <span className="text-xs flex-1 truncate select-none">
            {element.name || element.type}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleElementVisibility(element.id);
              }}
              className="p-0.5 hover:bg-slate-200 rounded"
            >
              {element.isHidden ? (
                <EyeOff className="h-3 w-3 text-slate-400" />
              ) : (
                <Eye className="h-3 w-3 text-slate-400" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleElementLock(element.id);
              }}
              className="p-0.5 hover:bg-slate-200 rounded"
            >
              {element.isLocked ? (
                <Lock className="h-3 w-3 text-slate-400" />
              ) : (
                <Unlock className="h-3 w-3 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {element.children.filter(Boolean).map((child: any) => 
              renderLayer(child, depth + 1, element.id)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-3 border-b border-slate-200">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Calques
        </h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {elements.map(element => renderLayer(element))}
        </div>
      </ScrollArea>
    </div>
  );
}
