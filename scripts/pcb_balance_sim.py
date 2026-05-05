"""PCB バランス sim (野沢さん指示 2026-05-05 「いろんなデッキ組んで対戦を何回もやって」)

JavaScript engine を Python に簡易移植して、 複数デッキパターン × AI 段階 × 多数試合 で勝率検証。

簡略化:
  - 主要メカニクス (self_lane / adjacent / all_lanes / opp_self_lane / all_opp_lanes /
    buff_faction_lane / immediate_self / growth_self / freeze_opp_lane_top / freeze_opp_lane_all /
    silence_opp_lane_top / summon_token / chain_lane_self / golden_self_lane / cost_reduce_hand / stealth_self) をサポート
  - 凸は dupes=0 で sim (実際のユーザーは凸ありで強いが、 ベースバランスを見る)
  - AI: Hard レベル相当 (コスト最大 + 派閥シナジー + 劣勢補強 + 効果価値評価)
  - 試合 100 戦 × 各デッキペア
"""
import json, random, sys, io, copy
from collections import defaultdict, Counter
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

ROOT = Path(__file__).resolve().parent.parent
POOL_PATH = ROOT / 'cardgame' / 'data' / 'pool.json'
EFFECTS_PATH = ROOT / 'cardgame' / 'effects_override.json'
COMBOS_PATH = ROOT / 'cardgame' / 'combos.json'
LANE_EFFECTS_PATH = ROOT / 'cardgame' / 'lane_effects.json'

# ===== マスターデータ ロード =====
pool = json.load(open(POOL_PATH, encoding='utf-8'))
effects_override = json.load(open(EFFECTS_PATH, encoding='utf-8'))
combos = json.load(open(COMBOS_PATH, encoding='utf-8'))
lane_effects_all = json.load(open(LANE_EFFECTS_PATH, encoding='utf-8'))

# pool に effects_override をマージ
def merge_effects():
    by_name = {c['name']: c for c in pool}
    for name, ov in effects_override.items():
        if name.startswith('_'): continue
        if name in by_name:
            by_name[name]['effect'] = ov['effect']
            by_name[name]['effectText'] = ov.get('effectText', '')
    return by_name

ALL_CARDS = merge_effects()
print(f"[init] {len(ALL_CARDS)} cards loaded")

# ===== デッキパターン =====
def cards_by_filter(predicate, n=12):
    """predicate(card) → True のものから ランダムに n 枚"""
    pool = [c for c in ALL_CARDS.values() if predicate(c)]
    random.shuffle(pool)
    return pool[:n]

def make_default_deck():
    """cards.json デフォルト 12枚"""
    ids = ['lr_001__','ur_002__','ur_005__','ssr_016__','ssr_024__','ssr_026__','sr_041__','sr_044__','sr_052__','r_069__','r_070__','r_072__']
    return [c for c in ALL_CARDS.values() if c.get('id') in ids][:12]

# v1.4.2i LR=1, UR=3 制限を遵守したデッキ生成
TIER_LIMIT = {'LR': 1, 'UR': 3}

def cards_by_filter_with_limit(predicate, n=12):
    """LR/UR 制限を遵守して n 枚 抽出"""
    pool_filtered = [c for c in ALL_CARDS.values() if predicate(c)]
    random.shuffle(pool_filtered)
    picked = []
    tier_count = {'LR': 0, 'UR': 0, 'SSR': 0, 'SR': 0, 'R': 0}
    for c in pool_filtered:
        if len(picked) >= n: break
        t = c['tier']
        if t in TIER_LIMIT and tier_count[t] >= TIER_LIMIT[t]: continue
        picked.append(c)
        tier_count[t] = tier_count.get(t, 0) + 1
    # 12枚足りなければ全 POOL からランダム fill
    if len(picked) < n:
        remaining = [c for c in ALL_CARDS.values() if c not in picked]
        random.shuffle(remaining)
        for c in remaining:
            if len(picked) >= n: break
            t = c['tier']
            if t in TIER_LIMIT and tier_count[t] >= TIER_LIMIT[t]: continue
            picked.append(c); tier_count[t] = tier_count.get(t, 0) + 1
    return picked[:n]

