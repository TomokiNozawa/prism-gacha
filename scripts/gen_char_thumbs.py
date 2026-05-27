#!/usr/bin/env python3
"""キャラ原寸PNG → サムネ webp (_thumb.webp) 生成 (欠落分のみ)

本体 script.js の toThumbUrl 規約:
  /images/characters/season1/{tier}/{name}.png
    → /images/characters/season1/{tier}/thumb/{name}_thumb.webp
サムネ仕様 (既存と統一): 最大 768x1152、 Lanczos 縮小、 WEBP quality 82、 RGB。

s1c7 公開時に サムネ生成が漏れ、 本体ギャラリー/相関図/ストーリーの thumb 参照で
s1c7 キャラ画像が表示されない事故対策 (2026-05-27)。 欠落している thumb だけ生成 (既存は上書きしない)。

実行:
  bash ~/.claude/scripts/run_py.sh scripts/gen_char_thumbs.py
  bash ~/.claude/scripts/run_py.sh scripts/gen_char_thumbs.py --force   # 全再生成
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BASE = ROOT / "images" / "characters" / "season1"
TIERS = ["lr", "ur", "ssr", "sr", "r"]
MAX_SIZE = (768, 1152)   # 最大 (アスペクト保持で fit)
QUALITY = 82


def main() -> int:
    force = "--force" in sys.argv
    gen = 0
    skip = 0
    err = 0
    for tier in TIERS:
        tdir = BASE / tier
        if not tdir.is_dir():
            continue
        thumb_dir = tdir / "thumb"
        thumb_dir.mkdir(exist_ok=True)
        for png in sorted(tdir.glob("*.png")):
            # _blink 等の派生は thumb 対象外 (本体 toThumbUrl は キャラ立ち絵のみ参照)
            if png.stem.endswith("_blink"):
                continue
            dst = thumb_dir / f"{png.stem}_thumb.webp"
            if dst.exists() and not force:
                skip += 1
                continue
            try:
                im = Image.open(png).convert("RGB")
                im.thumbnail(MAX_SIZE, Image.Resampling.LANCZOS)
                dst.parent.mkdir(exist_ok=True)
                im.save(dst, "WEBP", quality=QUALITY)
                gen += 1
                print(f"  + {tier}/{dst.name}  {im.size}  {dst.stat().st_size // 1024}kB")
            except Exception as e:
                err += 1
                print(f"  ! {tier}/{png.name} 失敗: {e}")
    print(f"\n生成 {gen} / スキップ(既存) {skip} / 失敗 {err}")
    return 1 if err else 0


if __name__ == "__main__":
    sys.exit(main())
