#!/usr/bin/env python3
"""Prismaera cache buster だけを bump (version 据え置き)

使い方:
    python scripts/bump_cache.py                   # bump して diff 表示 → Enter で確定
    python scripts/bump_cache.py --auto-commit     # 確認なしで commit
    python scripts/bump_cache.py --dry-run         # 何が変わるかだけ表示

動作:
    index.html (および manifest.json link 等) の `?v=YYYYMMDD[a-z]` を見つけて、
    - 今日と同じ日付: 末尾の文字を a→b→c...→z にインクリメント
    - 日付が違う: `{today}a` にリセット
    - 全部統一して書き戻し

bump_version.py が版を bump する時にも cache buster は更新されるが、
コードだけ修正してデプロイしたい時 (UIだけ調整・バグ修正等) はこちらを使う。
"""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from datetime import date
from pathlib import Path

# Windows: 絵文字+日本語 が CP932 で死ぬので UTF-8 へ明示切替
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = Path(__file__).resolve().parent.parent
INDEX_HTML = ROOT / "index.html"


def find_current_buster(text: str) -> tuple[str, str] | None:
    """既存の cache buster `?v=YYYYMMDD[a-z]` を1つ拾う (全部同じ前提)"""
    m = re.search(r"\?v=(\d{8})([a-z])", text)
    if not m:
        return None
    return m.group(1), m.group(2)


def next_buster(current_date: str, current_letter: str) -> str:
    today = date.today().strftime("%Y%m%d")
    if current_date != today:
        return f"{today}a"
    if current_letter == "z":
        # 同日に26回も bump したら 強制 z 維持 (実用上ありえない)
        print("⚠️ 1日の bump が 26回を超えました、 z で維持")
        return f"{today}z"
    next_letter = chr(ord(current_letter) + 1)
    return f"{today}{next_letter}"


def bump(dry_run: bool, auto_commit: bool) -> None:
    text = INDEX_HTML.read_text(encoding="utf-8")
    cur = find_current_buster(text)
    if cur is None:
        print("❌ index.html に `?v=YYYYMMDD[a-z]` の cache buster が見つかりません")
        sys.exit(1)
    cur_date, cur_letter = cur
    new_buster = next_buster(cur_date, cur_letter)
    old_buster = f"{cur_date}{cur_letter}"

    print(f"📦 cache buster: ?v={old_buster} → ?v={new_buster}")
    if old_buster == new_buster:
        print("→ 変化なし、 終了")
        return

    new_text = re.sub(r"\?v=\d{8}[a-z]", f"?v={new_buster}", text)
    if dry_run:
        print("--- dry-run、 ファイル書き換えなし ---")
        return

    INDEX_HTML.write_text(new_text, encoding="utf-8")
    n = len(re.findall(rf"\?v={new_buster}", new_text))
    print(f"✅ index.html 更新 ({n}箇所)")

    if auto_commit:
        try:
            subprocess.run(
                ["git", "add", str(INDEX_HTML)],
                check=True,
                cwd=str(ROOT),
            )
            subprocess.run(
                ["git", "commit", "-m", f"chore(cache): bump buster to {new_buster}"],
                check=True,
                cwd=str(ROOT),
            )
            print(f"✅ commit 作成完了 (?v={new_buster})")
        except subprocess.CalledProcessError as e:
            print(f"⚠️ git commit 失敗: {e}")
    else:
        print("→ 確認後 git add + commit してください (--auto-commit で自動化可)")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dry-run", action="store_true", help="何が変わるか表示するだけ")
    ap.add_argument("--auto-commit", action="store_true", help="確認なしで git commit まで")
    args = ap.parse_args()
    bump(dry_run=args.dry_run, auto_commit=args.auto_commit)


if __name__ == "__main__":
    main()