def make_observer_deck():
    """観測者 + 原虹 系 (LR/UR 制限あり: LR=1 + UR=3)"""
    target = ['原虹', '十国の覇者']
    return cards_by_filter_with_limit(lambda c: c.get('faction') in target, 12)

def make_aquasis_deck():
    return cards_by_filter_with_limit(lambda c: c.get('faction') in ['アクアシス','紅玉海賊団','海淵都市アクアシス'], 12)

def make_sahar_deck():
    return cards_by_filter_with_limit(lambda c: c.get('faction') == '古龍砂漠サハール', 12)

def make_redwing_deck():
    target = ['紅翼皇家', '夜焔郷', '第七天']
    return cards_by_filter_with_limit(lambda c: c.get('faction') in target, 12)

def make_niiruru_deck():
    target = ['氷霊王国ニーヴル', '空挺城ゼノニア', '銀霜王国']
    return cards_by_filter_with_limit(lambda c: c.get('faction') in target, 12)

def make_academy_deck():
    return cards_by_filter_with_limit(lambda c: c.get('faction') in ['星霊学院', '深緑樹海', '白焔教会'], 12)

def make_darkmoon_deck():
    """v1.4.2i 追加: 黒月 + 銀霜 + 地底市 (s1c5 派閥)"""
    target = ['黒月衆ノクトス', '銀霜王国', '地底市リオラ']
    return cards_by_filter_with_limit(lambda c: c.get('faction') in target, 12)

# 野沢さん指示 2026-05-05: 派閥外 R/LR/UR 自由混合、 コンボ意識のハードコード デッキ
def _by_name(*names):
    """name list → card list (順序維持、 missing は warn)"""
    out = []
    for n in names:
        if n in ALL_CARDS: out.append(ALL_CARDS[n])
        else: print(f'  ⚠️ 未登場: {n}')
    return out

def make_north_artemis_deck():
    """北方 + 龍帝アルテミス (千年の戦友/北方の盟約 コンボ狙い)"""
    return _by_name(
        # UR x3 (上限)
        '龍帝 アルテミス', '焔帝 ヒノオウ', '氷帝 グレイル',
        # SSR x3 (北方核)
        '北方剣聖 ハグル', '空挺城総監 ガリオン', '氷塔の聖騎士 リオネ',
        # SR x3 (北方サポート)
        '北方剣聖 ハグル' if False else '凍土の祭司 イル', '氷塔の見習い騎士 アスラ', '空挺整備士 ベル',
        # R x3 (派閥外含むテンポ補強)
        '凍土の少年 アルク', '雪原の少女 ミウ', 'ちさと',
    )

def make_aquasis_prism_deck():
    """海連合 + LR プリズマ (海溝の祈り + 観測者の混合)"""
    return _by_name(
        '虹意 プリズマ',  # LR x1
        '深海女王 ネプテア', '波紋の聖女 イザベル', 'セラフィエル',  # UR x3
        'アクアシス筆頭魔術師 グラシエル', '紅玉海賊団船長 シャンティ',  # SSR x2 (UR上限のため)
        '珊瑚鎧の海騎士 コラリア', '紅玉海賊団副長 ケイレブ', '深海巫女 ティアラ',  # SR x3
        '深海の少女 パール', '海賊見習い ミカ', '海賊団船医 クレオ',  # R x3
    )

def make_sahar_dragon_vil_deck():
    """砂海+紫竜 + LRプリズマ (砂海と紫竜 + サハール三柱 コンボ)"""
    return _by_name(
        '虹意 プリズマ',  # LR x1
        '砂海王女 サハナ', '古龍の語り部 ファラー', '千夜姫 カグヤ',  # UR x3 (千年文 コンボ)
        '砂牙の剣聖 グラン', '竜爵 ヴィル', '紫竜の侍従 リアム',  # SSR x3
        '祭舞のサフィラ', '古龍鍛冶 オウル', '砂風の戦士 ライ',  # SR x3
        '砂塵の子 ティナ', '砂風の語り部 ナドラ',  # R x2
    )

