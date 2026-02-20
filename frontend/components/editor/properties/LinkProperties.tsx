import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditorStore } from '@/lib/stores/editor-store';
import { useState, useEffect } from 'react';

interface LinkPropertiesProps {
  elementId: string;
}

const findElementById = (el: any, id: string): any => {
  if (el.id === id) return el;
  if (el.children) {
    for (const child of el.children) {
      const found = findElementById(child, id);
      if (found) return found;
    }
  }
  return null;
};

export function LinkProperties({ elementId }: LinkPropertiesProps) {
  const { elements, updateElement } = useEditorStore();
  const element = elements.find(el => el.id === elementId) || 
                  elements.flatMap(el => findElementById(el, elementId)).find(Boolean);

  const [linkType, setLinkType] = useState<'anchor' | 'internal' | 'external'>('anchor');
  const [href, setHref] = useState('');

  useEffect(() => {
    if (element?.attributes?.href) {
      const currentHref = element.attributes.href;
      if (currentHref.startsWith('#')) {
        setLinkType('anchor');
      } else if (currentHref.startsWith('http')) {
        setLinkType('external');
      } else {
        setLinkType('internal');
      }
      setHref(currentHref);
    }
  }, [element]);

  const handleLinkTypeChange = (type: 'anchor' | 'internal' | 'external') => {
    setLinkType(type);
    let newHref = '';
    
    if (type === 'anchor') {
      newHref = '#';
    } else if (type === 'internal') {
      newHref = '/';
    } else {
      newHref = 'https://';
    }
    
    setHref(newHref);
    updateElement(elementId, {
      attributes: { ...element?.attributes, href: newHref, linkType: type }
    });
  };

  const handleHrefChange = (value: string) => {
    setHref(value);
    updateElement(elementId, {
      attributes: { ...element?.attributes, href: value, linkType }
    });
  };

  // Récupérer toutes les sections avec ID pour les ancres
  const getSections = () => {
    const sections: { id: string; name: string }[] = [];
    const traverse = (el: any) => {
      if (el.type === 'section' && el.id) {
        sections.push({ id: el.id, name: el.name || el.id });
      }
      if (el.children) {
        el.children.forEach(traverse);
      }
    };
    elements.forEach(traverse);
    return sections;
  };

  const sections = getSections();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Type de lien</Label>
        <Select value={linkType} onValueChange={handleLinkTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="anchor">Ancre (scroll vers section)</SelectItem>
            <SelectItem value="internal">Page interne</SelectItem>
            <SelectItem value="external">URL externe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {linkType === 'anchor' && (
        <div className="space-y-2">
          <Label>Section cible</Label>
          {sections.length > 0 ? (
            <Select value={href} onValueChange={handleHrefChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map(section => (
                  <SelectItem key={section.id} value={`#${section.id}`}>
                    {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-slate-500">Aucune section disponible. Ajoutez des sections avec des IDs.</p>
          )}
          <Input
            value={href}
            onChange={(e) => handleHrefChange(e.target.value)}
            placeholder="#section-id"
            className="mt-2"
          />
        </div>
      )}

      {linkType === 'internal' && (
        <div className="space-y-2">
          <Label>Chemin de la page</Label>
          <Input
            value={href}
            onChange={(e) => handleHrefChange(e.target.value)}
            placeholder="/about"
          />
          <p className="text-xs text-slate-500">
            Exemple: /about, /contact, /services
          </p>
        </div>
      )}

      {linkType === 'external' && (
        <div className="space-y-2">
          <Label>URL complète</Label>
          <Input
            value={href}
            onChange={(e) => handleHrefChange(e.target.value)}
            placeholder="https://example.com"
          />
          <p className="text-xs text-slate-500">
            Le lien s'ouvrira dans un nouvel onglet
          </p>
        </div>
      )}
    </div>
  );
}
