import { type ReactNode, useEffect, useId, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  closeOnOverlayClick?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  closeOnOverlayClick = true,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const titleId = useId();

  // 開閉制御とフォーカス管理
  // showModal() がフォーカストラップ・背景 inert・top layer 配置を担う
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      if (dialog.open) dialog.close();
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
      previousActiveElement.current = null;
    }
  }, [isOpen]);

  // Esc キー: native の cancel イベントを onClose に橋渡し
  // preventDefault() でブラウザ側の自動 close を抑止し isOpen の状態管理に委ねる
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onClose]);

  // オーバーレイクリック: クリック先がコンテンツ外 = ダイアログ自体の背景部分
  // contentRef.contains() で判定することで div への onClick を不要にする
  const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (
      closeOnOverlayClick &&
      contentRef.current &&
      !contentRef.current.contains(event.target as Node | null)
    ) {
      onClose();
    }
  };

  return (
    // open: variant で [open] 属性があるときのみ flex を適用
    // UA スタイルシートの dialog:not([open]) { display: none } を尊重
    // biome-ignore lint/a11y/useKeyWithClickEvents: キーボードユーザーの閉じる操作は Escape キーによる cancel イベントで処理済み
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClick={handleDialogClick}
      className="p-0 m-0 max-w-none w-full h-full border-none bg-transparent open:flex open:items-center open:justify-center"
    >
      <div
        ref={contentRef}
        className="relative border bg-white dark:bg-black rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-auto"
      >
        <div className="flex items-center justify-between p-4 border-b border-rule">
          <h2 id={titleId} className="m-0">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md"
            aria-label="閉じる"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </dialog>
  );
}
