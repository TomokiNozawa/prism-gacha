# S1C7 章テーマBGM プロンプト — Prism Voidrad (虚意の慟哭)

第7章「黒月決戦」 (Season 1 最終章) の章テーマ BGM。 Suno AI 向け。

> **🎯 引き継ぎ規約**
> - 出力ファイル: `media/audio/bgm/prism-voidrad.mp3`
> - **基調**: アップテンポ三層構成 (BPM 130-160、 `feedback_bgm_uptempo.md` 準拠) — **戦闘級+神聖+静謐の三層構造**、 全派閥決戦の規模感 + プリズマ vs ヴォイドラ 対話の神聖さ + 眠りに入る静謐の三段が一曲の中で展開
> - 章テーマ「**影を消すのではなく、 共に在ると認める。 終わりは始まりの一形態**」 の二元論超越を音楽構造で表現 (七色×漆黒の対立から融合へ)
> - script.js BGM_LIST 追加時に duration 計測 → mm:ss 固定値で埋める (`bash scripts/measure_bgm.sh`)

---

## 楽曲コンセプト

第7章のテーマ「**影を消すのではなく、 共に在ると認める。 終わりは始まりの一形態**」 を反映。 Season 1 最終章として全章の集大成、 「観測 vs 観測されない」 の二元論を「共観」 で超える儀式の音楽。 三層構造で展開:

1. **戦闘級層 (1-2幕、 全派閥総力戦)**: 急速ティンパニ + 軍鼓 + 駆動弦 + brass fanfare = 全派閥集結の規模感
2. **神聖層 (4-1 山場、 プリズマ vs ヴォイドラ対話)**: 七色 choir + void choir 二極が交差 → 共観の融合 = 「私の影として認める」 神聖な合意
3. **静謐層 (5-1 山場、 プリズマ眠り)**: 全楽器が静かに収束 → 七色と漆黒の灰色 (共観の灰) に溶ける → 次の大紀の予兆

七色プリズマと漆黒ヴォイドラの対立 (二極 dual-tone) から、 ジュンクトス (共観の使徒) を介した融合 (灰の単色 mono-tone) への音楽的展開。 これは Season 1 全体の伏線回収であると同時に、 Season 2「接続の時代」 への直接的前奏。

---

## 🎵 v1 — 三層構造 戦闘級+神聖+静謐 (BPM 145、 推奨基準)

- **基調**: 戦闘級オーケストラ + 七色 choir + void choir + 共観の融合主題、 三層が時系列で展開
- **ムード**: 全派閥決戦の規模感 → 対話の神聖さ → 眠りの静謐 → 次の大紀の予兆
- **テンポ**: アップテンポ (BPM 140-160、 戦闘層は速め、 神聖層で減速、 静謐層で更に減速して終結)
- **構成**: 不穏な void rumble 冒頭 (異界塔覚醒) → 全派閥集結 (orchestral fanfare) → 戦闘高揚 (ティンパニ + 軍鼓 + driving strings) → 七色 choir vs void choir 対立 (山場前奏) → 神聖層 (二極 choir 交差 → 融合) → 静謐層 (collapse to ambient piano + harp) → 余韻 (灰色の単音 + 七色 chime sparkle 微音)

### Suno AI プロンプト (Style)

