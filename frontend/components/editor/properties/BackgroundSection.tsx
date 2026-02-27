'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ColorPicker } from './ColorPicker';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { useState, useRef } from 'react';

interface BackgroundSectionProps {
  styles: any;
  onStyleChange: (property: string, value: string) => void;
  companyId?: string;
}

export function BackgroundSection({ styles, onStyleChange, companyId }: BackgroundSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [medias, setMedias] = useState<any[]>([]);

  const handleImageUrl = (url: string) => {
    if (url) {
      onStyleChange('backgroundImage', `url(${url})`);
    } else {
      onStyleChange('backgroundImage', '');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        handleImageUrl(`http://localhost:3001${media.url}`);
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
        setMedias(data.filter((m: any) => m.mimetype.startsWith('image/')));
        setShowMediaLibrary(true);
      }
    } catch (error) {
      console.error('Erreur chargement médias:', error);
    }
  };

  const extractUrl = (bgImage: string) => {
    if (!bgImage) return '';
    const match = bgImage.match(/url\(['"]?([^'"\)]+)['"]?\)/);
    return match ? match[1] : bgImage;
  };

  return (
    <div className="space-y-4">
      {/* Couleur de fond */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs">Couleur de fond</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onStyleChange('backgroundColor', 'transparent')}
            className="h-6 text-xs"
          >
            Sans fond
          </Button>
        </div>
        <ColorPicker
          value={styles.backgroundColor || '#ffffff'}
          onChange={(val) => onStyleChange('backgroundColor', val)}
        />
      </div>

      {/* Upload d'image */}
      <div>
        <Label className="text-xs mb-2 block">Image de fond</Label>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || !companyId}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? 'Upload...' : 'Upload'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadMedias}
              disabled={!companyId}
              className="gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              Bibliothèque
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Input
            type="text"
            value={extractUrl(styles.backgroundImage || '')}
            onChange={(e) => handleImageUrl(e.target.value)}
            placeholder="Ou coller une URL"
            className="h-9 text-xs"
          />
        </div>
      </div>

      {showMediaLibrary && (
        <div className="border rounded-lg p-3 space-y-2 max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Sélectionner une image</Label>
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
          <div className="grid grid-cols-3 gap-2">
            {medias.map((media) => (
              <button
                key={media.id}
                type="button"
                onClick={() => {
                  handleImageUrl(`http://localhost:3001${media.url}`);
                  setShowMediaLibrary(false);
                }}
                className="border rounded overflow-hidden hover:border-blue-500 transition-colors"
              >
                <img
                  src={`http://localhost:3001${media.url}`}
                  alt={media.filename}
                  className="w-full h-16 object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {styles.backgroundImage && (
        <>
          <div>
            <Label className="text-xs">Taille</Label>
            <select
              className="w-full h-9 px-3 rounded-md border text-sm mt-1"
              value={styles.backgroundSize || 'cover'}
              onChange={(e) => onStyleChange('backgroundSize', e.target.value)}
            >
              <option value="cover">Couvrir</option>
              <option value="contain">Contenir</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <Label className="text-xs">Position</Label>
            <select
              className="w-full h-9 px-3 rounded-md border text-sm mt-1"
              value={styles.backgroundPosition || 'center'}
              onChange={(e) => onStyleChange('backgroundPosition', e.target.value)}
            >
              <option value="center">Centre</option>
              <option value="top">Haut</option>
              <option value="bottom">Bas</option>
              <option value="left">Gauche</option>
              <option value="right">Droite</option>
            </select>
          </div>

          <div>
            <Label className="text-xs">Répétition</Label>
            <select
              className="w-full h-9 px-3 rounded-md border text-sm mt-1"
              value={styles.backgroundRepeat || 'no-repeat'}
              onChange={(e) => onStyleChange('backgroundRepeat', e.target.value)}
            >
              <option value="no-repeat">Aucune</option>
              <option value="repeat">Répéter</option>
              <option value="repeat-x">Répéter X</option>
              <option value="repeat-y">Répéter Y</option>
            </select>
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onStyleChange('backgroundImage', '');
              onStyleChange('backgroundSize', '');
              onStyleChange('backgroundPosition', '');
              onStyleChange('backgroundRepeat', '');
            }}
            className="w-full text-red-600"
          >
            Supprimer l'image
          </Button>
        </>
      )}
    </div>
  );
}
