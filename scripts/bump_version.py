#!/usr/bin/env python3
"""Prismaera バージョン自動bumpスクリプト

使い方:
    # main branch (X.Y.Z bump):
    python scripts/bump_version.py patch    --note "表紙UX修正"
    python scripts/bump_version.py chapter  --note "第2章追加"
    python scripts/bump_version.py season   --note "Season 2 開幕"
    python scripts/bump_version.py patch    --note "..." --dry-run
    python scripts/bump_version.py patch    --note "..." --auto-commit

    # dev branch (suffix 1段階 増分):
    python scripts/bump_version.py dev-suffix
    # → 1.4.2g → 1.4.2h、 1.4.2z → 1.4.2aa、 1.4.2zz → 1.4.2aaa (無制限 increment)

仕様 (野沢さん指示 2026-05-05、 二度と起こらない設計):
    - cache buster と version.json の version は完全同期
      ?v=1.4.2g (旧 ?v=20260505a 廃止、 日付ベースは禁止)
    - dev での suffix 進行は a→b→...→z→aa→ab→...→zz→aaa→...
    - main merge 後の dev は a から再開 (例: main 1.4.3 → dev 1.4.3a)
    - 主バージョン X.Y.Z bump は main release 時のみ

処理:
    1. version.json を読んで次バージョン計算
    2. dev-suffix の場合: suffix を 1段階増分
       patch/chapter/season の場合: X.Y.Z bump + suffix を空に
    3. changelog[0] に新エントリ追加 (dev-suffix は changelog 追加せず pendingChangelog のまま)
    4. 同期対象ファイルの cache buster + version 表示を一括更新
       (manifest.json, index.html, cardgame/index.html, cardgame/script.js,
        script.js, style.css, sw.js, README.md)
    5. --auto-commit 指定時は git add + commit
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from datetime import date, datetime, timezone, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VERSION_JSON = ROOT / "version.json"
MANIFEST_JSON = ROOT / "manifest.json"
INDEX_HTML = ROOT / "index.html"
CARDGAME_INDEX = ROOT / "cardgame" / "index.html"
CARDGAME_SCRIPT = ROOT / "cardgame" / "script.js"
SW_JS = ROOT / "sw.js"
README_MD = ROOT / "README.md"
SCRIPT_JS = ROOT / "script.js"
STYLE_CSS = ROOT / "style.css"

CACHE_BUSTER_FILES = [INDEX_HTML, CARDGAME_INDEX, CARDGAME_SCRIPT, SW_JS]


def load_version() -> dict:
    with VERSION_JSON.open(encoding="utf-8") as f:
        return json.load(f)


def parse_version(v: str) -> tuple[str, str]:
    """1.4.2g → ('1.4.2', 'g'); 1.4.2 → ('1.4.2', ''); 1.4.2zz → ('1.4.2', 'zz')"""
    m = re.match(r"^(\d+\.\d+\.\d+)([a-z]*)$", v)
    if not m:
        raise ValueError(f"unexpected version: {v!r} (期待形式: X.Y.Z or X.Y.Z<suffix>)")
    return m.group(1), m.group(2)


def increment_suffix(s: str) -> str:
    """Excel column 風の 文字列 increment:
    '' → 'a', 'a' → 'b', ..., 'z' → 'aa', 'aa' → 'ab', ..., 'zz' → 'aaa'"""
    if not s:
        return "a"
    chars = list(s)
    i = len(chars) - 1
    while i >= 0:
        if chars[i] < "z":
            chars[i] = chr(ord(chars[i]) + 1)
            return "".join(chars)
        chars[i] = "a"
        i -= 1
    # 全 z だった → 1 文字長くして 'a' prefix
    return "a" + "".join(chars)


def next_version(current: str, mode: str, last_dev_suffix: str = "") -> str:
    """次の version を 計算。
    案A (野沢さん指示 2026-05-05、 同 X.Y.Z 系列での suffix 衝突回避):
      dev-suffix mode は **last_dev_suffix を ベースに +1**。
      これで main 緊急 hotfix で sed strip → version が "1.4.4" に戻っても、
      次の dev-suffix は "1.4.4g" (前回 f だった場合) で連続。 同 X.Y.Z 系列で
      同 suffix が 二度 登場しない。
      patch/chapter/season は lastDevSuffix を "" にリセットする想定 (新 X.Y.Z namespace)。
    """
    base, suffix = parse_version(current)
    if mode == "dev-suffix":
        # 連続管理: last_dev_suffix が あれば それを +1、 無ければ 現在 version の suffix から +1
        # (互換性: 既存 user で lastDevSuffix field 不在の場合 旧挙動)
        seed = last_dev_suffix if last_dev_suffix else suffix
        return base + increment_suffix(seed)
    # main release: X.Y.Z bump、 suffix は空に reset
    s, c, p = [int(x) for x in base.split(".")]
    if mode == "patch":
        return f"{s}.{c}.{p + 1}"
    if mode == "chapter":
        return f"{s}.{c + 1}.0"
    if mode == "season":
        return f"{s + 1}.1.0"
    raise ValueError(f"unknown mode: {mode}")


def update_all_cache_busters(new_ver: str) -> int:
    """対象ファイルの ?v=<old> を ?v=<new_ver> に一括統一。
    旧 date-based (?v=20260505a) も version-based (?v=1.4.2g) も両方カバー。"""
    pattern = re.compile(r"\?v=[\w.]+")
    count = 0
    for path in CACHE_BUSTER_FILES:
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        new_text, n = pattern.subn(f"?v={new_ver}", text)
        if n > 0:
            path.write_text(new_text, encoding="utf-8")
            count += n
            print(f"  cache buster: {path.relative_to(ROOT)} ({n} 箇所)")
    return count


def update_sw_version(new_ver: str) -> None:
    """sw.js の SW_VERSION を version 同期"""
    if not SW_JS.exists():
        return
    text = SW_JS.read_text(encoding="utf-8")
    text2 = re.sub(r"const\s+SW_VERSION\s*=\s*'[\w.]+';", f"const SW_VERSION = '{new_ver}';", text)
    if text != text2:
        SW_JS.write_text(text2, encoding="utf-8")
        print(f"  SW_VERSION: sw.js")


def update_version_json(data: dict, new_ver: str, mode: str, notes: list[str] | None,
                        scheduled_at: str | None = None, scheduled_title: str | None = None) -> None:
    # 野沢さん指示 2026-05-05: releasedAt + changelog.date を 日時 (ISO 8601 + JST) に 変更
    # 同日に複数 release (緊急 hotfix 第1弾/第2弾 等) があった場合 区別可能、 データ量増は微々
    #
    # 野沢さん指示 2026-05-06: --scheduled で「事前 main push + 公開時刻自動切替」 対応。
    # scheduled_at 指定時:
    #   - data.version は 旧 version 維持 (= bump せず)
    #   - data.scheduledRelease = { version: new_ver, at: scheduled_at, title? } 設定
    #   - changelog entry に scheduled:true 追加、 date = scheduled_at
    #   - 12:00 経過後は client が _getEffectiveVersion で自動切替 (再 push 不要)
    JST = timezone(timedelta(hours=9))
    now_iso = datetime.now(JST).isoformat(timespec="seconds")
    is_scheduled_release = bool(scheduled_at) and mode in ("patch", "chapter", "season")
    if is_scheduled_release:
        # data.version は 維持 (旧 version)、 scheduledRelease のみ設定
        data["scheduledRelease"] = {
            "version": new_ver,
            "at": scheduled_at,
        }
        if scheduled_title:
            data["scheduledRelease"]["title"] = scheduled_title
        # main release ではあるが 12:00 まで「待機」 状態。 lastDevSuffix もリセット (新 namespace)。
        data["lastDevSuffix"] = ""
        if notes:
            entry = {
                "version": new_ver,
                "date": scheduled_at,
                "type": "patch" if mode == "patch" else "major",
                "scheduled": True,
                "notes": notes,
            }
            data.setdefault("changelog", []).insert(0, entry)
    else:
        data["version"] = new_ver
        # 案A: lastDevSuffix を 連続管理 (野沢さん指示 2026-05-05)
        # dev-suffix → 新 suffix を 記録 (= 同 X.Y.Z 系列で 二度使わないため)
        # main release (patch/chapter/season) → 主バージョン bump で 新 namespace、 "" にリセット
        _, new_suffix = parse_version(new_ver)
        if mode == "dev-suffix":
            data["lastDevSuffix"] = new_suffix
        else:
            data["lastDevSuffix"] = ""
            # 即時 release: scheduledRelease を消して 通常 changelog entry に
            data.pop("scheduledRelease", None)
        if mode != "dev-suffix":
            data["releasedAt"] = now_iso
            if notes:
                entry = {
                    "version": new_ver,
                    "date": now_iso,
                    "type": "patch" if mode == "patch" else "major",
                    "notes": notes,
                }
                data.setdefault("changelog", []).insert(0, entry)
    with VERSION_JSON.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


def update_manifest(new_ver: str) -> None:
    if not MANIFEST_JSON.exists():
        return
    with MANIFEST_JSON.open(encoding="utf-8") as f:
        m = json.load(f)
    m["version"] = new_ver
    with MANIFEST_JSON.open("w", encoding="utf-8") as f:
        json.dump(m, f, ensure_ascii=False, indent=2)
        f.write("\n")


def update_index_header_ver(new_ver: str) -> None:
    """index.html の <span class="ver"> 表示を更新"""
    if not INDEX_HTML.exists():
        return
    text = INDEX_HTML.read_text(encoding="utf-8")
    text = re.sub(
        r'(<span class="ver"[^>]*>)v[\w.]+(</span>)',
        lambda m: f"{m.group(1)}v{new_ver}{m.group(2)}",
        text,
    )
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
        text = re.sub(r"Prismaera v[\w.]+", f"Prismaera v{new_ver}", text, count=1)
        path.write_text(text, encoding="utf-8")


def update_img_cache_version(new_ver: str) -> None:
    """script.js の IMG_CACHE_VERSION を version 同期 (野沢さん指示 2026-05-06、
    旧 date-suffix で 5/6 まで bump 漏れ → 場所画像 SW cache が古版で 404 をキャッシュ
    して反映されない事故対策)。"""
    if not SCRIPT_JS.exists():
        return
    text = SCRIPT_JS.read_text(encoding="utf-8")
    text2 = re.sub(
        r"const\s+IMG_CACHE_VERSION\s*=\s*'[\w.]+';",
        f"const IMG_CACHE_VERSION = '{new_ver}';",
        text,
    )
    if text != text2:
        SCRIPT_JS.write_text(text2, encoding="utf-8")
        print(f"  IMG_CACHE_VERSION: script.js")


def git_branch() -> str:
    res = subprocess.run(
        ["git", "-C", str(ROOT), "rev-parse", "--abbrev-ref", "HEAD"],
        capture_output=True, text=True, encoding="utf-8", errors="replace",
    )
    return (res.stdout or "").strip() if res.returncode == 0 else ""


def git_commit(new_ver: str, mode: str) -> None:
    targets = [str(p.relative_to(ROOT)) for p in [
        VERSION_JSON, MANIFEST_JSON, INDEX_HTML, CARDGAME_INDEX, CARDGAME_SCRIPT,
        SW_JS, README_MD, SCRIPT_JS, STYLE_CSS,
    ] if p.exists()]
    subprocess.run(["git", "-C", str(ROOT), "add", *targets], check=True)
    msg = f"chore(version): v{new_ver}" if mode != "dev-suffix" else f"chore(dev-suffix): v{new_ver}"
    subprocess.run(["git", "-C", str(ROOT), "commit", "-m", msg], check=True)


def main() -> int:
    parser = argparse.ArgumentParser(description="Prismaera version bumper")
    parser.add_argument("mode", choices=["patch", "chapter", "season", "dev-suffix"])
    parser.add_argument("--note", action="append", default=None,
                        help="changelog 項目 (複数可、 main release 時必須、 dev-suffix では不要)")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--auto-commit", action="store_true")
    parser.add_argument("--force", action="store_true",
                        help="branch 安全装置を override (緊急時のみ、 通常使わない)")
    parser.add_argument("--scheduled", default=None,
                        help="ISO 8601 公開時刻 (例: 2026-05-06T12:00:00+09:00)。 "
                             "指定時: data.version は 維持、 scheduledRelease のみ設定 = "
                             "事前 main push + 公開時刻自動切替 仕様 (野沢さん指示 2026-05-06)。 "
                             "patch/chapter/season モードでのみ有効。")
    parser.add_argument("--scheduled-title", default=None,
                        help="--scheduled と併用、 scheduledRelease.title (オプション)。")
    args = parser.parse_args()

    branch = git_branch()
    if args.mode == "dev-suffix":
        if branch != "dev" and not args.force:
            print(f"❌ ERROR: dev-suffix モードは dev branch でのみ実行可能。 現在: {branch}", file=sys.stderr)
            return 1
    else:
        # patch / chapter / season は main branch でのみ
        if branch == "dev" and not args.force:
            print("❌ ERROR: bump_version.py {patch,chapter,season} は main branch でのみ実行可能。", file=sys.stderr)
            print("   dev では `python scripts/bump_version.py dev-suffix` で suffix のみ進行。", file=sys.stderr)
            print("   詳細: CLAUDE.md feedback_prismaera_version_suffix.md", file=sys.stderr)
            return 1
        if not args.note:
            print("❌ ERROR: main release では --note が必須 (changelog エントリ)", file=sys.stderr)
            return 1

    data = load_version()
    current = data["version"]
    # 案A: lastDevSuffix を 連続管理 (野沢さん指示 2026-05-05、 同 X.Y.Z 系列で suffix 衝突回避)
    last_dev_suffix = data.get("lastDevSuffix", "") or ""
    new_ver = next_version(current, args.mode, last_dev_suffix)

    print(f"バージョン: v{current} → v{new_ver} ({args.mode})")
    if args.note:
        print("変更ノート:")
        for n in args.note:
            print(f"  - {n}")
    print()

    if args.dry_run:
        print("[dry-run] ファイルは変更しません")
        return 0

    is_scheduled = bool(args.scheduled) and args.mode in ("patch", "chapter", "season")
    update_version_json(data, new_ver, args.mode, args.note, args.scheduled, args.scheduled_title)
    if not is_scheduled:
        # 通常 release: 全ファイルの version 表記 + cache buster を 即時 更新
        update_manifest(new_ver)
        update_index_header_ver(new_ver)
        update_readme(new_ver)
        update_code_comments(new_ver)
        print("=== cache buster 統一 (?v={new_ver}) ===".format(new_ver=new_ver))
        update_all_cache_busters(new_ver)
        update_sw_version(new_ver)
        update_img_cache_version(new_ver)
        print("ファイル更新完了")
    else:
        # scheduled release: data.version 維持、 manifest/header ver 表示は 旧 version のまま、
        # cache buster + SW_VERSION + IMG_CACHE_VERSION も 旧 version のまま (= 12:00 まで 古版相当)。
        # ただし 場所画像 等 新アセットは 新 cache buster で fetch すべき → 新 version の cache buster
        # も 同時 適用。 こうすることで「事前に新アセットだけ DL 可、 ver 表示は 12:00 まで 旧」 の挙動。
        print(f"=== scheduled release (ver 表示は data.version='{data['version']}' のまま、 cache buster は新 v{new_ver}) ===")
        update_all_cache_busters(new_ver)
        update_sw_version(new_ver)
        update_img_cache_version(new_ver)
        # manifest / header / README は 旧 version のまま (12:00 経過後は client side 切替で 自動表示変更)
        print(f"scheduled at: {args.scheduled}")
        print("ファイル更新完了 (ver 表示は client side で 12:00 ジャストに 自動切替)")

    if args.auto_commit:
        git_commit(new_ver, args.mode)
        print(f"git commit 実行完了 (v{new_ver})")
    else:
        print("git commit はスキップ (--auto-commit で自動化可能)")

    # Box sync 自動実行 (野沢さん指示 2026-05-06、 sync 漏れ繰返叱責対策)
    # bump 毎に Box の prismaera フォルダを 自動同期 (CLAUDE.md feedback_prism_box_sync.md)
    sync_script = ROOT / "scripts" / "sync_to_box.sh"
    if sync_script.exists():
        print()
        print("=== Box sync (自動実行) ===")
        try:
            r = subprocess.run(
                ["bash", str(sync_script)],
                cwd=str(ROOT), capture_output=True, text=True, encoding="utf-8",
                errors="replace", timeout=120,
            )
            if r.returncode == 0:
                # 末尾 3 行だけ表示 (詳細は省略)
                for line in r.stdout.strip().splitlines()[-3:]:
                    print(f"  {line}")
            else:
                print(f"  ⚠️ Box sync 失敗 (exit {r.returncode}): {r.stderr.strip()[:200]}")
        except Exception as e:
            print(f"  ⚠️ Box sync 例外: {e}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