def make_s1c5_observer_deck():
    """S1C5 + 観測者 (黒月の観測者 + 観測者の対峙 コンボ)"""
    return _by_name(
        '虹意 プリズマ',  # LR x1
        '黒月の盟主 ノクトリア', 'シ・ロエン', '地底市の母 リオラエル',  # UR x3
        '仮面騎士 シオン', '影織りの導師 ルナリア', '銀霜剣聖 オリエル',  # SSR x3
        '月夜祭司 アスター', '黒月の刺客', '地底市の語り部 オルフェ',  # SR x3
        '銀霜近衛 セレン', '地底市の少女 シエル',  # R x2
    )

def make_academy_observer_deck():
    """学院+教会+樹海 + 観測者三柱 (始まりの五人 + 観測者三柱 コンボ)"""
    return _by_name(
        '虹意 プリズマ',  # LR x1
        'セラフィエル', '千夜姫 カグヤ', '星海のノクス',  # UR x3 (観測者四柱)
        'イザベル', '森の射手 リナエ', '白焔教会見習い巫女 ルーナ',  # SSR x3
        'メイリ', '詠聖 ベル', 'セラフィ',  # SR x3
        'ちさと', 'カイ',  # R x2
    )

def make_silver_shrine_deck():
    """銀霜+雪月神殿 (s1c5 銀霜系 + 既存 s1c1 ルミナ、 沈黙の盾 + 雪月神殿の祭司灯番 コンボ)"""
    return _by_name(
        '虹意 プリズマ',                                                          # LR x1
        '黒月の盟主 ノクトリア', 'シ・ロエン', '地底市の母 リオラエル',           # UR x3
        '仮面騎士 シオン', '銀霜剣聖 オリエル', '銀霜王 ノヴァ',                  # SSR x3
        '月夜祭司 アスター', 'ルミナ', '雪月神殿見習い ラピス',                   # SR x3 (s1c5 + s1c1)
        '銀霜近衛 セレン', '銀霜の工房娘',                                         # R x2
    )

def make_zenonia_silver_deck():
    """ゼノニア+銀霜 (s1c4 機械工房 + s1c5 銀霜、 ヴァーレ女皇 + 北方の盟約)"""
    return _by_name(
        '虹意 プリズマ',                                                          # LR x1
        '空挺女皇 ヴァーレ', '氷帝 グレイル', 'シ・ロエン',                       # UR x3
        '空挺城総監 ガリオン', '真鍮の女将 ハーニア', '銀霜剣聖 オリエル',         # SSR x3
        '空挺整備士 ベル', '月夜祭司 アスター', '銀霜近衛 セレン',                 # SR x3
        '空の少年 ピット', '雪月神殿見習い ラピス',                               # R x2
    )

def make_church_alliance_deck():
    """白焔教会連合 (church + 樹海 + 学院、 始まりの五人 + 教会次世代)"""
    return _by_name(
        '虹意 プリズマ',                                                          # LR x1
        'セラフィエル', '波紋の聖女 イザベル', '森の射手 リナエ',                 # UR x3
        'イザベル', '白焔教会見習い巫女 ルーナ', '紅玉海賊団船長 シャンティ',     # SSR x3
        'メイリ', '詠聖 ベル', 'セラフィ',                                         # SR x3
        '白焔教会従士 リッカ', 'ちさと',                                           # R x2
    )

DECK_PATTERNS = {
    'デフォルト': make_default_deck,  # 比較基準
    '海+プリズマ': make_aquasis_prism_deck,
    '北方+アルテミス': make_north_artemis_deck,
    '砂漠+紫竜+プリズマ': make_sahar_dragon_vil_deck,
    'S1C5+観測者': make_s1c5_observer_deck,
    '聖学+観測者三柱': make_academy_observer_deck,
    '銀霜+雪月神殿': make_silver_shrine_deck,
    'ゼノニア+銀霜': make_zenonia_silver_deck,
    '教会連合': make_church_alliance_deck,
}

