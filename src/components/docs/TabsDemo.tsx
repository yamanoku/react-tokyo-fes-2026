import { Tabs } from '../ui/Tabs';
import ComponentDemo from './ComponentDemo';

const TabsDemo = () => {
  const contentTabs = [
    {
      id: 'overview',
      label: '概要',
      content: (
        <div>
          <h3>製品概要</h3>
          <p>
            この製品は、アクセシビリティを重視した設計になっています。<br />
            すべてのユーザーが快適に利用できるよう、様々な配慮がなされています。
          </p>
        </div>
      ),
    },
    {
      id: 'features',
      label: '機能',
      content: (
        <div>
          <h3>主な機能</h3>
          <ul>
            <li>キーボード完全対応</li>
            <li>スクリーンリーダー対応</li>
            <li>高コントラスト表示</li>
            <li>フォーカス管理</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'specs',
      label: '仕様',
      content: (
        <div>
          <h3>技術仕様</h3>
          <dl className="space-y-2">
            <div>
              <dt>対応ブラウザ</dt>
              <dd>Chrome, Firefox, Safari, Edge</dd>
            </div>
            <div>
              <dt>WCAG準拠</dt>
              <dd>WCAG 2.1 AA</dd>
            </div>
          </dl>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <ComponentDemo
        title="コンテンツ付きタブ"
        description="左右矢印キーでタブを切り替えられます"
      >
        <Tabs tabs={contentTabs} ariaLabel="製品情報タブ" />
      </ComponentDemo>

      <section className="mt-12">
        <h2>
          実装時のチェックポイント
        </h2>
        <ul>
          <li>
            <code>role="tablist"</code>、
            <code>role="tab"</code>、
            <code>role="tabpanel"</code>
            を適切に設定
          </li>
          <li>
            <code>aria-selected</code>
            で選択状態を明示
          </li>
          <li>
            <code>aria-controls</code>と
            <code>aria-labelledby</code>
            でタブとパネルを関連付け
          </li>
          <li>
            選択されていないタブは
            <code>tabindex="-1"</code>
          </li>
          <li>矢印キー（左右）でタブ間を移動</li>
          <li>Home/Endキーで最初/最後のタブに移動</li>
        </ul>
      </section>
    </div>
  );
}
export default TabsDemo;
