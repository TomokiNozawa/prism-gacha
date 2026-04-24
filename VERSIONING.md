# Prismaera バージョン管理ルール

最終更新: 2026-04-25

---

## バージョン番号の形式

```
v{Season}.{公開章数}.{patch}
例: v1.1.3  =  Season 1 / 第1章公開 / patch 3番目
```

| 桁 | 意味 | bump条件 |
|---|---|---|
| **Season** | 大紀(第一大紀/第二大紀/第三大紀) | 新Season突入時。中桁は1にリセット |
| **章** | 公開済みの章数 (累計) | 新章追加時 |
| **patch** | 章追加を伴わない更新 | バグ修正/UI改善/新機能(章なし)/文言修正 |

### 現在のバージョン: **v1.1.1** (Season 1 第1章公開 + patch 1)

---

## 単一ソース (SSOT): `version.json`

バージョン情報は `/version.json` に一元管理。他のファイルは全てここから同期。

### version.json の書式
```json
{
  "version": "1.1.1",
  "releasedAt": "2026-04-25",
  "changelog": [
    {
      "version": "1.1.1",
      "date": "2026-04-25",
      "type": "patch",
      "notes": ["..."]
    }
  ]
}
```

`type`: `"major"` (章追加以上) / `"patch"` (章追加なし)
`notes`: ユーザーに見せる箇条書き(3〜6個推奨)

---

## 同期対象ファイル

bump実行時に **必ず同期更新** する5ファイル:

| # | ファイル | 更新箇所 |
|---|---|---|
| 1 | `version.json` | `version` / `releasedAt` / `changelog[0]` 追加 |
| 2 | `manifest.json` | `"version"` |
| 3 | `index.html` | `<span class="ver">v1.1.1</span>` (header) + `?v=YYYYMMDDx` キャッシュバスター |
| 4 | `README.md` | 「現在のバージョン」表記 |
| 5 | `script.js` / `style.css` | 冒頭コメント `Prismaera v1.1.1 — ...` |

---

## 自動化: `scripts/bump_version.py`

### 使い方

```bash
# patch bump (章追加なし)
python scripts/bump_version.py patch --note "表紙UX修正" --note "相関図モバイル対応"

# 章追加 (middle bump) — Season 1 第2章追加時
python scripts/bump_version.py chapter --note "第2章『南方海域の異変』追加"

# Season bump — Season 2 突入時
python scripts/bump_version.py season --note "Season 2 開幕"

# dry-run (ファイル変更せずに確認)
python scripts/bump_version.py patch --note "..." --dry-run
```

### 処理内容
1. `version.json` を読んで次バージョンを計算
2. `changelog[0]` に新エントリ追加
3. 上記5ファイルを同期更新
4. 変更内容をdiff表示して確認待ち → Enter で確定
5. (オプション) `git add` → `git commit -m "chore(version): v1.1.1"` を実行

---

## 運用ルール

### 2端末編集時の注意
このリポは **ノートPC + デスクトップPC** で共有。Box 同期されるが `.git` は破損しているため push はノート側で行う。

**必須フロー**:
1. 編集前に `git pull` (ノートPCなら ~/prism-gacha-work/、デスクトップは直接 Box を編集してからノートで cp+push)
2. `bump_version.py` を**実行するPCは1台だけ**にする(同時実行厳禁)
3. bump 実行直後に即 push → もう一方のPCは即 pull して追従

### 章追加時の必須チェック
- `STORY/s{S}c{C}.md` を追加したか
- `STORY/prompts/s{S}c{C}.md` に画像プロンプトを追加したか
- `STORY/outline.md` を最新化したか
- キャラクター `POOL` (script.js) に新規キャラを追加したか
- 画像を `images/characters/season{N}/{tier}/` に配置したか
- BGMを追加したか (任意)

章追加時は `bump_version.py chapter` で bump、上記チェック漏れを warning 表示する(TODO)。

### changelog に書く粒度
- ユーザー(非エンジニア)視点で嬉しい変化を **1項目 = 30〜50字** で
- 内部リファクタ、コメント修正など見た目変わらないものは書かない(patch内で勝手にやる)
- 例: ○「キャラ詳細の画像がスマホでズレる問題を修正」 ×「showCharDetail の margin-right 計算を修正」

---

## changelog の履歴管理

- `version.json` の `changelog` 配列に **最新を先頭** で積む
- 全履歴を持つ(削除しない)
- ユーザーが「📜 履歴を見る」ボタンで全changelog閲覧可能

---

## バージョン通知ポップアップ (実装済み)

`index.html` 起動時に以下を実行:

1. `fetch('version.json')` で最新版取得
2. `localStorage.getItem('prismaera-last-seen-version')` と比較
3. 異なる場合 **更新通知モーダル** を表示
   - 新バージョン番号 + changelog 箇条書き
   - 「確認」ボタン → localStorage 更新 + モーダル閉じる
   - 「強制リロード」ボタン → `location.reload(true)` (キャッシュ破棄)
4. 同じ場合は何もしない

初回アクセス(`last-seen-version` 未設定)時は通知を出さず、現バージョンを即保存する(スパムにならないよう)。
