'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { useRef } from 'react';

interface VideoPropertiesProps {
  element: any;
  styles: any;
  onUpdate: (updates: any) => void;
  onStyleChange: (property: string, value: string) => void;
}

export function VideoProperties({ element, styles, onUpdate, onStyleChange }: VideoPropertiesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <Label>Vidéo</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Télécharger une vidéo
        </Button>
      </div>

      <div className="space-y-2">
        <Label>URL de la vidéo</Label>
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
          <div className="relative border rounded-md overflow-hidden bg-black">
            <video
              src={element.attributes.src}
              className="w-full h-32 object-cover"
              controls
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
        <Label>Image de couverture (poster)</Label>
        <Input
          value={element.attributes?.poster || ''}
          onChange={(e) => onUpdate({
            attributes: { ...element.attributes, poster: e.target.value }
          })}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label>Options</Label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={element.attributes?.autoplay || false}
              onChange={(e) => onUpdate({
                attributes: { ...element.attributes, autoplay: e.target.checked }
              })}
              className="rounded"
            />
            Lecture automatique
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={element.attributes?.loop || false}
              onChange={(e) => onUpdate({
                attributes: { ...element.attributes, loop: e.target.checked }
              })}
              className="rounded"
            />
            Boucle
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={element.attributes?.muted || false}
              onChange={(e) => onUpdate({
                attributes: { ...element.attributes, muted: e.target.checked }
              })}
              className="rounded"
            />
            Muet
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={element.attributes?.controls !== false}
              onChange={(e) => onUpdate({
                attributes: { ...element.attributes, controls: e.target.checked }
              })}
              className="rounded"
            />
            Afficher les contrôles
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Ajustement de la vidéo</Label>
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
        <Label>Dimensions</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-slate-500">Largeur</Label>
            <Input
              value={styles.width || ''}
              onChange={(e) => onStyleChange('width', e.target.value)}
              placeholder="100%"
              className="h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-500">Hauteur</Label>
            <Input
              value={styles.height || ''}
              onChange={(e) => onStyleChange('height', e.target.value)}
              placeholder="auto"
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Bordure arrondie</Label>
        <div className="flex gap-1">
          {['0px', '4px', '8px', '16px'].map((radius) => (
            <Button
              key={radius}
              variant={styles.borderRadius === radius ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStyleChange('borderRadius', radius)}
              className="text-xs flex-1"
            >
              {radius}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
