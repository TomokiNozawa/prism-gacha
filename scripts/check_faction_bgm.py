#!/usr/bin/env python3
"""派閥キャラ5人超えで BGM未設定の派閥を検出 (運用ルール: D4)

使い方:
    python scripts/check_faction_bgm.py

動作:
    - script.js の CHAR_FACTION から各キャラの faction を集計
    - script.js の BGM_LIST から既存の派閥BGM の ID を抽出
    - 「メンバー >5 かつ 派閥BGM が無い」 派閥を警告出力
    - 章追加・キャラ追加 PR 前にこれを走らせる

memo: 派閥BGMの命名は `prism-{factionId}.mp3` 規則 (実装は BGM_LIST の id と faction id が一致)
"""

from __future__ import annotations

import re
import sys
from collections import Counter
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = Path(__file__).resolve().parent.parent
SCRIPT_JS = ROOT / "script.js"

# 派閥ID と BGM_LIST id の対応 (faction BGM のみ、 メイン/章テーマは除外)
FACTION_BGM_IDS = {
    "church": "church",
    "aquasis": "aquasis",
    "crimson": "crimson",
    # 将来追加: 'redwing': 'redwing', etc.
}

# 派閥ID → 表示用 label (CHAR_FACTION で出てきた派閥に対応)
FACTION_LABELS = {
    "genso": "原虹・観測者",
    "rulers": "十国の覇者",
    "church": "白焔教会",
    "dragon": "紫竜王国",
    "redwing": "紅翼皇家",
    "yakai": "夜焔郷・影衆",
    "wolf": "月牙狼族",
    "forest": "深緑樹海",
    "silver": "銀霜王国",
    "tower": "黒曜塔",
    "seventh": "第七天",
    "academy": "星霊学院",
    "aquasis": "海淵都市アクアシス",
    "crimson": "紅玉海賊団",
}


def parse_char_factions(text: str) -> Counter[str]:
    """CHAR_FACTION = { '名前': { f: 'fid', dx: ..., dy: ... }, ... } から各 fid をカウント"""
    # CHAR_FACTION 全体を抽出
    m = re.search(r"const\s+CHAR_FACTION\s*=\s*\{(.*?)\n\}\s*;", text, re.DOTALL)
    if not m:
        return Counter()
    body = m.group(1)
    # 各エントリの f: 'xxx' を全部拾う
    fids = re.findall(r"f\s*:\s*['\"]([^'\"]+)['\"]", body)
    return Counter(fids)


def parse_bgm_ids(text: str) -> set[str]:
    """BGM_LIST = [ { id: 'xxx', ... }, ... ] から id を抽出"""
    m = re.search(r"const\s+BGM_LIST\s*=\s*\[(.*?)\];", text, re.DOTALL)
    if not m:
        return set()
    body = m.group(1)
    ids = re.findall(r"id\s*:\s*['\"]([^'\"]+)['\"]", body)
    return set(ids)


def main() -> int:
    text = SCRIPT_JS.read_text(encoding="utf-8")
    faction_counts = parse_char_factions(text)
    bgm_ids = parse_bgm_ids(text)

    if not faction_counts:
        print("⚠️ CHAR_FACTION が見つかりません, script.js の構造変更を確認")
        return 1

    print("=== 派閥メンバー数集計 ===")
    for fid, count in faction_counts.most_common():
        label = FACTION_LABELS.get(fid, fid)
        bgm_status = "✅ BGM有" if fid in bgm_ids else "❌ BGM無"
        warn = " 🚨" if count > 5 and fid not in bgm_ids else ""
        print(f"  {label:<22} ({fid:<8}): {count}人  {bgm_status}{warn}")

    # 警告対象抽出
    warnings = [
        (fid, count) for fid, count in faction_counts.items()
        if count > 5 and fid not in bgm_ids
    ]

    if warnings:
        print()
        print("⚠️ 5人超で派閥BGMが未設定の派閥があります:")
        for fid, count in warnings:
            label = FACTION_LABELS.get(fid, fid)
            print(f"  - {label} ({fid}): {count}人 → Suno で BGM生成 → assets/bgm/prism-{fid}.mp3 配置 → BGM_LIST に追加")
        print()
        print("プロンプトテンプレ: ~/Box/.../claude/gacha-sim/STORY/prompts/bgm/faction_*.md 参照")
        return 2  # 警告は exit code 2

    print()
    print("✅ 全派閥 OK (5人超え=BGM有)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