```
Epic-fantasy three-act final-chapter theme, mid-up-tempo orchestral with cosmic
gravitas. Three layered movements:

LAYER 1 — Battle-tier all-faction muster (~40%): driving timpani war-march pulse,
military snare 16th-note rolls, full orchestral strings (cello+viola+violin) thick
driving motion, royal brass fanfare (trumpets+horns+trombones) all-faction rally call
combined ceremonial-heroic motif, low contrabass drone with void distortion (Voidrad
looming), distant taiko heartbeat.

LAYER 2 — Sacred-tier dialogue (~40%): two contrasting choirs intertwining — pure
prismatic seven-color female choir ("ah-ah-ah" crystalline-celestial, Prisma's light)
versus deep wordless void male choir ("uum-uum" sub-bass distorted-resonant, Voidrad's
shadow). The choirs first antagonize in counter-melody, then shift into harmonic
interplay (mutual recognition), finally MERGE into unified seven-and-void choir at
"I recognize you as my shadow". Ethereal silver flute (witness motif, Junctus the
Co-Witness), pipe organ (cathedral solemnity), crystalline glockenspiel and harp
prismatic arpeggios.

LAYER 3 — Silent-tier slumber (~20%): gradual collapse to ambient minimalism, solo
grand piano sparse left-hand bass and slow right-hand melody (world's lullaby), harp
gentle arpeggios (prismatic threads unraveling), celesta single notes (frozen
starlight), one final merged seven-and-void choir whisper (neutral grey syllable),
fades to faint seven-color chime sparkle (next era promise).

Atmosphere: cracked sky over all-faction battlefield where seven prismatic streams
clash with void-black cosmic rift, Prisma's awakening from within the void where
light and shadow recognize each other in mirror dialogue, Co-Witness Apostle Junctus
standing as perfectly-bisected witness, millennium prison-tower Zanado falling silent
as Voidrad accepts "to remain as the world's shadow", final scene of Prisma falling
into willing slumber as all Season 1 heroes (seven-seat observers, kings, queens,
warriors, priests, children) silently see her off, faint S2 "era of connection"
promise sparkling at horizon.

Emotional arc: void rumble (Voidrad awakens) → all-faction fanfare (heroes assemble)
→ driving battle peak (great clash) → sacred recognition (choirs intertwine) →
unified harmony climax ("I recognize you") → slumber descent (quiet farewell) →
faint dawn glimmer (S2 promise).

BPM 145 main, brief acceleration to 160 in battle peak, deceleration to 72 in
slumber finale, key D minor with modulations to F major (recognition) and A minor
(farewell), 4:00 duration, instrumental with seven-color and void choir vocalize
only, fantasy game cinematic three-act epic finale.
```

### Suno AI プロンプト (Lyrics 欄)

```
[Instrumental]
```

> ⚠️ Suno AI の Lyrics 欄は `[Instrumental]` しか機能しない仕様 (野沢さん指示 2026-05-06)。 vocalize 指示は Style 側に既に明記済 (`pure prismatic seven-color female choir vocalize "ah-ah-ah"`、 `deep wordless void male choir vocalize "uum-uum"`、 `merged seven-and-void choir`) ので、 そちら経由で反映される。

---

## メタ情報

- **対応シーン**: s1c7 全章 (戦闘層=1-2幕、 神聖層=4幕、 静謐層=5幕)、 章ストーリー再生中の優先 BGM
- **ストーリー使用**: 章 BGM (chapter カテゴリ)、 章ストーリー再生中は本テーマが優先 (派閥 BGM faction_voidtower より優先)
- **本文整合**: 「異界塔ザナドの覚醒」 「全派閥の集結」 「ヴォイドラ覚醒」 「シオン×シ・ロエン無言の頷き」 「プリズマ覚醒、 私の影として認める」 「世界の影として留まる、 共観の使徒見届け」 「次の大紀のため眠る」 「七座+全戦士見送り」 「Season 2 への引き」
- **コード参照**: `script.js` `BGM_LIST` に `id: 'voidrad'` (`category: 'chapter'`) エントリ追加予定 (mp3 受領後)
- **保存先**: `~/Box/.../prismaera/media/audio/bgm/prism-voidrad.mp3`

## 整合性 (既存章 BGM + 派閥 BGM との差別化)

