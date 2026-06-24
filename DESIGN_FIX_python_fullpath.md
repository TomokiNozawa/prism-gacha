# DESIGN: FIX スキル類の python フルパス切替 (MS Store stub 回避)

## 概要
- 目的: `~/.claude/skills/` 配下の 22 ファイル (各 SKILL.md / skill.md) で `python` または `py` を 直叩きしている。 Windows 環境で `python` は MS Store stub に解決されることがあり (PATH 順次第)、 Store stub 起動で **exit 49** + 標準出力に「Microsoft Store の Python を入手...」 が出て スキルが沈黙崩壊する事故あり (今日発生、 ユーザー報告)。 確実な Python launcher (`py`) または フルパス (`C:/Users/t2262/AppData/Local/Python/bin/python.exe`) に統一して 事故ゼロにする。
- 規模感: **軽量** (sed 一括置換 + テスト、 実働 30-60min 想定)

## 現状調査 (verify 済)

```
$ which python   →  /c/Users/t2262/AppData/Local/Microsoft/WindowsApps/python  ← MS Store stub
$ which py       →  /c/Users/t2262/AppData/Local/Microsoft/WindowsApps/py      ← Python launcher (生きている)
$ py --version   →  Python 3.14.3                                              ← 動作確認 OK
$ ls /c/Users/t2262/AppData/Local/Python/bin/python.exe → 存在 ← 生 python.exe
```

**MS Store stub の挙動**: PATH に Microsoft\WindowsApps\ が前にあると `python` でも `py` でも stub が起動。 stub は MS Store を開く UI を返すだけで、 標準入出力/exit code が 通常の Python と異なる (exit 49 = MS Store 未インストール)。 `py` の方は stub と本物が両方あるが、 起動時に Python launcher が 先に解決する場合は OK、 解決順次第。 → **フルパス が 唯一確実**。

## 影響ファイル一覧 (22 件、 python/py 直叩き)

```
~/.claude/skills/box/skill.md
~/.claude/skills/check-queue/skill.md
~/.claude/skills/gmail/skill.md
~/.claude/skills/report/skill.md
~/.claude/skills/selfupdate/skill.md
~/.claude/skills/spreadsheet/skill.md
~/.claude/skills/zoom/skill.md
~/.claude/skills/シフト月次調整/skill.md
~/.claude/skills/事前mtg作成/skill.md
~/.claude/skills/復習リマインド/skill.md
~/.claude/skills/教材作成/skill.md
... + .md / .MD バリエーション (大文字小文字)
```

加えて、 各スキルが呼ぶ `~/.claude/scripts/*.py` 内に `subprocess.run(['python', ...])` が 入っているケースも要 grep。

## ユースケース 3-5 個

| # | ユースケース | 主要操作 |
|---|---|---|
| ① | スキルが 確実に Python 本体を起動、 MS Store stub を 踏まない | フルパス指定 で起動 |
| ② | 別 PC (デスクトップ機) でも 同じスキルが動く | フルパスは 別 PC でも 同じ場所 (前提: 統一インストール) |
| ③ | Python アップグレード時 (3.14 → 3.15) も 同パス維持 | `~/AppData/Local/Python/bin/python.exe` の symlink/junction で吸収可、 別建て検討要 |
| ④ | 一発置換で 全スキル 統一、 個別修正の漏れゼロ | sed 一括置換 |
| ⑤ | バッチ呼出の zoom_cal.py 等が Microsoft 環境差異を起こさない | フルパス + `PYTHONUTF8=1` セット維持 |

## データ構造 / 修正パターン

### 旧 (現状)

```bash
PYTHONUTF8=1 python C:/Users/t2262/.claude/scripts/zoom_cal.py --foo
```

### 新 (3 オプション、 要決定 A 参照)

#### 案 ①: フルパス指定 (推奨)

```bash
PYTHONUTF8=1 C:/Users/t2262/AppData/Local/Python/bin/python.exe C:/Users/t2262/.claude/scripts/zoom_cal.py --foo
```

