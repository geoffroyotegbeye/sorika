'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ColorPicker } from './ColorPicker';
import { Upload } from 'lucide-react';
import { useState, useRef } from 'react';

interface BackgroundSectionProps {
  styles: any;
  onStyleChange: (property: string, value: string) => void;
}

export function BackgroundSection({ styles, onStyleChange }: BackgroundSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUrl = (url: string) => {
    if (url) {
      onStyleChange('backgroundImage', `url(${url})`);
    } else {
      onStyleChange('backgroundImage', '');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        handleImageUrl(dataUrl);
      };
      reader.readAsDataURL(file);
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="w-full gap-2"
          >
            <Upload className="h-4 w-4" />
            Charger depuis l'ordinateur
          </Button>
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
