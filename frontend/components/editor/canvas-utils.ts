export const isLayoutElement = (type: string) => {
  return ['header', 'section', 'container', 'grid', 'vflex', 'hflex', 'div', 'link-block', 'form', 'list', 'navbar', 'responsive-header'].includes(type);
};

export const canContainChildren = (type: string) => {
  return ['header', 'section', 'container', 'grid', 'vflex', 'hflex', 'div', 'link-block', 'form', 'list', 'navbar'].includes(type);
};

export const canAcceptChild = (parentType: string, childType: string) => {
  if (parentType === 'header') {
    return ['container', 'vflex', 'hflex', 'navbar', 'div'].includes(childType);
  }
  
  if (parentType === 'section') {
    return ['container', 'vflex', 'hflex', 'grid', 'div'].includes(childType);
  }
  
  if (['container', 'vflex', 'hflex', 'div'].includes(parentType)) {
    return !['section'].includes(childType);
  }
  
  if (parentType === 'grid') {
    return !['section', 'container'].includes(childType);
  }
  
  if (parentType === 'link-block') {
    return ['heading', 'paragraph', 'text', 'image', 'div', 'vflex', 'hflex'].includes(childType);
  }
  
  if (parentType === 'form') {
    return ['input', 'textarea', 'checkbox', 'file-upload', 'button', 'div', 'vflex', 'hflex'].includes(childType);
  }
  
  if (parentType === 'list') {
    return ['div', 'text', 'text-link'].includes(childType);
  }
  
  if (parentType === 'navbar') {
    return ['link-block', 'text-link', 'button', 'div', 'hflex'].includes(childType);
  }
  
  return false;
};

export const getBreakpointWidth = (breakpoint: 'desktop' | 'tablet' | 'mobile') => {
  switch (breakpoint) {
    case 'mobile':
      return '375px';
    case 'tablet':
      return '768px';
    case 'desktop':
      return '100%';
  }
};

export const findParentElement = (items: any[], parentId: string): any | null => {
  for (const item of items) {
    if (item.id === parentId) return item;
    if (item.children?.length > 0) {
      const found = findParentElement(item.children, parentId);
      if (found) return found;
    }
  }
  return null;
};

export const canMoveElement = (elements: any[], elementId: string, parentId?: string) => {
  let canMoveUp = false;
  let canMoveDown = false;
  
  if (parentId) {
    const parent = findParentElement(elements, parentId);
    if (parent) {
      const index = parent.children.filter(Boolean).findIndex((el: any) => el.id === elementId);
      canMoveUp = index > 0;
      canMoveDown = index < parent.children.filter(Boolean).length - 1;
    }
  } else {
    const index = elements.findIndex(el => el.id === elementId);
    canMoveUp = index > 0;
    canMoveDown = index < elements.length - 1;
  }
  
  return { canMoveUp, canMoveDown };
};
