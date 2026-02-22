'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/lib/stores/editor-store';
import { codeGenerator } from '@/lib/export/code-generator';
import { reactGenerator } from '@/lib/export/react-generator';
import { useState } from 'react';
import JSZip from 'jszip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ExportButton() {
  const { elements } = useEditorStore();
  const [format, setFormat] = useState<'html' | 'react' | 'tailwind'>('html');

  const handleExport = async () => {
    const zip = new JSZip();

    if (format === 'html') {
      const { html, css, js } = codeGenerator.exportAll(elements);
      zip.file('index.html', html);
      zip.file('styles.css', css);
      zip.file('script.js', js);
    } else if (format === 'react') {
      const component = reactGenerator.generateReactComponent(elements);
      zip.file('Page.tsx', component);
    } else if (format === 'tailwind') {
      const component = reactGenerator.generateTailwindComponent(elements);
      zip.file('Page.tsx', component);
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sorika-export-${format}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={format} onValueChange={(v: any) => setFormat(v)}>
        <SelectTrigger className="w-[140px] h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="html">HTML/CSS/JS</SelectItem>
          <SelectItem value="react">React + CSS</SelectItem>
          <SelectItem value="tailwind">React + Tailwind</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Export
      </Button>
    </div>
  );
}
