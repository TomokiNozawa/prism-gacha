# Cardgame BGM プロンプト — Prism Cards (虹霊カードホール)

Prismaera Card Game (Phase 1 PoC〜) の常時 BGM。 Suno AI 向け。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `assets/bgm/prism-cards.mp3`
> - **基調**: ミドルテンポ (BPM 110-120)、 思考を妨げないループ向き、 軽快さと神秘の両立
> - **対応シーン**: `/cardgame/` 配下の全画面 (難易度選択 + 試合中 + リザルト)、 1 曲 ループで常時再生
> - **コード参照**: `cardgame/script.js` の `BGM_URL = '/assets/bgm/prism-cards.mp3'` + `audio.loop=true`
> - **配置位置**: cardgame ヘッダ右側のミュートボタン (🔊/🔇) で ON/OFF 切替、 状態は localStorage 保存
> - script.js BGM_LIST 追加時に duration 計測 → mm:ss 固定値で埋める (`bash scripts/measure_bgm.sh`)

---

## 楽曲コンセプト

「**虹霊界の神秘的なカードホール**」。 観測者三柱が夜の城のラウンジでカードを切る、 prismatic shimmer の漂う戦略の場。 カジノラウンジ感 (jazzy walking bass + brushed drums + electric piano) を骨格に、 Aurora 紫×シアンの世界観を ambient pad と prismatic synth bell で重ね、 「思考を促進」 + 「飽きないループ」 + 「世界観を壊さない」 三点を両立。 派手な build-up や drama は避け、 sustained tension で読み合いの緊張感を持続させる。

---

## 🎵 v1 — Mystical Card Hall (BPM 115、 推奨基準)

- **基調**: ジャズラウンジ (electric piano + walking bass + brushed drums) + Aurora 神秘パッド
- **ムード**: 戦略的・思考促進・軽快な妖艶さ・prismatic shimmer
- **テンポ**: BPM 110-120、 ミドル swing、 思考を妨げない (=戦闘 BGM のような driving は避ける)
- **構成**: ループ前提なので intro/outro 控えめ。 主題 (16 bar A) → 変奏 (16 bar B、 prismatic shimmer 強め) → 主題リプライズ (16 bar A')。 約 2:00-2:30 で 1 周、 fade なしで滑らかにループ
- **キー**: A minor (主題)、 中盤で C major へ momentary modulation (prismatic theme echo)
- **音響**: 中域 warm、 高域は prismatic synth bell が控えめに sparkle

### Suno AI プロンプト (Style)

```
Mystical jazz-lounge for fantasy card game, mid-tempo BPM 115, swing feel.
Walking upright bass, brushed drum kit (soft snare + ride cymbal), warm electric piano (Rhodes-like)
playing modal jazz voicings. Layered with ethereal aurora ambient pad
and occasional prismatic synth bell sparkles (high register, sparse, like distant chimes).
Mood: strategic, contemplative, slightly mysterious, with playful intelligence.
Inspired by a mystical card hall in a celestial castle — observers play cards under the aurora sky.
Loopable, no dramatic build, sustained tension. A minor key with momentary C major echoes.
Avoid heavy percussion, no vocals, no aggressive synths. Instrumental only.
Length: around 2:00-2:30 for clean loop.
```

### Suno AI Tags

```
jazz lounge, mystical, ambient, fantasy game, instrumental, mid-tempo, walking bass, brushed drums,
electric piano, ethereal pad, prismatic, strategic, loopable, casino lounge, aurora,
night card hall, contemplative, no vocals
```

---

## 🎵 v2 — Pure Lounge Casino (BPM 120、 比較試聴用)

カジノラウンジ寄り (神秘要素やや薄め)。 もし v1 が「神秘に寄りすぎ」 と感じる場合の比較用。

- **基調**: ストレート jazz lounge、 ambient pad は最小限
- **音響**: 中域 dry、 高域はピアノ右手のみ
- **キー**: D minor (jazzy)
- **テンポ**: BPM 120、 swing tighter

### Suno AI プロンプト (Style)

```
Classic jazz lounge for sophisticated card game, mid-tempo BPM 120, tight swing.
Walking upright bass, brushed drums, warm electric piano (Rhodes) with bluesy modal voicings.
Subtle vibraphone accents in the high register. Minimal ambient pad in the background
for a slight mystical hint, but mostly classic lounge feel.
Mood: refined, strategic, sophisticated, late-night card room.
D minor with frequent ii-V-i progressions. Loopable, no dramatic builds, instrumental only.
Length: around 2:00-2:30.
```

---

## 採用判断

野沢さんが v1 と v2 を聞き比べて判断:
- **世界観優先**: v1 (Aurora pad + prismatic bell が前面、 Prismaera との統一感大)
- **カジノ感優先**: v2 (純 jazz lounge、 ジャズ好きには馴染む)
- 中間案 (v1 のテンポを v2 並みに上げる、 v2 にちょっと aurora pad 足す等) も生成可

採用 v が決まったら `assets/bgm/prism-cards.mp3` に配置 → script.js + sw.js PRECACHE_BGM 自動連携。

---

## 関連参照

- `cardgame/script.js`: BGM 再生ロジック (audio.loop=true、 ミュート localStorage)
- `cardgame/index.html`: ヘッダ右のミュートボタン (`#btn-cg-mute`)
- `feedback_bgm_uptempo.md`: BGM 基本アップテンポ既定 (本曲は思考妨げない目的で 110-120 に抑制、 例外扱い)
- 既存 BGM プロンプト形式: `prompt/bgm/chapter_s1c5.md` 参照
