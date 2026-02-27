import { TreeView, type TreeNodeData } from '../ui/TreeView';
import ComponentDemo from './ComponentDemo';

// JSX を含まない純粋なオブジェクトはモジュールレベルに定義可能
const fileSystemTree: TreeNodeData[] = [
  {
    id: 'public',
    label: 'public',
    children: [{ id: 'favicon-svg', label: 'favicon.svg' }],
  },
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          {
            id: 'ui',
            label: 'ui',
            children: [
              { id: 'button-tsx', label: 'Button.tsx' },
              { id: 'carousel-tsx', label: 'Carousel.tsx' },
              { id: 'menu-tsx', label: 'Menu.tsx' },
              { id: 'modal-tsx', label: 'Modal.tsx' },
              { id: 'sortablelist-tsx', label: 'SortableList.tsx' },
              { id: 'tabs-tsx', label: 'Tabs.tsx' },
              { id: 'treeview-tsx', label: 'TreeView.tsx' },
            ],
          },
          {
            id: 'layout',
            label: 'layout',
            children: [
              { id: 'footer-astro', label: 'Footer.astro' },
              { id: 'header-astro', label: 'Header.astro' },
            ],
          },
          {
            id: 'docs',
            label: 'docs',
            children: [
              { id: 'buttondemo-tsx', label: 'ButtonDemo.tsx' },
              { id: 'carouseldemo-tsx', label: 'CarouselDemo.tsx' },
              { id: 'componentdemo-tsx', label: 'ComponentDemo.tsx' },
              { id: 'menudemo-tsx', label: 'MenuDemo.tsx' },
              { id: 'modaldemo-tsx', label: 'ModalDemo.tsx' },
              { id: 'sortablelistdemo-tsx', label: 'SortableListDemo.tsx' },
              { id: 'tabsdemo-tsx', label: 'TabsDemo.tsx' },
              { id: 'treeviewdemo-tsx', label: 'TreeViewDemo.tsx' },
            ],
          },
        ],
      },
      {
        id: 'layouts',
        label: 'layouts',
        children: [{ id: 'baselayout-astro', label: 'BaseLayout.astro' }],
      },
      {
        id: 'pages',
        label: 'pages',
        children: [
          {
            id: 'components-dir',
            label: 'components',
            children: [
              { id: 'button-page', label: 'button.astro' },
              { id: 'carousel-page', label: 'carousel.astro' },
              { id: 'menu-page', label: 'menu.astro' },
              { id: 'modal-page', label: 'modal.astro' },
              { id: 'sortable-page', label: 'sortable.astro' },
              { id: 'tabs-page', label: 'tabs.astro' },
              { id: 'treeview-page', label: 'treeview.astro' },
            ],
          },
          { id: 'index-astro', label: 'index.astro' },
        ],
      },
      {
        id: 'styles',
        label: 'styles',
        children: [{ id: 'global-css', label: 'global.css' }],
      },
    ],
  },
  { id: 'gitignore', label: '.gitignore' },
  { id: 'astro-config', label: 'astro.config.mjs' },
  { id: 'package-json', label: 'package.json' },
  { id: 'pnpm-lock', label: 'pnpm-lock.yaml' },
  { id: 'readme-md', label: 'README.md' },
  { id: 'tsconfig-json', label: 'tsconfig.json' },
];

const TreeViewDemo = () => {
  return (
    <div className="space-y-8">
      <ComponentDemo
        title="ファイルシステムツリー"
        description="矢印キーでナビゲーション、Enter / Space で選択、右矢印で展開、左矢印で折りたたみ"
      >
        <TreeView nodes={fileSystemTree} label="プロジェクト構成" />
      </ComponentDemo>

      <section className="mt-12">
        <h2>アクセシビリティのポイント</h2>
        <ul>
          <li>
            ルートに <code>role="tree"</code>、各項目に <code>role="treeitem"</code>、
            子グループに <code>role="group"</code>
          </li>
          <li>
            <code>aria-expanded</code> で展開・折りたたみ状態を明示
            （子を持たないリーフノードには付与しない）
          </li>
          <li>
            <code>aria-selected</code> で選択状態を明示
          </li>
          <li>
            <code>aria-level</code>・<code>aria-setsize</code>・<code>aria-posinset</code>{' '}
            で階層の深さ・兄弟数・位置をスクリーンリーダーに伝達
          </li>
          <li>
            Roving tabindex: フォーカスされた項目のみ <code>tabindex="0"</code>、
            その他は <code>tabindex="-1"</code> でツリー全体を単一のタブ停止点にする
          </li>
          <li>
            キーボード操作（APG 準拠）:
            <ul>
              <li>↓ / ↑: 前後の可視ノードへ移動</li>
              <li>→: 閉じているノードを展開 / 開いているノードの最初の子へ移動</li>
              <li>←: 開いているノードを折りたたむ / 閉じているノードの親へ移動</li>
              <li>Home / End: 最初・最後の可視ノードへジャンプ</li>
              <li>Enter: 選択 + 子があれば展開/折りたたみトグル</li>
              <li>Space: 選択のみ</li>
            </ul>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default TreeViewDemo;
