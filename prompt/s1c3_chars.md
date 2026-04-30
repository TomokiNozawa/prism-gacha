# S1C3 キャラ画像 プロンプト集

S1C3「砂塵の隊商」 の新キャラ10体の画像生成プロンプト。 GPT (DALL-E 3) 向け英語プロンプト。

> **🎯 引き継ぎ規約**
> - **比率**: 単体立ち絵 = **3:4 縦長 (1024×1365)** で統一 (野沢方針 2026-05-01、 PC/モバイル両対応)
> - **添付画像**: 新規キャラのため キャラリファ添付 **なし** (純粋な新規生成)
> - **解剖学指示**: 人型キャラ全員に **CRITICAL ANATOMY REQUIREMENTS 必須** (DALL-E 3 の手指破綻事故対策)
> - **末尾文言**: 添付なしのため「元画像から〜」 は **不要**
> - **ファイル名**: `images/characters/season1/{tier}/{filename}.png` に保存
> - **生成後**: thumb webp 自動生成 (Claude が ffmpeg で対応)

---

## S1C3 概要 (outline.md より)

- **POV**: ヴィル (紫竜王国 第三王女、 既存 SSR)
- **規模**: 10体 (UR2 / SSR3 / SR3 / R2)
- **新派閥**: 古龍砂漠サハール (遊牧民+古龍末裔の混合)
- **テーマ**: 血ではなく、 共に過ごした時間が家族
- **山場**: ヴィル+サハナが夜空の星を見上げて、 それぞれの孤独を打ち明ける場面
- **Season跨ぎ伏線**:
  - 失われた古龍王 → S2 で覚醒予定
  - サハナ → S1C7 黒月決戦に再登場
  - ファラー → 観測者寄り (S1C7 / S2C4 記憶の海)

---

# 【1】砂海王女 サハナ (UR、 ヒロイン)

- **filename**: `desert_princess.png`
- **path**: `images/characters/season1/ur/desert_princess.png`
- **派閥**: 古龍砂漠サハール
- **役割**: 第3章ヒロイン、 砂漠遊牧民の若き王女、 風を操る戦士
- **性格**: 自由奔放、 親しみやすい、 内面に深い孤独 (両親を幼い頃に亡くし族長代理)
- **関係性**: ヴィルと「血ではない家族」 の関係 (s1c3 山場)、 グランは剣の師、 ティナは妹分
- **Season跨ぎ伏線**: S1C7 黒月決戦に七座級風使いとして再登場
- **武器**: 双風刀 (シャマール) — 二振りの曲剣、 振ると風が刃となる
- **外見**: 17-18歳、 浅黒い肌 (砂漠民の褐色)、 ライトブラウンの長い波打つ髪、 アンバー色の瞳、 民族風アクセサリー (額飾り・腕輪・耳飾り)、 砂漠民族衣装 (赤と金の刺繍が入ったゆったりしたチュニックとパンツ、 腰に絹の帯、 軽装の革ブーツ)、 両肩に砂風が螺旋を描く
- **比率**: 3:4 縦長 (単体立ち絵)
- **コード参照**: 実装後 POOL.UR に追加、 LOCATION_CONFIG['s1c3'] のシーンでも使用

```
A vertical 3:4 portrait of a young desert nomad princess named Sahana, full-body standing pose.
She is 17-18 years old, with sun-tanned dark-honey skin and long wavy light-brown hair flowing
in a desert wind, framed by golden ornaments and small gemstones. Her eyes are striking amber-gold,
intense yet warm. She wears traditional desert nomad attire: a flowing red-and-gold embroidered
tunic with a deep V-cut neckline, loose violet trousers tucked into soft leather boots, a silk
sash at her waist with hanging metal coins. Multiple bracelets on her arms, an ornate forehead
chain with a single small ruby. She holds two curved scimitar-style swords (Shamar twin blades),
one in each hand, the air around the blades swirling with visible wind currents flecked with
golden sand particles. Her stance is confident and graceful — slight forward lean, balanced,
ready for combat.
Behind her, a vast desert at golden hour: rolling dunes, distant ancient ruins half-buried
in sand, a sky transitioning from gold horizon to deep purple zenith with the seven prismatic
streams of the genso (red, orange, yellow, green, blue, indigo, violet) flowing softly through
the upper sky.

Anime fantasy illustration style, regal yet approachable atmosphere,
warm desert palette (gold, sand, deep red, warm brown) with violet sky accent.
Tall vertical composition emphasizing her height and the desert behind.

CRITICAL ANATOMY REQUIREMENTS: Anatomically correct human hands with exactly five distinct,
well-formed fingers per hand (no extra, no fused, no missing fingers). Both hands grip the
sword hilts firmly with all five fingers visible and properly positioned. Both arms in
natural human poses with proper joint angles. Avoid any anatomical distortion of hands,
fingers, or arms.

Aspect ratio 3:4, high detail.
```

