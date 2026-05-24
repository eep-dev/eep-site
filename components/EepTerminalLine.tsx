import type { ReactNode } from 'react';

import { RwAgentIcon, RwServerIcon } from '@/components/TerminalLogIcons';

/**
 * Token-colored line content, mirrors `eep_flow_style.stylize_eep_plain_line` categories
 * (AGENT, EEP, ← HTTP status, GET/POST + URL, requirements, proofs).
 */
export function EepTerminalLineContent({ line }: { line: string }): ReactNode {
  const httpResp = line.match(/^(←\s*)(HTTP\s+(\d{3}))(\s*)([\s\S]*)$/);
  if (httpResp) {
    const code = httpResp[3];
    const httpClass =
      code.startsWith('2') ? 'rw-eep-http-2' : code.startsWith('4') ? 'rw-eep-http-4' : 'rw-eep-http-other';
    return (
      <>
        <span className="rw-log-glyph rw-log-glyph--server" title="Server: HTTP response">
          <RwServerIcon className="rw-log-icon-svg" />
        </span>
        <span className="rw-eep-arrow">{httpResp[1]}</span>
        <span className={httpClass}>{httpResp[2]}</span>
        <span className="rw-eep-tail">{httpResp[4]}</span>
        <span className="rw-eep-tail">{httpResp[5]}</span>
      </>
    );
  }

  if (line.startsWith('AGENT')) {
    const rest = line.slice(5);
    const m = rest.match(/^(\s+)(GET|POST)(\s+)(\S+)([\s\S]*)$/);
    if (m) {
      return (
        <>
          <span className="rw-log-glyph rw-log-glyph--agent" title="Agent: outbound request">
            <RwAgentIcon className="rw-log-icon-svg" />
          </span>
          <span className="rw-eep-dim">{m[1]}</span>
          <span className="rw-eep-method">{m[2]}</span>
          <span className="rw-eep-dim">{m[3]}</span>
          <span className="rw-eep-url">{m[4]}</span>
          <span className="rw-eep-rest">{m[5]}</span>
        </>
      );
    }
    return (
      <>
        <span className="rw-log-glyph rw-log-glyph--agent" title="Agent: outbound request">
          <RwAgentIcon className="rw-log-icon-svg" />
        </span>
        <span className="rw-eep-rest">{rest}</span>
      </>
    );
  }

  if (line.startsWith('EEP')) {
    return (
      <span title="EEP stack: proofs / policy">
        <span className="rw-eep-brand">EEP</span>
        <span className="rw-eep-rest">{line.slice(3)}</span>
      </span>
    );
  }

  const req = line.match(/^(\s*)(requirement\[\d+]:\s*)(type=\S+)([\s\S]*)$/);
  if (req) {
    return (
      <span title="Requirement listed in 402 response body">
        <span className="rw-eep-dim">{req[1]}</span>
        <span className="rw-eep-req-label">{req[2]}</span>
        <span className="rw-eep-req-type">{req[3]}</span>
        <span className="rw-eep-rest">{req[4]}</span>
      </span>
    );
  }

  if (/Ed25519|mock USDC|gate_proofs|Signed agreement/i.test(line)) {
    return (
      <span className="rw-eep-proof" title="Signing payment + building gate proofs">
        {line}
      </span>
    );
  }

  if (/unmet|402|Payment Required/i.test(line)) {
    return (
      <span className="rw-eep-challenge" title="Payment required: gates not satisfied yet">
        {line}
      </span>
    );
  }

  return <span className="rw-eep-default">{line}</span>;
}
