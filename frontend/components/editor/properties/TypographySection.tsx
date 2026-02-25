'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ColorPicker } from './ColorPicker';
import { RichTextEditor } from './RichTextEditor';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { useState } from 'react';

interface TypographySectionProps {
  styles: any;
  content?: string;
  onStyleChange: (property: string, value: string) => void;
  onContentChange?: (value: string) => void;
}

export function TypographySection({ styles, content, onStyleChange, onContentChange }: TypographySectionProps) {
  const [unit, setUnit] = useState('px');

  const parseValue = (value: string) => {
    if (!value) return 16;
    return parseInt(value) || 16;
  };

  const handleFontSizeChange = (numValue: string) => {
    const val = numValue === '' ? '16' : numValue;
    onStyleChange('fontSize', `${val}${unit}`);
  };

  return (
    <div className="space-y-4">
      {content !== undefined && onContentChange && (
        <RichTextEditor content={content} onContentChange={onContentChange} />
      )}

      {/* Unit Selector */}
      <div className="flex items-center gap-2">
        <Label className="text-xs text-slate-500">Unité:</Label>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="h-7 px-2 rounded border text-xs bg-white"
        >
          <option value="px">px</option>
          <option value="rem">rem</option>
          <option value="em">em</option>
        </select>
      </div>

      <div>
        <Label className="text-xs">Font Family</Label>
        <select
          className="w-full h-9 px-3 rounded-md border text-sm mt-1"
          value={styles.fontFamily || 'inherit'}
          onChange={(e) => onStyleChange('fontFamily', e.target.value)}
        >
          <option value="inherit">Inherit</option>
          <option value="Inter, sans-serif">Inter</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="'Courier New', monospace">Courier New</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Size</Label>
          <Input
            type="number"
            value={parseValue(styles.fontSize)}
            onChange={(e) => handleFontSizeChange(e.target.value)}
            className="h-8 text-xs mt-1"
            min="8"
          />
        </div>
        <div>
          <Label className="text-xs">Weight</Label>
          <select
            className="w-full h-8 px-2 rounded-md border text-xs mt-1"
            value={styles.fontWeight || '400'}
            onChange={(e) => onStyleChange('fontWeight', e.target.value)}
          >
            <option value="300">Light</option>
            <option value="400">Regular</option>
            <option value="500">Medium</option>
            <option value="600">Semibold</option>
            <option value="700">Bold</option>
            <option value="800">Extra Bold</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Line Height</Label>
          <Input
            type="number"
            value={parseFloat(styles.lineHeight) || 1.5}
            onChange={(e) => onStyleChange('lineHeight', e.target.value)}
            step="0.1"
            min="0.5"
            className="h-8 text-xs mt-1"
          />
        </div>
        <div>
          <Label className="text-xs">Letter Spacing</Label>
          <Input
            type="number"
            value={parseInt(styles.letterSpacing) || 0}
            onChange={(e) => onStyleChange('letterSpacing', `${e.target.value}px`)}
            className="h-8 text-xs mt-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs mb-2 block">Text Align</Label>
        <div className="grid grid-cols-4 gap-1">
          {[
            { value: 'left', icon: AlignLeft },
            { value: 'center', icon: AlignCenter },
            { value: 'right', icon: AlignRight },
            { value: 'justify', icon: AlignJustify },
          ].map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.value}
                variant={styles.textAlign === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onStyleChange('textAlign', option.value)}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>
      </div>

      <ColorPicker
        label="Color"
        value={styles.color || '#000000'}
        onChange={(val) => onStyleChange('color', val)}
      />

      <div>
        <Label className="text-xs">Text Decoration</Label>
        <select
          className="w-full h-9 px-3 rounded-md border text-sm mt-1"
          value={styles.textDecoration || 'none'}
          onChange={(e) => onStyleChange('textDecoration', e.target.value)}
        >
          <option value="none">None</option>
          <option value="underline">Underline</option>
          <option value="line-through">Line Through</option>
          <option value="overline">Overline</option>
        </select>
      </div>

      <div>
        <Label className="text-xs">Text Transform</Label>
        <select
          className="w-full h-9 px-3 rounded-md border text-sm mt-1"
          value={styles.textTransform || 'none'}
          onChange={(e) => onStyleChange('textTransform', e.target.value)}
        >
          <option value="none">None</option>
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="capitalize">Capitalize</option>
        </select>
      </div>

      <div>
        <Label className="text-xs">List Style</Label>
        <select
          className="w-full h-9 px-3 rounded-md border text-sm mt-1"
          value={styles.listStyleType || 'disc'}
          onChange={(e) => onStyleChange('listStyleType', e.target.value)}
        >
          <option value="none">None</option>
          <option value="disc">Disc (•)</option>
          <option value="circle">Circle (○)</option>
          <option value="square">Square (■)</option>
          <option value="decimal">Decimal (1, 2, 3)</option>
          <option value="decimal-leading-zero">Decimal Zero (01, 02)</option>
          <option value="lower-alpha">Lower Alpha (a, b, c)</option>
          <option value="upper-alpha">Upper Alpha (A, B, C)</option>
          <option value="lower-roman">Lower Roman (i, ii, iii)</option>
          <option value="upper-roman">Upper Roman (I, II, III)</option>
        </select>
      </div>

      <div>
        <Label className="text-xs">List Position</Label>
        <select
          className="w-full h-9 px-3 rounded-md border text-sm mt-1"
          value={styles.listStylePosition || 'outside'}
          onChange={(e) => onStyleChange('listStylePosition', e.target.value)}
        >
          <option value="outside">Outside</option>
          <option value="inside">Inside</option>
        </select>
      </div>
    </div>
  );
}
