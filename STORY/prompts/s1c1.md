# Gacha Sim — 未生成キャラ プロンプト集

ChatGPT（gpt-image-1 / DALL·E-3）に貼って生成できる形式。
全キャラ共通で「original character, no logos, no text, no watermark」を末尾に入れ、著作権リスクを避ける設計。

**推奨設定:**
- モデル: `gpt-image-1` (quality: high) / DALL·E 3 (HD)
- サイズ: `1024x1536`（縦長、全身立ち絵用）
- 背景: `clean starry night background with subtle aurora`

**保存先（このアプリで使う場合）:**
`C:/Users/t2262/Box/DIK & Company/06_Other/野沢用/claude/gacha-sim/images/characters/seasonN/<tier>/<slug>.png`

ディレクトリ構成:
```
images/
├── characters/
│   └── season1/
│       ├── lr/   prisma.png
│       ├── ur/   seraph_paladin.png ・ dragon_emperor.png ・ cosmic_witch.png ・ ancient_sage.png ・ flame_empress.png
│       ├── ssr/  elf_archer.png ・ wolf_warrior.png ・ draco_lancer.png ・ masked_knight.png ・ cat_librarian.png ・ kitsune_lady.png ・ paladin_lady.png ・ little_sister.png
│       ├── sr/   silver_girl.png ・ swordsman.png ・ mage.png ・ red_twintail.png ・ katana_miko.png ・ pink_dragon_girl.png ・ white_priestess.png ・ songstress.png ・ shadow_ninja.png ・ flame_dancer.png
│       └── r/    student.png ・ boy_scout.png ・ fox_girl.png ・ archer.png ・ young_mage.png ・ warrior.png
└── fx/  (エフェクト素材)
```
※ 今後 season2/ 以降を追加。`script.js` の `POOL` は `season: N` フィールドで世代管理。

---

## SSR 追加5体（種族・武器・衣装バラエティ）

### 1. `ssr_08_elf_archer.png` — 森の射手 リナエ（エルフ弓）

```
anime-style full-body portrait of an elegant forest elf archer woman, long emerald green hair, pointed elf ears, leaf-shaped earrings, intricate forest-green tunic with gold embroidery and white lace details, leather belt with ornate silver buckle, dark green cape flowing, holding a tall ornate longbow made of living wood with glowing gold runes, a quiver of golden arrows on her back, confident poised stance, standing facing forward, clean starry night background with subtle aurora and floating light particles, cinematic rim lighting, detailed linework, high-quality illustration, original character, no logos, no text, no watermark
```

---

### 2. `ssr_09_wolf_warrior.png` — 獣牙 ガルド（狼獣人・両手斧）

```
anime-style full-body portrait of a muscular teenage beastman warrior, gray wolf ears and bushy wolf tail, amber-gold eyes, tan skin, rugged leather armor with fur trim on shoulders and waist, detailed tribal tattoos on arms, bandages wrapped on forearms, wielding a massive two-handed battle axe with a gleaming steel blade, aggressive battle stance, wild grin showing fangs, standing facing forward, clean starry night background with subtle aurora, cinematic rim lighting, detailed linework, high-quality illustration, original character, no logos, no text, no watermark
```

---

### 3. `ssr_10_draco_lancer.png` — 竜爵 ヴィル（竜人・三叉槍）

```
anime-style full-body portrait of a regal dragonkin teenage girl, iridescent black scales on cheeks forearms and tail, small black horns, long platinum-silver hair, slitted violet eyes, elaborate black and deep purple armor with amethyst gems and gold filigree, flowing violet silk cape, holding a long three-pronged trident spear with dark violet glow, noble authoritative pose, standing facing forward, clean starry night background with subtle aurora, cinematic rim lighting, detailed linework, high-quality illustration, original character, no logos, no text, no watermark
```

---

### 4. `ssr_11_masked_knight.png` — 仮面騎士 シオン（聖銀鎧・メイス+盾）

```
anime-style full-body portrait of a mysterious masked holy knight, full silver-white plate armor with gold trim and blue cloth accents, ornate visor helm with a golden cross shape over the face, long white cape with blue lining, holding an ornate silver mace with a glowing blue crystal core in one hand, a tall intricately engraved tower shield in the other, stoic imposing stance, standing facing forward, clean starry night background with subtle aurora, cinematic rim lighting, detailed linework, high-quality illustration, original character, no logos, no text, no watermark
```

