#!/usr/bin/env python3
"""POOL -> prismboard/data/pool.json 出力 (プリズムボード Phase 0 PoC〜)

本体 script.js の const POOL = {...}; から全キャラを抽出、 オートチェス(プリズムボード)
で使う JSON 形式に変換。 cardgame/export_pool_for_cardgame.py を踏襲。

出力フィールド:
  id / name / tier / cost / basePower / faction(key) / factionName / clazz / chapter / img

- tier 別 default cost/basePower は DESIGN_PRISMBOARD.md §4/§10 準拠
- faction は CHAR_FACTION の f キー(silver/redwing/...)。 シナジーは key でグルーピング
- clazz = 6戦闘クラス(guard/blade/mage/archer/heal/assassin)を name+title から導出 (§5-2)

実行:
  bash ~/.claude/scripts/run_py.sh scripts/export_pool_for_prismboard.py
  (or)  PYTHONIOENCODING=utf-8 PYTHONUTF8=1 py scripts/export_pool_for_prismboard.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT_JS = ROOT / "script.js"
OUT = ROOT / "prismboard" / "data" / "pool.json"

# tier 別 default (DESIGN_PRISMBOARD.md §4: コスト R1/SR2/SSR3/UR4/LR5、 §10 basePower 換算)
TIER_DEFAULTS = {
    'LR':  {'cost': 5, 'basePower': 11},
    'UR':  {'cost': 4, 'basePower': 8},
    'SSR': {'cost': 3, 'basePower': 6},
    'SR':  {'cost': 2, 'basePower': 4},
    'R':   {'cost': 1, 'basePower': 3},
}

# CHAR_FACTION の f キー -> 表示用派閥名 (cardgame と整合)
FACTION_KEY_TO_NAME = {
    'genso':    '原虹・観測者',
    'rulers':   '十国の覇者',
    'church':   '白焔教会',
    'dragon':   '紫竜王国',
    'redwing':  '紅翼皇家',
    'yakai':    '夜焔郷・影衆',
    'wolf':     '月牙狼族',
    'forest':   '深緑樹海',
    'silver':   '銀霜王国',
    'tower':    '黒曜塔',
    'seventh':  '第七天',
    'academy':  '星霊学院',
    'aquasis':  '海淵都市アクアシス',
    'crimson':  '紅玉海賊団',
    'sahar':    '古龍砂漠サハール',
    'niiruru':  '氷霊王国ニーヴル',
    'zenonia':  '空挺城ゼノニア',
    'darkmoon': '黒月衆ノクトス',
    'liora':    '地底市リオラ',
    'shrines':  '巫女連邦リーリエ',
    'voidtower': '異界の塔ザナド',
}

# 戦闘クラス検出 (name + title から、 先頭一致優先)。 DESIGN_PRISMBOARD.md §5-2 の 6種
#   guard=守護(重装タンク) / blade=剣士(前衛AT) / mage=魔導(後衛魔法)
#   archer=弓手(後衛物理) / heal=治癒(支援) / assassin=暗殺(奇襲)
CLASS_KEYWORDS = [
    ('archer',   ['射手', '弓', '狙撃', '銃']),
    ('heal',     ['巫女', '神官', '祭司', '聖女', '司祭', '医', '薬', '癒', '詠', '灯番', '司書']),
    ('mage',     ['魔術師', '魔導', '術師', '賢者', '導師', '魔法', '占', '予言', '観測']),
    ('assassin', ['影', '暗殺', '刺客', '闇', '堕', '狼', '獣牙', '牙', '夜']),
    ('guard',    ['騎士', '守護', '盾', '重装', '将', '衛', '鎧', '番人', '守']),
    ('blade',    ['剣聖', '剣士', '剣', '武者', '闘士', '戦士', '槍', '拳', '帝', '皇', '侍', '斬']),
]
CLASS_DEFAULT = 'blade'

CLASS_NAME = {
    'guard': '守護', 'blade': '剣士', 'mage': '魔導',
    'archer': '弓手', 'heal': '治癒', 'assassin': '暗殺',
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


def detect_class(name: str, title: str) -> str:
    s = (name or '') + ' ' + (title or '')
    for clazz, kws in CLASS_KEYWORDS:
        if any(k in s for k in kws):
            return clazz
    return CLASS_DEFAULT


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
            clazz = detect_class(entry['name'], entry['title'])
            defaults = TIER_DEFAULTS[tier]
            slug = re.sub(r'[^a-zA-Z0-9_]+', '_', entry['name'])[:30]
            cards.append({
                'id': f"{tier.lower()}_{seq:03d}_{slug}",
                'name': entry['name'],
                'tier': tier,
                'cost': defaults['cost'],
                'basePower': defaults['basePower'],
                'faction': faction_key or 'none',
                'factionName': faction_name,
                'clazz': clazz,
                'className': CLASS_NAME[clazz],
                'chapter': entry['chapter'],
                'img': entry['img'],
            })

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(cards, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

    tcounts = {t: sum(1 for c in cards if c['tier'] == t) for t in ['LR', 'UR', 'SSR', 'SR', 'R']}
    ccounts: dict[str, int] = {}
    for c in cards:
        ccounts[c['clazz']] = ccounts.get(c['clazz'], 0) + 1
    print(f"出力: {OUT.relative_to(ROOT)}")
    print(f"  計 {len(cards)} 体 (LR={tcounts['LR']} / UR={tcounts['UR']} / SSR={tcounts['SSR']} / SR={tcounts['SR']} / R={tcounts['R']})")
    print(f"  クラス: " + " / ".join(f"{CLASS_NAME[k]}={v}" for k, v in sorted(ccounts.items())))
    noassign = sum(1 for c in cards if c['faction'] == 'none')
    if noassign:
        print(f"  ⚠ 派閥未割当 {noassign} 体 (CHAR_FACTION 未登録 = 'none')")
    return 0


if __name__ == '__main__':
    sys.exit(main())
