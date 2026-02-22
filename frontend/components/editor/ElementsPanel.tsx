'use client';

import { useEditorStore } from '@/lib/stores/editor-store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Layers, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import { ELEMENT_CATEGORIES } from './elements/element-categories';
import { LAYOUT_TEMPLATES } from './elements/layout-templates';
import { getDefaultStyles, getDefaultContent } from './elements/element-defaults';

const ELEMENT_TYPES = [];

export function ElementsPanel() {
  const { addElement, elements, selectElement, selectedElementId, updateElement, toggleElementLock, toggleElementVisibility } = useEditorStore();
  const [activeTab, setActiveTab] = useState<'elements' | 'templates' | 'calques'>('elements');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState('');
  const [collapsedLayers, setCollapsedLayers] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('editor-collapsedLayers');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });

  const handleAddElement = (type: string, tag: string, label: string) => {
    const newElement = {
      id: `${type}-${Date.now()}`,
      type,
      tag,
      content: getDefaultContent(type, label),
      styles: {
        desktop: getDefaultStyles(type),
      },
      children: [],
      ...(type === 'responsive-header' && {
        menuItems: [
          { id: 'menu-1', label: 'Accueil', href: '#' },
          { id: 'menu-2', label: 'Services', href: '#services' },
          { id: 'menu-3', label: 'À propos', href: '#about' },
          { id: 'menu-4', label: 'Contact', href: '#contact' },
        ],
      }),
    };

    // Les sections sont toujours ajoutées à la racine
    if (type === 'section') {
      addElement(newElement);
    } else {
      // Pour les autres éléments, on les ajoute à la racine pour l'instant
      // TODO: Implémenter le drag & drop pour choisir le parent
      addElement(newElement);
    }
  };

  const getDefaultContent = (type: string) => getDefaultContent(type);

  const getDefaultStyles = (type: string) => getDefaultStyles(type);

  const handleAddLayout = (template: any) => {
    const generateIds = (element: any): any => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 9);
      return {
        ...element,
        id: `${element.type}-${timestamp}-${random}`,
        children: element.children?.map(generateIds) || [],
      };
    };
    
    const newLayout = generateIds(template);
    addElement(newLayout);
  };

  const filteredCategories = ELEMENT_CATEGORIES.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  const handleNameDoubleClick = (element: any) => {
    setEditingNameId(element.id);
    setEditingNameValue(element.name || element.type);
  };

  const handleNameBlur = (elementId: string, originalName: string) => {
    if (editingNameValue && editingNameValue !== originalName) {
      updateElement(elementId, { name: editingNameValue });
    }
    setEditingNameId(null);
  };

  const renderLayersTree = (items: any[], depth = 0, parentLocked = false, parentHidden = false) => {
    return items.map((item) => {
      const originalName = item.name || item.type;
      const hasChildren = item.children?.length > 0;
      const isCollapsed = collapsedLayers.has(item.id);
      const isLocked = item.isLocked || parentLocked;
      const isHidden = item.isHidden || parentHidden;
      
      return (
        <div key={item.id}>
          <div 
            className={`flex items-center gap-1 py-1.5 px-2 rounded group ${
              selectedElementId === item.id ? 'bg-blue-50 border-l-2 border-blue-500' : 'hover:bg-slate-100'
            }`}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
          >
            {/* Chevron pour expand/collapse */}
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCollapsedLayers(prev => {
                    const next = new Set(prev);
                    if (next.has(item.id)) {
                      next.delete(item.id);
                    } else {
                      next.add(item.id);
                    }
                    // Sauvegarder dans localStorage
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('editor-collapsedLayers', JSON.stringify([...next]));
                    }
                    return next;
                  });
                }}
                className="flex-shrink-0 hover:bg-slate-200 rounded p-0.5"
              >
                <ChevronRight className={`h-3 w-3 text-slate-600 transition-transform ${
                  isCollapsed ? '' : 'rotate-90'
                }`} />
              </button>
            ) : (
              <div className="w-4" />
            )}
            
            {/* Icône type */}
            <Layers className="h-3 w-3 text-slate-400 flex-shrink-0" />
            
            {/* Nom éditable */}
            <div 
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() => {
                if (!isLocked) {
                  selectElement(item.id);
                }
              }}
            >
              {editingNameId === item.id ? (
                <Input
                  value={editingNameValue}
                  onChange={(e) => setEditingNameValue(e.target.value)}
                  onBlur={() => handleNameBlur(item.id, originalName)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNameBlur(item.id, originalName);
                    if (e.key === 'Escape') {
                      setEditingNameId(null);
                      setEditingNameValue('');
                    }
                  }}
                  className="h-6 text-xs px-2"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  disabled={isLocked}
                />
              ) : (
                <span 
                  className="text-xs truncate select-none block"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (!isLocked) {
                      handleNameDoubleClick(item);
                    }
                  }}
                >
                  {item.name || item.type}
                  {parentLocked && item.isLocked !== true && (
                    <span className="text-[10px] ml-1 text-slate-400">(hérité)</span>
                  )}
                  {parentHidden && item.isHidden !== true && (
                    <span className="text-[10px] ml-1 text-slate-400">(hérité)</span>
                  )}
                </span>
              )}
            </div>
            
            {/* Actions: Lock & Visibility */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!parentHidden) {
                    toggleElementVisibility(item.id);
                  }
                }}
                className="p-1 hover:bg-slate-200 rounded"
                title={parentHidden ? 'Parent caché' : (isHidden ? 'Afficher' : 'Masquer')}
                disabled={parentHidden}
              >
                {isHidden ? (
                  <svg className={`h-3 w-3 ${parentHidden ? 'text-slate-300' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className={`h-3 w-3 ${parentHidden ? 'text-slate-300' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!parentLocked) {
                    toggleElementLock(item.id);
                  }
                }}
                className="p-1 hover:bg-slate-200 rounded"
                title={parentLocked ? 'Parent verrouillé' : (isLocked ? 'Déverrouiller' : 'Verrouiller')}
                disabled={parentLocked}
              >
                {isLocked ? (
                  <svg className={`h-3 w-3 ${parentLocked ? 'text-red-300' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z" />
                  </svg>
                ) : (
                  <svg className={`h-3 w-3 ${parentLocked ? 'text-slate-300' : 'text-slate-400'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C9.243 2 7 4.243 7 7v2H6c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v2H9V7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {hasChildren && !isCollapsed && renderLayersTree(item.children, depth + 1, isLocked, isHidden)}
        </div>
      );
    });
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-r border-slate-200 flex flex-col items-center py-4 transition-all duration-300">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="mb-4"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col transition-all duration-300">
      {/* Header avec bouton collapse */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200">
        <h3 className="font-semibold text-sm">Éléments</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(true)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('elements')}
          className={`flex-1 py-2 text-xs font-medium ${
            activeTab === 'elements'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Elements
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-2 text-xs font-medium ${
            activeTab === 'templates'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab('calques')}
          className={`flex-1 py-2 text-xs font-medium ${
            activeTab === 'calques'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Calques
        </button>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
        {activeTab === 'elements' ? (
          <div className="p-3">
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search elements"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>

            {/* Accordions */}
            <Accordion type="multiple" defaultValue={['structure', 'basic', 'typography']} className="w-full">
              {filteredCategories.map((category) => (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="text-xs font-semibold uppercase py-2">
                    {category.label}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-1">
                      {category.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={item.type}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('elementType', item.type);
                              e.dataTransfer.setData('elementTag', item.tag);
                            }}
                            className="cursor-move group"
                          >
                            <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100 transition">
                              <Icon className="h-4 w-4 text-slate-600" />
                              <span className="text-sm flex-1">{item.label}</span>
                              {item.isNew && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-green-500 text-white rounded font-medium">NEW</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : activeTab === 'templates' ? (
          <div className="p-3">
            <Accordion type="multiple" defaultValue={['Header', 'Hero', 'Features', 'Contact', 'CTA', 'Footer']} className="w-full">
              {Object.entries(
                LAYOUT_TEMPLATES.reduce((acc, layout) => {
                  if (!acc[layout.category]) acc[layout.category] = [];
                  acc[layout.category].push(layout);
                  return acc;
                }, {} as Record<string, typeof LAYOUT_TEMPLATES>)
              ).map(([category, layouts]) => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger className="text-xs font-semibold uppercase py-2">
                    {category}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {layouts.map((layout) => {
                        const Icon = layout.icon;
                        return (
                          <div
                            key={layout.id}
                            onClick={() => handleAddLayout(layout.template)}
                            className="p-3 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="h-4 w-4 text-blue-600" />
                              <div className="text-sm font-medium">{layout.label}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : (
          <div className="p-4">
            {elements.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                Aucun élément sur la page
              </p>
            ) : (
              renderLayersTree(elements)
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
