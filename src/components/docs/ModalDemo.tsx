import { useState } from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import ComponentDemo from './ComponentDemo';

const ModalDemo = () => {
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-8">
      <ComponentDemo
        title="基本的なモーダル"
        description="Escキーまたは閉じるボタンで閉じられます"
      >
        <Button onClick={() => setIsBasicOpen(true)}>モーダルを開く</Button>
        <Modal
          isOpen={isBasicOpen}
          onClose={() => setIsBasicOpen(false)}
          title="基本的なモーダル"
        >
          <p>
            これは基本的なモーダルダイアログです。
            Escキーで閉じるか、右上の×ボタンをクリックしてください。
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsBasicOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={() => setIsBasicOpen(false)}>確認</Button>
          </div>
        </Modal>
      </ComponentDemo>

      <ComponentDemo
        title="フォーム付きモーダル"
        description="フォーカストラップにより、Tabキーでモーダル内を循環します"
      >
        <Button onClick={() => setIsFormOpen(true)}>
          フォーム付きモーダルを開く
        </Button>
        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title="お問い合わせ"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsFormOpen(false);
            }}
          >
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium  mb-1"
                >
                  お名前
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium  mb-1"
                >
                  メールアドレス
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium  mb-1"
                >
                  メッセージ
                </label>
                <textarea
                  id="message"
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                キャンセル
              </Button>
              <Button type="submit">送信</Button>
            </div>
          </form>
        </Modal>
      </ComponentDemo>

      <section className="mt-12">
        <h2>アクセシビリティのポイント</h2>
        <ul>
          <li>
            ネイティブ <code>&lt;dialog&gt;</code> 要素 +{' '}
            <code>showModal()</code> を使用
          </li>
          <li>
            <code>showModal()</code> がフォーカストラップ・背景の{' '}
            <code>inert</code>・top layer 配置を提供
          </li>
          <li>
            <code>aria-labelledby</code> でタイトルと関連付け
          </li>
          <li>
            Esc キーはネイティブの <code>cancel</code> イベントで処理
          </li>
          <li>閉じた時に元のトリガーにフォーカス復帰</li>
          <li>背景のスクロールを無効化</li>
        </ul>
      </section>
    </div>
  );
};
export default ModalDemo;
