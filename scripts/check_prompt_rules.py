"""
画像プロンプト md のルール自動チェック (CLAUDE.md 絶対ルール対応)

対象: content/prompt/locations/*.md (場所画像・挿絵) / content/prompt/characters/*.md (キャラ立ち絵)
      (旧レイアウト prompt/locations_*.md も存在すれば対象。 2026-11-25 まで旧パスのみ見ていて実質 skip だった)

ルール (キャラリファ添付ありの画像セクションのみ。 純風景 = 添付なし は対象外):
1. ``` ブロック内に末尾文言「元画像から表情や姿勢は変わってOKです」 を含むこと
   (CLAUDE.md / feedback_image_prompt_charref_suffix.md / feedback_dalle_disabled_feature_preservation.md)
2. `CRITICAL ANATOMY REQUIREMENTS` ブロック (5本指・関節・武器の握り) を含むこと (2026-11-25 追加)
   (CLAUDE.md「画像プロンプト 解剖学指示は キャラ含む全画像で必須」 / feedback_image_prompt_charref_suffix.md)

画像セクション判定: 見出し (#/##/###) に .png を含む / 「【N】」 で始まる / 「### N.」 形式
キャラリファ添付あり判定: セクション内に「添付画像」「添付リファ」「必ず添付してください」「[Attached」 のいずれかを
  含む行があり、 その行が「なし」「不要」「no character body」 を含まない (= 「添付画像: なし (純風景)」「不要 (純風景)」 は除外)。
  見出しに「純風景」 を含むセクションも除外。

Usage:
  py scripts/check_prompt_rules.py            # 全ファイル検査 (既存負債も含めて全件表示、 違反あれば exit 1)
  py scripts/check_prompt_rules.py --staged   # staged の prompt md だけ検査 (pre-commit 用、 staged 版の中身で判定)
  PYTHONIOENCODING=utf-8 推奨 (絵文字/日本語出力のため)

Exit: 0 (全合格) / 1 (違反あり)

Pre-commit フック (.githooks/pre-commit) から --staged で自動呼出。
"""
import re
import sys
import subprocess
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = Path(__file__).resolve().parents[1]
SUFFIX = "元画像から表情や姿勢は変わってOKです"
ANATOMY = "CRITICAL ANATOMY REQUIREMENTS"
ATTACH_MARKERS = ("添付画像", "添付リファ", "必ず添付してください", "[Attached")
NO_ATTACH_WORDS = ("なし", "不要", "no character body")
STAGED_ONLY = "--staged" in sys.argv


def target_paths():
    paths = []
    paths += sorted((ROOT / "content" / "prompt" / "locations").glob("*.md"))
    paths += sorted((ROOT / "content" / "prompt" / "characters").glob("*.md"))
    paths += sorted((ROOT / "prompt").glob("locations_*.md"))  # 旧レイアウト互換
    return paths


def staged_texts():
    """staged の対象 md を {path: staged版テキスト} で返す"""
    r = subprocess.run(["git", "-C", str(ROOT), "diff", "--cached", "--name-only", "--diff-filter=ACMR"],
                       capture_output=True, text=True, encoding="utf-8", errors="replace")
    staged = set((r.stdout or "").splitlines())
    out = {}
    for p in target_paths():
        rel = p.relative_to(ROOT).as_posix()
        if rel not in staged:
            continue
        s = subprocess.run(["git", "-C", str(ROOT), "show", f":{rel}"], capture_output=True)
        if s.returncode == 0:
            out[p] = s.stdout.decode("utf-8", errors="replace")
    return out


def is_image_heading(first_line):
    head = first_line.lstrip("#").strip()
    return bool(re.search(r"\.png", first_line)) or head.startswith("【") or bool(re.match(r"^###\s+\d+\.\s", first_line))


def has_char_ref(first_line, sec):
    if "純風景" in first_line:
        return False
    for line in sec.splitlines():
        if any(m in line for m in ATTACH_MARKERS) and not any(w in line for w in NO_ATTACH_WORDS):
            return True
    return False


if STAGED_ONLY:
    texts = staged_texts()
else:
    texts = {p: p.read_text(encoding="utf-8") for p in target_paths()}

if not texts:
    print("✅ 検査対象の prompt md なし" + (" (staged なし)" if STAGED_ONLY else ""))
    sys.exit(0)

violations = []
checked = 0
for path, text in texts.items():
    rel = path.relative_to(ROOT).as_posix()
    for sec in re.split(r"(?=^#{1,3} )", text, flags=re.M):
        first_line = sec.split("\n", 1)[0].strip()
        if not first_line.startswith("#") or not is_image_heading(first_line):
            continue
        if not has_char_ref(first_line, sec):
            continue
        checked += 1
        title = first_line.lstrip("#").strip()[:70]
        if ANATOMY not in sec:
            violations.append(f"[ルール2 ANATOMY] {rel} :: {title}\n      → missing `{ANATOMY}` ブロック (5本指明示・関節制約・武器の握り方)")
        if SUFFIX not in sec:
            violations.append(f"[ルール1 末尾文言] {rel} :: {title}\n      → missing 末尾文言「{SUFFIX}」")

mode = "staged" if STAGED_ONLY else "全件"
if violations:
    print(f"❌ ルール違反 {len(violations)}件 / 検査 {checked}セクション ({mode}, {len(texts)} files)\n")
    for v in violations:
        print(f"  - {v}")
    print("\n  対応: キャラリファ添付ありの画像プロンプトには ``` ブロック内に")
    print(f"        `{ANATOMY}: clearly visible 5 fingers on each hand ..., anatomically correct joints, realistic grip ...`")
    print(f"        + 空行 + 末尾文言「{SUFFIX}」 をセットで入れる")
    print("  参考: CLAUDE.md「画像プロンプト 解剖学指示は キャラ含む全画像で必須」 / memory feedback_image_prompt_charref_suffix.md")
    sys.exit(1)
else:
    print(f"✅ 全 {checked}セクション ルール合格 ({mode}, {len(texts)} files)")
    sys.exit(0)
