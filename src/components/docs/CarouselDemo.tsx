import { Carousel, type CarouselSlide } from '../ui/Carousel';
import ComponentDemo from './ComponentDemo';

const wcagSlides: CarouselSlide[] = [
  {
    id: 'perceivable',
    label: '知覚可能',
    content: (
      <div>
        <h3>知覚可能（Perceivable）</h3>
        <p>
          情報と UI
          コンポーネントは、ユーザーが知覚できる方法で提示されなければなりません。
        </p>
        <ul>
          <li>非テキストコンテンツへの代替テキストの提供</li>
          <li>テキストと背景の十分なコントラスト比（4.5:1 以上）</li>
          <li>テキストのリサイズ・拡大表示への対応</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'operable',
    label: '操作可能',
    content: (
      <div>
        <h3>操作可能（Operable）</h3>
        <p>UI コンポーネントとナビゲーションは操作可能でなければなりません。</p>
        <ul>
          <li>キーボードのみですべての機能を操作できること</li>
          <li>フォーカスインジケーターの可視化</li>
          <li>自動再生コンテンツの一時停止・停止手段の提供</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'understandable',
    label: '理解可能',
    content: (
      <div>
        <h3>理解可能（Understandable）</h3>
        <p>情報と UI の操作は理解可能でなければなりません。</p>
        <ul>
          <li>
            ページの言語を <code>lang</code> 属性で明示
          </li>
          <li>エラーの特定と修正方法の提案</li>
          <li>一貫したナビゲーションとコンポーネントの配置</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'robust',
    label: '堅牢',
    content: (
      <div>
        <h3>堅牢（Robust）</h3>
        <p>
          コンテンツは支援技術を含むさまざまなユーザーエージェントが解釈できるよう堅牢でなければなりません。
        </p>
        <ul>
          <li>有効な HTML マークアップの使用</li>
          <li>ARIA ロールと属性の適切な実装</li>
          <li>スクリーンリーダーでの動作確認</li>
        </ul>
      </div>
    ),
  },
];

const CarouselDemo = () => {
  return (
    <div className="space-y-8">
      <ComponentDemo
        title="WCAG の4原則"
        description="前後ボタンまたはインジケーターでスライドを切り替えられます"
      >
        <Carousel slides={wcagSlides} label="WCAG 2.1 の4原則" />
      </ComponentDemo>

      <section className="mt-12">
        <h2>実装時のチェックポイント</h2>
        <ul>
          <li>
            <code>aria-roledescription="carousel"</code> でカルーセル領域を明示
          </li>
          <li>
            各スライドに <code>role="group"</code> +{' '}
            <code>aria-roledescription="slide"</code> + <code>aria-label</code>{' '}
            で位置（N / M）とタイトルを提供
          </li>
          <li>
            <code>aria-live="polite"</code> + <code>aria-atomic="true"</code>{' '}
            でスライド切り替え時にスクリーンリーダーへ通知（
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/status-messages"
              target="_blank"
              rel="noopener"
            >
              WCAG 4.1.3
            </a>
            ）
          </li>
          <li>
            自動再生なし（
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide"
              target="_blank"
              rel="noopener"
            >
              WCAG 2.2.2
            </a>
            ）・ドラッグ操作なし（
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements"
              target="_blank"
              rel="noopener"
            >
              WCAG 2.5.7
            </a>
            ）
          </li>
          <li>
            前後ボタンのタッチターゲット最小 44×44px、インジケーター最小
            24×24px（
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum"
              target="_blank"
              rel="noopener"
            >
              WCAG 2.5.8
            </a>
            ）
          </li>
          <li>
            <code>hidden</code>{' '}
            属性で非表示スライドをアクセシビリティツリーから除外
          </li>
          <li>
            スライド数は最大6枚を推奨（
            <a
              href="https://design.digital.go.jp/dads/components/carousel/usage/"
              target="_blank"
              rel="noopener"
            >
              デジタル庁 DADS ガイドライン
            </a>
            ）
          </li>
        </ul>
      </section>
    </div>
  );
};

export default CarouselDemo;
