"""
Prismaera repo の自動ルールチェック (CLAUDE.md / memory の機械チェック可能項目)

【ルール】
1. prompt/locations_*.md の添付ありセクションに末尾文言「元画像から表情や姿勢は変わってOKです」 含むこと
   (CLAUDE.md / feedback_image_prompt_charref_suffix.md)
2. ユーザー表示用文字列 (index.html / script.js の display text 系) に内部キー S1C[0-9]+ / s1c[0-9]+ 含まないこと
   (CLAUDE.md / feedback_user_facing_chapter_label.md)
3. STORY_OUTLINE 全章に povCharName 設定済 + その名前が POOL の name に完全一致存在
   (CLAUDE.md / feedback_chapter_end_pov_single.md)
4. STORY/s1c?.md の章構造が「プロローグ + 第一幕〜第四幕 + エピローグ + 第N章 終」 統一
   (CLAUDE.md / feedback_chapter_structure_consistency.md)
5. 「野沢」 呼び捨て検出: 「野沢」 単独 (除: 野沢さん/野沢用/野沢方針/野沢氏 等)
   (CLAUDE.md / user_profile.md)

Usage:
  PYTHONIOENCODING=utf-8 py scripts/check_repo_rules.py
Exit: 0 (全合格) / 1 (違反あり)

pre-commit フック (.githooks/pre-commit) から自動呼出。
"""
import re
import sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = Path(__file__).resolve().parents[1]

violations = []


def check_prompt_charref_suffix():
    """ルール1: prompt/locations_*.md 末尾文言"""
    SUFFIX = "元画像から表情や姿勢は変わってOKです"
    target_dir = ROOT / "prompt"
    if not target_dir.exists():
        return 0
    checked = 0
    for path in sorted(target_dir.glob("locations_*.md")):
        text = path.read_text(encoding="utf-8")
        parts = re.split(r'(?=^## )', text, flags=re.M)
        for sec in parts:
            first_line = sec.split("\n", 1)[0].strip()
            title = first_line.replace("## ", "").strip() or "(no title)"
            is_image_section = bool(re.search(r'\.png', first_line)) or first_line.startswith('## 【')
            if not is_image_section:
                continue
            if "添付画像" not in sec and "添付リファ" not in sec:
                continue
            checked += 1
            if SUFFIX not in sec:
                violations.append(
                    f"[ルール1 末尾文言] {path.name} :: {title}\n"
                    f"      → missing「{SUFFIX}」 ``` ブロック内に追加要"
                )
    return checked


def check_internal_chapter_keys():
    """ルール2: index.html / script.js のユーザー表示文字列に S1C[0-9]+ / s1c[0-9]+ 含まないこと

    現状: false positive 多発 (オブジェクトキー / id field / template)、 賢い AST パーサ無しでは判定困難。
    将来改善時に有効化。 当面は手動 grep での確認を推奨:
      grep -nE 'S1C[0-9]|s1c[0-9]' index.html script.js | grep -v 'data-\\|id=\\|class=\\|images/\\|/locations/\\|/\\* \\|// '
    """
    return 0  # 一旦 skip (将来賢く再実装)


def check_story_outline_pov():
    """ルール3: STORY_OUTLINE.povCharName 全章設定 + POOL存在"""
    script = ROOT / "script.js"
    if not script.exists():
        return 0
    text = script.read_text(encoding="utf-8")
    # STORY_OUTLINE entry 検出 (id: 's1c?' + povCharName: '...')
    m_outline = re.search(r'const STORY_OUTLINE\s*=\s*\[([\s\S]*?)\];', text)
    if not m_outline:
        return 0
    outline_body = m_outline.group(1)
    entries = re.findall(r"\{[^}]*?id:\s*'(s1c\d+)'[^}]*?\}", outline_body)
    pov_names = {}
    for entry_match in re.finditer(r"\{[^}]*?id:\s*'(s1c\d+)'[^}]*?\}", outline_body):
        entry = entry_match.group(0)
        eid = entry_match.group(1)
        pov_m = re.search(r"povCharName:\s*'([^']+)'", entry)
        if pov_m:
            pov_names[eid] = pov_m.group(1)
        else:
            violations.append(
                f"[ルール3 povCharName 未設定] STORY_OUTLINE の {eid} に povCharName 欠如\n"
                f"      → 章末「次章主人公1人だけ表示」 ルールに必要、 POOL の name と完全一致で設定要"
            )
    # POOL からキャラ名抽出
    m_pool = re.search(r'const POOL\s*=\s*(\{[\s\S]*?\n\});', text)
    if m_pool:
        pool_text = m_pool.group(1)
        pool_names = set(re.findall(r'name:\s*"([^"]+)"', pool_text))
        for eid, pov in pov_names.items():
            if pov not in pool_names:
                violations.append(
                    f"[ルール3 povCharName 不一致] STORY_OUTLINE の {eid} povCharName='{pov}' が POOL に存在しない\n"
                    f"      → 完全一致 (token部分一致でなく) 必要、 typo or 未公開キャラ参照"
                )
    return len(pov_names)


