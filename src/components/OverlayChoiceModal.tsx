import React from 'react';

export type OverlayModalActionVariant = 'green' | 'primary' | 'outline-green';

export interface OverlayModalAction {
  label: string;
  variant: OverlayModalActionVariant;
  onClick: () => void;
}

interface OverlayChoiceModalProps {
  open: boolean;
  /** Called when backdrop is tapped (omit to disable closing on backdrop). */
  onBackdropClick?: () => void;
  title: string;
  titleClassName?: string;
  message?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  actions: OverlayModalAction[];
  /** Cart-style side-by-side vs stacked pills (e.g. order complete). */
  actionsLayout?: 'row' | 'column';
  panelClassName?: string;
}

/** Matches `Button` base: `py-3 rounded-full font-medium text-base`; labels use `text-white`. */
function actionClass(variant: OverlayModalActionVariant, layout: 'row' | 'column'): string {
  const rowBase =
    'flex-1 min-w-0 rounded-full py-3 text-center text-base font-normal text-white transition-opacity hover:opacity-90 active:opacity-80';
  const colBase =
    'w-full rounded-full py-3 text-center text-base font-normal text-white transition-opacity hover:opacity-90 active:opacity-80';

  if (layout === 'column') {
    switch (variant) {
      case 'green':
        return `${colBase} bg-app-green`;
      case 'primary':
        return `${colBase} bg-primary`;
      case 'outline-green':
        return `${colBase} border-2 border-app-green bg-transparent`;
    }
  }

  switch (variant) {
    case 'green':
      return `${rowBase} bg-app-green`;
    case 'primary':
      return `${rowBase} bg-primary`;
    case 'outline-green':
      return `${rowBase} border-2 border-app-green bg-transparent`;
  }
}

/**
 * Reusable overlay modal (same shell as Cart delete/remove confirmations):
 * blurred backdrop, bordered panel, one or two action buttons.
 */
const OverlayChoiceModal: React.FC<OverlayChoiceModalProps> = ({
  open,
  onBackdropClick,
  title,
  titleClassName = 'text-base font-medium',
  message,
  imageSrc,
  imageAlt = '',
  actions,
  actionsLayout = 'row',
  panelClassName = '',
}) => {
  if (!open) return null;

  const actionsClass =
    actionsLayout === 'column'
      ? 'flex w-full min-w-[200px] flex-col gap-3'
      : 'flex w-full min-w-[200px] gap-12';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onBackdropClick}
      role="presentation"
    >
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
      <div
        className={`relative z-10 flex flex-col items-center gap-4 rounded-xl border border-white/15 bg-overlay-panel-background px-5 py-4 shadow-lg backdrop-blur-md ${panelClassName}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {imageSrc ? (
          <img src={imageSrc} alt={imageAlt} className="mb-4 h-34 w-34 object-contain" />
        ) : null}
        <p className={`text-center text-foreground ${titleClassName}`}>{title}</p>
        {message ? <div className="mb-4 max-w-xs text-center text-sm text-foreground/70">{message}</div> : null}
        <div className={actionsClass}>
          {actions.map((a) => (
            <button key={a.label} type="button" onClick={a.onClick} className={actionClass(a.variant, actionsLayout)}>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverlayChoiceModal;
