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
  const { elements, updateElement, updateElementStyles } = useEditorStore();

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
  const listType = element.attributes?.listType || 'ul';
  const listStyle = element.attributes?.listStyle || 'disc';

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

  const handleTypeChange = (type: string) => {
    updateElement(elementId, {
      attributes: { ...element.attributes, listType: type },
      tag: type
    });
  };

  const handleStyleChange = (style: string) => {
    updateElement(elementId, {
      attributes: { ...element.attributes, listStyle: style }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs">Type de liste</Label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          <Button
            variant={listType === 'ul' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTypeChange('ul')}
            className="text-xs"
          >
            • Puces
          </Button>
          <Button
            variant={listType === 'ol' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTypeChange('ol')}
            className="text-xs"
          >
            1. Numéros
          </Button>
          <Button
            variant={listType === 'ul' && listStyle === 'none' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              handleTypeChange('ul');
              handleStyleChange('none');
            }}
            className="text-xs"
          >
            Sans
          </Button>
        </div>
      </div>

      {listType === 'ul' && listStyle !== 'none' && (
        <div>
          <Label className="text-xs">Style des puces</Label>
          <select
            className="w-full h-9 px-3 rounded-md border text-sm mt-1"
            value={listStyle}
            onChange={(e) => handleStyleChange(e.target.value)}
          >
            <option value="disc">● Disque</option>
            <option value="circle">○ Cercle</option>
            <option value="square">■ Carré</option>
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
