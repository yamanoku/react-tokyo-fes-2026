import {
  type DragEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export interface SortableItem {
  id: string;
  label: string;
}

interface SortableListProps {
  /** 並び替えるアイテムの配列 */
  items: SortableItem[];
  /** 並び替えが完了したときに呼ばれるコールバック */
  onReorder?: (newItems: SortableItem[]) => void;
  /** リスト全体のアクセシブルな名前 */
  label: string;
}

// ─── アナウンサー ─────────────────────────────────────────────────────────────

/**
 * スクリーンリーダー向けアナウンスを管理するカスタムフック。
 *
 * [GitHub blog 参照] 高速移動時にアナウンスが遅延する問題を解消するため
 * 100ms の debounce と aria-live="assertive" を組み合わせる。
 * 同一テキストが連続しても確実に通知されるよう、一度空にしてから再セットする。
 */
function useAnnouncer() {
  const [message, setMessage] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  const announce = useCallback((text: string, debounceMs = 0) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const flush = () => {
      // DOM 変化を確実に起こすため一度空にしてから次フレームでセット
      setMessage('');
      rafRef.current = requestAnimationFrame(() => {
        setMessage(text);
        rafRef.current = null;
      });
    };

    if (debounceMs > 0) {
      timerRef.current = setTimeout(flush, debounceMs);
    } else {
      flush();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { message, announce };
}

// ─── ヘルパー ─────────────────────────────────────────────────────────────────

function reorderList<T>(list: T[], fromIdx: number, toIdx: number): T[] {
  const next = [...list];
  const [item] = next.splice(fromIdx, 1);
  next.splice(toIdx, 0, item);
  return next;
}

// ─── SortableList ─────────────────────────────────────────────────────────────

export function SortableList({
  items: initialItems,
  onReorder,
  label,
}: SortableListProps) {
  const [items, setItems] = useState<SortableItem[]>(initialItems);

  // マウスドラッグ状態
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // キーボードドラッグ状態
  const [keyDragId, setKeyDragId] = useState<string | null>(null);
  // キャンセル時に戻せるよう元の順序を保存
  const savedItemsRef = useRef<SortableItem[] | null>(null);

  const { message, announce } = useAnnouncer();
  const handleRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // ─── マウスドラッグ ──────────────────────────────────────────────────────────

  const handleDragStart = useCallback(
    (e: DragEvent<HTMLLIElement>, id: string) => {
      setDraggingId(id);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', id);
    },
    [],
  );

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLLIElement>, id: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (id !== draggingId) setDragOverId(id);
    },
    [draggingId],
  );

  const handleDragLeave = useCallback((e: DragEvent<HTMLLIElement>) => {
    // 子要素への移動は無視し、リストアイテム外に出たときだけリセット
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setDragOverId(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLLIElement>, toId: string) => {
      e.preventDefault();
      if (!draggingId || draggingId === toId) {
        setDraggingId(null);
        setDragOverId(null);
        return;
      }

      const fromIdx = items.findIndex((i) => i.id === draggingId);
      const toIdx = items.findIndex((i) => i.id === toId);

      if (fromIdx !== -1 && toIdx !== -1) {
        const next = reorderList(items, fromIdx, toIdx);
        const newPos = next.findIndex((i) => i.id === draggingId) + 1;
        setItems(next);
        announce(`${items[fromIdx].label}を${newPos}番目の位置に移動しました`);
        onReorder?.(next);
      }

      setDraggingId(null);
      setDragOverId(null);
    },
    [draggingId, items, announce, onReorder],
  );

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverId(null);
  }, []);

  // ─── キーボードドラッグ ──────────────────────────────────────────────────────

  const startKeyDrag = useCallback(
    (id: string) => {
      const idx = items.findIndex((i) => i.id === id);
      savedItemsRef.current = items;
      setKeyDragId(id);
      announce(
        `${items[idx].label}、${idx + 1}番目。移動モード開始。` +
          `上下矢印キーで移動、Enterで確定、Escapeでキャンセル。`,
      );
    },
    [items, announce],
  );

  const moveKeyItem = useCallback(
    (direction: 'up' | 'down') => {
      if (!keyDragId) return;
      const idx = items.findIndex((i) => i.id === keyDragId);
      if (idx === -1) return;

      if (direction === 'up' && idx === 0) {
        // [GitHub blog 参照] 100ms debounce で高速連打時のアナウンス乱発を防ぐ
        announce('先頭に達しました。', 100);
        return;
      }
      if (direction === 'down' && idx === items.length - 1) {
        announce('末尾に達しました。', 100);
        return;
      }

      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      const next = reorderList(items, idx, newIdx);
      setItems(next);
      announce(`${next[newIdx].label}、${newIdx + 1}番目`, 100);
    },
    [keyDragId, items, announce],
  );

  const commitKeyDrag = useCallback(() => {
    if (!keyDragId) return;
    const idx = items.findIndex((i) => i.id === keyDragId);
    announce(`${items[idx].label}を${idx + 1}番目の位置に移動しました。`);
    onReorder?.(items);
    const id = keyDragId;
    savedItemsRef.current = null;
    setKeyDragId(null);
    // ドラッグ確定後、ドラッグハンドルにフォーカスを戻す
    requestAnimationFrame(() => handleRefs.current.get(id)?.focus());
  }, [keyDragId, items, announce, onReorder]);

  const cancelKeyDrag = useCallback(() => {
    if (!keyDragId) return;
    const id = keyDragId;
    if (savedItemsRef.current) setItems(savedItemsRef.current);
    announce('移動をキャンセルしました。');
    savedItemsRef.current = null;
    setKeyDragId(null);
    // キャンセル後、ドラッグハンドルにフォーカスを戻す
    requestAnimationFrame(() => handleRefs.current.get(id)?.focus());
  }, [keyDragId, announce]);

  const handleHandleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, id: string) => {
      if (keyDragId === id) {
        // キーボードドラッグ中: role="application" が適用されているため
        // スクリーンリーダーは矢印キーをアプリに渡す
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            moveKeyItem('up');
            break;
          case 'ArrowDown':
            e.preventDefault();
            moveKeyItem('down');
            break;
          case 'Enter':
            e.preventDefault();
            commitKeyDrag();
            break;
          case 'Escape':
            e.preventDefault();
            cancelKeyDrag();
            break;
        }
      } else if (!keyDragId && (e.key === 'Enter' || e.key === ' ')) {
        // ドラッグ未開始: Enter / Space でキーボードドラッグ開始
        e.preventDefault();
        startKeyDrag(id);
      }
    },
    [keyDragId, moveKeyItem, commitKeyDrag, cancelKeyDrag, startKeyDrag],
  );

  return (
    <div>
      {/*
       * [GitHub blog 参照] aria-live="assertive" で古いアナウンスを中断し最新の位置を通知する。
       * sr-only で視覚的には非表示。
       */}
      <output aria-live="assertive" aria-atomic="true" className="sr-only">
        {message}
      </output>

      <ol aria-label={label} className="space-y-2 pl-0">
        {items.map((item, index) => {
          const isMouseDragging = draggingId === item.id;
          const isDragTarget =
            dragOverId === item.id &&
            draggingId !== null &&
            draggingId !== item.id;
          const isKeyDragging = keyDragId === item.id;
          // キーボードドラッグ中は他のアイテムをマウスでドラッグできないようにする
          const isDraggable = !keyDragId && !isKeyDragging;

          return (
            <li
              key={item.id}
              draggable={isDraggable}
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDrop={(e) => handleDrop(e, item.id)}
              onDragEnd={handleDragEnd}
              onDragLeave={handleDragLeave}
              className={[
                'flex items-center gap-3 px-4 py-3 rounded-lg border',
                'transition-all duration-150 select-none',
                isMouseDragging ? 'opacity-40 scale-[0.98]' : '',
                isDragTarget
                  ? 'border-accent bg-accent/8 scale-[1.01]'
                  : 'border-component-block',
                isKeyDragging
                  ? 'ring-2 ring-accent bg-accent/10 border-accent'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {/*
               * ドラッグハンドルボタン
               * [GitHub blog 参照] キーボードドラッグ中のみ role="application" を動的適用。
               * スクリーンリーダーが矢印キーを横取りするのを防ぎ、移動操作を可能にする。
               * role="application" は最小限の DOM 要素に・必要な時だけ使用する。
               */}
              <button
                ref={(el: HTMLButtonElement | null) => {
                  if (el) handleRefs.current.set(item.id, el);
                  else handleRefs.current.delete(item.id);
                }}
                type="button"
                role={isKeyDragging ? 'application' : undefined}
                aria-label={
                  isKeyDragging
                    ? `${item.label}を移動中。上下矢印で移動、Enterで確定、Escapeでキャンセル`
                    : `${item.label}を移動する`
                }
                onKeyDown={(e) => handleHandleKeyDown(e, item.id)}
                className={[
                  'p-1.5 rounded flex-shrink-0 transition-colors',
                  isKeyDragging
                    ? 'cursor-default'
                    : 'cursor-grab active:cursor-grabbing',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {/* 6点ドットのドラッグハンドルアイコン */}
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <circle cx="5.5" cy="3.5" r="1.5" />
                  <circle cx="10.5" cy="3.5" r="1.5" />
                  <circle cx="5.5" cy="8" r="1.5" />
                  <circle cx="10.5" cy="8" r="1.5" />
                  <circle cx="5.5" cy="12.5" r="1.5" />
                  <circle cx="10.5" cy="12.5" r="1.5" />
                </svg>
              </button>

              {/* 位置番号（視覚的インジケーター、スクリーンリーダーには非表示） */}
              <span
                aria-hidden="true"
                className={[
                  'text-xs font-mono w-5 flex-shrink-0 text-center tabular-nums',
                  isKeyDragging
                    ? 'text-accent font-bold'
                    : 'text-gray-400 dark:text-gray-500',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {index + 1}
              </span>

              {/* アイテムラベル */}
              <span className="flex-1 text-sm">{item.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
