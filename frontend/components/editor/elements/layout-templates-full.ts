import {
  LucideIcon,
  Menu,
  LayoutGrid,
  Mail,
  Megaphone,
  Copyright,
  Rocket,
  SplitSquareHorizontal,
  Sparkles,
  DollarSign,
  Users,
  Star,
} from 'lucide-react';

export interface LayoutTemplate {
  id: string;
  label: string;
  category: string;
  icon: LucideIcon;
  template: any;
}

export const LAYOUT_TEMPLATES: LayoutTemplate[] = [
