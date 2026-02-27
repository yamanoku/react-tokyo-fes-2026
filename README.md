<p align="center">
  <img src="./public/favicon.svg" alt="Accessible React UIロゴ" width="200" height="200">
</p>

<h1 align="center"><a href="https://react-tokyo-fes-2026.yamanoku.net/">Accessible React UI</a></h1>

Reactでアクセシブルなユーザーインターフェースを構築するためのコンポーネント集。

![Accessible React UIサイトのヒーローイメージ](./public/image.png)

## コンポーネント一覧

| デモページ | ソースコード |
| :--- | :--- |
| [Button](https://react-tokyo-fes-2026.yamanoku.net/components/button/) | [Button.tsx](https://github.com/yamanoku/react-tokyo-fes-2026/blob/main/src/components/ui/Button.tsx) |
| [Modal Dialog](https://react-tokyo-fes-2026.yamanoku.net/components/modal/) | [Modal.tsx](https://github.com/yamanoku/react-tokyo-fes-2026/blob/main/src/components/ui/Modal.tsx) |
| [Tabs](https://react-tokyo-fes-2026.yamanoku.net/components/tabs/) | [Tabs.tsx](https://github.com/yamanoku/react-tokyo-fes-2026/blob/main/src/components/ui/Tabs.tsx) |
| [Drop Down Menu](https://react-tokyo-fes-2026.yamanoku.net/components/menu/) | [Menu.tsx](https://github.com/yamanoku/react-tokyo-fes-2026/blob/main/src/components/ui/Menu.tsx) |
| [Carousel](https://react-tokyo-fes-2026.yamanoku.net/components/carousel/) | [Carousel.tsx](https://github.com/yamanoku/react-tokyo-fes-2026/blob/main/src/components/ui/Carousel.tsx) |
| [Tree View](https://react-tokyo-fes-2026.yamanoku.net/components/treeview/) | [TreeView.tsx](https://github.com/yamanoku/react-tokyo-fes-2026/blob/main/src/components/ui/TreeView.tsx) |
| [Sortable List](https://react-tokyo-fes-2026.yamanoku.net/components/sortable/) | [SortableList.tsx](https://github.com/yamanoku/react-tokyo-fes-2026/blob/main/src/components/ui/SortableList.tsx) |

## 技術スタック

- Astro
- React 18（@astrojs/reactがv18依存のため）
- Tailwind CSS

## 謝辞

このプロジェクトのコンポーネント設計・実装・アクセシビリティ修正は [Claude Sonnet 4.6](https://www.anthropic.com/claude) に協力してもらいました。

## 参考情報

- [ARIA Authoring Practices Guide | APG | WAI | W3C](https://www.w3.org/WAI/ARIA/apg/)
- [APG Patterns Examples](https://masup9.github.io/apg-patterns-examples/)
- [Exploring the challenges in creating an accessible sortable list (drag-and-drop) - The GitHub Blog](https://github.blog/engineering/user-experience/exploring-the-challenges-in-creating-an-accessible-sortable-list-drag-and-drop/)
