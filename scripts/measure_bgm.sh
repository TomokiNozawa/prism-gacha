#!/usr/bin/env bash
# BGM MP3 長さ計測 → BGM_LIST 更新用
# 使い方: bash scripts/measure_bgm.sh
cd "$(dirname "$0")/../assets/bgm"
for f in *.mp3; do
  sec=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$f")
  [ -z "$sec" ] && continue
  s_int=${sec%.*}
  m=$((s_int / 60))
  ss=$((s_int % 60))
  printf '%-40s %2d:%02d\n' "$f" "$m" "$ss"
done
