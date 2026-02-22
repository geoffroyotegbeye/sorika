'use client';

import { useEffect, useState } from 'react';

interface MobileMenuToggleProps {
  children: React.ReactNode;
  currentBreakpoint: 'desktop' | 'tablet' | 'mobile';
}

export function MobileMenuToggle({ children, currentBreakpoint }: MobileMenuToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Fermer le menu quand on change de breakpoint
  useEffect(() => {
    setIsOpen(false);
  }, [currentBreakpoint]);

  // Ajouter un gestionnaire de clic pour le bouton hamburger et le menu
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Si c'est le bouton hamburger (☰)
      if (target.tagName === 'BUTTON' && target.textContent === '☰') {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(prev => !prev);
        return;
      }
      
      // Si on clique en dehors du menu, le fermer
      if (isOpen && !target.closest('nav')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [isOpen]);

  // Injecter le style pour afficher/masquer le menu mobile
  useEffect(() => {
    if (currentBreakpoint === 'mobile' && isOpen) {
      const style = document.createElement('style');
      style.id = 'mobile-menu-override';
      style.textContent = `
        nav[style*="display: none"] {
          display: flex !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        const existingStyle = document.getElementById('mobile-menu-override');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, [isOpen, currentBreakpoint]);

  return <>{children}</>;
}
