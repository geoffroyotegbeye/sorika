'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center space-x-1 text-sm', className)} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const Icon = item.icon;

        return (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-slate-400 mx-1" />
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors"
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span
                className={cn(
                  'flex items-center gap-1.5',
                  isLast ? 'text-slate-900 font-medium' : 'text-slate-500'
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