**長所**: 最も確実、 `which` 順番に 影響されない。
**短所**: パス長くて読みにくい、 別 PC で 異なるインストール場所だと NG (要対称化)。

#### 案 ②: `py` Python launcher 経由

```bash
PYTHONUTF8=1 py -3 C:/Users/t2262/.claude/scripts/zoom_cal.py --foo
```

**長所**: launcher は MS が 公式提供、 通常 Microsoft\WindowsApps\py.exe (stub) ではなく `C:\Windows\py.exe` (公式 launcher) が 解決される PATH 順なら確実。 `-3` で Python 3 系 強制。
**短所**: PATH 順 確認は必要、 `py` も stub に当たる環境がゼロではない (今日のセッションで `which py` は WindowsApps を 返したが `py --version` は通った → 解決順は 環境変数次第)。

#### 案 ③: 環境変数 `CLAUDE_PYTHON` 経由

```bash
# .bashrc / .zshrc で 1 度設定
export CLAUDE_PYTHON='C:/Users/t2262/AppData/Local/Python/bin/python.exe'

# 各スキル
PYTHONUTF8=1 "$CLAUDE_PYTHON" C:/Users/t2262/.claude/scripts/zoom_cal.py --foo
```

**長所**: 別 PC で 環境変数だけ変えれば全スキル即対応、 メンテ性高
**短所**: PowerShell では `$env:CLAUDE_PYTHON` で 異なる構文、 互換性に注意

## 実装 (推奨: 案 ① + 案 ③ ハイブリッド)

PowerShell / bash 両対応のため、 `~/.claude/scripts/` 内に `python_path.sh` + `python_path.ps1` を 作る:

```bash
# ~/.claude/scripts/python_path.sh
#!/bin/bash
export CLAUDE_PYTHON='C:/Users/t2262/AppData/Local/Python/bin/python.exe'
[ ! -f "$CLAUDE_PYTHON" ] && export CLAUDE_PYTHON='C:/Python313/python.exe'  # fallback
[ ! -f "$CLAUDE_PYTHON" ] && export CLAUDE_PYTHON='py'  # 最終 fallback
```

各スキルで:

```bash
source ~/.claude/scripts/python_path.sh
PYTHONUTF8=1 "$CLAUDE_PYTHON" C:/Users/t2262/.claude/scripts/zoom_cal.py --foo
```

または (sourcing 不要パターン):

```bash
PYTHONUTF8=1 C:/Users/t2262/AppData/Local/Python/bin/python.exe C:/Users/t2262/.claude/scripts/zoom_cal.py --foo
```

## 一括置換コマンド (案 ① 直接フルパス、 sourcing なし)

```bash
# bash from prism-gacha-work or anywhere
SCRIPTS_DIR=~/.claude/skills

# 1. python directly (PYTHONUTF8 prefix あり)
grep -lE 'PYTHONUTF8=1\s+python\s' $SCRIPTS_DIR/*/skill.md $SCRIPTS_DIR/*/SKILL.md 2>/dev/null \
  | xargs sed -i 's|PYTHONUTF8=1 python |PYTHONUTF8=1 C:/Users/t2262/AppData/Local/Python/bin/python.exe |g'

# 2. python directly (PYTHONUTF8 prefix なし、 行頭 や スペース後)
grep -lE '(^|\s)python\s' $SCRIPTS_DIR/*/skill.md $SCRIPTS_DIR/*/SKILL.md 2>/dev/null \
  | xargs sed -i 's|\([^A-Za-z_]\)python |\1C:/Users/t2262/AppData/Local/Python/bin/python.exe |g'

# 3. py directly (launcher、 残しても良いが統一推奨)
# 別途検討、 案 ① ベースなら同じく置換
```

⚠️ `python` 単語が 文章内 (説明文) に 出てくる場合 誤置換リスクあり。 まず `git grep -nE '\bpython\s' ~/.claude/skills/` で 全行を 目視確認してから 限定置換する。

## subprocess 呼出も同期

