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

def make_observer_deck():
    """観測者 + 原虹 系 (LR/UR 神話級)"""
    target = ['原虹', '十国の覇者']
    return cards_by_filter(lambda c: c.get('faction') in target or c['name'] in ['虹意 プリズマ','セラフィエル','千夜姫 カグヤ','星海のノクス','龍帝 アルテミス','焔帝 ヒノオウ'], 12)

def make_aquasis_deck():
    return cards_by_filter(lambda c: c.get('faction') in ['アクアシス','紅玉海賊団','海淵都市アクアシス'], 12)

def make_sahar_deck():
    return cards_by_filter(lambda c: c.get('faction') == '古龍砂漠サハール', 12)

def make_redwing_deck():
    target = ['紅翼皇家', '夜焔郷', '第七天']
    return cards_by_filter(lambda c: c.get('faction') in target, 12)

def make_niiruru_deck():
    target = ['氷霊王国ニーヴル', '空挺城ゼノニア', '銀霜王国']
    return cards_by_filter(lambda c: c.get('faction') in target, 12)

def make_academy_deck():
    return cards_by_filter(lambda c: c.get('faction') in ['星霊学院', '深緑樹海', '白焔教会'], 12)

DECK_PATTERNS = {
    'デフォルト': make_default_deck,
    '観測者(原虹+覇者)': make_observer_deck,
    'アクアシス連合': make_aquasis_deck,
    '古龍砂漠サハール': make_sahar_deck,
    '紅翼皇家+夜焔郷': make_redwing_deck,
    '氷霊+空挺+銀霜': make_niiruru_deck,
    '星霊学院+教会': make_academy_deck,
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
        self._currentPower = None
        self._appliedTo = []
        self._frozen = 0
        self._silenced = False
        self._immediate = 0
        self._growth = 0
        self._growthEnabled = False
        self._golden = 0
        self._costReduced = 0
        self._isToken = src.get('_isToken', False)

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
            hand = self.hand_me if side == 'me' else self.hand_opp
            cands = [h for h in hand if h._costReduced == 0]
            if cands:
                cands.sort(key=lambda h: -h.cost)
                cands[0]._costReduced += 1
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
def run_sim(my_deck_name, opp_deck_name, opp_diff='hard', n=50):
    results = Counter()
    for _ in range(n):
        my_deck = DECK_PATTERNS[my_deck_name]()
        opp_deck = DECK_PATTERNS[opp_deck_name]()
        match = Match(my_deck, opp_deck, my_diff='hard', opp_diff=opp_diff)
        results[match.play()] += 1
    return results


print()
print("=" * 90)
print("📊 PCB バランス sim — 各デッキ vs 各 AI 段階 (各 50戦)")
print("=" * 90)
print()
deck_names = list(DECK_PATTERNS.keys())
diff_levels = ['easy', 'normal', 'hard', 'master']

# Round 1: my_deck (hard) vs default opp deck (各 AI 段階)
print("=== Round 1: 各デッキ × デフォルト相手 (デフォルト AI 4段階) ===")
print(f"{'deck':<10} | " + " | ".join(f"{d:^14}" for d in diff_levels))
print("-" * 90)
for deck in deck_names:
    row = [f"{deck:<10}"]
    for diff in diff_levels:
        r = run_sim(deck, 'デフォルト', opp_diff=diff, n=50)
        wr = r['win'] / 50 * 100
        row.append(f"W{r['win']:>2}/L{r['loss']:>2}/D{r['draw']:>2} ({wr:>4.0f}%)")
    print(" | ".join(row))

print()
print("=== Round 2: 各デッキ vs 各デッキ (Hard AI、 各 30戦) ===")
print(f"{'my\\opp':<10} | " + " | ".join(f"{d:^7}" for d in deck_names))
print("-" * 90)
matrix = {}
for my in deck_names:
    row = [f"{my:<10}"]
    for opp in deck_names:
        r = run_sim(my, opp, opp_diff='hard', n=30)
        wr = r['win'] / 30 * 100
        matrix[(my, opp)] = wr
        row.append(f"{wr:>5.0f}% ")
    print(" | ".join(row))

print()
print("=== 派閥バランス所感 ===")
# 各デッキの平均勝率 (vs 全デッキ 平均)
print(f"{'deck':<10} | avg WR vs all decks")
print("-" * 50)
deck_avg = []
for deck in deck_names:
    avg = sum(matrix[(deck, opp)] for opp in deck_names) / len(deck_names)
    deck_avg.append((deck, avg))
deck_avg.sort(key=lambda x: -x[1])
for deck, avg in deck_avg:
    bar = "█" * int(avg / 5)
    print(f"  {deck:<10} {avg:>5.1f}% {bar}")

print()
print("=" * 90)
print("✅ sim 完了")
print("=" * 90)
