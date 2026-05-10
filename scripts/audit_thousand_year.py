#!/usr/bin/env python3
"""千年表現監査: 千年生きている確定キャラ以外への 千年表現適用を 全章+LORE で 抽出する。

確定14人 (LR2+UR12) + グレー4人 (整合確認要) を allowlist として、
それ以外の キャラ名が「千年|百年」 系時間表現と 同段落で出る箇所を 列挙する。
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent

# 千年級確定キャラ (POOL.desc/caption で 「自意識千年連続」 が 明示されているキャラ)
PERSIST_CONFIRMED = {
    'プリズマ', '虹意 プリズマ',
    'ヴォイドラ', '虚意 ヴォイドラ',
    'セラフィエル',
    'アルテミス', '龍帝 アルテミス',
    'ノクス', '星海のノクス',
    'カグヤ', '千夜姫 カグヤ', 'カグヤさん',
    'ネプテア', '深海女王 ネプテア',
    'ファラー', '古龍の語り部 ファラー',
    'ヴィオレナ', '千年語り ヴィオレナ',
    'リオラエル', '地底市の母 リオラエル', 'リオラエル殿',
    'ザナディア', '塔主 ザナディア',
    'テネブラ', '黒月使徒 テネブラ',
    'ジュンクトス', '共観の使徒 ジュンクトス',
}

# グレー (千年級として扱われる場合あり、 整合要確認)
GRAY = {
    'ヒノオウ', '焔帝 ヒノオウ',
    'グレイル', '氷帝 グレイル',
    'ノクトリア', '黒月の盟主 ノクトリア',
    'ホムラ', '鳳神巫女 ホムラ',
}

# 「観測者の前から在る」「七座」「観測者の三姉妹」 等 集合名は OK扱い
ALLOWLIST_PHRASES = {
    '観測者三柱', '観測者三姉妹', '観測者の三姉妹', '観測者の三柱',
    '七座', '原虹', '虹霊界', '黒月衆', '異界塔ザナド', '巫女連邦', '地底市',
    '影喰い', '影使徒', '黒月決戦', '影と共生', '影織り', '古龍砂漠', '古龍杖',
    '千年血脈', '千年祭祀', '千年職能', '鳳神巫女', '千年塔主', '千年閉じ込め',
    '千年の盟友', '千年級存在', '千年予知', '千年級', '千年語り',
    '千年見守り', '千年待った', '千年血脈の盾', '千年血脈の', '千年の意味',
    '千年前のヴィオレナ', '千年前の初代',
    '千年に一度', '千年の歳月', '千年経って',  # 神話表現は別ルールで判定
}

def get_pool_chars():
    """POOL から 全キャラ名 を 抽出"""
    js = (ROOT / 'script.js').read_text(encoding='utf-8')
    names = set()
    for m in re.finditer(r'name:\s*"([^"]+)"', js):
        n = m.group(1)
        names.add(n)
        for p in n.split():
            if len(p) >= 2:
                names.add(p)
    return names

def check_paragraph(para, source, line_no, all_chars):
    """段落内に 千年表現 + 千年級確定キャラ以外の名前 が 同居していないか"""
    if not re.search(r'千年|百年', para):
        return []

    # キャラ自身の経験を示すフレーズ
    PERSON_PHRASE = re.compile(
        r'千年(?:ぶりに?|前(?:に|から|の|の[^、。]{0,5}と)?|経って|越し|生き(?:て|た)|渡(?:り|って)|の眠り|閉じ込め|待っ(?:て|た)|見守[りっ]|閉じこも[りっ])'
        r'|百年(?:ぶりに?|前(?:に|から)|経って|生き(?:て|た))'
    )

    findings = []
    # 段落内 全 千年フレーズ 行を 抽出
    for phrase_match in PERSON_PHRASE.finditer(para):
        # フレーズ周辺 ±50文字 で キャラ名検出
        ctx_start = max(0, phrase_match.start() - 60)
        ctx_end = min(len(para), phrase_match.end() + 60)
        ctx = para[ctx_start:ctx_end]
        # 確定キャラ含むなら OK
        confirmed = any(n in ctx for n in PERSIST_CONFIRMED)
        if confirmed:
            continue
        # グレーキャラ含むなら グレー扱い
        gray = any(n in ctx for n in GRAY)
        # キャラ名検出 (一般キャラ)
        general = []
        for n in sorted(all_chars, key=lambda x: -len(x)):
            if n in PERSIST_CONFIRMED or n in GRAY:
                continue
            if len(n) < 2:
                continue
            if n in ctx:
                # 部分一致衝突回避
                if any(p in n for p in PERSIST_CONFIRMED if p in ctx):
                    continue
                general.append(n)
                break
        if general or gray:
            findings.append({
                'source': source,
                'line': line_no,
                'phrase': phrase_match.group(0),
                'context': ctx.strip().replace('\n', ' ')[:120],
                'general': general,
                'gray': gray,
            })
    return findings

def main():
    all_chars = get_pool_chars()

    findings = []

    # 1. ストーリー本文 (s1c*.md)
    story_dir = ROOT / 'content' / 'story'
    for path in sorted(story_dir.glob('s1c*.md')):
        body = path.read_text(encoding='utf-8')
        # 編集メモ block を 除外
        body = re.split(r'\n##\s*(?:編集メモ|メタ情報|内部メモ|執筆メモ)', body)[0]
        # 段落分割
        lines = body.split('\n')
        # 行単位で解析 (各行を 1段落と見なし、 ±2行を文脈)
        for i, line in enumerate(lines):
            if not re.search(r'千年|百年', line):
                continue
            # 文脈 ±2行
            ctx_start = max(0, i - 2)
            ctx_end = min(len(lines), i + 3)
            para = '\n'.join(lines[ctx_start:ctx_end])
            for f in check_paragraph(para, path.name, i + 1, all_chars):
                findings.append(f)

    # 2. LORE_BY_KEY (script.js 内)
    js = (ROOT / 'script.js').read_text(encoding='utf-8')
    # LORE_BY_KEY block 抽出
    lore_match = re.search(r'const LORE_BY_KEY\s*=\s*\{(.+?)^\};', js, re.DOTALL | re.MULTILINE)
    if lore_match:
        lore_block = lore_match.group(0)
        lore_start_line = js[:lore_match.start()].count('\n') + 1
        # 各キャラ秘話 entry を 抽出
        ENTRY_RE = re.compile(r'"([^"]+)":\s*\[\s*(.+?)\s*\]', re.DOTALL)
        for m in ENTRY_RE.finditer(lore_block):
            char_key = m.group(1)
            entries = m.group(2)
            entry_start = m.start()
            # 各 { title: ..., body: ... } を抽出
            BODY_RE = re.compile(r'body:\s*"((?:[^"\\]|\\.)*)"', re.DOTALL)
            for bm in BODY_RE.finditer(entries):
                body_text = bm.group(1)
                if not re.search(r'千年|百年', body_text):
                    continue
                pos_in_js = lore_match.start() + entry_start + bm.start()
                line_no = js[:pos_in_js].count('\n') + 1
                source = f'LORE[{char_key}]'
                # この秘話の キャラが 千年級確定 なら、 本文中の「千年」 は OK扱い
                # ただし 一般キャラ名が body 内に 混じっている場合は それは 別扱い
                key_persist = any(p in char_key for p in PERSIST_CONFIRMED)
                key_gray = any(p in char_key for p in GRAY)
                for f in check_paragraph(body_text, source, line_no, all_chars):
                    f['key_persist'] = key_persist
                    f['key_gray'] = key_gray
                    findings.append(f)

    # レポート
    print(f"=== 千年表現監査 ===")
    print(f"全章 + LORE で {len(findings)}件の 検証候補")
    print()
    print("【一般キャラ + 千年表現 同段落 (= 設定逸脱候補)】")
    issues = [f for f in findings if f['general']]
    for f in issues:
        print(f"  [{f['source']} L{f['line']}] {f['general']} + 「{f['phrase']}」")
        print(f"      文脈: {f['context'][:100]}")

    print()
    print("【グレーキャラ + 千年表現 (要設定確認)】")
    grays = [f for f in findings if f['gray'] and not f['general']]
    for f in grays[:30]:
        print(f"  [{f['source']} L{f['line']}] グレー + 「{f['phrase']}」")
        print(f"      文脈: {f['context'][:100]}")

    print()
    print(f"=== summary ===")
    print(f"  一般キャラ千年逸脱候補: {len(issues)}件")
    print(f"  グレー千年候補: {len(grays)}件")

if __name__ == '__main__':
    main()
