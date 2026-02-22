import { 
  Box, Square, Grid3x3, Columns, Rows, 
  Type, AlignLeft, Link, Quote,
  Image, Video,
  MousePointer2, List,
  FormInput, CheckSquare, Upload, Menu, LayoutTemplate, Copyright
} from 'lucide-react';

export const ELEMENT_CATEGORIES = [
  {
    id: 'structure',
    label: 'Structure',
    items: [
      { type: 'header', label: 'Header', tag: 'header', icon: LayoutTemplate },
      { type: 'section', label: 'Section', tag: 'section', icon: Box },
      { type: 'footer', label: 'Footer', tag: 'footer', icon: Copyright },
      { type: 'container', label: 'Container', tag: 'div', icon: Square },
      { type: 'navbar', label: 'Navbar', tag: 'nav', icon: Menu },
      { type: 'grid', label: 'Grid', tag: 'div', icon: Grid3x3 },
      { type: 'vflex', label: 'V Flex', tag: 'div', icon: Rows, isNew: true },
      { type: 'hflex', label: 'H Flex', tag: 'div', icon: Columns, isNew: true },
    ],
  },
  {
    id: 'basic',
    label: 'Basic',
    items: [
      { type: 'div', label: 'Div Block', tag: 'div', icon: Square },
      { type: 'link-block', label: 'Link Block', tag: 'a', icon: Link },
      { type: 'button', label: 'Button', tag: 'button', icon: MousePointer2 },
      { type: 'list', label: 'List', tag: 'ul', icon: List },
    ],
  },
  {
    id: 'typography',
    label: 'Typography',
    items: [
      { type: 'heading', label: 'Heading', tag: 'h2', icon: Type },
      { type: 'paragraph', label: 'Paragraph', tag: 'p', icon: AlignLeft },
      { type: 'text', label: 'Text', tag: 'span', icon: Type },
      { type: 'text-link', label: 'Text Link', tag: 'a', icon: Link },
      { type: 'blockquote', label: 'Block Quote', tag: 'blockquote', icon: Quote },
    ],
  },
  {
    id: 'media',
    label: 'Media',
    items: [
      { type: 'image', label: 'Image', tag: 'img', icon: Image },
      { type: 'video', label: 'Video', tag: 'video', icon: Video, isNew: true },
    ],
  },
  {
    id: 'forms',
    label: 'Forms',
    items: [
      { type: 'form', label: 'Form Block', tag: 'form', icon: FormInput },
      { type: 'input', label: 'Input', tag: 'input', icon: FormInput },
      { type: 'textarea', label: 'Text Area', tag: 'textarea', icon: AlignLeft },
      { type: 'checkbox', label: 'Checkbox', tag: 'input', icon: CheckSquare },
      { type: 'file-upload', label: 'File Upload', tag: 'input', icon: Upload },
    ],
  },
  {
    id: 'advanced',
    label: 'Advanced',
    items: [],
  },
];