---

### 5. `ssr_12_cat_librarian.png` — 黒猫 ノア（猫耳・魔導書）

```
anime-style full-body portrait of a cheerful teenage cat-eared girl scholar, fluffy black cat ears and long swaying black cat tail, golden eyes, short messy silver-white hair, black and gold academic robe with open chest coat and short skirt, thigh-high black stockings, silver pendant, carrying a huge ancient magical tome floating open next to her with glowing runes, mischievous smile, one hand raised with magical sparks, standing facing forward, clean starry night background with subtle aurora, cinematic rim lighting, detailed linework, high-quality illustration, original character, no logos, no text, no watermark
```

---

## UR 専用3体（最高レア・派手、SSR枠には出ない）

### 6. `ur_01_seraph_paladin.png` — セラフィエル（天使聖騎士・六翼・ハルバード）

```
anime-style full-body portrait of a divine angelic female paladin, six glowing white feathered wings spread behind her, long flowing platinum hair, golden halo above her head, piercing blue eyes, white and gold ornate full plate armor with holy engravings and rainbow gem accents, long white cape with gold rainbow-prism patterns, wielding a massive gleaming halberd with a rainbow prismatic blade emitting holy light, majestic divine stance, radiant holy aura in rainbow hues surrounding her, standing facing forward, clean starry night background with subtle aurora, cinematic rim lighting, detailed linework, high-quality illustration, original character, no logos, no text, no watermark
```

---

### 7. `ur_02_dragon_emperor.png` — 龍帝 アルテミス（竜人青年・双大剣・背に龍影）

```
anime-style full-body portrait of a dragon emperor young man, long flowing golden hair with black highlights, piercing golden dragon eyes with slit pupils, sharp black dragon horns curving backward, small black dragon wings partially spread, a massive ethereal oriental dragon silhouette coiling behind him in rainbow mist, elaborate black and gold imperial armor with dragon scale textures and rainbow jewel inlays, wielding twin curved dragon katanas crossed, one gold one black, commanding regal pose, intense aura of power, rainbow sparks around him, standing facing forward, clean starry night background with subtle aurora, cinematic rim lighting, detailed linework, high-quality illustration, original character, no logos, no text, no watermark
```

---

### 8. `ur_04_ancient_sage.png` — 千夜姫 カグヤ（ロリババア・最古の賢者）

**キャラ設定案**:
- 肩書き: 虹霊界最古の賢者
- キャッチ: 「幼く見えるか？ うむ、千年やっとるでな」
- ストーリー: 原虹の誕生より前から在る月の化身。小柄な少女の姿で顕現しているが、実齢は計り知れぬ。杖『月影(つきかげ)』は全ての魔術の原典を宿す。気まぐれに人前へ現れ、助言を残して消える。

```
anime-style full-body portrait of a tiny petite ancient-looking young girl sage,
long flowing silver-white hair reaching below her knees with soft golden highlights,
piercing ancient gold eyes with a wise knowing expression, small delicate petite frame,
fair luminous skin, small white fox ears on top of her head,
nine flowing fluffy white fox tails spreading like a fan behind her,
small crescent moon mark on forehead,
wearing an ornate elaborate twelve-layer traditional japanese junihitoe ceremonial robe,
layers of white, pale gold and soft violet with intricate celestial embroidery and rainbow prismatic trim,
long flowing sleeves trailing to the floor, golden obi with crescent moon and star motifs,
tiny bare feet peeking from the robe layers,
holding a tall ornate golden crescent moon staff that is much taller than her own height,
topped with a floating rainbow prism orb emitting soft moonlight,
serene composed sage-like expression with a subtle knowing smirk showing ancient wisdom,
ethereal calm standing pose with robes softly flowing,
moonlight beams and rainbow stardust gently swirling around her,
clean starry night background with a large luminous full moon and soft violet-gold aurora,
high-quality detailed anime illustration, original character,
no logos, no text, no watermark, tasteful wholesome art
```

---

### 9. `ur_03_cosmic_witch.png` — 星海のノクス（宇宙魔女・銀河髪・星杖）

