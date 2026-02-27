'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Video as VideoIcon } from 'lucide-react';
import { useRef, useState } from 'react';

interface VideoPropertiesProps {
  element: any;
  styles: any;
  onUpdate: (updates: any) => void;
  onStyleChange: (property: string, value: string) => void;
  companyId?: string;
}

export function VideoProperties({ element, styles, onUpdate, onStyleChange, companyId }: VideoPropertiesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [unit, setUnit] = useState('px');
  const [isUploading, setIsUploading] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [medias, setMedias] = useState<any[]>([]);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !companyId) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`http://localhost:3001/media/${companyId}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const media = await response.json();
        onUpdate({
          attributes: { ...element.attributes, src: `http://localhost:3001${media.url}` }
        });
      }
    } catch (error) {
      console.error('Erreur upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const loadMedias = async () => {
    if (!companyId) return;
    try {
      const response = await fetch(`http://localhost:3001/media/${companyId}`);
      if (response.ok) {
        const data = await response.json();
        setMedias(data.filter((m: any) => m.mimetype.startsWith('video/')));
        setShowMediaLibrary(true);
      }
    } catch (error) {
      console.error('Erreur chargement médias:', error);
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
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || !companyId}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Upload...' : 'Upload'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={loadMedias}
            disabled={!companyId}
          >
            <VideoIcon className="h-4 w-4 mr-2" />
            Bibliothèque
          </Button>
        </div>
      </div>

      {showMediaLibrary && (
        <div className="border rounded-lg p-3 space-y-2 max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Sélectionner une vidéo</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowMediaLibrary(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {medias.map((media) => (
              <button
                key={media.id}
                type="button"
                onClick={() => {
                  onUpdate({
                    attributes: { ...element.attributes, src: `http://localhost:3001${media.url}` }
                  });
                  setShowMediaLibrary(false);
                }}
                className="border rounded overflow-hidden hover:border-blue-500 transition-colors bg-black"
              >
                <video
                  src={`http://localhost:3001${media.url}`}
                  className="w-full h-16 object-cover"
                />
                <div className="p-1 bg-white">
                  <p className="text-xs truncate">{media.filename}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

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
        <div className="flex items-center justify-between">
          <Label>Dimensions</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="h-7 px-2 rounded border text-xs bg-white"
          >
            <option value="px">px</option>
            <option value="%">%</option>
            <option value="rem">rem</option>
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
