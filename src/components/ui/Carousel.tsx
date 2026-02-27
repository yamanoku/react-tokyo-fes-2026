import { useState, useCallback, type ReactNode } from 'react';

export interface CarouselSlide {
  id: string;
  /** スライドのアクセシブルな名前。aria-label とライブ通知に使用される */
  label: string;
  content: ReactNode;
}

interface CarouselProps {
  slides: CarouselSlide[];
  /** カルーセル全体のアクセシブルな名前 */
  label: string;
}

export function Carousel({ slides, label }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = slides.length;

  // 循環ナビゲーション
  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(((index % total) + total) % total);
    },
    [total],
  );

  return (
    // aria-roledescription="carousel" でカルーセル領域を明示
    // aria-label でカルーセルの目的をスクリーンリーダーに伝達
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className="w-full"
    >
      {/*
        aria-live="polite" + aria-atomic="true":
        スライド切り替え時に「スライドラベル、N / M」を通知（WCAG 4.1.3）
        視覚的には非表示だがスクリーンリーダーには読み上げられる
      */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {slides[currentIndex]?.label}、スライド {currentIndex + 1} / {total}
      </div>

      {/* スライドエリア */}
      <div className="border border-component-block rounded-lg">
        {slides.map((slide, index) => (
          /*
            role="group" + aria-roledescription="slide":
            各スライドを「スライド」として意味付け
            aria-label で位置（N / M）とスライドの名前を提供
            hidden 属性で非表示スライドをアクセシビリティツリーから除外
          */
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${total}: ${slide.label}`}
            hidden={index !== currentIndex}
            className="p-8 min-h-48"
          >
            {slide.content}
          </div>
        ))}
      </div>

      {/* コントロール: 前へ・インジケーター・次へ */}
      <div className="flex items-center justify-between mt-3 gap-4">
        {/*
          前へボタン: min-w-11 min-h-11 (44px) でタッチターゲット最小基準確保（WCAG 2.5.8）
          自動再生なし・ドラッグなし（WCAG 2.2.2・2.5.7）
        */}
        <button
          type="button"
          onClick={() => goTo(currentIndex - 1)}
          aria-label="前のスライド"
          className="min-w-11 min-h-11 flex items-center justify-center rounded border border-component-block hover:border-accent transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* インジケーター + 視覚的カウント */}
        <div className="flex flex-col items-center gap-2">
          {/*
            role="group" + aria-label: インジケーターのグループを明示
            各ボタンの aria-label は現在表示中かどうかを含む
            ボタンサイズ w-6 h-6 (24px) で WCAG 2.5.8 の最小基準を確保
          */}
          <div role="group" aria-label="スライドを選択" className="flex gap-1">
            {slides.map((slide, index) => {
              const isCurrent = index === currentIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`${slide.label}、スライド ${index + 1}${isCurrent ? '（現在表示中）' : ''}`}
                  className="w-6 h-6 flex items-center justify-center rounded-full"
                >
                  <span
                    className={`block w-2.5 h-2.5 rounded-full transition-colors ${
                      isCurrent ? 'bg-accent' : 'bg-gray-300 hover:bg-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
          {/* 視覚的スライドカウント: スクリーンリーダーにはライブ通知で伝達済みのため非表示 */}
          <p className="text-xs" aria-hidden="true">
            {currentIndex + 1} / {total}
          </p>
        </div>

        {/* 次へボタン */}
        <button
          type="button"
          onClick={() => goTo(currentIndex + 1)}
          aria-label="次のスライド"
          className="min-w-11 min-h-11 flex items-center justify-center rounded border border-component-block hover:border-accent transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
