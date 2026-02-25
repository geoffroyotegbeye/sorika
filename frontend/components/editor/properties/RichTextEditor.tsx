'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bold, Italic, Underline, Highlighter, Type, Palette, Quote, RemoveFormatting } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface RichTextEditorProps {
  content: string;
  onContentChange: (value: string) => void;
}

export function RichTextEditor({ content, onContentChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [customColor, setCustomColor] = useState('#000000');
  const [customBgColor, setCustomBgColor] = useState('#ffff00');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isBgColorPickerOpen, setIsBgColorPickerOpen] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || '';
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      onContentChange(editorRef.current.innerHTML);
    }
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const applyColor = (color: string) => {
    document.execCommand('foreColor', false, color);
    editorRef.current?.focus();
    setIsColorPickerOpen(false);
  };

  const applyHighlight = (color: string) => {
    document.execCommand('hiliteColor', false, color);
    editorRef.current?.focus();
    setIsBgColorPickerOpen(false);
  };

  const removeFormat = () => {
    document.execCommand('removeFormat', false, undefined);
    document.execCommand('formatBlock', false, '<p>');
    editorRef.current?.focus();
  };

  return (
    <div>
      <Label className="text-xs">Content</Label>
      
      {/* Barre d'outils */}
      <div className="flex flex-wrap gap-1 mt-1 mb-2 p-2 bg-slate-50 rounded border">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => applyFormat('bold')}
          title="Gras (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => applyFormat('italic')}
          title="Italique (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => applyFormat('underline')}
          title="Souligné (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => applyFormat('formatBlock', '<blockquote>')}
          title="Citation"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={removeFormat}
          title="Retirer le formatage"
        >
          <RemoveFormatting className="h-4 w-4" />
        </Button>
        
        <div className="border-l mx-1" />
        
        {/* Couleur de fond */}
        <Popover open={isBgColorPickerOpen} onOpenChange={setIsBgColorPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Couleur de fond"
            >
              <Highlighter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="space-y-3">
              <Label className="text-xs font-semibold">Couleurs prédéfinies</Label>
              <div className="grid grid-cols-6 gap-2">
                {[
                  { color: '#ffff00', name: 'Jaune' },
                  { color: '#00ff00', name: 'Vert clair' },
                  { color: '#00ffff', name: 'Cyan' },
                  { color: '#ff00ff', name: 'Magenta' },
                  { color: '#ffa500', name: 'Orange' },
                  { color: '#ff69b4', name: 'Rose' },
                  { color: '#90ee90', name: 'Vert pastel' },
                  { color: '#add8e6', name: 'Bleu clair' },
                  { color: '#ffb6c1', name: 'Rose clair' },
                  { color: '#ffe4b5', name: 'Beige' },
                  { color: '#e0e0e0', name: 'Gris clair' },
                  { color: '#ffffff', name: 'Blanc' },
                ].map((item) => (
                  <button
                    key={item.color}
                    type="button"
                    className="h-8 w-8 rounded border-2 border-slate-200 hover:border-slate-400 transition-colors"
                    style={{ backgroundColor: item.color }}
                    onClick={() => applyHighlight(item.color)}
                    title={item.name}
                  />
                ))}
              </div>
              
              <div className="border-t pt-3">
                <Label className="text-xs font-semibold">Couleur personnalisée</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="text"
                    value={customBgColor}
                    onChange={(e) => setCustomBgColor(e.target.value)}
                    placeholder="#ffff00"
                    className="h-8 text-xs flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="h-8"
                    onClick={() => applyHighlight(customBgColor)}
                  >
                    Appliquer
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-1">Format: #RRGGBB</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="border-l mx-1" />
        
        {/* Couleurs de texte */}
        <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Couleur du texte"
            >
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="space-y-3">
              <Label className="text-xs font-semibold">Couleurs prédéfinies</Label>
              <div className="grid grid-cols-6 gap-2">
                {[
                  { color: '#000000', name: 'Noir' },
                  { color: '#ffffff', name: 'Blanc' },
                  { color: '#ef4444', name: 'Rouge' },
                  { color: '#f59e0b', name: 'Orange' },
                  { color: '#eab308', name: 'Jaune' },
                  { color: '#22c55e', name: 'Vert' },
                  { color: '#3b82f6', name: 'Bleu' },
                  { color: '#8b5cf6', name: 'Violet' },
                  { color: '#ec4899', name: 'Rose' },
                  { color: '#64748b', name: 'Gris' },
                  { color: '#0ea5e9', name: 'Cyan' },
                  { color: '#14b8a6', name: 'Teal' },
                ].map((item) => (
                  <button
                    key={item.color}
                    type="button"
                    className="h-8 w-8 rounded border-2 border-slate-200 hover:border-slate-400 transition-colors"
                    style={{ backgroundColor: item.color }}
                    onClick={() => applyColor(item.color)}
                    title={item.name}
                  />
                ))}
              </div>
              
              <div className="border-t pt-3">
                <Label className="text-xs font-semibold">Couleur personnalisée</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    placeholder="#000000"
                    className="h-8 text-xs flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="h-8"
                    onClick={() => applyColor(customColor)}
                  >
                    Appliquer
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-1">Format: #RRGGBB</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="border-l mx-1" />
        
        {/* Tailles de police */}
        <select
          className="h-8 px-2 rounded border text-xs bg-white"
          onChange={(e) => {
            if (e.target.value) {
              applyFormat('fontSize', e.target.value);
              e.target.value = '';
            }
          }}
          defaultValue=""
        >
          <option value="">Taille</option>
          <option value="1">Très petit</option>
          <option value="2">Petit</option>
          <option value="3">Normal</option>
          <option value="4">Grand</option>
          <option value="5">Très grand</option>
          <option value="6">Énorme</option>
        </select>
      </div>
      
      {/* Éditeur WYSIWYG */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="w-full px-3 py-2 rounded-md border text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
        suppressContentEditableWarning
      />
      
      <p className="text-xs text-slate-500 mt-1">
        Sélectionnez du texte et utilisez les boutons pour le formater
      </p>
    </div>
  );
}
