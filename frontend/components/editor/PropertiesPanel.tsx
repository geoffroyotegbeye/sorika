'use client';

import { useEditorStore } from '@/lib/stores/editor-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trash2, Layers } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';
import { LayoutSection } from './properties/LayoutSection';
import { SpacingSection } from './properties/SpacingSection';
import { SizeSection } from './properties/SizeSection';
import { TypographySection } from './properties/TypographySection';
import { BackgroundSection } from './properties/BackgroundSection';
import { BorderSection } from './properties/BorderSection';
import { EffectsSection } from './properties/EffectsSection';
import { InteractionsTab } from './properties/InteractionsTab';
import { LinkProperties } from './properties/LinkProperties';
import { ImageProperties } from './properties/ImageProperties';
import { VideoProperties } from './properties/VideoProperties';
import { ResponsiveHeaderProperties } from './properties/ResponsiveHeaderProperties';
import { useState } from 'react';

export function PropertiesPanel() {
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

  const selectedElement = findElementById(elements, selectedElementId);

  if (!selectedElement) {
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

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div>
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

      {/* Tabs */}
      <Tabs defaultValue="style" className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-2 rounded-none border-b">
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="interactions">Actions</TabsTrigger>
        </TabsList>

        {/* Style Tab */}
        <TabsContent value="style" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-180px)]">
            <Accordion type="multiple" defaultValue={['layout', 'spacing', 'typography']} className="w-full">
              <AccordionItem value="layout">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                  Layout
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <LayoutSection styles={currentStyles} onStyleChange={handleStyleChange} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="spacing">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                  Spacing
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <SpacingSection styles={currentStyles} onStyleChange={handleStyleChange} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="size">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                  Size
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <SizeSection styles={currentStyles} onStyleChange={handleStyleChange} />
                </AccordionContent>
              </AccordionItem>

              {isTextElement && (
                <AccordionItem value="typography">
                  <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                    Typography
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <TypographySection 
                      styles={currentStyles} 
                      content={selectedElement.content}
                      onStyleChange={handleStyleChange}
                      onContentChange={handleContentChange}
                    />
                  </AccordionContent>
                </AccordionItem>
              )}

              {['text-link', 'link-block', 'button'].includes(selectedElement.type) && (
                <AccordionItem value="link">
                  <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                    Lien
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <LinkProperties elementId={selectedElement.id} />
                  </AccordionContent>
                </AccordionItem>
              )}

              {selectedElement.tag === 'img' && (
                <AccordionItem value="image">
                  <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                    Image
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <ImageProperties
                      element={selectedElement}
                      styles={currentStyles}
                      onUpdate={(updates) => updateElement(selectedElement.id, updates)}
                      onStyleChange={handleStyleChange}
                    />
                  </AccordionContent>
                </AccordionItem>
              )}

              {selectedElement.tag === 'video' && (
                <AccordionItem value="video">
                  <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                    Vidéo
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <VideoProperties
                      element={selectedElement}
                      styles={currentStyles}
                      onUpdate={(updates) => updateElement(selectedElement.id, updates)}
                      onStyleChange={handleStyleChange}
                    />
                  </AccordionContent>
                </AccordionItem>
              )}

              {selectedElement.type === 'responsive-header' && (
                <AccordionItem value="menu">
                  <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                    Menu
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <ResponsiveHeaderProperties />
                  </AccordionContent>
                </AccordionItem>
              )}

              {['navbar', 'header', 'section'].includes(selectedElement.type) && (
                <AccordionItem value="global">
                  <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                    Global
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedElement.isGlobal || false}
                          onChange={(e) => updateElement(selectedElement.id, { isGlobal: e.target.checked })}
                          className="w-4 h-4 rounded border-slate-300"
                        />
                        <span className="text-sm">Afficher sur toutes les pages</span>
                      </label>
                      <p className="text-xs text-slate-500">
                        Cet élément apparaîtra automatiquement sur toutes les pages du site.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              <AccordionItem value="background">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                  Background
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <BackgroundSection styles={currentStyles} onStyleChange={handleStyleChange} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="border">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                  Border
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <BorderSection styles={currentStyles} onStyleChange={handleStyleChange} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="effects">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                  Effects
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <EffectsSection styles={currentStyles} onStyleChange={handleStyleChange} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ScrollArea>
        </TabsContent>

        {/* Interactions Tab */}
        <TabsContent value="interactions" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-180px)]">
            <InteractionsTab elementId={selectedElement.id} />
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
    if (!element) continue; // Ignorer les null/undefined
    if (element.id === id) return element;
    if (element.children?.length > 0) {
      const found = findElementById(element.children, id);
      if (found) return found;
    }
  }
  return null;
}
