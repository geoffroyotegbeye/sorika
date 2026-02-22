'use client';

import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Plus, Trash2, Copy, ArrowUp, ArrowDown, MoveUp, MoveDown, Clipboard } from 'lucide-react';
import { ELEMENT_CATEGORIES } from './elements/element-categories';
import { getDefaultStyles, getDefaultContent } from './elements/element-defaults';
import { useEditorStore } from '@/lib/stores/editor-store';

interface ElementContextMenuProps {
  children: React.ReactNode;
  elementType: string;
  elementId: string;
  parentId?: string;
  parentType?: string;
  onAddChild: (childType: string) => void;
  onAddBefore: (childType: string) => void;
  onAddAfter: (childType: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export function ElementContextMenu({
  children,
  elementType,
  elementId,
  parentId,
  parentType,
  onAddChild,
  onAddBefore,
  onAddAfter,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
}: ElementContextMenuProps) {
  const clipboard = useEditorStore((state) => state.clipboard);
  const copyElement = useEditorStore((state) => state.copyElement);
  const pasteElement = useEditorStore((state) => state.pasteElement);
  
  console.log('ElementContextMenu render - clipboard:', clipboard);
  
  const isInGrid = parentType === 'grid';
  const getAllElements = () => {
    return ELEMENT_CATEGORIES.flatMap(cat => 
      cat.items.map(item => ({ type: item.type, label: item.label, tag: item.tag }))
    );
  };
  
  const getAvailableChildren = (parentType: string) => {
    switch (parentType) {
      case 'section':
      case 'header':
      case 'footer':
      case 'navbar':
        return [
          { type: 'container', label: 'Container', tag: 'div' },
          { type: 'grid', label: 'Grid', tag: 'div' },
        ];
      case 'container':
      case 'vflex':
      case 'hflex':
      case 'div':
      case 'link-block':
        return [
          { type: 'grid', label: 'Grid', tag: 'div' },
          { type: 'heading', label: 'Titre', tag: 'h2' },
          { type: 'paragraph', label: 'Paragraphe', tag: 'p' },
          { type: 'text', label: 'Texte', tag: 'span' },
          { type: 'button', label: 'Bouton', tag: 'button' },
          { type: 'image', label: 'Image', tag: 'img' },
        ];
      case 'grid':
        return [
          { type: 'heading', label: 'Titre', tag: 'h2' },
          { type: 'paragraph', label: 'Paragraphe', tag: 'p' },
          { type: 'text', label: 'Texte', tag: 'span' },
          { type: 'button', label: 'Bouton', tag: 'button' },
          { type: 'image', label: 'Image', tag: 'img' },
        ];
      default:
        return [];
    }
  };

  const availableChildren = getAvailableChildren(elementType);
  const canHaveChildren = availableChildren.length > 0;
  const allElements = getAllElements();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {/* Ajouter avant - désactivé pour les éléments dans une grille */}
        {!isInGrid && (
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <ArrowUp className="mr-2 h-4 w-4" />
              Ajouter avant
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48 max-h-64 overflow-y-auto">
              {allElements.map((el) => (
                <ContextMenuItem
                  key={`before-${el.type}`}
                  onClick={() => onAddBefore(el.type)}
                >
                  {el.label}
                </ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
        )}

        {/* Ajouter après - désactivé pour les éléments dans une grille */}
        {!isInGrid && (
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <ArrowDown className="mr-2 h-4 w-4" />
              Ajouter après
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48 max-h-64 overflow-y-auto">
              {allElements.map((el) => (
                <ContextMenuItem
                  key={`after-${el.type}`}
                  onClick={() => onAddAfter(el.type)}
                >
                  {el.label}
                </ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
        )}

        {canHaveChildren && (
          <>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter à l'intérieur
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                {availableChildren.map((child) => (
                  <ContextMenuItem
                    key={child.type}
                    onClick={() => onAddChild(child.type)}
                  >
                    {child.label}
                  </ContextMenuItem>
                ))}
              </ContextMenuSubContent>
            </ContextMenuSub>
          </>
        )}
        
        <ContextMenuItem onClick={onDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Dupliquer
        </ContextMenuItem>
        
        <ContextMenuItem onClick={() => copyElement(elementId)}>
          <Clipboard className="mr-2 h-4 w-4" />
          Copier
        </ContextMenuItem>
        
        {(() => {
          console.log('Checking paste button - clipboard:', clipboard, 'canHaveChildren:', canHaveChildren, 'elementType:', elementType);
          return clipboard && canHaveChildren && (
            <ContextMenuItem onClick={() => pasteElement(elementId)}>
              <Clipboard className="mr-2 h-4 w-4" />
              Coller à l'intérieur ({clipboard.type})
            </ContextMenuItem>
          );
        })()}
        
        {(canMoveUp || canMoveDown) && (
          <>
            <ContextMenuSeparator />
            {canMoveUp && onMoveUp && (
              <ContextMenuItem onClick={onMoveUp}>
                <MoveUp className="mr-2 h-4 w-4" />
                Monter
              </ContextMenuItem>
            )}
            {canMoveDown && onMoveDown && (
              <ContextMenuItem onClick={onMoveDown}>
                <MoveDown className="mr-2 h-4 w-4" />
                Descendre
              </ContextMenuItem>
            )}
          </>
        )}
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={onDelete} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
