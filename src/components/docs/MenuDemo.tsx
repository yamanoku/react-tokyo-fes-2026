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
