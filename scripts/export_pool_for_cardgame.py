#!/usr/bin/env python3
"""POOL → cardgame/data/pool.json 出力 (P-6)
本体 script.js の const POOL = {...}; から全キャラを抽出、 cardgame で使う JSON 形式に変換。
tier 別 default cost/basePower/dupes は DESIGN 4.3 準拠。 ロールから effect 自動推定。

実行:
  PYTHONIOENCODING=utf-8 PYTHONUTF8=1 py scripts/export_pool_for_cardgame.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT_JS = ROOT / "script.js"
OUT = ROOT / "cardgame" / "data" / "pool.json"

# tier 別 default (DESIGN 4.3 準拠、 cardgame で override 可能)
TIER_DEFAULTS = {
    'LR':  {'cost': 6, 'basePower': 12, 'dupes': 0, 'dupeBonus': 0},
    'UR':  {'cost': 5, 'basePower': 7,  'dupes': 1, 'dupeBonus': 1},
    'SSR': {'cost': 4, 'basePower': 5,  'dupes': 2, 'dupeBonus': 1},
    'SR':  {'cost': 3, 'basePower': 4,  'dupes': 2, 'dupeBonus': 1},
    'R':   {'cost': 1, 'basePower': 2,  'dupes': 2, 'dupeBonus': 1},
}

# CHAR_FACTION の f キー → 表示用派閥名 (cardgame の FACTION_COLORS と整合)
FACTION_KEY_TO_NAME = {
    'genso':    '原虹',
    'rulers':   '十国の覇者',
    'church':   '白焔教会',
    'dragon':   '紫竜王国',
    'redwing':  '紅翼皇家',
    'yakai':    '夜焔郷',
    'wolf':     '月牙狼族',
    'forest':   '深緑樹海',
    'silver':   '銀霜王国',
    'tower':    '黒曜塔',
    'seventh':  '第七天',
    'academy':  '星霊学院',
    'aquasis':  'アクアシス',
    'crimson':  '紅玉海賊団',
    'sahar':    '古龍砂漠サハール',
    'niiruru':  '氷霊王国ニーヴル',
    'zenonia':  '空挺城ゼノニア',
    'darkmoon': '黒月衆ノクトス',
    'liora':    '地底市リオラ',
}

# ロール検出 (キャラ名 + title から)
ROLE_KEYWORDS = {
    'attacker':   ['剣聖', '騎士', '戦士', '将', '武者', '闘士', '剣士', '槍士', '拳士', '帝', '皇'],
    'controller': ['予言', '巫女', '賢者', '魔術師', '魔導', '術師', '祭司', '神官', '導師'],
    'support':   ['職人', '整備', '工', '鍛冶', '修理', '学者', '医', '薬'],
    'resource':  ['商人', '隊商', '旅商', '船長', '船医', '料理', '語り部'],
    'sabotage':  ['影', '暗殺', '黒月', '刺客', '闇', '堕者', '狼', '獣牙'],
}

# ロール別 default 効果 (cardgame で fine-tune 可能)
ROLE_EFFECTS = {
    'attacker':   {'effectText': '自レーン +2',           'effect': {'trigger': 'onPlay', 'target': 'self_lane',     'power': 2}},
    'controller': {'effectText': '相手の同レーン -2',     'effect': {'trigger': 'onPlay', 'target': 'opp_self_lane', 'power': -2}},
    'support':    {'effectText': '自レーン +1、 自身も+1', 'effect': {'trigger': 'onPlay', 'target': 'self_lane',     'power': 1, 'selfBonus': 1}},
    'resource':   {'effectText': 'バニラ (基礎パワー高め)', 'effect': {'trigger': 'none',   'target': 'none',          'power': 0}},
    'sabotage':   {'effectText': '相手の同レーン -2',     'effect': {'trigger': 'onPlay', 'target': 'opp_self_lane', 'power': -2}},
    'default':    {'effectText': '自レーン +1',           'effect': {'trigger': 'onPlay', 'target': 'self_lane',     'power': 1}},
}


def _balanced_block(text: str, start_idx: int, open_ch: str, close_ch: str) -> tuple[int, int]:
    depth = 0
    for i in range(start_idx, len(text)):
        if text[i] == open_ch:
            depth += 1
        elif text[i] == close_ch:
            depth -= 1
            if depth == 0:
                return start_idx, i + 1
    return start_idx, len(text)


def parse_pool(text: str) -> dict[str, list[str]]:
    m = re.search(r'const POOL\s*=\s*\{', text)
    if not m:
        return {}
    start = m.end() - 1
    _, end = _balanced_block(text, start, '{', '}')
    body = text[start:end]
    tiers: dict[str, list[str]] = {}
    for tier in ['LR', 'UR', 'SSR', 'SR', 'R']:
        tier_m = re.search(r'\b' + tier + r'\s*:\s*\[', body)
        if not tier_m:
            continue
        arr_start = tier_m.end() - 1
        _, arr_end = _balanced_block(body, arr_start, '[', ']')
        arr_body = body[arr_start + 1:arr_end - 1]
        # 各 entry { ... } を balance で抽出
        entries = []
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
                    entries.append(arr_body[cur_start:i + 1])
                    in_entry = False
        tiers[tier] = entries
    return tiers


def parse_entry(entry_str: str, tier: str) -> dict:
    name_m = re.search(r'name:\s*"([^"]+)"', entry_str)
    chapter_m = re.search(r"chapter:\s*'([^']+)'", entry_str)
    title_m = re.search(r'title:\s*"([^"]+)"', entry_str)
    img_m = re.search(r"img:\s*`\$\{S1\}/([^`]+)`", entry_str)
    return {
        'name': name_m.group(1) if name_m else 'Unknown',
        'chapter': chapter_m.group(1) if chapter_m else 's1c1',
        'title': title_m.group(1) if title_m else '',
        'img': '/images/characters/season1/' + img_m.group(1) if img_m else '',
        'tier': tier,
    }


def parse_char_faction(text: str) -> dict[str, str]:
    m = re.search(r'const CHAR_FACTION\s*=\s*\{', text)
    if not m:
        return {}
    start = m.end() - 1
    _, end = _balanced_block(text, start, '{', '}')
    body = text[start + 1:end - 1]
    char_map: dict[str, str] = {}
    pattern = re.compile(r"['\"]([^'\"]+)['\"]\s*:\s*\{[^}]*?f:\s*'([^']+)'")
    for mm in pattern.finditer(body):
        char_map[mm.group(1)] = mm.group(2)
    return char_map


def detect_role(name: str, title: str) -> str:
    s = (name or '') + ' ' + (title or '')
    for role, kws in ROLE_KEYWORDS.items():
        if any(k in s for k in kws):
            return role
    return 'default'


def main() -> int:
    text = SCRIPT_JS.read_text(encoding='utf-8')
    tiers = parse_pool(text)
    char_faction = parse_char_faction(text)

    cards: list[dict] = []
    seq = 0
    for tier in ['LR', 'UR', 'SSR', 'SR', 'R']:
        for entry_str in tiers.get(tier, []):
            entry = parse_entry(entry_str, tier)
            seq += 1
            faction_key = char_faction.get(entry['name'], '')
            faction_name = FACTION_KEY_TO_NAME.get(faction_key, '無所属')
            role = detect_role(entry['name'], entry['title'])
            role_data = ROLE_EFFECTS.get(role, ROLE_EFFECTS['default'])
            defaults = TIER_DEFAULTS[tier]
            slug = re.sub(r'[^a-zA-Z0-9_]+', '_', entry['name'])[:30]
            card = {
                'id': f"{tier.lower()}_{seq:03d}_{slug}",
                'name': entry['name'],
                'tier': tier,
                'cost': defaults['cost'],
                'basePower': defaults['basePower'],
                'faction': faction_name,
                'role': role,
                'chapter': entry['chapter'],
                'img': entry['img'],
                'dupes': defaults['dupes'],
                'dupeBonus': defaults['dupeBonus'],
                'effectText': role_data['effectText'],
                'effect': role_data['effect'],
            }
            cards.append(card)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(cards, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    counts = {t: sum(1 for c in cards if c['tier'] == t) for t in ['LR', 'UR', 'SSR', 'SR', 'R']}
    print(f"出力: {OUT.relative_to(ROOT)}")
    print(f"  計 {len(cards)} 枚 (LR={counts['LR']} / UR={counts['UR']} / SSR={counts['SSR']} / SR={counts['SR']} / R={counts['R']})")
    return 0


if __name__ == '__main__':
    sys.exit(main())
