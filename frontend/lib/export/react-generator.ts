import { Element } from '../stores/editor-store';
import { Interaction } from '../interactions/types';

export class ReactGenerator {
  private componentCounter = 0;

  generateReactComponent(elements: Element[], componentName = 'Page'): string {
    this.componentCounter = 0;

    const imports = `'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
`;

    const jsx = elements.map(el => this.elementToJSX(el, 2)).join('\n');
    const interactions = this.generateInteractionsCode(elements);

    return `${imports}
export default function ${componentName}() {
  const elementRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
${interactions}
    
    // Menu hamburger
    const hamburgers = document.querySelectorAll('button[aria-label="Menu"]');
    hamburgers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const nav = (btn as HTMLElement).parentElement?.querySelector('nav') as HTMLElement;
        if (nav) {
          nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        }
      });
    });

    return () => {
      // Cleanup
    };
  }, []);

  return (
    <>
${jsx}
    </>
  );
}
`;
  }

  generateTailwindComponent(elements: Element[], componentName = 'Page'): string {
    this.componentCounter = 0;

    const imports = `'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
`;

    const jsx = elements.map(el => this.elementToTailwindJSX(el, 2)).join('\n');
    const interactions = this.generateInteractionsCode(elements);

    return `${imports}
export default function ${componentName}() {
  const elementRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
${interactions}
    
    // Menu hamburger
    const hamburgers = document.querySelectorAll('button[aria-label="Menu"]');
    hamburgers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const nav = (btn as HTMLElement).parentElement?.querySelector('nav') as HTMLElement;
        if (nav) {
          nav.classList.toggle('hidden');
        }
      });
    });

    return () => {
      // Cleanup
    };
  }, []);

  return (
    <>
${jsx}
    </>
  );
}
`;
  }

  private elementToJSX(element: Element, indent: number): string {
    const spaces = '  '.repeat(indent);
    const Tag = element.tag;
    const styles = this.stylesToInlineObject(element);
    const attrs = this.getJSXAttributes(element);

    if (Tag === 'img') {
      return `${spaces}<img${attrs} style={${styles}} />`;
    }

    const content = element.content ? `{${JSON.stringify(element.content)}}` : '';
    const children = element.children?.map(child => 
      this.elementToJSX(child, indent + 1)
    ).join('\n') || '';

    return `${spaces}<${Tag}${attrs} style={${styles}}>${content}${children ? '\n' + children + '\n' + spaces : ''}</${Tag}>`;
  }

  private elementToTailwindJSX(element: Element, indent: number): string {
    const spaces = '  '.repeat(indent);
    const Tag = element.tag;
    const className = this.stylesToTailwind(element);
    const attrs = this.getJSXAttributes(element, className);

    if (Tag === 'img') {
      return `${spaces}<img${attrs} />`;
    }

    const content = element.content ? `{${JSON.stringify(element.content)}}` : '';
    const children = element.children?.map(child => 
      this.elementToTailwindJSX(child, indent + 1)
    ).join('\n') || '';

    return `${spaces}<${Tag}${attrs}>${content}${children ? '\n' + children + '\n' + spaces : ''}</${Tag}>`;
  }

  private getJSXAttributes(element: Element, className?: string): string {
    let attrs = '';
    
    attrs += `\n      ref={(el) => el && elementRefs.current.set('${element.id}', el)}`;
    attrs += `\n      data-element-id="${element.id}"`;
    
    if (className) {
      attrs += `\n      className="${className}"`;
    }

    if (element.attributes) {
      Object.entries(element.attributes).forEach(([key, value]) => {
        if (key === 'class') return;
        attrs += `\n      ${key}="${value}"`;
      });
    }

    return attrs;
  }

  private stylesToInlineObject(element: Element): string {
    const desktop = element.styles.desktop || {};
    const styles: any = { ...desktop };

    // Merge responsive styles (simplified for inline)
    if (element.styles.mobile) {
      Object.assign(styles, element.styles.mobile);
    }

    const entries = Object.entries(styles).map(([key, value]) => 
      `${key}: ${JSON.stringify(value)}`
    ).join(', ');

    return `{{ ${entries} }}`;
  }

  private stylesToTailwind(element: Element): string {
    const classes: string[] = [];
    const desktop = element.styles.desktop || {};

    // Layout
    if (desktop.display === 'flex') classes.push('flex');
    if (desktop.display === 'block') classes.push('block');
    if (desktop.display === 'none') classes.push('hidden');
    if (desktop.flexDirection === 'column') classes.push('flex-col');
    if (desktop.flexDirection === 'row') classes.push('flex-row');
    if (desktop.justifyContent === 'center') classes.push('justify-center');
    if (desktop.justifyContent === 'space-between') classes.push('justify-between');
    if (desktop.alignItems === 'center') classes.push('items-center');

    // Spacing
    if (desktop.padding) {
      const p = this.convertToTailwindSpacing(desktop.padding);
      if (p) classes.push(`p-${p}`);
    }
    if (desktop.margin) {
      const m = this.convertToTailwindSpacing(desktop.margin);
      if (m) classes.push(`m-${m}`);
    }

    // Colors
    if (desktop.backgroundColor === '#ffffff') classes.push('bg-white');
    if (desktop.backgroundColor === '#000000') classes.push('bg-black');
    if (desktop.color === '#ffffff') classes.push('text-white');
    if (desktop.color === '#000000') classes.push('text-black');

    // Typography
    if (desktop.fontSize === '24px') classes.push('text-2xl');
    if (desktop.fontSize === '20px') classes.push('text-xl');
    if (desktop.fontSize === '16px') classes.push('text-base');
    if (desktop.fontWeight === '700') classes.push('font-bold');
    if (desktop.fontWeight === '600') classes.push('font-semibold');

    // Borders
    if (desktop.borderRadius === '6px') classes.push('rounded-md');
    if (desktop.borderRadius === '8px') classes.push('rounded-lg');

    // Responsive
    if (element.styles.mobile?.display === 'none') classes.push('md:hidden');
    if (element.styles.mobile?.display === 'block') classes.push('md:block');

    return classes.join(' ');
  }