```
anime-style full-body portrait of a mysterious cosmic starlight witch, long flowing black hair with galaxies and nebulae swirling inside it, pale violet skin glowing faintly, starry violet eyes, wide-brimmed deep purple and midnight blue witch hat with rainbow aurora streaming from it, ornate cosmic purple robe with constellation patterns and rainbow prismatic trim, floating barefoot, small planets and stars orbiting around her like accessories, holding a crystal scepter topped with a miniature glowing galaxy, enigmatic gentle smile, rainbow stardust swirling around her, standing facing forward, clean starry night background with subtle aurora, cinematic rim lighting, detailed linework, high-quality illustration, original character, no logos, no text, no watermark
```

---

## SSR 追加3体（野沢さん好みラインナップ：妖艶 / 豊満 / 妹）

推しキャラ傾向（鳴潮ツバキ / 益子薫 / ミリム / メリイ）から寄せた好み:
和洋折衷、ツインテ、個性的な髪色、和風幻想世界観。

### 9. `ssr_13_kitsune_lady.png` — 朱音（あかね）妖艶な狐娘

```
anime-style full-body portrait of an alluring adult fox-eared woman,
long straight jet-black hair flowing past her waist, sharp glowing gold slit eyes,
pale porcelain skin, two fluffy black fox ears with gold tips,
two long black-and-gold fox tails swaying gracefully behind her,
wearing an elegant revealing black-and-gold japanese kimono dress with deep side slits showing her legs,
red silk obi sash with gold embroidery and tassels, shoulders exposed but chest tastefully covered,
ornate gold jewelry on neck wrists and ankles, high-heeled strappy sandals,
small crimson bindi on forehead, red lips with a sly confident smirk,
one hand holding a closed intricate gold folding fan, other hand gently touching her hair,
elegant seductive standing pose, wisps of red and gold flame floating around her,
clean starry night background with warm orange aurora, cinematic warm lantern rim lighting,
high-quality detailed anime illustration, original character, no logos, no text, no watermark, tasteful art
```

---

### 10. `ssr_14_paladin_lady.png` — イザベル 聖光の麗女

```
anime-style full-body portrait of a confident mature female holy knight,
long wavy golden-blonde hair tied loosely, bright emerald green eyes,
healthy fair skin, warm kind radiant smile, voluptuous hourglass figure,
wearing ornate white-and-gold holy plate armor with a sweetheart-cut corset breastplate that highlights her curves,
a gold cross emblem on the chest, cinched waist with gold belt,
short white flared battle skirt with gold trim, white-and-gold thigh-high armored boots,
long white cape with gold cross embroidery flowing behind,
holding a tall ornate golden holy spear with a glowing rainbow prism tip,
small golden halo-like crown on her head, elegant gold earrings,
one hand on her hip, other raising the spear, graceful confident pose,
gentle radiant golden aura of holy light surrounding her, small floating feathers,
clean starry night background with warm golden aurora and soft light particles,
high-quality detailed anime illustration, original character, no logos, no text, no watermark, tasteful modest art
```

---

### 11. `ssr_15_little_sister.png` — ひなた 月下の幼き剣姫

```
anime-style full-body portrait of a cheerful adorable young teenage apprentice swordswoman,
short bright pink bob hair with small twin low ponytails tied with red ribbons,
huge sparkling pink puppy-like eyes, petite small frame, rosy cheeks,
innocent bright smile showing small cute fangs,
wearing a cute white-and-pink kimono-style martial arts outfit with wide flowing sleeves,
bright red obi sash with a large pink bow at the back, short pleated pink skirt,
white thigh-high socks with pink bows, red geta sandals,
holding a small short katana (kodachi) with a pink silk tassel, confidently in both hands,
dynamic energetic jumping pose with one foot raised, waving at viewer,
cherry blossom petals and pastel pink magical sparkles swirling around her,
clean starry night background with soft pink and gold aurora and moonlight,
high-quality detailed anime illustration, original character, no logos, no text, no watermark, cute wholesome art
```

**キャラ設定案** (お好みで調整ください):
- **朱音**: 夜焔郷の遊芸師(裏では暗殺稼業)。「逃げたいなら今のうち。逃げなかったら、もう遅いわ」
- **イザベル**: 白焔教会の聖巫騎士。「あなたの傷、すべてこの手で癒してあげる」
- **ひなた**: 皇家の末妹・見習い剣士。「ね、わたしも連れてって！修行したんだから！」

---

## 🌈 UR 追加1体（既存4体と同じ派手度レベル）

既存URは「羽/龍影/銀河/九尾」など派手装飾MAX。同等レベルで欠けている『炎/鳳凰/赤金』属性を追加。

