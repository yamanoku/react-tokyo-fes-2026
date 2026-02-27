import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
  type MutableRefObject,
} from 'react';

export interface TreeNodeData {
  id: string;
  label: string;
  children?: TreeNodeData[];
}

interface TreeViewProps {
  nodes: TreeNodeData[];
  /** ツリー全体のアクセシブルな名前 */
  label: string;
}

// ─── ヘルパー関数 ─────────────────────────────────────────────────────────────

/** 現在表示されているノードの ID を DOM 順で返す（折りたたまれた子孫は含まない） */
function getVisibleIds(nodes: TreeNodeData[], expandedIds: Set<string>): string[] {
  const result: string[] = [];
  function traverse(list: TreeNodeData[]) {
    for (const node of list) {
      result.push(node.id);
      if (node.children && expandedIds.has(node.id)) {
        traverse(node.children);
      }
    }
  }
  traverse(nodes);
  return result;
}

/** nodeId → 親 nodeId のマップを構築する */
function buildParentMap(
  nodes: TreeNodeData[],
  parentId: string | null,
  map: Map<string, string | null>,
): void {
  for (const node of nodes) {
    map.set(node.id, parentId);
    if (node.children) buildParentMap(node.children, node.id, map);
  }
}

// ─── TreeItem ─────────────────────────────────────────────────────────────────

interface TreeItemProps {
  node: TreeNodeData;
  level: number;
  setSize: number;
  posInSet: number;
  expandedIds: Set<string>;
  selectedId: string | null;
  focusedId: string;
  /** ツリー全体が DOM フォーカスを持っているか（focus ring 表示判定に使用） */
  isTreeFocused: boolean;
  itemRefs: MutableRefObject<Map<string, HTMLLIElement>>;
  onKeyDown: (e: KeyboardEvent<HTMLLIElement>, node: TreeNodeData) => void;
  onItemClick: (node: TreeNodeData) => void;
}

