'use client';
import { useState } from 'react';
import Link from 'next/link';
import CodeBlock from '@/components/CodeBlock';
import RealworldSimulationShowcase from '@/components/RealworldSimulationShowcase';
import ScrollReveal from '@/components/ScrollReveal';

/* ── Quick Start code examples ───────────────────── */
const QS_JS = `import { createHmac } from 'crypto';

// Subscribe via SSE: no webhook server needed
const stream = new EventSource(
  'https://api.example.com/eep/stream?source=acme-corp',
  { headers: { Authorization: \`Bearer \${API_KEY}\` } }
);

stream.addEventListener('com.example.entity.updated', (e) => {
  const event = JSON.parse(e.data);
  console.log('Entity changed:', event.data.field);
});`;

const QS_REST = `# Subscribe via webhook
curl -X POST https://api.example.com/eep/subscribe \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "source_did": "did:web:example.com:u:acme-corp",
    "event_types": ["com.example.entity.updated", "com.example.trust.*"],
    "delivery_method": "webhook",
    "delivery_url": "https://your-agent.example.com/hooks/eep"
  }'

# Or open an SSE stream directly
curl -N "https://api.example.com/eep/stream?source=acme-corp" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Accept: text/event-stream"`;

const QS_PYTHON = `from eep_signer import EEPSigner, verify_eep_webhook
import httpx

# Subscribe to entity events
async with httpx.AsyncClient() as client:
    res = await client.post(
        "https://api.example.com/eep/subscribe",
        headers={"Authorization": f"Bearer {API_KEY}"},
        json={
            "source_did": "did:web:example.com:u:acme-corp",
            "event_types": ["com.example.entity.updated", "com.example.trust.*"],
            "delivery_method": "webhook",
            "delivery_url": "https://your-agent.example.com/hooks/eep",
        },
    )`;

