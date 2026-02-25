import { ElementContextMenu } from './ElementContextMenu';
import { canMoveElement } from './canvas-utils';

interface MediaRendererProps {
  element: any;
  elements: any[];
  styles: any;
  parentId?: string;
  parentType?: string;
  handleClick: (e: React.MouseEvent) => void;
  handleMouseEnter: (e: React.MouseEvent) => void;
  handleMouseLeave: () => void;
  handleAddChild: (type: string) => void;
  handleAddBefore: (type: string) => void;
  handleAddAfter: (type: string) => void;
  handleDelete: () => void;
  handleDuplicate: () => void;
  handleMoveUp: () => void;
  handleMoveDown: () => void;
  renderLabel: () => React.ReactNode;
}

export function ImageRenderer(props: MediaRendererProps) {
  const { element, elements, styles, parentId, parentType, renderLabel } = props;
  const hasImage = element.attributes?.src;
  const { canMoveUp, canMoveDown } = canMoveElement(elements, element.id, parentId);

  return (
    <ElementContextMenu
      key={element.id}
      elementType={element.type}
      elementId={element.id}
      parentId={parentId}
      parentType={parentType}
      onAddChild={props.handleAddChild}
      onAddBefore={props.handleAddBefore}
      onAddAfter={props.handleAddAfter}
      onDelete={props.handleDelete}
      onDuplicate={props.handleDuplicate}
      onMoveUp={canMoveUp ? props.handleMoveUp : undefined}
      onMoveDown={canMoveDown ? props.handleMoveDown : undefined}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      <div
        style={{ ...styles, display: 'block', position: 'relative', overflow: 'hidden' }}
        onClick={(e) => {
          e.stopPropagation();
          props.handleClick(e);
        }}
        onMouseEnter={props.handleMouseEnter}
        onMouseLeave={props.handleMouseLeave}
      >
        {renderLabel()}
        {hasImage ? (
          <img
            src={element.attributes.src}
            alt={element.attributes?.alt || 'Image'}
            style={{ 
              width: styles.width || '100%', 
              height: styles.height || 'auto', 
              display: 'block',
              objectFit: styles.objectFit || 'cover',
              borderRadius: styles.borderRadius || '0'
            }}
          />
        ) : (
          <div
            style={{
              width: styles.width || '100%',
              height: styles.height || '300px',
              backgroundColor: '#f1f5f9',
              border: '2px dashed #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <div className="text-center text-slate-400">
              <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium">Cliquez pour ajouter une image</p>
              <p className="text-xs mt-1">Utilisez le panneau de droite</p>
            </div>
          </div>
        )}
      </div>
    </ElementContextMenu>
  );
}

export function VideoRenderer(props: MediaRendererProps) {
  const { element, elements, styles, parentId, parentType, renderLabel } = props;
  const hasVideo = element.attributes?.src;
  const { canMoveUp, canMoveDown } = canMoveElement(elements, element.id, parentId);

  return (
    <ElementContextMenu
      key={element.id}
      elementType={element.type}
      elementId={element.id}
      parentId={parentId}
      parentType={parentType}
      onAddChild={props.handleAddChild}
      onAddBefore={props.handleAddBefore}
      onAddAfter={props.handleAddAfter}
      onDelete={props.handleDelete}
      onDuplicate={props.handleDuplicate}
      onMoveUp={canMoveUp ? props.handleMoveUp : undefined}
      onMoveDown={canMoveDown ? props.handleMoveDown : undefined}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      <div
        style={{ ...styles, display: 'block', position: 'relative', overflow: 'hidden' }}
        onClick={(e) => {
          e.stopPropagation();
          props.handleClick(e);
        }}
        onMouseEnter={props.handleMouseEnter}
        onMouseLeave={props.handleMouseLeave}
      >
        {renderLabel()}
        {hasVideo ? (
          <video
            src={element.attributes.src}
            poster={element.attributes?.poster}
            controls={element.attributes?.controls !== false}
            autoPlay={element.attributes?.autoplay}
            loop={element.attributes?.loop}
            muted={element.attributes?.muted}
            style={{ 
              width: styles.width || '100%', 
              height: styles.height || 'auto', 
              display: 'block',
              objectFit: styles.objectFit || 'cover',
              borderRadius: styles.borderRadius || '0'
            }}
          />
        ) : (
          <div
            style={{
              width: styles.width || '100%',
              height: styles.height || '300px',
              backgroundColor: '#0f172a',
              border: '2px dashed #475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <div className="text-center text-slate-400">
              <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium">Cliquez pour ajouter une vidéo</p>
              <p className="text-xs mt-1">Utilisez le panneau de droite</p>
            </div>
          </div>
        )}
      </div>
    </ElementContextMenu>
  );
}