---

# 【2】古龍の語り部 ファラー (UR、 伝承の番人)

- **filename**: `dragon_sage.png`
- **path**: `images/characters/season1/ur/dragon_sage.png`
- **派閥**: 古龍砂漠サハール
- **役割**: 古龍の末裔、 失われた古龍王の伝承を語る老女、 千年級の知恵
- **性格**: 静謐、 深く語る、 すべてを見透かすような目
- **関係性**: 観測者三柱 (カグヤ・ノクス・セラフィエル) と遠い縁、 千年前を覚えている
- **Season跨ぎ伏線**: S2 古龍王覚醒のキーパーソン、 S2C4 記憶の海 で再登場
- **武器**: 古龍杖 (ジナ) — 紫水晶を頂いた長杖、 古龍の鱗を埋め込んだ
- **外見**: 70-80代に見える老女 (実年齢不明、 数百年級)、 銀色の長い三つ編み、 深い紫の瞳、 浅黒い砂漠肌、 古代エジプト・ペルシャ混合の儀礼衣装 (深紫と金の長衣、 多層のショール、 古龍の鱗を縫い込んだベルト)、 額に古龍の刻印 (うろこ紋)
- **比率**: 3:4 縦長

```
A vertical 3:4 portrait of an ancient dragon-blooded sage named Fara, full-body standing pose.
She appears to be in her seventies but radiates a presence far older — perhaps centuries.
Her skin is sun-tanned dark-honey, weathered with fine lines around her wise eyes.
Long silver hair in a single thick braid that falls past her waist. Her eyes are deep
amethyst-violet, calm and seeing-through. She wears layered ceremonial robes blending
ancient Persian and Egyptian aesthetics: a deep-violet outer robe with gold embroidery of
dragon scales running along the hem and sleeves, a layered silk shawl over her shoulders,
a wide ornate belt embedded with iridescent dragon scales (small, real fragments of an
ancient dragon's hide). On her forehead, a small marking of the dragon scale-pattern
in faint gold luminescence (her bloodline mark). She holds a tall ceremonial staff named
Jhina, topped with a large faceted amethyst crystal that glows with deep violet inner light,
the staff's body wrapped with cords and small dragon scales. Her stance is dignified,
patient, with the staff slightly forward.
Behind her, an ancient stone temple courtyard at twilight: cracked carved pillars depicting
dragons, scattered ancient ruins, the sky deep amethyst-purple with the seven genso colors
faintly visible like distant constellations. A faint outline of a colossal dragon
silhouette is barely visible in the upper background, sleeping/dormant — the "lost dragon king".

Anime fantasy illustration style, mystical-ancient atmosphere, dignified solemn presence,
deep purple + gold + ancient stone palette, faint rainbow constellation overhead.
Tall vertical composition emphasizing her dignified verticality.

CRITICAL ANATOMY REQUIREMENTS: Anatomically correct human hands with exactly five distinct,
well-formed fingers per hand. Her hand grips the staff firmly with all five fingers visible.
Both arms in natural elderly human poses with proper joint angles, slightly relaxed.
Avoid any anatomical distortion.

Aspect ratio 3:4, high detail.
```

---

# 【3】隊商長 アーシャ (SSR、 商人指揮官)

- **filename**: `caravan_leader.png`
- **path**: `images/characters/season1/ssr/caravan_leader.png`
- **派閥**: 古龍砂漠サハール
- **役割**: 砂漠隊商の女商人指揮官、 サハナと旧知の頼れる姉貴分
- **性格**: 強気、 商売人気質、 義理堅い、 笑顔の裏で計算高い
- **武器**: 短剣 + 鞭 (商人としての護身、 駆け引き武器)
- **外見**: 30代後半女性、 浅黒い肌、 黒髪のショートポニーテール、 鋭い茶色の瞳、 商人風実用衣装 (深緑のキャラバンコート、 革ベルトに財布と短剣、 ターバン風頭巾)

