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
  PYTHONIOENCODING=utf-8 py scripts/check_repo_rules.py [scope]
  scope: all (default) / story / char / prompt / deploy / release
Exit: 0 (全合格) / 1 (違反あり)

scope 別 (野沢さん指示 2026-05-06、 場面別自動チェック分割):
  - all (default):   全ルール実行 (月次総点検 / リファクタ後)
  - story:    新章本文・凸秘話作成時 (章構造 / シーン / POV / ふりがな / 部分一致 / outline配分)
  - char:     POOL追加時 (派閥/種族 / Tier / 名前重複 / LORE形式 / ID-basedマークアップ)
  - prompt:   画像/BGMプロンプト作成時 (末尾文言 / ANATOMY / 形式統一 / メタ記載 / 背景参照)
  - deploy:   commit前 軽量 (cache buster / SW_VERSION / IMG_CACHE_VERSION / dev/main version)
  - release:  章公開直前 (ホームティザー / 派閥BGM / 公開前リーク / WM派閥座標 / 章末予告)

pre-commit フック (.githooks/pre-commit) から自動呼出 (デフォルト deploy モード推奨)。

【段階的実装】 2026-05-06 初版は scope 引数受付 + 分類コメント付与のみ。 個別 scope は all と等価動作。
段階的に各ルールに scope tag を付与して、 deploy mode で軽量実行可能にしていく。
"""
import re
import sys
import json
import subprocess
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = Path(__file__).resolve().parents[1]

# scope 引数 (野沢さん指示 2026-05-06)
SCOPE = (sys.argv[1] if len(sys.argv) > 1 else 'all').lower().strip()
VALID_SCOPES = {'all', 'story', 'char', 'prompt', 'deploy', 'release'}
if SCOPE not in VALID_SCOPES:
    print(f"⚠️ 不正な scope: '{SCOPE}'  (有効: {', '.join(sorted(VALID_SCOPES))})  → all で続行")
    SCOPE = 'all'
print(f"🔍 check_repo_rules.py scope='{SCOPE}'")
print()


# scope ヘルパー: 「all モード or 該当 scope に含まれる」 場合のみ True
def scope_match(*target_scopes):
    if SCOPE == 'all':
        return True
    return SCOPE in target_scopes

# scope → ルール分類 (野沢さん指示 2026-05-06、 場面別自動チェック分割):
#   story:   章本文 / outline / 既存設定齟齬 (ルール 2, 3, 4, 7, 7-1, 7-2, 7-9, 8, 9)
#   char:    POOL 追加 / 派閥 / 凸秘話 (ルール 7-11, 7-12, 7-18, 7-21, 7-22, 7-30, 7-31, 7-33)
#   prompt:  画像 / BGM プロンプト (ルール 1, 7-13, 7-14, 7-16, 7-34, 7-35, 7-36, 7-40)
#   deploy:  cache buster / version / Box sync (ルール 7-23, 7-24, 7-25, 7-26, 7-27, 7-28, 7-37, 7-39)
#   release: 章公開直前 (ルール 7-19, 7-29, 7-32, 7-38)
#   all:     全ルール (デフォルト、 月次総点検)


violations = []


def check_prompt_charref_suffix():
    """ルール1: prompt/locations_*.md 末尾文言"""
    SUFFIX = "元画像から表情や姿勢は変わってOKです"
    target_dir = ROOT / "content" / "prompt"
    if not target_dir.exists():
        return 0
    checked = 0
    for path in sorted(target_dir.glob("locations/*.md")):
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
    target_dir = ROOT / "content" / "story"
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
        else:
            # 章末予告本文チェック (BLOCKER): 「## 第N章 終」 のあとに次章予告本文 80文字以上が必要
            # 本文ゼロだと parseStoryToScenes で isAct=true 判定 → cover演出 (タップで次へ ❖❖) になり 他章とレイアウト不整合
            # 野沢さん指摘 2026-05-02 「章末ページで次の章の告知がちゃんとなされているかも必ずチェックするように」
            after = text[m.end():]
            # 別 h1/h2 (編集メモ等) があればそこまでで打ち切り
            sep = re.search(r'\n##? ', after)
            if sep:
                after = after[:sep.start()]
            after_clean = re.sub(r'\s+', '', after)
            if len(after_clean) < 80:
                violations.append(
                    f"[ルール4 章末予告 BLOCKER] {path.name} 「## 第N章 終」 のあとに次章予告本文 80文字以上が必要 (現状 {len(after_clean)}文字)\n"
                    f"      → 本文ゼロだと章末ページが cover 演出 (タップで次へ ❖❖) に落ちて他章とレイアウト不整合になる、 [次章予告] テキストを必ず入れる (野沢さん指示 2026-05-02)"
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


def check_chapter_completeness():
    """ルール7 (BLOCKER): 章公開チェックリスト (野沢さん指示 2026-05-02 拡張)
    STORY_FILES に存在する全 s1c? が以下の必須箇所に登録されているか:

    BLOCKER (commit abort):
    1. STORY_ACT_INTROS (表紙/中表紙引き文、 主人公モノローグ)
    2. index.html gallery-tabs (図鑑のフィルター)
    3. index.html story-list-modal story-card[data-story=...] (一覧モーダルの章カード active 化)

    WARNING (アセット未生成段階で許容、 開発者手動 review):
    4. POOL に chapter='s1c?' のキャラ存在 (なし=ガチャに章キャラ未公開)
    5. LORE_BY_KEY に s1c? キャラの凸秘話 entry (なし=凸秘話空)
    6. index.html story-next-teaser が STORY_FILES の最新章の次を指しているか (古い章を teaser しているのは不整合)

    BLOCKER 追加 (2026-05-02 / 2026-05-03):
    7-7. STORY_OUTLINE 次章エントリの releaseDate 必須
    7-8. index.html #story-list-modal に releaseDate 設定済の次章カード必須 (Prismaera Stories 一覧の予告)

    POV1人目固定ルール: 章末ページで次章主人公1人だけ表示は STORY_OUTLINE.povCharName (ルール3 で完全一致確認済)、
    本編シーンで POV1人目は renderSceneChars のランタイム挙動 (静的チェック不可、 CLAUDE.md ルール参照)
    """
    script = ROOT / "script.js"
    index = ROOT / "index.html"
    if not script.exists():
        return 0
    text = script.read_text(encoding="utf-8")
    html = index.read_text(encoding="utf-8") if index.exists() else ""

    # STORY_FILES の章 ID 抽出
    m = re.search(r'const STORY_FILES\s*=\s*\{([\s\S]*?)\};', text)
    if not m:
        return 0
    sf_ids = sorted(set(re.findall(r"^\s+(s1c\d+):\s*\{", m.group(1), re.M)))

    # STORY_ACT_INTROS の章 ID
    m2 = re.search(r'const STORY_ACT_INTROS\s*=\s*\{([\s\S]*?)\n\};', text)
    sai_ids = set(re.findall(r"'(s1c\d+)':\s*\{", m2.group(1))) if m2 else set()

    # index.html gallery-tabs の章 ID
    gt_ids = set(re.findall(r'data-tab="(s1c\d+)"', html))

    # index.html story-list-modal の story-card[data-story=...]
    sc_ids = set(re.findall(r'class="story-card"[^>]*data-story="(s1c\d+)"', html))

    # POOL に chapter='s1c?' があるか
    pool_chap = set(re.findall(r"chapter:\s*'(s1c\d+)'", text))

    # LORE_BY_KEY に s1c? キャラの凸秘話 (キャラ名 → tier_name 形式)
    # 各章の POOL キャラに対して LORE_BY_KEY[ \"<tier>_<name>\" ] が存在するか確認
    m_pool = re.search(r'const POOL\s*=\s*(\{[\s\S]*?\n\});', text)
    pool_chars_by_chap = {}  # {sid: [(tier, name), ...]}
    if m_pool:
        pool_text = m_pool.group(1)
        # tier セクション分割で検出
        for tier_match in re.finditer(r'\b(LR|UR|SSR|SR|R):\s*\[([\s\S]*?)\n  \]', pool_text):
            tier = tier_match.group(1)
            for ent in re.finditer(r'name:\s*"([^"]+)"[^}]*?chapter:\s*\'(s1c\d+)\'', tier_match.group(2)):
                name = ent.group(1)
                chap = ent.group(2)
                pool_chars_by_chap.setdefault(chap, []).append((tier, name))
    # LORE_BY_KEY 抽出
    m_lore = re.search(r'const LORE_BY_KEY\s*=\s*\{([\s\S]*?)\n\};', text)
    lore_keys = set(re.findall(r'"(\w+_[^"]+)"', m_lore.group(1))) if m_lore else set()

    # ホームティザー: index.html story-next-teaser の内側だけ抽出 (空 div = 動的レンダリング、 check skip)
    # 2026-05-03 修正: 動的レンダリング対応 (script.js _renderHomeNextTeaser で実行時に内容生成)
    m_teaser_full = re.search(r'<div class="story-next-teaser"[^>]*>([\s\S]*?)</div>(?=\s*<(?:!--|/?(?:div|section|main)))', html)
    teaser_inner = m_teaser_full.group(1).strip() if m_teaser_full else ''
    teaser_chap_match = re.search(r'第(\d+)章', teaser_inner) if teaser_inner else None
    teaser_chap_num = int(teaser_chap_match.group(1)) if teaser_chap_match else None

    checked = len(sf_ids)
    for sid in sf_ids:
        # 1. STORY_ACT_INTROS BLOCKER
        if sid not in sai_ids:
            violations.append(
                f"[ルール7-1 章追加漏れ] STORY_ACT_INTROS に {sid} 未登録\n"
                f"      → 表紙/中表紙引き文 (主人公モノローグ) が空表示、 script.js STORY_ACT_INTROS に追加要"
            )
        # 2. gallery-tabs BLOCKER
        if sid not in gt_ids:
            violations.append(
                f"[ルール7-2 章追加漏れ] index.html gallery-tabs に {sid} 未登録\n"
                f"      → 図鑑のフィルター第N章ボタンなし、 index.html gallery-tabs に <button data-tab=\"{sid}\"> 追加要"
            )
        # 3. story-list-modal story-card BLOCKER
        if sid not in sc_ids:
            violations.append(
                f"[ルール7-3 章追加漏れ] index.html story-list-modal の story-card に {sid} 未登録\n"
                f"      → 一覧モーダルから章を読めない (disabled / 未active)、 <button class=\"story-card\" data-story=\"{sid}\"> 追加要"
            )
        # 4. POOL キャラ WARNING (アセット未公開段階OK)
        if sid not in pool_chap:
            warnings_only.append(
                f"[ルール7-4 章キャラ未追加] POOL に chapter='{sid}' のキャラなし (アセット未公開なら OK)\n"
                f"      → 章キャラ揃ったら POOL に追加 + chapter フィールド設定要"
            )
        # 5. LORE_BY_KEY 凸秘話 WARNING
        chars = pool_chars_by_chap.get(sid, [])
        missing_lore = []
        for tier, name in chars:
            key = f"{tier}_{name}"
            if key not in lore_keys:
                missing_lore.append(key)
        if missing_lore:
            warnings_only.append(
                f"[ルール7-5 凸秘話未登録] {sid} の {len(missing_lore)}/{len(chars)}キャラ LORE_BY_KEY 未登録\n"
                f"      → 例: {missing_lore[:3]}... (アセット完成段階なら追加推奨、 凸数=R1/SR2/SSR3/UR4/LR5話)"
            )
    # 「公開済」 章 = STORY_FILES + (releaseDate なし or 経過済)
    # 野沢さん指示 2026-05-03 「公開日時になったら変わる仕様」 + 「2 つ次の章は『現在制作中』」 への対応
    from datetime import datetime, timezone
    now_ts = datetime.now(timezone.utc).timestamp()
    m_outline_full = re.search(r'const STORY_OUTLINE\s*=\s*\[([\s\S]*?)\n\];', text)
    outline_text_full = m_outline_full.group(1) if m_outline_full else ''

    def _has_passed_release(sid):
        m_e = re.search(rf"\{{[^}}]*?id:\s*'{sid}'[^}}]*?\}}", outline_text_full)
        if not m_e:
            return True  # outline 未登録 → 公開扱い
        e = m_e.group(0)
        m_rd = re.search(r"releaseDate:\s*'([^']+)'", e)
        if not m_rd:
            return True  # releaseDate なし = 過去公開済
        rd = m_rd.group(1)
        try:
            d = datetime.fromisoformat(rd.replace('Z', '+00:00'))
            if d.tzinfo is None:
                d = d.replace(tzinfo=timezone.utc)
            return d.timestamp() <= now_ts
        except ValueError:
            return True  # parse 失敗 = 公開扱い

    released_ids = [sid for sid in sf_ids if _has_passed_release(sid)]
    last_chap = released_ids[-1] if released_ids else (sf_ids[0] if sf_ids else None)
    last_num = int(re.match(r's1c(\d+)', last_chap).group(1)) if last_chap else 0

    # 6. ホームティザー 次章チェック (BLOCKER 化 2026-05-02、 野沢さん指示「自動チェックなのに s1c4 でボロボロ」)
    # 2026-05-03 修正: ティザーが動的レンダリング (空 div) なら check skip。 静的内容ある場合のみ章番号一致を確認
    if teaser_chap_num is not None and sf_ids:
        next_num = last_num + 1
        if teaser_chap_num != next_num:
            violations.append(
                f"[ルール7-6 ティザー古い BLOCKER] index.html story-next-teaser が「第{teaser_chap_num}章」 を指しているが、 最新公開章は「第{last_num}章」 (s1c{last_num})、 次章ティザーは「第{next_num}章」 にすべき\n"
                f"      → index.html story-next-teaser を 第{next_num}章 (s1c{next_num}) のティザーに更新要 (STORY_OUTLINE['s1c{next_num}'].tagline 参照)"
            )

    # 7. 次章 STORY_OUTLINE.releaseDate チェック (BLOCKER 2026-05-02 野沢さん指示「章末ページのチェックも自動確認入れて」)
    # 最新公開章 + 1 の STORY_OUTLINE エントリに releaseDate がないと、 章末 Coming Soon カード + ホーム画面ティザーの両方で
    # 「📅 公開予定 — お楽しみに」 fallback 表示になる。 公開予定が決まっている前提なので、 必須化。
    # 2026-05-03 修正: 「最新公開章」 = STORY_FILES + releaseDate 経過済、 で動的判定 (公開予定章を除外)
    if sf_ids:
        next_id = f"s1c{last_num + 1}"
        # STORY_OUTLINE 全体抽出して next_id エントリの releaseDate を検査
        m_outline = re.search(r'const STORY_OUTLINE\s*=\s*\[([\s\S]*?)\n\];', text)
        if m_outline:
            outline_text = m_outline.group(1)
            # 各エントリ行を抽出 (1行1エントリ前提)
            entry_pattern = re.compile(r"\{\s*id:\s*'(s1c\d+)'[^}]*\}")
            next_has_release = False
            for em in entry_pattern.finditer(outline_text):
                if em.group(1) == next_id:
                    entry = em.group(0)
                    if 'releaseDate' not in entry:
                        violations.append(
                            f"[ルール7-7 次章公開予定日 BLOCKER] STORY_OUTLINE['{next_id}'] に releaseDate が未設定\n"
                            f"      → 章末 Coming Soon カード + ホーム画面ティザーで「📅 公開予定 — お楽しみに」 fallback になる、 releaseDate: 'YYYY-MM-DD' を必ず追加 (野沢さん指示 2026-05-02 「ホーム画面と同様に公開予定日入れといて」)"
                        )
                    else:
                        next_has_release = True
                    break

            # 7-8. ストーリー一覧モーダル (#story-list-modal) にも 次章 (releaseDate あり) のカードが存在するか
            # (BLOCKER 2026-05-03 野沢さん指示「ストーリー一覧にも予告出して、 章公開時の自動チェックの1つにこれも入れて」)
            # ホーム経由で開く Prismaera Stories モーダルにも 公開予定章カードを並べておくことで、
            # ユーザーが次に何が来るか一覧で把握できる。 _refreshChapterReleaseLocks が自動で chapter-locked + Coming Soon バッジ付与
            if next_has_release:
                # index.html の story-list-modal セクションを抽出
                slm_match = re.search(r'<div id="story-list-modal"[\s\S]*?</div>\s*</div>\s*</div>', html)
                if slm_match:
                    slm_text = slm_match.group(0)
                    if f'data-story="{next_id}"' not in slm_text:
                        violations.append(
                            f"[ルール7-8 ストーリー一覧 次章カード未追加 BLOCKER] index.html #story-list-modal に data-story=\"{next_id}\" のカードが無い\n"
                            f"      → ストーリー一覧モーダルに次章 ({next_id}) の予告カードを追加要 (s1c4 と同形式 + 字数欄は「主人公: 名前」 のみ)\n"
                            f"      → JSの _refreshChapterReleaseLocks が自動で chapter-locked + Coming Soon バッジを付与する (HTML はカード本体だけ追加すればOK)"
                        )
                else:
                    violations.append(
                        f"[ルール7-8 検出失敗] index.html #story-list-modal セクションが見つからず、 次章カードチェックをスキップ"
                    )
    return checked


def check_story_pov_header():
    """ルール9 (BLOCKER): STORY/s1cN.md 冒頭に `**POV**: 名前` 形式の宣言が必要。
    無いと openStory が POV 抽出失敗 → currentStoryPov=null → renderSceneChars の POV 救済が全 scene で skip
    → 「シーン登場リスト 1人目」 が POV にならない (s1c4 で発生した『ボロボロ』の根本原因)。
    """
    story_dir = ROOT / 'content' / 'story'
    if not story_dir.exists():
        return 0
    checked = 0
    for path in sorted(story_dir.glob('s1c*.md')):
        text = path.read_text(encoding='utf-8')
        head = '\n'.join(text.split('\n')[:15])
        m = re.search(r'\*\*POV\*\*\s*[:：]\s*([^\n(（]+)', head)
        if not m:
            violations.append(
                f"[ルール9 POV header 不正 BLOCKER] STORY/{path.name} 冒頭 15行に `**POV**: 名前` 形式の宣言なし\n"
                f"      → openStory の regex `\\*\\*POV\\*\\*\\s*[:：]` にマッチせず POV 救済ロジックが全シーン skip\n"
                f"      → ファイル冒頭 (タイトル h1 直後) に `**POV**: 龍帝 アルテミス (略歴)` 形式で追加要"
            )
        else:
            # POV 名が STORY_OUTLINE.povCharName と一致するか確認
            pov_name = m.group(1).strip()
            sid_match = re.match(r'(s1c\d+)\.md', path.name)
            if sid_match:
                # script.js から STORY_OUTLINE povCharName を抽出
                script = ROOT / 'script.js'
                if script.exists():
                    js = script.read_text(encoding='utf-8')
                    pat = re.compile(rf"id:\s*'{sid_match.group(1)}'[^}}]*?povCharName:\s*'([^']+)'")
                    om = pat.search(js)
                    if om and om.group(1) != pov_name:
                        # 部分一致なら OK: md フルネーム vs outline 短名 etc.
                        # 例: md='龍帝 アルテミス' / outline='龍帝 アルテミス' OK
                        # 例: md='鈴宮 ちさと' / outline='ちさと' (POOL に 'ちさと' が登録) → token 一致で OK
                        ouv = om.group(1)
                        token_match = (
                            pov_name.startswith(ouv) or pov_name.endswith(ouv) or
                            ouv.startswith(pov_name) or ouv.endswith(pov_name) or
                            ouv in pov_name.split() or pov_name in ouv.split()
                        )
                        if not token_match:
                            warnings_only.append(
                                f"[ルール9-2 POV名不一致] STORY/{path.name} の **POV**: '{pov_name}' と STORY_OUTLINE['{sid_match.group(1)}'].povCharName='{ouv}' が一致しない\n"
                                f"      → どちらかに揃える要 (POOL の正確な name と一致が望ましい)"
                            )
        checked += 1
    return checked


def check_outline_foreshadowing(sf_ids):
    """ルール7-9 (BLOCKER): STORY/outline.md「## 仕込み済み伏線」 に公開済章の `### S1CN` セクション必須
    feedback_story_consistency.md: 仕込み時に outline.md 末尾の伏線リストへ即追記、 回収できない伏線は禁止"""
    outline_path = ROOT / 'content' / 'story' / 'outline.md'
    if not outline_path.exists() or not sf_ids:
        return 0
    text = outline_path.read_text(encoding='utf-8')
    fs_match = re.search(r'## 仕込み済み伏線([\s\S]+?)(?=\n## |\Z)', text)
    if not fs_match:
        violations.append(
            f"[ルール7-9 outline 伏線リスト不在 BLOCKER] STORY/outline.md に「## 仕込み済み伏線」 セクションが無い\n"
            f"      → outline.md 末尾に「## 仕込み済み伏線」 + 各章「### S1CN」 サブセクション + 仕込み伏線テーブル"
        )
        return 0
    fs_text = fs_match.group(1)
    checked = 0
    for sid in sf_ids:
        sid_upper = sid.upper()  # s1c1 → S1C1
        ch_num = int(re.search(r's1c(\d+)', sid).group(1))
        # 「### S1CN」 or 「### Season 1 第N章」 or 「### S1CN (Season 1 第N章 — タイトル)」 等
        if re.search(rf'###\s+{sid_upper}\b', fs_text) or re.search(rf'###\s+.*第{ch_num}章', fs_text):
            checked += 1
            continue
        violations.append(
            f"[ルール7-9 outline 伏線 章セクション不在 BLOCKER] STORY/outline.md「## 仕込み済み伏線」 に「### {sid_upper}」 サブセクションが無い\n"
            f"      → 章公開と同時に outline.md の伏線リストに該当章のセクション + 仕込み伏線テーブル ≥ 1件 を追記要"
        )
    return checked


def check_pool_chapter_count(sf_ids, pool_chars_by_chap):
    """ルール7-11 (BLOCKER): outline「Season 1 キャラ追加総数」 の章規模 と POOL の chapter='s1cN' キャラ数 が ± 1 以内
    feedback_story_consistency.md: outline 規模 (キャラ数) を厳守、 思い込み禁止"""
    outline_path = ROOT / 'content' / 'story' / 'outline.md'
    if not outline_path.exists() or not sf_ids:
        return 0
    text = outline_path.read_text(encoding='utf-8')
    # 表行: | S1C1 | 30 | 30 | ... | / | S1C2 | +15 | 45 | ...
    expected = {}  # {sid: count}
    for m in re.finditer(r'\|\s*S1C(\d+)\s*\|\s*([+\d]+)\s*\|', text):
        ch_num = int(m.group(1))
        val = m.group(2).lstrip('+')
        if val.isdigit():
            expected[f's1c{ch_num}'] = int(val)
    checked = 0
    for sid in sf_ids:
        if sid not in expected:
            continue
        target = expected[sid]
        actual = len(pool_chars_by_chap.get(sid, []))
        checked += 1
        # ± 1 以内なら OK
        if abs(actual - target) > 1:
            violations.append(
                f"[ルール7-11 POOL キャラ数 不整合 BLOCKER] {sid} POOL に {actual}キャラ、 outline の規模は +{target}\n"
                f"      → outline.md の「{sid_label(sid)}」 規模と POOL の chapter='{sid}' キャラ数を ±1 以内に揃える要"
            )
    return checked


def sid_label(sid):
    m = re.match(r's1c(\d+)', sid)
    return f"S1C{m.group(1)}" if m else sid


def check_furigana_dictionary(sf_ids, script_text):
    """ルール7-12 (BLOCKER): prompt/s1cN_chars.md / locations_s1cN.md の漢字含む固有名詞 を FURIGANA 辞書に登録
    feedback_chapter_release_checklist.md ⑧: 新キャラ名 + 新地名 + 新派閥名 + 新固有武器/アイテム名 を script.js の FURIGANA 辞書に追加"""
    if not sf_ids:
        return 0
    # FURIGANA 抽出
    m_furi = re.search(r"const FURIGANA\s*=\s*\{([\s\S]*?)\n\};", script_text)
    if not m_furi:
        return 0
    furi_keys = set(re.findall(r"'([^']+)'\s*:", m_furi.group(1)))
    furi_keys.update(re.findall(r'"([^"]+)"\s*:', m_furi.group(1)))
    # POOL の name + title (chapter='s1cN' なら) も対象
    m_pool = re.search(r'const POOL\s*=\s*(\{[\s\S]*?\n\});', script_text)
    pool_text = m_pool.group(1) if m_pool else ''
    checked = 0
    missing_terms = []
    for sid in sf_ids:
        # POOL の chapter='sid' キャラの name (漢字を含むもの)
        for ent in re.finditer(rf'name:\s*"([^"]+)"[^}}]*?chapter:\s*\'{sid}\'', pool_text):
            name = ent.group(1)
            # 各 token に分割して 漢字含むものを抽出
            for token in re.split(r'[\s ]+', name):
                if not token or len(token) < 2:
                    continue
                if not re.search(r'[一-龥]', token):
                    continue  # 漢字なし → ふりがな不要
                if token in furi_keys:
                    continue
                missing_terms.append(('キャラ名', sid, token, name))
                checked += 1
        # prompt/locations_sid.md から地名抽出 (## 【N】 タイトル)
        loc_path = ROOT / 'content' / 'prompt' / 'locations' / f'{sid}.md'
        if loc_path.exists():
            loc_text = loc_path.read_text(encoding='utf-8')
            # ## 【N】 タイトル 形式
            for m in re.finditer(r'^##\s*【\d+】\s*([^\n(（]+)', loc_text, re.M):
                title = m.group(1).strip()
                # 漢字含む単語を抽出 (簡易: 2文字以上の漢字連続)
                for word in re.findall(r'[一-龥]{2,}', title):
                    if word not in furi_keys:
                        missing_terms.append(('地名/場所', sid, word, title))
                        checked += 1
    # 出力 (重複排除、 まとめて1メッセージ)
    if missing_terms:
        unique = list(dict.fromkeys((t[2], t[0]) for t in missing_terms))
        sample = ', '.join(f"「{w}」 ({k})" for w, k in unique[:8])
        more = f" 他 {len(unique) - 8}件" if len(unique) > 8 else ''
        # 暫定 WARNING (既存 s1c1-s1c4 で 67件 未登録の負債、 修正完了後に BLOCKER 化)
        warnings_only.append(
            f"[ルール7-12 FURIGANA 辞書 漢字未登録 WARNING] script.js FURIGANA に {len(unique)}件 未登録: {sample}{more}\n"
            f"      → 章公開時に script.js の FURIGANA 辞書へ全件追加要 (本文で漢字のみ表示されてユーザーが読めない事故防止)\n"
            f"      → 暫定 WARNING、 既存負債解消完了後 BLOCKER 化予定 (野沢さん指示 2026-05-03)"
        )
    return checked


def check_chapter_bgm(sf_ids):
    """ルール7-13 (BLOCKER): 公開済章ごとに章テーマ BGM が prompt/bgm/chapter_s1cN.md として存在 + sw.js PRECACHE_BGM に追加
    outline 「BGM 必要数」 ライン: 章ごとテーマ (S1の7章分) ★★ Season1完成時"""
    if not sf_ids:
        return 0
    sw_path = ROOT / 'sw.js'
    sw_text = sw_path.read_text(encoding='utf-8') if sw_path.exists() else ''
    # PRECACHE_BGM 配列を抽出
    m_pre = re.search(r'const PRECACHE_BGM\s*=\s*\[([\s\S]*?)\];', sw_text)
    pre_text = m_pre.group(1) if m_pre else ''
    checked = 0
    for sid in sf_ids:
        # prompt/bgm/chapter_s1cN.md 存在確認
        prompt_path = ROOT / 'content' / 'prompt' / 'bgm' / f'chapter_{sid}.md'
        if not prompt_path.exists():
            warnings_only.append(
                f"[ルール7-13 章 BGM プロンプト不在 WARNING] prompt/bgm/chapter_{sid}.md が存在しない\n"
                f"      → 公開済章ごとに章テーマ BGM プロンプト必須 (outline ルール: 章ごとテーマ S1で7曲)\n"
                f"      → 暫定 WARNING、 既存負債解消完了後 BLOCKER 化予定"
            )
        else:
            checked += 1
        # sw.js PRECACHE_BGM に該当 mp3 が含まれるか (柔軟マッチ: prism-XXX.mp3 で章キーワード含む)
        prompt_text = prompt_path.read_text(encoding='utf-8') if prompt_path.exists() else ''
        bgm_filename_match = re.search(r'prism-[a-z0-9-]+\.mp3', prompt_text)
        if bgm_filename_match and prompt_path.exists():
            fname = bgm_filename_match.group(0)
            if fname not in pre_text:
                warnings_only.append(
                    f"[ルール7-13 PRECACHE_BGM 未登録 WARNING] sw.js PRECACHE_BGM に '/assets/bgm/{fname}' が無い\n"
                    f"      → 章 BGM ファイル ({fname}) を sw.js の PRECACHE_BGM 配列に追加要"
                )
    return checked


def check_faction_bgm(pool_chars_by_chap):
    """ルール7-14 (BLOCKER 2026-05-03 野沢さん指示): 派閥キャラ ≥ 5名なら派閥テーマ BGM 追加 (prompt/bgm/faction_*.md 必須)
    outline ルール: 派閥テーマ 主要9派閥分 ★ 随時、 ただし派閥キャラ ≥ 5なら必須化"""
    # 全 POOL から派閥別集計 (faction は title or POOL の name から推定不可、 FACTIONS 定義を script.js から抽出)
    script_path = ROOT / 'script.js'
    if not script_path.exists():
        return 0
    text = script_path.read_text(encoding='utf-8')
    # FACTIONS 配列の id+label を抽出
    m_fac = re.search(r'const FACTIONS\s*=\s*\[([\s\S]*?)\n\];', text)
    if not m_fac:
        return 0
    fac_text = m_fac.group(1)
    factions = []  # [(id, label)]
    for fm in re.finditer(r"\{[^}]*id:\s*'([^']+)'[^}]*label:\s*'([^']+)'", fac_text):
        factions.append((fm.group(1), fm.group(2)))
    # キャラ → 派閥マッピング (FACTION_OVERRIDE or 名前から推定 — 実装あり?)
    # 簡易: script.js の CHAR_FACTION (もしあれば) or POOL の faction フィールド
    # 現状 POOL に faction フィールドが無いので、 派閥別キャラ数推定は困難
    # 代替: title に 派閥 label が含まれるかで近似集計
    char_count_by_faction = {fid: 0 for fid, _ in factions}
    fac_label_to_id = {label: fid for fid, label in factions}
    for sid, chars in pool_chars_by_chap.items():
        for tier, name in chars:
            # POOL から 該当キャラの title を抽出
            ent = re.search(rf'name:\s*"{re.escape(name)}"\s*,[^}}]*?title:\s*"([^"]*)"', text)
            if not ent:
                continue
            title = ent.group(1)
            for label, fid in fac_label_to_id.items():
                if label in title or label in name:
                    char_count_by_faction[fid] += 1
                    break
    # PRECACHE_BGM 抽出
    sw_text = (ROOT / 'sw.js').read_text(encoding='utf-8') if (ROOT / 'sw.js').exists() else ''
    m_pre = re.search(r'const PRECACHE_BGM\s*=\s*\[([\s\S]*?)\];', sw_text)
    pre_text = m_pre.group(1) if m_pre else ''
    checked = 0
    for fid, label in factions:
        cnt = char_count_by_faction.get(fid, 0)
        if cnt < 5:
            continue
        checked += 1
        # 派閥テーマ BGM プロンプト存在確認: prompt/bgm/faction_{fid}.md or {label}.md
        prompt_path = ROOT / 'content' / 'prompt' / 'bgm' / f'faction_{fid}.md'
        if not prompt_path.exists():
            # label 短縮版でも探す
            alt = ROOT / 'content' / 'prompt' / 'bgm' / 'factions' / f'{fid}.md'
            if not alt.exists():
                warnings_only.append(
                    f"[ルール7-14 派閥 BGM プロンプト不在 WARNING] prompt/bgm/faction_{fid}.md (or factions/{fid}.md) が無い\n"
                    f"      → 派閥『{label}』 に {cnt}キャラ存在 (≥5)、 派閥テーマ BGM プロンプト必須 (野沢さん指示 2026-05-03 「派閥キャラが5名以上になったら派閥のテーマ曲を追加」)\n"
                    f"      → 暫定 WARNING、 既存負債解消完了後 BLOCKER 化予定"
                )
                continue
            prompt_path = alt
        # PRECACHE_BGM に登録あるか
        prompt_text = prompt_path.read_text(encoding='utf-8')
        bgm_filename_match = re.search(r'prism-[a-z0-9-]+\.mp3', prompt_text)
        if bgm_filename_match:
            fname = bgm_filename_match.group(0)
            if fname not in pre_text:
                warnings_only.append(
                    f"[ルール7-14 PRECACHE_BGM 未登録 (派閥) WARNING] sw.js PRECACHE_BGM に派閥『{label}』 BGM '/assets/bgm/{fname}' が無い\n"
                    f"      → 派閥キャラ {cnt}名 ≥ 5、 派閥テーマ BGM ({fname}) を sw.js PRECACHE_BGM へ追加要"
                )
    return checked


def check_tier_consistency(pool_chars_by_chap):
    """ルール7-15 (WARNING 2026-05-03 野沢さん指示): 同 Tier 内のキャラ title 格揃えチェック
    既存 Tier の title キーワード集合から共通パターンを学習 → 新キャラの title が同パターンに含まれるか
    LR/UR/SSR/SR/R それぞれで「格」 に違和感のあるキャラを警告"""
    # Tier 別キーワード集合 (title 内の漢字キーワードで判定)
    # この集合は既存 Tier キャラの title から動的に学習可
    tier_keywords = {'LR': set(), 'UR': set(), 'SSR': set(), 'SR': set(), 'R': set()}
    script_path = ROOT / 'script.js'
    if not script_path.exists():
        return 0
    text = script_path.read_text(encoding='utf-8')
    # POOL から各キャラ name → title を抽出
    name_to_title = {}
    name_to_tier = {}
    for tier_match in re.finditer(r'\b(LR|UR|SSR|SR|R):\s*\[([\s\S]*?)\n  \]', text):
        tier = tier_match.group(1)
        for ent in re.finditer(r'name:\s*"([^"]+)"\s*,[^}]*?title:\s*"([^"]*)"', tier_match.group(2)):
            name = ent.group(1)
            title = ent.group(2)
            name_to_title[name] = title
            name_to_tier[name] = tier
            # title から 2文字以上の漢字句を抽出して keyword に
            for kw in re.findall(r'[一-龥]{2,}', title):
                tier_keywords[tier].add(kw)
    # 期待格パターン (代表キーワード、 各 Tier に必ず含まれるべきキーワードセット)
    # LR: 「世界」「原虹」「神」 等 / UR: 「皇」「帝」「王」「至天」「波紋」「砂海」「氷帝」「龍帝」 等
    # SSR: 「聖」「達人」「上級」「千年」「将軍」 / SR: 「中堅」「巫女」「騎士」「祭司」 / R: 「学生」「見習い」「若き」「養女」
    expected_anchors = {
        'LR': {'世界', '原虹', '神格', '神'},  # ほぼ唯一無二の格
        'UR': {'皇', '帝', '王', '至天', '覇', '聖女', '神格', '波紋', '海', '砂', '凍', '空', '虹', '黒', '龍', '原虹', '霊'},  # 王族・覇者級
        'SSR': {'聖', '達人', '上級', '千年', '将軍', '上騎士', '師', '師範', '宰相', '近衛', '高位'},
        'SR': {'中堅', '巫女', '騎士', '祭司', '剣士', '魔導', '冒険者', '戦士', '商人', '研究員', '武者'},
        'R': {'学生', '見習い', '若', '養女', '従者', '助手', '初心', '少年', '少女', '弟子', '侍童', '一般'},
    }
    checked = 0
    for sid, chars in pool_chars_by_chap.items():
        for tier, name in chars:
            title = name_to_title.get(name, '')
            if not title:
                continue
            checked += 1
            # title 内に Tier 期待アンカーがあるか
            anchors = expected_anchors.get(tier, set())
            kanji_in_title = set(re.findall(r'[一-龥]{1,}', title))
            # 部分一致 (アンカーキーワードが title 内のいずれかの漢字句に含まれる)
            matched = False
            for anchor in anchors:
                if any(anchor in kw for kw in kanji_in_title):
                    matched = True
                    break
            if not matched:
                # WARNING (false positive 多発防止)
                warnings_only.append(
                    f"[ルール7-15 Tier 整合性 WARNING] {sid} {tier}「{name}」 title='{title}' に {tier} 級アンカーキーワード ({', '.join(sorted(anchors)[:6])}…) なし\n"
                    f"      → Tier 格と違和感ないか確認、 必要なら title 調整 or Tier 見直し (野沢さん指示 2026-05-03 「同じレア度に追加しても遜色ないか」)"
                )
    return checked


def check_prompt_metadata(sf_ids):
    """ルール7-16 (BLOCKER): prompt/locations_*.md の各画像セクション内に「対応シーン」 等のメタ記載必須
    feedback_asset_scene_mapping.md (2026-04-30 強い叱責 「別PC・別セッションで作業遂行できる引き継ぎじゃないと意味ない」)"""
    target_dir = ROOT / 'content' / 'prompt'
    if not target_dir.exists() or not sf_ids:
        return 0
    REQUIRED_META = ['対応シーン', 'ストーリー使用']  # どちらか1つあれば OK (一部は world_map 等 純風景で不要だが、 章別 locations_s1cN.md は必須)
    checked = 0
    missing_sections = []
    for sid in sf_ids:
        loc_path = target_dir / f'locations_{sid}.md'
        if not loc_path.exists():
            continue
        text = loc_path.read_text(encoding='utf-8')
        # ## 【N】 セクション分割
        sections = re.split(r'(?=^##\s*【\d+】)', text, flags=re.M)
        for sec in sections:
            first_line = sec.split('\n', 1)[0].strip()
            if not first_line.startswith('## 【'):
                continue
            checked += 1
            if not any(meta in sec for meta in REQUIRED_META):
                section_title = re.search(r'## 【\d+】\s*([^\n]+)', first_line)
                title = section_title.group(1) if section_title else first_line
                missing_sections.append(f"{loc_path.name} :: {title}")
    if missing_sections:
        sample = '\n        '.join(missing_sections[:5])
        more = f"\n        ... 他 {len(missing_sections) - 5}件" if len(missing_sections) > 5 else ''
        violations.append(
            f"[ルール7-16 アセットメタ記載漏れ BLOCKER] prompt/locations_*.md の {len(missing_sections)} セクションに「対応シーン」 「ストーリー使用」 が無い\n"
            f"      {sample}{more}\n"
            f"      → 各画像セクション内に対応シーン・本文行・コード参照位置を記載必須 (feedback_asset_scene_mapping.md / 2026-04-30 別PC事故防止強い叱責)"
        )
    return checked


def check_all_chars_have_faction(pool_chars_by_chap, script_text):
    """ルール7-21 (BLOCKER 2026-05-03 野沢さん指示「整合性ちゃんとしろよ」): POOL 全キャラが
    CHAR_FACTION に登録されているかチェック。 未登録は WM 上で派閥所属が表示されない事故源
    (実例 2026-05-03: アルク/ミウ/ピピ/ピット 誤所属 + s1c4 主要 16 キャラ未登録の構造的整合性違反)。

    詳細: feedback_world_map_consistency.md / feedback_total_integrity_check.md
    """
    if not pool_chars_by_chap or not script_text:
        return 0
    m = re.search(r'const CHAR_FACTION\s*=\s*\{([\s\S]*?)\n\};', script_text)
    if not m:
        return 0
    char_faction_text = m.group(1)
    registered = set(re.findall(r"'([^']+)':\s*\{", char_faction_text))
    missing = []
    for sid in sorted(pool_chars_by_chap.keys()):
        for tier, name in pool_chars_by_chap[sid]:
            if name not in registered:
                missing.append((sid, tier, name))
    if missing:
        sample = ', '.join(f'{sid}/{t}「{n}」' for sid, t, n in missing[:6])
        more = f' 他 {len(missing) - 6}件' if len(missing) > 6 else ''
        violations.append(
            f"[ルール7-21 CHAR_FACTION 未登録 BLOCKER] POOL の {len(missing)}キャラが CHAR_FACTION に未登録: {sample}{more}\n"
            f"      → 各キャラの派閥所属を script.js CHAR_FACTION に追加 (WM/相関図で表示するため)"
        )
    return len(missing)


def check_chapter_factions_registered(sf_ids, script_text):
    """ルール7-22 (BLOCKER 2026-05-03 野沢さん指示): outline.md の各章 (公開済 + 公開予定) の「新派閥」 が
    FACTIONS 配列 + FACTION_WORLD_COORDS の両方に登録されているかチェック。

    実例 2026-05-03: ニーヴル/ゼノニア が outline.md s1c4 で「新派閥」 として記載されているのに
    FACTIONS / FACTION_WORLD_COORDS どちらにも未登録の構造バグ。 章追加時の登録漏れ防止。
    """
    outline_path = ROOT / 'content' / 'story' / 'outline.md'
    if not outline_path.exists() or not script_text:
        return 0
    outline = outline_path.read_text(encoding='utf-8')
    factions_text = ''
    m1 = re.search(r'const FACTIONS\s*=\s*\[([\s\S]*?)\n\];', script_text)
    if m1:
        factions_text = m1.group(1)
    coords_text = ''
    m2 = re.search(r'const FACTION_WORLD_COORDS\s*=\s*\{([\s\S]*?)\n\};', script_text)
    if m2:
        coords_text = m2.group(1)
    # outline から各章セクションの「新派閥」 を抽出 (S1C1〜S3C7)
    chapter_sections = re.findall(r'## (S[123]C\d+):.*?(?=\n## |\Z)', outline, re.S)
    # 章テキスト 個別抽出
    section_blocks = re.split(r'(?=^## S[123]C\d+:)', outline, flags=re.M)
    n = 0
    for block in section_blocks:
        m_head = re.match(r'## (S[123]C\d+):', block)
        if not m_head:
            continue
        cid = m_head.group(1)
        # 公開予定章まで含む (releaseDate 設定済 = まだ未公開でも登録必要)
        # ただし S2/S3 は将来のため現時点では検査スキップ
        if not cid.startswith('S1C'):
            continue
        m_fac = re.search(r'\*\*新派閥\*\*[:：]\s*(.+)', block)
        if not m_fac:
            continue
        factions_str = m_fac.group(1).strip()
        factions = [f.strip() for f in re.split(r'[\/／+、,]', factions_str) if f.strip()]
        for fac in factions:
            n += 1
            if fac not in factions_text:
                violations.append(
                    f"[ルール7-22 FACTIONS 未登録 BLOCKER] outline.md {cid} 新派閥「{fac}」 が script.js FACTIONS 配列に未登録\n"
                    f"      → 章追加時に FACTIONS + FACTION_WORLD_COORDS + CHAR_FACTION への追加忘れ防止"
                )
    return n


def check_dup_name_unmarked(sf_ids, pool_chars_by_chap, script_text):
    """ルール7-18 (BLOCKER 2026-05-03 野沢さん指示): POOL の lastToken (空白で分割した最後のトークン) が
    複数キャラで重複している場合、 STORY 本文中でその単独表記が ID-based マークアップ
    `{{char:slug}}...{{/char}}` で囲まれていなければ BLOCKER。

    重複名の自動 linkify は最初にヒットしたキャラに紐付くため、 別キャラへの誤紐付け事故が起きる
    (実例 2026-05-03 野沢さん指摘: s1c4 本文の「ベル」 単独表記が s1c1「詠聖ベル」 にリンクされる)。
    ID-based マークアップで確定リンクを義務化することで、 同名重複問題を構造的に解決。

    例外: STORY_CHAR_REMAP に登録されている fromName は、 文脈依存で意図的に切り替えるロジック
    (覚醒前後の linkify ターゲット変更等) が動いているため、 マークアップ化を強制しない。

    詳細: feedback_id_based_char_link.md (新規)
    """
    if not pool_chars_by_chap:
        return 0
    # STORY_CHAR_REMAP の fromName 集合を抽出 (例外リスト)
    remap_keys = set()
    m_remap = re.search(r'const STORY_CHAR_REMAP\s*=\s*\{([\s\S]*?)\n\};', script_text or '')
    if m_remap:
        for k in re.findall(r"'([^']+)':\s*'", m_remap.group(1)):
            remap_keys.add(k)
    last_tokens = {}
    for sid in pool_chars_by_chap:
        for tier, name in pool_chars_by_chap[sid]:
            tokens = name.split()
            last_token = tokens[-1] if tokens else name
            last_tokens.setdefault(last_token, []).append((name, sid))
    duplicates = {tok: lst for tok, lst in last_tokens.items() if len(lst) >= 2}
    if not duplicates:
        return 0
    for sid in sf_ids:
        path = ROOT / 'content' / 'story' / f'{sid}.md'
        if not path.exists():
            continue
        text = path.read_text(encoding='utf-8')
        # 「## 編集メモ」 以降は公開対象外コメント領域、 検査対象外
        em_idx = text.find('## 編集メモ')
        if em_idx == -1:
            em_idx = text.find('# 編集メモ')
        if em_idx >= 0:
            text = text[:em_idx]
        cleaned = re.sub(r'\{\{char:[\w_-]+\}\}.*?\{\{\/char\}\}', '', text, flags=re.S)
        # POOL 全キャラの fullName で tok を文字列内に含むものを集める (例: tok='ベル' なら 'イザベル' '詠聖 ベル' '波紋の聖女 イザベル' 等)
        # 長い順にソートして除去 (短いの除去で長いの壊さないため)
        all_names = []
        for sid_x in pool_chars_by_chap:
            for tier_x, name_x in pool_chars_by_chap[sid_x]:
                all_names.append(name_x)
        all_names = sorted(set(all_names), key=len, reverse=True)
        for tok, lst in duplicates.items():
            if tok in remap_keys:
                continue  # STORY_CHAR_REMAP で文脈解決済の重複は除外
            cleaned_for_tok = cleaned
            # tok を文字列内に含む POOL キャラ名 (tok自身は除く) を全部除去
            # これで tok 単独表記だけが残り、 「イザベル」 内の「ベル」 等の部分一致誤検知を防ぐ
            for full_name in all_names:
                if tok in full_name and full_name != tok:
                    cleaned_for_tok = cleaned_for_tok.replace(full_name, '')
            if re.search(re.escape(tok), cleaned_for_tok):
                names_str = ' / '.join(name for name, _ in lst)
                violations.append(
                    f"[ルール7-18 同名キャラ単独表記 BLOCKER] STORY/{path.name} に同名キャラ「{tok}」 (POOL 重複: {names_str}) の単独表記。 "
                    f"`{{{{char:slug}}}}{tok}{{{{/char}}}}` で確定リンクすべき"
                )
    return len(duplicates)


def check_next_chapter_wm(sf_ids, script_text):
    """ルール7-19 (BLOCKER 2026-05-03 野沢さん指示): 公開予定の次章 (releaseDate 設定済) の新派閥が、
    既に WM (FACTION_WORLD_COORDS / STORY_FACTION_TEASER) に登録されているかチェック。

    s1c5 公開時に s1c6 の派閥がマップに表示されていないと、 章遷移後にユーザーが「次章どこ?」 と迷う。
    公開直前ではなく、 章執筆中から WM 反映を機械的に強制する。
    """
    if not sf_ids:
        return 0
    nums = sorted(int(re.match(r's1c(\d+)', s).group(1)) for s in sf_ids if re.match(r's1c\d+', s))
    if not nums:
        return 0
    last_num = nums[-1]
    next_num = last_num + 1
    outline_path = ROOT / 'content' / 'story' / 'outline.md'
    if not outline_path.exists():
        return 0
    outline = outline_path.read_text(encoding='utf-8')
    sect_match = re.search(rf'## S1C{next_num}:.*?\n([\s\S]*?)(?=\n## |\n---|\Z)', outline)
    if not sect_match:
        return 0
    section = sect_match.group(1)
    fac_match = re.search(r'\*\*新派閥\*\*[:：]\s*(.+)', section)
    if not fac_match:
        return next_num
    factions_str = fac_match.group(1).strip()
    factions = [f.strip() for f in re.split(r'[\/／+、,]', factions_str) if f.strip()]
    for fac in factions:
        if fac not in script_text:
            violations.append(
                f"[ルール7-19 次章 WM 派閥ポイント未登録 BLOCKER] outline.md S1C{next_num} 新派閥「{fac}」 が script.js (FACTION_WORLD_COORDS / STORY_FACTION_TEASER) に未登録。 "
                f"次章公開時に WM で位置確認できないため、 公開前に必ず登録"
            )
    return next_num


def check_age_excess(sf_ids):
    """ルール7-20 (WARNING 2026-05-03 野沢さん指示): 1シーン内の年齢明示が 3件以上 → 過剰アピール警告

    野沢さん指摘: 「年齢のアピールがすごい」「キャラ自体は若めにしてもらいましたが、
    それをアピールしろという意味ではない」。 アルテミス千年との対比効果を狙いすぎず、
    脇役の年齢は質的表現 (「若き」「青年」「見習い」 等) で代替可能。
    """
    age_pattern = re.compile(r'[一二三四五六七八九十百千]+(?:歳|代後半|代前半|代)')
    n = 0
    for sid in sf_ids:
        path = ROOT / 'content' / 'story' / f'{sid}.md'
        if not path.exists():
            continue
        text = path.read_text(encoding='utf-8')
        scenes = re.split(r'^(### [\d\-]+:.*)$', text, flags=re.M)
        i = 1
        while i < len(scenes):
            scene_title = scenes[i].strip()
            scene_body = scenes[i+1] if i+1 < len(scenes) else ''
            ages = age_pattern.findall(scene_body)
            if len(ages) >= 3:
                warnings_only.append(
                    f"[ルール7-20 年齢明示過剰 WARNING] STORY/{path.name} {scene_title} に年齢明示 {len(ages)}件 (脇役の年齢を「若き」「青年」 等の質的表現に置換できないか検討)"
                )
                n += 1
            i += 2
    return n


def check_char_age_keywords(sf_ids):
    """ルール7-17 (WARNING): prompt/s1cN_chars.md の各キャラセクションで「老/中年/30代以上」 等の年齢ワード警告
    feedback_char_age_youth_first.md (2026-05-01) ガチャキャラ画像は若め (10-20代) を既定、 老人キャラ最小化"""
    target_dir = ROOT / 'content' / 'prompt'
    if not target_dir.exists() or not sf_ids:
        return 0
    AGE_WORDS = ['老人', '老戦士', '老師', '老兵', '年老', '中年', '初老', '熟年', '老',
                 '30代', '40代', '50代', '60代', '70代', '80代',
                 'middle-aged', 'elderly', 'old man', 'old woman']
    EXEMPT_WORDS = ['老ける', '老けず', '老不死', '不老']  # 不老等は OK (若さの逆説的表現)
    checked = 0
    for sid in sf_ids:
        chars_path = target_dir / f'{sid}_chars.md'
        if not chars_path.exists():
            continue
        text = chars_path.read_text(encoding='utf-8')
        # ## 【N】 セクション分割
        sections = re.split(r'(?=^##\s*【\d+】)', text, flags=re.M)
        for sec in sections:
            first_line = sec.split('\n', 1)[0].strip()
            if not first_line.startswith('## 【'):
                continue
            checked += 1
            # 該当 word ある + 除外 word なし
            hits = []
            for w in AGE_WORDS:
                if w in sec and not any(ex in sec for ex in EXEMPT_WORDS if w in ex):
                    hits.append(w)
            if hits:
                section_title = re.search(r'## 【\d+】\s*([^\n]+)', first_line)
                title = section_title.group(1) if section_title else first_line
                warnings_only.append(
                    f"[ルール7-17 ガチャキャラ年齢WARN] {chars_path.name} :: {title}\n"
                    f"      → 年齢ワード検出: {', '.join(set(hits))}\n"
                    f"      → ガチャキャラは 10-20代 既定、 年齢/熟練はロリババア・古龍血・継承者設定・神童で表現 (feedback_char_age_youth_first.md)"
                )
    return checked


def check_short_kana_collisions(pool_chars_by_chap=None):
    """ルール8 (WARNING): 短いカタカナキャラ名 (2-3文字) が他のカタカナ単語に部分一致しないか
    例: 「イル」 (祭司 R) が 「ヘイル」 「イルディラ」 にマッチ → char-detail 誤発火
    linkifyCharNames が katakana 境界 lookbehind/lookahead で防御済だが、 該当箇所を可視化"""
    script = ROOT / "script.js"
    if not script.exists():
        return 0
    text = script.read_text(encoding="utf-8")
    if pool_chars_by_chap is None:
        # POOL 抽出 (check_chapter_completeness と同じロジック、 重複だが function 単独動作のため)
        m_pool = re.search(r'const POOL\s*=\s*(\{[\s\S]*?\n\});', text)
        pool_chars_by_chap = {}
        if m_pool:
            pool_text = m_pool.group(1)
            for tier_match in re.finditer(r'\b(LR|UR|SSR|SR|R):\s*\[([\s\S]*?)\n  \]', pool_text):
                tier = tier_match.group(1)
                for ent in re.finditer(r'name:\s*"([^"]+)"[^}]*?chapter:\s*\'(s1c\d+)\'', tier_match.group(2)):
                    pool_chars_by_chap.setdefault(ent.group(2), []).append((tier, ent.group(1)))
    short_kana = []  # (sid, tier, fullname, token)
    for sid, chars in pool_chars_by_chap.items():
        for tier, name in chars:
            for tok in re.split(r'[\s ]+', name):
                if 2 <= len(tok) <= 3 and re.fullmatch(r'[ァ-ヶー]+', tok):
                    short_kana.append((sid, tier, name, tok))
    checked = len(short_kana)
    for sid, tier, fullname, tok in short_kana:
        story_path = ROOT / 'content' / 'story' / f'{sid}.md'
        if not story_path.exists():
            continue
        try:
            story_text = story_path.read_text(encoding='utf-8')
        except Exception:
            continue
        # 「他のカタカナ単語の部分文字列として」 出現するか — 前後どちらかがカタカナで囲まれている
        pat = re.compile(rf'(?<=[ァ-ヶー]){re.escape(tok)}|{re.escape(tok)}(?=[ァ-ヶー])')
        matches = pat.findall(story_text)
        if matches:
            warnings_only.append(
                f"[ルール8 部分一致警告] {sid} の {tier}「{fullname}」 短名「{tok}」 が STORY/{sid}.md の他のカタカナ単語の部分文字列として {len(matches)}箇所出現\n"
                f"      → linkifyCharNames が katakana 境界で防御済だが、 dev で目視確認推奨 (例: 「{tok}」 タップで誤キャラ画面が開かないか)"
            )
    return checked


# warnings 専用集積
warnings_only = []


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


# === 共通抽出ヘルパー (7-9 以降のルールで使う、 check_chapter_completeness の重複を最小化) ===
def extract_chapter_data():
    """script.js から sf_ids / pool_chars_by_chap / script_text を抽出"""
    script_path = ROOT / 'script.js'
    if not script_path.exists():
        return [], {}, ''
    text = script_path.read_text(encoding='utf-8')
    m_sf = re.search(r'const STORY_FILES\s*=\s*\{([\s\S]*?)\};', text)
    sf_ids = sorted(set(re.findall(r"^\s+(s1c\d+):\s*\{", m_sf.group(1), re.M))) if m_sf else []
    m_pool = re.search(r'const POOL\s*=\s*(\{[\s\S]*?\n\});', text)
    pool_chars_by_chap = {}
    if m_pool:
        pool_text = m_pool.group(1)
        for tier_match in re.finditer(r'\b(LR|UR|SSR|SR|R):\s*\[([\s\S]*?)\n  \]', pool_text):
            tier = tier_match.group(1)
            for ent in re.finditer(r'name:\s*"([^"]+)"[^}]*?chapter:\s*\'(s1c\d+)\'', tier_match.group(2)):
                pool_chars_by_chap.setdefault(ent.group(2), []).append((tier, ent.group(1)))
    return sf_ids, pool_chars_by_chap, text


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
n7 = check_chapter_completeness()
print(f"  ルール7 (章追加漏れ): {n7}章 検査 [BLOCKER]")
# ルール7-6 (ホームティザー) は 7 内部で BLOCKER 化済み (2026-05-02)
n9 = check_story_pov_header()
print(f"  ルール9 (POV header 形式): {n9}章 検査 [BLOCKER]")

# === 章公開準備 ルール (BLOCKER + WARNING、 2026-05-03 過去叱責漏れ対策) ===
sf_ids_x, pool_x, script_text_x = extract_chapter_data()
n7_9 = check_outline_foreshadowing(sf_ids_x)
print(f"  ルール7-9 (outline 伏線リスト 章セクション): {n7_9}章 検査 [BLOCKER]")
n7_11 = check_pool_chapter_count(sf_ids_x, pool_x)
print(f"  ルール7-11 (POOL 章キャラ数 整合): {n7_11}章 検査 [BLOCKER]")
n7_12 = check_furigana_dictionary(sf_ids_x, script_text_x)
print(f"  ルール7-12 (FURIGANA 辞書 漢字未登録): {n7_12}件 検査 [WARNING / 既存負債解消後 BLOCKER 化予定]")
n7_13 = check_chapter_bgm(sf_ids_x)
print(f"  ルール7-13 (章 BGM プロンプト + PRECACHE_BGM): {n7_13}章 検査 [WARNING / 既存負債解消後 BLOCKER 化予定]")
n7_14 = check_faction_bgm(pool_x)
print(f"  ルール7-14 (派閥 BGM ≥5キャラ): {n7_14}派閥 検査 [WARNING / 既存負債解消後 BLOCKER 化予定]")
n7_16 = check_prompt_metadata(sf_ids_x)
print(f"  ルール7-16 (アセット メタ記載): {n7_16}セクション 検査 [BLOCKER]")
n7_18 = check_dup_name_unmarked(sf_ids_x, pool_x, script_text_x)
print(f"  ルール7-18 (同名キャラ ID-based マークアップ): {n7_18}重複名 検査 [BLOCKER]")
n7_19 = check_next_chapter_wm(sf_ids_x, script_text_x)
print(f"  ルール7-19 (次章 WM 派閥ポイント): s1c{n7_19} 検査 [BLOCKER]")
n7_21 = check_all_chars_have_faction(pool_x, script_text_x)
print(f"  ルール7-21 (CHAR_FACTION 全キャラ登録): {n7_21}未登録 検査 [BLOCKER]")
n7_22 = check_chapter_factions_registered(sf_ids_x, script_text_x)
print(f"  ルール7-22 (章 新派閥 FACTIONS 登録): {n7_22}派閥 検査 [BLOCKER]")

# === バージョン管理 ルール (BLOCKER 2026-05-04 野沢さん指示「同様のミスが起きないように」) ===
def _current_branch():
    r = subprocess.run(["git", "-C", str(ROOT), "rev-parse", "--abbrev-ref", "HEAD"],
                       capture_output=True, text=True, encoding="utf-8", errors="replace")
    return (r.stdout or "").strip() if r.returncode == 0 else ""

def _read_version_at(ref):
    """指定 ref の version.json から version を読む。 取れなければ None"""
    r = subprocess.run(["git", "-C", str(ROOT), "show", f"{ref}:version.json"],
                       capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0 or not r.stdout:
        return None
    try:
        return json.loads(r.stdout).get("version")
    except Exception:
        return None


def _read_last_dev_suffix_at(ref):
    """指定 ref の version.json から lastDevSuffix を読む (案A 連続管理用)。 無ければ ''"""
    r = subprocess.run(["git", "-C", str(ROOT), "show", f"{ref}:version.json"],
                       capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0 or not r.stdout:
        return ""
    try:
        return json.loads(r.stdout).get("lastDevSuffix", "") or ""
    except Exception:
        return ""

def check_dev_version_suffix():
    """ルール7-23 (BLOCKER 2026-05-04): dev branch では version は X.Y.Z または {X.Y.Z}{suffix(a-z+)} 形式必須。
    主バージョン (X.Y.Z) bump は main マージ時のみ、 dev では suffix a/b/c... で進行 (a→z→aa→ab→...)。
    詳細: CLAUDE.md feedback_prismaera_version_suffix.md
    """
    if _current_branch() != "dev":
        return 0
    ver_path = ROOT / "version.json"
    if not ver_path.exists():
        return 0
    try:
        cur_ver = json.load(ver_path.open(encoding="utf-8"))["version"]
    except Exception:
        return 0
    main_ver = _read_version_at("origin/main")
    if main_ver is None:
        return 0
    ok = False
    if cur_ver == main_ver:
        ok = True
    elif cur_ver.startswith(main_ver):
        suffix = cur_ver[len(main_ver):]
        if re.fullmatch(r"[a-z]+", suffix):
            ok = True
    if not ok:
        violations.append(
            f"[ルール7-23 dev version 不正 BLOCKER] dev branch の version='{cur_ver}' は不正。\n"
            f"      origin/main='{main_ver}' と同じ、 または '{main_ver}a' / '{main_ver}b' ... '{main_ver}z' / '{main_ver}aa' / '{main_ver}ab' ... の suffix 形式 必須。\n"
            f"      → 主バージョン (X.Y.Z) bump は main マージ時のみ、 dev では手動で suffix 進行。\n"
            f"      → 詳細: CLAUDE.md feedback_prismaera_version_suffix.md"
        )
    return 1


def _increment_suffix(s):
    """Excel column 風 文字列 increment: '' → 'a', 'a' → 'b', ..., 'z' → 'aa', 'aa' → 'ab', ..., 'zz' → 'aaa'"""
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
    return "a" + "".join(chars)


def check_dev_suffix_progression():
    """ルール7-25 (BLOCKER 2026-05-05 野沢さん指示「同様のミスが二度と起こらないように」):
    dev branch で commit する時、 suffix は前 commit から 1段階増分 必須 (a→b、 z→aa、 zz→aaa)。
    X.Y.Z 跨ぎ (main merge 直後) は suffix 'a' で開始 必須。
    suffix skip (a→c)、 後退 (b→a)、 同一 (a→a) は全て BLOCKER。
    """
    if _current_branch() != "dev":
        return 0
    ver_path = ROOT / "version.json"
    if not ver_path.exists():
        return 0
    try:
        cur_ver = json.load(ver_path.open(encoding="utf-8"))["version"]
    except Exception:
        return 0
    parent_ver = _read_version_at("HEAD")  # 親 commit (今 commit が積まれる前)
    if parent_ver is None or parent_ver == cur_ver:
        # 初回 commit or 同じ (= bump し忘れ)、 同じなら別ルール (7-23) で検出
        return 0
    m_cur = re.match(r"^(\d+\.\d+\.\d+)([a-z]*)$", cur_ver)
    m_par = re.match(r"^(\d+\.\d+\.\d+)([a-z]*)$", parent_ver)
    if not m_cur or not m_par:
        return 0
    cur_base, cur_suffix = m_cur.groups()
    par_base, par_suffix = m_par.groups()
    if cur_base != par_base:
        # X.Y.Z 跨ぎ → main merge 直後、 suffix='a' で開始
        if cur_suffix != "a":
            violations.append(
                f"[ルール7-25 dev suffix リセット 不正 BLOCKER] X.Y.Z bump 後 ({parent_ver} → {cur_ver}) の dev suffix は 'a' で開始必須。\n"
                f"      → 期待: {cur_base}a / 実際: {cur_ver}\n"
                f"      → main merge 直後の dev は a から再開する仕様 (野沢さん指示 2026-05-05)"
            )
            return 1
        return 0
    # 案A 連続管理 (野沢さん指示 2026-05-05): parent commit の version が X.Y.Z で suffix 空、
    # かつ lastDevSuffix が残っている場合 (緊急 hotfix sed strip 後の同 X.Y.Z 系列継続) は、
    # lastDevSuffix を seed に increment 期待 (例: par='1.4.4' + lastDevSuffix='h' → cur='1.4.4i')
    if not par_suffix:
        parent_last_dev = _read_last_dev_suffix_at("HEAD")
        if parent_last_dev:
            expected = _increment_suffix(parent_last_dev)
            if cur_suffix != expected:
                violations.append(
                    f"[ルール7-25 dev suffix 案A 不正増分 BLOCKER] {parent_ver} (lastDevSuffix='{parent_last_dev}') → {cur_ver} は不正。\n"
                    f"      → 期待: {par_base}{expected} (lastDevSuffix '{parent_last_dev}' を 1段階 increment)\n"
                    f"      → 案A 連続管理 (緊急 hotfix sed strip 後で 同 X.Y.Z 系列継続時) の挙動。\n"
                    f"      → bump_version.py dev-suffix で自動進行可能"
                )
                return 1
            return 0
    expected = _increment_suffix(par_suffix or "")
    if cur_suffix != expected:
        violations.append(
            f"[ルール7-25 dev suffix 不正増分 BLOCKER] {parent_ver} → {cur_ver} は不正。\n"
            f"      → 期待: {par_base}{expected} (前 suffix '{par_suffix}' を 1段階 increment)\n"
            f"      → 仕様: a→b→...→z→aa→ab→...→az→ba→...→zz→aaa (skip / 後退 / 同一 全て NG)\n"
            f"      → bump_version.py dev-suffix で自動進行可能 (野沢さん指示 2026-05-05)"
        )
        return 1
    return 0


def check_cache_buster_format():
    """ルール7-26 (BLOCKER 2026-05-05 野沢さん指示): cache buster (?v=) は version.json の version と完全同期 必須。
    日付ベース (?v=20260505a 等) や 不一致 cache buster は 旧仕様残存・同期漏れ で BLOCKER。

    2026-05-06 拡張: scheduledRelease モード対応。 同モードでは data.version が 旧 維持で
    既にデプロイされる JS / CSS / 画像 は 新 version 機能を含むため、 cache buster は
    scheduledRelease.version (= effective version) と同期すべき。
    """
    ver_path = ROOT / "version.json"
    if not ver_path.exists():
        return 0
    try:
        data = json.load(ver_path.open(encoding="utf-8"))
        ver = data.get("version", "")
        scheduled_ver = (data.get("scheduledRelease") or {}).get("version")
        # scheduled モードでは scheduledRelease.version で 比較 (cache buster は 新版同期)
        if scheduled_ver:
            ver = scheduled_ver
    except Exception:
        return 0
    targets = [
        ROOT / "index.html",
        ROOT / "cardgame" / "index.html",
        ROOT / "cardgame" / "script.js",
        ROOT / "sw.js",
    ]
    found_violations = 0
    for path in targets:
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        # ?v= で始まる cache buster
        for m in re.finditer(r"\?v=([\w.]+)", text):
            cb = m.group(1)
            if cb != ver:
                # 例外: manifest.json の cache buster は version + suffix (例: 1.4.2g1) も許容
                if path.name == "index.html" and re.match(r"^" + re.escape(ver) + r"\d+$", cb):
                    continue
                # 例外: scheduled モード中の修正用 suffix (例: 1.5.0a) も許容
                # data.version != scheduled.version のため ver は scheduled.version (1.5.0) になっており、
                # 修正 push で cache buster を 1.5.0a 等に bump して 強制 fetch する 運用パターン
                if re.match(r"^" + re.escape(ver) + r"[a-z]+$", cb):
                    continue
                violations.append(
                    f"[ルール7-26 cache buster 不一致 BLOCKER] {path.relative_to(ROOT)} に '?v={cb}' (version='{ver}' と不一致)\n"
                    f"      → 全 cache buster は version.json の version と完全同期 必須\n"
                    f"      → 旧仕様 (?v=YYYYMMDDx) 残存検出 or bump_version.py 同期漏れ\n"
                    f"      → bump_version.py dev-suffix で全ファイル一括統一 可能"
                )
                found_violations += 1
                break  # 同ファイル内の他箇所も同じ問題なので 1 件だけ記録
    return found_violations

def check_img_cache_version_sync():
    """ルール7-28 (BLOCKER 2026-05-06 野沢さん指示): script.js の IMG_CACHE_VERSION は
    version.json の version と完全同期 必須。
    背景: 5/4 の 20260504o から 5/6 までの 5日間 bump 漏れで SW cache が 古版で 404 を キャッシュ → 場所画像/挿絵が反映されない 致命バグが 発生 (s1c5 公開直前)。
    bump_version.py の update_img_cache_version で 自動同期するが、 念のため commit 時に
    機械的に検証 (二度と起こさない物理防御)。
    """
    ver_path = ROOT / "version.json"
    script_path = ROOT / "script.js"
    if not (ver_path.exists() and script_path.exists()):
        return 0
    try:
        data = json.load(ver_path.open(encoding="utf-8"))
        ver = data.get("version", "")
        scheduled_ver = (data.get("scheduledRelease") or {}).get("version")
        # scheduled モードでは scheduledRelease.version 同期 (cache buster は新版同期)
        if scheduled_ver:
            ver = scheduled_ver
    except Exception:
        return 0
    text = script_path.read_text(encoding="utf-8")
    m = re.search(r"const\s+IMG_CACHE_VERSION\s*=\s*'([\w.]+)'", text)
    if not m:
        return 0
    img_ver = m.group(1)
    # scheduled モード中の修正用 suffix (1.5.0a 等) も許容 (cache buster ルール7-26 と同条件)
    if img_ver != ver and not re.match(r"^" + re.escape(ver) + r"[a-z]+$", img_ver):
        violations.append(
            f"[ルール7-28 IMG_CACHE_VERSION 不一致 BLOCKER] script.js IMG_CACHE_VERSION='{img_ver}' "
            f"が version.json version='{ver}' と 不一致。\n"
            f"      → 場所画像/挿絵が SW cache で 古版 (?v={img_ver}) のまま固定化される事故 (5/4-5/6 5日間 bump 漏れ事故 再発防止)\n"
            f"      → bump_version.py dev-suffix or chapter/patch/season で 自動同期 可能"
        )
        return 1
    return 0


def check_location_images_exist():
    """ルール7-29 (BLOCKER 2026-05-06): script.js の LOCATION_CONFIG / STORY_LOCATION_INLINE_CONFIG で
    指定された画像 path が repo 上に実在するか 検査。
    背景: 章公開直前に「場所画像が反映されていない」 で気づくのは 手遅れ。 commit 時に検証して
    img path 設定漏れ・タイポ・取込忘れ を 防御 (野沢さん指示 2026-05-06)。
    `/images/...` 形式の path を repo root からの相対 file path に変換して 存在確認。
    """
    script_path = ROOT / "script.js"
    if not script_path.exists():
        return 0
    text = script_path.read_text(encoding="utf-8")
    # LOCATION_CONFIG / STORY_LOCATION_INLINE_CONFIG ブロックを抽出
    # シンプルな正規表現で img: '/images/...' の path を全部 列挙
    block_match = re.search(
        r"const\s+LOCATION_CONFIG\s*=\s*\{[\s\S]*?\n\};",
        text,
    )
    inline_match = re.search(
        r"const\s+STORY_LOCATION_INLINE_CONFIG\s*=\s*\{[\s\S]*?\n\};",
        text,
    )
    blocks = []
    if block_match:
        blocks.append(("LOCATION_CONFIG", block_match.group(0)))
    if inline_match:
        blocks.append(("STORY_LOCATION_INLINE_CONFIG", inline_match.group(0)))
    found_violations = 0
    for label, block in blocks:
        for m in re.finditer(r"img:\s*'(/images/[^']+)'", block):
            url = m.group(1)
            # /images/... → ROOT/images/...
            rel_path = url.lstrip("/")
            full_path = ROOT / rel_path
            if not full_path.exists():
                violations.append(
                    f"[ルール7-29 場所画像 不在 BLOCKER] {label} の img='{url}' が 実在しない。\n"
                    f"      → 期待 path: {rel_path}\n"
                    f"      → 章公開直前で「場所画像が反映されない」 事故対策。 取込忘れ / タイポ を 検出。\n"
                    f"      → 該当 PNG/WebP を 配置するか、 LOCATION_CONFIG entry を 修正する。"
                )
                found_violations += 1
    return found_violations


def check_inline_location_markers():
    """ルール7-32 (BLOCKER 2026-05-06): script.js STORY_LOCATION_INLINE_CONFIG['s1cN'] の各 entry の
    marker が STORY/s1cN.md 内に 1回以上 hit するか検証。
    背景: ID-based マークアップ {{char:slug}}名前{{/char}} で 本文を更新した時、
    marker 文字列に同じ名前が含まれていると 機械的にマッチ失敗 → 挿絵が 該当シーンに表示されず
    末尾に追いやられる事故 (s1c5 2-2 で 3回目の同じパターン、 野沢さん指摘 2026-05-06)。
    """
    script_path = ROOT / "script.js"
    if not script_path.exists():
        return 0
    text = script_path.read_text(encoding="utf-8")
    # STORY_LOCATION_INLINE_CONFIG ブロック
    block = re.search(r"const STORY_LOCATION_INLINE_CONFIG\s*=\s*\{[\s\S]*?\n\};", text)
    if not block:
        return 0
    entries = re.findall(
        r"'(s1c\d+)':\s*\[([\s\S]*?)\],\s*\n",
        block.group(0),
    )
    miss = []
    scene_mismatch = []  # marker は本文にあるが、 指定シーンの境界外にあるケース (2026-05-07 追加)
    for sid, body in entries:
        story_path = ROOT / "content" / "story" / f"{sid}.md"
        if not story_path.exists():
            continue
        story_text = story_path.read_text(encoding="utf-8")
        for m in re.finditer(r"scene:\s*'([^']+)',\s*marker:\s*'([^']+)'", body):
            scene_label, marker = m.group(1), m.group(2)
            if marker not in story_text:
                miss.append((sid, scene_label, marker[:40]))
                continue
            # シーン境界内かチェック (h2 プロローグ/エピローグ + h3 N-K + h3 任意 タイトル を許容)
            scene_start = scene_end = None
            esc = re.escape(scene_label)
            # h3 ### scene_label 形式 (例: 1-1, プリズマの黄昏)
            h3_m = re.search(r'^### ' + esc + r'[: \n]', story_text, re.MULTILINE)
            if h3_m:
                scene_start = h3_m.end()
            else:
                # h2 ## scene_label 形式 (例: プロローグ, エピローグ — ...)
                h2_m = re.search(r'^## ' + esc, story_text, re.MULTILINE)
                if h2_m:
                    scene_start = h2_m.end()
            if scene_start is None:
                continue  # シーンヘッダ未検出はスキップ (regex 限界、 marker 存在チェックは pass)
            # 次のシーンヘッダ位置 (h2 or h3 で次の境界)
            next_m = re.search(r'^##+ ', story_text[scene_start:], re.MULTILINE)
            scene_end = scene_start + next_m.start() if next_m else len(story_text)
            marker_pos = story_text.find(marker)
            if not (scene_start <= marker_pos < scene_end):
                scene_mismatch.append((sid, scene_label, marker[:40]))
    if miss:
        sample = "; ".join(f"{s}/{sc} '{mk}…'" for s, sc, mk in miss[:3])
        more = f" 他 {len(miss)-3}件" if len(miss) > 3 else ""
        violations.append(
            f"[ルール7-32 inline location marker 不一致 BLOCKER] {len(miss)}件 marker が 本文 不在: {sample}{more}\n"
            f"      → STORY_LOCATION_INLINE_CONFIG の marker は STORY/s1cN.md 内に 1回以上 含まれる必要\n"
            f"      → ID-based マークアップ {{{{char:slug}}}}名前{{{{/char}}}} 適用時に marker が 機械的に\n"
            f"        マッチ失敗 → 挿絵が 末尾配置されてしまう事故対策 (野沢さん 繰返叱責 2026-05-06)\n"
            f"      → 解決: marker を ID-based マークアップを 含まない unique 文字列 (例: 「俺のメイスが」) に変更"
        )
    if scene_mismatch:
        sample = "; ".join(f"{s}/{sc} '{mk}…'" for s, sc, mk in scene_mismatch[:3])
        more = f" 他 {len(scene_mismatch)-3}件" if len(scene_mismatch) > 3 else ""
        violations.append(
            f"[ルール7-32b 挿絵シーン外配置 BLOCKER] {len(scene_mismatch)}件 marker が 指定シーン境界外: {sample}{more}\n"
            f"      → 挿絵が 期待シーン内に表示されず、 本文修正で marker フレーズが 別シーンに出現した可能性\n"
            f"      → 解決: scene を marker の実際の出現シーンに変更、 もしくは marker を 期待シーン内のフレーズに変更"
        )
    return len(miss) + len(scene_mismatch)


def check_char_desc_meta_words():
    """ルール7-31 (BLOCKER 2026-05-06): POOL の キャラ desc / title / caption に メタ表現 を 入れない。
    s1c5 公開直前で 7キャラに「再登場予定 / S1C7 / S2C1 / 伏線 / 章テーマ視覚化」 等 メタ表現が
    残っていた事故対策。 ユーザーには「現在 の物語的役割」 だけを見せ、 将来章のネタバレは隠す。
    """
    script_path = ROOT / "script.js"
    if not script_path.exists():
        return 0
    text = script_path.read_text(encoding="utf-8")
    # POOL 各 entry の name + title + caption + desc を抽出
    pattern = re.compile(
        r'name:\s*"([^"]+)"\s*,\s*season:\s*\d+\s*,\s*chapter:\s*\'[^\']+\'\s*,\s*\n'
        r'\s*title:\s*"([^"]*)"\s*,\s*\n'
        r'\s*caption:\s*"([^"]*)"\s*,\s*\n'
        r'\s*desc:\s*"([^"]*)"',
        re.DOTALL,
    )
    # メタワード (将来章/伏線/開発者視点 等)
    META_WORDS = [
        "再登場予定", "再登場します", "への伏線", "の伏線。", "の伏線、",
        "S1C7", "S1C6", "S2C1", "S2C2", "S2C3", "S2C4", "S2C5", "S2C6", "S2C7",
        "S3C", "Season 2", "Season 3",
        "章テーマ", "山場 ", "物語上重要",
    ]
    found_chars = []
    for m in pattern.finditer(text):
        name, title, cap, desc = m.group(1), m.group(2), m.group(3), m.group(4)
        full = title + " " + cap + " " + desc
        hits = [w for w in META_WORDS if w in full]
        if hits:
            found_chars.append((name, hits, desc[:80]))
    if found_chars:
        sample = "; ".join(f"「{n}」 ({', '.join(h)})" for n, h, _ in found_chars[:3])
        more = f" 他 {len(found_chars) - 3}件" if len(found_chars) > 3 else ""
        violations.append(
            f"[ルール7-31 キャラ desc メタ表現 BLOCKER] {len(found_chars)}キャラの desc/title/caption に メタ表現: {sample}{more}\n"
            f"      → 将来章 (S2C1 等) / 「再登場予定」 / 「伏線」 / 「章テーマ視覚化」 等 開発者視点の言葉を 削除\n"
            f"      → ユーザーには「現在 の物語的役割」 だけを見せる、 ネタバレ防止 (野沢さん指摘 2026-05-06)"
        )
        return len(found_chars)
    return 0


def check_relations_coverage():
    """ルール7-30 (BLOCKER 2026-05-06): POOL 全キャラが RELATIONS に 1つ以上含まれる必須。
    s1c5 公開直前で 4キャラ (オルフェ/工房娘/歌姫/刺客) が 相関なしの状態で 発見 → 相関図に
    孤立点として 表示される事故。 新キャラ追加時に必ず relation を 1+ 設定する仕組みで防御。
    """
    script_path = ROOT / "script.js"
    if not script_path.exists():
        return 0
    text = script_path.read_text(encoding="utf-8")
    pool_names = set()
    for m in re.finditer(r'name:\s*"([^"]+)"\s*,\s*season:\s*\d+\s*,\s*chapter:', text):
        pool_names.add(m.group(1))
    rel_match = re.search(r"const RELATIONS\s*=\s*\[([\s\S]*?)\n\];", text)
    rel_chars = set()
    if rel_match:
        for m in re.finditer(r"a:\s*'([^']+)'\s*,\s*b:\s*'([^']+)'", rel_match.group(1)):
            rel_chars.add(m.group(1))
            rel_chars.add(m.group(2))
    missing = sorted(n for n in pool_names if n not in rel_chars)
    if missing:
        sample = ', '.join(f"「{n}」" for n in missing[:5])
        more = f" 他 {len(missing) - 5}件" if len(missing) > 5 else ""
        violations.append(
            f"[ルール7-30 相関漏れ BLOCKER] POOL {len(missing)}キャラが RELATIONS に未登場: {sample}{more}\n"
            f"      → script.js RELATIONS に それぞれ 1つ以上の relation を 追加 必須\n"
            f"      → 相関図で 孤立点として 表示される事故対策 (野沢さん指摘 2026-05-06、 s1c5 で 4キャラ漏れ発覚)"
        )
        return 1
    return 0


def check_main_version_bumped():
    """ルール7-24 (BLOCKER 2026-05-04): main branch で commit する時、 version は HEAD (= 親 commit) より bump 必須。
    2026-05-03 朝のセッションで v1.4.1 を 7 回 main merge した事故の再発防止。

    2026-05-06 拡張: scheduledRelease モード対応。 data.version は 旧 維持で
    data.scheduledRelease.version が 新 ver (12:00 自動切替)。 比較対象を 切替:
    - scheduledRelease あり: scheduledRelease.version で 親 と 比較
    - scheduledRelease なし: data.version で 親 と 比較 (従来挙動)

    詳細: CLAUDE.md feedback_prismaera_version_suffix.md
    """
    if _current_branch() != "main":
        return 0
    ver_path = ROOT / "version.json"
    if not ver_path.exists():
        return 0
    try:
        cur_data = json.load(ver_path.open(encoding="utf-8"))
        cur_ver = cur_data.get("version", "")
        cur_scheduled = (cur_data.get("scheduledRelease") or {}).get("version")
    except Exception:
        return 0
    # 親 commit の version.json を 取得
    try:
        head_text = subprocess.check_output(
            ["git", "show", "HEAD:version.json"], stderr=subprocess.DEVNULL, cwd=str(ROOT)
        ).decode("utf-8")
        parent_data = json.loads(head_text)
        parent_ver = parent_data.get("version", "")
        parent_scheduled = (parent_data.get("scheduledRelease") or {}).get("version")
    except Exception:
        return 0
    # scheduledRelease モード: scheduledRelease.version で 比較
    if cur_scheduled:
        if cur_scheduled == parent_scheduled:
            violations.append(
                f"[ルール7-24 scheduledRelease.version 未 bump BLOCKER] main で commit する scheduledRelease.version='{cur_scheduled}' が前 commit と同一。\n"
                f"      → 同じ scheduledRelease.version で main commit 連発は ルール違反\n"
                f"      → 詳細: CLAUDE.md feedback_prismaera_version_suffix.md"
            )
        return 1
    # 通常 mode: data.version で 比較 (parent 側 scheduledRelease 解除直後の場合 = 即時 release)
    if cur_ver == parent_ver:
        violations.append(
            f"[ルール7-24 main version 未 bump BLOCKER] main で commit する version='{cur_ver}' が前 commit と同一。\n"
            f"      → main release 時は必ず X.Y.Z を 1 段以上 bump (例: 1.4.2 → 1.4.3)\n"
            f"      → 同じ X.Y.Z で main merge 連発はルール違反 (2026-05-03 v1.4.1 7回事故 再発防止)\n"
            f"      → 詳細: CLAUDE.md feedback_prismaera_version_suffix.md"
        )
    return 1

# ====== deploy scope: cache buster + version + Box sync ======
if scope_match('deploy'):
    n7_23 = check_dev_version_suffix()
    print(f"  ルール7-23 (dev version suffix bump): {n7_23}件 検査 [BLOCKER]")
    n7_24 = check_main_version_bumped()
    print(f"  ルール7-24 (main version bump 必須): {n7_24}件 検査 [BLOCKER]")
    n7_25 = check_dev_suffix_progression()
    print(f"  ルール7-25 (dev suffix 1段階 increment): {n7_25}件 検査 [BLOCKER]")
    n7_26 = check_cache_buster_format()
    print(f"  ルール7-26 (cache buster = version 完全同期): {n7_26}件 検査 [BLOCKER]")
    n7_28 = check_img_cache_version_sync()
    print(f"  ルール7-28 (IMG_CACHE_VERSION = version 完全同期): {n7_28}件 検査 [BLOCKER]")
n7_29 = check_location_images_exist()
print(f"  ルール7-29 (LOCATION_CONFIG 画像 実在): {n7_29}件 検査 [BLOCKER]")
n7_30 = check_relations_coverage()
print(f"  ルール7-30 (POOL 全キャラ RELATIONS 登録): {n7_30}件 検査 [BLOCKER]")
n7_31 = check_char_desc_meta_words()
print(f"  ルール7-31 (キャラ desc メタ表現禁止): {n7_31}件 検査 [BLOCKER]")
n7_32 = check_inline_location_markers()
print(f"  ルール7-32 (inline location marker 実在): {n7_32}件 検査 [BLOCKER]")


def check_combo_pair_uniqueness():
    """ルール7-33 (BLOCKER 2026-05-06): cardgame/combos.json で 同一キャラ集合 が 2件以上 登録 禁止。
    2026-05-06 v1.4.4ai セッションで 銀霜の歌姫+工房娘 / オルフェ+ルナリア / セラフィエル+カグヤ+プリズマ で
    重複コンボが残存し、 野沢さん指摘 「2種類のコンボ被ってる、 これだとこの2体で強すぎない?」。
    再発防止のため 機械チェック化。
    """
    combos_path = ROOT / "cardgame" / "combos.json"
    if not combos_path.exists():
        return 0
    try:
        combos = json.loads(combos_path.read_text(encoding="utf-8"))
    except Exception as e:
        violations.append(f"[ルール7-33 combos.json 読込失敗 BLOCKER] {e}")
        return 0
    from collections import defaultdict
    g = defaultdict(list)
    for c in combos:
        chars = tuple(sorted(c.get("chars", [])))
        if not chars:
            continue
        g[chars].append(c.get("id", "?"))
    dupes = {k: v for k, v in g.items() if len(v) >= 2}
    if dupes:
        sample_lines = []
        for chars, ids in list(dupes.items())[:3]:
            sample_lines.append(f"      ・{'+'.join(chars)} → {ids}")
        more = "" if len(dupes) <= 3 else f"\n      ... 他 {len(dupes)-3} ペア"
        violations.append(
            f"[ルール7-33 combos 重複ペア BLOCKER] 同一キャラ集合 で {len(dupes)} ペアが 2件以上:\n"
            + "\n".join(sample_lines) + more
            + "\n      → cardgame/combos.json から 重複id を削除 (1ペア 1コンボ)\n"
            + "      → 2026-05-06 銀霜歌姫+工房娘 等の事故 再発防止"
        )
    return len(combos)


def check_illustration_position_consistency():
    """ルール7-34 (WARNING 2026-05-06): 章別 prompt/locations_s1cN.md の同一シーン内 挿絵で
    同じキャラの LEFT/RIGHT が プロンプト間で 揺れていないか チェック。
    2026-05-06 17 (twin_palms_rainbow) で 12 (mask_separation_ritual) と 位置逆転 (シオン左右逆) が
    発覚し 野沢さん 「整合性チェック漏れるなら自動チェック入れなさい」 指摘。 再発防止。

    現状: 同じシーン (例 4-1) 内で 同じキャラ (例 シオン) が LEFT と RIGHT 両方で 検出されたら WARNING。
    検出は キャラ slug を simple text match (英語キャラ slug 名 or 既知 alias)、 完全自動は難しいため
    WARNING に留め、 開発者が 手動で 12 と 17 など 並び比較する 補助とする。
    """
    target_dir = ROOT / "content" / "prompt"
    if not target_dir.exists():
        return 0
    # キャラ slug → 識別 alias (英語表記、 LEFT/RIGHT 文章で頻出する語)
    KNOWN_ALIAS = {
        "Sion": "シオン",
        "Shi-Loen": "シ・ロエン",
        "Lanas": "ラナス",
        "Lumina": "ルミナ",
        "Aster": "アスター",
        "Seraphiel": "セラフィエル",
        "Kaguya": "カグヤ",
        "Nox": "ノクス",
        "Nokutoria": "ノクトリア",
        "Garvin": "ガルヴィン",
        "Galvin": "ガルヴィン",
        "Nova": "ノヴァ",
        "Lunalia": "ルナリア",
        "Riorael": "リオラエル",
    }
    checked = 0
    issues = 0
    for path in sorted(target_dir.glob("locations/s1c*.md")):
        text = path.read_text(encoding="utf-8")
        m = re.search(r'locations_(s1c\d+)\.md', path.name)
        if not m:
            continue
        sections = re.split(r'^# 【\d+】', text, flags=re.M)[1:]
        # scene_id -> { alias -> set(positions) } and -> { alias -> set(filenames) }
        from collections import defaultdict
        scene_pos = defaultdict(lambda: defaultdict(set))
        scene_files = defaultdict(lambda: defaultdict(set))
        for sec in sections:
            scene_m = re.search(r'\*\*対応シーン\*\*[:：]\s*([^\s,。、（(]+)', sec)
            if not scene_m:
                continue
            scene_id = scene_m.group(1).strip()
            # filename 取得 (section 冒頭の [filename].png)
            fn_m = re.search(r'([a-z0-9_]+\.png)', sec.split("\n", 1)[0])
            filename = fn_m.group(1) if fn_m else "?"
            prompt_m = re.search(r'```(.+?)```', sec, flags=re.S)
            if not prompt_m:
                continue
            prompt = prompt_m.group(1)
            # 「on the LEFT [...] <Alias> (SAME face as reference N」 のように
            # 主体配置を示す パターンのみ抽出 (相対参照「standing as Shi-Loen's mirror」 等の偽陽性 除外)
            for m2 in re.finditer(
                r'\bon the (LEFT|RIGHT)\b([^.]*?)\b([A-Z][a-z]+(?:[- ][A-Z][a-z]+)*)\s*\(SAME (?:face|body)',
                prompt):
                pos = m2.group(1)
                cand = m2.group(3)
                # cand を KNOWN_ALIAS で 正規化 (alias は文字どおり一致 or 大文字小文字許容)
                for alias in KNOWN_ALIAS:
                    if cand == alias or cand.lower() == alias.lower():
                        scene_pos[scene_id][alias].add(pos)
                        scene_files[scene_id][alias].add(filename)
                        break
            checked += 1
        # 同一シーン内で 同じ alias が LEFT と RIGHT 両方で検出されたら 違反
        for scene_id, alias_pos in scene_pos.items():
            for alias, positions in alias_pos.items():
                if "LEFT" in positions and "RIGHT" in positions:
                    files = sorted(scene_files[scene_id][alias])
                    warnings_only.append(
                        f"[ルール7-34 挿絵位置不整合 WARNING] {path.name} シーン {scene_id} の "
                        f"キャラ「{KNOWN_ALIAS[alias]} ({alias})」 が LEFT/RIGHT 両方で検出: {files}\n"
                        f"      → 同じシーン内で 同じキャラの 左右配置 が 揺れています、 再生成前に意図確認\n"
                        f"      → 2026-05-06 17 vs 12 シオン左右逆事故 再発防止"
                    )
                    issues += 1
    return checked


def check_illustration_setting_reference():
    """ルール7-35 (WARNING 2026-05-06): 章別 prompt/locations_s1cN.md で
    同じシーン番号 (例 1-1, 4-1) に「背景」 + 「挿絵」 が並存する場合、 挿絵プロンプトに
    背景画像 filename が 参照添付として 記載されているかチェック。
    2026-05-06 「8 を生成する時に 1 を 添付すべき」 「1-1 王宮の挿絵 14 と 背景 2 で
    建築が違って見える」 等の 整合性漏れ事故を 防ぐ。

    判定:
    - 各セクションから {filename, scene_id, 役割(背景/挿絵), prompt_body} を抽出
    - scene_id が一致して 背景 + 挿絵 が両方ある場合
    - 挿絵 prompt_body に 背景 filename が 含まれていなければ WARNING
    """
    target_dir = ROOT / "content" / "prompt"
    if not target_dir.exists():
        return 0
    checked = 0
    for path in sorted(target_dir.glob("locations/s1c*.md")):
        text = path.read_text(encoding="utf-8")
        sections = re.split(r'^# 【\d+】', text, flags=re.M)[1:]
        # 各セクション: {filename, scene_id, role, prompt_body}
        scene_data = []
        for sec in sections:
            head = sec.split("\n", 1)[0]
            fn_m = re.search(r'([a-z0-9_]+\.png)', head)
            if not fn_m:
                continue
            filename = fn_m.group(1)
            scene_m = re.search(r'\*\*対応シーン\*\*[:：]\s*([^\s,。、(（]+)', sec)
            if not scene_m:
                continue
            scene_id = scene_m.group(1).strip()
            # 役割は 「役割」 セクションから または 冒頭の (背景|挿絵) から判定
            if re.search(r'\(挿絵', head) or '挿絵' in (sec.split('\n', 1)[0]):
                role = "挿絵"
            elif re.search(r'\(背景', head) or '挿絵風背景' in head or '背景' in head.split('—',1)[-1][:30]:
                role = "背景"
            else:
                role = "?"
            prompt_m = re.search(r'```(.+?)```', sec, flags=re.S)
            prompt_body = prompt_m.group(1) if prompt_m else ""
            scene_data.append({
                "filename": filename,
                "scene_id": scene_id,
                "role": role,
                "prompt": prompt_body,
            })
            checked += 1
        # scene_id でグループ化
        from collections import defaultdict
        by_scene = defaultdict(list)
        for d in scene_data:
            by_scene[d["scene_id"]].append(d)
        for scene_id, items in by_scene.items():
            bg_items = [i for i in items if i["role"] == "背景"]
            ill_items = [i for i in items if i["role"] == "挿絵"]
            if not bg_items or not ill_items:
                continue
            for ill in ill_items:
                missing_bg = []
                for bg in bg_items:
                    # 挿絵 prompt + section 全体に 背景 filename が記載されているか check
                    # (Attached リストや 「⚠️ 添付」 セクションは prompt 外なので、 セクション全体を検索)
                    full_section = next(
                        (s for s in sections if bg["filename"] not in s and ill["filename"] in s.split("\n", 1)[0]),
                        None
                    )
                    # 簡易: filename が ill prompt 全文 もしくは ill section 全体 に含まれるか
                    # ill section を再取得
                    ill_section = next((s for s in sections if ill["filename"] in s.split("\n", 1)[0]), "")
                    if bg["filename"] not in ill_section:
                        missing_bg.append(bg["filename"])
                if missing_bg:
                    warnings_only.append(
                        f"[ルール7-35 同一シーン背景未参照 WARNING] {path.name} シーン {scene_id} の "
                        f"挿絵「{ill['filename']}」 に 同シーン背景「{', '.join(missing_bg)}」 への参照添付指示なし\n"
                        f"      → 挿絵プロンプトに「先行画像 添付」 として 背景 filename を 明記\n"
                        f"      → 2026-05-06 1番/8番レイアウト不整合 + 14番/2番建築不整合 等の事故 再発防止"
                    )
    return checked


def check_prompt_body_meta_pollution():
    """ルール7-36 (BLOCKER 2026-05-06): prompt/locations_*.md / prompt/s1c*_chars.md の
    ``` ... ``` 本体 (= ChatGPT/DALL-E に コピペで送るプロンプト本体) に Claude 内部メモ
    (野沢さん指摘 / 内部キー / コード参照 等) が 混入していないか チェック。

    2026-05-06 17 (twin_palms_rainbow) のプロンプト本体内に 「**位置整合**: ... (野沢さん指摘
    2026-05-06)」 メモを入れて 野沢さん 「コピーする予定の部分にメモ入れんなよ、 ナメてんのか」
    叱責。 再発防止。

    NG ワード: 野沢 / Claude 内部 / 位置整合メモ / 伏線視覚化 / 本文行 / コード参照 /
              STORY/s1c / LOCATION_CONFIG / STORY_LOCATION_INLINE_CONFIG / CHAR_FACTION
    """
    target_dirs = [ROOT / "prompt"]
    NG = ['野沢', 'Claude 内部', 'Claude内部', '位置整合メモ', '伏線視覚化',
          '本文行', 'コード参照', 'STORY/s1c', 'LOCATION_CONFIG',
          'STORY_LOCATION_INLINE_CONFIG', 'CHAR_FACTION']
    checked = 0
    for tdir in target_dirs:
        if not tdir.exists():
            continue
        for path in sorted(list(tdir.glob("locations/*.md")) + list(tdir.glob("characters/s1c*.md"))):
            text = path.read_text(encoding="utf-8")
            # 厳密に行頭 ``` を fence と認識
            for m in re.finditer(r'(?m)^```\s*\n(.*?)\n^```\s*$', text, flags=re.S):
                body = m.group(1)
                checked += 1
                hits = [w for w in NG if w in body]
                if hits:
                    pre = text[:m.start()]
                    hm = list(re.finditer(r'^#+ [^\n]+', pre, flags=re.M))
                    header = hm[-1].group(0)[:60] if hm else "?"
                    sample_line = next((ln.strip() for ln in body.split('\n')
                                       if any(w in ln for w in hits)), '')[:120]
                    violations.append(
                        f"[ルール7-36 プロンプト本体メタ汚染 BLOCKER] {path.name} :: {header}\n"
                        f"      → 検出ワード: {hits}\n"
                        f"      → 該当行: {sample_line}\n"
                        f"      → ``` ... ``` 内は ChatGPT/DALL-E に そのまま送る本体、 内部メモは ``` の外 (markdown 普通の本文) に書く\n"
                        f"      → 2026-05-06 17 twin_palms 「**位置整合**: ... (野沢さん指摘)」 混入事故 再発防止"
                    )
    return checked


def check_pool_length_leak():
    """ルール7-37 (WARNING 2026-05-06): script.js 内で POOL.{Tier}.length / POOL[X].length が
    _isChapterReleased でフィルタせずに 直接使われている箇所を検出。 公開前章キャラが
    分母に含まれて 隠れキャラ数が ユーザーに 推測される リーク防止。

    2026-05-06 アカウント情報の urMax/lrMax 分母に s1c5 UR3体 が含まれていた
    リーク事故 (野沢さん指摘) の 再発防止。
    """
    target = ROOT / "script.js"
    if not target.exists():
        return 0
    text = target.read_text(encoding="utf-8")
    pat = re.compile(r'POOL(?:\.\w+|\[["\']\w+["\']\])\.length')
    issues = 0
    for i, line in enumerate(text.split("\n"), 1):
        if pat.search(line):
            # 同一行に filter / _isChapterReleased / _released が 含まれていれば OK
            if any(k in line for k in ['filter(', '_isChapterReleased', '_released', '// CHAPTER_FILTER_OK']):
                continue
            warnings_only.append(
                f"[ルール7-37 POOL length 直接 WARNING] script.js:{i} `{line.strip()[:120]}`\n"
                f"      → 公開前章キャラが 分母に含まれ ユーザーに 隠れキャラ数を 推測される リスク\n"
                f"      → POOL.X.filter(c => !c.chapter || _isChapterReleased(c.chapter)).length を使う\n"
                f"      → 意図的なら 行末に `// CHAPTER_FILTER_OK` コメントで 抑制可"
            )
            issues += 1
    return issues


n7_33 = check_combo_pair_uniqueness()
print(f"  ルール7-33 (combos 重複ペア 禁止): {n7_33}件 検査 [BLOCKER]")
n7_36 = check_prompt_body_meta_pollution()
print(f"  ルール7-36 (プロンプト本体 内部メモ汚染禁止): {n7_36}件 検査 [BLOCKER]")
n7_34 = check_illustration_position_consistency()
print(f"  ルール7-34 (挿絵 同一シーン内 LEFT/RIGHT 整合): {n7_34}件 検査 [WARNING]")
n7_35 = check_illustration_setting_reference()
print(f"  ルール7-35 (同一シーン 背景→挿絵 参照添付): {n7_35}件 検査 [WARNING]")
if scope_match('deploy'):
    n7_37 = check_pool_length_leak()
    print(f"  ルール7-37 (POOL length 公開前章リーク): {n7_37}件 検出 [WARNING]")


def check_home_teaser_next2_date_hidden():
    """ルール7-38 (BLOCKER 2026-05-06): ホーム画面ティザー (`_renderHomeNextTeaser`) で 翌翌章 (next2) の
    releaseDate を 日時公表しない 必須。
    過去事故: 2026-05-03 指示で `_refreshChapterReleaseLocks` に反映されたが ホーム側で漏れ、
    v1.5.0 release 直前に 第6章の公開予定日時 (2026-05-10 12:00) が 表示されてしまった。
    """
    target = ROOT / "script.js"
    if not target.exists():
        return 0
    text = target.read_text(encoding="utf-8")
    m = re.search(r'function\s+_renderHomeNextTeaser\s*\([^)]*\)\s*\{', text)
    if not m:
        return 0
    start = m.end()
    end = text.find("\nfunction ", start)
    if end < 0:
        end = start + 4000
    body = text[start:end]
    m2 = re.search(r'colHTML\s*\(\s*next2\s*,\s*(\w+)\s*\)', body)
    if not m2:
        if re.search(r'colHTML\s*\(\s*next2\s*\)', body):
            violations.append(
                f"[ルール7-38 ホームティザー翌翌章日時公表 BLOCKER] _renderHomeNextTeaser で\n"
                f"      colHTML(next2) 引数なし呼出 = 翌翌章の日時を 公表してしまう。\n"
                f"      → colHTML(next2, false) に 修正必須\n"
                f"      → 野沢さん指示 2026-05-03 + 2026-05-06 再指摘"
            )
        return 1
    if m2.group(1) != "false":
        violations.append(
            f"[ルール7-38 ホームティザー翌翌章日時公表 BLOCKER] _renderHomeNextTeaser で\n"
            f"      colHTML(next2, {m2.group(1)}) = 翌翌章の日時公表。\n"
            f"      → colHTML(next2, false) に 修正必須"
        )
    return 1


n7_38 = check_home_teaser_next2_date_hidden()
print(f"  ルール7-38 (ホームティザー翌翌章日時非公表): {n7_38}件 検査 [BLOCKER]")


def check_pool_img_slug_duplicates():
    """ルール7-41 (BLOCKER 2026-05-06): script.js POOL の img filename (slug) が
    全キャラで重複しないこと。 重複すると 既存画像を 上書き してしまう物理事故 (野沢さん指示
    2026-05-06「すでに生成済みで格納しようとして気づいた」 moon_priest 衝突未遂事故対策)。
    """
    script_path = ROOT / "script.js"
    if not script_path.exists():
        return 0
    text = script_path.read_text(encoding="utf-8")
    # img: `${S1}/{tier}/{name}.png` パターン抽出
    imgs = re.findall(r'S1\}/(\w+)/(\w+)\.png', text)
    seen = {}
    for tier, name in imgs:
        key = f'{tier}/{name}.png'
        seen.setdefault(key, []).append(tier)
    dups = {k: v for k, v in seen.items() if len(v) > 1}
    if not dups:
        return 0
    for key, tiers in dups.items():
        violations.append(
            f"[ルール7-41 POOL img slug 重複 BLOCKER] script.js で {key} が {len(tiers)} 件重複\n"
            f"      → 同一 img path を異なるキャラで参照 = 既存画像を上書きする物理事故\n"
            f"      → 章追加時 / 新キャラ追加時に slug を必ず別名にする (例: moon_priest → moon_reader)\n"
            f"      → 詳細: 2026-05-06 s1c5 月夜祭司アスター + s1c6 月読み祭司オリオン の moon_priest.png 衝突事故"
        )
    return len(dups)


n7_41 = check_pool_img_slug_duplicates()
print(f"  ルール7-41 (POOL img slug 重複): {n7_41}件 検査 [BLOCKER]")


def check_bgm_tempo_uptempo():
    """ルール7-42 (WARNING 2026-05-06 野沢さん指示「BGM テンポの話も自動チェックに入れて」):
    BGM プロンプト (content/prompt/bgm/*.md) の BPM が 推奨範囲外なら WARNING。
    - 派閥 BGM (faction_*.md): BPM 110 以上 推奨 (野沢さん 2026-05-06「派閥 BGM もなるべく速めが望ましい」)
    - 章 BGM (chapter_*.md): BPM 100 以上 推奨 (世界観必然なら例外、 序章 60 BPM 等は OK)
    - 戦闘 BGM (rift.md 等): BPM 130 以上 推奨

    例外検出 (warningスキップ): プロンプト本文に世界観必然キーワード
    (processional / underwater / contemplative / minimalist piano reverie / rubato 等) があれば OK 扱い。

    BPM 抽出: プロンプト本文の `BPM (\d+)` または `(\d+)\s*BPM` パターンで取得。 範囲記載 (150-160) なら 下限値で判定。
    """
    bgm_dir = ROOT / 'content' / 'prompt' / 'bgm'
    if not bgm_dir.exists():
        return 0
    EXCEPT_KEYWORDS = [
        'processional', 'underwater', 'contemplative', 'minimalist piano reverie',
        'rubato', 'meditative', 'ambient drone',
    ]
    found = 0
    for path in sorted(bgm_dir.glob('*.md')):
        text = path.read_text(encoding='utf-8')
        # 明示的な OK マーカー (`BGM_TEMPO_OK`) があればスキップ
        # 野沢さん指示 2026-05-06「既存 BGM のテンポ遅い問題は『そういうもの』 として OK」
        # → 既存負債 (s1c2 BPM 92 / s1c3 v1 BPM 78 等) を ファイル単位で 例外宣言
        if 'BGM_TEMPO_OK' in text:
            continue
        # BPM 抽出: Suno AI プロンプトコードブロック (``` ``` で囲まれた最初の block) があればそこを優先
        # (本文の比較記述「派閥 BGM (BPM 60-130) より速め」 等を除外するため)
        prompt_block_match = re.search(r'```[^\n]*\n(.+?)\n```', text, flags=re.DOTALL)
        scan_text = prompt_block_match.group(1) if prompt_block_match else text
        # 候補を全部集めて 最大値 = 楽曲 BPM とみなす (比較記述の小さい値を避ける)
        candidates = []
        for m in re.finditer(r'(\d{2,3})\s*-\s*(\d{2,3})\s*[bB][pP][mM]', scan_text):
            candidates.append((int(m.group(2)), m))  # X-Y BPM 範囲は上限値
        for m in re.finditer(r'BPM\s+(\d{2,3})\s*-\s*\d{2,3}', scan_text):
            candidates.append((int(m.group(1)), m))  # BPM X-Y は X (下限値)
        for m in re.finditer(r'BPM\s+(\d{2,3})\b', scan_text):
            candidates.append((int(m.group(1)), m))
        for m in re.finditer(r'(\d{2,3})\s*[bB][pP][mM]\b', scan_text):
            candidates.append((int(m.group(1)), m))
        if not candidates:
            continue
        bpm, m_used = max(candidates, key=lambda x: x[0])
        fname = path.name
        if fname.startswith('faction_'):
            recommended = 110
            kind = '派閥'
        elif fname.startswith('chapter_'):
            recommended = 100
            kind = '章'
        elif fname == 'rift.md':
            recommended = 130
            kind = '戦闘'
        else:
            continue
        if bpm >= recommended:
            continue
        # 例外キーワード検出 (BPM 値出現位置の周辺 ±200 文字に限定、 別文脈で出る単語の誤 hit 回避)
        e_start = max(0, m_used.start() - 200)
        e_end = min(len(scan_text), m_used.end() + 200)
        local_text = scan_text[e_start:e_end].lower()
        if any(kw in local_text for kw in EXCEPT_KEYWORDS):
            continue
        warnings_only.append(
            f"[ルール7-42 BGM テンポ低速 WARNING] {fname} BPM={bpm} ({kind} BGM 推奨 {recommended}+)\n"
            f"      → 野沢さん指示 2026-05-06「派閥 BGM もなるべく速めのテンポが望ましい」\n"
            f"      → 世界観必然なら 本文に processional / underwater / contemplative 等を明記、 そうでなければ BPM 引上げ検討\n"
            f"      → 詳細: memory feedback_bgm_uptempo.md"
        )
        found += 1
    return found


n7_42 = check_bgm_tempo_uptempo()
print(f"  ルール7-42 (BGM テンポ低速): {n7_42}件 検査 [WARNING]")


def check_chapter_combos_coverage():
    """ルール7-43 (WARNING → 既存負債解消後 BLOCKER 化、 2026-05-06 野沢さん指示「P-7 はあなたの方でまわるようにして」):
    公開済の章 (POOL に chapter='s1cN' のキャラがある) で combos.json に該当章の combo が
    最低 1件 (duo or trio or faction synergy) あるか検査。

    既定の自動運用フロー (Claude 章公開時セルフ実行):
      1. 新章キャラ POOL 追加 → POOL.chapter='s1cN' のキャラが ≥1 名
      2. `py scripts/propose_combos_for_chapter.py --chapter s1cN --apply` を Claude が実行
      3. 結果 combos.json に s1cN の combo が ≥1 件 → 本ルールで OK
      4. 漏れたら本ルール WARNING で commit 前に Claude 自身が気づく → --apply 実行 → 解消

    野沢さんは手動実行しない方針 (2026-05-06)、 Claude が章公開時に必ず実行することで自動運用化。
    """
    text = (ROOT / "script.js").read_text(encoding='utf-8')
    # POOL から chapter 一覧を抽出
    chapters_in_pool: set[str] = set()
    for m in re.finditer(r"chapter:\s*'(s1c\d+)'", text):
        chapters_in_pool.add(m.group(1))
    if not chapters_in_pool:
        return 0
    # combos.json の chapter 一覧
    combos_path = ROOT / "cardgame" / "combos.json"
    if not combos_path.exists():
        return 0
    try:
        combos = json.loads(combos_path.read_text(encoding='utf-8'))
    except Exception:
        return 0
    chapters_in_combos: set[str] = set(c.get('chapter', '') for c in combos if c.get('chapter'))
    # POOL にあって combos に無い章を検出
    missing = sorted(chapters_in_pool - chapters_in_combos)
    found = 0
    for chap in missing:
        warnings_only.append(
            f"[ルール7-43 章 combo 欠落 WARNING] {chap}: POOL にキャラあり、 combos.json に該当章の combo なし\n"
            f"      → 自動運用: `py scripts/propose_combos_for_chapter.py --chapter {chap} --apply` を Claude が実行\n"
            f"      → 章公開チェックリスト ⑯ (野沢さん指示 2026-05-06「P-7 はあなたの方でまわるように」)"
        )
        found += 1
    return found


n7_43 = check_chapter_combos_coverage()
print(f"  ルール7-43 (章 combo 欠落): {n7_43}件 検査 [WARNING]")


def check_subject_predicate_break():
    """ルール7-44b (BLOCKER、 2026-05-07 野沢さん指摘 + 2026-05-07 強化):
    主述分断 (助詞 + 句点 + 修飾 直後) を検出。

    元の事故: 機械的文区切り化の副作用で 「私たち観測者三柱が。 千年に一度ずつ」 のように
    助詞直後に句点を打ち、 述語を後続文に追い出して主述が破綻するケース。

    強化 (2026-05-07): 助詞リストに「は」「から」「へ」「より」 を追加 (実例から発見、
    「指先から。私の六枚の翼が」 等のパターンを検出強化)。 引用符直後は文末扱いで除外。

    BLOCKER (commit abort) — 可読性に直接影響、 ID-based マークアップや機械削減の副作用で
    再発しやすいため 強い検出が必要。
    """
    story_dir = ROOT / 'content' / 'story'
    if not story_dir.exists():
        return 0
    # 主格/格助詞 (主述分断の主因)
    helpers = ['が', 'を', 'に', 'で', 'と', 'て', 'も']
    # 句点直後にスペースは禁止 (ルール7-47) なので 'X助詞。直後文字' を検出
    # 厳格化 (2026-05-07): 行内のみ検出、 改行・dash (──/—)・引用符 内は除外 (会話/独白の意図的破断は許容)
    found = 0
    for path in sorted(story_dir.glob('s1c*.md')):
        if path.stem == 's1c0' or 'outline' in path.stem:
            continue
        text = path.read_text(encoding='utf-8')
        broken = []
        # 行ごとに走査 + 引用符内除外
        for line_no, line in enumerate(text.split('\n'), start=1):
            # 「○○。」 で行が終わる場合は文末で OK (改行 = 段落区切り)
            # 鉤括弧内は会話文 = 意図的破断許容
            if line.startswith(('「', '『', '──', '—')):
                continue
            for h in helpers:
                # 行内で 'X助詞。' + 直後 1文字 (改行/dash/引用符以外)
                for m in re.finditer(re.escape(h) + r'。([^\s「」『』──—])', line):
                    idx = m.start()
                    if idx > 0 and line[idx-1] in '」』）)':
                        continue
                    # 直前が「これ」「だ」「では」「しなくて」 等の接続詞用法は除外
                    prev_ctx = line[max(0,idx-3):idx+1]
                    if prev_ctx[-2:] in ('これ', 'では', 'なのに', 'のに'):
                        continue
                    broken.append((h, line[max(0,idx-15):idx+15]))
        if broken:
            sample = '; '.join(f"「{ctx.strip()}」" for h, ctx in broken[:3])
            violations.append(
                f"[ルール7-44b 主述分断 BLOCKER] {path.name}: 助詞+句点 主述破綻 {len(broken)}件\n"
                f"      → サンプル: {sample}\n"
                f"      → 助詞「が/を/に/で/と/て/も/は/から/へ/より」 直後の句点は文体破綻、 読点に戻して 1文として閉じる"
            )
            found += 1
    return found


def check_kuten_density():
    """ルール7-44 (WARNING、 2026-05-07 野沢さん指示「文章全体にどれくらい読点が出てくるかのバランス」):
    章本文の読みやすさを 3 指標で複合検査。

    指標 (いずれか超過で WARNING):
      ① 読点密度 > 55/千字 (修正 2026-05-07: 60 → 55、 全章 45-52 範囲のためマージン 3)
      ② 1文の最大読点数 > 5 (野沢さん添削「カグヤは月影の杖を一度だけ軽く振った」 元 4読点が典型例)
      ③ 1文長 平均 > 30字 (s1c6 修正前 31字、 修正後 25字)

    既存章の読点密度 (2026-05-07 案B 削減後):
      s1c1=51.92 / s1c2=49.55 / s1c3=48.10 / s1c4=45.74 / s1c5=47.35 / s1c6=46.80

    検査対象: content/story/s1cN.md (s1c0 / outline 等は除外)
    本文行のみ (h2/h3 ヘッダ / blockquote / コメント / 区切り行 を除外)。
    """
    story_dir = ROOT / 'content' / 'story'
    if not story_dir.exists():
        return 0
    found = 0
    for path in sorted(story_dir.glob('s1c*.md')):
        if path.stem == 's1c0' or 'outline' in path.stem:
            continue
        text = path.read_text(encoding='utf-8')
        body_lines = [
            l for l in text.split('\n')
            if l.strip()
            and not l.startswith('#')
            and not l.startswith('>')
            and not l.startswith('---')
            and not l.startswith('[')
        ]
        body = '\n'.join(body_lines)
        chars = len(body)
        kuten = body.count('、')
        maru = body.count('。')
        if chars < 5000 or maru < 50:
            continue
        density = kuten / chars * 1000
        # 1文ごとの読点数と長さ
        sentences = [s for s in body.replace('\n', '。').split('。') if s.strip()]
        max_kuten_in_sentence = max(s.count('、') for s in sentences) if sentences else 0
        avg_sentence_len = chars / maru
        # 1文 5読点+ の文数
        n_5plus = sum(1 for s in sentences if s.count('、') >= 5)
        # 1文 4読点+ の文数 (情報用)
        n_4plus = sum(1 for s in sentences if s.count('、') >= 4)

        violations_local = []
        if density > 55:
            violations_local.append(f"読点密度 {density:.2f}/千字 > 55")
        if max_kuten_in_sentence > 5:
            violations_local.append(f"1文 最大読点 {max_kuten_in_sentence}個 > 5")
        if n_5plus >= 3:
            violations_local.append(f"5読点+ の文 {n_5plus}件 (≥3件で WARNING)")
        if avg_sentence_len > 30:
            violations_local.append(f"平均 1文長 {avg_sentence_len:.1f}字 > 30")

        if violations_local:
            warnings_only.append(
                f"[ルール7-44 読みやすさ WARNING] {path.name}: " + " / ".join(violations_local) + "\n"
                f"      → (参考) 4読点+ {n_4plus}件 / 5読点+ {n_5plus}件 / 平均 {avg_sentence_len:.1f}字\n"
                f"      → 削減手法: 主語助詞 + 読点 削除 / 主語頭で文区切り / 副詞 + 動詞間の読点削除\n"
                f"      → 詳細: memory feedback_kuten_density.md (野沢さん添削パターン A〜I)"
            )
            found += 1
    return found


n7_44b = check_subject_predicate_break()
print(f"  ルール7-44b (主述分断): {n7_44b}件 検査 [BLOCKER]")
n7_44 = check_kuten_density()
print(f"  ルール7-44 (読点密度高): {n7_44}件 検査 [WARNING]")


def check_bgm_category_segregation():
    """ルール7-45 (WARNING、 2026-05-07 野沢さん指示「BGM 棲み分け意識して、 自動チェックに入れといて」):
    BGM プロンプト ファイル名 prefix と BGM_LIST の category 整合性をチェック。

    棲み分け規約 (野沢さん指示 2026-05-07):
      - 章 BGM (chapter_*.md): その章のストーリー全体に合う BGM → category: 'chapter'
      - 派閥 BGM (faction_*.md): その派閥の特性を表現 (派閥全体を代表) → category: 'faction'
      - その他 (scene_*.md / rift.md / その他名): イベント/シーン特化 BGM → category: 'other'

    検査ロジック:
      - content/prompt/bgm/*.md を全件スキャン
      - prompt md 冒頭 (最初の 200 文字) から想定 category を抽出
        (「派閥 BGM」「章 BGM」「シーン特化」「その他」 等のキーワード判定)
      - prompt md の 「出力ファイル」 path から mp3 ファイル名を抽出
      - script.js BGM_LIST 内 該当 mp3 の category と比較
      - 不一致なら WARNING
    """
    bgm_dir = ROOT / 'content' / 'prompt' / 'bgm'
    if not bgm_dir.exists():
        return 0
    script_text = (ROOT / 'script.js').read_text(encoding='utf-8')
    # BGM_LIST から { mp3_name: category } を抽出
    bgm_entries = {}
    bgm_list_match = re.search(r'const BGM_LIST\s*=\s*\[', script_text)
    if bgm_list_match:
        start = bgm_list_match.end() - 1
        depth = 0
        for i in range(start, len(script_text)):
            if script_text[i] == '[':
                depth += 1
            elif script_text[i] == ']':
                depth -= 1
                if depth == 0:
                    body = script_text[start + 1:i]
                    break
        else:
            body = ''
        for entry_match in re.finditer(
            r"category:\s*'([^']+)'[^}]*?file:\s*'([^']+\.mp3)'", body, re.DOTALL
        ):
            cat = entry_match.group(1)
            mp3_name = entry_match.group(2).split('/')[-1]
            bgm_entries[mp3_name] = cat
        # file が先で category が後の順序にも対応
        for entry_match in re.finditer(
            r"file:\s*'([^']+\.mp3)'[^}]*?category:\s*'([^']+)'", body, re.DOTALL
        ):
            mp3_name = entry_match.group(1).split('/')[-1]
            cat = entry_match.group(2)
            if mp3_name not in bgm_entries:
                bgm_entries[mp3_name] = cat

    found = 0
    for path in sorted(bgm_dir.glob('*.md')):
        text = path.read_text(encoding='utf-8')
        head = text[:500]
        # ファイル名 prefix から想定 category を抽出
        fname = path.name
        if fname.startswith('chapter_'):
            expected = 'chapter'
        elif fname.startswith('faction_'):
            expected = 'faction'
        elif fname.startswith('scene_') or fname == 'rift.md':
            expected = 'other'
        else:
            # 未分類 (cardgame.md 等は対象外)
            continue
        # md 冒頭の宣言と整合性確認
        head_lower = head
        body_decl_ok = (
            (expected == 'chapter' and ('章BGM' in head_lower or '章 BGM' in head_lower or '章テーマ' in head_lower))
            or (expected == 'faction' and ('派閥BGM' in head_lower or '派閥 BGM' in head_lower or '派閥テーマ' in head_lower))
            or (expected == 'other' and ('シーン特化' in head_lower or 'その他' in head_lower or '戦闘テーマ' in head_lower))
        )
        if not body_decl_ok:
            warnings_only.append(
                f"[ルール7-45 BGM カテゴリ棲み分け WARNING] {fname}: ファイル名 prefix '{fname.split('_')[0] if '_' in fname else fname}' は category '{expected}' を示すが、 prompt md 冒頭に対応する宣言キーワードなし\n"
                f"      → chapter = 「章 BGM」 / faction = 「派閥 BGM」 / other = 「シーン特化」「その他」「戦闘テーマ」 のいずれかを 冒頭に明記"
            )
            found += 1
        # mp3 ファイル名を 引き継ぎ規約から抽出
        mp3_match = re.search(r'`media/audio/bgm/([^`]+\.mp3)`', text)
        if mp3_match:
            mp3_name = mp3_match.group(1)
            actual_cat = bgm_entries.get(mp3_name)
            if actual_cat and actual_cat != expected:
                warnings_only.append(
                    f"[ルール7-45 BGM カテゴリ棲み分け WARNING] {fname}: prompt md は category '{expected}' (ファイル名 prefix) を示すが、 BGM_LIST の {mp3_name} は category '{actual_cat}'\n"
                    f"      → 野沢さん指示 2026-05-07 棲み分け規約: 章=ストーリー全体 / 派閥=派閥特性 / その他=シーン特化\n"
                    f"      → BGM_LIST entry を category '{expected}' に修正、 もしくは prompt md ファイル名を 適切な prefix に rename"
                )
                found += 1
    return found


n7_45 = check_bgm_category_segregation()
print(f"  ルール7-45 (BGM カテゴリ棲み分け): {n7_45}件 検査 [WARNING]")


def check_bgm_style_3000_limit():
    """ルール7-46 (WARNING、 2026-05-07 野沢さん指示「Suno Style プロンプトは 3000 文字上限」):
    BGM プロンプト md 内の Style コードブロック (`### Suno AI プロンプト (Style)` 配下の
    ` ``` ` ブロック) が 3000 字を超えると WARNING、 2900 字超で予兆 WARNING。

    Suno AI 仕様: Style 欄は 3000 文字までしか受け付けない。 超過分は切り捨てられて生成品質低下。

    検査ロジック:
      - content/prompt/bgm/*.md を全件スキャン
      - 「### Suno AI プロンプト (Style)」 直後の 最初の `` ``` `` ブロックを抽出
      - 文字数が 2900 超で WARNING (上限到達まで余裕 100 字)、 3000 超で「上限超過」 強警告
    """
    bgm_dir = ROOT / 'content' / 'prompt' / 'bgm'
    if not bgm_dir.exists():
        return 0
    found = 0
    for path in sorted(bgm_dir.glob('*.md')):
        text = path.read_text(encoding='utf-8')
        # 「### Suno AI プロンプト (Style)」 配下の最初の ``` ブロック
        m = re.search(
            r'###\s*Suno AI プロンプト\s*\(Style\)\s*\n\s*```[^\n]*\n(.+?)\n```',
            text, re.DOTALL,
        )
        if not m:
            # ヘッダ無しの場合は最初の長いコードブロックを試す
            m2 = re.search(r'```[^\n]*\n(.{500,}?)\n```', text, re.DOTALL)
            if not m2:
                continue
            style = m2.group(1).strip()
        else:
            style = m.group(1).strip()
        n = len(style)
        if n > 3000:
            warnings_only.append(
                f"[ルール7-46 BGM Style 上限超過 WARNING] {path.name}: Style {n}文字 > 3000字 上限\n"
                f"      → Suno AI Style 欄は 3000 字までしか受け付けない。 超過分は切り捨てで生成品質低下\n"
                f"      → 冗長表現を整理 (重複修飾統合、 NOT X NOT Y を 1行に圧縮、 atmosphere 短縮等)"
            )
            found += 1
        elif n > 2900:
            warnings_only.append(
                f"[ルール7-46 BGM Style 上限近接 WARNING] {path.name}: Style {n}文字 (上限 3000 まで残 {3000-n}字)\n"
                f"      → 余裕 100 字以下、 追加修飾で上限超過リスク。 整理推奨"
            )
            found += 1
    return found


n7_46 = check_bgm_style_3000_limit()
print(f"  ルール7-46 (BGM Style 3000字上限): {n7_46}件 検査 [WARNING]")


def check_kuten_no_space():
    """ルール7-47 (BLOCKER、 2026-05-07 野沢さんスタイル統一):
    ストーリー本文内の 句読点直後 半角スペース禁止 (「、 」「。 」 → 「、」「。」)。

    野沢さんスタイル: 句読点直後にスペース無し (s1c1 元から実装、 s1c2-s1c6 は 2026-05-07 一括統一)。
    今後の本文編集で うっかりスペース有り版 (「、 」 等) が混入したら commit abort で再発防止。

    検査対象: content/story/s1cN.md のみ (script.js / prompt 等は別フォーマット許容)。
    """
    story_dir = ROOT / 'content' / 'story'
    if not story_dir.exists():
        return 0
    found = 0
    for path in sorted(story_dir.glob('s1c*.md')):
        if path.stem == 's1c0' or 'outline' in path.stem:
            continue
        text = path.read_text(encoding='utf-8')
        # 「、 」「。 」 (全角句読点 + 半角スペース) を検出
        kuten_space = text.count('、 ')
        maru_space = text.count('。 ')
        # markdown 引用符後 (例: 」 + スペース) や 文末改行手前は別パターンなので 単純な「、 」「。 」 のみ
        if kuten_space > 0 or maru_space > 0:
            samples = []
            for m in re.finditer(r'[、。] [^\s]', text):
                idx = m.start()
                samples.append(text[max(0,idx-10):idx+10])
                if len(samples) >= 3:
                    break
            sample_str = '; '.join(f'「{s}」' for s in samples)
            violations.append(
                f"[ルール7-47 句読点後スペース禁止 BLOCKER] {path.name}: 「、 」 {kuten_space}件 / 「。 」 {maru_space}件\n"
                f"      → サンプル: {sample_str}\n"
                f"      → 野沢さんスタイル: 句読点直後にスペース無し (2026-05-07 全章統一済)。 編集で再混入しないよう BLOCKER\n"
                f"      → 修正: `sed -i 's/、 /、/g; s/。 /。/g' content/story/s1c*.md` (本文限定)"
            )
            found += 1
    return found


n7_47 = check_kuten_no_space()
print(f"  ルール7-47 (句読点後スペース禁止): {n7_47}件 検査 [BLOCKER]")


def check_char_voice_caption_consistency():
    """ルール7-48 (WARNING、 2026-05-08 野沢さん指示「ノクスは古文調キャラじゃないのに古文調化していた」 事故対策):
    POOL の caption + desc が 標準語キャラ (古文調マーカーなし) なのに、 本文台詞で 古文調マーカー (じゃ/お主/おる/のう/ぬ。 等) を使っていたら WARNING。

    検出ロジック:
      1. POOL から各キャラの name + caption + desc を取得
      2. caption + desc に 「じゃ/お主/おる/のじゃろう/のう/わし/ござる/ぬ。」 が 一切なければ → 標準語キャラ判定
      3. 本文 (s1c*.md) で「<キャラ名>が/は ... ○○○○」 「<キャラ名>。 ○○○○」 等の 動作描写 直後の 鉤括弧 を キャラ台詞として抽出
      4. 標準語キャラの台詞に 古文調マーカー (じゃ/お主/おる/のう/わし/ござる) が 1個でも あれば WARNING

    過去事故:
      - 2026-05-08 ノクス (caption「貴方も、 この瞬間も」 = 標準語) を 古文調化 14件 修正 → revert で対応
    """
    script_path = ROOT / 'script.js'
    if not script_path.exists():
        return 0
    text = script_path.read_text(encoding='utf-8')

    # POOL から name + caption + desc を抽出
    chars_info = {}  # name -> (caption, desc)
    for ent in re.finditer(
        r'name:\s*"([^"]+)"\s*,[^}]*?caption:\s*"([^"]*)"[^}]*?desc:\s*"([^"]*)"',
        text
    ):
        name, caption, desc = ent.group(1), ent.group(2), ent.group(3)
        chars_info[name] = (caption, desc)

    # 標準語キャラ判定 (古文調マーカーなし)
    # 古文調の検出は **記号直前の文末形** に限定 (false positive 削減):
    #   「じゃない」 (標準語否定) と「じゃ。」「じゃろう」 (古文調) を区別
    #   「と思う」 (標準語) と「のう。」「のう、」 (古文調感嘆) を区別
    KOBUN_PATTERNS = [
        r'じゃ[。!?]',              # じゃ。 じゃ! じゃ? (文末のみ catch、 「じゃ、」 は「では、」 口語短縮で除外)
        r'じゃろう',                # じゃろう / じゃろうか
        r'のじゃ',                  # のじゃ単独 / のじゃろう
        r'のう[。!?]',              # のう。 のう! (文末)
        r'のう、[一-龯ァ-ヴ]',       # のう、 + 名詞 (千年姫的感嘆: 「のう、 プリズマ」)
        r'おる[。!?]',              # おる。 おる! (文末)
        r'おるな[。!?]',
        r'おらぬ',                  # おらぬ
        r'お主[はがを、 ]',
        r'わし[はがを、 ]',
        r'ござる',
        r'なされ[。、ま]',
    ]
    KOBUN_MARKER_RE = re.compile('|'.join(KOBUN_PATTERNS))
    std_chars = set()
    for name, (caption, desc) in chars_info.items():
        combined = caption + ' ' + desc
        if not KOBUN_MARKER_RE.search(combined):
            std_chars.add(name)

    # 本文から各キャラの台詞抽出 + 古文調マーカー検出
    story_dir = ROOT / 'content' / 'story'
    if not story_dir.exists():
        return 0

    violations_found = []
    for path in sorted(story_dir.glob('s1c*.md')):
        if path.stem == 's1c0' or 'outline' in path.stem:
            continue
        body = path.read_text(encoding='utf-8')
        lines = body.split('\n')
        # 鉤括弧台詞 ベースで 発話者判定:
        #   方式: 鉤括弧の **直後 1-3行内** に「<name>が/は」 等の動作描写があれば その name が発話者
        #   (鉤括弧の直前にある「<name>は既にいなかった」 等の 説明文を 発話者と誤判定するのを 防ぐ)
        for i, line in enumerate(lines):
            quote_match = re.match(r'^「([^」]+)」\s*$', line.strip())
            if not quote_match:
                continue
            quote = quote_match.group(1)
            # 古文調マーカー検出
            m = KOBUN_MARKER_RE.search(quote)
            if not m:
                continue
            # 発話者判定: 直後 1-3行内の キャラ名動作描写
            speaker = None
            for j in range(i+1, min(i+4, len(lines))):
                line_after = lines[j].strip()
                if not line_after:
                    continue
                if line_after.startswith('「'):
                    break  # 別の台詞、 発話者判定終了
                # キャラ名が 動作主体として 出現
                for name in chars_info.keys():
                    if re.search(rf'(^|\W){re.escape(name)}(が|は|の|を|に)', line_after):
                        speaker = name
                        break
                if speaker:
                    break
            # 発話者が標準語キャラなら 古文調混入 WARNING
            if speaker and speaker in std_chars:
                violations_found.append(
                    f"  [{path.name} L{i+1}] 標準語キャラ「{speaker}」 の台詞に 古文調マーカー「{m.group(0)}」: 「{quote[:40]}{'...' if len(quote)>40 else ''}」"
                )

    if violations_found:
        # 重複削除 + 最大10件表示
        unique_violations = list(dict.fromkeys(violations_found))[:10]
        warnings_only.append(
            f"[ルール7-48 キャラ語り口 caption整合 WARNING] 標準語キャラの台詞に 古文調マーカー混入 {len(violations_found)}件\n"
            + '\n'.join(unique_violations) +
            f"\n      → POOL の caption/desc が 標準語ベースのキャラに 古文調 (じゃ/おる/お主/のう/わし) は 不整合\n"
            f"      → memory feedback_char_voice_verify_caption_desc.md 参照、 caption verify せず一括修正は 禁止"
        )
    return len(chars_info)


n7_48 = check_char_voice_caption_consistency()
print(f"  ルール7-48 (キャラ語り口 caption整合): {n7_48}キャラ 検査 [WARNING]")


def check_age_consistency():
    """ルール7-49 (WARNING、 2026-05-08 野沢さん指示「数字整合は機械化必須」):
    POOL.desc の年齢表記 vs LORE 凸秘話の年齢表記が 一致するか。

    過去事故 (2026-05-08): s1c4 6キャラ (ヴァーレ/ガリオン/ハーニア/ゼピル/イズン/ベル) で
    POOL「26-27」 vs LORE「22歳」 等 数歳〜14歳のズレ → 修正14件。

    検出ロジック:
      1. POOL から各キャラ name + desc を抽出
      2. desc から年齢表記抽出 (「二十六-二十七」「二十二歳」「26歳」 等)
      3. LORE_BY_KEY 各キャラ凸秘話 body から年齢表記抽出
      4. 両者の年齢が 数値で 2歳以上ズレたら WARNING
    """
    script_path = ROOT / 'script.js'
    if not script_path.exists():
        return 0
    text = script_path.read_text(encoding='utf-8')

    # 漢数字 → アラビア数字 変換 (二十六 → 26)
    KANJI_DIGITS = {'〇':0,'零':0,'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9}
    def kanji_to_int(s):
        if not s: return None
        s = s.replace('十', 'X')
        # 「二X六」 → 26、 「X九」 → 19、 「四X二」 → 42
        if 'X' in s:
            parts = s.split('X')
            if len(parts) != 2: return None
            tens = KANJI_DIGITS.get(parts[0], 1) if parts[0] else 1  # 「X六」 = 16
            ones = KANJI_DIGITS.get(parts[1], 0) if parts[1] else 0
            return tens * 10 + ones
        # 1桁
        if len(s) == 1 and s in KANJI_DIGITS:
            return KANJI_DIGITS[s]
        return None

    def extract_age(s):
        """文字列から年齢を抽出 (漢数字 + アラビア数字、 範囲は最小値返す)"""
        # アラビア数字 「22歳」 「20-21」
        m = re.search(r'(\d{1,2})\s*[-〜~]?\s*(\d{1,2})?\s*歳', s)
        if m:
            return int(m.group(1))
        # 漢数字 「二十六-二十七」 「二十二歳」 「十九」
        m = re.search(r'([〇零一二三四五六七八九十]{1,4})\s*[-〜~]?\s*([〇零一二三四五六七八九十]{1,4})?\s*歳', s)
        if m:
            return kanji_to_int(m.group(1))
        # 「二十二」 単独 (歳なし)、 「-」 区切り
        m = re.search(r'([二三四五六七八九][十][〇零一二三四五六七八九]?)\s*-\s*([二三四五六七八九][十][〇零一二三四五六七八九]?)', s)
        if m:
            return kanji_to_int(m.group(1))
        return None

    # POOL から name + desc 抽出
    pool_chars = {}
    for ent in re.finditer(
        r'name:\s*"([^"]+)"\s*,[^}]*?desc:\s*"([^"]+)"',
        text
    ):
        pool_chars[ent.group(1)] = ent.group(2)

    # LORE_BY_KEY 各キャラ凸秘話 body 集約
    lore_bodies = {}
    for ent in re.finditer(r'"([^"]+)"\s*:\s*\[([\s\S]*?)\]\s*,\s*"', text):
        name = ent.group(1)
        block = ent.group(2)
        if name in pool_chars:
            bodies = re.findall(r'body:\s*"([^"]+)"', block)
            lore_bodies[name] = ' '.join(bodies)

    violations_found = []
    checked = 0
    for name, desc in pool_chars.items():
        pool_age = extract_age(desc)
        if pool_age is None:
            continue
        checked += 1
        lore_text = lore_bodies.get(name, '')
        if not lore_text:
            continue
        # LORE 内の 各「○○歳」「○十○歳」 等を 全部チェック
        all_lore_ages = []
        for m in re.finditer(r'(\d{1,2})\s*歳', lore_text):
            all_lore_ages.append(int(m.group(1)))
        for m in re.finditer(r'([〇零一二三四五六七八九十]{1,4})\s*歳', lore_text):
            v = kanji_to_int(m.group(1))
            if v: all_lore_ages.append(v)
        # キャラ自身の年齢として識別される age (不一致 ≥2歳)
        for lore_age in all_lore_ages:
            if abs(pool_age - lore_age) >= 2:
                violations_found.append(
                    f"  「{name}」 POOL.desc {pool_age}歳 vs LORE 凸秘話 {lore_age}歳 ({abs(pool_age-lore_age)}歳ズレ)"
                )
                break  # 1キャラ1件まで

    if violations_found:
        unique = list(dict.fromkeys(violations_found))[:15]
        warnings_only.append(
            f"[ルール7-49 年齢整合 WARNING] POOL.desc vs LORE 凸秘話 で 年齢ズレ {len(violations_found)}件\n"
            + '\n'.join(unique) +
            f"\n      → 同キャラの 同じ年齢が 2箇所で 違うのは キャラ設定不整合 (野沢さん指摘 2026-05-08)\n"
            f"      → POOL/LORE どちらかを 統一、 「若き○○」 等 本文表現と整合する方向で 修正"
        )
    return checked


n7_49 = check_age_consistency()
print(f"  ルール7-49 (年齢整合): {n7_49}キャラ 検査 [WARNING]")


def check_pov_pronoun_consistency():
    """ルール7-50 (WARNING、 2026-05-08 野沢さん指示「整合性重視で全修正」):
    POV キャラの一人称が 章内/章間で ブレないか。

    過去事故: ヴィル s1c3「わたし」 ⇆ s1c7「私」、 イザベル s1c2「わたし/私」 混在 (修正済)。

    検出: STORY_OUTLINE の povCharName 各章で 本文の「わたし」/「私」 出現数を 比較、
    比率が 9:1 を超えなければ 「混在」 として WARNING。
    """
    script_path = ROOT / 'script.js'
    story_dir = ROOT / 'content' / 'story'
    if not (script_path.exists() and story_dir.exists()):
        return 0
    text = script_path.read_text(encoding='utf-8')

    # STORY_OUTLINE から各章の povCharName 抽出 (形式: { id: 's1c1', ..., povCharName: 'ちさと' })
    pov_by_chap = {}
    for m in re.finditer(r"id:\s*'(s1c\d+)'[^}]*?povCharName:\s*'([^']+)'", text):
        pov_by_chap[m.group(1)] = m.group(2)

    violations_found = []
    checked = 0
    for chap, pov_name in pov_by_chap.items():
        path = story_dir / f'{chap}.md'
        if not path.exists():
            continue
        body = path.read_text(encoding='utf-8')
        # 本文中の「わたし」 + 「私」 (鉤括弧外、 地の文中心)、 ただし他キャラ台詞 (鉤括弧内) は 各キャラ一人称
        # シンプル: 全文での出現数で 比較 (鉤括弧内の他キャラ台詞 含むが 概算)
        n_wata = body.count('わたし')
        n_watashi = len(re.findall(r'(?<![\w])私(?![\w])', body))  # 漢字「私」 単独 (連語除外)
        if n_wata + n_watashi == 0:
            continue
        checked += 1
        ratio = n_wata / (n_wata + n_watashi)
        # 9:1 = 0.9 超え or 0.1 未満で 統一、 それ以外は 混在
        if 0.1 < ratio < 0.9:
            violations_found.append(
                f"  [{chap}.md] POV「{pov_name}」 一人称ブレ: わたし {n_wata}回 / 私 {n_watashi}回 (比率 {ratio:.0%})"
            )

    if violations_found:
        warnings_only.append(
            f"[ルール7-50 一人称統一 WARNING] POV章で 「わたし/私」 混在 {len(violations_found)}件\n"
            + '\n'.join(violations_found) +
            f"\n      → 同一POVキャラの一人称は 章内/章間で 統一すべき (どちらかに 9:1 以上偏らせる)\n"
            f"      → 章単独で混在しても 章間で「わたし」 ⇆ 「私」 ズレは キャラ性逸脱"
        )
    return checked


n7_50 = check_pov_pronoun_consistency()
print(f"  ルール7-50 (POV 一人称統一): {n7_50}章 検査 [WARNING]")


def check_thousand_year_frequency():
    """ルール7-51 (WARNING、 2026-05-08 野沢さん指示「自動チェックで漏れないように」):
    「千年に一度」 「千年で初めて」 等の高頻度表現が 本文の 三柱集結シーン頻度 と矛盾しないか。

    過去事故: s1c6 で「観測者三柱が千年に一度同じ卓を囲む場」 と本文 — 一方 s1c1〜s1c5 各章エピローグで
    三柱は ちょこちょこ集結 → 矛盾、 「節目ごとに」 で修正済 (commit 44b641f)。

    検出: 本文中で「千年に一度.{0,15}三柱|三柱.{0,15}千年に一度|観測者.{0,15}千年に一度」 等
    集結頻度ニュアンスを含むパターンを WARNING。
    """
    story_dir = ROOT / 'content' / 'story'
    if not story_dir.exists():
        return 0
    found = 0
    samples = []
    # 集結頻度を直接 言うパターンに限定 (false positive 削減)
    # 「観測者の歴史にとって千年に一度の出来事」 等 = 出来事の歴史的稀少性で 集結頻度ではない、 除外
    PATS = [
        r'三柱[^。]{0,15}千年に一度[^。]{0,15}(集まる|語り合う|卓|顔を合わせ|会う|集結)',
        r'観測者三柱[^。]{0,15}千年に一度[^。]{0,15}(集まる|語り合う|卓|集結)',
        r'千年に一度[^。]{0,15}(三柱|観測者三柱)[^。]{0,15}(集まる|語り合う|卓|集結)',
        r'千年に一度[^。]{0,5}(同じ卓|顔を合わせ)',
    ]
    PAT_RE = re.compile('|'.join(PATS))
    for path in sorted(story_dir.glob('s1c*.md')):
        body = path.read_text(encoding='utf-8')
        for m in PAT_RE.finditer(body):
            line_no = body[:m.start()].count('\n') + 1
            samples.append(f"  [{path.name} L{line_no}] {body[max(0,m.start()-10):m.end()+10]}")
            found += 1
    if found:
        warnings_only.append(
            f"[ルール7-51 千年に一度 集結頻度矛盾 WARNING] {found}件\n"
            + '\n'.join(samples[:10]) +
            f"\n      → 観測者三柱は s1c1〜s1c5 各章エピローグで 集結している。 「千年に一度」 表現は 集結頻度では 矛盾\n"
            f"      → 「節目ごとに」 「ことあるごとに」 等で 表現変更を 検討"
        )
    return found


n7_51 = check_thousand_year_frequency()
print(f"  ルール7-51 (千年に一度 集結頻度矛盾): {n7_51}件 検査 [WARNING]")


def check_faction_full_short_consistency():
    """ルール7-52 (WARNING、 2026-05-08 野沢さん指示「整合性重視」):
    派閥名のフル名 (例: 「黒月衆ノクトス」) と短縮名 (「黒月衆」) が 本文中で 整合するか。
    初出時のみフル名、 以降は 短縮名で 統一。

    検出: 各章で 同派閥のフル名と短縮名の出現を カウント、
    フル名が **2回以上** 登場 (初出+リフレイン演出 1回まで OK、 3回以上は不自然) なら WARNING。
    """
    story_dir = ROOT / 'content' / 'story'
    if not story_dir.exists():
        return 0
    # フル名 / 短縮名 ペア (派閥のみ)
    PAIRS = [
        ('黒月衆ノクトス', '黒月衆'),
        ('地底市リオラ', '地底市'),
        ('巫女連邦リーリエ', '巫女連邦'),
        ('銀霜王国', None),  # 単独で OK
        ('紅玉海賊団', None),
    ]
    violations_found = []
    for path in sorted(story_dir.glob('s1c*.md')):
        body = path.read_text(encoding='utf-8')
        for full, short in PAIRS:
            if not short: continue
            n_full = body.count(full)
            if n_full > 2:  # 初出 + リフレイン1回 まで OK、 3回以上は冗長
                violations_found.append(
                    f"  [{path.name}] フル名「{full}」 が {n_full}回登場 (初出+リフレイン以外は短縮名「{short}」 推奨)"
                )
    if violations_found:
        warnings_only.append(
            f"[ルール7-52 派閥名フル/短縮整合 WARNING] {len(violations_found)}件\n"
            + '\n'.join(violations_found[:10]) +
            f"\n      → 派閥名は 初出時のみフル名 (例: 黒月衆ノクトス)、 以降は 短縮名 (黒月衆) で 統一\n"
            f"      → 3回以上のフル名登場は リフレイン演出を 超えて冗長"
        )
    return len(violations_found)


n7_52 = check_faction_full_short_consistency()
print(f"  ルール7-52 (派閥名 フル/短縮 整合): {n7_52}件 検査 [WARNING]")


def check_outline_canon_name_consistency():
    """ルール7-53 (BLOCKER、 2026-05-08 野沢さん指示「自動チェックで漏れないように」):
    outline.md のキャラ名と script.js POOL のキャラ名が 一致するか。

    過去事故: outline.md「アシュラ」 vs POOL「ホムラ」 (3箇所、 修正済 commit 5028fd8)。
    """
    outline = ROOT / 'content' / 'story' / 'outline.md'
    script_path = ROOT / 'script.js'
    if not (outline.exists() and script_path.exists()):
        return 0
    outline_text = outline.read_text(encoding='utf-8')
    js_text = script_path.read_text(encoding='utf-8')

    # POOL の name list を 取得
    pool_names = set()
    for m in re.finditer(r'name:\s*"([^"]+)"', js_text):
        pool_names.add(m.group(1))
        # 短縮名 (姓だけ + 名だけ) も pool に含める
        parts = m.group(1).split()
        for p in parts:
            if len(p) >= 2:
                pool_names.add(p)

    # outline 内の カタカナ固有名詞 (3-6文字) を抽出
    outline_names = set()
    for m in re.finditer(r'[ァ-ヴー]{3,6}', outline_text):
        outline_names.add(m.group(0))

    # outline にあって POOL にない カタカナ名 (キャラ名候補)
    # ただし 一般語彙 (リーリエ/ノクトス 等の派閥名 + ヴォイドラ/プリズマ 等の 既存) は除外
    KNOWN = {'リーリエ', 'ノクトス', 'リオラ', 'ヴォイドラ', 'プリズマ', 'ザナド',
             'シーズン', 'シーン', 'ストーリー', 'プロローグ', 'エピローグ',
             'タイトル', 'リファレンス', 'メイン', 'オウル', 'ビギナー',
             'ティザー', 'リセット', 'コラム', 'カグヤ', 'ノクス', 'セラフィエル',
             'プリズマエラ', 'パートナー', 'ストア', 'マーカー', 'ロット',
             'シリーズ', 'シーズン', 'コスト', 'ジン', 'メイス', 'ベル', 'カメラ',
             'プレビュー', 'タップ', 'ロード', 'ゲスト', 'パス', 'モード',
             'インストラクター', 'ラスト', 'シャラ', 'バランス', 'クライマックス',
             'チャプター', 'メリット', 'デメリット', 'タイミング', 'パッセージ',
             'エントリ', 'テーマ', 'サハール', 'キャラ', 'ロエン', 'ゼノニア',
             'ニーヴル', 'アクアシス', 'シオン', 'イザベル', 'アルテミス',
             'ヒノオウ', 'ノヴァ', 'ホムラ', 'イリス', 'ヴィオレナ',
             'ガルヴィン', 'ノクトリア', 'リオラエル', 'ファラー', 'グレイル',
             'グラン', 'サハナ', 'シャンティ', 'ヴァーレ', 'リアラ',
             'ザナディア', 'ウンブリス', 'テネブラ', 'ジュンクトス', 'ミューティス',
             'ルナリア', 'ガリオン', 'ハーニア', 'ピット', 'ベル', 'ピピ',
             'コラリア', 'ネプテア', 'ヴィル', 'リアム', 'カグヤさん',
             'シ・ロエン', 'シエル', 'ルミナ', 'ラナス', 'メイリ',
             'デフォルト', 'ノート', 'プレイヤー', 'ライバル'}
    suspect = []
    for n in outline_names:
        if n in pool_names: continue
        if n in KNOWN: continue
        # 本当にキャラ名らしい (前後に「凸秘話」 「が」「は」 等が続く) か簡易判定
        ctx = re.search(rf'.{{0,30}}{re.escape(n)}(凸秘話|が|は|を|の|と|『)', outline_text)
        if ctx:
            suspect.append(n)

    if suspect:
        violations.append(
            f"[ルール7-53 outline キャラ名 vs POOL 整合 BLOCKER] {len(suspect)}件\n"
            f"  outline.md にある {set(suspect[:10])} が POOL に未登録\n"
            f"      → 設定書類と実装で キャラ名統一必須 (過去事故 アシュラ vs ホムラ commit 5028fd8 で修正)"
        )
        return len(suspect)
    return 0


n7_53 = check_outline_canon_name_consistency()
print(f"  ルール7-53 (outline キャラ名 vs POOL 整合): {n7_53}件 検査 [BLOCKER]")


def check_persist_time_word_char_setting():
    """ルール7-54 (BLOCKER、 2026-05-08 シオン千年ぶり事故 後追加):
    本文中で 長期時間表現 (「千年ぶり」「千年前に」「百年経って」等 キャラ自身の経験を示す表現) が 出る段落に、
    POOL.desc 永続性キーワード (千年/古代/古龍/長命/不老/始祖) を 持たない 一般キャラの 名前が 同居する場合
    → 設定逸脱 BLOCKER。

    過去事故: s1c7「千年ぶりに、 シオンの声が...」 私が追記、 シオンは 24歳銀霜騎士で 分離は s1c5 (約半年前)、
    完全な設定逸脱。 同日 5回目の同種事故 (ノクス古文調 / 千年に一度頻度 / 両手挿絵 / 年齢不整合 / 今回千年ぶり)。

    判定:
      Step 1: POOL の name + desc + caption から 永続性キーワード持ちキャラを 自動抽出 (= 千年級 allowlist)
      Step 2: 本文を 段落 (連続非空行 or 句点区切り) に分割
      Step 3: 段落内に 千年系時間表現フレーズ + 一般キャラ名 が 同居 → BLOCKER
    """
    story_dir = ROOT / 'content' / 'story'
    script_path = ROOT / 'script.js'
    if not (story_dir.exists() and script_path.exists()):
        return 0
    js_text = script_path.read_text(encoding='utf-8')

    # POOL の name と desc を ペアで 取得
    PERSIST_KW = re.compile(
        r'千年|百年|数千年|古代|古龍|長命|不老|始祖|代々|永遠|始まり|始原|太古|龍王|不朽'
        r'|観測者|七座|神霊|天使|降臨|顕現|原虹|三姉妹|三柱|原初|始原'
    )
    persist_chars = set()
    all_chars = set()
    for m in re.finditer(r'\{\s*name:\s*"([^"]+)"[^{}]*?desc:\s*"([^"]*)"', js_text, re.DOTALL):
        name, desc = m.group(1), m.group(2)
        all_chars.add(name)
        # caption も探す
        cap_m = re.search(r'caption:\s*"([^"]*)"', m.group(0))
        cap = cap_m.group(1) if cap_m else ''
        if PERSIST_KW.search(desc) or PERSIST_KW.search(cap) or PERSIST_KW.search(name):
            persist_chars.add(name)
            # 短縮名 (姓 / 名) も persist 扱い
            for p in name.split():
                if len(p) >= 2:
                    persist_chars.add(p)

    # 一般キャラ名 list (persist でないもの)
    general_chars = set()
    for n in all_chars:
        if n in persist_chars: continue
        # 短縮名も生成
        general_chars.add(n)
        for p in n.split():
            if len(p) >= 2 and p not in persist_chars:
                general_chars.add(p)

    # 千年系時間表現 (キャラ自身の経験を示す = 集結頻度や 神話的稀少性は除外)
    PERSIST_PHRASE = re.compile(
        r'千年(?:ぶりに|前(?:に|から|の)|経って|越し|生き(?:て|た)|渡(?:り|って)|の眠り)'
        r'|百年(?:ぶりに|前(?:に|から)|経って|生き(?:て|た))'
        r'|(?:千年|百年)(?:という|の歳月|の月日|を経|を越え)'
    )

    # 一般キャラ名 を 長い順に並べる (部分一致衝突回避)
    sorted_general = sorted(general_chars, key=lambda x: -len(x))
    if not sorted_general:
        return 0
    GENERAL_NAME_RE = re.compile('|'.join(re.escape(n) for n in sorted_general))

    found = []
    for path in sorted(story_dir.glob('s1c*.md')):
        body = path.read_text(encoding='utf-8')
        # 編集メモ/メタ block を 本文から除外 (公開本文ではない)
        body = re.split(r'\n##\s*(?:編集メモ|メタ情報|内部メモ|執筆メモ)', body)[0]
        # 段落分割: 句点 or 連続改行
        paragraphs = re.split(r'(?<=[。」])\s*\n|\n\n+', body)
        offset = 0
        for para in paragraphs:
            para_start = body.find(para, offset)
            if para_start < 0: para_start = offset
            offset = para_start + len(para)
            if not PERSIST_PHRASE.search(para): continue
            # 段落内に 一般キャラ名が 出るか
            for nm in GENERAL_NAME_RE.finditer(para):
                cname = nm.group(0)
                # persist キャラの 部分一致は除外 (例: 「シオン」 を含む 「シオンナ」 等)
                if any(cname in pc and cname != pc for pc in persist_chars):
                    continue
                line_no = body[:para_start].count('\n') + 1
                phrase_m = PERSIST_PHRASE.search(para)
                snippet = para[:80].replace('\n', ' ')
                found.append(
                    f"  [{path.name} L{line_no}] 一般キャラ「{cname}」+ 「{phrase_m.group(0)}」: {snippet}..."
                )
                break  # 段落単位で 1件報告

    if found:
        violations.append(
            f"[ルール7-54 永続時間表現 vs キャラ設定 BLOCKER] {len(found)}件\n"
            + '\n'.join(found[:15]) +
            f"\n      → 一般キャラ (POOL.desc に 千年/古代/古龍/長命/不老/始祖 含まない) に 「千年ぶり」「百年経って」 等の\n"
            f"        長期時間表現を 適用するのは 設定逸脱。 「久しぶりに」「あの夜以来」「半年余り前に」 等で 表現変更を\n"
            f"      → 千年級キャラ判定: POOL.desc/caption に 永続性キーワードを含む キャラ {sorted(list(persist_chars))[:8]}..."
        )
    return len(found)


n7_54 = check_persist_time_word_char_setting()
print(f"  ルール7-54 (永続時間表現 vs キャラ設定): {n7_54}件 検査 [BLOCKER]")


def check_pickup_chapter_target_sync():
    """ルール7-55 (BLOCKER、 2026-05-10 v1.6.0 公開直前 漏れ事故 後追加):

    main branch で commit する時、 `script.js` の `const PICKUP_CHAPTER_TARGET = 's1cN'` が
    version.json の **公開対象章** と 一致するか 検査。

    判定ロジック:
    - 対象章 = scheduledRelease.version あれば そこから 抽出 / なければ data.version から 抽出
    - v1.M.X → s1cM の 対応 (例: v1.6.0 → s1c6、 v1.5.0 → s1c5)
    - PICKUP_CHAPTER_TARGET ≠ 対象章 なら BLOCKER

    背景: 2026-05-10 v1.6.0 (s1c6) main release で PICKUP_CHAPTER_TARGET = 's1c5' のまま 漏れ →
    野沢さん指摘「ピックアップの表記が第5章のままになってるけどチェックしたの?」 強い指摘。
    PICKUP_CHAPTER_TARGET は 単独 const 変数で bump_version.py が 触らない領域、 章 bump で
    必ず 1セットで 手動更新する必要、 機械化して 漏れ防止。

    詳細: CLAUDE.md feedback_chapter_release_checklist.md ⑬-2
    """
    if _current_branch() != "main":
        return 0
    ver_path = ROOT / "version.json"
    script_path = ROOT / "script.js"
    if not ver_path.exists() or not script_path.exists():
        return 0
    try:
        cur_data = json.load(ver_path.open(encoding="utf-8"))
    except Exception:
        return 0
    # 対象 version 抽出 (scheduledRelease 優先、 なければ data.version)
    target_ver = (cur_data.get("scheduledRelease") or {}).get("version") or cur_data.get("version", "")
    m = re.match(r"^v?(\d+)\.(\d+)\.", target_ver)
    if not m:
        return 0
    target_chapter = int(m.group(2))
    if target_chapter < 1:
        return 0
    target_key = f"s{m.group(1)}c{target_chapter}"
    # PICKUP_CHAPTER_TARGET 抽出
    try:
        script_text = script_path.read_text(encoding="utf-8")
    except Exception:
        return 0
    m2 = re.search(r"const\s+PICKUP_CHAPTER_TARGET\s*=\s*['\"]([^'\"]+)['\"]", script_text)
    if not m2:
        return 0
    actual = m2.group(1)
    if actual != target_key:
        violations.append(
            f"[ルール7-55 PICKUP_CHAPTER_TARGET 同期漏れ BLOCKER] main で commit する PICKUP_CHAPTER_TARGET='{actual}' が\n"
            f"      version.json の 対象章 '{target_key}' (= v{target_ver}) と 不一致。\n"
            f"      → script.js L1738 付近 `const PICKUP_CHAPTER_TARGET = '{actual}'` を '{target_key}' に手動更新\n"
            f"      → 章 release では bump_version.py が 触らない 単独 const、 1セットで 手動更新 必須\n"
            f"      → 詳細: CLAUDE.md feedback_chapter_release_checklist.md ⑬-2"
        )
        return 1
    return 0


n7_55 = check_pickup_chapter_target_sync()
print(f"  ルール7-55 (PICKUP_CHAPTER_TARGET 章同期): {n7_55}件 検査 [BLOCKER]")


def check_box_sync_drift():
    """ルール7-39 (WARNING 2026-05-06 野沢さん指示「必要な自動チェックに追加してください」): prism-gacha-work の
    主要ファイル (prompt/ STORY/ script.js sw.js index.html) と Box 内 (~/Box/.../claude/prismaera/) との
    差分を検出。 Claude が sync_to_box.sh 実行を忘れる事故 (2026-05-06「これもいつも忘れるね、 何やってんだよ」)
    の機械的防御。

    検査対象 (大事なものだけ高速判定):
      - prompt/*.md (キャラ/場所/BGM プロンプト)
      - STORY/*.md (本文 + outline + lores)
      - script.js / sw.js / index.html (主要コード)

    判定: ファイルの mtime/size を比較、 work 側が新しい (= sync 漏れ) なら WARNING。 BLOCKER ではなく WARNING で
    push を止めず警告のみ (pre-push hook で sync 自動実行されるため、 機械的には防御済、 念のための補助検証)。
    """
    box_root = Path.home() / "Box" / "DIK & Company" / "06_Other" / "野沢用" / "claude" / "prismaera"
    if not box_root.exists():
        # Box フォルダが存在しない環境 (CI 等) はスキップ
        return 0
    # 検査対象 (高速、 大事なもののみ)
    rel_targets = []
    for sub in ("prompt", "STORY"):
        for p in (ROOT / sub).rglob("*.md"):
            if p.is_file():
                rel_targets.append(p.relative_to(ROOT))
    for fname in ("script.js", "sw.js", "index.html"):
        p = ROOT / fname
        if p.exists():
            rel_targets.append(p.relative_to(ROOT))
    drift_count = 0
    drift_samples = []
    for rel in rel_targets:
        work_path = ROOT / rel
        box_path = box_root / rel
        if not work_path.exists():
            continue
        if not box_path.exists():
            drift_count += 1
            if len(drift_samples) < 5:
                drift_samples.append(f"{rel} (Box未存在)")
            continue
        # mtime 比較 (work 側が 5秒以上新しい = sync 漏れ)
        try:
            work_mtime = work_path.stat().st_mtime
            box_mtime = box_path.stat().st_mtime
            if work_mtime - box_mtime > 5:
                drift_count += 1
                if len(drift_samples) < 5:
                    drift_samples.append(f"{rel} (work {int(work_mtime - box_mtime)}秒新しい)")
        except Exception:
            pass
    if drift_count > 0:
        sample_str = " / ".join(drift_samples)
        if drift_count > len(drift_samples):
            sample_str += f" 他{drift_count - len(drift_samples)}件"
        warnings_only.append(
            f"[ルール7-39 Box sync 漏れ WARNING] {drift_count}ファイルが Box 未同期: {sample_str}\n"
            f"      → `bash scripts/sync_to_box.sh` を実行 (pre-push hook で自動実行されるが、 commit 段階での補助検証)\n"
            f"      → 野沢さんは Box を参照してアセット生成・確認するため、 sync 漏れは作業停止につながる\n"
            f"      → 詳細: CLAUDE.md / memory feedback_prism_box_sync.md"
        )
    return drift_count


if scope_match('deploy'):
    n7_39 = check_box_sync_drift()
    print(f"  ルール7-39 (Box sync 漏れ): {n7_39}件 検査 [WARNING]")


def check_paired_char_ref_attach():
    """ルール7-40 (WARNING 2026-05-06 野沢さん指示「双子とか姉弟とかにするのにもう一方のキャラを添付しないでいいの? 整合性は保てるの?」):
    prompt/sNcN_chars.md の各キャラセクションで対構図キーワード (mirror to / mirror palette / similar to / matching /
    same face structure / same as elder twin 等) が含まれる場合、 「⚠️ 生成前に必ず添付してください」 指示が
    そのセクションに含まれているかチェック。 含まれていなければ「リファ添付指示漏れ」 = WARNING。

    検出フローセクション = `### N. \`slug.png\` — name` の見出しから次の `### N+1.` までを 1セクションとして扱う。

    野沢さん指示 2026-05-06: 双子姉妹・親子・師弟・類似系譜の対構図キャラを生成する時、 もう一方のキャラ画像をリファ
    添付指示に明記しないと、 DALL-E 3 / gpt-image-1 が「対の構図」 を確実に再現できない。
    """
    PAIRED_KEYWORDS = [
        "mirror to ", "mirror palette", "mirror motif", "mirror crescent", "mirror braid",
        "similar to ", "matching ",
        "same face structure", "same as elder twin", "same as her elder", "same age as Iris and her elder",
        "like " "the reference", "as in the reference", "as shown in the reference",
    ]
    found_violations = 0
    for prompt_path in sorted((ROOT / "prompt").glob("characters/s1c*.md")):
        text = prompt_path.read_text(encoding="utf-8")
        # `### N.` でセクション分割
        sections = re.split(r'(?=^### \d+\. )', text, flags=re.M)
        for sec in sections:
            if not sec.startswith("### "):
                continue
            # セクションタイトル
            first_line = sec.split("\n", 1)[0].strip()
            # 対構図キーワード検出
            has_paired_keyword = any(kw in sec for kw in PAIRED_KEYWORDS)
            if not has_paired_keyword:
                continue
            # 添付指示「⚠️ 生成前に必ず添付してください」 or 「Attached: reference image」 検出
            # 例外: 「⚠️ 生成順序」 で 添付不要の理由 (相手キャラがまだ生成されていない先発キャラ等) が明記されている場合は OK
            has_ref_attach = ("⚠️ 生成前に必ず添付してください" in sec) or ("[Attached: reference image" in sec) or ("[Attached:" in sec and "reference" in sec) or ("⚠️ 生成順序" in sec)
            if not has_ref_attach:
                warnings_only.append(
                    f"[ルール7-40 対構図リファ添付漏れ WARNING] {prompt_path.name} :: {first_line[:60]}\n"
                    f"      → mirror/similar/same/matching 等の対構図キーワードあり、 リファ添付指示なし\n"
                    f"      → 「⚠️ 生成前に必ず添付してください」 で 相手キャラ画像を明記する\n"
                    f"      → 詳細: memory feedback_paired_char_ref_attach.md / CLAUDE.md"
                )
                found_violations += 1
    return found_violations


n7_40 = check_paired_char_ref_attach()
print(f"  ルール7-40 (対構図リファ添付): {n7_40}件 検査 [WARNING]")


def check_main_no_suffix():
    """ルール7-27 (BLOCKER 2026-05-05): main branch で commit する version は suffix なし (X.Y.Z 形式) 必須。
    2026-05-05 v1.4.4 main reach 後の 緊急 hotfix で dev → main merge --no-ff した時、 dev の cache buster
    (?v=1.4.4b) + version.json (1.4.4b) + sw.js + manifest が そのまま main に流入して 「v1.4.4b」 が
    本番表示された事故の再発防止。 ルール7-24 (main で version bump 必須) では suffix 残存を検出できなかった。
    野沢さん 「何回も言わすな、 本当にふざけんなよ」 強い叱責。
    詳細: CLAUDE.md feedback_prismaera_version_suffix.md
    """
    if _current_branch() != "main":
        return 0
    ver_path = ROOT / "version.json"
    if not ver_path.exists():
        return 0
    try:
        cur_ver = json.load(ver_path.open(encoding="utf-8"))["version"]
    except Exception:
        return 0
    # X.Y.Z (数字のみ) 形式以外は suffix 残存 と判定
    if not re.match(r'^\d+\.\d+\.\d+$', cur_ver):
        violations.append(
            f"[ルール7-27 main suffix 残存 BLOCKER] main の version='{cur_ver}' に suffix が残っている。\n"
            f"      → main branch では 必ず X.Y.Z (数字のみ) 形式、 dev suffix (a/b/c...) は 除去必須\n"
            f"      → dev → main merge --no-ff 直後は 必ず version.json / index.html cache buster /\n"
            f"        cardgame/script.js / sw.js / manifest.json / README.md の 6 ファイル全部で\n"
            f"        suffix 残存していないか 目視確認 (or sed で 一括 strip)\n"
            f"      → 2026-05-05 v1.4.4b 本番流入事故 (野沢さん 「何回も言わすな」 強い叱責) 再発防止\n"
            f"      → 詳細: CLAUDE.md feedback_prismaera_version_suffix.md"
        )
    return 1

if scope_match('deploy'):
    n7_27 = check_main_no_suffix()
    print(f"  ルール7-27 (main で suffix なし 必須): {n7_27}件 検査 [BLOCKER]")


def check_admin_tier_max():
    """ルール9 (BLOCKER 2026-05-04 野沢さん指示「自動チェックにも入れたほうが良い」):
    admin.html の TIER_MAX が cardgame/data/pool.json の tier 別 count と一致するか確認。
    章追加時に TIER_MAX 更新漏れで「ガチャコンプ判定」 が永遠に届かなくなる事故防止。"""
    admin_path = ROOT / "admin.html"
    pool_path = ROOT / "cardgame" / "data" / "pool.json"
    if not admin_path.exists() or not pool_path.exists():
        return 0
    try:
        pool = json.loads(pool_path.read_text(encoding="utf-8"))
    except Exception:
        return 0
    from collections import Counter
    actual = Counter(c.get("tier", "?") for c in pool)
    admin_text = admin_path.read_text(encoding="utf-8")
    m = re.search(r"const\s+TIER_MAX\s*=\s*\{([^}]+)\}", admin_text)
    if not m:
        return 0
    declared = {}
    for kv in re.finditer(r"(\w+)\s*:\s*(\d+)", m.group(1)):
        declared[kv.group(1)] = int(kv.group(2))
    diffs = []
    for tier in ["LR", "UR", "SSR", "SR", "R"]:
        a = actual.get(tier, 0)
        d = declared.get(tier, 0)
        if a != d:
            diffs.append(f"{tier}: admin={d} vs pool={a}")
    if diffs:
        violations.append(
            f"[ルール9 admin TIER_MAX 不一致 BLOCKER] {' / '.join(diffs)}\n"
            f"      → admin.html の TIER_MAX を pool.json の実数 (LR{actual.get('LR',0)}/UR{actual.get('UR',0)}/SSR{actual.get('SSR',0)}/SR{actual.get('SR',0)}/R{actual.get('R',0)}) に更新\n"
            f"      → 章追加時に admin 画面のガチャコンプ統計が永遠に届かない事故を防ぐ自動チェック (野沢さん指示 2026-05-04)"
        )
    return len(diffs)


def check_admin_bgm_labels():
    """ルール10 (WARNING 2026-05-04): prompt/bgm/ 配下の全 BGM が admin.html の BGM_LABELS に登録済確認。
    新章 BGM プロンプト追加時に admin の display label 更新漏れを警告 (再生回数統計の表示に必要)。"""
    admin_path = ROOT / "admin.html"
    bgm_dir = ROOT / "prompt" / "bgm"
    if not admin_path.exists() or not bgm_dir.exists():
        return 0
    admin_text = admin_path.read_text(encoding="utf-8")
    # BGM_LABELS 内の id を抽出 (1箇所目: const BGM_LABELS = { 'id': ... } )
    m = re.search(r"const\s+BGM_LABELS\s*=\s*\{([^}]+\}\s*,?\s*)*\s*\}", admin_text, re.DOTALL)
    if not m:
        return 0
    label_ids = set(re.findall(r"['\"]([\w_]+)['\"]\s*:\s*\{", m.group(0)))
    # prompt/bgm/ 配下の md ファイル名から BGM id を逆引き (最低限のもの)
    expected_ids = set()
    for f in bgm_dir.glob("*.md"):
        name = f.stem
        # 章テーマ: chapter_s1cN.md → s1cN は admin label にないが BGM id はある程度推測
        # 派閥テーマ: faction_<name>.md or factions/<name>.md → admin の id と一致しそうな文字列
        m2 = re.match(r"chapter_s1c(\d+)", name)
        if m2:
            ch = int(m2.group(1))
            # 第1章=watch, 第2章=tide, 第3章=sands, 第4章=frost, 第5章=blackmoon
            chmap = {1: "watch", 2: "tide", 3: "sands", 4: "frost", 5: "blackmoon"}
            if ch in chmap:
                expected_ids.add(chmap[ch])
            continue
        # cardgame.md
        if name == "cardgame":
            expected_ids.add("cards")
            continue
    missing = expected_ids - label_ids
    if missing:
        warnings_only.append(
            f"[ルール10 admin BGM_LABELS 未登録 WARNING] prompt/bgm/ にある BGM が admin.html BGM_LABELS に未登録: {', '.join(sorted(missing))}\n"
            f"      → admin.html の BGM_LABELS / BGM_LABELS_DETAIL に追加すると BGM 再生統計が正しく表示される (野沢さん指示 2026-05-04 自動チェック)"
        )
    return len(missing)


n9 = check_admin_tier_max()
print(f"  ルール9 (admin TIER_MAX = pool count): {n9}件 検査 [BLOCKER]")
n10 = check_admin_bgm_labels()
print(f"  ルール10 (admin BGM_LABELS 全 BGM 登録): {n10}件 検査 [WARNING]")

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
n7_15 = check_tier_consistency(pool_x)
n7_17 = check_char_age_keywords(sf_ids_x)
n7_20 = check_age_excess(sf_ids_x)
n8_pre = len(warnings_only)
n8 = check_short_kana_collisions()
n8_post = len(warnings_only)
warnings = list(violations) + warnings_only
violations.clear()
warnings_only.clear()
print(f"  ルール2 (内部キー直書き): {n2}件 検査 [WARNING / 誤検知あり]")
print(f"  ルール5 (野沢呼称): {n5_post - n5_pre}件 検査 [WARNING / 誤検知あり]")
print(f"  ルール6 (モーダル網羅): {n6}件 検査 [WARNING / Esc・Space網羅対策]")
print(f"  ルール7-4/5 (章WARNING): {len(warnings) - n6 - (n8_post - n8_pre)}件 検査 [WARNING / 章公開段階]")
print(f"  ルール7-15 (Tier 整合性 title格): {n7_15}キャラ 検査 [WARNING]")
print(f"  ルール7-17 (ガチャキャラ年齢ワード): {n7_17}セクション 検査 [WARNING]")
print(f"  ルール7-20 (本文年齢明示過剰): {n7_20}シーン 検査 [WARNING]")
print(f"  ルール8 (短カナ部分一致): {n8}キャラ 検査 [WARNING / 部分一致リスク]")

print()

# Warning 表示 (exit 0 維持)
if warnings:
    print(f"⚠️  警告 {len(warnings)}件 (commit は通る、 内容を確認)\n")
    for w in warnings:
        print(f"  - {w}")
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
