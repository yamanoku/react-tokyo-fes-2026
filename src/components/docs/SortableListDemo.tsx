import { useState } from 'react';
import { type SortableItem, SortableList } from '../ui/SortableList';
import ComponentDemo from './ComponentDemo';

const initialTasks: SortableItem[] = [
  { id: 'keyboard', label: 'キーボードナビゲーション対応' },
  { id: 'focus', label: 'フォーカス管理の実装' },
  { id: 'live', label: 'スクリーンリーダー通知設定' },
  { id: 'contrast', label: 'カラーコントラスト確認' },
  { id: 'aria', label: 'ARIAラベルの追加' },
  { id: 'touch', label: 'タッチターゲットサイズ確認' },
];

const SortableListDemo = () => {
  const [lastOrder, setLastOrder] = useState<string[]>([]);

  return (
    <div className="space-y-8">
      <ComponentDemo
        title="ドラッグアンドドロップ可能なソートリスト"
        description="ドラッグハンドルをマウスでドラッグ、またはキーボードで Enter / Space を押して移動モードを開始"
      >
        <SortableList
          items={initialTasks}
          label="アクセシビリティ実装チェックリスト"
          onReorder={(items) => setLastOrder(items.map((i) => i.label))}
        />

        {lastOrder.length > 0 && (
          <output
            aria-label="並び替え後の順序"
            className="mt-4 p-3 rounded-md border border-component-block bg-accent/5 text-xs font-mono space-y-0.5"
          >
            <p className="text-gray-500 dark:text-gray-400 mb-1">
              最後に確定した順序:
            </p>
            <ol className="pl-8">
              {lastOrder.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ol>
          </output>
        )}
      </ComponentDemo>

      <section className="mt-12">
        <h2>アクセシビリティのポイント</h2>
        <ul>
          <li>
            <code>role="application"</code>{' '}
            をドラッグハンドルに動的適用（キーボードドラッグ中のみ）。
            スクリーンリーダーが矢印キーを横取りするのを防ぎ、上下移動操作を可能にする
          </li>
          <li>
            <code>aria-live="assertive"</code>{' '}
            でドロップ完了・移動中の位置をスクリーンリーダーに即時通知。
            高速移動時のアナウンス乱発を防ぐため 100ms debounce を適用
          </li>
          <li>
            キーボード操作（Enter または Space でドラッグ開始）:
            <ul>
              <li>Enter / Space: 移動モード開始</li>
              <li>↑ / ↓: 1つ上・下へ移動</li>
              <li>Enter: 位置を確定</li>
              <li>Escape: キャンセルして元の順序に戻す</li>
            </ul>
          </li>
          <li>
            ドラッグ確定・キャンセル後はドラッグハンドルにフォーカスを返し、
            ユーザーが操作を継続できるようにする
          </li>
          <li>
            順序が意味を持つリストには <code>{'<ol>'}</code>
            （順序付きリスト）を使用。
            スクリーンリーダーが「X項目中Y番目」と読み上げる
          </li>
          <li>
            マウスドラッグには HTML5 Drag and Drop API を使用。
            ドラッグ中は他のアイテムへのキーボードドラッグを無効化して競合を防ぐ
          </li>
        </ul>
      </section>
    </div>
  );
};

export default SortableListDemo;
