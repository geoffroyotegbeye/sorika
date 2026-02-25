'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { useEditorStore } from '@/lib/stores/editor-store';
import { ColorPicker } from './ColorPicker';

interface ListPropertiesProps {
  elementId: string;
}

export function ListProperties({ elementId }: ListPropertiesProps) {
  const { elements, updateElement, updateElementStyles, currentBreakpoint } = useEditorStore();

  const findElement = (items: any[], id: string): any => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children?.length > 0) {
        const found = findElement(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const element = findElement(elements, elementId);
  if (!element) return null;

  const listItems = element.listItems || ['Item 1', 'Item 2', 'Item 3'];
  const currentTag = element.tag || 'ul';
  const currentListStyle = element.styles?.desktop?.listStyleType || 'disc';

  const handleAddItem = () => {
    const newItems = [...listItems, `Item ${listItems.length + 1}`];
    updateElement(elementId, { listItems: newItems });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = listItems.filter((_: any, i: number) => i !== index);
    updateElement(elementId, { listItems: newItems });
  };

  const handleUpdateItem = (index: number, value: string) => {
    const newItems = [...listItems];
    newItems[index] = value;
    updateElement(elementId, { listItems: newItems });
  };

  const handleTypeChange = (type: 'ul' | 'ol', style: string) => {
    updateElement(elementId, { tag: type });
    updateElementStyles(elementId, { listStyleType: style });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs">Type de liste</Label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <Button
            variant={currentTag === 'ul' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTypeChange('ul', 'disc')}
            className="text-xs"
          >
            • Puces
          </Button>
          <Button
            variant={currentTag === 'ol' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTypeChange('ol', 'decimal')}
            className="text-xs"
          >
            1. Numéros
          </Button>
        </div>
      </div>

      {currentTag === 'ul' && (
        <div>
          <Label className="text-xs">Style des puces</Label>
          <select
            className="w-full h-9 px-3 rounded-md border text-sm mt-1"
            value={currentListStyle}
            onChange={(e) => updateElementStyles(elementId, { listStyleType: e.target.value })}
          >
            <option value="none">Sans</option>
            <option value="disc">● Disque</option>
            <option value="circle">○ Cercle</option>
            <option value="square">■ Carré</option>
          </select>
        </div>
      )}

      {currentTag === 'ol' && (
        <div>
          <Label className="text-xs">Style des numéros</Label>
          <select
            className="w-full h-9 px-3 rounded-md border text-sm mt-1"
            value={currentListStyle}
            onChange={(e) => updateElementStyles(elementId, { listStyleType: e.target.value })}
          >
            <option value="decimal">1, 2, 3</option>
            <option value="decimal-leading-zero">01, 02, 03</option>
            <option value="lower-alpha">a, b, c</option>
            <option value="upper-alpha">A, B, C</option>
            <option value="lower-roman">i, ii, iii</option>
            <option value="upper-roman">I, II, III</option>
          </select>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs">Items de la liste</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddItem}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Ajouter
          </Button>
        </div>
        <div className="space-y-2">
          {listItems.map((item: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => handleUpdateItem(index, e.target.value)}
                className="h-8 text-xs flex-1"
                placeholder={`Item ${index + 1}`}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveItem(index)}
                className="h-8 w-8 p-0"
                disabled={listItems.length === 1}
              >
                <Trash2 className="h-3 w-3 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
