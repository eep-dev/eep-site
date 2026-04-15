/**
 * Scenario B — lines aligned with `EEP/realworld-simulation/provider/eep-server/server.ts`
 * and `scenario_b/eep_agent.py`. Full manifest / 402 / POST body / 200 JSON (no ellipsis).
 */

import { COMPARE_BLOCK_RIGHT } from '@/lib/realworldCompareTables';

const NDA_HASH =
  'sha256:7f7866c54ed791ab6bc6dc4f886d5bc6f8f7a8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3';

/** Deterministic demo values (same shapes as wallet + mock_transfer in the repo). */
const DEMO_DID =
  'did:key:z6MkhaXgKwMqnp5cL5KM2WmPbKKSCL7JKs9nqp12KQ8KqVZx';
const DEMO_PUB_B64 =
  'dGVzdF9lZDI1NTE5X3B1YmxpY19rZXlfNjRfYnl0ZXNfcGFkZGVkX2RlbW9fISE=';
const DEMO_SIG_B64 =
  'ABCDEFGHijklmnopQRSTUVWxyz0123456789+/ABCDEFGHijklmnopQRSTUVWxyz0123456789+/AB==';
const DEMO_PAY_TOKEN =
  'tx_demo_s0lana_devnet_mock_usdc_0d01_to_DEMO_WALLET_CORPX_Q1_settled';

