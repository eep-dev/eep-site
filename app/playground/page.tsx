'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

const SAMPLE_EVENT = JSON.stringify(
  {
    specversion: '1.0',
    id: 'evt_01HN3QK7GX-1708123456000',
    source: 'did:web:api.example.com:u:acme-corp',
    type: 'com.example.entity.updated',
    time: new Date().toISOString(),
    datacontenttype: 'application/json',
    eep_version: '0.1',
    eep_trust_score: 85,
    eep_actor_type: 'agent',
    data: { field: 'status', old_value: 'active', new_value: 'verified' },
  },
  null,
  2
);

const KNOWN_EVENT_TYPES = [
  'entity.updated', 'entity.state.changed', 'trust.changed', 'trust.signal.added',
  'trust.signal.removed', 'trust.signal.revoked', 'session.created', 'session.renewed',
  'session.revoked', 'agent.task.created', 'agent.task.started', 'agent.task.completed',
  'agent.task.failed', 'agent.task.delegated', 'data.withdrawal.requested',
  'data.withdrawal.acknowledged', 'data.withdrawal.completed', 'commerce.rfp.open',
  'commerce.rfp.bid', 'commerce.rfp.closed', 'commerce.agreement.proposed',
  'commerce.agreement.signed', 'commerce.payment.received', 'commerce.payment.confirmed',
  'gate.access.granted', 'gate.access.denied', 'gate.access.expired',
];

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function validateEnvelope(json: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (typeof json !== 'object' || json === null || Array.isArray(json)) {
    return { valid: false, errors: ['Root must be a JSON object'], warnings: [] };
  }

  const obj = json as Record<string, unknown>;
  const required = ['specversion', 'id', 'source', 'type', 'time', 'datacontenttype'];
  for (const field of required) {
    if (!(field in obj)) errors.push(`Missing required field: "${field}"`);
  }

  if (obj.specversion !== '1.0') {
    errors.push(`specversion must be "1.0", got "${obj.specversion}"`);
  }
  if (obj.datacontenttype !== 'application/json') {
    errors.push(`datacontenttype must be "application/json", got "${obj.datacontenttype}"`);
  }

  if (typeof obj.id === 'string') {
    if (obj.id.length < 1) errors.push('id must have minLength 1');
    if (obj.id.length > 128) errors.push('id must have maxLength 128');
  }

  if (typeof obj.source === 'string' && obj.source.length < 1) {
    errors.push('source must have minLength 1');
  }

  if (typeof obj.type === 'string') {
    const typePattern = /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/;
    if (!typePattern.test(obj.type)) {
      errors.push(`type "${obj.type}" does not match EEP reverse-domain pattern`);
    }
    const suffix = obj.type.split('.').slice(-2).join('.');
    const longSuffix = obj.type.split('.').slice(-3).join('.');
    if (!KNOWN_EVENT_TYPES.includes(suffix) && !KNOWN_EVENT_TYPES.includes(longSuffix)) {
      warnings.push(`type suffix "${suffix}" is not in the canonical EEP event registry (custom types are allowed)`);
    }
  }

  if (typeof obj.time === 'string') {
    if (isNaN(Date.parse(obj.time))) errors.push(`time "${obj.time}" is not a valid date-time`);
  }

  if ('eep_version' in obj && typeof obj.eep_version === 'string') {
    if (!/^\d+\.\d+(-[a-z]+)?$/.test(obj.eep_version)) {
      errors.push(`eep_version "${obj.eep_version}" does not match pattern`);
    }
  }

  if ('eep_trust_score' in obj) {
    const s = obj.eep_trust_score;
    if (typeof s !== 'number' || s < 0 || s > 100) {
      errors.push('eep_trust_score must be an integer 0-100');
    }
  }

  if ('eep_actor_type' in obj) {
    const allowed = ['human', 'agent', 'system', 'cron'];
    if (!allowed.includes(obj.eep_actor_type as string)) {
      errors.push(`eep_actor_type must be one of: ${allowed.join(', ')}`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

async function hmacSign(
  secret: string,
  webhookId: string,
  timestamp: string,
  rawBody: string
): Promise<string> {
  const enc = new TextEncoder();
  const keyData = enc.encode(secret);
  const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signedContent = `${webhookId}.${timestamp}.${rawBody}`;
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(signedContent));
  const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `v1,${b64}`;
}

async function hmacVerify(
  secret: string,
  webhookId: string,
  timestamp: string,
  signature: string,
  rawBody: string,
  toleranceSeconds = 60
): Promise<{ valid: boolean; error?: string }> {
  const ts = parseInt(timestamp, 10);
  if (isNaN(ts)) return { valid: false, error: 'Invalid timestamp: not a number' };

  const age = Math.floor(Date.now() / 1000) - ts;
  if (Math.abs(age) > toleranceSeconds) {
    return { valid: false, error: `Timestamp outside ${toleranceSeconds}s window (age: ${age}s)` };
  }

  const expected = await hmacSign(secret, webhookId, timestamp, rawBody);
  const sigs = signature.split(' ');
  for (const s of sigs) {
    if (s === expected) return { valid: true };
  }
  return { valid: false, error: 'Signature mismatch' };
}

type Tab = 'validate' | 'sign' | 'verify';

export default function PlaygroundPage() {
  const [tab, setTab] = useState<Tab>('validate');

  const [eventJson, setEventJson] = useState(SAMPLE_EVENT);
  const [valResult, setValResult] = useState<ValidationResult | null>(null);

  const [secret, setSecret] = useState('my-secret-key-at-least-16');
  const [webhookId, setWebhookId] = useState('msg_01HN3QK7GX');
  const [signBody, setSignBody] = useState(SAMPLE_EVENT);
  const [signResult, setSignResult] = useState('');

  const [verSecret, setVerSecret] = useState('my-secret-key-at-least-16');
  const [verWebhookId, setVerWebhookId] = useState('msg_01HN3QK7GX');
  const [verTimestamp, setVerTimestamp] = useState(Math.floor(Date.now() / 1000).toString());
  const [verSignature, setVerSignature] = useState('');
  const [verBody, setVerBody] = useState(SAMPLE_EVENT);
  const [verResult, setVerResult] = useState<{ valid: boolean; error?: string } | null>(null);

  const doValidate = useCallback(() => {
    try {
      const parsed = JSON.parse(eventJson);
      setValResult(validateEnvelope(parsed));
    } catch (e) {
      setValResult({ valid: false, errors: [`Invalid JSON: ${(e as Error).message}`], warnings: [] });
    }
  }, [eventJson]);

  const doSign = useCallback(async () => {
    if (secret.length < 16) {
      setSignResult('Error: secret must be at least 16 characters');
      return;
    }
    const ts = Math.floor(Date.now() / 1000).toString();
    const sig = await hmacSign(secret, webhookId, ts, signBody);
    setSignResult(`webhook-id: ${webhookId}\nwebhook-timestamp: ${ts}\nwebhook-signature: ${sig}`);
  }, [secret, webhookId, signBody]);

  const doVerify = useCallback(async () => {
    if (verSecret.length < 16) {
      setVerResult({ valid: false, error: 'Secret must be at least 16 characters' });
      return;
    }
    const result = await hmacVerify(verSecret, verWebhookId, verTimestamp, verSignature, verBody);
    setVerResult(result);
  }, [verSecret, verWebhookId, verTimestamp, verSignature, verBody]);

  return (
    <div className="playground-layout">
      <nav className="playground-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span style={{ margin: '0 0.5rem', color: 'var(--text-muted)' }}>/</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Playground</span>
      </nav>

      <h1 className="playground-title">EEP Playground</h1>
      <p className="playground-lede">
        Validate EEP event envelopes against the <code>event.envelope.json</code> schema (v0.1), sign webhook payloads
        using HMAC-SHA256 (Standard Webhooks), and verify incoming signatures. Everything runs in your browser via Web Crypto.
      </p>

      <div className="playground-tabs" role="tablist">
        {([
          ['validate', 'Validate Event'],
          ['sign', 'Sign Payload'],
          ['verify', 'Verify Signature'],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            className={`playground-tab ${tab === key ? 'playground-tab-active' : ''}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'validate' && (
        <section aria-labelledby="playground-validate-heading">
          <h2 id="playground-validate-heading" className="sr-only">
            Validate event envelope
          </h2>
          <label className="playground-field-label" htmlFor="playground-event-json">
            Event envelope JSON
          </label>
          <textarea
            id="playground-event-json"
            className="playground-textarea"
            value={eventJson}
            onChange={(e) => setEventJson(e.target.value)}
            rows={16}
            spellCheck={false}
          />
          <button type="button" className="playground-btn" onClick={doValidate}>
            Validate against event.envelope.json
          </button>

          {valResult && (
            <div
              className={`playground-result ${valResult.valid ? 'playground-result-ok' : 'playground-result-err'}`}
            >
              <p
                className="playground-result-title"
                style={{ color: valResult.valid ? 'var(--accent)' : 'oklch(0.62 0.18 25)' }}
              >
                {valResult.valid ? 'Valid EEP event envelope' : `Invalid (${valResult.errors.length} error${valResult.errors.length !== 1 ? 's' : ''})`}
              </p>
              {valResult.errors.map((e, i) => (
                <p key={i} className="playground-result-msg playground-result-msg-err">
                  {e}
                </p>
              ))}
              {valResult.warnings.map((w, i) => (
                <p key={`w${i}`} className="playground-result-msg playground-result-msg-warn">
                  {w}
                </p>
              ))}
            </div>
          )}

          <details className="playground-details">
            <summary>Canonical EEP event types (SPECIFICATION.md section 13)</summary>
            <ul>
              {KNOWN_EVENT_TYPES.map((t) => (
                <li key={t} style={{ marginBottom: '0.25rem' }}>
                  <code>{t}</code>
                </li>
              ))}
            </ul>
          </details>
        </section>
      )}

      {tab === 'sign' && (
        <section aria-labelledby="playground-sign-heading">
          <h2 id="playground-sign-heading" className="sr-only">
            Sign payload
          </h2>
          <div className="playground-grid-2">
            <div>
              <label className="playground-field-label" htmlFor="playground-secret">
                Secret (delivery_secret, min 16 chars)
              </label>
              <input
                id="playground-secret"
                className="playground-input"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div>
              <label className="playground-field-label" htmlFor="playground-wh-id">
                Webhook ID
              </label>
              <input
                id="playground-wh-id"
                className="playground-input"
                value={webhookId}
                onChange={(e) => setWebhookId(e.target.value)}
              />
            </div>
          </div>
          <label className="playground-field-label" htmlFor="playground-sign-body">
            Raw body (JSON)
          </label>
          <textarea
            id="playground-sign-body"
            className="playground-textarea"
            value={signBody}
            onChange={(e) => setSignBody(e.target.value)}
            rows={10}
            spellCheck={false}
          />
          <button type="button" className="playground-btn" onClick={doSign}>
            Sign with HMAC-SHA256
          </button>

          {signResult && <pre className="playground-pre">{signResult}</pre>}

          <p className="playground-hint">
            Signed content: <code>{'{webhook-id}.{webhook-timestamp}.{raw-body}'}</code> per{' '}
            <a href="https://www.standardwebhooks.com/" target="_blank" rel="noopener noreferrer">
              Standard Webhooks
            </a>{' '}
            and EEP SPECIFICATION.md section 5.3.
          </p>
        </section>
      )}

      {tab === 'verify' && (
        <section aria-labelledby="playground-verify-heading">
          <h2 id="playground-verify-heading" className="sr-only">
            Verify signature
          </h2>
          <div className="playground-grid-2">
            <div>
              <label className="playground-field-label" htmlFor="ver-secret">Secret</label>
              <input
                id="ver-secret"
                className="playground-input"
                value={verSecret}
                onChange={(e) => setVerSecret(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div>
              <label className="playground-field-label" htmlFor="ver-wh-id">Webhook ID</label>
              <input
                id="ver-wh-id"
                className="playground-input"
                value={verWebhookId}
                onChange={(e) => setVerWebhookId(e.target.value)}
              />
            </div>
            <div>
              <label className="playground-field-label" htmlFor="ver-ts">Timestamp (Unix seconds)</label>
              <input
                id="ver-ts"
                className="playground-input"
                value={verTimestamp}
                onChange={(e) => setVerTimestamp(e.target.value)}
              />
            </div>
            <div>
              <label className="playground-field-label" htmlFor="ver-sig">Signature (v1,…)</label>
              <input
                id="ver-sig"
                className="playground-input"
                value={verSignature}
                onChange={(e) => setVerSignature(e.target.value)}
                placeholder="v1,..."
              />
            </div>
          </div>
          <label className="playground-field-label" htmlFor="ver-body">
            Raw body
          </label>
          <textarea
            id="ver-body"
            className="playground-textarea"
            value={verBody}
            onChange={(e) => setVerBody(e.target.value)}
            rows={10}
            spellCheck={false}
          />
          <button type="button" className="playground-btn" onClick={doVerify}>
            Verify signature
          </button>

          {verResult && (
            <div className={`playground-result ${verResult.valid ? 'playground-result-ok' : 'playground-result-err'}`}>
              <p className="playground-result-title" style={{ color: verResult.valid ? 'var(--accent)' : 'oklch(0.62 0.18 25)' }}>
                {verResult.valid ? 'Signature valid' : 'Signature invalid'}
              </p>
              {verResult.error && (
                <p className="playground-result-msg playground-result-msg-err">{verResult.error}</p>
              )}
            </div>
          )}

          <p className="playground-hint">
            Replay protection: timestamps older than 60 seconds are rejected. Same algorithm as <code>@eep-dev/signer</code> (Node) and{' '}
            <code>eep-signer-python</code>.
          </p>
        </section>
      )}

      <footer className="playground-footer">
        <p>
          Schema: <code>schemas/v0.1/event.envelope.json</code>
          {' · '}
          Signer: <code>@eep-dev/signer</code>
          {' · '}
          <Link href="/docs">Documentation</Link>
          {' · '}
          <a href="https://github.com/eep-dev/EEP" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
