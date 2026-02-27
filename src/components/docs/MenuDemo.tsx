import { Menu } from '../ui/Menu';
import ComponentDemo from './ComponentDemo';

const MenuDemo = () => {
  const basicItems = [
    { id: 'profile', label: 'プロフィール', onClick: () => {} },
    { id: 'settings', label: '設定', onClick: () => {} },
    { id: 'logout', label: 'ログアウト', onClick: () => {} },
  ];

  const navItems = [
    { id: 'button', label: 'Button', href: '/components/button' },
    { id: 'modal', label: 'Modal Dialog', href: '/components/modal' },
    { id: 'tabs', label: 'Tabs', href: '/components/tabs' },
    { id: 'menu', label: 'Menu', href: '/components/menu' },
    { id: 'carousel', label: 'Carousel', href: '/components/carousel' },
    { id: 'treeview', label: 'Tree View', href: '/components/treeview' },
    { id: 'sortable', label: 'Sortable List', href: '/components/sortable' },
  ];

  const iconItems = [
    {
      id: 'edit',
      label: '編集',
      onClick: () => {},
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      ),
    },
    {
      id: 'copy',
      label: 'コピー',
      onClick: () => {},
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
        </svg>
      ),
    },
    {
      id: 'delete',
      label: '削除',
      onClick: () => {},
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <ComponentDemo
        title="基本的なメニュー"
        description="クリックまたはEnter/Space/矢印キーで開きます"
      >
        <Menu
          trigger="メニュー"
          items={basicItems}
          ariaLabel="ユーザーメニュー"
        />
      </ComponentDemo>

      <ComponentDemo
        title="ナビゲーションメニュー"
        description="リンク付きのメニュー項目"
      >
        <Menu
          trigger="ナビゲーション"
          items={navItems}
          ariaLabel="ナビゲーションメニュー"
        />
      </ComponentDemo>

      <ComponentDemo
        title="アイコン付きメニュー"
        description="各項目にアイコンを表示"
      >
        <Menu
          trigger="アクション"
          items={iconItems}
          ariaLabel="アクションメニュー"
        />
      </ComponentDemo>

      <section className="mt-12">
        <h2>実装時のチェックポイント</h2>
        <ul>
          <li>
            トリガーに
            <code>aria-haspopup="menu"</code>と<code>aria-expanded</code>
            を設定
          </li>
          <li>
            メニューに
            <code>role="menu"</code>、 項目に
            <code>role="menuitem"</code>
          </li>
          <li>
            メニュー項目は
            <code>tabindex="-1"</code>
            （矢印キーで移動）
          </li>
          <li>上下矢印キーで項目間を移動</li>
          <li>Home/Endキーで最初/最後の項目へ</li>
          <li>Escキーで閉じてトリガーにフォーカス復帰</li>
          <li>メニュー外クリックで閉じる</li>
        </ul>
      </section>
    </div>
  );
};

export default MenuDemo;
