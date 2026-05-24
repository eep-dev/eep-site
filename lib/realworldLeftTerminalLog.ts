/**
 * Left-column lines, Scenario A (bloated HTML, paywall, human-in-the-loop checkout,
 * re-fetch, table extraction → JSON). Sequential html[] / json[] / table[] for styling.
 */

import { COMPARE_BLOCK_LEFT } from '@/lib/realworldCompareTables';

const EMBEDDED_REPORT_LINES = [
  '{',
  '  "report": "corpx-q1-2026",',
  '  "company": "CorpX Industries",',
  '  "revenue": "$4.2B",',
  '  "net_income": "$890M",',
  '  "yoy_growth": "23%",',
  '  "segments": [',
  '    { "name": "Cloud", "revenue": "$2.1B", "growth": "31%" },',
  '    { "name": "Enterprise", "revenue": "$1.4B", "growth": "18%" },',
  '    { "name": "Consumer", "revenue": "$0.7B", "growth": "9%" }',
  '  ],',
  '  "guidance": "FY2026 revenue outlook $17.5B–$18.2B",',
  '  "generated_at": "2026-04-12T12:00:00.000Z"',
  '}',
];

function htmlLine(n: number, content: string): string {
  const idx = String(n).padStart(3, '0');
  return `html[${idx}] │ ${content}`;
}

function jsonLine(n: number, content: string): string {
  const idx = String(n).padStart(3, '0');
  return `json[${idx}] │ ${content}`;
}

function tableLine(n: number, content: string): string {
  const idx = String(n).padStart(3, '0');
  return `table[${idx}] │ ${content}`;
}

function buildHtmlScriptBlock(startIndex: number): { lines: string[]; nextIndex: number } {
  const lines: string[] = [];
  let i = startIndex;
  lines.push(htmlLine(i++, '<script type="application/json" id="report-data">'));
  for (const jl of EMBEDDED_REPORT_LINES) {
    lines.push(htmlLine(i++, jl));
  }
  lines.push(htmlLine(i++, '</script>'));
  return { lines, nextIndex: i };
}

function buildParsedJsonBlock(startJ: number): string[] {
  const rows = [
    jsonLine(startJ + 0, '{'),
    jsonLine(startJ + 1, '  "report": "corpx-q1-2026",'),
    jsonLine(startJ + 2, '  "company": "CorpX Industries",'),
    jsonLine(startJ + 3, '  "revenue": "$4.2B",'),
    jsonLine(startJ + 4, '  "net_income": "$890M",'),
    jsonLine(startJ + 5, '  "yoy_growth": "23%",'),
    jsonLine(startJ + 6, '  "segments": ['),
    jsonLine(
      startJ + 7,
      '    { "name": "Cloud", "revenue": "$2.1B", "growth": "31%" },',
    ),
    jsonLine(
      startJ + 8,
      '    { "name": "Enterprise", "revenue": "$1.4B", "growth": "18%" },',
    ),
    jsonLine(
      startJ + 9,
      '    { "name": "Consumer", "revenue": "$0.7B", "growth": "9%" }',
    ),
    jsonLine(startJ + 10, '  ],'),
    jsonLine(startJ + 11, '  "guidance": "FY2026 revenue outlook $17.5B–$18.2B",'),
    jsonLine(startJ + 12, '  "generated_at": "2026-04-12T12:00:00.000Z"'),
    jsonLine(startJ + 13, '}'),
  ];
  return rows;
}

