'use client';

import { useEditorStore, MenuItem } from '@/lib/stores/editor-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

export function ResponsiveHeaderProperties() {
  const { selectedElementId, elements, updateElement } = useEditorStore();

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

  const element = selectedElementId ? findElement(elements, selectedElementId) : null;
  if (!element || element.type !== 'responsive-header') return null;

  const menuItems = element.menuItems || [];

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: `menu-${Date.now()}`,
      label: 'Nouveau lien',
      href: '#',
    };
    updateElement(element.id, {
      menuItems: [...menuItems, newItem],
    });
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    const updated = menuItems.map((item: MenuItem) =>
      item.id === id ? { ...item, ...updates } : item
    );
    updateElement(element.id, { menuItems: updated });
  };

  const deleteMenuItem = (id: string) => {
    const updated = menuItems.filter((item: MenuItem) => item.id !== id);
    updateElement(element.id, { menuItems: updated });
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Items de menu</Label>
          <Button size="sm" variant="outline" onClick={addMenuItem}>
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>

        <div className="space-y-3">
          {menuItems.map((item: MenuItem) => (
            <div key={item.id} className="p-3 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Item de menu</Label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteMenuItem(item.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              
              <div>
                <Label className="text-xs">Texte</Label>
                <Input
                  value={item.label}
                  onChange={(e) => updateMenuItem(item.id, { label: e.target.value })}
                  placeholder="Accueil"
                />
              </div>

              <div>
                <Label className="text-xs">Lien</Label>
                <Input
                  value={item.href}
                  onChange={(e) => updateMenuItem(item.id, { href: e.target.value })}
                  placeholder="#section"
                />
              </div>
            </div>
          ))}

          {menuItems.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-4">
              Aucun item de menu. Cliquez sur Ajouter.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