```
A vertical 3:4 portrait of a desert caravan leader named Asha, full-body standing pose.
She is in her late thirties, dark-honey skin tanned from years of desert travel.
Black hair pulled into a short ponytail under a deep-green silk turban-headband, with
small golden coins dangling along the fabric edge. Her eyes are sharp brown, calculating yet
warm. She wears a practical desert merchant outfit: a deep-forest-green long traveler's coat
worn open over a tan tunic, leather belt with multiple pouches (coin purses, scrolls, a
short dagger sheathed at her hip), loose practical desert pants tucked into knee-high
leather boots. Multiple silver bracelets on one wrist, a single intricate ring on her thumb.
She holds a coiled leather whip in one hand (her preferred negotiation tool) and rests her
other hand on the dagger hilt. Her expression is a confident smirk, with a hint of
mischief — a merchant queen who has seen everything.
Behind her, a sun-baked desert market scene at midday: caravan tents, packed camels,
silk banners, distant crowd of merchants and customers, with the bright golden desert
sun overhead and the genso rainbow streams in the high blue sky.

Anime fantasy illustration style, lively merchant-queen atmosphere,
warm earth tones (forest green, tan, gold, brown) with bright desert sky.
Tall vertical composition emphasizing her commanding presence.

CRITICAL ANATOMY REQUIREMENTS: Five distinct fingers per hand, both hands clearly defined,
both arms in natural human poses with proper joint angles. The hand holding the whip
grips it firmly with all fingers visible.

Aspect ratio 3:4, high detail.
```

---

# 【4】砂牙の老戦士 グラン (SSR、 サハナの剣の師)

- **filename**: `desert_veteran.png`
- **path**: `images/characters/season1/ssr/desert_veteran.png`
- **派閥**: 古龍砂漠サハール
- **役割**: サハナに剣を教えた老戦士、 砂漠最強の戦士、 一族の守り手
- **性格**: 寡黙、 厳しい、 弟子に深い愛情、 戦場では獅子のような強さ
- **武器**: 大剣「砂牙 (サンガ)」 — 砂で研いだ青銅の両手大剣
- **外見**: 50代男性、 隻眼 (左目に古傷)、 浅黒い肌、 灰色まじりの黒い髪をオールバック、 顎髭、 戦士の鎧 (古龍鱗の胸当て、 革と布のローブ、 革ブーツ、 風になびくマント)

```
A vertical 3:4 portrait of a veteran desert warrior named Gran, full-body standing pose.
He is in his fifties, deeply tanned and weathered, with a missing left eye covered by
an old battle-scar (not eye-patch — visible scar across his closed eyelid). His remaining
right eye is sharp amber-gold. Black hair streaked with grey, slicked back. A short
trimmed beard. He wears a desert warrior's armored attire: a chest piece made of large
iridescent dragon scales bound with leather, layered earth-toned robes underneath,
heavy leather greaves and gauntlets, a long traveler's mantle in faded burgundy that
flows behind him in the desert wind. He holds a massive two-handed greatsword named Sanga,
its blade made of polished bronze etched with desert sigils, point planted in the sand
beside him as he stands at ease. The blade is roughly his own height. His stance is
patient, weathered, like a tree that has stood in the desert for decades.
Behind him, a windswept rocky desert canyon at dusk: tall sandstone cliffs, cracked
canyon floor, faint sandstorm in the distance, the sky deep amber transitioning to violet
zenith with the genso rainbow streams visible.

Anime fantasy illustration style, weathered-warrior gravitas atmosphere,
earth-tone palette (sand, leather brown, dusty bronze, faded burgundy) with amber dusk sky.
Tall vertical composition emphasizing his rooted, mountain-like stance.

CRITICAL ANATOMY REQUIREMENTS: Five distinct fingers per hand, both hands grip the
greatsword hilt firmly with all fingers visible and properly positioned. Both arms in
natural human poses, mature musculature with proper joint angles. Avoid distortion.

Aspect ratio 3:4, high detail.
```

---

# 【5】紫竜の侍従 リアム (SSR、 紫竜王国忠臣)

- **filename**: `purple_dragon_servant.png`
- **path**: `images/characters/season1/ssr/purple_dragon_servant.png`
- **派閥**: 紫竜王国 (既存)
- **役割**: ヴィルを心配して砂漠まで追ってくる忠臣、 紫竜王国側の視点
- **性格**: 真面目、 王女への忠誠、 やや堅物
- **武器**: 紫竜の槍 (細身の儀礼槍、 紫の刃)
- **外見**: 20代後半男性、 紫がかった黒髪、 すっきりした顔立ち、 紫色の瞳、 紫竜王国の侍従礼服 (紫と銀の鎧、 紫マント、 王国紋章入り)

