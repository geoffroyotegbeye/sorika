import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Interaction, AnimationConfig, NavigateAction, ToggleClassAction, ShowHideAction, CustomCodeAction } from './types';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export class InteractionEngine {
  private interactions: Map<string, Interaction[]> = new Map();
  private cleanupFunctions: Map<string, (() => void)[]> = new Map();

  addInteraction(elementId: string, interaction: Interaction) {
    const existing = this.interactions.get(elementId) || [];
    this.interactions.set(elementId, [...existing, interaction]);
  }

  removeInteraction(elementId: string, interactionId: string) {
    const existing = this.interactions.get(elementId) || [];
    this.interactions.set(
      elementId,
      existing.filter(i => i.id !== interactionId)
    );
  }

  getInteractions(elementId: string): Interaction[] {
    return this.interactions.get(elementId) || [];
  }

  setInteractions(elementId: string, interactions: Interaction[]) {
    this.interactions.set(elementId, interactions);
  }

  clearInteractions(elementId: string) {
    this.cleanup(elementId);
    this.interactions.delete(elementId);
  }

  clearAll() {
    this.interactions.forEach((_, elementId) => this.cleanup(elementId));
    this.interactions.clear();
  }

  private cleanup(elementId: string) {
    const cleanups = this.cleanupFunctions.get(elementId) || [];
    cleanups.forEach(fn => fn());
    this.cleanupFunctions.delete(elementId);
  }

  private addCleanup(elementId: string, cleanup: () => void) {
    const existing = this.cleanupFunctions.get(elementId) || [];
    this.cleanupFunctions.set(elementId, [...existing, cleanup]);
  }

  applyInteractions(elementId: string, element: HTMLElement) {
    this.cleanup(elementId);
    
    const interactions = this.interactions.get(elementId) || [];
    
    interactions.forEach(interaction => {
      switch (interaction.trigger) {
        case 'click':
          this.applyClickTrigger(elementId, element, interaction);
          break;
        case 'hover':
          this.applyHoverTrigger(elementId, element, interaction);
          break;
        case 'page-load':
          this.applyPageLoadTrigger(elementId, element, interaction);
          break;
        case 'scroll':
          this.applyScrollTrigger(elementId, element, interaction);
          break;
        case 'custom':
          this.applyCustomTrigger(elementId, element, interaction);
          break;
      }
    });
  }

  private applyClickTrigger(elementId: string, element: HTMLElement, interaction: Interaction) {
    const handler = () => this.executeActions(element, interaction.actions);
    element.addEventListener('click', handler);
    this.addCleanup(elementId, () => element.removeEventListener('click', handler));
  }

  private applyHoverTrigger(elementId: string, element: HTMLElement, interaction: Interaction) {
    const enterHandler = () => this.executeActions(element, interaction.actions);
    element.addEventListener('mouseenter', enterHandler);
    this.addCleanup(elementId, () => element.removeEventListener('mouseenter', enterHandler));
  }

  private applyPageLoadTrigger(elementId: string, element: HTMLElement, interaction: Interaction) {
    setTimeout(() => this.executeActions(element, interaction.actions), 100);
  }

  private applyScrollTrigger(elementId: string, element: HTMLElement, interaction: Interaction) {
    const config = interaction.triggerConfig;
    
    interaction.actions.forEach(action => {
      if (action.type === 'animate') {
        const animConfig = action.config as AnimationConfig;
        const gsapConfig: any = {
          [animConfig.property]: animConfig.to,
          duration: animConfig.duration,
          ease: animConfig.ease || 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: config?.scrollStart ? `top ${config.scrollStart}%` : 'top 80%',
            end: config?.scrollEnd ? `top ${config.scrollEnd}%` : 'top 20%',
            scrub: true,
          }
        };
        
        if (animConfig.from !== undefined) {
          gsap.fromTo(element, { [animConfig.property]: animConfig.from }, gsapConfig);
        } else {
          gsap.to(element, gsapConfig);
        }
      }
    });
  }

  private applyCustomTrigger(elementId: string, element: HTMLElement, interaction: Interaction) {
    const eventName = interaction.triggerConfig?.eventName || 'custom';
    const handler = () => this.executeActions(element, interaction.actions);
    element.addEventListener(eventName, handler);
    this.addCleanup(elementId, () => element.removeEventListener(eventName, handler));
  }

  private executeActions(element: HTMLElement, actions: Interaction['actions']) {
    actions.forEach(action => {
      switch (action.type) {
        case 'animate':
          this.executeAnimation(element, action.config as AnimationConfig);
          break;
        case 'navigate':
          this.executeNavigation(action.config as NavigateAction);
          break;
        case 'toggle-class':
          this.executeToggleClass(element, action.config as ToggleClassAction);
          break;
        case 'show-hide':
          this.executeShowHide(action.config as ShowHideAction);
          break;
        case 'custom-code':
          this.executeCustomCode(element, action.config as CustomCodeAction);
          break;
      }
    });
  }

  private executeAnimation(element: HTMLElement, config: AnimationConfig) {
    const gsapConfig: any = {
      [config.property]: config.to,
      duration: config.duration,
      delay: config.delay || 0,
      ease: config.ease || 'power2.out',
    };

    if (config.repeat !== undefined) gsapConfig.repeat = config.repeat;
    if (config.yoyo) gsapConfig.yoyo = true;

    if (config.from !== undefined) {
      gsap.fromTo(element, { [config.property]: config.from }, gsapConfig);
    } else {
      gsap.to(element, gsapConfig);
    }
  }

  private executeNavigation(config: NavigateAction) {
    if (config.target === '_blank') {
      window.open(config.url, '_blank');
    } else {
      window.location.href = config.url;
    }
  }

  private executeToggleClass(element: HTMLElement, config: ToggleClassAction) {
    const target = config.targetSelector 
      ? document.querySelector(config.targetSelector) as HTMLElement
      : element;
    
    if (target) {
      target.classList.toggle(config.className);
    }
  }

  private executeShowHide(config: ShowHideAction) {
    const target = document.querySelector(config.targetSelector) as HTMLElement;
    if (!target) return;

    switch (config.action) {
      case 'show':
        const computedDisplay = window.getComputedStyle(target).display;
        const displayValue = computedDisplay !== 'none' ? computedDisplay : 'flex';
        target.style.display = displayValue;
        gsap.to(target, { opacity: 1, duration: 0.3 });
        break;
      case 'hide':
        gsap.to(target, { opacity: 0, duration: 0.3, onComplete: () => target.style.display = 'none' });
        break;
      case 'toggle':
        const isHidden = window.getComputedStyle(target).display === 'none';
        if (isHidden) {
          // Récupérer le display original depuis l'attribut data ou utiliser flex par défaut
          const originalDisplay = target.getAttribute('data-original-display') || 'flex';
          target.style.display = originalDisplay;
          gsap.to(target, { opacity: 1, duration: 0.3 });
        } else {
          // Sauvegarder le display actuel avant de cacher
          const currentDisplay = window.getComputedStyle(target).display;
          target.setAttribute('data-original-display', currentDisplay);
          gsap.to(target, { opacity: 0, duration: 0.3, onComplete: () => target.style.display = 'none' });
        }
        break;
    }
  }

  private executeCustomCode(element: HTMLElement, config: CustomCodeAction) {
    try {
      const func = new Function('element', 'gsap', config.code);
      func(element, gsap);
    } catch (error) {
      console.error('Error executing custom code:', error);
    }
  }

  generateCode(elementId: string): string {
    const interactions = this.interactions.get(elementId) || [];
    if (interactions.length === 0) return '';

    let code = `// Interactions for element: ${elementId}\n`;
    code += `const element = document.querySelector('[data-element-id="${elementId}"]');\n\n`;

    interactions.forEach((interaction, index) => {
      code += `// Interaction ${index + 1}: ${interaction.trigger}\n`;
      
      switch (interaction.trigger) {
        case 'click':
          code += `element.addEventListener('click', () => {\n`;
          code += this.generateActionsCode(interaction.actions, '  ');
          code += `});\n\n`;
          break;
        case 'hover':
          code += `element.addEventListener('mouseenter', () => {\n`;
          code += this.generateActionsCode(interaction.actions, '  ');
          code += `});\n\n`;
          break;
        case 'page-load':
          code += `window.addEventListener('load', () => {\n`;
          code += this.generateActionsCode(interaction.actions, '  ');
          code += `});\n\n`;
          break;
        case 'scroll':
          code += this.generateScrollCode(interaction);
          break;
        case 'custom':
          code += `element.addEventListener('${interaction.triggerConfig?.eventName || 'custom'}', () => {\n`;
          code += this.generateActionsCode(interaction.actions, '  ');
          code += `});\n\n`;
          break;
      }
    });

    return code;
  }

  private generateActionsCode(actions: Interaction['actions'], indent: string): string {
    let code = '';
    
    actions.forEach(action => {
      switch (action.type) {
        case 'animate':
          const animConfig = action.config as AnimationConfig;
          code += `${indent}gsap.to(element, {\n`;
          code += `${indent}  ${animConfig.property}: ${JSON.stringify(animConfig.to)},\n`;
          code += `${indent}  duration: ${animConfig.duration},\n`;
          if (animConfig.delay) code += `${indent}  delay: ${animConfig.delay},\n`;
          code += `${indent}  ease: "${animConfig.ease || 'power2.out'}"\n`;
          code += `${indent}});\n`;
          break;
        case 'navigate':
          const navConfig = action.config as NavigateAction;
          if (navConfig.target === '_blank') {
            code += `${indent}window.open("${navConfig.url}", "_blank");\n`;
          } else {
            code += `${indent}window.location.href = "${navConfig.url}";\n`;
          }
          break;
        case 'toggle-class':
          const toggleConfig = action.config as ToggleClassAction;
          const target = toggleConfig.targetSelector ? `document.querySelector("${toggleConfig.targetSelector}")` : 'element';
          code += `${indent}${target}.classList.toggle("${toggleConfig.className}");\n`;
          break;
        case 'show-hide':
          const showHideConfig = action.config as ShowHideAction;
          code += `${indent}const target = document.querySelector("${showHideConfig.targetSelector}");\n`;
          if (showHideConfig.action === 'show') {
            code += `${indent}target.style.display = 'block';\n`;
            code += `${indent}gsap.to(target, { opacity: 1, duration: 0.3 });\n`;
          } else if (showHideConfig.action === 'hide') {
            code += `${indent}gsap.to(target, { opacity: 0, duration: 0.3, onComplete: () => target.style.display = 'none' });\n`;
          } else if (showHideConfig.action === 'toggle') {
            code += `${indent}const isHidden = window.getComputedStyle(target).display === 'none';\n`;
            code += `${indent}if (isHidden) {\n`;
            code += `${indent}  target.style.display = 'block';\n`;
            code += `${indent}  gsap.to(target, { opacity: 1, duration: 0.3 });\n`;
            code += `${indent}} else {\n`;
            code += `${indent}  gsap.to(target, { opacity: 0, duration: 0.3, onComplete: () => target.style.display = 'none' });\n`;
            code += `${indent}}\n`;
          }
          break;
        case 'custom-code':
          const customConfig = action.config as CustomCodeAction;
          code += `${indent}${customConfig.code}\n`;
          break;
      }
    });
    
    return code;
  }

  private generateScrollCode(interaction: Interaction): string {
    let code = '';
    const config = interaction.triggerConfig;
    
    interaction.actions.forEach(action => {
      if (action.type === 'animate') {
        const animConfig = action.config as AnimationConfig;
        code += `gsap.to(element, {\n`;
        code += `  ${animConfig.property}: ${JSON.stringify(animConfig.to)},\n`;
        code += `  duration: ${animConfig.duration},\n`;
        code += `  ease: "${animConfig.ease || 'power2.out'}",\n`;
        code += `  scrollTrigger: {\n`;
        code += `    trigger: element,\n`;
        code += `    start: "top ${config?.scrollStart || 80}%",\n`;
        code += `    end: "top ${config?.scrollEnd || 20}%",\n`;
        code += `    scrub: true\n`;
        code += `  }\n`;
        code += `});\n\n`;
      }
    });
    
    return code;
  }
}

export const interactionEngine = new InteractionEngine();