function buildLeftLogLines(): string[] {
  let h = 0;
  const out: string[] = [
    'AGENT  GET http://127.0.0.1:3401/reports/corpx-q1',
    '← HTTP 200  text/html  ~482,331 bytes (full document)',
    'Current web: first-pass HTML parse (agent)',
    '►SECTION► · HTML · head & transport',
    '►RULE►━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    htmlLine(h++, '<!DOCTYPE html><html lang="en"><head>'),
    htmlLine(
      h++,
      '<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>',
    ),
    htmlLine(h++, '<title>CorpX Q1 2026: Investor snapshot</title>'),
    htmlLine(
      h++,
      '<link rel="preload" href="/_next/static/chunks/main-app.js" as="script"/>',
    ),
    htmlLine(
      h++,
      '<link rel="preload" href="/_next/static/chunks/webpack.js" as="script"/>',
    ),
    htmlLine(h++, '<link rel="stylesheet" href="/_next/static/css/app.css"/>'),
    htmlLine(h++, '<script src="/_next/static/chunks/framework.js" defer></script>'),
    htmlLine(h++, '<script src="/_next/static/chunks/main.js" defer></script>'),
    htmlLine(h++, '</head>'),
    '►SECTION► · HTML · body / teaser / paywall',
    '►RULE►────────────────────────────────────────',
    htmlLine(h++, '<body><div id="root">'),
    htmlLine(
      h++,
      '<header class="corp-nav"><a href="/">CorpX</a><nav><a href="/reports">Reports</a></nav></header>',
    ),
    htmlLine(h++, '<main class="report-shell"><article class="report-teaser">'),
    htmlLine(
      h++,
      '<h1>Q1 2026 revenue highlights</h1><p class="lede">Public teaser: subscribe for full segments.</p>',
    ),
    htmlLine(h++, '<section data-testid="paywall" class="paywall">'),
    htmlLine(
      h++,
      '<p>Subscribe to unlock the full investor report, segment tables, and downloadable CSV.</p>',
    ),
    htmlLine(
      h++,
      '<button type="button" data-action="open-checkout">Start subscription</button>',
    ),
    htmlLine(h++, '</section></article></main>'),
    htmlLine(
      h++,
      '<footer class="corp-ft"><span>© 2026 CorpX · <a href="/legal">Legal</a></span></footer>',
    ),
    '►SECTION► · HTML · aside / ads / portal',
    '►RULE►────────────────────────────────────────',
    htmlLine(
      h++,
      '<aside class="promo-banners"><div data-ad="sponsor">Sponsored: Cloud migration guide</div></aside>',
    ),
    htmlLine(h++, '<div id="portal-root"></div>'),
    '►SECTION► · HTML · embedded JSON (#report-data): locked until paid',
    '►RULE►━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  ];

  const script = buildHtmlScriptBlock(h);
  out.push(...script.lines);
  h = script.nextIndex;
  out.push(htmlLine(h++, '</div></body></html>'));

  out.push(
    'Gates detected: paywall + hidden #report-data (display:none until subscription cookie).',
    'Playwright: click [data-action=open-checkout] → checkout overlay mounted (#checkout-root).',
    '►SECTION► · Checkout DOM · Stripe Elements (iframe + card fields)',
    '►RULE►────────────────────────────────────────',
    htmlLine(h++, '<div id="checkout-root" role="dialog" aria-modal="true">'),
    htmlLine(h++, '<div class="checkout-modal"><h2>Subscribe: CorpX Q1 full report</h2>'),
    htmlLine(
      h++,
      '<div class="stripe-frame"><iframe title="Secure payment" src="https://js.stripe.com/v3/elements/…"></iframe></div>',
    ),
    htmlLine(
      h++,
      '<label>Card number <input inputmode="numeric" autocomplete="cc-number" placeholder="4242 …"/></label>',
    ),
    htmlLine(
      h++,
      '<label>Expiry <input autocomplete="cc-exp" placeholder="MM / YY"/></label>',
    ),
    htmlLine(
      h++,
      '<label>CVC <input autocomplete="cc-csc" placeholder="123"/></label>',
    ),
    htmlLine(h++, '<button type="submit" data-testid="pay-submit">Pay $29/mo</button></div></div>'),
    'Human step: operator enters test card in headed browser (PAN + expiry + CVC); PCI fields not logged.',
    'Checkout: mock `payment_intent.succeeded`; `corpx_session` cookie set; overlay closed.',
    '►SECTION► · Reload · same URL with active session',
    '►RULE►━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'AGENT  GET http://127.0.0.1:3401/reports/corpx-q1?session=chk_live_demo_9f2a',
    '← HTTP 200  text/html  ~491,880 bytes (unlocked chrome + tables)',
    'Current web: second-pass HTML parse (post-paywall)',
    '►SECTION► · HTML · unlocked report · tables + KPI strip',
    '►RULE►────────────────────────────────────────',
    htmlLine(h++, '<!DOCTYPE html><html lang="en"><head>'),
    htmlLine(h++, '<meta charset="utf-8"/><title>CorpX Q1 2026: Full report</title></head>'),
    htmlLine(h++, '<body><main class="report-full">'),
    htmlLine(
      h++,
      '<section class="kpi-strip"><span class="kpi">Revenue $4.2B</span><span class="kpi">YoY +23%</span></section>',
    ),
    htmlLine(
      h++,
      '<table id="segments-kpi"><thead><tr><th>Segment</th><th>Revenue</th><th>Growth</th></tr></thead><tbody>',
    ),
    htmlLine(
      h++,
      '<tr data-segment="cloud"><td>Cloud</td><td>$2.1B</td><td>31%</td></tr>',
    ),
    htmlLine(
      h++,
      '<tr data-segment="ent"><td>Enterprise</td><td>$1.4B</td><td>18%</td></tr>',
    ),
    htmlLine(
      h++,
      '<tr data-segment="cons"><td>Consumer</td><td>$0.7B</td><td>9%</td></tr>',
    ),
    htmlLine(h++, '</tbody></table>'),
    htmlLine(
      h++,
      '<script type="application/json" id="report-data">{"unlocked":true,"source":"hydration"}</script>',
    ),
    htmlLine(h++, '</main></body></html>'),
    'Playwright: wait for #segments-kpi tbody tr; scrape cell text; trim & normalize whitespace.',
    '►SECTION► · Extracted table · normalized rows (agent)',
    '►RULE►━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    tableLine(0, 'Cloud        | $2.1B  | 31%'),
    tableLine(1, 'Enterprise   | $1.4B  | 18%'),
    tableLine(2, 'Consumer     | $0.7B  | 9%'),
    'Cleanup: strip currency symbols for compute; keep display strings for JSON string fields.',
    'Playwright: read #report-data (hydration JSON) + merge with table-derived metrics.',
    'Current web: merge + JSON.stringify (pretty) → envelope below',
    '►SECTION► · JSON · final envelope (DOM + table merge)',
    '►RULE►━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    ...buildParsedJsonBlock(0),
    'Exported KPIs + segment rows + simulated human pauses (checkout).',
    'Current web: JSON (normalized) [Syntax OK]',
    COMPARE_BLOCK_LEFT,
  );

  return out;
}

export const LEFT_LOG: readonly string[] = buildLeftLogLines();

export function getLeftTerminalLineClass(line: string): string {
  if (line === COMPARE_BLOCK_LEFT) return 'rw-t-line rw-compare-host';
  if (line.startsWith('►SECTION►')) return 'rw-t-line rw-t-section';
  if (line.startsWith('►RULE►')) return 'rw-t-line rw-t-rule';
  if (/^html\[\d{3}\] │/.test(line)) return 'rw-t-line rw-t-html';
  if (/^json\[\d{3}\] │/.test(line)) return 'rw-t-line rw-t-json';
  if (/^table\[\d{3}\] │/.test(line)) return 'rw-t-line rw-t-html';
  if (line.startsWith('Current web:')) return 'rw-t-line rw-t-banner';
  if (line.startsWith('AGENT') || line.startsWith('← HTTP')) return 'rw-t-line rw-t-http';
  if (
    line.startsWith('Gates detected') ||
    line.startsWith('Playwright') ||
    line.startsWith('Human step') ||
    line.startsWith('Checkout') ||
    line.startsWith('Cleanup')
  ) {
    return 'rw-t-line rw-t-note';
  }
  if (line.startsWith('Exported')) {
    return 'rw-t-line rw-t-export';
  }
  return 'rw-t-line rw-t-dim';
}