  private convertToTailwindSpacing(value: string): string | null {
    const map: Record<string, string> = {
      '0': '0',
      '4px': '1',
      '8px': '2',
      '12px': '3',
      '16px': '4',
      '20px': '5',
      '24px': '6',
    };
    return map[value] || null;
  }

  private generateInteractionsCode(elements: Element[]): string {
    let code = '';
    const interactions = this.collectInteractions(elements);

    interactions.forEach(({ elementId, interactions: elInteractions }) => {
      elInteractions.forEach(interaction => {
        code += this.interactionToReactCode(elementId, interaction);
      });
    });

    return code;
  }

  private collectInteractions(elements: Element[]): Array<{ elementId: string; interactions: Interaction[] }> {
    const result: Array<{ elementId: string; interactions: Interaction[] }> = [];
    
    const collect = (el: Element) => {
      if (el.interactions && el.interactions.length > 0) {
        result.push({ elementId: el.id, interactions: el.interactions });
      }
      el.children?.forEach(collect);
    };

    elements.forEach(collect);
    return result;
  }

  private interactionToReactCode(elementId: string, interaction: Interaction): string {
    let code = `    // ${interaction.trigger} on ${elementId}\n`;
    code += `    const el_${elementId.replace(/-/g, '_')} = elementRefs.current.get('${elementId}');\n`;
    code += `    if (el_${elementId.replace(/-/g, '_')}) {\n`;

    switch (interaction.trigger) {
      case 'click':
        code += `      el_${elementId.replace(/-/g, '_')}.addEventListener('click', () => {\n`;
        code += this.actionsToReactCode(interaction.actions, elementId, '        ');
        code += `      });\n`;
        break;
      case 'hover':
        code += `      el_${elementId.replace(/-/g, '_')}.addEventListener('mouseenter', () => {\n`;
        code += this.actionsToReactCode(interaction.actions, elementId, '        ');
        code += `      });\n`;
        break;
      case 'page-load':
        code += this.actionsToReactCode(interaction.actions, elementId, '      ');
        break;
      case 'scroll':
        interaction.actions.forEach(action => {
          if (action.type === 'animate') {
            const config = action.config as any;
            code += `      gsap.to(el_${elementId.replace(/-/g, '_')}, {\n`;
            code += `        ${config.property}: ${JSON.stringify(config.to)},\n`;
            code += `        duration: ${config.duration},\n`;
            code += `        scrollTrigger: {\n`;
            code += `          trigger: el_${elementId.replace(/-/g, '_')},\n`;
            code += `          start: "top 80%",\n`;
            code += `          end: "top 20%",\n`;
            code += `          scrub: true\n`;
            code += `        }\n`;
            code += `      });\n`;
          }
        });
        break;
    }

    code += `    }\n\n`;
    return code;
  }

  private actionsToReactCode(actions: any[], elementId: string, indent: string): string {
    let code = '';
    const elVar = `el_${elementId.replace(/-/g, '_')}`;

    actions.forEach(action => {
      switch (action.type) {
        case 'animate':
          const animConfig = action.config;
          code += `${indent}gsap.to(${elVar}, {\n`;
          code += `${indent}  ${animConfig.property}: ${JSON.stringify(animConfig.to)},\n`;
          code += `${indent}  duration: ${animConfig.duration},\n`;
          if (animConfig.delay) code += `${indent}  delay: ${animConfig.delay},\n`;
          code += `${indent}  ease: "${animConfig.ease || 'power2.out'}"\n`;
          code += `${indent}});\n`;
          break;
        case 'navigate':
          const navConfig = action.config;
          if (navConfig.target === '_blank') {
            code += `${indent}window.open("${navConfig.url}", "_blank");\n`;
          } else {
            code += `${indent}window.location.href = "${navConfig.url}";\n`;
          }
          break;
        case 'toggle-class':
          const toggleConfig = action.config;
          const target = toggleConfig.targetSelector 
            ? `document.querySelector("${toggleConfig.targetSelector}")`
            : elVar;
          code += `${indent}${target}?.classList.toggle("${toggleConfig.className}");\n`;
          break;
        case 'custom-code':
          code += `${indent}${action.config.code}\n`;
          break;
      }
    });

    return code;
  }
}

export const reactGenerator = new ReactGenerator();
