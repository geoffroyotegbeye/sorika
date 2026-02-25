'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useEditorStore } from '@/lib/stores/editor-store';

interface InputPropertiesProps {
  elementId: string;
  elementType: string;
}

export function InputProperties({ elementId, elementType }: InputPropertiesProps) {
  const { elements, updateElement } = useEditorStore();

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

  const attributes = element.attributes || {};

  const handleChange = (key: string, value: string | boolean) => {
    updateElement(elementId, {
      attributes: { ...attributes, [key]: value }
    });
  };

  return (
    <div className="space-y-4">
      {elementType === 'input' && (
        <div>
          <Label className="text-xs">Type</Label>
          <select
            className="w-full h-9 px-3 rounded-md border text-sm mt-1"
            value={attributes.type || 'text'}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="password">Password</option>
            <option value="number">Number</option>
            <option value="tel">Tel</option>
            <option value="url">URL</option>
            <option value="date">Date</option>
          </select>
        </div>
      )}

      {(elementType === 'input' || elementType === 'textarea') && (
        <div>
          <Label className="text-xs">Placeholder</Label>
          <Input
            value={attributes.placeholder || ''}
            onChange={(e) => handleChange('placeholder', e.target.value)}
            placeholder="Entrez du texte..."
            className="h-9 text-xs mt-1"
          />
        </div>
      )}

      <div>
        <Label className="text-xs">Name</Label>
        <Input
          value={attributes.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="field_name"
          className="h-9 text-xs mt-1"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={attributes.required || false}
            onChange={(e) => handleChange('required', e.target.checked)}
            className="w-4 h-4 rounded border-slate-300"
          />
          <span className="text-sm">Champ requis</span>
        </label>
      </div>

      {elementType === 'file-upload' && (
        <div>
          <Label className="text-xs">Accept</Label>
          <Input
            value={attributes.accept || ''}
            onChange={(e) => handleChange('accept', e.target.value)}
            placeholder="image/*,.pdf"
            className="h-9 text-xs mt-1"
          />
        </div>
      )}
    </div>
  );
}