```
A vertical 3:4 portrait of a young Purple Dragon Kingdom royal retainer named Liam, full-body
standing pose. He is in his late twenties, fair-skinned with a hint of light tan, neatly
combed dark hair with violet highlights. His eyes are royal violet, serious and earnest.
He wears the formal armor of the Purple Dragon Kingdom: violet-and-silver plate armor
with intricate dragon-motif engravings on the chest piece and shoulder guards, white
ceremonial undertunic, a royal purple cape clasped with the kingdom's silver dragon emblem,
silver-trimmed boots. He holds a slender ceremonial spear with a violet-glowing blade —
the blade emits faint violet dragon energy along its edge. His stance is upright, dignified,
the spear held vertical at his side like a guard standing watch. His expression is earnest
worry — he has traveled far to find his princess.
Behind him, the entrance to the Purple Dragon Kingdom's outer fortress at dawn: tall
violet-stone walls, banners with the silver dragon emblem flowing in the morning breeze,
the sky transitioning from purple horizon to bright gold zenith with the genso rainbow
streams.

Anime fantasy illustration style, regal-loyalist gravitas atmosphere,
royal purple + silver + gold palette with violet armor accents.
Tall vertical composition emphasizing his upright dignified stance.

CRITICAL ANATOMY REQUIREMENTS: Five distinct fingers per hand, the hand gripping the
spear shows all five fingers firmly around the shaft. Both arms in natural human poses
with proper joint angles. Avoid distortion.

Aspect ratio 3:4, high detail.
```

---

# 【6】祭舞のサフィラ (SR、 七色の踊り子)

- **filename**: `festival_dancer.png`
- **path**: `images/characters/season1/sr/festival_dancer.png`
- **派閥**: 古龍砂漠サハール
- **役割**: 部族祭事の踊り手、 七色の絹を纏う踊りで影喰いを浄化する
- **性格**: 朗らか、 祭り好き、 神聖な踊りには深い覚悟
- **武器**: 七色の絹布 (踊りの道具、 戦闘では浄化の武器)
- **外見**: 20代前半女性、 褐色肌、 編み込んだ赤茶色の髪、 翠色の瞳、 七色の絹を纏った民族舞踊衣装 (露出多めの上下、 多層の絹布が翻る)

```
A vertical 3:4 portrait of a desert festival dancer named Safira, full-body standing pose
mid-dance. She is in her early twenties, sun-tanned warm skin, long red-brown hair in
intricate braids decorated with small golden coins and ribbons. Her eyes are jade green,
bright and joyful. She wears a desert festival dance costume: a fitted bandeau-style top
in deep crimson with golden embroidery, a flowing low-rise skirt in seven layered silks
(red, orange, yellow, green, blue, indigo, violet) that swirl outward as she dances,
multiple bangles on her arms and ankles, an intricate beaded headpiece. Her midriff is
visible. She holds two long flowing silk scarves, one in each hand — these are her
dance weapons, each scarf in a different prismatic color, currently swirling around her
in mid-motion. Her pose is mid-twirl, one leg extended, body in graceful spiral, the
seven-color silks creating a rainbow halo around her. Her expression is radiant joy.
Behind her, a desert oasis at evening with festive bonfires, tribal banners, and the
genso rainbow streams visible in the deep blue sky overhead.

Anime fantasy illustration style, joyful celebration atmosphere,
vivid seven-color palette against warm desert evening tones.
Tall vertical composition with dynamic dance motion.

CRITICAL ANATOMY REQUIREMENTS: Five distinct fingers per hand, both hands holding silk
scarves with all fingers clearly defined. Both arms in natural dancer poses with proper
joint angles. Avoid distortion.

Aspect ratio 3:4, high detail.
```

---

# 【7】古龍鍛冶 オウル (SR、 古龍鱗を扱う伝統職人)

- **filename**: `dragon_smith.png`
- **path**: `images/characters/season1/sr/dragon_smith.png`
- **派閥**: 古龍砂漠サハール
- **役割**: 古龍の鱗を鍛える伝統職人、 ヴィルに「血の意味」 を諭す哲人
- **性格**: 寡黙、 職人気質、 言葉少なに深い洞察を語る
- **武器**: 鍛冶用大ハンマー (戦闘でも使う)
- **外見**: 40代男性、 大柄、 浅黒い肌、 短い黒髪、 角張った顎、 深い茶色の瞳、 革エプロン + 厚手の作業着 (鍛冶炉の煤で汚れた)、 太い腕に古い火傷跡

