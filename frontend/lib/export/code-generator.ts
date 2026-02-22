import { Element } from '../stores/editor-store';
import { Interaction } from '../interactions/types';

export class CodeGenerator {
  private cssClasses: Map<string, string> = new Map();
  private classCounter = 0;

  generateHTML(elements: Element[]): string {
    this.cssClasses.clear();
    this.classCounter = 0;

    const body = elements.map(el => this.elementToHTML(el)).join('\n');
    
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ma Page</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
${body}
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="script.js"></script>
</body>
</html>`;
  }

  generateCSS(elements: Element[]): string {
    this.cssClasses.clear();
    this.classCounter = 0;

    elements.forEach(el => this.collectStyles(el));

    let css = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
}

`;

    this.cssClasses.forEach((styles, className) => {
      css += `${className} {\n${styles}}\n\n`;
    });

    return css;
  }

  generateJS(elements: Element[]): string {
    let js = `// Interactions\ngsap.registerPlugin(ScrollTrigger);\n\n`;

    const interactions = this.collectInteractions(elements);
    
    interactions.forEach(({ elementId, interactions: elInteractions }) => {
      elInteractions.forEach(interaction => {
        js += this.interactionToJS(elementId, interaction);
      });
    });

    js += `\n// Menu hamburger\ndocument.addEventListener('DOMContentLoaded', () => {
  const hamburgers = document.querySelectorAll('button[aria-label="Menu"]');
  hamburgers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const nav = btn.parentElement.querySelector('nav');
      if (nav) {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
      }
    });
  });
});\n`;

    return js;
  }

  private elementToHTML(element: Element, indent = ''): string {
    const className = this.getClassName(element);
    const attrs = this.getAttributes(element, className);
    
    if (element.tag === 'img') {
      return `${indent}<img${attrs} />`;
    }

    const content = element.content || '';
    const children = element.children?.map(child => 
      this.elementToHTML(child, indent + '  ')
    ).join('\n') || '';

    return `${indent}<${element.tag}${attrs}>${content}${children ? '\n' + children + '\n' + indent : ''}</${element.tag}>`;
  }

  private getAttributes(element: Element, className: string): string {
    let attrs = ` class="${className}"`;
    attrs += ` data-element-id="${element.id}"`;
    
    if (element.attributes) {
      Object.entries(element.attributes).forEach(([key, value]) => {
        if (key !== 'class') {
          attrs += ` ${key}="${value}"`;
        }
      });
    }

    return attrs;
  }

  private getClassName(element: Element): string {
    return `el-${element.type}-${++this.classCounter}`;
  }

  private stylesToCSS(element: Element): string {
    let css = '';
    const desktop = element.styles.desktop || {};
    
    Object.entries(desktop).forEach(([prop, value]) => {
      const cssProp = this.camelToKebab(prop);
      css += `  ${cssProp}: ${value};\n`;
    });

    return css;
  }

  private collectStyles(element: Element): void {
    const className = `.${this.getClassName(element)}`;
    let styles = this.stylesToCSS(element);
    
    this.cssClasses.set(className, styles);

    // Media queries séparées
    if (element.styles.tablet && Object.keys(element.styles.tablet).length > 0) {
      let tabletCSS = '';
      Object.entries(element.styles.tablet).forEach(([prop, value]) => {
        const cssProp = this.camelToKebab(prop);
        tabletCSS += `  ${cssProp}: ${value};\n`;
      });
      this.cssClasses.set(`@media (max-width: 768px) { ${className}`, tabletCSS + '}');
    }

    if (element.styles.mobile && Object.keys(element.styles.mobile).length > 0) {
      let mobileCSS = '';
      Object.entries(element.styles.mobile).forEach(([prop, value]) => {
        const cssProp = this.camelToKebab(prop);
        mobileCSS += `  ${cssProp}: ${value};\n`;
      });
      this.cssClasses.set(`@media (max-width: 480px) { ${className}`, mobileCSS + '}');
    }

    element.children?.forEach(child => this.collectStyles(child));
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

  private interactionToJS(elementId: string, interaction: Interaction): string {
    let js = `// ${interaction.trigger} on ${elementId}\n`;
    js += `const el_${elementId.replace(/-/g, '_')} = document.querySelector('[data-element-id="${elementId}"]');\n`;

    switch (interaction.trigger) {
      case 'click':
        js += `el_${elementId.replace(/-/g, '_')}.addEventListener('click', () => {\n`;
        js += this.actionsToJS(interaction.actions, elementId);
        js += `});\n\n`;
        break;
      case 'hover':
        js += `el_${elementId.replace(/-/g, '_')}.addEventListener('mouseenter', () => {\n`;
        js += this.actionsToJS(interaction.actions, elementId);
        js += `});\n\n`;
        break;
      case 'page-load':
        js += `window.addEventListener('load', () => {\n`;
        js += this.actionsToJS(interaction.actions, elementId);
        js += `});\n\n`;
        break;
      case 'scroll':
        interaction.actions.forEach(action => {
          if (action.type === 'animate') {
            const config = action.config as any;
            js += `gsap.to(el_${elementId.replace(/-/g, '_')}, {\n`;
            js += `  ${config.property}: ${JSON.stringify(config.to)},\n`;
            js += `  duration: ${config.duration},\n`;
            js += `  scrollTrigger: {\n`;
            js += `    trigger: el_${elementId.replace(/-/g, '_')},\n`;
            js += `    start: "top 80%",\n`;
            js += `    end: "top 20%",\n`;
            js += `    scrub: true\n`;
            js += `  }\n`;
            js += `});\n\n`;
          }
        });
        break;
    }

    return js;
  }

  private actionsToJS(actions: any[], elementId: string): string {
    let js = '';
    const elVar = `el_${elementId.replace(/-/g, '_')}`;

    actions.forEach(action => {
      switch (action.type) {
        case 'animate':
          const animConfig = action.config;
          js += `  gsap.to(${elVar}, {\n`;
          js += `    ${animConfig.property}: ${JSON.stringify(animConfig.to)},\n`;
          js += `    duration: ${animConfig.duration},\n`;
          if (animConfig.delay) js += `    delay: ${animConfig.delay},\n`;
          js += `    ease: "${animConfig.ease || 'power2.out'}"\n`;
          js += `  });\n`;
          break;
        case 'navigate':
          const navConfig = action.config;
          if (navConfig.target === '_blank') {
            js += `  window.open("${navConfig.url}", "_blank");\n`;
          } else {
            js += `  window.location.href = "${navConfig.url}";\n`;
          }
          break;
        case 'toggle-class':
          const toggleConfig = action.config;
          const target = toggleConfig.targetSelector 
            ? `document.querySelector("${toggleConfig.targetSelector}")`
            : elVar;
          js += `  ${target}.classList.toggle("${toggleConfig.className}");\n`;
          break;
        case 'custom-code':
          js += `  ${action.config.code}\n`;
          break;
      }
    });

    return js;
  }

  private camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  exportAll(elements: Element[]): { html: string; css: string; js: string } {
    return {
      html: this.generateHTML(elements),
      css: this.generateCSS(elements),
      js: this.generateJS(elements)
    };
  }
}

export const codeGenerator = new CodeGenerator();
