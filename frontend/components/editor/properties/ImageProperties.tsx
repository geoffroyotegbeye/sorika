'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useRef, useState } from 'react';

interface ImagePropertiesProps {
  element: any;
  styles: any;
  onUpdate: (updates: any) => void;
  onStyleChange: (property: string, value: string) => void;
}

export function ImageProperties({ element, styles, onUpdate, onStyleChange }: ImagePropertiesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [unit, setUnit] = useState('rem');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({
          attributes: { ...element.attributes, src: reader.result as string }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Image</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Télécharger une image
        </Button>
      </div>

      <div className="space-y-2">
        <Label>URL de l'image</Label>
        <Input
          value={element.attributes?.src || ''}
          onChange={(e) => onUpdate({
            attributes: { ...element.attributes, src: e.target.value }
          })}
          placeholder="https://..."
        />
      </div>

      {element.attributes?.src && (
        <div className="space-y-2">
          <Label>Aperçu</Label>
          <div className="relative border rounded-md overflow-hidden">
            <img
              src={element.attributes.src}
              alt="Aperçu"
              className="w-full h-32 object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => onUpdate({
                attributes: { ...element.attributes, src: '' }
              })}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Texte alternatif</Label>
        <Input
          value={element.attributes?.alt || ''}
          onChange={(e) => onUpdate({
            attributes: { ...element.attributes, alt: e.target.value }
          })}
          placeholder="Description de l'image"
        />
      </div>

      <div className="space-y-2">
        <Label>Ajustement de l'image</Label>
        <select
          className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm"
          value={styles.objectFit || 'cover'}
          onChange={(e) => onStyleChange('objectFit', e.target.value)}
        >
          <option value="cover">Couvrir</option>
          <option value="contain">Contenir</option>
          <option value="fill">Remplir</option>
          <option value="none">Aucun</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label>Alignement</Label>
        <div className="grid grid-cols-3 gap-1">
          <Button
            variant={(styles.display === 'block' && styles.marginLeft === '0' && styles.marginRight === 'auto') ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              onStyleChange('display', 'block');
              onStyleChange('marginLeft', '0');
              onStyleChange('marginRight', 'auto');
            }}
            className="text-xs flex items-center justify-center gap-1"
          >
            <AlignLeft className="h-3 w-3" />
            Gauche
          </Button>
          <Button
            variant={(styles.display === 'block' && styles.marginLeft === 'auto' && styles.marginRight === 'auto') ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              onStyleChange('display', 'block');
              onStyleChange('marginLeft', 'auto');
              onStyleChange('marginRight', 'auto');
            }}
            className="text-xs flex items-center justify-center gap-1"
          >
            <AlignCenter className="h-3 w-3" />
            Centre
          </Button>
          <Button
            variant={(styles.display === 'block' && styles.marginLeft === 'auto' && styles.marginRight === '0') ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              onStyleChange('display', 'block');
              onStyleChange('marginLeft', 'auto');
              onStyleChange('marginRight', '0');
            }}
            className="text-xs flex items-center justify-center gap-1"
          >
            <AlignRight className="h-3 w-3" />
            Droite
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Dimensions</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="h-7 px-2 rounded border text-xs bg-white"
          >
            <option value="rem">rem</option>
            <option value="px">px</option>
            <option value="%">%</option>
            <option value="em">em</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-slate-500">Largeur</Label>
            <Input
              type="number"
              value={parseInt(styles.width) || ''}
              onChange={(e) => onStyleChange('width', e.target.value ? `${e.target.value}${unit}` : '')}
              placeholder="100"
              className="h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-500">Hauteur</Label>
            <Input
              type="number"
              value={parseInt(styles.height) || ''}
              onChange={(e) => onStyleChange('height', e.target.value ? `${e.target.value}${unit}` : '')}
              placeholder="auto"
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