### 12. `ur_05_flame_empress.png` — 焔帝 ヒノオウ（炎と鳳凰の女神帝）

**キャラ設定**:
- 肩書き: 虹霊界第七天の女神帝
- キャッチ: 「すべての闇を、この火で照らしてやろう」
- ストーリー: 七天の最高天を統べる炎の女神帝。背に巨大な朱の鳳凰を従え、双大剣『日輪(にちりん)』『月輪(げつりん)』を振るう。影喰いとの戦いでは常に前衛に立つ戦闘神。焔と虹を同時に纏う稀有な存在。

```
anime-style full-body portrait of a majestic divine flame empress,
long flowing crimson-red hair with golden highlights shifting like living fire, piercing bright gold eyes with a fierce confident expression,
fair luminous skin, wearing elaborate ornate crimson-and-gold imperial armor with scarlet silk robes layered beneath,
intricate phoenix feather patterns embroidered in gold across the armor,
a massive ethereal red-and-gold phoenix silhouette spread wide behind her, wings formed of flame and rainbow sparks,
long flowing red and gold royal cape with phoenix feather trim,
holding twin curved long swords "Sun-Wheel" and "Moon-Wheel" crossed elegantly, blades wreathed in ruby and golden flames with rainbow embers,
commanding royal pose with both swords raised gracefully, subtle smile of certain victory,
sacred flames and rainbow cinders swirling around her, heated air distortion behind her,
small ornate golden imperial crown with a single burning rainbow gem,
clean starry night background with dawn-red aurora and scattered glowing sparks,
cinematic divine rim lighting, highly detailed anime illustration,
original character, no logos, no text, no watermark, tasteful art
```

---

## 💜 SR 追加3体（既存7体と同じ派手度レベル）

既存SRは「推しキャラ風 + 虹アクセント少し」路線。追加3体も同じ華やかさ、武器・属性・性別のバランス考慮（男性1・女性2、音/影/炎）。

### 13. `sr_08_songstress.png` — 詠聖 ベル（月光の歌姫）

**キャラ設定**:
- 肩書き: 月夜堂の歌姫
- キャッチ: 「私の歌、届いてる？」
- ストーリー: 月夜堂の看板歌姫。歌声そのものが神聖な浄化の力を宿し、影喰いを封じる。ソロ公演は虹霊界全域から観客を集める大スター。

```
anime-style full-body portrait of a gentle elegant young teenage songstress,
long silky silver-lavender hair with soft curls, bright pale-blue eyes, soft kind gentle smile, fair skin,
wearing an elegant flowing white and pale-violet performance gown with silver embroidery and subtle rainbow prism trim,
gossamer lavender ribbons flowing from the shoulders, a sheer white stole,
silver high-heeled shoes, small silver crescent moon earrings,
holding an ornate silver hand-held microphone with a small rainbow crystal orb at the top,
musical notes and glowing sound wave ripples in soft rainbow colors floating around her,
graceful singing pose with one hand raised delicately, eyes closed softly in emotion,
clean starry night background with pale violet and blue aurora and a small luminous moon,
cinematic rim lighting, highly detailed anime illustration,
original character, no logos, no text, no watermark, tasteful art
```

---

### 14. `sr_09_shadow_ninja.png` — 影刃 シン（冥暗流の双剣忍影）

**キャラ設定**:
- 肩書き: 冥暗流若頭
- キャッチ: 「気配は消した。覚悟だけしとけ」
- ストーリー: 冥暗流の若き頭領。先代を影喰いに奪われ、復讐と世界救済を胸に夜の戦場を駆ける。短剣二刀流の名手。

```
anime-style full-body portrait of a cool stoic teenage boy shadow ninja,
short messy jet-black hair with indigo streaks falling over one eye, sharp amber-gold eyes, fair skin,
wearing a form-fitting dark indigo ninja combat outfit with silver metallic trim, a silver scarf trailing behind,
dark fingerless gloves, ninja tabi sandals, subtle silver buckles and ninja pouches on the belt,
wielding twin short curved kunai-style blades in a reverse-grip cross stance, blades edged with thin purple aura,
calm confident expression with slight smirk, dynamic low ready pose with long shadow trailing behind,
dark indigo smoke and silver sparks swirling around him,
clean starry night background with cool blue aurora and a crescent moon silhouette,
cinematic rim lighting, highly detailed anime illustration,
original character, no logos, no text, no watermark, tasteful art
```

