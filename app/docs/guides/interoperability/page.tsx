import Link from 'next/link';
import CodeBlock from '../../../../components/CodeBlock';

export const metadata = { title: 'Interoperability (MCP / A2A) — EEP Docs' };

export default function InteroperabilityPage() {
    return (
        <>
            <h1>Interoperability</h1>
            <p>
                EEP is designed to co-exist and interoperate with the Model Context Protocol (MCP),
                A2A, OpenAPI, ActivityPub, AT Protocol, and existing enterprise API gateways.
                EEP fills the <em>identity + event bus</em> layer that established protocols need but don&apos;t provide.
            </p>

            <h2>EEP and MCP</h2>
            <p>
                MCP defines the <em>agent-to-tool</em> layer — how an LLM accesses tools, resources, and prompts from a server.
                EEP operates at the <em>entity-to-agent network</em> layer — how entities publish state and control access.
                The two protocols are complementary, not competing.
            </p>
            <table>
                <thead><tr><th>Aspect</th><th>MCP</th><th>EEP</th></tr></thead>
                <tbody>
                    <tr><td>Layer</td><td>Agent-to-tool</td><td>Entity-to-agent (network)</td></tr>
                    <tr><td>Discovery</td><td>Tool list from server</td><td><code>/.well-known/eep.json</code></td></tr>
                    <tr><td>Authentication</td><td>No native DID auth</td><td>DID-based cryptographic identity</td></tr>
                    <tr><td>Payments</td><td>Not supported</td><td>x402 + on-chain proofs</td></tr>
                    <tr><td>Real-time events</td><td>Not native</td><td>Layer 2 SSE + Webhooks</td></tr>
                    <tr><td>Bilateral negotiation</td><td>Not native</td><td>Layer 3 WebSockets + commerce state machine</td></tr>
                </tbody>
            </table>
            <p>
                <strong>Example:</strong> An agent uses MCP for local <code>web-search</code> and <code>code-runner</code> tools,
                and uses EEP to subscribe to a financial data publisher&apos;s real-time price feed — paying via x402 and
                verifying the publisher&apos;s EEP Conformance Credential.
            </p>

            <h2>EEP and OpenAPI</h2>
            <p>
                OpenAPI documents <em>what</em> an endpoint does for human developers.
                EEP documents <em>how agents discover, authenticate, and access</em> the entity.
                An entity can be fully OpenAPI-documented <strong>and</strong> EEP-compliant simultaneously.
            </p>
            <table>
                <thead><tr><th>Aspect</th><th>OpenAPI</th><th>EEP</th></tr></thead>
                <tbody>
                    <tr><td>Audience</td><td>Human developers</td><td>Autonomous agents</td></tr>
                    <tr><td>Access control</td><td>API keys / OAuth</td><td>DID proofs, VCs, payments (machine-resolved)</td></tr>
                    <tr><td>Events</td><td>Not native</td><td>Layer 2 SSE + Webhooks</td></tr>
                </tbody>
            </table>

            <h2>EEP and ActivityPub / AT Protocol</h2>
            <p>
                ActivityPub (Mastodon) and AT Protocol (Bluesky) are human-centric social communication protocols.
                EEP is agent-centric. Publishers can expose EEP endpoints <strong>alongside</strong> their existing feeds
                — their content becomes available to agents in structured form without abandoning their social presence.
            </p>
            <table>
                <thead><tr><th>Capability</th><th>ActivityPub</th><th>AT Protocol</th><th>EEP</th></tr></thead>
                <tbody>
                    <tr><td>Machine-readable structured data</td><td>Partial</td><td>Partial</td><td>✅ TOON/JSON/Markdown</td></tr>
                    <tr><td>Real-time event stream</td><td>External (WebSub)</td><td>Firehose</td><td>✅ Native SSE</td></tr>
                    <tr><td>DID-based identity</td><td>❌</td><td>✅ (PLC)</td><td>✅ W3C DIDs</td></tr>
                    <tr><td>Gated access (payment, credential)</td><td>❌</td><td>❌</td><td>✅</td></tr>
                    <tr><td>Autonomous commerce</td><td>❌</td><td>❌</td><td>✅ Layer 3 WS</td></tr>
                </tbody>
            </table>

            <h2>EEP and Enterprise API Gateways</h2>
            <p>
                Organizations running Kong, Apigee, or AWS API Gateway <strong>do not need to replace them</strong>.
                EEP can be implemented as a thin middleware that wraps existing infrastructure.
                A company with an existing API can become EEP Core-conformant in a single sprint.
            </p>
            <p>The minimal EEP compatibility layer must:</p>
            <ol>
                <li>Expose <code>/.well-known/eep.json</code> at the gateway root</li>
                <li>Add <code>Link: &lt;...&gt;; rel=&quot;eep&quot;</code> response headers</li>
                <li>Validate EEP gate proofs before forwarding requests</li>
                <li>Transform backend events to CloudEvents format for SSE/Webhook delivery</li>
            </ol>

            <CodeBlock language="yaml" code={`# Kong Gateway — add EEP Link headers
plugins:
  - name: response-transformer
    config:
      add:
        headers:
          - "Link: <https://api.example/.well-known/eep.json>; rel=\\"eep\\""
          - "Link: <https://api.example/eep/subscribe>; rel=\\"subscribe\\""`} />

            <h2>Next steps</h2>
            <ul>
                <li><Link href="/docs/guides/discovery">Discovery — manifest, Link headers, DNS →</Link></li>
                <li><Link href="/docs/specification">Full specification →</Link></li>
                <li><Link href="/docs/packages">Packages &amp; SDKs →</Link></li>
            </ul>
        </>
    );
}
