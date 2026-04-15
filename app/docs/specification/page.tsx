export const metadata = { title: 'Specification — EEP' };

export default function SpecificationPage() {
    return (
        <>
            <h1>EEP Specification</h1>
            <p>
                <strong>Version:</strong> 0.1-draft &nbsp;|&nbsp; <strong>Status:</strong> Pre-Release &nbsp;|&nbsp;{' '}
                <strong>License:</strong> Apache 2.0
            </p>
            <p>
                Canonical normative text lives in the main EEP repository at{' '}
                <a href="https://github.com/eep-dev/EEP/blob/main/docs/current/SPECIFICATION.md" target="_blank" rel="noopener noreferrer">docs/current/SPECIFICATION.md</a>.
                This page summarizes core protocol behavior for quick navigation; if anything disagrees with that file,{' '}
                <strong>the repository wins</strong>.
            </p>

            <h2>Abstract</h2>
            <p>
                The Entity Engagement Protocol (EEP) defines how digital entities publish real-time state change events and how
                authorized subscribers receive them. It uses three transport layers: state resolution (REST), signal stream
                (SSE and Webhooks), and network pulse (WebSockets). EEP supports the agentic web, where AI agents participate
                directly in digital interactions.
            </p>

            {/* ── Terminology ──────────────────────────────── */}
            <h2>1. Terminology</h2>
            <table>
                <thead><tr><th>Term</th><th>Definition</th></tr></thead>
                <tbody>
                    <tr><td><strong>Entity</strong></td><td>Any digital subject with a stable identity and state that can change over time (a person, business, AI agent, or product)</td></tr>
                    <tr><td><strong>Source</strong></td><td>The entity or platform originating an event, identified by a DID or URI</td></tr>
                    <tr><td><strong>Publisher</strong></td><td>The platform responsible for emitting events on behalf of entities</td></tr>
                    <tr><td><strong>Subscriber</strong></td><td>An agent, service, or system that has subscribed to receive events</td></tr>
                    <tr><td><strong>Event</strong></td><td>A structured, immutable record of a state change at a specific point in time</td></tr>
                    <tr><td><strong>DID</strong></td><td>Decentralized Identifier (W3C standard) for globally identifying entities</td></tr>
                    <tr><td><strong>HMAC</strong></td><td>Hash-based Message Authentication Code, used to sign webhook payloads</td></tr>
                </tbody>
            </table>

            {/* ── Architecture ─────────────────────────────── */}
            <h2>2. Architecture Overview</h2>
            <pre><code>{`                ┌─────────────────────────────────┐
                │         EEP PUBLISHER           │
                │  (Any EEP-compliant Platform)  │
                └──────────┬──────────────────────┘
                           │  emits events
                           ▼
                ┌─────────────────────────────────┐
                │       EEP EVENT BUS             │
                │  (Redis Streams / RabbitMQ)     │
                └──────────┬──────────────────────┘
          ┌────────────────┼──────────────────┐
          ▼                ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│  SSE Stream  │  │   Webhooks   │  │   WebSockets     │
│  (Layer 2a)  │  │  (Layer 2b)  │  │    (Layer 3)     │
└──────────────┘  └──────────────┘  └──────────────────┘`}</code></pre>

            {/* ── Layer 1 ──────────────────────────────────── */}
            <h2>3. Layer 1: State Resolution</h2>
            <p>State resolution allows agents to discover and read the current state of an entity.</p>

            <h3>3.1 Entity Resolution Endpoint</h3>
            <pre><code>{`GET /:type/:username
Accept: application/json | text/markdown | text/toon`}</code></pre>
            <p>A compliant publisher MUST serve at minimum JSON (structured entity profile with capabilities, trust score, DID document) and Markdown (human-readable representation for LLM consumption).</p>

            <h3>3.2 Required Response Headers</h3>
            <pre><code>{`HTTP/1.1 200 OK
Content-Type: application/json
EEP-Version: 0.1
EEP-Entity-DID: did:web:example.com:u:acme-corp
Link: <https://api.example.com/eep/subscribe>; rel="subscribe"; type="application/json"
Link: <https://api.example.com/eep/stream?source=acme-corp>; rel="monitor"
Link: </.well-known/agent.json>; rel="agent-card"`}</code></pre>

            <h3>3.3 Capability Declaration</h3>
            <pre><code>{`{
  "eep": {
    "version": "0.1",
    "endpoint": "https://api.example.com/eep",
    "supported_delivery": ["webhook", "sse"],
    "supported_event_types": ["com.example.entity.*", "com.example.trust.*"],
    "identity": {
      "did": "did:web:example.com:u:acme-corp",
      "verification_endpoint": "https://api.example.com/did/acme-corp"
    },
    "gated": true,
    "gates_url": "https://api.example.com/eep/gates/did:web:example.com:u:acme-corp",
    "commerce": true,
    "services_url": "https://api.example.com/eep/services/did:web:example.com:u:acme-corp"
  }
}`}</code></pre>

            <h3>3.4 Gated Access</h3>
            <p>Entities MAY define <strong>gates</strong> to restrict access to resources. A gate configuration has entity-defined <strong>tiers</strong>, each with a list of <strong>requirements</strong> and a set of <strong>access patterns</strong>.</p>

            <h4>Standard Requirement Types</h4>
            <table>
                <thead><tr><th>Type</th><th>Description</th><th>Proof Needed</th></tr></thead>
                <tbody>
                    <tr><td><code>credential</code></td><td>W3C Verifiable Credential from a named issuer DID</td><td>Encoded VC signed by specified issuer</td></tr>
                    <tr><td><code>identity</code></td><td>Proof of DID ownership (know-your-peer)</td><td>Signed challenge from agent&apos;s DID key</td></tr>
                    <tr><td><code>agreement</code></td><td>Cryptographic signature over SHA-256 hash of a licence document</td><td>EdDSA signature + Verifiable Presentation</td></tr>
                    <tr><td><code>data_request</code></td><td>Quid-pro-quo: agent provides specific claims about itself/owner</td><td>Signed VP with W3C DPV purpose declaration</td></tr>
                    <tr><td><code>payment</code></td><td>On-chain micropayment to publisher address</td><td>Verified transaction hash from compatible L1/L2</td></tr>
                    <tr><td><code>combined</code></td><td>AND/OR combination of any of the above</td><td>All constituent proofs</td></tr>
                </tbody>
            </table>

            <h4>Access Restriction Response (402)</h4>
            <pre><code>{`{
  "error": "access_restricted",
  "resource": "content.papers.full_text",
  "current_tier": "public",
  "required_tier": "academic",
  "unmet_requirements": [
    {
      "type": "credential",
      "resolution_hint": "Verifiable Credential required: AcademicAffiliation"
    }
  ],
  "gates_config_url": "https://api.example.com/eep/gates/did:web:example.com:u:alice"
}`}</code></pre>

            {/* ── Layer 2: SSE ─────────────────────────────── */}
            <h2>4. Layer 2: Signal Stream (SSE)</h2>
            <h3>4.1 SSE Endpoint</h3>
            <pre><code>{`GET /eep/stream
Authorization: Bearer {API_KEY}
Accept: text/event-stream`}</code></pre>

            <table>
                <thead><tr><th>Parameter</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><code>source</code></td><td>string</td><td>No</td><td>Filter by entity username or DID</td></tr>
                    <tr><td><code>events</code></td><td>string</td><td>No</td><td>Comma-separated event type filter with wildcard support</td></tr>
                    <tr><td><code>last_event_id</code></td><td>string</td><td>No</td><td>Resume from this event ID</td></tr>
                </tbody>
            </table>

            <h3>4.2 Guaranteed Delivery via Last-Event-ID</h3>
            <p>A compliant EEP publisher MUST implement event replay. When a subscriber reconnects with the <code>Last-Event-ID</code> header, the server MUST replay all events after that ID, up to a configurable retention window (minimum: 24 hours).</p>

            <h3>4.3 Heartbeat</h3>
            <p>The publisher MUST send a comment heartbeat every 15 seconds to detect stale connections:</p>
            <pre><code>{`: heartbeat 2026-02-22T14:30:00Z`}</code></pre>

            {/* ── Layer 2: Webhooks ────────────────────────── */}
            <h2>5. Layer 2: Signal Stream (Webhooks)</h2>
            <h3>5.1 Webhook Subscription</h3>
            <pre><code>{`POST /eep/subscribe
Authorization: Bearer {API_KEY}
Content-Type: application/json

{
  "source_did": "did:web:example.com:u:acme-corp",
  "event_types": ["com.example.entity.updated", "com.example.trust.*"],
  "delivery_method": "webhook",
  "delivery_url": "https://agent.example.com/hooks/eep",
  "delivery_format": "cloudevents/v1.0"
}`}</code></pre>

            <h3>5.2 Webhook Signature Verification</h3>
            <p>The <code>webhook-signature</code> header contains an HMAC-SHA256 signature over:</p>
            <pre><code>{`{webhook-id}.{webhook-timestamp}.{raw-body}`}</code></pre>
            <p>Receiving platforms MUST use <code>crypto.timingSafeEqual()</code> for constant-time comparison and reject timestamps outside the 60-second replay window.</p>

            <h3>5.3 Retry Policy</h3>
            <table>
                <thead><tr><th>Attempt</th><th>Delay</th></tr></thead>
                <tbody>
                    <tr><td>1</td><td>Immediate</td></tr>
                    <tr><td>2</td><td>5 seconds</td></tr>
                    <tr><td>3</td><td>30 seconds</td></tr>
                    <tr><td>4</td><td>2 minutes</td></tr>
                    <tr><td>5</td><td>15 minutes</td></tr>
                    <tr><td>6</td><td>1 hour</td></tr>
                    <tr><td>7</td><td>6 hours</td></tr>
                </tbody>
            </table>

            {/* ── Layer 3: WebSocket ───────────────────────── */}
            <h2>6. Layer 3: Network Pulse (WebSockets)</h2>
            <h3>6.1 Message Format</h3>
            <pre><code>{`{
  "v": 1,
  "type": "entity | a2a | system | chat | commerce",
  "action": "specific-action",
  "seq": 12345,
  "data": {}
}`}</code></pre>

            <h3>6.2 JWT Re-authentication</h3>
            <pre><code>{`Server → Client: { "type": "system", "action": "auth_expiring", "data": { "expires_in": 300 } }
Client → Server: { "type": "system", "action": "auth_refresh", "data": { "token": "new-jwt" } }
Server → Client: { "type": "system", "action": "auth_refreshed", "data": { "expires_at": "..." } }`}</code></pre>
            <p>If the client fails to refresh within 60 seconds, the server MUST close with code <code>4001</code>.</p>

            <h3>6.3 Chat Messages</h3>
            <table>
                <thead><tr><th>Action</th><th>Direction</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><code>send</code></td><td>Client → Server</td><td>Send a message (max 4096 chars). Persisted and broadcast.</td></tr>
                    <tr><td><code>history</code></td><td>Client → Server</td><td>Request message history with cursor-based pagination.</td></tr>
                    <tr><td><code>read</code></td><td>Client → Server</td><td>Mark messages as read.</td></tr>
                </tbody>
            </table>

            {/* ── Event Envelope ───────────────────────────── */}
            <h2>7. Event Envelope Format</h2>
            <p>All EEP events MUST be valid CloudEvents v1.0.2 envelopes with EEP-specific extensions:</p>
            <pre><code>{`{
  "specversion": "1.0",
  "id": "unique-event-id",
  "source": "did:web:example.com:u:acme-corp",
  "type": "com.example.entity.updated",
  "time": "2026-02-22T14:30:00Z",
  "datacontenttype": "application/json",
  "eep_version": "0.1",
  "eep_subscription_id": "sub_01HN3QK7GX",
  "eep_trust_score": 87,
  "eep_actor_type": "human | agent | system | cron",
  "data": {}
}`}</code></pre>

            <table>
                <thead><tr><th>Attribute</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><code>eep_version</code></td><td>string</td><td>MUST</td><td>EEP spec version</td></tr>
                    <tr><td><code>eep_subscription_id</code></td><td>string</td><td>SHOULD</td><td>Subscription this was delivered to</td></tr>
                    <tr><td><code>eep_trust_score</code></td><td>integer</td><td>SHOULD</td><td>Entity&apos;s trust score at event time</td></tr>
                    <tr><td><code>eep_actor_type</code></td><td>string</td><td>SHOULD</td><td>Who triggered the event</td></tr>
                </tbody>
            </table>

            {/* ── Event Type Naming ────────────────────────── */}
            <h2>8. Event Type Naming Convention</h2>
            <p>EEP event types follow a reverse-domain dot notation pattern:</p>
            <pre><code>{`{reverse-domain}.{entity-type}.{action}
{reverse-domain}.{entity-type}.{sub-domain}.{action}

Examples:
  com.example.entity.updated
  com.example.trust.changed
  com.example.content.published
  com.example.commerce.offer`}</code></pre>
            <p>Wildcard matching: <code>com.example.entity.*</code> matches all entity events. Only prefix matching is supported.</p>

            {/* ── Standard Events ──────────────────────────── */}
            <h2>9. Standard Event Catalog</h2>

            <h3>Entity Lifecycle</h3>
            <table>
                <thead><tr><th>Event Type</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><code>com.example.entity.created</code></td><td>A new entity profile was created</td></tr>
                    <tr><td><code>com.example.entity.updated</code></td><td>One or more profile fields changed</td></tr>
                    <tr><td><code>com.example.entity.deleted</code></td><td>Permanently deleted</td></tr>
                    <tr><td><code>com.example.entity.activated</code></td><td>A deactivated entity was reactivated</td></tr>
                    <tr><td><code>com.example.entity.deactivated</code></td><td>Temporarily deactivated</td></tr>
                </tbody>
            </table>

            <h3>Trust and Identity</h3>
            <table>
                <thead><tr><th>Event Type</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><code>com.example.trust.changed</code></td><td>Trust score changed</td></tr>
                    <tr><td><code>com.example.trust.signal.added</code></td><td>A trust signal was recorded</td></tr>
                    <tr><td><code>com.example.identity.verified</code></td><td>Verification completed</td></tr>
                    <tr><td><code>com.example.identity.did_updated</code></td><td>DID document updated</td></tr>
                </tbody>
            </table>

            <h3>Commerce and Marketplace</h3>
            <table>
                <thead><tr><th>Event Type</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><code>com.example.commerce.offer</code></td><td>A new price offer was made</td></tr>
                    <tr><td><code>com.example.commerce.counter</code></td><td>A counter-offer was made</td></tr>
                    <tr><td><code>com.example.commerce.accepted</code></td><td>Negotiation accepted</td></tr>
                    <tr><td><code>com.example.commerce.invoiced</code></td><td>Invoice generated</td></tr>
                    <tr><td><code>com.example.commerce.paid</code></td><td>Payment confirmed</td></tr>
                    <tr><td><code>com.example.commerce.completed</code></td><td>Transaction completed</td></tr>
                    <tr><td><code>com.example.service.listed</code></td><td>New service published</td></tr>
                    <tr><td><code>com.example.gate.config_changed</code></td><td>Gate configuration updated</td></tr>
                </tbody>
            </table>

            {/* ── Subscription Lifecycle ───────────────────── */}
            <h2>10. Subscription Lifecycle</h2>
            <pre><code>{`POST /subscribe → [pending_verification]
                        │
        Publisher sends GET challenge to delivery_url
                        │
                  Success → [active]
                  Failure → [rejected]

               [active] → event delivery
                        → 5 consecutive failures → [paused]
                        → POST /subscriptions/:id/resume → [active]`}</code></pre>

            {/* ── Auth ─────────────────────────────────────── */}
            <h2>11. Authentication and Authorization</h2>
            <p>EEP uses two complementary authentication mechanisms:</p>
            <ul>
                <li><strong>DID-based cryptographic identity</strong> (primary) — agents present a W3C DID and sign gate requirement proofs (Verifiable Credentials, challenge responses, payment hashes). This is the canonical zero-trust auth model.</li>
                <li><strong>API key</strong> (convenience) — for simple subscriptions without gate requirements, Bearer token auth is accepted.</li>
            </ul>
            <pre><code>{`// Simple subscription — API key
Authorization: Bearer {API_KEY}

// Gated resource — DID proof in request body
POST /eep/gate/proof
{ "type": "identity", "did": "did:web:agent.example.com", "signature": "..." }`}</code></pre>

            <h4>Scopes</h4>
            <table>
                <thead><tr><th>Scope</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><code>read:subscriptions</code></td><td>List own subscriptions</td></tr>
                    <tr><td><code>write:subscriptions</code></td><td>Create and manage subscriptions</td></tr>
                    <tr><td><code>read:events</code></td><td>Access the SSE stream</td></tr>
                    <tr><td><code>read:gates</code></td><td>Read gate configurations</td></tr>
                    <tr><td><code>write:gates</code></td><td>Modify gate configurations</td></tr>
                    <tr><td><code>commerce:negotiate</code></td><td>Participate in commerce negotiations</td></tr>
                    <tr><td><code>read:services</code></td><td>Browse service listings</td></tr>
                    <tr><td><code>write:services</code></td><td>Publish and manage service listings</td></tr>
                </tbody>
            </table>

            {/* ── Discovery ────────────────────────────────── */}
            <h2>12. Discovery</h2>
            <p>Subscribers discover EEP endpoints through three mechanisms:</p>
            <ol>
                <li><strong>HTTP Link header</strong> — every entity resolution response includes <code>Link: &lt;...&gt;; rel=&quot;subscribe&quot;</code></li>
                <li><strong>Agent card extension</strong> — A2A agent card includes <code>x-eep</code> extension</li>
                <li><strong>Well-known document</strong> — <code>GET /.well-known/eep.json</code> returns platform capabilities</li>
            </ol>

            {/* ── Rate Limiting ────────────────────────────── */}
            <h2>13. Rate Limiting</h2>
            <p>Publishers MUST enforce rate limits and return standard headers:</p>
            <pre><code>{`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1708168200
Retry-After: 120`}</code></pre>

            <table>
                <thead><tr><th>Action</th><th>Limit</th></tr></thead>
                <tbody>
                    <tr><td>Subscription creation</td><td>100/day</td></tr>
                    <tr><td>SSE connections</td><td>5 concurrent</td></tr>
                    <tr><td>Webhook deliveries received</td><td>10,000/day</td></tr>
                    <tr><td>Event stream history queries</td><td>60/hour</td></tr>
                </tbody>
            </table>

            {/* ── Conformance ──────────────────────────────── */}
            <h2>14. Conformance Levels</h2>
            <table>
                <thead><tr><th>Level</th><th>Requirements</th></tr></thead>
                <tbody>
                    <tr><td><strong>Core</strong></td><td>Layer 1 (REST state) + Layer 2 SSE. Suitable for read-only publishers, IoT sensors, knowledge bases.</td></tr>
                    <tr><td><strong>Standard</strong></td><td>Core + Webhooks + HMAC-SHA256 signing + <code>credential</code> and <code>payment</code> gates + version negotiation. Suitable for B2B data APIs, financial feeds.</td></tr>
                    <tr><td><strong>Full</strong></td><td>Standard + Layer 3 WebSockets + commerce state machine + <code>agreement</code> + <code>data_request</code> gates + session persistence + W3C DPV privacy declarations. Suitable for agent commerce, regulated industries.</td></tr>
                </tbody>
            </table>

            {/* ── Service Discovery ────────────────────────── */}
            <h2>15. Service Discovery and Marketplace</h2>
            <p>Entities MAY publish a <strong>service catalog</strong> of their offerings.</p>

            <h3>Service Listing Billing Models</h3>
            <p>The <code>pricing.model</code> field on a service listing declares how recurring or metered charges work:</p>
            <table>
                <thead><tr><th>Model</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><code>fixed</code></td><td>One-time flat price</td></tr>
                    <tr><td><code>per_request</code></td><td>Charge per API request</td></tr>
                    <tr><td><code>subscription</code></td><td>Recurring charge with a billing period</td></tr>
                    <tr><td><code>metered</code></td><td>Usage-based billing</td></tr>
                    <tr><td><code>tiered_volume</code></td><td>Volume discounts with tier brackets</td></tr>
                    <tr><td><code>x-*</code></td><td>Custom billing models</td></tr>
                </tbody>
            </table>

            <h3>Commerce Price Discovery Modes (Whitepaper §8.4)</h3>
            <p>Separate from billing models, the <strong>commerce state machine</strong> supports three <em>price discovery modes</em> that govern how agent and entity reach agreement on price during a WebSocket negotiation:</p>
            <table>
                <thead><tr><th>Mode</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><code>fixed</code></td><td>Publisher sets a non-negotiable price. Agent accepts or walks away.</td></tr>
                    <tr><td><code>negotiated</code></td><td>Bilateral offer/counter over WebSocket until both sides accept.</td></tr>
                    <tr><td><code>auction</code></td><td>Publisher broadcasts an RFP; agents submit bids; publisher selects winner.</td></tr>
                </tbody>
            </table>

            <h3>Commerce Negotiation State Machine</h3>
            <pre><code>{`offer → [open] → counter → [countered] → accept → [accepted]
                                        → reject → [rejected]
                         → expire  → [expired]

[accepted] → invoice → [invoiced] → receipt → [paid] → complete → [completed]

Any active state → dispute → [disputed]`}</code></pre>
            <p>Terminal states: <code>rejected</code>, <code>expired</code>, <code>completed</code>.</p>
        </>
    );
}
