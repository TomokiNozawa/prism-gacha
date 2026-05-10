"""s1c6 場所画像 13枚 を Box から repo へ取込 + thumb 自動生成 (s1c5 と同フロー)。

Box: C:/Users/t2262/Box/.../prismaera/images/locations/s1c6/
→ repo: ~/prism-gacha-work/images/locations/s1c6/{filename}.png
→ repo: ~/prism-gacha-work/images/locations/s1c6/thumb/{filename}_thumb.webp
"""
import os
import shutil
from PIL import Image

BOX_SRC = r"C:/Users/t2262/Box/DIK & Company/06_Other/野沢用/claude/prismaera/images/locations/s1c6"
REPO_DST = r"C:/Users/t2262/prism-gacha-work/images/locations/s1c6"
THUMB_DST = os.path.join(REPO_DST, "thumb")

THUMB_RATIOS = {
    "3:4": (768, 1024),
    "16:9": (1024, 576),
}


def main() -> int:
    os.makedirs(REPO_DST, exist_ok=True)
    os.makedirs(THUMB_DST, exist_ok=True)

    files = sorted(f for f in os.listdir(BOX_SRC) if f.endswith(".png"))
    print(f"取込対象: {len(files)} 枚")
    for f in files:
        src = os.path.join(BOX_SRC, f)
        dst_full = os.path.join(REPO_DST, f)
        thumb_name = os.path.splitext(f)[0] + "_thumb.webp"
        dst_thumb = os.path.join(THUMB_DST, thumb_name)

        shutil.copy2(src, dst_full)

        img = Image.open(src)
        ratio = img.size[0] / img.size[1]
        if abs(ratio - 0.75) < 0.01:
            target = THUMB_RATIOS["3:4"]
        elif abs(ratio - 1.778) < 0.02:
            target = THUMB_RATIOS["16:9"]
        else:
            raise SystemExit(f"未知の比率: {f} = {img.size}")
        thumb = img.convert("RGB").resize(target, Image.Resampling.LANCZOS)
        thumb.save(dst_thumb, "WEBP", quality=82)
        print(f"  + {f}: full {img.size} -> thumb {target} ({os.path.getsize(dst_thumb)//1024}kB)")

    print(f"完了: full {len(files)} 枚 + thumb {len(files)} 枚")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