MAX_DUPS = { 'R': 1, 'SR': 2, 'SSR': 3, 'UR': 4, 'LR': 4 }
# 凸完凸 sim flag (野沢さん指示 2026-05-06、 完凸状態でのバランス確認)
# True にすると Card init 時に 各凸 +1 ﾎﾟﾜｰ + cost-1 + onPlay 効果値 +1 + 効果範囲拡大 を反映
# CLI: py scripts/pcb_balance_sim.py --maxed で MAXED_DUPES=True
MAXED_DUPES = '--maxed' in sys.argv
_EFFECT_RANGE_EXPAND = {
    'self_lane': 'adjacent_lanes',
    'adjacent_lanes': 'all_lanes',
    'opp_self_lane': 'all_opp_lanes',
}

# ===== ゲームエンジン (簡易版) =====
class Card:
    """シミュレート用 card (深 copy 用)"""
    __slots__ = ('id','name','tier','cost','basePower','faction','effect','effectText',
                 '_currentPower','_appliedTo','_frozen','_silenced','_immediate','_growth','_growthEnabled','_golden','_costReduced','_isToken')
    def __init__(self, src):
        self.id = src.get('id', '')
        self.name = src['name']
        self.tier = src['tier']
        self.cost = src['cost']
        self.basePower = src['basePower']
        self.faction = src.get('faction', '?')
        self.effect = src.get('effect', {})
        self.effectText = src.get('effectText', '')
        self._isToken = src.get('_isToken', False)
        # 完凸 sim: 凸 MAX 状態を反映 (各凸 +1 ﾎﾟﾜｰ + cost-1 + onPlay 効果値 +1 + 範囲拡大)
        if MAXED_DUPES and not self._isToken:
            max_d = MAX_DUPS.get(self.tier, 0)
            if max_d > 0:
                self.basePower += max_d
                self.cost = max(1, self.cost - 1)
                if self.effect:
                    self.effect = dict(self.effect)
                    if 'power' in self.effect and isinstance(self.effect['power'], (int, float)):
                        self.effect['power'] += 1
                    t = self.effect.get('target')
                    if t in _EFFECT_RANGE_EXPAND:
                        self.effect['target'] = _EFFECT_RANGE_EXPAND[t]
        self._currentPower = None
        self._appliedTo = []
        self._frozen = 0
        self._silenced = False
        self._immediate = 0
        self._growth = 0
        self._growthEnabled = False
        self._golden = 0
        self._costReduced = 0

    @classmethod
    def from_dict(cls, d):
        c = cls(d)
        return c


def make_token(faction):
    src = {'name': '召喚兵', 'tier': 'TOKEN', 'cost': 0, 'basePower': 2, 'faction': faction, '_isToken': True}
    return Card(src)


