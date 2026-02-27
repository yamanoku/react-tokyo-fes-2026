import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

interface MenuItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

interface MenuProps {
  trigger: ReactNode;
  triggerLabel?: string;
  items: MenuItem[];
  ariaLabel?: string;
}

export function Menu({ trigger, triggerLabel, items, ariaLabel = 'メニュー' }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());

  const close = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
    triggerRef.current?.focus();
  }, []);

  // クリック外で閉じる
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, close]);

  // フォーカス移動
  useEffect(() => {
    if (focusedIndex >= 0) {
      itemRefs.current.get(focusedIndex)?.focus();
    }
  }, [focusedIndex]);

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'Enter':
      case ' ':
        event.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setIsOpen(true);
        setFocusedIndex(items.length - 1);
        break;
    }
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setFocusedIndex(items.length - 1);
        break;
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'Tab':
        close();
        break;
    }
  };

  const handleItemClick = (item: MenuItem) => {
    item.onClick?.();
    if (!item.href) {
      close();
    }
  };

  return (
    <div ref={menuRef} className="relative inline-block">
      <button
        type="button"
        ref={triggerRef}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={triggerLabel}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
        className="inline-flex items-center gap-2 px-4 py-2 bg-menu-block text-menu-text border border-menu-border rounded-md"
      >
        {trigger}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label={ariaLabel}
          onKeyDown={handleMenuKeyDown}
          className="absolute left-0 mt-2 w-48 rounded-md shadow-lg z-10"
        >
          {items.map((item, index) => {
            const Component = item.href ? 'a' : 'button';
            return (
              <Component
                key={item.id}
                ref={(el: HTMLElement | null) => {
                  if (el) itemRefs.current.set(index, el);
                  else itemRefs.current.delete(index);
                }}
                role="menuitem"
                href={item.href}
                tabIndex={-1}
                onClick={() => handleItemClick(item)}
                className="flex items-center gap-2 w-full px-4 py-2 border border-menu-border [&:not(:last-child)]:border-b-0 bg-menu-block text-menu-text text-left text-base focus:outline-accent first:rounded-t-md last:rounded-b-md"
              >
                {item.icon && (
                  <span className="w-5 h-5" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </Component>
            );
          })}
        </div>
      )}
    </div>
  );
}