```
A vertical 3:4 portrait of a desert dragon-scale blacksmith named Owl, full-body standing pose.
He is in his forties, large-built with broad shoulders and powerful arms, sun-tanned dark
skin with several old burn scars on his forearms (badges of his trade). Short black hair,
square-jawed, deep brown eyes that are wise and patient. He wears a heavy leather
blacksmith's apron over a sleeveless dark-grey work tunic, the apron stained with soot
and small scorch marks. Heavy leather gauntlets on his hands, sturdy work pants and
reinforced boots. Around his neck, a single dragon-scale pendant (his trade mark).
He holds a large blacksmith's warhammer at his side — its head made of polished
bronze etched with dragon-scale patterns, the haft thick desert hardwood. The hammer
also serves as his combat weapon. His stance is solid, grounded, like a man rooted in
his craft.
Behind him, a desert forge workshop at twilight: large stone forge with glowing embers,
anvil, hanging tools, finished dragon-scale armor pieces displayed on racks, with the
genso rainbow streams faintly visible through a high window.

Anime fantasy illustration style, craftsman-philosopher atmosphere,
warm forge-fire palette (dark amber, deep brown, soot grey) with twilight blue accent.
Tall vertical composition emphasizing his sturdy build.

CRITICAL ANATOMY REQUIREMENTS: Five distinct fingers per hand, the hand gripping the
hammer shows all five fingers firmly around the haft. Both arms with mature
musculature, natural human joint angles. Avoid distortion.

Aspect ratio 3:4, high detail.
```

---

# 【8】砂風の戦士 ライ (SR、 サハナを慕う若き戦士)

- **filename**: `young_desert_warrior.png`
- **path**: `images/characters/season1/sr/young_desert_warrior.png`
- **派閥**: 古龍砂漠サハール
- **役割**: サハナを慕う若き戦士、 一族の未来、 後の世代の希望
- **性格**: 真面目、 まっすぐ、 サハナへの憧れ
- **武器**: 双短剣 (サハナの双剣を真似た若き戦士の構え)
- **外見**: 16-17歳少年、 褐色肌、 ダークブラウンの短髪 (前髪長め)、 ヘーゼル色の瞳、 軽装戦士衣装 (タンクトップ + ベスト + 動きやすいパンツ + 革ブーツ + 腕巻き)

```
A vertical 3:4 portrait of a young desert warrior boy named Rai, full-body standing pose.
He is 16-17 years old, sun-tanned warm-honey skin, dark brown short hair with longer
fringe sweeping across his forehead, hazel eyes — earnest and admiring. He wears a light
desert warrior outfit: a sleeveless dark-tan tunic with leather chest harness,
practical loose dark trousers tucked into ankle-high leather boots, leather wraps
on his forearms (training gear), a single small amulet around his neck. He holds two
short daggers — clearly modeled after Sahana's twin scimitar style but on a smaller
scale (as he is still her student-admirer). His stance is eager, slightly forward,
ready to spring into action — a young warrior trying his hardest to prove himself.
His expression is determined-bright.
Behind him, a desert training ground with target dummies, scattered weapon racks, and
older warriors training in the distance, the desert sun setting behind in warm orange,
genso rainbow streams visible above.

Anime fantasy illustration style, eager-young-warrior atmosphere,
warm sand + earth tone palette with warm sunset orange accent.
Tall vertical composition emphasizing his eager forward stance.

CRITICAL ANATOMY REQUIREMENTS: Five distinct fingers per hand, both hands grip daggers
firmly with all fingers visible. Both arms in natural youthful human poses with proper
joint angles.

Aspect ratio 3:4, high detail.
```

---

# 【9】砂塵の子 ティナ (R、 子供枠)

- **filename**: `desert_child.png`
- **path**: `images/characters/season1/r/desert_child.png`
- **派閥**: 古龍砂漠サハール
- **役割**: サハナの妹分、 子供枠、 一族の未来
- **性格**: 元気、 好奇心旺盛、 サハナを姉のように慕う
- **武器**: なし (子供のため、 護身用の小石スリングのみ持ち歩く程度)
- **外見**: 8-9歳少女、 褐色肌、 ふわふわのライトブラウンのおさげ髪 (二つに結んだ)、 大きな丸い茶色の瞳、 民族風の子供服 (動きやすい短いチュニックとブルマー、 草履)