class Match:
    def __init__(self, my_deck, opp_deck, my_diff='hard', opp_diff='hard', verbose=False):
        self.cards_me = [Card(c) for c in my_deck]
        self.cards_opp = [Card(c) for c in opp_deck]
        self.deck_me = list(self.cards_me); random.shuffle(self.deck_me)
        self.deck_opp = list(self.cards_opp); random.shuffle(self.deck_opp)
        self.hand_me = self.deck_me[:4]; self.deck_me = self.deck_me[4:]
        self.hand_opp = self.deck_opp[:4]; self.deck_opp = self.deck_opp[4:]
        self.board = {'me': [[],[],[]], 'opp': [[],[],[]]}
        self.lane_eff = random.sample(lane_effects_all, 3)
        self.turn = 1; self.maxTurn = 6
        self.my_diff = my_diff; self.opp_diff = opp_diff
        self.verbose = verbose
        self.first_mover = random.choice(['me', 'opp'])
        # v1.4.2i: cost_reduce_hand 1試合1回 制限
        self.cost_reduce_used = {'me': False, 'opp': False}

    def card_power(self, card, side, lane):
        if card._frozen > 0: return 0
        p = card._currentPower if card._currentPower is not None else card.basePower
        p += card._growth + card._immediate + card._golden
        # lane 効果
        e = self.lane_eff[lane]
        if e['rule'] == 'all_self' and side == 'me': p += e['value']
        elif e['rule'] == 'all_opp' and side == 'opp': p += e['value']
        elif e['rule'] == 'cost_ge' and card.cost >= e.get('threshold', 0): p += e['value']
        elif e['rule'] == 'cost_le' and card.cost <= e.get('threshold', 99): p += e['value']
        elif e['rule'] == 'faction' and card.faction == e.get('faction'): p += e['value']
        # 派閥シナジー
        same = sum(1 for c in self.board[side][lane] if c.faction == card.faction)
        if same >= 2: p += same
        # v1.4.2i 常時オーラ (auraSelfLane / auraOppLane)
        for c in self.board[side][lane]:
            if c._silenced or c._frozen > 0: continue
            asl = (c.effect or {}).get('auraSelfLane', 0)
            if asl: p += asl
        opp_side = 'opp' if side == 'me' else 'me'
        for c in self.board[opp_side][lane]:
            if c._silenced or c._frozen > 0: continue
            aol = (c.effect or {}).get('auraOppLane', 0)
            if aol: p += aol
        return p

    def lane_combo_bonus(self, side, lane):
        bonus = 0
        all_board = [c for L in self.board[side] for c in L]
        same_lane = self.board[side][lane]
        global_combo = sum(c.effect.get('comboBonus', 0) for c in all_board if not c._silenced)
        for combo in combos:
            chars = combo['chars']
            if combo['condition'] == 'same_lane':
                trig = all(any(c.name == n for c in same_lane) for n in chars)
            else:
                trig = all(any(c.name == n for c in all_board) for n in chars)
            if not trig: continue
            t = combo['effect']['target']
            if t in ('self_lane', 'all_lanes'):
                bonus += combo['effect']['power'] + global_combo
        return bonus

    def lane_power(self, side, lane):
        return sum(self.card_power(c, side, lane) for c in self.board[side][lane]) + self.lane_combo_bonus(side, lane)

    def apply_effect(self, card, lane, side):
        e = card.effect or {}
        if e.get('trigger') != 'onPlay': return
        my = self.board[side]
        opp = self.board['opp' if side == 'me' else 'me']
        opp_side = 'opp' if side == 'me' else 'me'
        def add(t, d):
            if t is card: return
            t._currentPower = (t._currentPower if t._currentPower is not None else t.basePower) + d
            card._appliedTo.append((t, d))
        target = e.get('target')
        power = e.get('power', 0) or 0
        if target == 'self_lane':
            for c in my[lane]: add(c, power)
        elif target == 'adjacent_lanes':
            for L in (lane-1, lane+1):
                if 0 <= L <= 2:
                    for c in my[L]: add(c, power)
        elif target == 'all_lanes':
            for L in range(3):
                for c in my[L]: add(c, power)
        elif target == 'opp_self_lane':
            for c in opp[lane]:
                if not c._silenced and c._frozen == 0: add(c, power)
        elif target == 'all_opp_lanes':
            for L in range(3):
                for c in opp[L]:
                    if not c._silenced and c._frozen == 0: add(c, power)
        elif target == 'self_lane_attack':
            for c in my[lane]: add(c, power)
            for c in opp[lane]:
                if not c._silenced and c._frozen == 0: add(c, e.get('oppPower', 0))
        elif target == 'buff_faction_lane':
            fac = e.get('faction', card.faction)
            for c in my[lane]:
                if c.faction == fac: add(c, power)
        elif target == 'freeze_opp_lane_top':
            cands = [c for c in opp[lane] if c._frozen == 0]
            if cands:
                cands.sort(key=lambda c: -self.card_power(c, opp_side, lane))
                cands[0]._frozen += e.get('duration', 1)
            for c in my[lane]: add(c, power)
        elif target == 'freeze_opp_lane_all':
            for c in opp[lane]:
                c._frozen += e.get('duration', 1)
            for c in my[lane]: add(c, power)
        elif target == 'silence_opp_lane_top':
            cands = [c for c in opp[lane] if not c._silenced]
            if cands:
                cands.sort(key=lambda c: -self.card_power(c, opp_side, lane))
                tgt = cands[0]
                # revert _appliedTo
                for t, d in tgt._appliedTo:
                    if t._currentPower is not None: t._currentPower -= d
                tgt._appliedTo = []
                tgt._silenced = True
            for c in my[lane]: add(c, power)
        elif target == 'immediate_self':
            card._immediate += power
            if e.get('alsoSelfLane'):
                for c in my[lane]:
                    if c is not card: add(c, e['alsoSelfLane'])
        elif target == 'stealth_self':
            for c in my[lane]: add(c, power)
        elif target == 'growth_self':
            card._growthEnabled = True
            for c in my[lane]: add(c, power)
        elif target == 'cost_reduce_hand':
            # v1.4.2i: 1試合1回 制限
            if self.cost_reduce_used.get(side):
                if power: [add(c, power) for c in my[lane]]
                return
            hand = self.hand_me if side == 'me' else self.hand_opp
            cands = [h for h in hand if h._costReduced == 0]
            if cands:
                cands.sort(key=lambda h: -h.cost)
                cands[0]._costReduced += 1
                self.cost_reduce_used[side] = True
            for c in my[lane]: add(c, power)
        elif target == 'summon_token':
            if len(my[lane]) < 4:
                tok = make_token(card.faction)
                tok._currentPower = tok.basePower
                my[lane].append(tok)
            for c in my[lane]:
                if c is not card: add(c, power)
        elif target == 'chain_lane_self':
            ally_count = len(my[lane])
            card._currentPower = (card._currentPower if card._currentPower is not None else card.basePower) + ally_count * (e.get('multiplier', 1))
            if e.get('alsoSelfLane'):
                for c in my[lane]:
                    if c is not card: add(c, e['alsoSelfLane'])
        elif target == 'golden_self_lane':
            cands = [c for c in my[lane] if c is not card]
            if cands:
                cands.sort(key=lambda c: self.card_power(c, side, lane))
                cands[0]._golden += e.get('goldPower', 3)
            for c in my[lane]:
                if c is not card: add(c, power)
        # selfBonus
        if e.get('selfBonus'):
            card._currentPower = (card._currentPower if card._currentPower is not None else card.basePower) + e['selfBonus']

    def eff_cost(self, c):
        return max(1, c.cost - c._costReduced)

    def ai_choose(self, side, diff, cost_remain):
        hand = self.hand_me if side == 'me' else self.hand_opp
        playable = [(i, c) for i, c in enumerate(hand) if self.eff_cost(c) <= cost_remain]
        if not playable: return None
        open_lanes = [L for L in range(3) if len(self.board[side][L]) < 4]
        if not open_lanes: return None
        opp_side = 'opp' if side == 'me' else 'me'
        if diff == 'easy':
            i, c = random.choice(playable)
            return (i, random.choice(open_lanes))
        # normal+: コスト最大 + 劣勢補強 + 効果価値
        best = None
        for i, c in playable:
            for L in open_lanes:
                score = c.cost * 1.5
                same_fac = sum(1 for x in self.board[side][L] if x.faction == c.faction)
                score += same_fac * 2
                myP = self.lane_power(side, L)
                opP = self.lane_power(opp_side, L)
                diff_lane = opP - myP if side == 'me' else myP - opP
                if diff_lane > 0: score += diff_lane * 0.6
                # lane 効果
                e = self.lane_eff[L]
                if e['rule'] == 'cost_ge' and c.cost >= e.get('threshold', 0): score += e['value'] * 1.5
                if e['rule'] == 'cost_le' and c.cost <= e.get('threshold', 99): score += e['value'] * 1.5
                if e['rule'] == 'faction' and c.faction == e.get('faction'): score += e['value'] * 2
                # 効果評価 (hard/master)
                if diff in ('hard', 'master'):
                    eff = c.effect or {}
                    t = eff.get('target')
                    p = eff.get('power', 0) or 0
                    if t == 'freeze_opp_lane_top': score += 4 + p
                    elif t == 'freeze_opp_lane_all': score += len(self.board[side][L]) * 2 + p
                    elif t == 'silence_opp_lane_top': score += 3 + p
                    elif t == 'summon_token': score += 2 + p
                    elif t == 'chain_lane_self': score += len(self.board[side][L]) * (eff.get('multiplier', 1))
                    elif t == 'buff_faction_lane': score += same_fac * (p or 1)
                    elif t == 'growth_self': score += (self.maxTurn - self.turn + 1)
                    elif t == 'immediate_self': score += p
                    elif t == 'cost_reduce_hand': score += 1.5
                    elif t == 'all_lanes': score += p * 3
                    elif t == 'all_opp_lanes': score += abs(p) * 2
                    elif t == 'self_lane_attack': score += p + abs(eff.get('oppPower', 0))
                    if eff.get('comboBonus'): score += 2
                # 高コスト終盤温存
                rem = self.maxTurn - self.turn + 1
                if c.cost > rem * 1.5: score -= 1
                if best is None or score > best[2]:
                    best = (i, L, score)
        return (best[0], best[1])

    def play_turn(self, side):
        cost = self.turn
        cost_used = 0
        attempts = 0
        diff = self.my_diff if side == 'me' else self.opp_diff
        while attempts < 8:
            attempts += 1
            choice = self.ai_choose(side, diff, cost - cost_used)
            if choice is None: break
            i, L = choice
            hand = self.hand_me if side == 'me' else self.hand_opp
            c = hand[i]
            ec = self.eff_cost(c)
            c._currentPower = c.basePower
            c._appliedTo = []
            hand.pop(i)
            self.board[side][L].append(c)
            cost_used += ec
            self.apply_effect(c, L, side)
            # 50% 早期終了 (Easy 風)
            if diff == 'easy' and random.random() < 0.4: break

    def turn_start(self):
        # draw
        if self.deck_me: self.hand_me.append(self.deck_me.pop(0))
        if self.deck_opp: self.hand_opp.append(self.deck_opp.pop(0))
        # growth +1, frozen -1
        for side in ('me', 'opp'):
            for L in range(3):
                for c in self.board[side][L]:
                    if c._growthEnabled: c._growth += 1
                    if c._frozen > 0: c._frozen -= 1

    def turn_end(self):
        # immediate buff reset
        for side in ('me', 'opp'):
            for L in range(3):
                for c in self.board[side][L]:
                    c._immediate = 0

    def play(self):
        for t in range(1, self.maxTurn + 1):
            self.turn = t
            self.turn_start()
            if self.first_mover == 'me':
                self.play_turn('me')
                self.play_turn('opp')
            else:
                self.play_turn('opp')
                self.play_turn('me')
            self.turn_end()
        # 判定
        wins_me = wins_opp = 0
        for L in range(3):
            mp = self.lane_power('me', L)
            op = self.lane_power('opp', L)
            if mp > op: wins_me += 1
            elif op > mp: wins_opp += 1
        if wins_me > wins_opp: return 'win'
        if wins_opp > wins_me: return 'loss'
        return 'draw'