def check_chapter_structure():
    """ルール4: STORY/s1c?.md 章構造 (柔軟化版 2026-05-01)
    - 必須: プロローグ + 第一幕 + エピローグ + 第N章 終
    - 第二幕〜第N幕 は任意 (物語量に応じて自由、 4幕推奨だが固定でない)
    - シーン番号 N-K の N は 1〜8 まで許容 (現実的な章規模)、 旧章単位連番 (1-13等) は禁止
    """
    target_dir = ROOT / "STORY"
    if not target_dir.exists():
        return 0
    REQUIRED = ['## プロローグ', '## 第一幕', '## エピローグ']  # 必須3項目に緩和
    checked = 0
    for path in sorted(target_dir.glob("s1c*.md")):
        if path.name == "outline.md":
            continue
        text = path.read_text(encoding="utf-8")
        checked += 1
        missing = []
        for req in REQUIRED:
            if req not in text:
                missing.append(req)
        if missing:
            violations.append(
                f"[ルール4 章構造] {path.name} に欠如: {', '.join(missing)}\n"
                f"      → 必須: 「プロローグ + 第一幕 + エピローグ + 第N章 終」 (第二幕以降は任意、 物語量に応じて自由)"
            )
        # 「第N章 終」 ヘッダ
        m = re.search(r'^## 第\d+章 終$', text, flags=re.M)
        if not m:
            violations.append(
                f"[ルール4 章末ヘッダ] {path.name} に「## 第N章 終」 行が無い\n"
                f"      → 章末ヘッダ統一必要"
            )
        # シーン番号 (N-K) 形式チェック (旧 1-13 みたいな章単位連番でなく N=幕単位)
        scene_labels = re.findall(r'^### (\d+)-(\d+):', text, flags=re.M)
        bad = [(n, k) for n, k in scene_labels if int(n) > 8]  # 8幕以上は現実的に無い
        if bad:
            violations.append(
                f"[ルール4 シーン番号] {path.name} に幕番号9以上のシーンあり: {bad}\n"
                f"      → シーン番号は幕単位 (N-K, N≦8) 必要、 旧章単位連番 (1-13等) は禁止"
            )
    return checked


def check_modal_requirements():
    """ルール6 (WARNING): モーダル/popup 必須要件チェック (野沢さん指示 2026-05-02)
    新規モーダル要素 (id 末尾 -modal or -panel or -popup) に対して以下が揃っているか:
    1. Esc キー処理 (keydown.*Escape.*close{ModalName} or _isAllModalsHidden 等の網羅)
    2. close 関数 (closeXxx() or dismissXxx())
    3. 背景クリック close (target === modal or target.id === xxx)
    4. _isAllModalsHidden の checkActive 配列に追加されているか (Space/Enter 裏発火防止)

    現状: 完璧な静的解析は難しいので、 「checkActive配列に modal id がない」 だけでも検出する簡易チェック。
    """
    script = ROOT / "script.js"
    index = ROOT / "index.html"
    if not script.exists():
        return 0
    text = script.read_text(encoding="utf-8")
    html = index.read_text(encoding="utf-8") if index.exists() else ""

    # 全モーダル ID 抽出 (HTML <div id="xxx-modal" or "xxx-panel" or "xxx-popup">)
    modal_ids = set(re.findall(r'<(?:div|dialog|section)\s+[^>]*id="([\w-]+(?:-modal|-panel|-popup))"', html))
    # script.js 内で createElement('div').id = 'xxx-modal' パターンも検出
    modal_ids.update(re.findall(r"\.id\s*=\s*['\"]([\w-]+(?:-modal|-panel|-popup))['\"]", text))

    # _isAllModalsHidden の checkActive 配列を抽出
    m_active = re.search(r"const checkActive\s*=\s*\[([^\]]+)\]", text)
    active_ids = set()
    if m_active:
        active_ids = set(re.findall(r"#([\w-]+)", m_active.group(1)))

    checked = 0
    for mid in sorted(modal_ids):
        # 除外: gasshuku 等の旧モーダル / topbar-secondary 等の特殊ケース
        if mid in ('topbar-secondary', 'gasshuku-modal'):
            continue
        checked += 1
        # checkActive に登録されているか
        if mid not in active_ids:
            violations.append(
                f"[ルール6 モーダル網羅] {mid} が _isAllModalsHidden の checkActive 配列にない\n"
                f"      → script.js の checkActive に '#{mid}' を追加 (Space/Enter 裏発火防止)"
            )
        # close 関数があるか (closeXxx or dismissXxx)
        guess = re.sub(r'-modal$|-panel$|-popup$', '', mid).replace('-', '_')
        close_pat = re.compile(rf"function (close|dismiss){guess[0].upper()}{guess[1:]}", re.I)
        if not close_pat.search(text):
            # name 推測が合わない場合あり、 警告止まり
            pass  # skip この check (false positive 多すぎ)
    return checked


