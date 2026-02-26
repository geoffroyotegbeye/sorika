'use client';

import { useEditorStore } from '@/lib/stores/editor-store';
import { useEffect, useRef } from 'react';

export function IframeCanvas() {
  const { elements, selectedElementId, currentBreakpoint } = useEditorStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (!iframeDoc) return;

    // Injecter le HTML complet avec PageRenderer
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: system-ui, -apple-system, sans-serif; }
            [data-element-id="${selectedElementId}"] {
              outline: 2px solid #3b82f6 !important;
              outline-offset: 2px;
            }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="module">
            window.elements = ${JSON.stringify(elements)};
            window.selectedElementId = ${JSON.stringify(selectedElementId)};
          </script>
        </body>
      </html>
    `);
    iframeDoc.close();
  }, [elements, selectedElementId]);

  const getWidth = () => {
    if (currentBreakpoint === 'mobile') return '375px';
    if (currentBreakpoint === 'tablet') return '768px';
    return '100%';
  };

  return (
    <div className="flex-1 bg-slate-100 overflow-auto flex items-start justify-center p-8">
      <iframe
        ref={iframeRef}
        className="bg-white shadow-lg"
        style={{
          width: getWidth(),
          minHeight: '100vh',
          border: 'none',
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );
}
