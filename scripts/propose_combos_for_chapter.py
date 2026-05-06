#!/usr/bin/env python3
"""P-7: 章公開時の combos.json 半自動拡張提案

POOL + CHAR_FACTION + RELATIONS を解析、 指定章で追加すべき combo を提案 (stdout JSON)。
出力は **手動承認後** に combos.json へ追記する dry-run mode が既定。 --apply で直接追記も可能。

提案ロジック:
  ① duo (2 chars, same_lane, +3): RELATIONS の a-b ペアで 該当章のキャラペア を抽出
  ② trio (3 chars, any_lane, +X): 該当章キャラで 同派閥 ≥3名 の faction synergy 提案
  ③ 既存 combos.json と id 重複排除

cards.json については pool.json (P-6 自動) で動作担保されるため自動拡張は **不要**。
hand-picked override (特殊効果) が必要なキャラのみ 手動で cards.json に追加。

実行:
  PYTHONIOENCODING=utf-8 PYTHONUTF8=1 py scripts/propose_combos_for_chapter.py --chapter s1c6
  (--apply 付与で combos.json に直接追記、 既定は dry-run で stdout 出力のみ)
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).resolve().parent.parent
SCRIPT_JS = ROOT / "script.js"
COMBOS_JSON = ROOT / "cardgame" / "combos.json"

FACTION_KEY_TO_NAME = {
    'genso': '原虹', 'rulers': '十国の覇者', 'church': '白焔教会',
    'dragon': '紫竜王国', 'redwing': '紅翼皇家', 'yakai': '夜焔郷',
    'wolf': '月牙狼族', 'forest': '深緑樹海', 'silver': '銀霜王国',
    'tower': '黒曜塔', 'seventh': '第七天', 'academy': '星霊学院',
    'aquasis': 'アクアシス', 'crimson': '紅玉海賊団',
    'sahar': '古龍砂漠サハール', 'niiruru': '氷霊王国ニーヴル',
    'zenonia': '空挺城ゼノニア', 'darkmoon': '黒月衆ノクトス',
    'liora': '地底市リオラ', 'shrines': '巫女連邦リーリエ',
}


def _balanced_block(text: str, start_idx: int, open_ch: str, close_ch: str):
    depth = 0
    for i in range(start_idx, len(text)):
        if text[i] == open_ch:
            depth += 1
        elif text[i] == close_ch:
            depth -= 1
            if depth == 0:
                return start_idx, i + 1
    return start_idx, len(text)


def parse_pool_chars(text: str, target_chapter: str) -> list[dict]:
    """POOL 内の chapter == target_chapter のキャラを { name, tier } で返す"""
    m = re.search(r'const POOL\s*=\s*\{', text)
    if not m:
        return []
    start = m.end() - 1
    _, end = _balanced_block(text, start, '{', '}')
    body = text[start:end]
    chars: list[dict] = []
    for tier in ['LR', 'UR', 'SSR', 'SR', 'R']:
        tm = re.search(r'\b' + tier + r'\s*:\s*\[', body)
        if not tm:
            continue
        arr_start = tm.end() - 1
        _, arr_end = _balanced_block(body, arr_start, '[', ']')
        arr_body = body[arr_start + 1:arr_end - 1]
        depth = 0
        cur_start = 0
        in_entry = False
        for i, ch in enumerate(arr_body):
            if ch == '{':
                if depth == 0:
                    cur_start = i
                    in_entry = True
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0 and in_entry:
                    entry = arr_body[cur_start:i + 1]
                    chap_m = re.search(r"chapter:\s*'([^']+)'", entry)
                    if chap_m and chap_m.group(1) == target_chapter:
                        name_m = re.search(r'name:\s*"([^"]+)"', entry)
                        if name_m:
                            chars.append({'name': name_m.group(1), 'tier': tier})
                    in_entry = False
    return chars


def parse_char_faction(text: str) -> dict[str, str]:
    m = re.search(r'const CHAR_FACTION\s*=\s*\{', text)
    if not m:
        return {}
    start = m.end() - 1
    _, end = _balanced_block(text, start, '{', '}')
    body = text[start + 1:end - 1]
    cm: dict[str, str] = {}
    pattern = re.compile(r"['\"]([^'\"]+)['\"]\s*:\s*\{[^}]*?f:\s*'([^']+)'")
    for mm in pattern.finditer(body):
        cm[mm.group(1)] = mm.group(2)
    return cm


def parse_relations(text: str) -> list[tuple[str, str, str]]:
    """RELATIONS から (a, b, label) を抽出"""
    m = re.search(r'const RELATIONS\s*=\s*\[', text)
    if not m:
        return []
    start = m.end() - 1
    _, end = _balanced_block(text, start, '[', ']')
    body = text[start + 1:end - 1]
    rels: list[tuple[str, str, str]] = []
    depth = 0
    cur_start = 0
    in_entry = False
    for i, ch in enumerate(body):
        if ch == '{':
            if depth == 0:
                cur_start = i
                in_entry = True
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0 and in_entry:
                entry = body[cur_start:i + 1]
                a_m = re.search(r'a:\s*[\'"]([^\'"]+)[\'"]', entry)
                b_m = re.search(r'b:\s*[\'"]([^\'"]+)[\'"]', entry)
                lab_m = re.search(r'label:\s*[\'"]([^\'"]+)[\'"]', entry)
                if a_m and b_m:
                    rels.append((a_m.group(1), b_m.group(1), lab_m.group(1) if lab_m else ''))
                in_entry = False
    return rels


def slugify(name: str) -> str:
    """ASCII 化後 strip。 全 non-ASCII (日本語のみ) なら hash プレフィックスで衝突回避."""
    s = re.sub(r'[^a-zA-Z0-9_]+', '_', name).strip('_').lower()
    if not s:
        # 日本語のみ → name から hash 短縮 (re-runs で安定)
        import hashlib
        s = 'jp' + hashlib.md5(name.encode('utf-8')).hexdigest()[:6]
    return s[:25]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--chapter', required=True, help='対象章 id (例: s1c6)')
    ap.add_argument('--apply', action='store_true', help='提案を combos.json に直接追記 (既定は dry-run)')
    args = ap.parse_args()

    text = SCRIPT_JS.read_text(encoding='utf-8')
    chap_chars = parse_pool_chars(text, args.chapter)
    char_faction = parse_char_faction(text)
    relations = parse_relations(text)
    existing = json.loads(COMBOS_JSON.read_text(encoding='utf-8'))
    existing_ids = {c['id'] for c in existing}

    chap_names = {c['name'] for c in chap_chars}
    proposals: list[dict] = []

    # ① duo: RELATIONS で 該当章キャラ ペア
    for a, b, label in relations:
        # 両方 該当章 or 片方 該当章 + 片方既存章
        if a in chap_names or b in chap_names:
            cid = f"duo_{slugify(a)}_{slugify(b)}"[:60]
            if cid in existing_ids:
                continue
            proposals.append({
                'id': cid,
                'name': label or f"{a}と{b}の絆",
                'chars': [a, b],
                'condition': 'same_lane',
                'effect': {'target': 'self_lane', 'power': 3},
                'flavor': f"{label or 'a-b 関係'}。",
                'chapter': args.chapter,
            })
            existing_ids.add(cid)

    # ② trio: 該当章キャラ で 同派閥 ≥3名 → faction synergy
    by_faction: dict[str, list[str]] = defaultdict(list)
    for c in chap_chars:
        f = char_faction.get(c['name'], '')
        if f:
            by_faction[f].append(c['name'])
    for f_key, names in by_faction.items():
        if len(names) < 3:
            continue
        names_sorted = sorted(names)
        top3 = names_sorted[:3]
        cid = f"trio_{f_key}_{args.chapter}"
        if cid in existing_ids:
            continue
        f_name = FACTION_KEY_TO_NAME.get(f_key, f_key)
        proposals.append({
            'id': cid,
            'name': f"{f_name}の結束",
            'chars': top3,
            'condition': 'any_lane',
            'effect': {'target': 'all_lanes', 'power': 1},
            'flavor': f"{f_name}に属する者が場に三名揃う時、 派閥の力が場に流れる。",
            'chapter': args.chapter,
        })
        existing_ids.add(cid)

    # 出力
    print(f"=== P-7 combo 提案 ({args.chapter}) ===")
    print(f"章キャラ {len(chap_chars)}名 / 既存 combos {len(existing)}件")
    print(f"提案: duo {sum(1 for p in proposals if p['id'].startswith('duo_'))}件 + trio {sum(1 for p in proposals if p['id'].startswith('trio_'))}件 = 計 {len(proposals)}件")
    print('---')
    print(json.dumps(proposals, ensure_ascii=False, indent=2))

    if args.apply:
        merged = existing + proposals
        COMBOS_JSON.write_text(json.dumps(merged, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print(f'---')
        print(f'✅ {COMBOS_JSON.relative_to(ROOT)} に {len(proposals)}件 追記済 (合計 {len(merged)}件)')
    else:
        print('---')
        print('ℹ️ dry-run: --apply で combos.json に直接追記 (既存 + 提案 をマージ)')

    return 0


if __name__ == '__main__':
    sys.exit(main())
