/** Sentinel lines in LEFT_LOG / RIGHT_LOG; replaced in UI by `TerminalCompareTable`. */

export const COMPARE_BLOCK_LEFT = '__COMPARE_BLOCK_LEFT__';
export const COMPARE_BLOCK_RIGHT = '__COMPARE_BLOCK_RIGHT__';

export type CompareRow = { label: string; value: string };

/**
 * Modeled discrete agent moves (outbound HTTP, Playwright ops, HTML parse passes, waits,
 * human coordination, merge)—not terminal line count. Tune when the Scenario A/B logs change.
 */
export const MODELED_AGENT_ACTIONS_LEFT = 27;
export const MODELED_AGENT_ACTIONS_RIGHT = 6;

export function buildLeftCompareRows(): readonly CompareRow[] {
  return [
    { label: 'Agent actions', value: String(MODELED_AGENT_ACTIONS_LEFT) },
    {
      label: 'Bytes on wire',
      value: '~974k modeled (2× full HTML + checkout DOM + scripts)',
    },
    {
      label: 'Tokens (est.)',
      value: '~244k',
    },
    {
      label: 'Human in the loop',
      value: '1 — simulated card capture before unlock',
    },
    {
      label: 'Path',
      value: 'bloated DOM → Playwright → #report-data + table merge → JSON',
    },
  ];
}

export function buildRightCompareRows(): readonly CompareRow[] {
  return [
    { label: 'Agent actions', value: String(MODELED_AGENT_ACTIONS_RIGHT) },
    {
      label: 'Bytes on wire',
      value: '~4.2k modeled (manifest + 402 + POST proofs + 200 JSON)',
    },
    {
      label: 'Tokens (est.)',
      value: '~1.1k',
    },
    {
      label: 'Human in the loop',
      value: '0 — agreement signature + mock USDC by agent',
    },
    {
      label: 'Path',
      value: '/.well-known/eep.json → 402 → gate_proofs → gate-verified JSON only',
    },
  ];
}
