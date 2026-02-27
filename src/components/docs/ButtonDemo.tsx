import { useState } from 'react';
import { Button } from '../ui/Button';
import ComponentDemo from './ComponentDemo';

const ButtonDemo = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="space-y-8">
      <ComponentDemo
        title="基本的なボタン"
        description="variant propでスタイルを切り替えられます"
      >
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="サイズ"
        description="size propでサイズを変更できます"
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="無効状態"
        description="disabled属性によりフォーカス不可・操作不可になります"
      >
        <div className="flex flex-wrap gap-4">
          <Button disabled>Disabled Primary</Button>
          <Button variant="secondary" disabled>
            Disabled Secondary
          </Button>
          <Button variant="outline" disabled>
            Disabled Outline
          </Button>
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="ローディング状態"
        description="isLoading propでローディング表示。aria-busyが設定されます"
      >
        <div className="flex flex-wrap gap-4">
          <Button isLoading={isLoading} onClick={handleLoadingClick}>
            {isLoading ? '処理中' : 'クリックで読み込み'}
          </Button>
        </div>
      </ComponentDemo>

      <section className="mt-12">
        <h2>
          実装時のチェックポイント
        </h2>
        <ul>
          <li>
            ネイティブ <code>disabled</code> 属性でフォーカス不可・操作不可を表現
            （スクリーンリーダーに disabled 状態を暗黙的に伝達）
          </li>
          <li>
            ローディング時は
            <code>aria-busy=true</code>
            を設定
          </li>
          <li>
            アイコンは
            <code>aria-hidden=true</code>
            で装飾として扱う
          </li>
          <li>十分なフォーカス表示（2pxのoutline）</li>
          <li>マウス・キーボード両方で操作可能</li>
        </ul>
      </section>
    </div>
  );
};

export default ButtonDemo;