export const RIGHT_LOG: readonly string[] = [
  'EEP path — manifest + gate negotiation (deterministic client, no LLM)',
  '►SECTION► · Manifest',
  '►RULE►━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  'AGENT  GET http://127.0.0.1:3402/.well-known/eep.json',
  '← HTTP 200  application/json  586 bytes',
  'json[000] │ {',
  'json[001] │   "did": "did:web:corpx-analytics.demo",',
  'json[002] │   "eep_version": "0.1",',
  'json[003] │   "layers": {',
  'json[004] │     "layer1": "http://127.0.0.1:3402/eep/state",',
  'json[005] │     "layer2_sse": "http://127.0.0.1:3402/eep/stream"',
  'json[006] │   },',
  'json[007] │   "supported_content_types": [',
  'json[008] │     "application/json",',
  'json[009] │     "text/markdown"',
  'json[010] │   ],',
  'json[011] │   "pqc_ready": false,',
  'json[012] │   "x402_enabled": true,',
  'json[013] │   "payment_networks": [',
  'json[014] │     {',
  'json[015] │       "chain": "solana-devnet",',
  'json[016] │       "address": "DEMO_WALLET_CORPX_Q1",',
  'json[017] │       "min_confirmations": 0',
  'json[018] │     }',
  'json[019] │   ]',
  'json[020] │ }',
  'EEP path — state resource · first GET (no proofs yet)',
  '►SECTION► · HTTP · 402 Payment Required',
  '►RULE►────────────────────────────────────────',
  'AGENT  GET http://127.0.0.1:3402/eep/state/reports/corpx-q1',
  '← HTTP 402  Payment Required  application/json  unmet=2',
  'json[021] │ {',
  'json[022] │   "eep_error": "payment_required",',
  'json[023] │   "resource": "reports.corpx.q1.full",',
  'json[024] │   "tier_hint": "premium",',
  'json[025] │   "unmet_requirements": [',
  'json[026] │     {',
  'json[027] │       "type": "agreement",',
  `json[028] │       "document_hash": "${NDA_HASH}",`,
  'json[029] │       "document_url": "http://127.0.0.1:3402/eep/legal/nda",',
  'json[030] │       "signature_algo": "EdDSA",',
  'json[031] │       "resolution_hint": "Sign the NDA document hash with your agent Ed25519 key (demo)"',
  'json[032] │     },',
  'json[033] │     {',
  'json[034] │       "type": "payment",',
  'json[035] │       "amount": "0.01",',
  'json[036] │       "currency": "USD",',
  'json[037] │       "per": "request",',
  'json[038] │       "resolution_hint": "Transfer 0.01 USDC to DEMO_WALLET_CORPX_Q1 (simulated) and submit payment proof token"',
  'json[039] │     }',
  'json[040] │   ]',
  'json[041] │ }',
  '  requirement[0]: type=agreement',
  '  requirement[1]: type=payment',
  'EEP path — policy + wallet · satisfy gates',
  '►SECTION► · Proofs · agreement signature + mock settlement',
  '►RULE►━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  'EEP    Operator policy: micro-payment allowed for this demo resource.',
  'EEP    Signed NDA hash with agent Ed25519; mock USDC transfer recorded.',
  'EEP    Building gate_proofs[] for POST …',
  '►SECTION► · Outbound POST · gate_proofs (client → server)',
  '►RULE►────────────────────────────────────────',
  'AGENT  POST http://127.0.0.1:3402/eep/state/reports/corpx-q1  Content-Type: application/json',
  'json[042] │ {',
  'json[043] │   "gate_proofs": [',
  'json[044] │     {',
  'json[045] │       "type": "agreement",',
  `json[046] │       "document_hash": "${NDA_HASH}",`,
  `json[047] │       "signature": "${DEMO_SIG_B64}",`,
  `json[048] │       "signer_did": "${DEMO_DID}",`,
  `json[049] │       "signer_public_key_b64": "${DEMO_PUB_B64}",`,
  'json[050] │       "signature_algo": "EdDSA"',
  'json[051] │     },',
  'json[052] │     {',
  'json[053] │       "type": "payment",',
  `json[054] │       "token": "${DEMO_PAY_TOKEN}"`,
  'json[055] │     }',
  'json[056] │   ]',
  'json[057] │ }',
  '►SECTION► · HTTP · 200 gate-verified JSON (server → client)',
  '►RULE►━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  '← HTTP 200  application/json  gate-verified resource  EEP-Version: 0.1',
  'json[058] │ {',
  'json[059] │   "report": "corpx-q1-2026",',
  'json[060] │   "company": "CorpX Industries",',
  'json[061] │   "revenue": "$4.2B",',
  'json[062] │   "net_income": "$890M",',
  'json[063] │   "yoy_growth": "23%",',
  'json[064] │   "segments": [',
  'json[065] │     { "name": "Cloud", "revenue": "$2.1B", "growth": "31%" },',
  'json[066] │     { "name": "Enterprise", "revenue": "$1.4B", "growth": "18%" },',
  'json[067] │     { "name": "Consumer", "revenue": "$0.7B", "growth": "9%" }',
  'json[068] │   ],',
  'json[069] │   "guidance": "FY2026 revenue outlook $17.5B–$18.2B",',
  'json[070] │   "generated_at": "2026-04-12T12:00:00.000Z"',
  'json[071] │ }',
  COMPARE_BLOCK_RIGHT,
];

export function getRightTerminalRowClass(line: string): string {
  if (line === COMPARE_BLOCK_RIGHT) return 'rw-t-line rw-compare-host';
  if (line.startsWith('►SECTION►')) return 'rw-t-line rw-t-section';
  if (line.startsWith('►RULE►')) return 'rw-t-line rw-t-rule';
  if (line.startsWith('EEP path —')) return 'rw-t-line rw-t-banner';
  if (/^json\[\d{3}\] │/.test(line)) return 'rw-t-line rw-t-json';
  return 'rw-t-line rw-eep-row';
}

/** Plain monospace — no token coloring (sections, JSON rows, export). */
export function isRightPlainTerminalLine(line: string): boolean {
  if (line === COMPARE_BLOCK_RIGHT) return false;
  return (
    line.startsWith('►SECTION►') ||
    line.startsWith('►RULE►') ||
    line.startsWith('EEP path —') ||
    /^json\[\d{3}\] │/.test(line)
  );
}