export default function Home() {
  const [qsTab, setQsTab] = useState<'js' | 'rest' | 'python'>('js');

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="hero-dark" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="hero-glow" />
        <div className="hero-dot-grid" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-split">
            <ScrollReveal variant="up" delay={0}>
              <div className="hero-left">
                <div className="hero-meta">
                  <code className="hero-version-badge">EEP v0.1</code>
                  <span className="hero-tag">Apache 2.0</span>
                  <span className="hero-tag">CloudEvents v1.0.2</span>
                  <span className="hero-tag">eep-setup CLI</span>
                  <span className="hero-tag">Reference stack</span>
                  <span className="hero-tag hero-tag-green">Zero-Trust Ready</span>
                </div>
                <h1 className="hero-title-dark">
                  The event bus<br />for the agentic web.
                </h1>
                <p className="hero-desc-dark">
                  Open protocol for real-time, agent-native communication
                  between digital entities. Push-first. No polling.
                  No lock-in. Generate manifests, mount middleware, and verify
                  artifacts with the same toolchain the reference implementation uses.
                </p>
                <div className="hero-actions">
                  <Link href="/docs" className="btn btn-primary-dark">Get Started</Link>
                  <Link href="/playground" className="btn btn-primary-dark">Playground</Link>
                  <Link href="/docs/guides/quick-setup" className="btn btn-ghost">Quick setup →</Link>
                </div>
                <p className="hero-playground-line">
                  <Link href="/playground">Validate CloudEvents &amp; webhook HMAC in the browser</Link>
                  <span className="hero-playground-line-sep" aria-hidden>·</span>
                  <span className="hero-playground-line-muted">no install</span>
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="up" delay={150}>
              <div className="hero-right">
                <div className="hero-code-label">CloudEvent: live signal</div>
                <CodeBlock language="json" code={`{
  "specversion": "1.0",
  "type": "com.example.entity.updated",
  "source": "did:web:api.example.com:u:acme",
  "id": "01HN3QK7GX-1708123456000",
  "time": "2026-03-06T06:00:00Z",
  "eep_version": "0.1",
  "eep_subscription_id": "sub_01HN3QK7GX",
  "eep_trust_score": 92,
  "eep_actor_type": "agent",
  "data": {
    "field": "pricing",
    "current": {
      "model": "fixed",
      "amount": 99,
      "currency": "usd"
    }
  }
}`} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Three layers ─────────────────────────────── */}
      <section className="section">
        <div className="container">
          <ScrollReveal variant="up">
            <h2 className="section-h2">Three layers. Use one or all.</h2>
            <p className="section-p">
              EEP layers are independent. Implement only what your use case needs.
            </p>
          </ScrollReveal>
          <ScrollReveal variant="up" delay={80}>
            <div className="layers-grid">
              <div className="layer-row">
                <div className="layer-left">
                  <div className="layer-meta">
                    <span className="layer-num">Layer 1</span>
                    <span className="layer-name">State Resolution</span>
                    <span className="layer-proto">HTTP REST</span>
                  </div>
                  <p className="layer-desc">
                    Stateless entity discovery. <code className="code-inline">GET /u/acme-corp</code> returns
                    the entity profile, DID document, gate config, and subscribe link.
                    Cacheable. Universally accessible. The <code className="code-inline">/.well-known/eep.json</code> manifest
                    is the machine-readable protocol surface for agents (see the{' '}
                    <Link href="/docs/guides/discovery">discovery guide</Link>); EEP does not replace SEO sitemaps or guarantee answer-engine placement.
                  </p>
                </div>
                <div className="layer-code">
                  <CodeBlock language="http" code={`GET /u/acme-corp
Accept: application/json

← 200 OK
EEP-Version: 0.1
EEP-Entity-DID: did:web:example.com:u:acme-corp
Link: <.../subscribe>; rel="subscribe"`} />
                </div>
              </div>
              <div className="layer-row">
                <div className="layer-left">
                  <div className="layer-meta">
                    <span className="layer-num">Layer 2</span>
                    <span className="layer-name">Signal Stream</span>
                    <span className="layer-proto">SSE · Webhooks</span>
                  </div>
                  <p className="layer-desc">
                    Unidirectional, persistent event delivery. Entities push CloudEvents
                    the moment state changes. Last-Event-ID replay (24h minimum).
                    HMAC-SHA256 signed.
                  </p>
                </div>
                <div className="layer-code">
                  <CodeBlock language="json" code={`{
  "specversion": "1.0",
  "type": "com.example.entity.updated",
  "source": "did:web:example.com:u:acme",
  "id": "01HN3QK7GX-1708123456000",
  "data": { "field": "bio" }
}`} />
                </div>
              </div>
              <div className="layer-row">
                <div className="layer-left">
                  <div className="layer-meta">
                    <span className="layer-num">Layer 3</span>
                    <span className="layer-name">Network Pulse</span>
                    <span className="layer-proto">WebSocket</span>
                  </div>
                  <p className="layer-desc">
                    Bidirectional, stateful sessions for live negotiation and autonomous
                    commerce. Per-entity sequence tracking, gap detection, JWT re-auth.
                  </p>
                </div>
                <div className="layer-code">
                  <CodeBlock language="json" code={`{
  "v": 1,
  "type": "commerce",
  "action": "offer",
  "seq": 42,
  "data": {
    "service": "consulting",
    "pricing": { "model": "fixed",
      "amount": 75, "currency": "usd" }
  }
}`} />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Gates & Commerce ─────────────────────────── */}
      <section className="section section-alt">
        <div className="container">
          <ScrollReveal variant="up">
            <h2 className="section-h2">Access control that agents can read.</h2>
            <p className="section-p">
              Machine-readable HTTP 402 responses tell agents exactly what proof they need to provide.
              No human in the loop.
            </p>
          </ScrollReveal>
          <ScrollReveal variant="up" delay={80}>
            <div className="two-col">
              <div className="gates-left">
                <div className="gates-block">
                  <div className="gates-block-title">Six gate types</div>
                  <div className="gate-tags">
                    {['credential', 'identity', 'agreement', 'data_request',
                      'payment', 'trust', 'allowlist', 'reciprocal', 'x-*'].map(t => (
                        <span key={t} className="gate-tag">{t}</span>
                      ))}
                  </div>
                </div>
                <div className="gates-block">
                  <div className="gates-block-title">Commerce state machine</div>
                  <div className="commerce-flow">
                    {['offer', 'counter', 'accept', 'invoice', 'paid', 'complete'].map((step, i, arr) => (
                      <span key={step}>
                        <span className="commerce-step">{step}</span>
                        {i < arr.length - 1 && <span className="commerce-arrow">→</span>}
                      </span>
                    ))}
                  </div>
                  <p className="gates-note">Strict fail-closed semantic verification by default. Three pricing modes (fixed · negotiated · auction). WebSocket negotiation. No human required.</p>
                </div>
              </div>
              <div>
                <CodeBlock language="json" code={`// HTTP 402: machine-readable gate challenge
{
  "gate_id": "premium_dataset_v1",
  "missing_requirements": [
    {
      "type": "payment",
      "amount": "10.00",
      "currency": "USD",
      "networks": ["solana", "base"],
      "receiver": "did:web:api.example.com"
    }
  ]
}`} />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Recorded terminal demo (raw output, complements the styled showcase below) ──── */}
      <section className="section section-alt">
        <div className="container">
          <ScrollReveal variant="up">
            <div style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
              <p style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem', opacity: 0.7, marginBottom: 8 }}>
                Raw recording — no styling
              </p>
              <h2 style={{ fontSize: '2rem', marginBottom: 12, lineHeight: 1.2 }}>
                What it actually looks like in your terminal
              </h2>
              <p style={{ opacity: 0.75, marginBottom: 24, fontSize: '1rem' }}>
                Both scenarios start at the same moment, in two parallel panes. The EEP pane
                (right) finishes in <strong>~10&nbsp;s</strong> while the current-web pane (left) is still
                busy with Playwright extraction at <strong>~26&nbsp;s</strong>. Deterministic, no LLM calls.
                The interactive walkthrough is below.
              </p>
              <video
                src="/realworld-demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                aria-label="Split-screen recording: two terminal panes side by side, both running simultaneously. Left pane is an agent scraping HTML over the current web (~26s, ~46KB, ~11.5K tokens, 2 simulated human steps). Right pane is the same agent fetching the same data via EEP (~10s, ~2.2KB, ~386 tokens, 0 human steps). After both finish, a full-width comparison table appears."
                style={{
                  width: '100%',
                  maxWidth: 1100,
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                }}
              />
              <p style={{ marginTop: 16, fontSize: '0.875rem', opacity: 0.6 }}>
                Reproducible: <code>vhs realworld-simulation/demo.tape</code> in{' '}
                <Link href="https://github.com/eep-dev/EEP/tree/main/realworld-simulation" style={{ textDecoration: 'underline' }}>
                  eep-dev/EEP
                </Link>
                .
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <RealworldSimulationShowcase />

      {/* ── Packages table ───────────────────────────── */}
      <section className="section">
        <div className="container">
          <ScrollReveal variant="up">
            <h2 className="section-h2">Libraries, middleware, bridge, and setup CLI.</h2>
            <p className="section-p">
              TypeScript packages use <code className="code-inline">@eep-dev/*</code>; Python uses <code className="code-inline">eep-*</code>. Core stacks are framework-agnostic;
              <code className="code-inline"> @eep-dev/middleware</code> and <code className="code-inline">eep-middleware-python</code> adapt EEP to Express, Fastify, Hono, Koa, FastAPI, Flask, and Django.
              <code className="code-inline"> @eep-dev/setup-cli</code> (<code className="code-inline">eep-setup</code>) generates manifests, contract tests, and verification reports.
              Node.js &gt;= 18 for core libraries, Node.js &gt;= 22 for compliance CLI.
            </p>
          </ScrollReveal>
          <ScrollReveal variant="up" delay={80}>
            <table className="pkg-table">
              <thead>
                <tr>
                  <th>Package</th>
                  <th>TypeScript</th>
                  <th>Python</th>
                  <th>What it does</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>gates</code></td>
                  <td><code className="code-inline">@eep-dev/gates</code></td>
                  <td><code className="code-inline">eep-gates</code></td>
                  <td>Access control, commerce state machine, service marketplace, proof validation</td>
                </tr>
                <tr>
                  <td><code>discovery</code></td>
                  <td><code className="code-inline">@eep-dev/discovery</code></td>
                  <td><code className="code-inline">eep-discovery</code></td>
                  <td>Manifest validation, HTTP Link header parsing, DNS TXT record parsing</td>
                </tr>
                <tr>
                  <td><code>signer</code></td>
                  <td><code className="code-inline">@eep-dev/signer</code></td>
                  <td><code className="code-inline">eep-signer</code></td>
                  <td>HMAC-SHA256 webhook signing and verification (Standard Webhooks spec)</td>
                </tr>
                <tr>
                  <td><code>validator</code></td>
                  <td><code className="code-inline">@eep-dev/validator</code></td>
                  <td><code className="code-inline">eep-validator</code></td>
                  <td>SSRF prevention, URL safety checks, event type pattern matching</td>
                </tr>
                <tr>
                  <td><code>compliance-cli</code></td>
                  <td><code className="code-inline">@eep-dev/compliance-cli</code></td>
                  <td><code className="code-inline">eep-compliance-cli</code></td>
                  <td>End-to-end conformance test runner: point it at any EEP platform</td>
                </tr>
                <tr>
                  <td><code>mcp-bridge</code></td>
                  <td><code className="code-inline">@eep-dev/mcp-bridge</code></td>
                  <td><code className="code-inline">eep-mcp-bridge-python</code></td>
                  <td>Translate MCP tool surfaces into EEP manifests and DID-aware gates</td>
                </tr>
                <tr>
                  <td><code>middleware</code></td>
                  <td><code className="code-inline">@eep-dev/middleware</code></td>
                  <td><code className="code-inline">eep-middleware-python</code></td>
                  <td>Mount generated subscribe/stream/gate routes on your existing HTTP server</td>
                </tr>
                <tr>
                  <td><code>setup-cli</code></td>
                  <td><code className="code-inline">@eep-dev/setup-cli</code></td>
                  <td>-</td>
                  <td><code className="code-inline">eep-setup</code>: init, inject, apply, verify, presets, CI <code className="code-inline">--answers</code>, <code className="code-inline">--production</code> guardrails</td>
                </tr>
              </tbody>
            </table>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Ship in minutes ───────────────────────────── */}
      <section className="section section-alt">
        <div className="container">
          <ScrollReveal variant="up">
            <h2 className="section-h2">From zero to a verified manifest.</h2>
            <p className="section-p">
              Run the dual-runtime Docker reference, or wire <code className="code-inline">eep-setup</code> and middleware into your own repo.
              The five-minute proof paths cover Compose, CLI-only flows, and a minimal Express example, then add CI checks for EEP-ready artifacts and full compliance tiers.
              For a full production deployment that exercises every conformance tier and gate type, see <a href="https://more.md" target="_blank" rel="noopener noreferrer">more.md</a>, the platform where EEP originated.
            </p>
            <ul>
              <li><Link href="/docs/guides/quick-setup">Quick setup (CLI + integration) →</Link></li>
              <li>
                <a href="https://github.com/eep-dev/EEP/blob/main/docs/guides/five-minute-proof.md" target="_blank" rel="noopener noreferrer">Five-minute proof (reference stack &amp; middleware) ↗</a>
              </li>
              <li>
                <a href="https://github.com/eep-dev/EEP/blob/main/docs/guides/eep-ready-verification.md" target="_blank" rel="noopener noreferrer">EEP-ready verification in CI ↗</a>
              </li>
              <li>
                <a href="https://github.com/eep-dev/EEP/blob/main/docs/guides/eep-positioning-complementary.md" target="_blank" rel="noopener noreferrer">How EEP complements MCP / A2A ↗</a>
              </li>
              <li>
                <a href="https://github.com/eep-dev/EEP/blob/main/docs/guides/realworld-simulation.md" target="_blank" rel="noopener noreferrer">Realworld simulation: HTML vs EEP (terminal demo) ↗</a>
              </li>
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Conformance ───────────────────────────────── */}
      <section className="section">
        <div className="container">
          <ScrollReveal variant="up">
            <h2 className="section-h2">Three conformance tiers. Start at Core.</h2>
            <p className="section-p">
              Each tier is a strict superset of the previous.
              Run <code className="code-inline">npx @eep-dev/compliance-cli --target https://your-api.com --report-json ./eep-audit.json --report-md ./eep-audit.md</code> to see where you stand.
            </p>
          </ScrollReveal>
          <ScrollReveal variant="up" delay={80}>
            <table className="conformance-table">
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Requirements</th>
                  <th>Signal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="level-badge level-core">Core</span></td>
                  <td>Layer 1 (REST state) + Layer 2 SSE, CloudEvents v1.0.2, DID identity</td>
                  <td><code className="code-inline">{`"conformanceTier": "Core"`}</code></td>
                </tr>
                <tr>
                  <td><span className="level-badge level-standard">Standard</span></td>
                  <td>Core + Webhooks + HMAC-SHA256 + <code className="code-inline">credential</code> &amp; <code className="code-inline">payment</code> gates + version negotiation</td>
                  <td><code className="code-inline">{`"conformanceTier": "Standard"`}</code></td>
                </tr>
                <tr>
                  <td><span className="level-badge level-full">Full</span></td>
                  <td>Standard + Layer 3 WebSockets + commerce state machine + <code className="code-inline">agreement</code> &amp; <code className="code-inline">data_request</code> gates + session persistence + W3C DPV privacy</td>
                  <td><code className="code-inline">{`"conformanceTier": "Full"`}</code></td>
                </tr>
              </tbody>
            </table>
            <p className="section-p" style={{ marginTop: '1rem' }}>
              Compliance output includes a machine-readable <code className="code-inline">score_100</code> and actionable recommendations, so teams and coding agents can automate remediation loops.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Adoption tracks ───────────────────────────── */}
      <section className="section">
        <div className="container">
          <ScrollReveal variant="up">
            <h2 className="section-h2">Adopt EEP with a clear path.</h2>
            <p className="section-p">
              Whether you are a startup, enterprise team, public institution, solo builder, or coding agent,
              EEP provides a concrete rollout path with runnable scripts and audit outputs.
            </p>
            <ul>
              <li><Link href="/docs/guides/quick-setup">Quick setup (CLI + post-setup integration) →</Link></li>
              <li><Link href="/docs/guides/adoption">Adoption Paths (step-by-step) →</Link></li>
              <li><Link href="/docs/guides/verification">Verification &amp; scoring workflow →</Link></li>
              <li><a href="https://github.com/eep-dev/EEP/blob/main/docs/guides/adoption-metrics.md" target="_blank" rel="noopener noreferrer">Adoption metrics template ↗</a></li>
              <li><a href="https://github.com/eep-dev/EEP/blob/main/docs/guides/agent-onboarding.md" target="_blank" rel="noopener noreferrer">Agent onboarding guide ↗</a></li>
              <li><a href="https://github.com/eep-dev/EEP/blob/main/docs/guides/enterprise-implementation-playbook.md" target="_blank" rel="noopener noreferrer">Enterprise implementation playbook ↗</a></li>
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Interoperability ─────────────────────────── */}
      <section className="section">
        <div className="container">
          <ScrollReveal variant="up">
            <h2 className="section-h2">Protocol-first interoperability across MCP, A2A, and ANP.</h2>
            <p className="section-p">
              EEP remains a full protocol standard for agent-to-entity engagement.
              It complements MCP/A2A/ANP by covering realtime entity signals, policy gates, and payment-aware access.
            </p>
          </ScrollReveal>
          <ScrollReveal variant="up" delay={80}>
            <div className="interop-grid">
              <div className="interop-item">
                <div className="interop-proto">MCP</div>
                <div className="interop-role">Vertical (agent ↔ tool)</div>
                <p className="interop-desc">
                  Native MCP server. Any agent retrieves entity information via semantic search.
                  Tool-level integration out of the box.
                </p>
              </div>
              <div className="interop-arrow">+</div>
              <div className="interop-item">
                <div className="interop-proto">A2A</div>
                <div className="interop-role">Horizontal (agent ↔ agent)</div>
                <p className="interop-desc">
                  EEP profiles host Agent Cards. Cross-platform discovery and task delegation.
                  Google&apos;s A2A spec natively compatible.
                </p>
              </div>
              <div className="interop-arrow">+</div>
              <div className="interop-item">
                <div className="interop-proto">EEP</div>
                <div className="interop-role">Agent ↔ entity protocol</div>
                <p className="interop-desc">
                  Discovery, trust, realtime eventing, gates, and commerce for digital entities.
                  Deploy standalone or compose with other protocols.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Quick Start ───────────────────────────────── */}
      <section className="section section-alt">
        <div className="container">
          <ScrollReveal variant="up">
            <h2 className="section-h2">Subscribe in seconds.</h2>
            <div className="tabs">
              <button className={`tab ${qsTab === 'js' ? 'active' : ''}`} onClick={() => setQsTab('js')}>JavaScript</button>
              <button className={`tab ${qsTab === 'rest' ? 'active' : ''}`} onClick={() => setQsTab('rest')}>REST (cURL)</button>
              <button className={`tab ${qsTab === 'python' ? 'active' : ''}`} onClick={() => setQsTab('python')}>Python</button>
            </div>
            {qsTab === 'js' && <CodeBlock language="javascript" code={QS_JS} />}
            {qsTab === 'rest' && <CodeBlock language="bash" code={QS_REST} />}
            {qsTab === 'python' && <CodeBlock language="python" code={QS_PYTHON} />}
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="section cta-section">
        <div className="container">
          <ScrollReveal variant="up">
            <div className="cta-inner">
              <div>
                <h2 className="cta-h2">Open source. No committee. No waiting.</h2>
                <p className="cta-p">
                  Apache 2.0. Developed at <a href="https://more.md" target="_blank" rel="noopener noreferrer">more.md</a>, open for the agentic web. Implement it today. File an EEIP if you need to change it.
                </p>
              </div>
              <div className="hero-actions">
                <Link href="/docs" className="btn btn-primary">Read the Docs</Link>
                <Link href="/docs/packages" className="btn btn-secondary">Explore Packages →</Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
