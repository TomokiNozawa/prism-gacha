# S1C1 場所画像 プロンプト集

S1C1「序 — 七座の使命」の場所画像。 GPT(DALL-E 3)向け英語プロンプト。

> **🎯 引き継ぎ規約 (重要、 全章共通)**
>
> 各画像セクション冒頭に必ず以下のメタデータを記載:
>
> - **対応シーン**: ストーリー上の章節 (例: `1-3 剣術科 朝練`)
> - **本文行**: `STORY/s1c1.md` の該当行 + 直接引用フレーズ
> - **役割**: 背景画像 (LOCATION_CONFIG) / 本文インライン挿絵 (STORY_LOCATION_INLINE_CONFIG)
> - **被写体**: 画像実物に何が描かれているか
> - **ストーリー全体との整合**: S3C7 までの伏線・テーマとの繋がり
> - **比率**: 背景=9:16 縦長 / 挿絵=16:9 横長 (野沢方針 2026-04-30 確定)
> - **コード参照**: 実装後に追記
> - **添付画像**: ChatGPT に手動添付するキャラリファレンス (LR/UR/SSR/SR/R から)
>
> **コピペ完結**: 各 ``` ブロックをそのまま ChatGPT (DALL-E 3) に貼り付け → 画像生成 → `images/locations/s1c1/{ファイル名}.png` に保存

---

## S1C1 概要 (outline.md より)

- **POV**: 鈴宮ちさと (星霊学院 剣術科 一年生)
- **規模**: 30キャラ (Season 1 基盤)
- **山場**: ちさとが初めて自分の虹脈に気づく — 涙ながらの覚醒シーン
- **テーマ**: 誰もが原虹の一筋を持つ。 世界はあなたから始まる
- **Season跨ぎ伏線**: プリズマの「眠りに入る」 予兆 → S1C7 黒月決戦

---

# 背景画像 (8シーン、 9:16 縦長)

## 【1】academy_morning.png — 1-1 学院の朝

- **対応シーン**: 1-1 寮の二段ベッド (シーン全体の背景、 学院全景で代表)
- **本文行**: `STORY/s1c1.md` l.34〜「朝の鐘が、 遠く塔の方から響いてくる」 / l.61〜「虹色のきらめきが、 遠い空を流れていく」 「それは星霊学院の朝の見慣れた景色」
- **役割**: 背景画像 (LOCATION_CONFIG['s1c1']['1-1'])、 9:16 縦長
- **被写体**: 星霊学院の全景。 朝、 高い塔・寮・学舎が縦に伸び、 七色の原虹光が雲の隙間から地上に降り注ぐ。 平和な日常の象徴。 **キャラなし** (純風景)
- **ストーリー全体との整合**: 平穏な学院の朝 = 後の影喰い襲来との対比軸。 七色の光は原虹七色の象徴 (S1C7 まで一貫テーマ)。 ちさとが「特別」 になる前の世界

```
A breathtaking vertical view of a fantasy academy at dawn, named Seirei Gakuin (Star Spirit Academy).
Towering stone-and-ivy spires rise dramatically in the center of the composition,
their pointed roofs piercing the dawn sky. Adjacent dormitory buildings and lecture halls
spread to either side at the base, with arched windows softly glowing from within.
The upper sky is filled with the seven prismatic colors of the genso (primal rainbow) —
red, orange, yellow, green, blue, indigo, violet — gently flowing like ribbons of light
through high-altitude clouds, descending toward the earth as soft rainbow streams.
Morning mist clings to the lower courtyards, dew sparkles on stone paths.
A great central bell tower rises tallest of all, its ancient bell catching the first sunlight.
No featured human characters — pure environmental establishing shot of the peaceful daily morning.
Anime fantasy illustration style, serene and hopeful atmosphere,
soft pastel rainbow palette in the upper sky transitioning to warm amber at the horizon.
Tall vertical composition emphasizing height: foreground courtyard → midground dormitories → upper spires → rainbow sky.
Aspect ratio 9:16, high detail.
```

---

## 【2】training_ground.png — 1-3 剣術科 朝練

- **対応シーン**: 1-3 剣術科 朝練 (ちさとの無力感)
- **本文行**: `STORY/s1c1.md` l.116〜「朝食の後、 ちさとは剣術科の練習場へ向かった」 / l.140「藁束はびくともしなかった」 / l.153「私だけ、 本当に、 何の才能もないんだ」
- **役割**: 背景画像 (LOCATION_CONFIG['s1c1']['1-3'])、 9:16 縦長
- **被写体**: 学院の練習場、 並ぶ藁束、 ちさと (POV、 後ろ姿で木剣を構える)、 同級生達が遠景
- **ストーリー全体との整合**: ちさとの無力感の象徴 → 後の覚醒 (3-2) との対比。 朝練の厳粛な空気が「ちさとの居場所のなさ」 を強調

> **添付画像**: `images/characters/season1/r/student.png` (ちさと R、 後ろ姿で木剣を構える)

```
A vertical view of a fantasy academy training ground at morning.
Tall straw target dummies (warabataba) stand in a row in the foreground,
each bound with thick rope, weathered from countless practice strikes.
A young female academy student in cadet uniform matching the reference image —
chestnut short hair, white-and-blue training tunic, holding a wooden practice sword (bokken) —
stands in the center foreground, seen from behind, shoulders slightly slumped,
gripping the bokken with both hands. Behind her, in the midground, other older cadets
practice in disciplined rows with crisp focused movements. Beyond, the academy's stone
walls and arches rise vertically into the upper portion of the frame, soft morning light
filtering down. Dust motes drift in the early sunbeams. The atmosphere conveys quiet
inadequacy — the protagonist alone in an environment of competence she cannot match.
Anime fantasy illustration style, muted earth tones (straw beige, weathered wood,
dusty cobblestone gray) accented with soft morning gold from the upper sky.
Tall vertical composition: foreground straw targets → midground student → upper academy walls and sky.
Aspect ratio 9:16, high detail.
```

---

## 【3】rooftop_omen.png — 1-4 屋上の昼休み (影喰い予兆)

- **対応シーン**: 1-4 屋上の昼休み (五人の絆 + 影喰い予兆)
- **本文行**: `STORY/s1c1.md` l.157〜「学院の屋上は、 星霊学院の生徒たちにとっては『秘密基地』」 / l.211〜「さっきまで虹色だった空が、 わずかに灰色がかっていた」 / l.215「虹脈の流れが、 乱れてる」
- **役割**: 背景画像 (LOCATION_CONFIG['s1c1']['1-4'])、 9:16 縦長
- **被写体**: 学院屋上、 五人 (ちさと/カイ/アルス/ミレイア/こはね) が柵に並んで空を見上げる後ろ姿、 空に異変 (虹色光が灰色に侵食され始める)
- **ストーリー全体との整合**: 平穏の終焉 → 影喰い襲来直前。 七色光が灰色に侵食される視覚で「黒月の前兆」 (S1C5/C7) と同じ世界の歪みを伏線として描く

> **添付画像 5枚**:
> - `images/characters/season1/r/student.png` (ちさと R)
> - `images/characters/season1/r/boy_scout.png` (カイ R)
> - `images/characters/season1/r/young_mage.png` (アルス R)
> - `images/characters/season1/r/warrior.png` (ミレイア R)
> - `images/characters/season1/r/fox_girl.png` (こはね R)

```
A vertical view of an academy rooftop at midday, with five young academy cadets standing
in a row at the railing, all seen from behind, gazing up at the sky.
Foreground: a stone-tiled rooftop with a low iron railing.
Five cadets matching the five reference images stand shoulder-to-shoulder facing the sky:
a chestnut-haired girl with practice sword, a blue-haired boy with bow, a glasses-wearing
boy with a tome, a tall braided-hair girl with shield, and a small silver-haired fox-eared girl.
The most striking element fills the upper portion of the frame: the sky is in transition.
The right side still glows with the prismatic seven-color genso light flowing through clouds,
but the left side is already turning ashen gray, with sickly dark filaments curling between
the rainbow streams — a wrongness slowly creeping in. Distant clouds churn unnaturally.
Open lunchboxes (bento) sit forgotten on the railing.
The atmosphere is one of suspended dread — friends together at a beautiful place,
just realizing something is wrong with the world.
Anime fantasy illustration style, contrast between vivid prismatic right-sky and oppressive
ash-gray left-sky, dramatic vertical composition.
Tall vertical composition: rooftop foreground → five protagonists midground → vast disturbed sky upper.
Aspect ratio 9:16, high detail.
```

---

## 【4】izabel_descent.png — 2-3 白い光 (イザベル降臨)

- **対応シーン**: 2-3 白い光 (大人キャラ救援の象徴)
- **本文行**: `STORY/s1c1.md` l.345〜「空から、 白い光が、 流星のように降ってきた」 / l.348〜「銀色に輝く鎧、 背中から伸びる六枚の白い翼、 そして手には聖槍」
- **役割**: 背景画像 (LOCATION_CONFIG['s1c1']['2-3'])、 9:16 縦長
- **被写体**: イザベル SSR降臨、 銀色鎧+六枚の白翼+聖槍『天穹』、 流星のように空から降りる、 ちさと達の前に立つ
- **ストーリー全体との整合**: 観測者セラフィエル代理としての聖巫騎士。 後の S1C2 で「自分自身として祈る」 覚醒へ繋がる出発点。 六翼は白焔教会のシンボル (S1C7 黒月決戦でも継承)

> **添付画像**: `images/characters/season1/ssr/paladin_lady.png` (イザベル SSR)

```
A vertical dramatic descent shot. From the upper third of the frame, a brilliant column
of white-gold light streaks downward like a meteor through clouds, parting them.
At the center of the composition, a female holy paladin matching the reference image
descends gracefully — silver-white-gold ornate plate armor with intricate engravings,
six majestic white feathered wings spread wide behind her, golden hair flowing in
the descent wind, eyes closed in serene composure, gripping a long silver lance (Tenkyu)
that gleams with holy light. Cherub-like motes of gold light orbit her form.
Below her, in the lower portion of the frame, a small group of academy cadets gaze up
in awe, partially silhouetted against the brightness — they are tiny in scale compared
to the descending angelic figure, emphasizing her divine intervention. Distant black
shadow creatures recede in the dim background, repelled by the holy light.
The sky cracks open with prismatic rays where she descends.
Anime fantasy illustration style, divine and ascendant atmosphere,
brilliant white-gold-rainbow light against dark battlefield smoke.
Tall vertical composition: cadets below → descending paladin midframe → exploding heavenly light upper.
Aspect ratio 9:16, high detail.
```

---

## 【5】rift_emergence.png — 2-6 裂け目

- **対応シーン**: 2-6 裂け目 (影喰い大量湧出、 大人キャラ突入)
- **本文行**: `STORY/s1c1.md` l.487〜「戦線の中央、 地面が割れ始めた」 「空間そのものが裂けていく」 / l.490「紫色の、 不気味な光が、 その裂け目から漏れ出る」
- **役割**: 背景画像 (LOCATION_CONFIG['s1c1']['2-6'])、 9:16 縦長
- **被写体**: 学院近郊の平原、 中央に紫色の不気味な縦長の裂け目、 黒い影喰いが大量に這い出る、 大人キャラ達 (イザベル/朱音/ヴィル/ガルド) が遠景で武器を構える
- **ストーリー全体との整合**: S1C7 黒月決戦の「裂け目」 構図と同型 = ストーリー全体で繰り返される「世界の歪み」 の最初の出現。 紫色の光は「黒月」 のテーマカラー伏線

> **添付画像 4枚 (主役勢揃い、 後ろ姿シルエット)**:
> - `images/characters/season1/ssr/paladin_lady.png` (イザベル SSR)
> - `images/characters/season1/ssr/kitsune_lady.png` (朱音 SSR)
> - `images/characters/season1/ssr/draco_lancer.png` (ヴィル SSR)
> - `images/characters/season1/ssr/wolf_warrior.png` (ガルド SSR)

```
A vertical apocalyptic battlefield view. Center frame: a tall, vertical, jagged tear
in space-time runs from the ground up into the sky like a wound in reality, glowing with
sickly violet-purple light, edges crackling with dark energy. From the rift, dozens of
shadow creatures crawl, leap, and emerge — twisted black silhouettes
with red glowing eyes, varied in size from small to enormous. The land around the rift
is a flat plain near an academy, churned and scorched. In the lower portion of the frame,
several legendary warriors are silhouetted from behind, charging toward the rift in
formation: a holy paladin with raised silver lance matching the first reference image,
a kitsune dancer with golden flame fans matching the second reference image, a dragon
princess with violet spear matching the third reference image, and a wolf warrior with
massive axe matching the fourth reference image. Their forms are heroic against the
violet-black abyss of the rift. The sky above is bruised purple-black, cracked and unnatural.
Anime fantasy illustration style, oppressive dark fantasy atmosphere with sickly violet
contrast, dramatic vertical composition emphasizing the towering rift.
Tall vertical composition: heroes below → rift midframe → corrupted sky upper.
Aspect ratio 9:16, high detail.
```

---

## 【6】chisato_awakening.png — 3-2 ちさと覚醒 (山場)

- **対応シーン**: 3-2 心の中で何かが熱くなる (S1C1 クライマックス、 ちさと虹脈覚醒)
- **本文行**: `STORY/s1c1.md` l.597〜「胸の奥で、 何かが熱くなった」 / l.607〜「体の中から、 虹色の光が、 脈打つように溢れてきた。 木剣に、 その光が伝わっていく」 / l.628「虹色の光が、 影喰いの体を貫いた」 / l.656「七色、 ぜんぶ、 混ざってるみたい」
- **役割**: 背景画像 (LOCATION_CONFIG['s1c1']['3-2'])、 9:16 縦長
- **被写体**: ちさと (R)、 涙、 胸から虹色の光が脈打つ、 木剣が虹色に輝く、 周囲の暗い影喰いが薄れていく、 倒れた仲間達
- **ストーリー全体との整合**: ちさとの虹脈は「七色全部混ざる」 = プリズマの一部 (3-3 で言及) = S1C7 黒月決戦でプリズマ意志を継承する伏線。 涙の覚醒は S1C2 イザベルの「自分自身として」 と並ぶ Season1 の覚醒テーマ

> **添付画像**: `images/characters/season1/r/student.png` (ちさと R、 ベース立ち絵)

```
A vertical climactic awakening scene at the dim edge of a battlefield.
Center frame: a young female academy cadet matching the reference image —
chestnut short hair, white-and-blue cadet uniform, tears streaming down her cheeks —
stands with eyes wide open, gripping a wooden practice sword (bokken) raised slightly
forward. From her chest, a brilliant prismatic seven-color light pulses outward in
expanding rings, all seven hues of the genso (red, orange, yellow, green, blue, indigo,
violet) swirling together into a single iridescent radiance — a color seen nowhere
else in the world. The bokken in her hands is engulfed in the same rainbow light,
no longer wood but a blade of pure prismatic radiance. Around her, twisted black
shadow creatures dissolve into motes of color, retreating from the light. In the lower
foreground, her four fallen friends lie defeated but safe, partially illuminated by
the rainbow glow. Her tears reflect the seven colors. The sky above is dark with battle
smoke, but the rainbow light from her chest is piercing it upward.
Anime fantasy illustration style, transcendent and tearful atmosphere,
contrast of overwhelming prismatic warmth against the dark battlefield.
Tall vertical composition: fallen friends foreground → awakening protagonist midframe → rainbow light pillar upper.
Aspect ratio 9:16, high detail.
```

---

## 【7】prisma_descent.png — 3-3 虹色の人 (プリズマ降臨)

- **対応シーン**: 3-3 虹色の人 (プリズマ初登場、 「次の世代に託す」 物語の核心)
- **本文行**: `STORY/s1c1.md` l.668〜「目の前の空気が、 ゆっくりと、 虹色に染まり始めた」 / l.677〜「銀色の長い髪が、 肩から流れ落ちている」 「結晶のような長衣を纏い」 / l.708〜「目が、 ようやく開いた。 その目は、 虹色だった」 / l.711「私は、 もうすぐ眠る。 次の大紀のために」
- **役割**: 背景画像 (LOCATION_CONFIG['s1c1']['3-3'])、 9:16 縦長
- **被写体**: プリズマ LR、 中央に立つ、 銀髪・両性的な姿・結晶長衣・足元から虹色の光が立ち上る・虹色の目、 ちさと達が膝をつく
- **ストーリー全体との整合**: プリズマの「眠りに入る予兆」 → S1C7 黒月決戦で正式に封印に入る伏線。 ちさとの虹脈に「私は生きている」 と告げる = ちさとは将来プリズマの代理になる可能性 (S2/S3 への繋ぎ)

> **添付画像**: `images/characters/season1/lr/prisma.png` (プリズマ LR)

```
A vertical sacred apparition scene at twilight on a battlefield's edge.
Center frame: a tall androgynous celestial figure matching the reference image stands
gracefully — long flowing silver hair cascading from shoulders, eyes initially closed
in serene contemplation, body draped in crystalline translucent robes that refract
the seven prismatic colors. Beneath the figure's feet, a column of seven-color rainbow
light rises like a pillar from the earth, surrounding their form in a corona of pure
prismatic radiance. The figure's eyes, just beginning to open, reveal irises that contain
the entire rainbow — a color beyond color. Their expression is gentle, knowing, slightly
sorrowful — the look of someone preparing for a long sleep. Around them, the air itself
is dyed in soft rainbow hues, particles of light drifting like fireflies. In the lower
foreground, a small group of academy cadets kneel reverently, looking up in awe at this
divine being. The sky in the upper frame transitions from twilight indigo to soft
rainbow gradient at the horizon — a sunset that feels like both an ending and a beginning.
Anime fantasy illustration style, transcendent divine atmosphere, soft prismatic
luminance against deep twilight indigo, ethereal and reverent mood.
Tall vertical composition: kneeling cadets foreground → Prisma's apparition midframe → twilight rainbow sky upper.
Aspect ratio 9:16, high detail.
```

---

## 【8】rooftop_dawn.png — 4-2 屋上で (新しい朝、 章の余韻)

- **対応シーン**: 4-2 屋上で (覚醒後数日、 五人の日常への帰還)
- **本文行**: `STORY/s1c1.md` l.864〜「朝練の後、 五人は屋上に集まった」 / l.868「弁当を広げて、 皆で食べる」 / l.903「ちさとは空を見上げた。 朝の虹色の光が、 いつもと変わらず、 空を流れていた」 / l.906「今のちさとには、 その光の中に、 確かに、 自分の色も混じっているのが分かった」
- **役割**: 背景画像 (LOCATION_CONFIG['s1c1']['4-2'])、 9:16 縦長
- **被写体**: 学院屋上、 朝〜昼、 五人 (ちさと/カイ/アルス/ミレイア/こはね) が弁当を広げて笑顔、 空に虹色の光がいつも通り流れる、 ちさとが空を見上げる
- **ストーリー全体との整合**: 1-4 (灰色がかった空) との対比 = 「世界は元に戻った、 でもちさとの目は変わった」。 五人の絆が S1C7 まで続く Season1 ベースの確認。 「自分の色も混じっている」 = 七色を見つめる新しい目 (3-3 プリズマの言葉「観るのだ」 の実践開始)

> **添付画像 5枚**:
> - `images/characters/season1/r/student.png` (ちさと R)
> - `images/characters/season1/r/boy_scout.png` (カイ R)
> - `images/characters/season1/r/young_mage.png` (アルス R)
> - `images/characters/season1/r/warrior.png` (ミレイア R)
> - `images/characters/season1/r/fox_girl.png` (こはね R)

```
A vertical peaceful daily-life scene at an academy rooftop at midday, several days after
the great battle. Lower foreground: five cadets matching the reference images sit in a
casual circle on the rooftop tiles, lunchboxes (bento) open, sharing food and laughter.
The protagonist (chestnut-haired girl) sits slightly apart, looking up toward the sky
with an expression of quiet wonder — eyes that have seen things the others have not yet.
Beside her, the blue-haired bow boy laughs at something, the glasses-wearing mage boy
gestures with chopsticks mid-explanation, the tall braided-hair girl shares a smile,
the small silver-haired fox-eared girl listens attentively. The atmosphere is warm,
restored, friendly — a return to ordinary life with a quiet undercurrent of changed perspective.
Upper frame: the sky flows with the seven prismatic genso colors, calm and undisturbed,
the way it was before the attack — but now, looking carefully into the rainbow, one might
see a single subtle thread of mixed-prismatic light (the protagonist's awakened color)
woven among the others. Iron railing, scattered cherry blossom petals on the tiles.
Anime fantasy illustration style, gentle hopeful atmosphere, warm midday gold mixed
with prismatic sky, sense of peaceful continuation after great trial.
Tall vertical composition: five friends foreground (intimate circle) → rooftop midframe → vast prismatic sky upper.
Aspect ratio 9:16, high detail.
```

---

# 本文インライン挿絵 (5シーン、 16:9 横長)

S1C2 と同方針: 背景に出ない「ピンポイントで引きがある場面」 を挿絵化。 縦スクロール本文の中で 16:9 横長カットインとして配置。

## 【9】breakfast_table.png — 1-2 食堂 (日常の和やかさ)

- **対応シーン**: 1-2 食堂 (五人の朝食、 日常感)
- **本文行**: `STORY/s1c1.md` l.71〜「学院の食堂は、 すでに賑わっていた」 / l.100「カイが頬を赤くしながら、 ちさとに皿をすっと差し出した」 / l.102「これ、 卵焼き多めにとっておいたから」
- **役割**: 本文インライン挿絵 (1-2 シーン中盤、 marker候補: 「卵焼き多めにとっておいたから」)、 16:9 横長
- **被写体**: 学院食堂の長テーブル、 五人 (ちさと/カイ/アルス/ミレイア/こはね) が食事、 カイがちさとに皿を差し出す瞬間、 アルスが本を読みながら、 こはねが小さく笑う
- **ストーリー全体との整合**: 平和な日常の和やかさ → 後の戦闘との対比軸。 五人の絆が S1C7 まで続く Season1 ベースの確認場面

> **添付画像 5枚**: `r/student.png` (ちさと) / `r/boy_scout.png` (カイ) / `r/young_mage.png` (アルス) / `r/warrior.png` (ミレイア) / `r/fox_girl.png` (こはね)

```
A horizontal warm scene at a fantasy academy dining hall in the morning.
A long wooden communal table extends across the frame with steaming bowls of soup,
golden tamagoyaki (rolled omelet), bread baskets, and tea cups. Five young academy
cadets sit together: a chestnut-haired girl matching the first reference image (center-left),
a blue-haired boy matching the second reference image (beside her, blushing slightly,
extending a plate of tamagoyaki toward her), a glasses-wearing boy matching the third
reference image (further along, reading a thick tome with one hand while eating with
the other), a tall braided-hair girl matching the fourth reference image (smiling
warmly), and a small silver-haired fox-eared girl matching the fifth reference image
(quietly giggling at the boy's blush). Other students fill the background tables.
Tall arched windows let in golden morning light, casting warm beams across the polished
wood. Steam rises gently from the soup bowls.
The atmosphere is warm, ordinary, friendly — the comfort of daily routine before
the world changes.
Anime fantasy illustration style, soft warm golden tones with hints of academy navy-blue
uniforms, hopeful and intimate mood.
Wide horizontal cinematic shot capturing the full table and all five characters.
Aspect ratio 16:9, high detail.
```

---

## 【10】akane_hinata_arrival.png — 2-4 朱音とひなた合流 (派手な大人合流)

- **対応シーン**: 2-4 朱音とひなた (派閥合流の演出、 紅蓮の炎+桜花)
- **本文行**: `STORY/s1c1.md` l.410〜「東の空から、 紅蓮の炎が舞い上がった。 それは、 ただの炎ではなかった。 炎が、 踊るように、 人の形を取って、 地上へ降りてきた」 / l.427「桜の花弁を散らしながら、 もう一人の影が降りてきた」
- **役割**: 本文インライン挿絵 (2-4 シーン冒頭、 marker候補: 「紅蓮の炎が舞い上がった」)、 16:9 横長
- **被写体**: 朱音 (SSR、 紅い唇・黒髪・片肌脱ぎ着物・両手の金扇から燃える炎) が紅蓮の炎で空から降臨、 横にひなた (SSR、 桜色ツインテール・小太刀) が桜花の花弁を散らしながら降臨
- **ストーリー全体との整合**: 夜焔郷+紅翼皇家の合流 = 後の S1C2 (海淵都市/紅玉海賊団) や S1C4 (氷霊王国/空挺城) と並ぶ Season1 派閥参戦の最初の演出

> **添付画像 2枚**: `ssr/kitsune_lady.png` (朱音 SSR) / `ssr/little_sister.png` (ひなた SSR)

> **⚠️ 再生成 (2026-05-01)**: 既存版 (akane_hinata_arrival.png) は ひなたの右手指が解剖学的に崩壊していたため再生成必要。 下記プロンプトで上書き生成してください。

```
A horizontal dramatic arrival scene of two legendary warriors descending from the sky
to a battlefield. On the left side: a stunning kitsune dancer matching the first reference
image — black flowing hair pinned with golden ornaments, one shoulder of her ornate
red-and-gold kimono slipped down, bare shoulder, golden mischievous eyes, holding two
golden fans (kingyu) trailing crimson flames that swirl into a fox-shaped silhouette
behind her. She lands gracefully, scattering crimson sparks.
On the right side: a smaller young swordmistress matching the second reference image —
cherry-blossom pink twin-tails, kimono-styled cadet outfit, drawing a short tachi (kotachi)
named Sakurachirashi. She descends through a flurry of pink cherry blossom petals that
swirl around her like a snowstorm. Her expression is bright and eager.
Between them in the air, the two energies — crimson flame and pink petals — intertwine
beautifully. In the background, a battlefield with churned earth and distant academy
towers, sky bruised purple-black from earlier conflict, but their arrival is a brilliant
cut of vivid color through the dimness.
Anime fantasy illustration style, opulent and theatrical atmosphere,
crimson + pink palette against a darker battlefield background, dynamic dual-character composition.
Wide cinematic horizontal shot with both characters fully visible.

CRITICAL ANATOMY REQUIREMENTS: Both characters must have anatomically correct human hands
with exactly five distinct, well-formed fingers per hand (no extra fingers, no fused fingers,
no missing fingers). Both arms must be in natural human poses with proper joint angles.
The kitsune dancer's hands grip the two golden fans firmly with all five fingers visible
and clearly defined. The young swordmistress's hands grip the short tachi hilt with both
hands, all five fingers per hand correctly proportioned and positioned. Avoid any
anatomical distortion of hands, fingers, or arms.

Aspect ratio 16:9, high detail.

-----
元画像から表情や姿勢は変わってOKです
```

---

## 【11】garudo_vill_arrival.png — 2-5 ガルドとヴィル合流 (重厚な大人合流)

- **対応シーン**: 2-5 ガルドとヴィル (派閥合流第二陣)
- **本文行**: `STORY/s1c1.md` l.462〜「地響きのように、 もう一人がやってきた」 「獣牙ガルド。 月牙狼族の戦士団長。 両手で抱える大きな斧、 剥き出しの上半身、 狼の耳と尾」 / l.472「紫色の槍を構えた女性」 「竜爵ヴィル、 紫竜王国の第三王女」
- **役割**: 本文インライン挿絵 (2-5 シーン中盤、 marker候補: 「紫色の槍を構えた女性」)、 16:9 横長
- **被写体**: ガルド (SSR、 月牙狼族戦士団長・両手大斧・狼の耳と尾・剥き出しの上半身) と ヴィル (SSR、 紫竜王国第三王女・紫色の槍『紫雷』・竜気) が並んで戦場に立つ
- **ストーリー全体との整合**: 月牙狼族+紫竜王国の合流 = S1C3 (古龍砂漠) や S1C4 (氷霊王国) でヴィルが活躍する伏線

> **添付画像 2枚**: `ssr/wolf_warrior.png` (ガルド SSR) / `ssr/draco_lancer.png` (ヴィル SSR)

```
A horizontal heavy-impact arrival scene of two warrior champions on a battlefield.
On the left side: a wolf-tribe warrior chieftain matching the first reference image —
muscular bare-chested with wolf ears and a wolf tail, gripping a massive double-bladed
axe (Tsukiba) over his shoulder, weather-beaten skin, wild silver-gray hair, fierce
amber eyes. The ground is cracked beneath his heavy stance.
On the right side: a dragon princess matching the second reference image — long flowing
violet hair, regal armored dress in royal purple and silver, holding a long ornate
spear (Shiraii) crackling with violet dragon-energy lightning. Subtle dragon scales
gleam on her arms, two small horn-like protrusions visible above her temples.
Between them, the air shimmers with their combined presence — heavy axe-stance vs
elegant spear-grace, two opposing styles that have come together for a common cause.
Distant battlefield with shadow creatures retreating, smoke and dust in the air.
The composition emphasizes the weight and gravitas of veteran warriors arriving.
Anime fantasy illustration style, heavy heroic atmosphere,
earth-brown wolf warrior + royal violet dragon princess color contrast,
dynamic dual-character pose, cinematic battlefield backdrop.
Wide cinematic horizontal shot with both characters and surrounding battlefield visible.
Aspect ratio 16:9, high detail.
```

---

## 【12】rift_seal.png — 3-4 戦いの終わり (裂け目閉じ、 章の戦闘クライマックス締め)

- **対応シーン**: 3-4 戦いの終わり (大人達の合流戦闘+裂け目閉じる瞬間)
- **本文行**: `STORY/s1c1.md` l.754〜「戦場中央の方で、 大きな閃光が走った。 裂け目が閉じる音だった」 / l.757〜「朱音の炎、 イザベルの聖槍、 ヴィルの槍、 ガルドの斧、 ひなたの小太刀、 シンの闇刃。 すべてが合わさって、 裂け目を縫い合わせた」
- **役割**: 本文インライン挿絵 (3-4 シーン冒頭、 marker候補: 「裂け目が閉じる音だった」)、 16:9 横長
- **被写体**: 戦場中央、 大人キャラ6人 (イザベル/朱音/ヴィル/ガルド/ひなた/シン) の武器の光が交差して紫色の裂け目を縫い合わせる、 大閃光、 七色光が裂け目から噴出
- **ストーリー全体との整合**: S1C7 黒月決戦の集合戦闘の予兆 (大人達の連携、 七座未満キャラの最大協力)。 S1C2 イザベル覚醒、 S1C5 シオン分離など各章の派閥代表が同時に活躍する形

> **添付画像 6枚**:
> - `ssr/paladin_lady.png` (イザベル)
> - `ssr/kitsune_lady.png` (朱音)
> - `ssr/draco_lancer.png` (ヴィル)
> - `ssr/wolf_warrior.png` (ガルド)
> - `ssr/little_sister.png` (ひなた)
> - `sr/shadow_ninja.png` (シン)

```
A horizontal climactic battlefield moment of multiple legendary warriors sealing a
violet rift in space-time with combined attacks. Center frame: a tall jagged violet
rift in reality, but it is being stitched closed by criss-crossing beams of brilliant
light from six heroes positioned around it. The combined attacks form an X-shaped
star pattern of holy and elemental light at the rift's center, exploding in a rainbow
flash as it seals. Each hero is captured mid-strike from a different angle:
a holy paladin matching the first reference image (silver lance with white-gold light)
from upper left, a kitsune dancer matching the second reference image (golden fans
with crimson flame) from upper right, a dragon princess matching the third reference
image (violet lightning spear) from lower left, a wolf warrior matching the fourth
reference image (massive axe with earth-shockwave) from lower right, a small swordmistress
matching the fifth reference image (pink-cherry-blossom kotachi) from middle left,
a shadow ninja matching the sixth reference image (dark double-blade) from middle right.
Their attacks converge at the rift, which is collapsing inward in a brilliant rainbow
flash. Battlefield smoke and shadow creature ash swirl around. The sky above shows
a final purple wound healing into normal twilight indigo.
Anime fantasy illustration style, climactic team-attack atmosphere with multi-elemental
light convergence, dynamic radial composition, sense of victory through unity.
Wide cinematic horizontal shot showing the rift center and all six heroes simultaneously.
Aspect ratio 16:9, high detail.
```

---

## 【13】prisma_twilight.png — エピローグ プリズマの黄昏 (章の締め)

- **対応シーン**: エピローグ プリズマの黄昏 (章の最終小節、 プリズマが眠りに入る予兆)
- **本文行**: `STORY/s1c1.md` l.974〜「原虹の最も深い場所、 誰も訪れたことのない世界の中心で、 プリズマは、 静かに目を閉じていた」 / l.984「プリズマの体が、 結晶のように、 虹色の塵となって舞い上がる」 / l.990「その光は、 確かに、 世界中に降り注いだ」
- **役割**: 本文インライン挿絵 (エピローグ最終、 marker候補: 「結晶のように、 虹色の塵となって舞い上がる」)、 16:9 横長
- **被写体**: 世界の中心、 プリズマ LR、 静かに目を閉じる、 体が結晶のように崩れ虹色の塵となって舞い上がり、 世界中に七色光が降り注ぐ俯瞰
- **ストーリー全体との整合**: S1C7 黒月決戦でのプリズマ封印 = 物語全体の終着点の予告。 「お前たちの中に、 私は生きている」 のテーマがちさとの覚醒 (3-2) と直接繋がる Season1 全体の締め

> **添付画像**: `lr/prisma.png` (プリズマ LR)

```
A horizontal cosmic-scale twilight scene at the deepest center of the prismatic world.
Center frame: the celestial androgynous figure matching the reference image —
long silver hair, eyes peacefully closed, draped in crystalline robes — stands at the
heart of an endless prismatic void, body beginning to dissolve elegantly into countless
floating crystal particles that catch and refract all seven rainbow colors. The particles
swirl outward in a vast spiral, traveling beyond the frame as if reaching the entire world.
Around the figure, the void is layered with twilight indigo gradients fading into pure
prismatic light at the horizons — a sunset that is both ending and continuation.
Wisps of seven-color genso ribbons stream outward from the figure toward distant lands,
carrying the dispersing essence to all of creation. The atmosphere is sacred, melancholy,
hopeful — the reverent goodbye of a divine being who is not truly dying, but transforming
and seeding the next era. No other characters in frame — Prisma alone with the cosmos.
Anime fantasy illustration style, transcendent cosmic atmosphere with delicate prismatic
particle effects, deep twilight indigo merged with all seven rainbow hues, ethereal
ascendant mood.
Wide cinematic horizontal shot with the center figure framed by vast prismatic void.
Aspect ratio 16:9, high detail.
```

---

## 場所画像なしシーン (CSSグラデのみ)

プロローグ / 1-2 食堂 / 2-1 退避路 / 2-2 戦闘 / 2-4 朱音とひなた / 2-5 ガルドとヴィル / 3-1 取り残された / 3-4 戦いの終わり / 4-1 数日後 / エピローグ4小節
→ 主要シーン (8枚) で章の流れを表現、 補助シーンは隣接背景の余韻で十分。 必要に応じて Phase 2 で挿絵 (16:9) 追加検討。

---

## 使い方メモ

- **コピペ完結**: 各 ``` ブロック内の英語プロンプトをそのまま ChatGPT (DALL-E 3) にコピペ → そのまま画像生成可能 (`Aspect ratio 9:16, high detail.` まで本文に含めてある、 追記不要)
- **比率方針 (野沢確定 2026-04-30)**: 背景画像 = 9:16 (縦長) 統一
- **添付画像 (キャラリファレンス)**: 各セクションの「添付画像」 欄記載のキャラ画像を ChatGPT に手動添付してから生成。 添付があると顔立ち・衣装が安定する
- **生成画像の保存先**: `/c/Users/t2262/prism-gacha-work/images/locations/s1c1/{ファイル名}.png`
- **サムネ化**: 生成完了後、 `images/locations/s1c1/{name}_thumb.webp` を Pillow Lanczos で自動生成 (Claude が生成スクリプト実行)
- 全プロンプトはアニメ風ファンタジー、 七色伏線を統一トーンとして散りばめる (S1C2 と同方針)

---

## 実装フロー (画像生成完了後、 Claude側作業)

1. ユーザー: ChatGPT で 8枚生成 → Box `claude/prismaera/images/locations/s1c1/` に保存
2. Claude: Box → git repo にコピー、 サムネ webp 生成 (8枚)
3. Claude: `script.js` の `LOCATION_CONFIG['s1c1']` に 8 entry 追加
4. Claude: dev push → 動作確認 → main マージ承認後リリース (v1.2.5)

## ストーリー全体伏線 (S1C1 → S2/S3 への繋ぎ)

- **七色光の侵食 (1-4 → 2-6)**: 黒月の前兆 (S1C5/C7) と同質の世界の歪み
- **裂け目 (2-6)**: S1C7 黒月決戦の同型構図、 紫=黒月のテーマカラー
- **ちさと七色覚醒 (3-2)**: プリズマの一部 → S1C7 でプリズマ意志継承の可能性
- **プリズマの「眠り予兆」 (3-3)**: S1C7 黒月決戦で正式に封印
- **五人の絆 (4-2)**: Season1 ベース、 S1C7 までずっと続く
- **大人キャラ救援 (2-3, 2-6)**: イザベル/朱音/ヴィル/ガルドが S1C2-S1C6 でそれぞれの章の主役へ
