import Link from 'next/link';

export const metadata = { title: 'Documentation — EEP' };

export default function DocsOverview() {
    return (
        <>
            <h1>Why EEP?</h1>
            <p>The vision behind the Entity Engagement Protocol and how to adopt it with production-grade guardrails.</p>

            <h2>The problem: the web was built for reading, not acting</h2>
            <p>
                The original web was designed as a document delivery system. A human types a URL, a server sends back an HTML page,
                and the human reads it. The client has to ask for data, resulting in a snapshot of what was true at the moment of asking.
            </p>
            <p>
                This works when humans read web pages. If the data is stale, they refresh. But an AI agent cannot keep polling.
                An agent monitoring supplier profiles for price changes ends up making decisions on stale data
                if it only checks hourly. It misses updates that matter.
            </p>
            <p><strong>The human web was built for human readers. The agentic web needs something different.</strong></p>

            <h2>The solution: push-first, event-driven entity communication</h2>
            <p>EEP defines a simple contract:</p>
            <blockquote>
                Any digital entity (a business, a person, a product, an AI agent) can publish a real-time stream of state changes.
                Any authorized subscriber (human or machine) can receive those changes the moment they happen.
            </blockquote>
            <p>
                Event-driven systems have powered financial markets, logistics networks, and IoT devices for decades.
                EEP brings that reliability to internet identities.
            </p>
            <p>
                The current implementation is optimized for zero-trust deployment: strict semantic verification for gates,
                replay-resistant webhook verification, SSRF controls (including IPv6 ULA/link-local blocks), and deterministic
                compliance verification outputs for automation.
            </p>

            <h2>What counts as an &quot;entity&quot;?</h2>
            <p>EEP is entity-agnostic. An entity has:</p>
            <ol>
                <li>A stable identity (a DID, a URL, a username)</li>
                <li>State that can change over time</li>
                <li>A need to notify others when that state changes</li>
            </ol>

            <p>Examples:</p>
            <ul>
                <li><strong>Freelancer profile</strong> — trust score goes up, new skill verified</li>
                <li><strong>SaaS product</strong> — pricing tier changes, new integration published</li>
                <li><strong>Supply chain node</strong> — inventory drops below threshold, shipment delayed</li>
                <li><strong>DAO</strong> — governance vote passes, treasury balance changes</li>
                <li><strong>AI agent</strong> — deployment updated, capability added, task completed</li>
            </ul>

            <h2>The three layers of EEP</h2>

            <h3>Layer 1: State Resolution (REST)</h3>
            <p>
                HTTP REST APIs handle discovery. Any agent can <code>GET /u/acme-corp</code> and receive a structured profile with
                capabilities, trust score, and a DID document. This layer is stateless, cacheable, and universally accessible.
            </p>

            <h3>Layer 2: Signal Stream (SSE + Webhooks)</h3>
            <p>
                Entities publish events as CloudEvents-compliant JSON payloads. Subscribers choose their preferred delivery mechanism:
                webhooks (platform POSTs events to subscriber&apos;s URL) or SSE (subscriber opens a long-lived HTTP connection).
                This layer is unidirectional and persistent.
            </p>

            <h3>Layer 3: Network Pulse (WebSockets)</h3>
            <p>
                Network pulse handles bidirectional, interactive scenarios like A2A task execution, agent-to-entity live negotiation,
                and collaborative editing. This layer is stateful, bidirectional, and latency-sensitive with per-entity sequence
                tracking, gap detection, replay support, and JWT re-authentication.
            </p>

            <h2>Who is EEP for?</h2>
            <table>
                <thead>
                    <tr><th>Audience</th><th>How EEP Helps</th></tr>
                </thead>
                <tbody>
                    <tr><td><strong>Platform developers</strong></td><td>Standard event channel for your entities — any AI agent can subscribe without bespoke integrations</td></tr>
                    <tr><td><strong>AI agent developers</strong></td><td>One subscription API across every EEP-compliant platform</td></tr>
                    <tr><td><strong>Enterprise architects</strong></td><td>Vendor-neutral event bus — no cloud lock-in</td></tr>
                </tbody>
            </table>

            <h2>SEO, GEO, and structured discovery</h2>
            <p>
                Classic <strong>SEO</strong> optimizes pages for humans using traditional search. Separate industry conversations about{' '}
                <strong>generative engine optimization (GEO)</strong> concern how sources appear in AI-mediated answers. EEP is not a ranking product:
                it standardizes <strong>machine-readable manifests</strong>, push streams, and verifiable gates so agents and tools can use structured data
                without re-parsing layout-heavy HTML.
            </p>
            <p>
                Read <Link href="/docs/guides/discovery">Discovery (manifest / DNS)</Link> and the{' '}
                <a href="https://github.com/eep-dev/EEP/blob/main/docs/WHITEPAPER.tex" target="_blank" rel="noopener noreferrer">Whitepaper</a>{' '}
                for publisher-oriented context. Nothing here promises traffic or citation placement.
            </p>

            <h2>Design principles</h2>
            <table>
                <thead>
                    <tr><th>Principle</th><th>What It Means</th></tr>
                </thead>
                <tbody>
                    <tr><td><strong>Open</strong></td><td>No proprietary lock-in. Apache 2.0 license. Anyone can implement it.</td></tr>
                    <tr><td><strong>Composable</strong></td><td>Use all three layers or just one. EEP layers are independent.</td></tr>
                    <tr><td><strong>Secure by default</strong></td><td>Every webhook is signed. Every SSE stream is authenticated.</td></tr>
                    <tr><td><strong>Agent-native</strong></td><td>Events are structured for machine consumption first.</td></tr>
                    <tr><td><strong>CloudEvents-compatible</strong></td><td>EEP envelopes are a superset of CloudEvents v1.0.2.</td></tr>
                    <tr><td><strong>Interoperable</strong></td><td>Bridge to A2A, MCP, and AG-UI without data transformation.</td></tr>
                </tbody>
            </table>

            <h2>Next steps</h2>
            <ul>
                <li><Link href="/docs/specification">Read the full specification →</Link></li>
                <li><Link href="/docs/guides/quick-setup">Bootstrap config and artifacts with the Setup CLI →</Link></li>
                <li><Link href="/docs/guides/subscribing">How to subscribe to entities →</Link></li>
                <li><Link href="/docs/guides/testing">Run compliance checks and generate audit reports →</Link></li>
                <li><Link href="/docs/packages">Explore the packages →</Link></li>
                <li><a href="https://github.com/eep-dev/EEP/blob/main/docs/guides/agent-onboarding.md" target="_blank" rel="noopener noreferrer">Agent onboarding (clone → bootstrap → verify) ↗</a></li>
                <li><a href="https://github.com/eep-dev/EEP/blob/main/docs/guides/enterprise-implementation-playbook.md" target="_blank" rel="noopener noreferrer">Enterprise implementation playbook ↗</a></li>
                <li><a href="https://github.com/eep-dev/EEP/blob/main/docs/guides/realworld-simulation.md" target="_blank" rel="noopener noreferrer">Realworld simulation: HTML vs EEP demo ↗</a></li>
            </ul>
        </>
    );
}