---

### 15. `sr_10_flame_dancer.png` — 焔舞 ヒナカ（緋炎流の舞扇使い）

**キャラ設定**:
- 肩書き: 緋炎流舞踊家
- キャッチ: 「さあ、燃えるような舞を見せてあげる♪」
- ストーリー: 緋炎流の天才舞踊家。戦場では扇の舞で敵を撹乱しつつ焔で焼き尽くす。ステージで踊る事と戦場で戦う事に境界がない。

```
anime-style full-body portrait of a spirited teenage flame dancer,
long flowing orange-red hair tied in a high ponytail with a gold ribbon bow, bright amber eyes, warm confident smile showing small fangs,
fair skin with warm tones, wearing a flowing red and gold dance-kimono outfit short enough to allow movement,
orange flame patterns embroidered in gold across the fabric, wide bell-sleeves,
golden obi sash with large red bow, bare legs with red leg-warmers, red geta sandals,
holding a pair of ornate golden folding fans spread wide, each fan emitting dancing orange-red flames and rainbow embers,
dynamic graceful dance pose with one leg raised and arms outstretched like flames,
warm flame particles and golden sparks swirling around her,
clean starry night background with warm orange sunset aurora and scattered glowing embers,
cinematic rim lighting, highly detailed anime illustration,
original character, no logos, no text, no watermark, tasteful art
```

---

## 👑 LR (Legend Rare) — 唯一の伝説枠

**ファイル名**: `lr_01_legend.png`

**キャラ設定**:
- **名前**: 虹意 プリズマ
- **肩書き**: 原虹の意志・唯一の伝説
- **キャッチコピー**: 「我は光の源。終わりにして、始まり」
- **コンセプト**: 性別不明・中性的な中世ヨーロッパ王族風の神格。原虹の最初の光から生まれた『自意識』そのもの。性別という概念の外にいる。虹光剣『始源(げんそう)』は万色の刃。
- **確率**: 0.5%（Rから吸い取り）

### プロンプト

```
anime-style full-body portrait of a mysterious ethereal androgynous medieval royal figure,
ambiguous sex, neither clearly masculine nor feminine, calm refined delicate features,
long flowing straight silver-white hair with shifting rainbow prismatic highlights,
pale luminous glowing skin, piercing wise eyes that shift through rainbow colors,
wearing an elaborate ornate medieval royal ceremonial robe in white, gold and rainbow gradient,
layered regal garments with cosmic embroidery, tall intricate crown made of floating rainbow prism crystals levitating above the head,
long flowing white cape with rainbow aurora patterns trailing behind,
holding a slender elegant longsword forged from solidified rainbow light, blade showing every color of the spectrum,
standing in a serene majestic sovereign pose, one hand resting on the pommel of the sword, other hand held elegantly,
an enormous prismatic crystal floating slowly behind them like a sacred halo,
subtle rainbow aurora waves flowing gracefully around them, sacred geometry patterns faintly glowing in the air,
clean starry night background with layered auroras, divine light from above,
cinematic divine rim lighting, highly detailed anime illustration,
original character, no logos, no text, no watermark, tasteful art, solemn dignified atmosphere
```

### ポイント
- `androgynous` / `ambiguous sex` / `neither clearly masculine nor feminine` を明示 → 性別不明
- `medieval royal` / `sovereign` / `dignified` → 唯一のLegendを名乗れる威厳
- `rainbow prismatic` / `rainbow light` / `rainbow aurora` → 原虹の化身
- `solidified rainbow light` の剣 → 世界観(虹霊界) とリンク

---

## 使い方

1. 上記プロンプトをそのままChatGPTにコピペ（1体ずつ）
2. 出力画像を指定ファイル名（例: `ssr_08_elf_archer.png`）で
   `C:/Users/t2262/Box/DIK & Company/06_Other/野沢用/claude/gacha-sim/images/` に保存
3. `script.js` の POOL定義は既にファイル名を参照してあるので、配置するだけで反映（UR専用への切替は別途 POOL 編集が必要 → そこは野沢さんが画像配置後に一声ください、こちらで差し替えます）

## 補足: 後日こちらで追加生成したい場合

OpenAI Hard Limit 引き上げ後に `/c/Users/t2262/AppData/Local/Temp/gen_gacha_variety.py` を再実行すれば自動生成可能。