# ===== sim 実行 =====
def run_sim(my_deck_name, opp_deck_name, opp_diff='master', n=50):
    """野沢さん指示 2026-05-05: AI 段階を Master でテスト"""
    results = Counter()
    for _ in range(n):
        my_deck = DECK_PATTERNS[my_deck_name]()
        opp_deck = DECK_PATTERNS[opp_deck_name]()
        match = Match(my_deck, opp_deck, my_diff='master', opp_diff=opp_diff)
        results[match.play()] += 1
    return results

def show_deck_compositions():
    """各デッキの構成をサンプル表示 (野沢さん指示 2026-05-05)"""
    print()
    print("=" * 90)
    print("📦 デッキ構成サンプル (各デッキ 1 例)")
    print("=" * 90)
    for deck_name, builder in DECK_PATTERNS.items():
        deck = builder()
        print(f"\n--- {deck_name} ---")
        # tier 順 sort
        order = {'LR': 0, 'UR': 1, 'SSR': 2, 'SR': 3, 'R': 4}
        tier_count = Counter(c['tier'] for c in deck)
        fac_count = Counter(c.get('faction', '?') for c in deck)
        sorted_deck = sorted(deck, key=lambda c: (order[c['tier']], -c.get('cost', 0)))
        tier_str = ' / '.join(f"{t}{tier_count[t]}" for t in ['LR','UR','SSR','SR','R'] if tier_count[t] > 0)
        print(f"  Tier: {tier_str} (計{len(deck)}枚)")
        fac_str = ' / '.join(f"{f}={n}" for f, n in fac_count.most_common())
        print(f"  派閥: {fac_str}")
        for c in sorted_deck:
            cost = c.get('cost', 0)
            bp = c.get('basePower', 0)
            eff = c.get('effect', {})
            target = eff.get('target', 'none')
            power = eff.get('power', 0)
            etext = c.get('effectText', '')[:35]
            print(f"  [{c['tier']:>3}] {c['name']:<22} cost{cost} pw{bp:>2} | {etext}")