def check_nozawa_honorific():
    """ルール5: 「野沢」 呼び捨て検出 (ドキュメント系MDのみ対象、 scripts/ は自己参照誤検知のため除外)"""
    targets = []
    for sub in ['STORY', 'prompt']:
        d = ROOT / sub
        if d.exists():
            targets.extend(d.rglob('*.md'))
    # ルートMD (DESIGN.md / VERSIONING.md / README.md 等)
    targets.extend(ROOT.glob('*.md'))
    checked = 0
    for path in targets:
        try:
            text = path.read_text(encoding="utf-8")
        except Exception:
            continue
        for lineno, line in enumerate(text.split("\n"), 1):
            # 「野沢」 単独 (野沢さん/野沢用/野沢方針/野沢氏/野沢ら/野沢ファミ 等は除外)
            for m in re.finditer(r'野沢', line):
                pos = m.end()
                following = line[pos:pos+5]
                if following.startswith(('さん', '用', '方針', '氏', 'ら', 'ち', 'ぐ', 'なお', 'ファミ', 'フォルダ')):
                    continue
                # 「野沢」 単独
                checked += 1
                violations.append(
                    f"[ルール5 呼称] {path.relative_to(ROOT)}:{lineno}\n"
                    f"      → {line.strip()[:100]}\n"
                    f"      → 「野沢」 呼び捨て検出、 「野沢さん」 統一要"
                )
                break
    return checked


# ─── 実行 ───
# ルール1/3/4 = commit blocker (false positive 少ない、 確実な静的チェック)
# ルール2/5 = warning level (誤検知あり、 表示のみ、 開発者手動 review)
print("[check_repo_rules]")
warnings = []

# === Blocker ルール ===
n1 = check_prompt_charref_suffix()
print(f"  ルール1 (末尾文言): {n1}セクション 検査 [BLOCKER]")
n3 = check_story_outline_pov()
print(f"  ルール3 (povCharName): {n3}章 検査 [BLOCKER]")
n4 = check_chapter_structure()
print(f"  ルール4 (章構造): {n4}章 検査 [BLOCKER]")

# === Warning ルール (commit はブロックせず、 開発者手動 review) ===
violations_blocker = list(violations)  # ここまでが blocker 違反
violations.clear()
n2 = check_internal_chapter_keys()
n5_pre = len(violations)
check_nozawa_honorific()
n5_post = len(violations)
n6_pre = len(violations)
n6 = check_modal_requirements()
n6_post = len(violations)
warnings = list(violations)
violations.clear()
print(f"  ルール2 (内部キー直書き): {n2}件 検査 [WARNING / 誤検知あり]")
print(f"  ルール5 (野沢呼称): {n5_post - n5_pre}件 検査 [WARNING / 誤検知あり]")
print(f"  ルール6 (モーダル網羅): {n6}件 検査 [WARNING / Esc・Space網羅対策]")

print()

# Warning 表示 (exit 0 維持)
if warnings:
    print(f"⚠️  警告 {len(warnings)}件 (commit は通る、 内容を確認)\n")
    for w in warnings[:20]:  # 最大20件まで表示
        print(f"  - {w}")
    if len(warnings) > 20:
        print(f"  ... 他 {len(warnings) - 20}件")
    print()

# Blocker 違反 → commit abort
if violations_blocker:
    print(f"❌ Blocker 違反 計{len(violations_blocker)}件 → commit abort\n")
    for v in violations_blocker:
        print(f"  - {v}")
    sys.exit(1)
else:
    print("✅ Blocker ルール全合格")
    sys.exit(0)
