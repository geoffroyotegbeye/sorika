export type TriggerType = 'click' | 'hover' | 'page-load' | 'scroll' | 'custom';
export type ActionType = 'animate' | 'navigate' | 'toggle-class' | 'show-hide' | 'custom-code';

export interface AnimationConfig {
  property: string;
  from?: string | number;
  to: string | number;
  duration: number;
  delay?: number;
  ease?: string;
  stagger?: number;
  repeat?: number;
  yoyo?: boolean;
}

export interface NavigateAction {
  url: string;
  target?: '_self' | '_blank';
}

export interface ToggleClassAction {
  className: string;
  targetSelector?: string;
}

export interface ShowHideAction {
  targetSelector: string;
  action: 'show' | 'hide' | 'toggle';
}

export interface CustomCodeAction {
  code: string;
}

export interface Interaction {
  id: string;
  trigger: TriggerType;
  triggerConfig?: {
    scrollStart?: number;
    scrollEnd?: number;
    eventName?: string;
  };
  actions: Array<{
    type: ActionType;
    config: AnimationConfig | NavigateAction | ToggleClassAction | ShowHideAction | CustomCodeAction;
  }>;
}
