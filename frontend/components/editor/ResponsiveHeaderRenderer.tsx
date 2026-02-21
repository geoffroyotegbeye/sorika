'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface ResponsiveHeaderRendererProps {
  element: any;
  styles: any;
  currentBreakpoint: 'desktop' | 'tablet' | 'mobile';
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
  renderLabel: () => React.ReactNode;
}

export function ResponsiveHeaderRenderer({
  element,
  styles,
  currentBreakpoint,
  isSelected,
  onClick,
  onMouseEnter,
  onMouseLeave,
  renderLabel,
}: ResponsiveHeaderRendererProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuItems = element.menuItems || [];
  const isMobile = currentBreakpoint === 'mobile' || currentBreakpoint === 'tablet';

  return (
    <header
      style={styles}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {renderLabel()}
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Logo */}
        <div style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
          Logo
        </div>

        {/* Desktop Menu */}
        {!isMobile && (
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            {menuItems.map((item: any) => (
              <a
                key={item.id}
                href={item.href}
                style={{
                  color: '#475569',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#3b82f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#475569';
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        {/* Mobile Hamburger */}
        {isMobile && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isMobileMenuOpen ? (
              <X size={24} color="#1e293b" />
            ) : (
              <Menu size={24} color="#1e293b" />
            )}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <nav
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 999,
          }}
        >
          {menuItems.map((item: any) => (
            <a
              key={item.id}
              href={item.href}
              style={{
                color: '#475569',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: '500',
                padding: '8px 0',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
