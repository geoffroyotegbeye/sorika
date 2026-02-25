'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useEditorStore } from '@/lib/stores/editor-store';

interface FormPropertiesProps {
  elementId: string;
}

export function FormProperties({ elementId }: FormPropertiesProps) {
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

  const handleChange = (key: string, value: string) => {
    updateElement(elementId, {
      attributes: { ...attributes, [key]: value }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs">Action URL</Label>
        <Input
          value={attributes.action || ''}
          onChange={(e) => handleChange('action', e.target.value)}
          placeholder="/submit"
          className="h-9 text-xs mt-1"
        />
      </div>

      <div>
        <Label className="text-xs">Method</Label>
        <select
          className="w-full h-9 px-3 rounded-md border text-sm mt-1"
          value={attributes.method || 'post'}
          onChange={(e) => handleChange('method', e.target.value)}
        >
          <option value="get">GET</option>
          <option value="post">POST</option>
        </select>
      </div>
    </div>
  );
}
