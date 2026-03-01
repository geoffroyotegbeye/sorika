'use client';

import { useEditorStore } from '@/lib/stores/editor-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Layers } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';
import { PropertyPanelSelector } from './properties/PropertyPanelSelector';
import { SimpleBlockProperties } from './properties/SimpleBlockProperties';
import { SelectionContextAnalyzer } from './elements/selection-context';
import { useState, useEffect } from 'react';

interface PropertiesPanelProps {
  companyId?: string | null;
}

export function PropertiesPanel({ companyId }: PropertiesPanelProps) {
  const { 
    elements, 
    selectedElementId, 
    updateElement, 
    updateElementStyles,
    deleteElement,
    currentBreakpoint,
    selectElement
  } = useEditorStore();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectionContext, setSelectionContext] = useState(null);

  const selectedElement = findElementById(elements, selectedElementId);

  // Analyser le contexte de sélection pour le nouveau système de propriétés
  useEffect(() => {
    if (selectedElement) {
      // Créer un contexte de sélection basé sur l'élément sélectionné
      const mockSelectionContext = {
        type: 'block',
        block: {
          templateId: selectedElement.templateId || selectedElement.type,
          element: selectedElement,
          properties: {}
        }
      };
      setSelectionContext(mockSelectionContext);
    } else {
      setSelectionContext(null);
    }
  }, [selectedElement]);

  if (!selectedElement || selectedElement.isLocked) {
    return null;
  }

  const currentStyles = selectedElement.styles[currentBreakpoint] || selectedElement.styles.desktop;

  const handleStyleChange = (property: string, value: string) => {
    updateElementStyles(selectedElement.id, { [property]: value });
  };

  const handleContentChange = (value: string) => {
    updateElement(selectedElement.id, { content: value });
  };

  const handleDelete = () => {
    deleteElement(selectedElement.id);
  };

  const handleNameDoubleClick = (element: any) => {
    setEditingNameId(element.id);
    setEditingNameValue(element.name || element.type);
  };

  const handleNameBlur = (elementId: string) => {
    const originalName = findElementById(elements, elementId)?.name || findElementById(elements, elementId)?.type;
    if (editingNameValue && editingNameValue !== originalName) {
      updateElement(elementId, { name: editingNameValue });
    }
    setEditingNameId(null);
  };

  const renderLayerItem = (element: any, depth = 0) => (
    <div key={element.id}>
      <div
        className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-slate-100 ${
          selectedElementId === element.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => selectElement(element.id)}
      >
        <Layers className="h-3 w-3 text-slate-400 flex-shrink-0" />
        {editingNameId === element.id ? (
          <Input
            value={editingNameValue}
            onChange={(e) => setEditingNameValue(e.target.value)}
            onBlur={() => handleNameBlur(element.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNameBlur(element.id);
              if (e.key === 'Escape') {
                setEditingNameId(null);
                setEditingNameValue('');
              }
            }}
            className="h-6 text-xs px-2"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            className="text-xs flex-1 truncate select-none"
            onDoubleClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleNameDoubleClick(element);
            }}
          >
            {element.name || element.type}
          </span>
        )}
      </div>
      {element.children?.filter(Boolean).map((child: any) => renderLayerItem(child, depth + 1))}
    </div>
  );

  const hasContent = selectedElement.content !== undefined;
  const isTextElement = ['heading', 'paragraph', 'text', 'button', 'text-link', 'blockquote'].includes(selectedElement.type);
  const isInputElement = ['input', 'textarea', 'checkbox', 'file-upload'].includes(selectedElement.type);
  const isLinkElement = ['text-link', 'link-block', 'button'].includes(selectedElement.type);
  const isGlobalElement = ['navbar', 'header', 'section', 'footer'].includes(selectedElement.type);

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{selectedElement.name || selectedElement.type}</h3>
            <p className="text-xs text-slate-500">{selectedElement.tag}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2 p-2 bg-slate-50 rounded text-xs font-mono">
          <span className="text-slate-500 flex-1 truncate">{selectedElement.id}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2"
            onClick={() => {
              navigator.clipboard.writeText(selectedElement.id);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? 'Copié' : 'Copier'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-2 rounded-none border-b">
          <TabsTrigger value="properties">Propriétés</TabsTrigger>
          <TabsTrigger value="interactions">Actions</TabsTrigger>
        </TabsList>

        {/* Properties Tab - Nouveau système par bloc */}
        <TabsContent value="properties" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-180px)]">
            <SimpleBlockProperties
              key={selectedElement.id} // Force re-render when element changes
              element={selectedElement}
              companyId={companyId}
              onPropertyChange={(key, value) => {
                console.log('🔧 Property changed:', key, value);
                // Ici on peut appliquer les changements à l'élément
                // Pour l'instant on log juste pour tester
              }}
            />
          </ScrollArea>
        </TabsContent>

        {/* Interactions Tab - Conservé pour les actions */}
        <TabsContent value="interactions" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="p-4">
              <p className="text-sm text-slate-500 mb-4">Actions et interactions pour cet élément</p>
              {/* Ici on peut garder les interactions existantes si nécessaire */}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Modal de confirmation */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Supprimer cet élément ?"
        description={`Êtes-vous sûr de vouloir supprimer ce ${selectedElement.name || selectedElement.type} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}

// Helper function
function findElementById(elements: any[], id: string | null): any {
  if (!id) return null;

  for (const element of elements) {
    if (!element) continue;
    if (element.id === id) return element;
    
    // Vérifier dans les enfants normaux
    if (element.children?.length > 0) {
      // Pour les grids, vérifier dans chaque cellule
      if (element.type === 'grid') {
        for (const cell of element.children) {
          if (Array.isArray(cell)) {
            const found = findElementById(cell, id);
            if (found) return found;
          }
        }
      } else {
        const found = findElementById(element.children, id);
        if (found) return found;
      }
    }
  }
  return null;
}
