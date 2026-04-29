#!/usr/bin/env python3
"""キャラ/章追加時の更新箇所漏れ検出 (pre-commit / pre-release で実行)

使い方:
    python scripts/check_pool_consistency.py

検出する不整合:
  1. script.js POOL.{tier}.length と admin.html TIER_MAX[tier] が一致するか
  2. CHAR_FACTION の各 fid が FACTIONS の id に存在するか
  3. STORY_FILES に列挙された章ファイル (s1c1.md 等) が STORY/ に実在するか
  4. 派閥メンバー >5人で 派閥BGM が無い派閥がないか (BGM_LIST と FACTIONS をマッチ、 D4 連動)
  5. POOL に登場する全 character の img path のファイル存在確認 (images/characters/season1/...)
  6. v.json と script.js / index.html の version 表記が一致するか

exit code:
  0 = 全部 OK
  1 = 重大不整合あり (要修正)
  2 = 警告のみ (推奨対応)

このスクリプトはキャラ/章追加 PR 前 + bump_version.py 実行前に必ず走らせる。
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from collections import Counter

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = Path(__file__).resolve().parent.parent
SCRIPT_JS = ROOT / "script.js"
ADMIN_HTML = ROOT / "admin.html"
INDEX_HTML = ROOT / "index.html"
VERSION_JSON = ROOT / "version.json"
STORY_DIR = ROOT / "STORY"
IMAGES_DIR = ROOT / "images"


def parse_pool_counts(text: str) -> dict[str, int]:
    """const POOL = { LR: [..], UR: [..], ... } から各 tier のキャラ数を抽出"""
    m = re.search(r"const\s+POOL\s*=\s*\{(.*?)\n\}\s*;", text, re.DOTALL)
    if not m:
        return {}
    body = m.group(1)
    out = {}
    for tier in ["LR", "UR", "SSR", "SR", "R"]:
        tm = re.search(rf"\b{tier}\s*:\s*\[(.*?)\n\s*\]", body, re.DOTALL)
        if tm:
            out[tier] = len(re.findall(r"name\s*:", tm.group(1)))
    return out


def parse_admin_tier_max(text: str) -> dict[str, int]:
    m = re.search(r"const\s+TIER_MAX\s*=\s*\{([^}]*)\}", text)
    if not m:
        return {}
    out = {}
    for kv in re.finditer(r"(LR|UR|SSR|SR|R)\s*:\s*(\d+)", m.group(1)):
        out[kv.group(1)] = int(kv.group(2))
    return out


def parse_factions(text: str) -> set[str]:
    m = re.search(r"const\s+FACTIONS\s*=\s*\[(.*?)\n\]\s*;", text, re.DOTALL)
    if not m:
        return set()
    return set(re.findall(r"id\s*:\s*['\"]([^'\"]+)['\"]", m.group(1)))


def parse_char_factions(text: str) -> Counter[str]:
    m = re.search(r"const\s+CHAR_FACTION\s*=\s*\{(.*?)\n\}\s*;", text, re.DOTALL)
    if not m:
        return Counter()
    return Counter(re.findall(r"f\s*:\s*['\"]([^'\"]+)['\"]", m.group(1)))


def parse_story_files(text: str) -> dict[str, str]:
    """const STORY_FILES = { s1c1: { ..., file: 'STORY/s1c1.md' }, ... } → {sid: path}"""
    m = re.search(r"const\s+STORY_FILES\s*=\s*\{(.*?)\n\}\s*;", text, re.DOTALL)
    if not m:
        return {}
    out = {}
    for entry in re.finditer(
        r"(\w+)\s*:\s*\{[^}]*file\s*:\s*['\"]([^'\"]+)['\"]", m.group(1)
    ):
        out[entry.group(1)] = entry.group(2)
    return out


def parse_bgm_ids(text: str) -> set[str]:
    m = re.search(r"const\s+BGM_LIST\s*=\s*\[(.*?)\];", text, re.DOTALL)
    if not m:
        return set()
    return set(re.findall(r"id\s*:\s*['\"]([^'\"]+)['\"]", m.group(1)))


def parse_pool_imgs(text: str) -> list[str]:
    """POOL 内の img: `${...}/path/to.png` を抽出 (絶対パスに変換しやすい形)"""
    # img: `${S1}/lr/prisma.png` のような template literal を狙う
    return re.findall(r"img\s*:\s*[`'\"]([^`'\"]+)[`'\"]", text)


def main() -> int:
    text_js = SCRIPT_JS.read_text(encoding="utf-8")
    text_admin = ADMIN_HTML.read_text(encoding="utf-8")
    text_index = INDEX_HTML.read_text(encoding="utf-8")

    errors = []
    warnings = []

    # ─── 1. POOL counts vs admin TIER_MAX ───
    pool = parse_pool_counts(text_js)
    admin_max = parse_admin_tier_max(text_admin)
    print("=== 1. POOL ↔ admin.html TIER_MAX ===")
    for tier in ["LR", "UR", "SSR", "SR", "R"]:
        p = pool.get(tier, 0)
        a = admin_max.get(tier, 0)
        if p == a:
            print(f"  ✅ {tier}: POOL={p}, TIER_MAX={a}")
        else:
            errors.append(f"{tier}: POOL={p} ≠ admin TIER_MAX={a} → admin.html の TIER_MAX を {p} に更新")
            print(f"  ❌ {tier}: POOL={p}, TIER_MAX={a} ← 不整合")

    # ─── 2. CHAR_FACTION の f id が FACTIONS にあるか ───
    factions = parse_factions(text_js)
    char_fids = parse_char_factions(text_js)
    print()
    print("=== 2. CHAR_FACTION の faction id が FACTIONS に存在するか ===")
    unknown = [fid for fid in char_fids.keys() if fid not in factions]
    if not unknown:
        print(f"  ✅ 全 {len(char_fids)} 派閥 ID が FACTIONS と整合")
    else:
        for fid in unknown:
            errors.append(f"CHAR_FACTION で参照されてる '{fid}' が FACTIONS に存在しない")
            print(f"  ❌ CHAR_FACTION の '{fid}' が FACTIONS に未定義")

    # ─── 3. STORY_FILES の章ファイルが実在するか ───
    story_files = parse_story_files(text_js)
    print()
    print("=== 3. STORY_FILES の章ファイル実在チェック ===")
    for sid, path in story_files.items():
        full = ROOT / path
        if full.exists():
            print(f"  ✅ {sid}: {path}")
        else:
            errors.append(f"STORY_FILES の '{sid}' が指すファイル {path} が存在しない")
            print(f"  ❌ {sid}: {path} ← ファイル不在")

    # ─── 4. 派閥 5人超え BGM 未設定 (D4) ───
    bgm_ids = parse_bgm_ids(text_js)
    print()
    print("=== 4. 派閥 >5人 で BGM未設定 (D4) ===")
    for fid, cnt in char_fids.most_common():
        has_bgm = fid in bgm_ids
        if cnt > 5 and not has_bgm:
            warnings.append(f"派閥 '{fid}' が {cnt}人で BGM 未設定 → assets/bgm/prism-{fid}.mp3 + BGM_LIST 追加")
            print(f"  ⚠️ {fid}: {cnt}人 BGM無 ← 派閥BGM追加対象")
        elif cnt > 5:
            print(f"  ✅ {fid}: {cnt}人 BGM有")

    # ─── 5. POOL 内 img path 実在 ───
    print()
    print("=== 5. POOL キャラの img ファイル実在 ===")
    img_paths = parse_pool_imgs(text_js)
    season_re = re.compile(r"\$\{S1\}/?(.*)$")
    missing_imgs = []
    for raw in img_paths:
        # ${S1} は '/images/characters/season1' 等のはず — script.js で確認
        m_s1 = re.match(r"const\s+S1\s*=\s*['\"]([^'\"]+)['\"]", text_js)
        s1_base = m_s1.group(1) if m_s1 else "/images/characters/season1"
        path = raw.replace("${S1}", s1_base)
        if path.startswith("/"):
            path = path[1:]
        full = ROOT / path
        if not full.exists():
            missing_imgs.append(str(path))
    if not missing_imgs:
        print(f"  ✅ 全 {len(img_paths)} 画像 OK")
    else:
        for m in missing_imgs[:10]:
            warnings.append(f"img不在: {m}")
            print(f"  ⚠️ {m}")
        if len(missing_imgs) > 10:
            print(f"     ... 他 {len(missing_imgs)-10}件")

    # ─── 6. version.json と script.js / index.html の version表記一致 ───
    print()
    print("=== 6. version.json と コメント/index.html の version一致 ===")
    if VERSION_JSON.exists():
        vj = json.loads(VERSION_JSON.read_text(encoding="utf-8"))
        ver = vj.get("version", "")
        if not ver:
            warnings.append("version.json に version が無い")
        else:
            ok = True
            comment_match = re.search(r"Prismaera\s+v([\d.]+)", text_js)
            if comment_match and comment_match.group(1) != ver:
                warnings.append(f"script.js コメント v{comment_match.group(1)} ≠ version.json v{ver}")
                ok = False
                print(f"  ⚠️ script.js コメント: v{comment_match.group(1)} ≠ {ver}")
            index_ver = re.search(r'<span class="ver"[^>]*>v([\d.]+)', text_index)
            if index_ver and index_ver.group(1) != ver:
                warnings.append(f"index.html app-version v{index_ver.group(1)} ≠ version.json v{ver}")
                ok = False
                print(f"  ⚠️ index.html app-version: v{index_ver.group(1)} ≠ {ver}")
            if ok:
                print(f"  ✅ 全部 v{ver} で揃ってる")

    # ─── サマリ ───
    print()
    print("=" * 60)
    if errors:
        print(f"❌ 重大不整合 {len(errors)}件:")
        for e in errors:
            print(f"  - {e}")
    if warnings:
        print(f"⚠️ 警告 {len(warnings)}件:")
        for w in warnings:
            print(f"  - {w}")
    if not errors and not warnings:
        print("✅ 全項目クリア")
        return 0
    return 1 if errors else 2


if __name__ == "__main__":
    sys.exit(main())
