#!/usr/bin/env python3
"""Prismaera バージョン自動bumpスクリプト

使い方:
    python scripts/bump_version.py patch    --note "表紙UX修正"
    python scripts/bump_version.py chapter  --note "第2章追加"
    python scripts/bump_version.py season   --note "Season 2 開幕"
    python scripts/bump_version.py patch    --note "..." --dry-run
    python scripts/bump_version.py patch    --note "..." --auto-commit

処理:
    1. version.json を読んで次バージョン計算
    2. changelog[0] に新エントリ追加
    3. 同期対象ファイルを更新 (manifest.json, index.html, README.md, script.js, style.css)
    4. diff表示 → Enter確認
    5. --auto-commit 指定時は git add + commit
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VERSION_JSON = ROOT / "version.json"
MANIFEST_JSON = ROOT / "manifest.json"
INDEX_HTML = ROOT / "index.html"
README_MD = ROOT / "README.md"
SCRIPT_JS = ROOT / "script.js"
STYLE_CSS = ROOT / "style.css"


def load_version() -> dict:
    with VERSION_JSON.open(encoding="utf-8") as f:
        return json.load(f)


def next_version(current: str, mode: str) -> str:
    s, c, p = [int(x) for x in current.split(".")]
    if mode == "patch":
        return f"{s}.{c}.{p + 1}"
    if mode == "chapter":
        return f"{s}.{c + 1}.0"
    if mode == "season":
        return f"{s + 1}.1.0"
    raise ValueError(f"unknown mode: {mode}")


def bump_cache_buster(text: str) -> tuple[str, bool]:
    today = date.today().strftime("%Y%m%d")
    pattern = re.compile(r"\?v=\d{8}[a-z]")
    changed = False

    def repl(m: re.Match[str]) -> str:
        nonlocal changed
        changed = True
        return f"?v={today}a"

    return pattern.sub(repl, text), changed


def update_version_json(data: dict, new_ver: str, mode: str, notes: list[str]) -> None:
    today = date.today().isoformat()
    data["version"] = new_ver
    data["releasedAt"] = today
    entry = {
        "version": new_ver,
        "date": today,
        "type": "patch" if mode == "patch" else "major",
        "notes": notes,
    }
    data.setdefault("changelog", []).insert(0, entry)
    with VERSION_JSON.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


def update_manifest(new_ver: str) -> None:
    with MANIFEST_JSON.open(encoding="utf-8") as f:
        m = json.load(f)
    m["version"] = new_ver
    with MANIFEST_JSON.open("w", encoding="utf-8") as f:
        json.dump(m, f, ensure_ascii=False, indent=2)
        f.write("\n")


def update_index(new_ver: str) -> None:
    text = INDEX_HTML.read_text(encoding="utf-8")
    text = re.sub(
        r'(<span class="ver">)v[\d.]+(</span>)',
        lambda m: f"{m.group(1)}v{new_ver}{m.group(2)}",
        text,
    )
    text, _ = bump_cache_buster(text)
    INDEX_HTML.write_text(text, encoding="utf-8")


def update_readme(new_ver: str) -> None:
    if not README_MD.exists():
        return
    text = README_MD.read_text(encoding="utf-8")
    text = re.sub(r"現在のバージョン.*", f"現在のバージョン: **v{new_ver}**", text)
    text = re.sub(
        r"\*\*v\d+\.\d+\*\*\s*=\s*Season 1",
        f"**v{new_ver}** = Season 1",
        text,
        count=1,
    )
    README_MD.write_text(text, encoding="utf-8")


def update_code_comments(new_ver: str) -> None:
    for path in (SCRIPT_JS, STYLE_CSS):
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        text = re.sub(
            r"Prismaera v[\d.]+",
            f"Prismaera v{new_ver}",
            text,
            count=1,
        )
        path.write_text(text, encoding="utf-8")


def git_commit(new_ver: str) -> None:
    targets = [
        str(VERSION_JSON.relative_to(ROOT)),
        str(MANIFEST_JSON.relative_to(ROOT)),
        str(INDEX_HTML.relative_to(ROOT)),
        str(README_MD.relative_to(ROOT)),
        str(SCRIPT_JS.relative_to(ROOT)),
        str(STYLE_CSS.relative_to(ROOT)),
    ]
    subprocess.run(["git", "-C", str(ROOT), "add", *targets], check=True)
    subprocess.run(
        ["git", "-C", str(ROOT), "commit", "-m", f"chore(version): v{new_ver}"],
        check=True,
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Prismaera version bumper")
    parser.add_argument("mode", choices=["patch", "chapter", "season"])
    parser.add_argument("--note", action="append", required=True, help="changelog項目(複数可)")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--auto-commit", action="store_true")
    args = parser.parse_args()

    data = load_version()
    current = data["version"]
    new_ver = next_version(current, args.mode)

    print(f"バージョン: v{current} → v{new_ver} ({args.mode})")
    print("変更ノート:")
    for n in args.note:
        print(f"  - {n}")
    print()

    if args.dry_run:
        print("[dry-run] ファイルは変更しません")
        return 0

    update_version_json(data, new_ver, args.mode, list(args.note))
    update_manifest(new_ver)
    update_index(new_ver)
    update_readme(new_ver)
    update_code_comments(new_ver)
    print("ファイル更新完了")

    if args.auto_commit:
        git_commit(new_ver)
        print(f"git commit 実行完了 (chore(version): v{new_ver})")
    else:
        print("git commit はスキップ(--auto-commit で自動化可能)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
