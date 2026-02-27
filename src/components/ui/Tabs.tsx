import { useState, useRef, type KeyboardEvent, type ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  ariaLabel?: string;
}

export function Tabs({ tabs, defaultTabId, ariaLabel = 'タブ' }: TabsProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTabId);
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
        break;
      case 'ArrowRight':
        event.preventDefault();
        newIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    const newTab = tabs[newIndex];
    if (newTab) {
      setActiveTabId(newTab.id);
      tabRefs.current.get(newTab.id)?.focus();
    }
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div>
      <div
        role="tablist"
        aria-label={ariaLabel}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el);
                else tabRefs.current.delete(tab.id);
              }}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTabId(tab.id)}
              onKeyDown={handleKeyDown}
              className={`
                px-4 py-2 text-sm font-medium border-b-2 -mb-px
                transition-colors duration-200
                ${
                  isActive
                    ? 'border-accent'
                    : 'border-transparent'
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {activeTab && (
        <div
          key={activeTab.id}
          role="tabpanel"
          id={`tabpanel-${activeTab.id}`}
          aria-labelledby={`tab-${activeTab.id}`}
          tabIndex={0}
          className="p-4 mt-px border-t"
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}