show_deck_compositions()
print()
print("=" * 90)
mode_label = "完凸 (各凸 +1 + ｺｽﾄ-1 + 効果値+1 + 範囲拡大)" if MAXED_DUPES else "基礎ﾊﾟﾜｰ (dupes=0)"
print(f"📊 PCB バランス sim [{mode_label}] — 各デッキ vs 各 AI 段階 (各 50戦、 Master AI)")
print("=" * 90)
print()
deck_names = list(DECK_PATTERNS.keys())

# Round 1: my_deck vs default opp deck (Master AI)
print("=== Round 1: 各デッキ × デフォルト相手 (Master AI 50戦) ===")
print(f"{'deck':<24} | {'Master':^16}")
print("-" * 50)
for deck in deck_names:
    r = run_sim(deck, 'デフォルト', opp_diff='master', n=50)
    wr = r['win'] / 50 * 100
    print(f"{deck:<24} | W{r['win']:>2}/L{r['loss']:>2}/D{r['draw']:>2} ({wr:>4.0f}%)")

print()
print("=== Round 2: 各デッキ vs 各デッキ (Master AI、 各 30戦) ===")
print(f"{'my\\opp':<24} | " + " | ".join(f"{d:^14}" for d in deck_names))
print("-" * 130)
matrix = {}
for my in deck_names:
    row = [f"{my:<24}"]
    for opp in deck_names:
        r = run_sim(my, opp, opp_diff='master', n=30)
        wr = r['win'] / 30 * 100
        matrix[(my, opp)] = wr
        row.append(f"{wr:>5.0f}% ")
    print(" | ".join(row))

print()
print("=== 派閥バランス所感 (Master AI) ===")
# 各デッキの平均勝率 (vs 全デッキ 平均、 自身対自身は除外)
print(f"{'deck':<24} | avg WR vs all decks")
print("-" * 60)
deck_avg = []
for deck in deck_names:
    others = [opp for opp in deck_names if opp != deck]
    avg = sum(matrix[(deck, opp)] for opp in others) / len(others) if others else 0
    deck_avg.append((deck, avg))
deck_avg.sort(key=lambda x: -x[1])
for deck, avg in deck_avg:
    bar = "█" * int(avg / 5)
    print(f"  {deck:<24} {avg:>5.1f}% {bar}")

print()
print("=" * 90)
print("✅ sim 完了")
print("=" * 90)
