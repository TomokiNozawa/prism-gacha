#!/usr/bin/env node
/**
 * P-11: PCB AI vs AI バランス測定 sim runner
 *
 * 使い方:
 *   node scripts/sim_pcb_balance.js [--n=100] [--matrix] [--diff=hard-vs-master]
 *
 * オプション:
 *   --n=100         各組み合わせで何戦シミュレートするか (default: 50)
 *   --matrix        4x4 全組合せを順次実行 (16セット = n×16 戦)
 *   --diff=A-vs-B   1組合せだけ (例: hard-vs-master)
 *   --url=URL       dev URL の base (default: https://dev.prismaera.pages.dev)
 *   --headed        ブラウザを表示 (デバッグ用、 default: headless)
 *
 * 前提:
 *   - cardgame/script.js に sim mode (?simAuto=A-vs-B&n=N) 実装済
 *   - Playwright インストール済 (npm install --save-dev playwright)
 *
 * 出力:
 *   - sim_results/sim_<timestamp>.json (各組み合わせの集計 JSON)
 *   - 標準出力: 集計サマリ
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2).reduce((acc, a) => {
  const m = a.match(/^--(\w+)(?:=(.+))?$/);
  if (m) acc[m[1]] = m[2] === undefined ? true : m[2];
  return acc;
}, {});

const N = parseInt(args.n || '50');
const URL_BASE = args.url || 'https://dev.prismaera.pages.dev';
const HEADED = !!args.headed;
const MATRIX = !!args.matrix;
const SINGLE_DIFF = args.diff;

const DIFFS = ['easy', 'normal', 'hard', 'master'];
const TIMEOUT_PER_BATTLE = 8000; // ms (sim 中なので速い、 安全に8秒)

async function runOneSimSet(browser, diffMe, diffOpp, n) {
  const url = `${URL_BASE}/cardgame/?simAuto=${diffMe}-vs-${diffOpp}&n=${n}`;
  console.log(`\n[runOneSimSet] ${diffMe} vs ${diffOpp}, n=${n}`);
  console.log(`  URL: ${url}`);

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  page.on('console', (msg) => {
    const text = msg.text();
    if (text.includes('[sim]')) {
      console.log(`  [browser] ${text}`);
    }
  });

  page.on('pageerror', (err) => {
    console.warn(`  [pageerror] ${err.message}`);
  });

  const startTime = Date.now();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

  // 結果が <pre id="sim-result"> に書き込まれるまで待つ
  const totalTimeout = TIMEOUT_PER_BATTLE * n + 30000;
  console.log(`  waiting for sim completion (timeout: ${(totalTimeout / 1000).toFixed(0)}s)...`);

  let result = null;
  try {
    await page.waitForSelector('#sim-result', { timeout: totalTimeout });
    const text = await page.locator('#sim-result').textContent();
    result = JSON.parse(text);
  } catch (e) {
    console.error(`  [error] sim did not complete: ${e.message}`);
    // localStorage 経由で取得を試みる (途中状態でも)
    try {
      const stored = await page.evaluate(() => localStorage.getItem('pcb-sim-result'));
      if (stored) result = JSON.parse(stored);
    } catch (e2) {}
  }

  await context.close();
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`  done in ${elapsed}s`);

  return result;
}

async function main() {
  const combos = [];
  if (MATRIX) {
    for (const a of DIFFS) for (const b of DIFFS) combos.push([a, b]);
  } else if (SINGLE_DIFF) {
    const m = SINGLE_DIFF.match(/^(easy|normal|hard|master)-vs-(easy|normal|hard|master)$/);
    if (!m) {
      console.error(`Invalid --diff format: ${SINGLE_DIFF}`);
      process.exit(1);
    }
    combos.push([m[1], m[2]]);
  } else {
    // default: 4 戦のみ (player Hard vs AI Easy/Normal/Hard/Master)
    for (const oppDiff of DIFFS) combos.push(['hard', oppDiff]);
  }

  console.log(`PCB Balance Sim Runner`);
  console.log(`  base URL: ${URL_BASE}`);
  console.log(`  n per combo: ${N}`);
  console.log(`  combos: ${combos.length} (${combos.map(([a, b]) => `${a}-vs-${b}`).join(', ')})`);
  console.log(`  total simulated battles: ${N * combos.length}`);

  const browser = await chromium.launch({ headless: !HEADED });
  const allResults = {};

  try {
    for (const [diffMe, diffOpp] of combos) {
      const result = await runOneSimSet(browser, diffMe, diffOpp, N);
      if (result) {
        allResults[`${diffMe}-vs-${diffOpp}`] = {
          winRate: result.winRate,
          wins: result.wins,
          losses: result.losses,
          draws: result.draws,
          avgScoreMe: result.avgScoreMe,
          avgScoreOpp: result.avgScoreOpp,
          avgScoreDiff: result.avgScoreDiff,
          elapsed: result.elapsed,
        };
        console.log(`  → winRate ${result.winRate}, score ${result.avgScoreMe} vs ${result.avgScoreOpp}`);
      } else {
        allResults[`${diffMe}-vs-${diffOpp}`] = { error: 'sim failed' };
      }
    }
  } finally {
    await browser.close();
  }

  // 結果保存
  const outDir = path.join(__dirname, '..', 'sim_results');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outPath = path.join(outDir, `sim_${stamp}.json`);
  fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), N, combos: combos.map(([a, b]) => `${a}-vs-${b}`), results: allResults }, null, 2));

  console.log(`\n=== Summary ===`);
  console.log(`Saved: ${outPath}\n`);
  console.log('| Player vs AI | WinRate | Wins | Losses | Draws | AvgScoreMe | AvgScoreOpp | AvgScoreDiff |');
  console.log('|---|---|---|---|---|---|---|---|');
  for (const key of Object.keys(allResults)) {
    const r = allResults[key];
    if (r.error) {
      console.log(`| ${key} | ERROR: ${r.error} | | | | | | |`);
    } else {
      console.log(`| ${key} | ${r.winRate} | ${r.wins} | ${r.losses} | ${r.draws} | ${r.avgScoreMe} | ${r.avgScoreOpp} | ${r.avgScoreDiff} |`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