function TreeItemComponent({
  node,
  level,
  setSize,
  posInSet,
  expandedIds,
  selectedId,
  focusedId,
  isTreeFocused,
  itemRefs,
  onKeyDown,
  onItemClick,
}: TreeItemProps) {
  const hasChildren = (node.children?.length ?? 0) > 0;
  const isExpanded = hasChildren && expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const isFocused = focusedId === node.id;

  return (
    <li
      ref={(el) => {
        if (el) itemRefs.current.set(node.id, el);
        else itemRefs.current.delete(node.id);
      }}
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      aria-level={level}
      aria-setsize={setSize}
      aria-posinset={posInSet}
      tabIndex={isFocused ? 0 : -1}
      onKeyDown={(e) => {
        // [Bug 3 修正] stopPropagation で親 li への keydown 二重発火を防ぐ
        e.stopPropagation();
        onKeyDown(e, node);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onItemClick(node);
      }}
      className="outline-none list-none"
    >
      {/* 行コンテンツ */}
      <div
        className={[
          'flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer select-none text-sm',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          isFocused && isTreeFocused
            ? 'ring-2 ring-accent ring-offset-1'
            : '',
          isSelected ? 'bg-accent/10 text-accent font-medium' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* 展開/折りたたみ chevron */}
        {hasChildren ? (
          <svg
            className={`w-4 h-4 flex-shrink-0 transition-transform duration-150 ${isExpanded ? 'rotate-90' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <span className="w-4 flex-shrink-0" aria-hidden="true" />
        )}

        {/* フォルダ / ファイルアイコン */}
        {hasChildren ? (
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
        )}

        <span>{node.label}</span>
      </div>

      {/* 子ノードグループ */}
      {hasChildren && isExpanded && (
        <ul role="group" className="ml-5 border-l border-component-block pl-1">
          {node.children!.map((child, index) => (
            <TreeItemComponent
              key={child.id}
              node={child}
              level={level + 1}
              setSize={node.children!.length}
              posInSet={index + 1}
              expandedIds={expandedIds}
              selectedId={selectedId}
              focusedId={focusedId}
              isTreeFocused={isTreeFocused}
              itemRefs={itemRefs}
              onKeyDown={onKeyDown}
              onItemClick={onItemClick}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// ─── TreeView ─────────────────────────────────────────────────────────────────

export function TreeView({ nodes, label }: TreeViewProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string>(nodes[0]?.id ?? '');
  // [Bug 2 修正] ツリーが実際に DOM フォーカスを持っているかを追跡
  const [isTreeFocused, setIsTreeFocused] = useState(false);
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const parentMapRef = useRef(new Map<string, string | null>());
  // [Bug 1 修正] キーボード操作・クリックによる意図的なフォーカス移動のみ .focus() を呼ぶ
  const shouldFocusProgrammatically = useRef(false);

  useEffect(() => {
    parentMapRef.current.clear();
    buildParentMap(nodes, null, parentMapRef.current);
  }, [nodes]);

  // [Bug 1 修正] shouldFocusProgrammatically が true のときだけ DOM フォーカスを移動する。
  // マウント時は false のままなので自動フォーカスが発生しない。
  useEffect(() => {
    if (focusedId && shouldFocusProgrammatically.current) {
      itemRefs.current.get(focusedId)?.focus();
      shouldFocusProgrammatically.current = false;
    }
  }, [focusedId]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLLIElement>, node: TreeNodeData) => {
      const hasChildren = (node.children?.length ?? 0) > 0;
      const visibleIds = getVisibleIds(nodes, expandedIds);
      const currentIndex = visibleIds.indexOf(node.id);

      // フォーカスを移動するヘルパー（shouldFocusProgrammatically を立ててから setState）
      const moveFocus = (id: string) => {
        shouldFocusProgrammatically.current = true;
        setFocusedId(id);
      };

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          if (currentIndex < visibleIds.length - 1) {
            moveFocus(visibleIds[currentIndex + 1]);
          }
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          if (currentIndex > 0) {
            moveFocus(visibleIds[currentIndex - 1]);
          }
          break;
        }
        case 'ArrowRight': {
          event.preventDefault();
          if (!hasChildren) break;
          if (!expandedIds.has(node.id)) {
            setExpandedIds((prev) => new Set([...prev, node.id]));
          } else {
            const firstChild = node.children?.[0];
            if (firstChild) moveFocus(firstChild.id);
          }
          break;
        }
        case 'ArrowLeft': {
          event.preventDefault();
          if (hasChildren && expandedIds.has(node.id)) {
            setExpandedIds((prev) => {
              const next = new Set(prev);
              next.delete(node.id);
              return next;
            });
          } else {
            const parentId = parentMapRef.current.get(node.id);
            if (parentId) moveFocus(parentId);
          }
          break;
        }
        case 'Home': {
          event.preventDefault();
          if (visibleIds.length > 0) moveFocus(visibleIds[0]);
          break;
        }
        case 'End': {
          event.preventDefault();
          if (visibleIds.length > 0) moveFocus(visibleIds[visibleIds.length - 1]);
          break;
        }
        case 'Enter': {
          event.preventDefault();
          setSelectedId(node.id);
          if (hasChildren) {
            setExpandedIds((prev) => {
              const next = new Set(prev);
              if (next.has(node.id)) next.delete(node.id);
              else next.add(node.id);
              return next;
            });
          }
          break;
        }
        case ' ': {
          event.preventDefault();
          setSelectedId(node.id);
          break;
        }
        default:
          return;
      }
    },
    [nodes, expandedIds],
  );

  const handleItemClick = useCallback((node: TreeNodeData) => {
    // クリックでは .focus() は useEffect 経由ではなくブラウザのネイティブ動作に委ねる
    // （クリック時は li[tabIndex=-1] がクリックされた時点で自動的に DOM フォーカスを得る）
    setFocusedId(node.id);
    setSelectedId(node.id);
    if (node.children?.length) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        if (next.has(node.id)) next.delete(node.id);
        else next.add(node.id);
        return next;
      });
    }
  }, []);

  return (
    <ul
      role="tree"
      aria-label={label}
      className="p-2 rounded-lg border border-component-block font-mono text-sm"
      // [Bug 2 修正] ツリー内のどの要素にフォーカスがあっても onFocus がバブルしてくる
      onFocus={() => setIsTreeFocused(true)}
      // relatedTarget がツリー内の要素でなければツリーからフォーカスが出たと判断
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsTreeFocused(false);
        }
      }}
    >
      {nodes.map((node, index) => (
        <TreeItemComponent
          key={node.id}
          node={node}
          level={1}
          setSize={nodes.length}
          posInSet={index + 1}
          expandedIds={expandedIds}
          selectedId={selectedId}
          focusedId={focusedId}
          isTreeFocused={isTreeFocused}
          itemRefs={itemRefs}
          onKeyDown={handleKeyDown}
          onItemClick={handleItemClick}
        />
      ))}
    </ul>
  );
}