```bash
grep -rnE "subprocess\.\w+\(\s*\[\s*['\"]python" ~/.claude/scripts/ 2>&1
# ヒットあれば 該当 .py を sed で置換
# subprocess.run(['python', ...]) → subprocess.run([sys.executable, ...]) が一番無難
# (実行中の Python 自身を子プロセスにも継承)
```

## 機械チェック (新規 lint ルール)

`~/.claude/scripts/check_skills_python.py` 新規作成:

```python
#!/usr/bin/env python3
"""スキル md ファイルで `python` 直叩きを検出する lint。 fail なら exit 1"""
import sys, re
from pathlib import Path

SKILLS = Path.home() / '.claude' / 'skills'
PATTERN = re.compile(r'(^|\s)(python|py)\s+[A-Z]:', re.MULTILINE)
# 許容: フルパス、 `$CLAUDE_PYTHON`、 `py -3` (公式 launcher 経由)

violations = []
for md in SKILLS.rglob('*.md'):
    text = md.read_text(encoding='utf-8')
    for m in PATTERN.finditer(text):
        # フルパスの行は許容
        line = text[max(0,m.start()-100):m.end()+100]
        if 'AppData/Local/Python/bin/python.exe' in line: continue
        if '$CLAUDE_PYTHON' in line or "${CLAUDE_PYTHON}" in line: continue
        violations.append(f'{md}: {line.strip()}')

if violations:
    print('❌ python 直叩き 検出:')
    for v in violations: print(' ', v)
    sys.exit(1)
print('✅ 全スキル OK')
```

これを selfupdate Step や CI で 走らせて 再発防止。

## 実装 Phase

- **Phase 1** (実働 30min): 上記置換 sed を 実行 + git diff 確認 + 1 スキル (zoom) で 動作確認
- **Phase 2** (実働 30min): subprocess 呼出も同期、 全 22 ファイル 動作確認 (主要 5 スキル: zoom / gmail / spreadsheet / シフト / report)
- **Phase 3** (実働 30min): `check_skills_python.py` 作成 + selfupdate に組込

## 要決定 (野沢さん確認待ち)

- **A. 案 ① / ② / ③ どれを採用**: 推奨 ① フルパス直接 (シンプル)、 別 PC 移行時に変数化 ③ への切替は容易
- **B. 別 PC (デスクトップ機) の Python パス**: ノート機と同じ `C:/Users/t2262/AppData/Local/Python/bin/python.exe` か、 異なるか (ある場合は環境変数 ③ ハイブリッド推奨)
- **C. `py` launcher を 残すか**: `py -3` 経由なら MS Store stub を 回避できる場面も多い、 全部フルパス統一が好みか / 残すか
- **D. lint ルール の厳しさ**: `check_skills_python.py` を **selfupdate で 自動 fail** にするか **WARNING 表示のみ** にするか

## 関連 memory / 既存実装

- `reference_powershell_env_diff.md` — PowerShell 環境差異 (notebook PS5.1+chcp932+pwsh無)
- `feedback_powershell_utf8_read.md` — PS 呼出冒頭で `[Console]::OutputEncoding=UTF8` 等 3 点セット必須
- `feedback_skill_self_contained.md` — スキルは自己完結型、 環境依存を 内部で吸収
- 既存実装:
  - `~/.claude/skills/zoom/skill.md` L24, L36 (`PYTHONUTF8=1 python ...`)
  - 他 21 ファイル 同パターン

## 検証 5点 (実装後)

1. `git grep -nE '(^|\s)(python|py)\s' ~/.claude/skills/` で フルパス・`py -3`・`$CLAUDE_PYTHON` 以外がゼロ
2. 主要 5 スキル (zoom / gmail / spreadsheet / シフト月次調整 / report) を 1 回ずつ起動して 正常動作
3. `~/.claude/scripts/*.py` の subprocess 呼出も MS stub に hit しない構成 (`sys.executable` 等)
4. `check_skills_python.py` が 全 OK で 終了
5. デスクトップ機で 同設定が 動くこと (デスクトップ Python パスが ノート機と同じ前提、 異なる場合は ③ 環境変数化)
