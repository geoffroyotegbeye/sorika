'use client';

import { useEditorStore } from '@/lib/stores/editor-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2 } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';
import { ImageProperties } from './properties/ImageProperties';
import { VideoProperties } from './properties/VideoProperties';
import { useState } from 'react';

export function PropertiesPanel() {
  const { 
    elements, 
    selectedElementId, 
    updateElement, 
    updateElementStyles,
    deleteElement,
    currentBreakpoint 
  } = useEditorStore();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const selectedElement = findElementById(elements, selectedElementId);

  // Si aucun élément n'est sélectionné, ne rien afficher
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

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">{selectedElement.type}</h3>
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

      {/* Modal de confirmation */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Supprimer cet élément ?"
        description={`Êtes-vous sûr de vouloir supprimer ce ${selectedElement.type} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        onConfirm={handleDelete}
      />

      <ScrollArea className="flex-1">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>

          {/* Onglet Contenu */}
          <TabsContent value="content" className="p-4 space-y-4">
            {selectedElement.content !== undefined && (
              <div className="space-y-2">
                <Label>Texte</Label>
                <Input
                  value={selectedElement.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                />
              </div>
            )}

            {selectedElement.tag === 'img' && (
              <ImageProperties
                element={selectedElement}
                styles={currentStyles}
                onUpdate={(updates) => updateElement(selectedElement.id, updates)}
                onStyleChange={handleStyleChange}
              />
            )}

            {selectedElement.tag === 'video' && (
              <VideoProperties
                element={selectedElement}
                styles={currentStyles}
                onUpdate={(updates) => updateElement(selectedElement.id, updates)}
                onStyleChange={handleStyleChange}
              />
            )}
          </TabsContent>

          {/* Onglet Style */}
          <TabsContent value="style" className="p-4 space-y-6">
            {/* Layout */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase">Layout</h4>
              
              <div className="space-y-2">
                <Label>Display</Label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm"
                  value={currentStyles.display || 'block'}
                  onChange={(e) => handleStyleChange('display', e.target.value)}
                >
                  <option value="block">Block</option>
                  <option value="flex">Flex</option>
                  <option value="grid">Grid</option>
                  <option value="inline-block">Inline Block</option>
                  <option value="none">None</option>
                </select>
              </div>

              {currentStyles.display === 'flex' && (
                <>
                  <div className="space-y-2">
                    <Label>Flex Direction</Label>
                    <select
                      className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm"
                      value={currentStyles.flexDirection || 'row'}
                      onChange={(e) => handleStyleChange('flexDirection', e.target.value)}
                    >
                      <option value="row">Row</option>
                      <option value="column">Column</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Justify Content</Label>
                    <select
                      className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm"
                      value={currentStyles.justifyContent || 'flex-start'}
                      onChange={(e) => handleStyleChange('justifyContent', e.target.value)}
                    >
                      <option value="flex-start">Start</option>
                      <option value="center">Center</option>
                      <option value="flex-end">End</option>
                      <option value="space-between">Space Between</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Align Items</Label>
                    <select
                      className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm"
                      value={currentStyles.alignItems || 'stretch'}
                      onChange={(e) => handleStyleChange('alignItems', e.target.value)}
                    >
                      <option value="stretch">Stretch</option>
                      <option value="flex-start">Start</option>
                      <option value="center">Center</option>
                      <option value="flex-end">End</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Dimensions */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase">Dimensions</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Width</Label>
                  <Input
                    value={currentStyles.width || ''}
                    onChange={(e) => handleStyleChange('width', e.target.value)}
                    placeholder="auto"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Height</Label>
                  <Input
                    value={currentStyles.height || ''}
                    onChange={(e) => handleStyleChange('height', e.target.value)}
                    placeholder="auto"
                  />
                </div>
              </div>
            </div>

            {/* Spacing */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase">Spacing</h4>
              
              <div className="space-y-2">
                <Label>Padding</Label>
                <Input
                  value={currentStyles.padding || ''}
                  onChange={(e) => handleStyleChange('padding', e.target.value)}
                  placeholder="0px"
                />
              </div>

              <div className="space-y-2">
                <Label>Margin</Label>
                <Input
                  value={currentStyles.margin || ''}
                  onChange={(e) => handleStyleChange('margin', e.target.value)}
                  placeholder="0px"
                />
              </div>
            </div>

            {/* Typography */}
            {selectedElement.content && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-500 uppercase">Typography</h4>
                
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Input
                    value={currentStyles.fontSize || ''}
                    onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                    placeholder="16px"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Font Weight</Label>
                  <select
                    className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm"
                    value={currentStyles.fontWeight || '400'}
                    onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                  >
                    <option value="300">Light</option>
                    <option value="400">Regular</option>
                    <option value="500">Medium</option>
                    <option value="600">Semibold</option>
                    <option value="700">Bold</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input
                    type="color"
                    value={currentStyles.color || '#000000'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Background */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase">Background</h4>
              
              <div className="space-y-2">
                <Label>Background Color</Label>
                <Input
                  type="color"
                  value={currentStyles.backgroundColor || '#ffffff'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                />
              </div>
            </div>

            {/* Border */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase">Border</h4>
              
              <div className="space-y-2">
                <Label>Border Radius</Label>
                <Input
                  value={currentStyles.borderRadius || ''}
                  onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                  placeholder="0px"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
}

// Helper function
function findElementById(elements: any[], id: string | null): any {
  if (!id) return null;

  for (const element of elements) {
    if (element.id === id) return element;
    if (element.children?.length > 0) {
      const found = findElementById(element.children, id);
      if (found) return found;
    }
  }
  return null;
}
