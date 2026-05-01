"""
prompt/locations_*.md のルール自動チェック (CLAUDE.md 絶対ルール対応)

ルール:
1. 「添付画像」 or 「添付リファ」 を含むセクションは
   ``` ブロック内に「元画像から表情や姿勢は変わってOKです」 を含むこと
   (CLAUDE.md / feedback_image_prompt_charref_suffix.md / feedback_dalle_disabled_feature_preservation.md)

将来拡張候補:
- 各セクション冒頭に対応シーン/本文行/役割/被写体/コード参照のメタデータが揃っていること
  (CLAUDE.md / feedback_asset_scene_mapping.md)

Usage:
  py scripts/check_prompt_rules.py            # all check
  PYTHONIOENCODING=utf-8 必須 (絵文字/日本語出力のため)

Exit: 0 (全合格) / 1 (違反あり)

Pre-commit フック (.githooks/pre-commit) から自動呼出。
"""
import re
import sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = Path(__file__).resolve().parents[1]
TARGET_DIR = ROOT / "prompt"
SUFFIX = "元画像から表情や姿勢は変わってOKです"

violations = []
checked = 0

if not TARGET_DIR.exists():
    print(f"⚠️  {TARGET_DIR} not found, skipping")
    sys.exit(0)

target_files = sorted(TARGET_DIR.glob("locations_*.md"))
if not target_files:
    print(f"⚠️  no prompt/locations_*.md found, skipping")
    sys.exit(0)

for path in target_files:
    text = path.read_text(encoding="utf-8")
    # ## で section 分割
    parts = re.split(r'(?=^## )', text, flags=re.M)
    for sec in parts:
        # セクション タイトル抽出 (1行目)
        first_line = sec.split("\n", 1)[0].strip()
        title = first_line.replace("## ", "").strip() or "(no title)"
        # 画像セクションのみ検査 (## 【N】... or ## ___.png)、 概要/使い方等は除外
        is_image_section = bool(re.search(r'\.png', first_line)) or first_line.startswith('## 【')
        if not is_image_section:
            continue
        # 添付画像 / 添付リファ 含むセクションのみ検査 (純風景は対象外)
        if "添付画像" not in sec and "添付リファ" not in sec:
            continue
        checked += 1
        # 末尾文言チェック
        if SUFFIX not in sec:
            violations.append(f"{path.name} :: {title}\n      → missing 末尾文言「{SUFFIX}」")

if violations:
    print(f"❌ ルール違反 {len(violations)}件 / 検査 {checked}セクション\n")
    for v in violations:
        print(f"  - {v}")
    print("\n  対応: 各 ``` ブロックの閉じ ``` の直前に空行 + 末尾文言を追加してください")
    print("  参考: CLAUDE.md「キャラ含む全画像で解剖学指示+末尾文言セット必須」")
    sys.exit(1)
else:
    print(f"✅ 全 {checked}セクション ルール合格 ({len(target_files)} files)")
    sys.exit(0)
