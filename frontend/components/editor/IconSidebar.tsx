'use client';

import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconSidebarProps {
  onPagesClick: () => void;
}

export function IconSidebar({ onPagesClick }: IconSidebarProps) {
  return (
    <div className="w-14 bg-slate-900 flex flex-col items-center py-4 gap-2 relative z-50">
      <button
        onClick={onPagesClick}
        className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-slate-400 hover:bg-slate-800 hover:text-white"
        title="Pages"
      >
        <FileText className="w-5 h-5" />
      </button>
    </div>
  );
}
