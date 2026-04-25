// ===== GASSHUKU GACHA (限定機能・2026-04-25 合宿用・即削除可) =====
// 削除手順:
//   1) このファイル削除
//   2) index.html から <script src="gasshuku.js?v=..."></script> と
//      .gasshuku-cta-block ブロック (3箇所:見出し+grid+4ボタン) を削除
//   3) style.css の "GASSHUKU" 関連セクションをすべて削除
//   4) images/gasshuku/ フォルダ削除
// 既存 POOL / Firebase / localStorage / state には一切手を入れていない。
// summonOne / clearStage / closeStage / stage 等の既存グローバル関数を流用して、
// 本家UR演出（虹背景/ゴッドレイ/虹噴水/MIRACLE等）をそのまま再利用する。

(function () {
  'use strict';

  const POOL = [
    { id: '01', slug: 'nozawa',   real: '野沢朝輝',
      name: '曙のオートメイター・ノザワ', faction: '星霊学院',
      role: '自動化の継承者', skill: '面倒消去のオラクル',
      voice: '面倒は、すべて私が片付ける。',
      stories: [
        { title: '教育の道から、自動化の道へ', body: '東京学芸大学・初等教育情報教育選修。子どもたちに「面倒なことを楽にする魔法」を教えたかった——その夢が、社会に出てBotCampのタスク管理ダッシュボードに姿を変えた。教える対象が子どもから大人になっただけで、根っこは同じ。「面倒を消す」ことで誰かの時間を作る、それがノザワの祈り。' },
        { title: 'ExcelとClaudeの二刀流', body: '右手にExcel、左手にClaude。多くの人が「片方使えれば十分」と言う中、ノザワは両方を極めた。Excelが「現実の構造化」、Claudeが「未知の言語化」。二つを掛け合わせると、業務の99%は半自動化できる——本人が密かに証明したテーゼだ。' },
        { title: 'ゲーマーの設計思考', body: 'ゲームを愛するノザワは、業務設計にもゲーム的視点を持ち込む。「ガチャ」「クエスト」「レベル上げ」——退屈な作業も、ゲーム化すれば人は楽しんで動ける。Prismaeraもまた、その思想の延長線上にある。BotCampも、いつか「楽しいゲーム」になる予定だ。' },
        { title: '夜更かしの設計図', body: '深夜、ノザワの机にはコーヒーカップが3つ並ぶ。日中は人と関わる仕事に追われ、夜にようやく「設計」の時間が来る。その時間が一番好きだ——誰にも邪魔されず、ロジックと向き合える静寂。良い設計は、静かな夜にしか降りてこないと、本人は信じている。' },
        { title: 'いつか教壇に戻る日', body: '教育大学を出たノザワは、いつか教壇に戻る日を密かに思い描いている。今は社会で「自動化のおもしろさ」を証明する側だが、それが固まれば、子どもたちに「君たちは本当はもっと自由になれる」と教えに行きたい。BotCampが軌道に乗ったら、次は本物のCampを開く——それが彼の長期計画。' },
      ] },
    { id: '02', slug: 'shimano',  real: '島野耕平',
      name: '智慧の戦略家・シマノ', faction: '五大国',
      role: 'AI戦略コンサルタント', skill: '最適解を編む星詠み',
      voice: '最善の道は、常に複数ある。',
      stories: [
        { title: '合同会社KOS', body: '自身の名を冠した合同会社KOS。社長室を持つことの意味は、「責任を持って判断する立場」を自分に課すこと。AIの戦略は、データの集計ではなく、人の意思決定の代行。シマノは毎朝、KOSの椅子に座る前に、深呼吸をひとつする。' },
        { title: 'AI×DX×業務変革', body: '「AI戦略」「DX推進」「業務変革」——三本柱と聞くと格好良いが、シマノに言わせれば「結局、人が楽になるか、ならないか」だけ。流行り言葉に踊らされず、現場の人の顔を思い浮かべて提案する——それがシマノのやり方。' },
        { title: '中田代表との出会い', body: 'DIK & Companyの中田代表とは、戦略の話を肴に夜まで議論するのが楽しみ。「速さは正義」と言う中田、「最善の道は複数ある」と返すシマノ——相反する思想に見えて、実は同じものを違う角度から見ている。最適解の存在を信じる、二人だけの星詠み。' },
        { title: '戦略の落とし穴', body: '「最善の道は複数ある」——だからこそ、シマノは決断の前に必ず三つの選択肢を並べる。一つだけだと「他に道はないのか」と後悔する。三つあれば、選んだ後の覚悟が違う。コンサルタント業10年で培った、シマノだけの作法。' },
        { title: 'KOSの未来', body: 'KOSはまだ小さい。だがシマノは、5年後に「AI戦略のKOS」と知られる存在を目指している。データを売るのではなく、決断を支える伴走者として。「最善の道」を顧客と共に編む——それがKOSの最終形。今は、その種を毎朝撒いている。' },
      ] },
    { id: '03', slug: 'nakata',   real: '中田元樹',
      name: '神速の創造主・ナカタ', faction: '原虹',
      role: '神速Excelの開祖', skill: '時間圧縮ショートカット',
      voice: '速さは正義だ。本気で行くぞ。',
      stories: [
        { title: '東進から始まった「速さ」の信念', body: 'ナガセ(東進ハイスクール)の校舎長として、受験生に「最短ルート」を示し続けた日々。一秒の差が合否を分ける現場で学んだのは、「速さは思いやりである」という事実。受講者2000名以上のExcelCampも、その延長線上にある。' },
        { title: '「神速Excel」の誕生秘話', body: 'ダイヤモンド社『神速Excel』——書籍化の話が来た時、ナカタは三日悩んだ。「ショートカット集なら世にあふれている」。最終的に書いたのは、ショートカットの先にある「思考のリズム」。出版から数年経った今も、現場のExcel使いから感謝の手紙が届く。' },
        { title: '金沢出身の心', body: '石川県金沢市出身。海の幸と冬の雪、そして加賀百万石の風土が、ナカタの「速さ」と「丁寧さ」の両立を育てた。豪雪地帯で生きるには、効率よく動かねば命に関わる——それが彼の身体に染み付いた、もう一つの「神速」の起源。' },
        { title: 'ExcelCamp流の指導法', body: '受講者2000名超のExcelCamp。ナカタの指導法は「実演」が9割。理屈より先に手を動かさせ、後から「なぜ速いか」を解説する。「言葉で速くなる人はいない、手で速くなる」——東進時代から続く、ナカタの信念。' },
        { title: '次なる構想', body: '神速Excelの次に、ナカタが密かに温めている構想がある。「神速AI」「神速思考法」「神速組織」——速さは技術ではなく、生き方の哲学。次の本は、Excelを超えて、人生そのものを速くする本になる予定。出版時期は秘密。' },
      ] },
    { id: '04', slug: 'suzuki',   real: '鈴木正真',
      name: '弾き語りの吟遊詩人・マサシ', faction: '独立勢力',
      role: '人の心を解す調律師', skill: '梅干しハイ・セレナーデ',
      voice: 'ねえ、君の歌も聞かせてよ。',
      stories: [
        { title: '吉祥寺の路上にて', body: '吉祥寺の井の頭公園、月夜の桜の下。マサシのギターは、毎週末、見知らぬ人々の足を止める。「人事の仕事って堅そう」と言われるが、マサシは知っている——人の心を解すのに、面接室の椅子もギターの弦も、根は同じだと。' },
        { title: 'わらび餅と冷凍餃子', body: '甘いものはわらび餅、しょっぱいものは冷凍焼き餃子、酒は梅干しハイ。一見バラバラだが、共通点は「素朴で、ちょっとクセがある」こと。マサシ自身もまた、そういう人だ。レバレジーズ時代のシニアコンサルから、DIKの人事へ転身したのも、同じ嗜好の延長線。' },
        { title: 'いつかの古民家カフェ', body: '「でかい犬と古民家カフェをやりたい」——マサシが酒に酔うと必ず話す夢。誰かが「それいいね」と返すと、本当に嬉しそうに目を輝かせる。今はまだ夢だけれど、人の心を解す吟遊詩人が辿り着く場所は、きっと、誰かが集まれる温かい場所だろう。' },
        { title: '弾き語りの起源', body: 'マサシが弾き語りを始めたのは、大学時代の失恋がきっかけ。気持ちを言葉にできない自分を、ギターが代弁してくれた。それから誰かの感情を歌に変える楽しさを知り、人事の仕事に流れ着いた。歌うことと採用面接、根は同じ。「人の本当の声を、引き出す」のが彼の役目。' },
        { title: '古民家カフェの場所', body: '実はマサシ、古民家カフェの候補地まで決めている。山梨の北杜あたり、井戸とでかい犬小屋付き。週末だけ開けるイメージ。「人事を引退したら、本当にやる」——本人は半分本気、半分冗談で言うが、目は本気。いつか客として遊びに行ける日を、皆密かに待っている。' },
      ] },
    { id: '05', slug: 'kanba',    real: '神波将宏',
      name: '三足のわらじ・カンバ', faction: '星霊学院',
      role: 'ブランド錬金術師', skill: '幻惑のマーケティング',
      voice: '三つの顔を持つ私を、見抜けるかな。',
      stories: [
        { title: 'DIKマーケ・法律事務所・自社', body: '三足のわらじ——DIK & Companyのマーケ担当、Authense法律事務所マーケ部の責任者、ルーツオン株式會社の代表。三つの会社の顔を、それぞれ別人のように使い分ける。本人いわく「日替わりで自分が変わるのが、新鮮で楽しい」。' },
        { title: '薬剤師という裏設定', body: '実は薬剤師免許を持つ。マーケティングの世界で「薬剤師」と名乗ると驚かれるが、本人にとっては「ただの過去」。「薬の話は聞かないで」と笑うが、実は健康相談には密かに乗ってくれる優しい人。' },
        { title: 'ウイスキーの夜', body: 'ウイスキーが趣味。バーで一人、琥珀色のグラスを傾ける時、カンバは三つの顔のすべてから解放される。「マーケでも、責任者でも、代表でもない、ただの自分」——その時間が、実は彼の戦略の源泉。複雑な人ほど、シンプルな夜を必要としている。' },
        { title: 'ブランドの極意', body: 'カンバの考えるブランディングは、「足し算ではなく、引き算」。何を打ち出すかより、何を捨てるか。三足のわらじ生活で学んだのは、「全部やろうとすると何も残らない」現実。だからこそ、提案先には「やらないこと」を先に決めさせる——それがカンバ流の戦略。' },
        { title: '三社で見えた共通点', body: '法律事務所もコンサル会社も自社事業も、結局同じだった。「人を信じて、責任を引き受ける」。業種は違えど、本質は変わらない。三足のわらじを履き続けたカンバが見つけた、たった一つの共通項。それが彼の仕事観の核になっている。' },
      ] },
    { id: '06', slug: 'fukuda',   real: '福田凜',
      name: '七つ巻物の弟子・フクダ', faction: '独立勢力',
      role: '自動化の修行者', skill: '七巻同時詠唱',
      voice: '私、絶対に諦めないので！',
      stories: [
        { title: '明治大学経営学部、4年生', body: '明治大学経営学部4年生。就活も大詰めの中、合宿に飛び込んだ。「学生のうちに、できるだけ学びたい」——フクダの貪欲さは、教科書の中にも、社会の現場にも、満遍なく向けられている。' },
        { title: 'ナルトを見始めた理由', body: 'アニメ「ナルト」を最近見始めた。「諦めねえ、それが俺の忍道だ」——主人公の口癖が、フクダの心に刺さった。自動化7項目を全部マスターするまで、彼女は絶対に諦めない。修行は孤独だが、巻物が味方だ。' },
        { title: '7つの巻物の意味', body: '連携・PPT・議事録・日程・Zoom・メール・タスク管理——7つの自動化テーマを、それぞれ「巻物」として身につける。一つずつ唱えるのではなく、いつかは「七巻同時詠唱」を会得して、すべての面倒事を一瞬で消し去る——それがフクダの長期目標。' },
        { title: '就活の決意', body: 'フクダが就活で大事にしているのは「自分の頭で考える環境か」。受け身で言われたことをやる職場には、惹かれない。「面倒くさい」と思える瞬間こそ、自分の頭で工夫の余地を見つけられるチャンス——その気づきは、合宿でClaudeを触ったから得られた。' },
        { title: '7項目の先', body: '自動化7項目を全部マスターした後、フクダは何を目指すのか? 本人は「次は他人の面倒も消したい」と言う。誰かのストレスを減らせる存在になりたい——それが彼女の見えない第8の巻物。修行は、自分の為だけでは終わらない。' },
      ] },
    { id: '07', slug: 'fujii',    real: '藤井月花',
      name: '月花の物語編者・フジイ', faction: '独立勢力',
      role: '旅と書物の使い手', skill: '次章への栞',
      voice: '次のページを、めくりましょう。',
      stories: [
        { title: '横浜国立大学・経営学部', body: '横浜国立大学経営学部。海の見えるキャンパスで、フジイは小説と経営理論を同じ熱量で読んだ。「物語の構造と、組織の構造は、似ている」——そう気づいた時、彼女の進路が定まった。' },
        { title: '2025年4月、DIKジョイン', body: '2025年4月、DIK & Companyにジョイン。新卒1年目とは思えぬ落ち着きで、TODO整理・日程調整・文案作成を捌く。「物語の編者」と自称するのは、業務もまた一つの長編小説だと信じているから。今日のタスクは、明日の章に続いている。' },
        { title: '旅と読書の癖', body: '休日は旅か読書。新しい街に着くと必ず本屋に寄り、地元の小説を一冊買う。読み終えると、本の最後に旅の日付と感想を一言メモする。彼女の本棚は、世界中の街と物語が並ぶ宝物棚。次のページは、いつもまだ書かれていない。' },
        { title: '旅で出会った人', body: '京都の小さな喫茶店で、フジイは一人の老婦人と話したことがある。「物語は、終わるためではなく、続けるために書くものよ」——その言葉が、今の彼女の働き方を形作った。「終わらせる」ではなく「次に渡す」、それが文案作成の極意。' },
        { title: '編者として書きたいもの', body: 'いつか自分でも小説を書きたい——フジイは密かにそう思っている。テーマは「日常の中にある、小さな奇跡」。今は経営の現場で「奇跡」を見続けている時期。素材が揃ったら、いつか月明かりの下で、最初のページを書き始めるだろう。' },
      ] },
    { id: '08', slug: 'miyamoto', real: '宮本紗良',
      name: '記憶の蒐集家・ミヤモト', faction: '星霊学院',
      role: '思い出の標本士', skill: 'シール・ティアラ',
      voice: '全部、丁寧に貼っていきます。',
      stories: [
        { title: 'シール帳の歴史', body: '幼い頃から続く、シール帳の蒐集。今では何冊あるか分からないが、すべての帳面の最初のページに「集めた日付」「貰った人」「気持ち」が几帳面に記されている。ミヤモトにとってシールは、「あの日の自分」を貼り付ける標本でもある。' },
        { title: '立教大学・英米文学', body: '立教大学文学部・英米文学専修。シェイクスピアもオースティンも、ミヤモトにとっては「先輩の蒐集家」。記録を残し、世代を超えて伝える——文学者と自分の仕事は、本質的に同じだと密かに思っている。' },
        { title: 'KOSとDIK、二つの社長室', body: '合同会社KOSの社長室アシスタント/COO候補、そしてDIK & Companyのコンサルタント。両方とも「経営の核」に近い場所で、議事録から要約まで、すべてを丁寧に「貼って」いく。彼女の手元を通った会議は、必ず未来へ繋がる記録になる。' },
        { title: '文学から学んだこと', body: '英米文学を学んで知ったのは、「人は同じ感情を、千通りの言葉で表現する」という事実。だからミヤモトは、議事録でも単なる記録ではなく、「その人らしい言葉」を残そうとする。後で読み返した時、誰の発言かが「言葉の選び方」で分かる議事録——それが理想。' },
        { title: 'シール帳の最終形', body: 'いつかミヤモトは、自分のシール帳を「思い出の博物館」として人に見せたいと思っている。一冊一冊が、その時代の流行・感情・関係性を物語る。学術的には価値はないかもしれない。でも個人史として、それは間違いなく宝物。彼女の人生そのものが、貼り付けられている。' },
      ] },
    { id: '09', slug: 'oshima',   real: '大島龍',
      name: '次元を編む者・オオシマ', faction: '星霊学院',
      role: 'フロントエンド構築術師', skill: 'リアクト・リビルド',
      voice: '二日酔いでも、コードは書ける。',
      stories: [
        { title: 'アクトデザインから、ニジボックスへ', body: '2017年から2022年までアクトデザインラボ。2022年から株式会社ニジボックス。フロントエンド一筋のキャリアの中で、オオシマは「ピクセル単位の正義」を体得した。一ピクセルのズレも見逃さぬ目を持つ、コードの錬金術師。' },
        { title: 'React/TypeScript/Next.jsの三神器', body: 'React・TypeScript・Next.js——フロントエンドの三神器を自在に操る。中でもReactのコンポーネント設計には強いこだわりがあり、「美しいコンポーネントは、美しい組織図と同じ」が口癖。彼の書くコードは、後から読む人へのラブレターだ。' },
        { title: 'サッカーと二日酔い', body: '趣味はサッカー。週末の試合の翌朝はだいたい二日酔い。だが、コードは書ける——それがオオシマのプロ意識。「眠くてもサッカーボールは蹴れるし、酔っててもバグは修正できる」。型システムが守ってくれるから、と謙遜気味に笑う。' },
        { title: '失敗から学んだ設計', body: '駆け出しの頃、オオシマは「神コンポーネント」を作って先輩に大目玉を食らった。一つのファイルに全部詰め込んで、後から触れない代物。それ以来「責務を一つに」を信条にしている。失敗が一番の師匠——本人が新人によく言うセリフ。' },
        { title: 'フロントエンドの未来', body: 'AIがコードを書く時代。それでもオオシマは「フロントエンドは消えない」と確信する。なぜなら、人とソフトウェアの境界は永遠にUIだから。AIに任せるのは退屈な部分、人が磨くのは「触り心地」。それが彼の予言。' },
      ] },
    { id: '10', slug: 'higuchi',  real: '樋口廉',
      name: '柴の番人・ヒグチ', faction: '独立勢力',
      role: '獣使い見習い', skill: 'Wan Wan ハウンド召喚',
      voice: 'Wan! Wan! 柴犬、最高ッ！',
      stories: [
        { title: '筑波の人文・文化学群', body: '筑波大学の人文・文化学群——人類の営みを学ぶ場で、ヒグチは「人類で一番偉いのは柴犬を作った人」と密かに思っている。論文も柴犬関連で書きたかったが、教授に止められた経験がある。今でも諦めていない。' },
        { title: '柴犬への揺るぎなき愛', body: '柴犬を見ると必ず立ち止まる。すれ違いざまに「Wan!」と心の中で挨拶する。柴犬の飼い主には自然と話しかけ、犬種の話で30分は持たせる特技を持つ。番人としての矜持は、「柴犬の幸福を、世界の片隅から見守る」ことにある。' },
        { title: 'DIKの新人として', body: '株式会社DIK & Companyに新卒で入社。社内で「柴犬の話なら樋口」と認知され始めている。仕事も真面目で、柴犬への集中力が業務にも転移する。集中したら止まらない——犬も人も、ヒグチには区別がない。' },
        { title: '柴犬を飼う夢', body: 'いつか自分で柴犬を飼いたい——ヒグチの最大の人生目標。名前は「もみじ」か「あずき」で迷っている。一人暮らしの広めの部屋を借りる準備を、密かに始めている。「Wan! Wan!」と毎朝挨拶される朝が、彼の理想の風景。' },
        { title: '番人としての将来', body: 'いつか柴犬保護施設を支援する仕事をしたい——それがヒグチの密かな野望。本業は社会人としての成長を続けつつ、貯金と人脈を地道に育てている。番人とは、ただ眺める者ではない、いつか守る側へ回る者——その日のために、今は学んでいる。' },
      ] },
    { id: '11', slug: 'horie',    real: '堀江陵太',
      name: '氷峰の建築家・ホリエ', faction: '五大国',
      role: '雪壁構築の技師', skill: 'スノーリッジ・スライド',
      voice: '白銀の上を、滑るように。',
      stories: [
        { title: '東京理科大学・建築学科4年', body: '東京理科大学工学部建築学科4年生。卒業設計の時期、ホリエは「雪山の建築」をテーマに選んだ。教授には「現実離れしている」と笑われたが、本人は本気。スノーボーダーが愛する斜面と、建築家が描く構造の交点を探している。' },
        { title: 'スノーボードの哲学', body: 'スノボは趣味であり、設計思想の源。「雪面はカーブで構成されている」——その感覚を、ホリエは建築の曲線美に翻訳する。「真っ直ぐな建物より、滑るように繋がる空間が好き」。いつか北海道に、彼の設計したロッジが建つかもしれない。' },
        { title: '建築学科の同期たち', body: '建築学科の同期は、皆それぞれの「理想の建物」を持っている。ホリエはみんなの設計図を見るのが好き。「自分が描けない世界を、誰かが描いている」——それが理科大の良さだと、卒業を控えた今、しみじみ感じている。' },
        { title: '卒業設計の本質', body: '卒業設計に取り組む中で、ホリエは「建築とは祈りである」と気づいた。誰がそこに住むか、何を感じるか——機能ではなく感情を設計する。教授に「現実離れ」と言われた雪山ロッジも、誰かの幸せな冬を願う祈り。設計図はラブレターでもある。' },
        { title: '建築家として', body: '将来は「人が時間を忘れる空間」を作りたい。雪山でも、街中でも、商業施設でも。建築は競争ではない、誰かの一日に静かに溶け込む装置——それがホリエの目指す姿。卒業後の最初の現場が、彼の長い旅の始まりになる。' },
      ] },
    { id: '12', slug: 'akai',     real: '赤井慧',
      name: '世界を旅した注ぎ手・アカイ', faction: '独立勢力',
      role: '黄金泡の伝道師', skill: 'トゥクトゥク・三度注ぎ',
      voice: 'どこでも、注ぎたての一杯を。',
      stories: [
        { title: '物理学修士から、ビールの世界へ', body: '2019年に物理学修士号取得。誰もが「研究者の道」を期待した。だがアカイが選んだのは、世界一周の旅。「素粒子も発泡も、本質は『見えない動き』。物理を知っているからこそ、ビールの泡の動きが見える」——常識を覆す視点が、彼の出発点。' },
        { title: 'カザフスタンでの発見', body: '世界一周の旅の途中、カザフスタンで「樽生持ち帰りサービス」と出会った。「日本にもこれを持ち帰りたい」——その瞬間、人生の方向が確定した。沖縄生まれ千葉育ちの青年が、カザフスタンの片隅で、未来を掴んだ。運命の出会いは、いつも遠くにある。' },
        { title: 'ベルギーとチェコの修行', body: '2024年5月、ベルギーとチェコで本格的な注ぎ修行。「同じビールでも、注ぎ方で味が変わる」——本場の職人たちから、その技を直接学んだ。トゥクトゥクで全国を回るアカイの一杯には、その修行の重みが、毎回静かに溶けている。' },
        { title: 'トゥクトゥクの旅路', body: 'トゥクトゥク・ビアを担いで、アカイは全国を回る。お祭り、結婚式、企業イベント。「移動するビアサーバー」という発想は、世界一周の旅で身につけた「持ち運ぶ思想」の延長。場所が変わると、ビールの味も変わる——客の表情と一緒に。' },
        { title: '黄金泡の伝道', body: '「注ぎたての樽生ビールを、文化に」——アカイの最終目標。一杯ごとに、誰かの人生の節目が刻まれる。結婚式の乾杯、転職祝い、ふとした再会の夜。彼の注ぐ一杯は、ただの飲み物ではない、記憶の触媒。物理学者が辿り着いた、最も人間的な仕事。' },
      ] }
  ];

  function imgPath(c, mode) {
    return `images/gasshuku/${c.id}_${c.slug}_${mode === 'real' ? 'real' : 'fantasy'}.png`;
  }

  // ====== 合宿図鑑 + 凸システム (localStorage + Firebase で端末間連携) ======
  const COLLECT_KEY = 'prism-gasshuku-collected';
  const DUP_KEY = 'prism-gasshuku-dups';
  function loadCollected() {
    try { return JSON.parse(localStorage.getItem(COLLECT_KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function saveCollected(d) {
    try { localStorage.setItem(COLLECT_KEY, JSON.stringify(d)); } catch (e) {}
  }
  function loadDups() {
    try { return JSON.parse(localStorage.getItem(DUP_KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function saveDups(d) {
    try { localStorage.setItem(DUP_KEY, JSON.stringify(d)); } catch (e) {}
  }
  function getDup(charId) { return loadDups()[charId] || 0; }
  function recordDup(charId) {
    const d = loadDups();
    d[charId] = (d[charId] || 0) + 1;
    saveDups(d);
    scheduleCloudSync();
  }
  function recordCollected(c, mode) {
    const d = loadCollected();
    const k = `${c.id}_${mode}`;
    if (!d[k]) {
      d[k] = true;
      saveCollected(d);
      scheduleCloudSync();
    }
    renderGasshukuGallery();
  }

  // ===== Firebase 同期 (既存 'prism-gacha' app 流用、独立パス /gasshukuCollected) =====
  function getFbApp() {
    if (typeof firebase === 'undefined' || !firebase.apps) return null;
    try { return firebase.app('prism-gacha'); } catch (e) { return null; }
  }
  function getCurrentUid() {
    const app = getFbApp();
    if (!app) return null;
    try { const u = app.auth().currentUser; return u ? u.uid : null; }
    catch (e) { return null; }
  }
  async function syncFromCloud() {
    const uid = getCurrentUid();
    const app = getFbApp();
    if (!uid || !app) return;
    try {
      const db = app.database();
      // 合宿図鑑 (collected)
      const snap1 = await db.ref('prism-gacha/users/' + uid + '/gasshukuCollected').once('value');
      const cloudCol = snap1.val() || {};
      const localCol = loadCollected();
      const mergedCol = { ...cloudCol, ...localCol };
      saveCollected(mergedCol);
      renderGasshukuGallery();
      // 凸 (dups) - max マージ
      const snap2 = await db.ref('prism-gacha/users/' + uid + '/gasshukuDups').once('value');
      const cloudDup = snap2.val() || {};
      const localDup = loadDups();
      const mergedDup = {};
      const allKeys = new Set([...Object.keys(cloudDup), ...Object.keys(localDup)]);
      for (const k of allKeys) {
        mergedDup[k] = Math.max(cloudDup[k] || 0, localDup[k] || 0);
      }
      saveDups(mergedDup);
      // local に変化があれば cloud にも反映
      const colDirty = Object.keys(localCol).some(k => !cloudCol[k]);
      const dupDirty = Object.keys(mergedDup).some(k => (cloudDup[k] || 0) !== mergedDup[k]);
      if (colDirty) await db.ref('prism-gacha/users/' + uid + '/gasshukuCollected').set(mergedCol);
      if (dupDirty) await db.ref('prism-gacha/users/' + uid + '/gasshukuDups').set(mergedDup);
    } catch (e) {
      console.warn('[gasshuku] cloud sync (read) failed:', e);
    }
  }
  let __saveTimer = null;
  function scheduleCloudSync() {
    if (__saveTimer) clearTimeout(__saveTimer);
    __saveTimer = setTimeout(async () => {
      const uid = getCurrentUid();
      const app = getFbApp();
      if (!uid || !app) return;
      try {
        const db = app.database();
        await db.ref('prism-gacha/users/' + uid + '/gasshukuCollected').set(loadCollected());
        await db.ref('prism-gacha/users/' + uid + '/gasshukuDups').set(loadDups());
      } catch (e) {
        console.warn('[gasshuku] cloud sync (write) failed:', e);
      }
    }, 800);
  }
  function watchAuth() {
    const app = getFbApp();
    if (!app) {
      // Firebase SDK 未初期化 → 1秒後に再試行 (最大30回)
      if (!watchAuth.tries) watchAuth.tries = 0;
      if (++watchAuth.tries < 30) setTimeout(watchAuth, 1000);
      return;
    }
    try {
      app.auth().onAuthStateChanged(user => {
        if (user) syncFromCloud();
      });
      // 初回 (もし既にログイン済なら即同期)
      if (app.auth().currentUser) syncFromCloud();
    } catch (e) {
      console.warn('[gasshuku] watchAuth failed:', e);
    }
  }
  function renderGasshukuGallery() {
    const grid = document.getElementById('gasshuku-gallery-grid');
    const cntEl = document.getElementById('gasshuku-gallery-count');
    if (!grid) return;
    const d = loadCollected();
    grid.innerHTML = '';
    let count = 0;
    POOL.forEach(c => {
      ['real', 'fantasy'].forEach(mode => {
        const k = `${c.id}_${mode}`;
        const got = !!d[k];
        if (got) count++;
        const cell = document.createElement('div');
        cell.className = 'gasshuku-gallery-cell' + (got ? ' got' : ' locked');
        cell.title = `${c.name} (${c.real}) — ${mode === 'real' ? '本人' : 'ファンタジー'}`;
        if (got) {
          cell.innerHTML = `
            <img src="${imgPath(c, mode)}" alt="${c.name}">
            <div class="gasshuku-cell-mode">${mode === 'real' ? '📷' : '🌈'}</div>
          `;
          cell.style.cursor = 'pointer';
          cell.addEventListener('click', () => openDetail(c, mode));
        } else {
          cell.innerHTML = `
            <div class="gasshuku-cell-silhouette">?</div>
            <div class="gasshuku-cell-mode">${mode === 'real' ? '📷' : '🌈'}</div>
          `;
        }
        grid.appendChild(cell);
      });
    });
    if (cntEl) cntEl.textContent = String(count);
  }

  // ====== 詳細モーダル (合宿用、独立) ======
  const FACTION_COLOR = {
    '星霊学院': '#7dd3fc',
    '五大国':   '#fcd34d',
    '原虹':     '#f472b6',
    '独立勢力': '#a3e635'
  };
  let currentDetail = null;
  let currentDetailMode = 'fantasy';
  function isCollected(c, mode) {
    const d = loadCollected();
    return !!d[`${c.id}_${mode}`];
  }
  function ensureDetailModal() {
    let m = document.getElementById('gasshuku-detail-modal');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'gasshuku-detail-modal';
    m.className = 'gasshuku-detail-modal';
    m.setAttribute('hidden', '');
    m.innerHTML = `
      <div class="gasshuku-detail-backdrop"></div>
      <div class="gasshuku-detail-card">
        <button class="gasshuku-detail-close" aria-label="閉じる">×</button>
        <div class="gasshuku-detail-img-wrap" id="gasshuku-detail-img-wrap">
          <img class="gasshuku-detail-img" id="gasshuku-detail-img" alt="">
          <div class="gasshuku-detail-zoom-hint">🔍 タップで拡大</div>
        </div>
        <div class="gasshuku-detail-meta">
          <div class="gasshuku-detail-tier">UR</div>
          <div class="gasshuku-detail-name" id="gasshuku-detail-name"></div>
          <div class="gasshuku-detail-real" id="gasshuku-detail-real"></div>
          <div class="gasshuku-detail-faction" id="gasshuku-detail-faction"></div>
          <div class="gasshuku-detail-skill" id="gasshuku-detail-skill"></div>
          <div class="gasshuku-detail-voice" id="gasshuku-detail-voice"></div>
          <div class="gasshuku-detail-toggle">
            <button class="gasshuku-detail-tbtn" data-mode="fantasy">🌈 ファンタジー</button>
            <button class="gasshuku-detail-tbtn" data-mode="real">📷 本人</button>
          </div>
          <div class="gasshuku-detail-locknote" id="gasshuku-detail-locknote" hidden></div>
          <div class="gasshuku-detail-stories" id="gasshuku-detail-stories"></div>
        </div>
      </div>
    `;
    document.body.appendChild(m);
    m.querySelector('.gasshuku-detail-close').addEventListener('click', closeDetail);
    m.querySelector('.gasshuku-detail-backdrop').addEventListener('click', closeDetail);
    m.querySelectorAll('.gasshuku-detail-tbtn').forEach(b => {
      b.addEventListener('click', () => switchDetailImage(b.dataset.mode));
    });
    m.querySelector('#gasshuku-detail-img-wrap').addEventListener('click', () => {
      if (currentDetail) openLightbox(currentDetail, currentDetailMode);
    });
    return m;
  }
  function switchDetailImage(mode) {
    if (!currentDetail) return;
    // 未獲得モードへの切替は阻止
    if (!isCollected(currentDetail, mode)) {
      const note = document.getElementById('gasshuku-detail-locknote');
      if (note) {
        note.hidden = false;
        note.textContent = `🔒 ${mode === 'fantasy' ? '🌈 ファンタジー' : '📷 本人'} 版はまだ召喚していません`;
        setTimeout(() => { note.hidden = true; }, 2200);
      }
      return;
    }
    currentDetailMode = mode;
    const img = document.getElementById('gasshuku-detail-img');
    img.src = imgPath(currentDetail, mode);
    document.querySelectorAll('.gasshuku-detail-tbtn').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === mode);
    });
  }
  function openDetail(c, defaultMode) {
    currentDetail = c;
    const m = ensureDetailModal();
    m.removeAttribute('hidden');
    m.classList.add('active');
    document.getElementById('gasshuku-detail-name').textContent = c.name;
    document.getElementById('gasshuku-detail-real').textContent = `本人: ${c.real}（${c.role}）`;
    const fac = document.getElementById('gasshuku-detail-faction');
    fac.textContent = `所属: ${c.faction}`;
    fac.style.color = FACTION_COLOR[c.faction] || '#fff';
    document.getElementById('gasshuku-detail-skill').textContent = `🌟 ${c.skill}`;
    document.getElementById('gasshuku-detail-voice').textContent = `「${c.voice}」`;
    // 凸秘話セクション (凸数に応じて公開、未開放はロック表示)
    const storiesEl = document.getElementById('gasshuku-detail-stories');
    if (storiesEl) {
      const stories = Array.isArray(c.stories) ? c.stories : [];
      if (stories.length === 0) {
        storiesEl.innerHTML = '';
      } else {
        const dups = getDup(c.id); // 0=初回(Lv.1のみ), 1=Lv.2解放, 2=Lv.3解放...
        const unlockedCount = Math.min(stories.length, Math.max(1, dups + 1));
        let h = `<div class="gasshuku-stories-head">✦ 秘話 <span class="gasshuku-stories-progress">${unlockedCount}/${stories.length} 解放 (現在 ${dups}凸)</span></div>`;
        stories.forEach((s, i) => {
          const lv = i + 1;
          if (lv <= unlockedCount) {
            h += `<div class="gasshuku-story">
              <div class="gasshuku-story-title"><span class="gasshuku-story-lv">Lv.${lv}</span>${s.title}</div>
              <div class="gasshuku-story-body">${s.body}</div>
            </div>`;
          } else {
            const need = i; // Lv.2 → 1凸、 Lv.3 → 2凸
            h += `<div class="gasshuku-story locked">
              <div class="gasshuku-story-title"><span class="gasshuku-story-lv locked">🔒 Lv.${lv}</span>${need}凸で解放</div>
              <div class="gasshuku-story-body locked">??????????????</div>
            </div>`;
          }
        });
        storiesEl.innerHTML = h;
      }
    }
    // トグルボタンの獲得状態を反映 (未獲得は鍵マーク+disabled風)
    document.querySelectorAll('.gasshuku-detail-tbtn').forEach(b => {
      const got = isCollected(c, b.dataset.mode);
      b.classList.toggle('locked', !got);
      const baseLabel = b.dataset.mode === 'fantasy' ? '🌈 ファンタジー' : '📷 本人';
      b.textContent = got ? baseLabel : `🔒 ${baseLabel}`;
    });
    const note = document.getElementById('gasshuku-detail-locknote');
    if (note) note.hidden = true;
    // defaultMode が未獲得なら獲得済みモードにフォールバック
    let openMode = defaultMode || 'fantasy';
    if (!isCollected(c, openMode)) {
      const alt = openMode === 'fantasy' ? 'real' : 'fantasy';
      if (isCollected(c, alt)) openMode = alt;
    }
    switchDetailImage(openMode);
  }
  function closeDetail() {
    const m = document.getElementById('gasshuku-detail-modal');
    if (m) {
      m.classList.remove('active');
      m.setAttribute('hidden', '');
    }
  }

  // ====== 画像拡大ライトボックス ======
  function ensureLightbox() {
    let lb = document.getElementById('gasshuku-lightbox');
    if (lb) return lb;
    lb = document.createElement('div');
    lb.id = 'gasshuku-lightbox';
    lb.className = 'gasshuku-lightbox';
    lb.setAttribute('hidden', '');
    lb.innerHTML = `
      <button class="gasshuku-lightbox-close" aria-label="閉じる">×</button>
      <img class="gasshuku-lightbox-img" id="gasshuku-lightbox-img" alt="">
    `;
    document.body.appendChild(lb);
    lb.addEventListener('click', closeLightbox);
    return lb;
  }
  function openLightbox(c, mode) {
    const lb = ensureLightbox();
    lb.removeAttribute('hidden');
    lb.classList.add('active');
    document.getElementById('gasshuku-lightbox-img').src = imgPath(c, mode);
  }
  function closeLightbox() {
    const lb = document.getElementById('gasshuku-lightbox');
    if (lb) {
      lb.classList.remove('active');
      lb.setAttribute('hidden', '');
    }
  }

  // ====== 結果モーダル (合宿用、独立) ======
  function ensureResultModal() {
    let m = document.getElementById('gasshuku-result-modal');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'gasshuku-result-modal';
    m.className = 'gasshuku-result-modal';
    m.setAttribute('hidden', '');
    m.innerHTML = `
      <div class="gasshuku-result-backdrop"></div>
      <div class="gasshuku-result-stage">
        <button class="gasshuku-result-close" aria-label="閉じる">×</button>
        <div class="gasshuku-result-title">🎌 合宿ガチャ結果</div>
        <div class="gasshuku-result-summary" id="gasshuku-result-summary"></div>
        <div class="gasshuku-result-grid" id="gasshuku-result-grid"></div>
      </div>
    `;
    document.body.appendChild(m);
    m.querySelector('.gasshuku-result-close').addEventListener('click', closeResultModal);
    m.querySelector('.gasshuku-result-backdrop').addEventListener('click', closeResultModal);
    return m;
  }
  function showResultModal(results, imgMode) {
    const m = ensureResultModal();
    m.removeAttribute('hidden');
    m.classList.add('active');
    const summary = document.getElementById('gasshuku-result-summary');
    const grid = document.getElementById('gasshuku-result-grid');
    summary.textContent = `🌈 UR ×${results.length} 確定 / ${imgMode === 'real' ? '📷 本人モード' : '🌈 ファンタジーモード'}`;
    grid.innerHTML = '';
    results.forEach(r => {
      const card = document.createElement('div');
      card.className = 'gasshuku-result-card';
      card.innerHTML = `
        <img class="gasshuku-result-img" src="${r.img}" alt="${r.name}">
        <div class="gasshuku-result-tier">UR</div>
        <div class="gasshuku-result-name">${r.name}</div>
        <div class="gasshuku-result-real">${r._gasshukuReal || ''}</div>
      `;
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => openDetail(r._gasshukuChar, r._gasshukuMode));
      grid.appendChild(card);
    });
  }
  function closeResultModal() {
    const m = document.getElementById('gasshuku-result-modal');
    if (m) {
      m.classList.remove('active');
      m.setAttribute('hidden', '');
    }
    // 結果閉じたタイミングで未ログインならアカウント案内
    setTimeout(() => maybeShowGasshukuAccountInvite(), 200);
  }

  // ====== 合宿用アカウント案内モーダル (Aパート) ======
  function ensureAccountInviteModal() {
    let m = document.getElementById('gasshuku-account-invite');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'gasshuku-account-invite';
    m.className = 'gasshuku-account-invite';
    m.setAttribute('hidden', '');
    m.innerHTML = `
      <div class="gasshuku-invite-backdrop"></div>
      <div class="gasshuku-invite-card">
        <button class="gasshuku-invite-close" aria-label="閉じる">×</button>
        <div class="gasshuku-invite-icon">🌈</div>
        <div class="gasshuku-invite-title">合宿の思い出を、ずっと残しませんか？</div>
        <div class="gasshuku-invite-body">
          <p>今日引いた合宿ガチャの結果は、<br><strong>このブラウザを閉じる/別端末では消えてしまいます</strong>。</p>
          <p>アカウントを作ると…</p>
          <ul>
            <li>📱 別端末（スマホ・自宅PC）からも図鑑が見られる</li>
            <li>💾 ブラウザ消去しても記録が残る</li>
            <li>🌟 通常版「Prismaera」の本編ストーリーや相関図も遊べる</li>
          </ul>
          <p class="gasshuku-invite-note">※ ニックネーム＋合言葉だけでOK・無料・1分で完了</p>
        </div>
        <div class="gasshuku-invite-actions">
          <button class="gasshuku-invite-btn primary" id="gasshuku-invite-signup">✨ アカウントを作る</button>
          <button class="gasshuku-invite-btn ghost" id="gasshuku-invite-later">あとで</button>
        </div>
      </div>
    `;
    document.body.appendChild(m);
    m.querySelector('.gasshuku-invite-close').addEventListener('click', closeAccountInvite);
    m.querySelector('.gasshuku-invite-backdrop').addEventListener('click', closeAccountInvite);
    m.querySelector('#gasshuku-invite-later').addEventListener('click', closeAccountInvite);
    m.querySelector('#gasshuku-invite-signup').addEventListener('click', () => {
      closeAccountInvite();
      // 既存のアカウントモーダルを開いて signup タブへ
      try {
        if (typeof showAccountModal === 'function') showAccountModal();
        if (typeof switchAccountTab === 'function') switchAccountTab('signup');
      } catch (e) { console.warn(e); }
    });
    return m;
  }
  function maybeShowGasshukuAccountInvite() {
    const uid = getCurrentUid();
    if (uid) return; // ログイン済なら案内不要
    const m = ensureAccountInviteModal();
    m.removeAttribute('hidden');
    m.classList.add('active');
  }
  function closeAccountInvite() {
    const m = document.getElementById('gasshuku-account-invite');
    if (m) {
      m.classList.remove('active');
      m.setAttribute('hidden', '');
    }
  }

  // ====== 合宿ガチャ実行統計 (B2パート: 集計のみ) ======
  const DEVICE_ID_KEY = 'prism-gasshuku-device-id';
  function getDeviceId() {
    let id = null;
    try { id = localStorage.getItem(DEVICE_ID_KEY); } catch (e) {}
    if (!id) {
      id = 'dev_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      try { localStorage.setItem(DEVICE_ID_KEY, id); } catch (e) {}
    }
    return id;
  }
  function todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  async function logRollToStats(count) {
    const app = getFbApp();
    if (!app) return;
    try {
      const day = todayKey();
      const dev = getDeviceId();
      const db = app.database();
      const dayRef = db.ref('prism-gacha/gasshukuStats/' + day);
      // 集計増分 (transaction で安全に increment)
      dayRef.child('totalRolls').transaction(c => (c || 0) + 1);
      dayRef.child('totalSummons').transaction(c => (c || 0) + count);
      // device エントリ
      const devRef = dayRef.child('devices/' + dev);
      devRef.child('totalRolls').transaction(c => (c || 0) + 1);
      devRef.child('lastRollAt').set(Date.now());
      const uid = getCurrentUid();
      if (uid) devRef.child('uid').set(uid);
    } catch (e) {
      console.warn('[gasshuku] stats log failed:', e);
    }
  }

  // 過去ゲスト遡及アップロード: 起動時に localStorage 既存データを一度だけ Firebase に送る
  const RETRO_FLAG = 'prism-gasshuku-retro-uploaded';
  async function uploadRetroactiveStats() {
    const app = getFbApp();
    if (!app) return;
    try {
      if (localStorage.getItem(RETRO_FLAG) === '1') return;
      const collected = loadCollected();
      const entryCount = Object.keys(collected).length;
      if (entryCount === 0) return; // 過去プレイなし → 何もしない
      const day = todayKey();
      const dev = getDeviceId();
      const db = app.database();
      const dayRef = db.ref('prism-gacha/gasshukuStats/' + day);
      const devRef = dayRef.child('devices/' + dev);
      // この端末を初回識別 (retroactive=true で「過去から復元」と分かる)
      devRef.child('retroactive').set(true);
      devRef.child('retroactiveCollectedCount').set(entryCount);
      devRef.child('retroactiveAt').set(Date.now());
      const uid = getCurrentUid();
      if (uid) devRef.child('uid').set(uid);
      localStorage.setItem(RETRO_FLAG, '1');
      console.log('[gasshuku] retroactive upload OK (entries=' + entryCount + ')');
    } catch (e) {
      console.warn('[gasshuku] retro upload failed:', e);
    }
  }

  function rollAll(count) {
    // 確率は一律、重複OK
    const out = [];
    for (let i = 0; i < count; i++) {
      out.push(POOL[Math.floor(Math.random() * POOL.length)]);
    }
    return out;
  }

  // 既存 summonOne 互換の result オブジェクトを構築
  // applyPull を呼ばないので state は一切更新されない（履歴/cloud にも残らない）
  function buildResult(c, imgMode) {
    const mode = imgMode === 'real' ? 'real' : 'fantasy';
    return {
      tier: 'UR',
      season: 99,
      name: c.name,
      title: `${c.faction} / ${c.role}`,
      caption: c.voice,
      desc: `本人: ${c.real}\n所属: ${c.faction}\n役割: ${c.role}\nスキル: ${c.skill}`,
      img: imgPath(c, mode),
      isNew: false,
      dupCount: 0,
      dupMax: 0,
      dupGained: null,
      _gasshuku: true,
      _gasshukuChar: c,
      _gasshukuMode: mode,
      _gasshukuReal: c.real
    };
  }

  let gasshukuBusy = false;

  function setGachaBtnsDisabled(disabled) {
    const ids = ['btn-single', 'btn-ten'];
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.disabled = disabled; });
    document.querySelectorAll('.gasshuku-cta-btn').forEach(b => { b.disabled = disabled; });
  }

  async function startGasshukuRoll(imgMode, count) {
    if (gasshukuBusy) return;
    // 既存ガチャ実行中なら無視
    if (typeof window.busy !== 'undefined' && window.busy) return;
    gasshukuBusy = true;
    setGachaBtnsDisabled(true);
    document.body.classList.add('gasshuku-running');
    document.body.classList.add('gasshuku-mode-' + (imgMode === 'real' ? 'real' : 'fantasy'));

    const cv = document.getElementById('canvas') || document.querySelector('canvas');
    const resizeCanvas = () => {
      if (cv) { cv.width = window.innerWidth; cv.height = window.innerHeight; }
    };

    try {
      if (typeof skipRequested !== 'undefined') skipRequested = false;
      const stageEl = document.getElementById('stage');
      if (stageEl) stageEl.classList.add('active');
      if (typeof clearStage === 'function') clearStage();
      resizeCanvas();

      const chars = rollAll(count);
      const results = chars.map(c => buildResult(c, imgMode));
      window.__gasshukuLastResults = results;
      window.__gasshukuLastImgMode = imgMode;
      // 図鑑記録 (重複なし keyで) + 凸記録 (重複あり、 同じキャラ複数引きで凸増加)
      results.forEach(r => {
        recordCollected(r._gasshukuChar, r._gasshukuMode);
        recordDup(r._gasshukuChar.id);
      });
      // 統計ログ (Firebase 公開パス)
      logRollToStats(count);

      if (count === 1 || results.length === 1) {
        // 単発: doSingle 風
        await summonOne(results[0]);
      } else {
        // 10連: doTen 風 — 各召喚で clearStage、最後にフル演出
        const bestIdx = Math.floor(Math.random() * results.length);
        const best = results[bestIdx];
        const sequenced = [
          ...results.slice(0, bestIdx),
          ...results.slice(bestIdx + 1),
          best
        ];

        // 10連イントロ「× 10」
        if (typeof setStageTier === 'function') setStageTier('UR');
        if (typeof showTenIntro === 'function') showTenIntro();
        if (typeof play === 'function') play('se-summon', 'UR');
        await new Promise(r => setTimeout(r, 1100));

        // 全員UR確定なので全キャラ showLadder=true でフル演出 (本家10連は前9体軽量だが合宿版は全員派手)
        for (let i = 0; i < sequenced.length - 1; i++) {
          if (typeof clearStage === 'function') clearStage();
          resizeCanvas();
          if (typeof skipRequested !== 'undefined') skipRequested = false;
          await summonOne(sequenced[i], { showLadder: true });
        }

        // 最後の1体: フル演出
        if (typeof clearStage === 'function') clearStage();
        resizeCanvas();
        if (typeof skipRequested !== 'undefined') skipRequested = false;
        await new Promise(r => setTimeout(r, 250));
        await summonOne(best, { showLadder: true, forceSlow: true, tenFlag: true });

        // タップ待ち (最後の余韻)
        if (typeof showHintTap === 'function') showHintTap();
        const start = Date.now();
        while (typeof skipRequested !== 'undefined' && !skipRequested) {
          await new Promise(r => setTimeout(r, 80));
          if (Date.now() - start > 30000) break; // 安全弁
        }
        if (typeof hideHintTap === 'function') hideHintTap();
      }
    } catch (e) {
      console.error('[gasshuku] roll error:', e);
    } finally {
      if (typeof closeStage === 'function') closeStage();
      document.body.classList.remove('gasshuku-running');
      document.body.classList.remove('gasshuku-mode-real');
      document.body.classList.remove('gasshuku-mode-fantasy');
      gasshukuBusy = false;
      setGachaBtnsDisabled(false);
      // 結果モーダル表示 (10連時のみ。単発はキャラ自体が画面いっぱいに見えるため不要)
      let showedResult = false;
      if (typeof window !== 'undefined') {
        try {
          if (window.__gasshukuLastResults && window.__gasshukuLastResults.length > 1) {
            showResultModal(window.__gasshukuLastResults, window.__gasshukuLastImgMode);
            showedResult = true;
          }
        } catch (e) {}
      }
      // 単発の場合は結果モーダル無いので、ここで直接アカウント案内
      if (!showedResult) {
        setTimeout(() => maybeShowGasshukuAccountInvite(), 400);
      }
    }
  }

  // CTA ボタンに listener を bind + 図鑑初期描画
  function init() {
    document.querySelectorAll('.gasshuku-cta-btn').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', () => {
        const imgMode = btn.dataset.imgmode;
        const count = parseInt(btn.dataset.count, 10);
        startGasshukuRoll(imgMode, count);
      });
    });
    renderGasshukuGallery();
    // Firebase 認証監視を開始 (ログイン中ならクラウドから同期)
    watchAuth();
    // 過去ゲスト遡及アップロード (Firebase初期化後に少し待ってから)
    setTimeout(uploadRetroactiveStats, 1500);
    // Esc で合宿モーダルを閉じる (lightbox → detail → result の順で1つだけ閉じる)
    if (!document.body.dataset.gasshukuEscBound) {
      document.body.dataset.gasshukuEscBound = '1';
      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        const lb = document.getElementById('gasshuku-lightbox');
        if (lb && lb.classList.contains('active')) {
          closeLightbox();
          e.stopPropagation();
          return;
        }
        const dm = document.getElementById('gasshuku-detail-modal');
        if (dm && dm.classList.contains('active')) {
          closeDetail();
          e.stopPropagation();
          return;
        }
        const rm = document.getElementById('gasshuku-result-modal');
        if (rm && rm.classList.contains('active')) {
          closeResultModal();
          e.stopPropagation();
          return;
        }
        const im = document.getElementById('gasshuku-account-invite');
        if (im && im.classList.contains('active')) {
          closeAccountInvite();
          e.stopPropagation();
          return;
        }
      });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