- 章 BGM の役割: Season 1 最終章の三層構造 (戦闘+神聖+静謐) を一曲で表現、 二元論を超える「共観」 のテーマを音楽構造で具現化
- 既存章 BGM (s1c1-s1c6) との差別化:
  - prism-watch (s1c1 BPM 110): 学院日常+影喰い襲来+プリズマ降臨の柔らかい覚醒 → s1c7 は **規模感** で差別化
  - prism-tide (s1c2 BPM 100): 海の祈り+イザベル覚醒+静謐 → s1c7 は **三層動的構造** で差別化
  - prism-sands (s1c3 BPM 110): 砂漠隊商+ヴィル&サハナ → s1c7 は **対立から融合** の構造で差別化
  - prism-frost (s1c4 BPM 112): 凍土+空挺+龍帝の威厳 → s1c7 は **共観の融合** で差別化 (frost は王/帝の単極威風)
  - prism-blackmoon (s1c5 BPM 138): 黒月+二重月対峙+silver flute vs void choir → s1c7 は **三層+融合** で発展 (blackmoon は対峙の劇性、 voidrad は対峙→融合→静謐)
  - prism-promise (s1c6 BPM 118): 七座満つる+セラフィエル静謐 → s1c7 は **戦闘層の規模感** で差別化
- 派閥 BGM (faction_voidtower、 BPM 100 千年閉じ込められた静謐) との差別化:
  - faction_voidtower: voidtower 派閥外面、 千年の幽閉、 暗く荘厳、 単極のおどろおどろしさ
  - chapter_s1c7 (voidrad): 三層動的、 戦闘+神聖+静謐、 二元論を超える融合
  - 楽器面: 派閥 = 低弦 + pipe organ + void choir 単極 / 章 = 三層の楽器変化 (戦闘=brass+timpani / 神聖=二極 choir 融合 / 静謐=piano+harp)
  - ムード面: 派閥 = 千年閉じ込められた静謐 (時間が止まった印象) / 章 = 動的展開 (時間が動き続け、 最終的に新たな大紀へ)
- 三層構造の意義: Season 1 全体の伏線回収 (s1c1 プリズマ覚醒 → s1c5 影と共生 → s1c6 七座満つる → s1c7 共観の融合 → S2 接続の時代) を一曲で表現

## 生成手順

1. 上記 v1 Style プロンプトを Suno AI に貼付 → Lyrics 欄に `[Instrumental]` → 生成 (4:00 instrumental、 vocalize は Style 側で指示済)
2. 三層構造が明確に分かれているか確認 (戦闘層 → 神聖層 → 静謐層 で楽器・テンポ・ムードが切り替わる必要)、 単調な戦闘曲やアンビエントだけにならぬよう注意
3. 気に入ったテイクを採用版に
4. mp3 ダウンロード → `~/Box/.../prismaera/media/audio/bgm/prism-voidrad.mp3` に保存
5. Claude:
   - work へ cp + duration 計測 (`bash scripts/measure_bgm.sh`)
   - `script.js` BGM_LIST に新エントリ追加: `{ id: 'voidrad', label: '第7章テーマ', desc: 'Prism Voidrad (虚意の慟哭)', category: 'chapter', duration: 'mm:ss', file: '/media/audio/bgm/prism-voidrad.mp3' }`
   - `sw.js` PRECACHE_BGM 配列に `'/media/audio/bgm/prism-voidrad.mp3'` 追加 + コメント `// S1C7 章テーマ`
   - cache buster bump → dev push (pre-push hook で Box auto-sync)

## 関連 memory / ルール

- `feedback_bgm_uptempo.md`: 章 BGM もアップテンポ既定 (野沢さん指示 2026-04-28)、 三層構造でも基調は速め (BPM 145)
- ルール7-13 (章 BGM 必須): s1c7 公開前に本ファイル + mp3 + sw.js PRECACHE 必須
- ルール7-46 (BGM Style 3000字上限): 本プロンプトは Style 約 2700 字、 上限内
- 三層構造のリスク: Suno AI が三層を一曲にまとめられない場合は、 短時間版 (戦闘層メイン 2:30) + 長時間版 (フル 4:00) の二段生成を検討
- 既存 prism-blackmoon (s1c5) の二極構造の発展形として、 voidrad は三極融合構造 (二極 → 共観の灰)