```
A vertical 3:4 portrait of a small desert child girl named Tina, full-body standing pose.
She is 8-9 years old, sun-tanned warm-honey skin, fluffy light-brown hair tied into two
small twin braids decorated with tiny colorful beads. Her eyes are large warm brown,
round and curious — bright with childhood wonder. She wears simple desert children's
attire: a loose short red-orange tunic with white embroidery, comfortable bloomer pants
to the knee, simple woven sandals, a small bag slung across her shoulder (containing
her stones and treasures). She holds a small leather sling in her hand, almost like a
toy — her "weapon" for chasing off small desert critters and feeling brave.
Her stance is bouncy, one foot slightly forward, an excited grin on her face.
Behind her, a peaceful nomadic camp at midday: colorful tents, grazing camels in the
distance, family members visible going about daily life, the genso rainbow streams
streaming peacefully through the bright sky.

Anime fantasy illustration style, joyful innocent-childhood atmosphere,
bright warm palette (red-orange, sand-tan, sky-blue) with cheerful colors.
Tall vertical composition emphasizing her small bouncy presence.

CRITICAL ANATOMY REQUIREMENTS: Five distinct fingers per hand, the hand holding the
sling shows all five fingers clearly. Both arms in natural childlike human poses with
proper joint angles.

Aspect ratio 3:4, high detail.
```

---

# 【10】語り部の老 ナドラ (R、 古龍王伝承の補助)

- **filename**: `old_storyteller.png`
- **path**: `images/characters/season1/r/old_storyteller.png`
- **派閥**: 古龍砂漠サハール
- **役割**: 古龍王伝承の補助的な語り部 (ファラーとは別系統、 一般遊牧民側の伝承)
- **性格**: 温和、 物語を愛する、 子供たちに昔話を聞かせる
- **武器**: 物語の杖 (実用ではなく装飾、 古龍の歯を埋め込んだ)
- **外見**: 60代男性、 浅黒い肌、 白髪混じりの長い髭、 後ろで束ねた白髪、 優しい焦茶の瞳、 砂漠老人の長衣 (深いブルーグレーの長衣、 多層のショール、 革のサンダル)

```
A vertical 3:4 portrait of an elderly desert storyteller named Nadra, full-body standing pose.
He is in his sixties, sun-tanned and weathered skin, long white-streaked dark hair tied
back in a low ponytail, a long flowing salt-and-pepper beard. His eyes are warm dark-brown,
gentle and full of stories. He wears a desert elder's robes: deep blue-grey long flowing
robe with silver embroidery, layered shawl over his shoulders in lighter grey, a wide
woven belt holding a small leather pouch (for tobacco or treasured small items), simple
leather sandals. He holds a tall storyteller's staff — slender, made of pale desert wood
with a single ancient dragon tooth embedded near the top (a gift from a long-ago dragon),
the staff worn smooth from generations of use. His stance is gentle, slightly leaning on
the staff, a peaceful smile on his face — the smile of one who has seen many tellings
and many listeners.
Behind him, a tribal evening campfire scene: children sitting around the fire listening
to stories, scattered tents in the soft firelight, the desert night sky above with the
genso rainbow streams flowing softly among the stars.

Anime fantasy illustration style, gentle storyteller atmosphere,
warm firelight palette (deep blue-grey, warm amber firelight, white starlight).
Tall vertical composition emphasizing his peaceful elder presence.

CRITICAL ANATOMY REQUIREMENTS: Five distinct fingers per hand, the hand on the staff
shows all five fingers clearly gripping. Both arms in natural elderly human poses with
proper joint angles, slightly relaxed.

Aspect ratio 3:4, high detail.
```

---

# 生成手順 (野沢用メモ)

1. 各セクションの ``` ブロックをコピー → ChatGPT (DALL-E 3) に貼付
2. 添付画像なし、 そのまま生成
3. 生成された画像を `images/characters/season1/{tier}/{filename}.png` (上記 path 参照) で Box保存
   - ※ 注意: prismaera/images/characters/season1/{tier}/ がない場合は新規作成
4. 全10体生成完了後、 Claude に伝えれば thumb webp + POOL追加 + LOCATION_CONFIG 設定 + 第3章本文の最終ブラッシュアップ → v1.3.0 リリースまで実行

10体並行生成は ChatGPT の負荷次第で時間かかる、 4-5体ずつ分割推奨。
