#!/usr/bin/env bash
# Prismaera: work copy → Box prismaera/ 同期スクリプト
#
# 使い方:
#   bash scripts/sync_to_box.sh             # 通常実行 (確認なし)
#   bash scripts/sync_to_box.sh --dry-run   # 何がコピーされるか表示するだけ
#
# 動作:
#   - ~/prism-gacha-work/ → ~/Box/DIK & Company/06_Other/野沢用/claude/prismaera/
#   - .git/ と node_modules/ と .DS_Store は除外
#   - ファイルが Box 側のみに存在する場合は削除しない (--delete しない)
#     → Box 側に独自ファイル (sounds/, voices/, prompts/bgm/ 等) があるため
#
# 推奨運用: git push 後にこのスクリプトを走らせる。
# git push と一緒にやりたいなら .git/hooks/post-push に書く。

set -euo pipefail

WORK_DIR="$HOME/prism-gacha-work"
BOX_DIR="$HOME/Box/DIK & Company/06_Other/野沢用/claude/prismaera"

if [[ ! -d "$WORK_DIR" ]]; then
  echo "❌ work copy が見つかりません: $WORK_DIR"
  exit 1
fi
if [[ ! -d "$BOX_DIR" ]]; then
  echo "❌ Box フォルダが見つかりません: $BOX_DIR"
  echo "   (Box Drive がマウント済みか確認、 もしくは別パスなら scripts/sync_to_box.sh を編集)"
  exit 1
fi

DRY_RUN=""
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN="--dry-run"
  echo "🔍 dry-run モード: 実際のコピーは行わない"
fi

echo "📁 source: $WORK_DIR"
echo "📁 target: $BOX_DIR"
echo "---"

# rsync が無い環境 (Git Bash for Windows 標準) では cp + diff fallback
if command -v rsync >/dev/null 2>&1; then
  rsync -av $DRY_RUN \
    --exclude='.git/' \
    --exclude='node_modules/' \
    --exclude='.DS_Store' \
    --exclude='*.swp' \
    "$WORK_DIR/" "$BOX_DIR/"
else
  echo "⚠️ rsync 未検出、 cp -ru で代替 (新規/更新ファイルのみコピー、 Box側独自ファイルは保持)"
  if [[ -n "$DRY_RUN" ]]; then
    echo "(dry-run: cp は実行しません)"
  else
    # Git Bash の cp -ru: 更新時間を見て新しいファイルだけコピー
    # .git は除外
    (cd "$WORK_DIR" && find . -type f \
      -not -path './.git/*' \
      -not -path './node_modules/*' \
      -not -name '.DS_Store' \
      -not -name '*.swp' \
      -print0 | while IFS= read -r -d '' f; do
        target="$BOX_DIR/${f#./}"
        target_dir="$(dirname "$target")"
        mkdir -p "$target_dir"
        cp -u "$f" "$target"
      done)
  fi
fi

echo "---"
echo "✅ 同期完了"
