# Prismaera

課金なしで「脳汁体験」だけを浴びるブラウザガチャ+物語シミュ(旧称: Prism Gacha)。
+ タワーディフェンスゲーム **Prism Defense** も同梱。

- **Prismaera URL**: https://tomokinozawa.github.io/prism-gacha/ (GitHub Pagesパスは旧リポ名のまま)
- **Prism Defense URL**: https://tomokinozawa.github.io/prism-gacha/td/
- **排出率**: R 65% / SR 25% / SSR 7% / UR 3% / LR 0.5%
- **天井**: 180連
- **操作**: Space=単発 / Enter=10連 / Gキー=図鑑
- **保存**: ブラウザの localStorage (将来Firebase対応予定)

## 世界観 (大枠)

詳細は [`DESIGN.md`](DESIGN.md) を参照。

- **原虹 (げんそう)**: 万物の源、7色の光
- **観測者の七座**: 各色に対応する原理の人格化 (現在3座着任、4座空席)
- **観測者の三柱**: セラフィエル / カグヤ / ノクス (姉妹ではなく独立した3神格)
- **影喰い**: 観測されない側の意志、世界を脅かす敵
- **5つの世界軸**: 神性 / 王権 / 野生 / 叡智 / 境界

## ストーリー

詳細プロット → [`STORY/outline.md`](STORY/outline.md) (Season 1-3 全21章)
本編 → [`STORY/s1c1.md`](STORY/s1c1.md) (Season 1 第1章本文)

## フォルダ構成

```
gacha-sim/
├── DESIGN.md           設計書 (全体方針)
├── README.md           この資料
├── prompts.md          画像生成プロンプト集
├── index.html          エントリポイント
├── script.js           ゲームロジック
├── style.css           スタイル
├── .gitignore
├── .nojekyll           GitHub Pages 用
│
├── images/             画像
│   ├── characters/
│   │   └── season1/
│   │       ├── lr/     LR (1体)
│   │       ├── ur/     UR (5体)
│   │       ├── ssr/    SSR (8体)
│   │       ├── sr/     SR (10体)
│   │       └── r/      R (6体)
│   └── fx/             演出用画像 (柱・パーティクル等)
│
├── assets/             音声・音楽
│   ├── bgm/            BGM (Suno生成)
│   │   └── home.mp3    ホーム画面BGM
│   ├── voices/         キャラボイス (VOICEVOX、将来)
│   └── se/             効果音 (将来、現在は Web Audio API で合成)
│
├── sounds/             旧音声フォルダ (現在未使用)
│
├── STORY/              ストーリー文書
│   ├── outline.md      21章アウトライン
│   └── s1c1.md         Season1 第1章本文
│
└── td/                 Prism Defense (TDゲーム)
    ├── index.html
    ├── script.js
    └── style.css
```

## Prism Defense 概要

- **iPhone縦持ち前提** のレーン型タワーディフェンス
- **6章 / 30ステージ** (章境に中ボス、10/20/30話に章ボス)
- **ガチャで引けるかに関係なく全30体** を自由に編成可能 (最大6体)
- **進行度はブラウザに保存**

## 開発メモ

- **想定ユーザー**: 友人10人程度 (公開は様子見)
- **画像生成**: GPT (Image gen) — Claudeがプロンプトテンプレ提供
- **BGM生成**: Suno
- **将来**: VOICEVOX でボイス追加、Firebase でクラウドセーブ

## ライセンス

個人/社内利用限定のジョーク・合宿ネタ向け。キャラ画像はAI生成のオリジナルキャラクター、特定作品のコピーではありません。
