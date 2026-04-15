import CodeTabs from '../../../components/CodeTabs';

export default function SecurityPage() {
    return (
        <>
            <h1>EEP Security Model</h1>
            <p>This document explains the &quot;why&quot; and &quot;how&quot; behind every security decision in EEP.</p>

            <h2>1. Threat Model</h2>
            <table>
                <thead><tr><th>Threat</th><th>Classification</th><th>Mitigation</th></tr></thead>
                <tbody>
                    <tr><td>Spoofed events</td><td>Integrity</td><td>DID-based source verification + payload HMAC</td></tr>
                    <tr><td>Replay attacks</td><td>Freshness</td><td>Single-use nonce + 60-second timestamp validation window</td></tr>
                    <tr><td>SSRF via webhooks</td><td>Network</td><td>Strict IP allowlist validation before dispatch</td></tr>
                    <tr><td>DDoS amplification</td><td>Availability</td><td>WebSub intent verification before any delivery</td></tr>
                    <tr><td>Subscription harvesting</td><td>Privacy</td><td>Subscriptions are private; never exposed in public APIs</td></tr>
                    <tr><td>Timing attacks on HMAC</td><td>Cryptography</td><td><code>timingSafeEqual</code> mandatory</td></tr>
                    <tr><td>Stale SSE data</td><td>Freshness</td><td>Mandatory Last-Event-ID replay mechanism</td></tr>
                    <tr><td>Double-spend / payment replay</td><td>Integrity</td><td>Payment hash consumed-ledger; each tx hash accepted once only</td></tr>
                    <tr><td>Key compromise / session hijack</td><td>Integrity</td><td><code>session.revoked</code> event triggers immediate termination of all matching WebSocket sessions</td></tr>
                    <tr><td>Harvest-now decrypt-later (quantum)</td><td>Cryptography</td><td>PQC-ready: hybrid EdDSA + ML-DSA signatures; ML-KEM transport declared via <code>pqc_ready</code> manifest flag</td></tr>
                </tbody>
            </table>

            <h2>2. Webhook Security: HMAC-SHA256</h2>
            <p>EEP adopts the <a href="https://www.standardwebhooks.com/">Standard Webhooks</a> specification for payload signing.</p>
            <h3>Why HMAC-SHA256?</h3>
            <ul>
                <li><strong>Symmetric</strong> — Same secret to sign and verify. No PKI needed.</li>
                <li><strong>Fast</strong> — Milliseconds overhead per dispatch.</li>
                <li><strong>Universal</strong> — Every major language has built-in HMAC support.</li>
            </ul>
            <h3>Signing Algorithm</h3>
            <CodeTabs label="HMAC Signing"
                ts={`import { createHmac } from 'crypto';

const content = \`\${webhookId}.\${timestamp}.\${rawBody}\`;
const signature = createHmac('sha256', secret)
  .update(content)
  .digest('base64');

// Header: webhook-signature: v1,<signature>`}
                py={`import hmac, hashlib, base64

content = f"{webhook_id}.{timestamp}.{raw_body}".encode()
signature = base64.b64encode(
    hmac.new(secret.encode(), content, hashlib.sha256).digest()
).decode()

# Header: webhook-signature: v1,<signature>`}
            />

            <h3>Timing-Safe Comparison (Mandatory)</h3>
            <CodeTabs label="Verification"
                ts={`// ✅ CORRECT — timing-safe
import { timingSafeEqual } from 'crypto';
const valid = timingSafeEqual(
  Buffer.from(expected, 'base64'),
  Buffer.from(received, 'base64')
);

// ❌ WRONG — timing leak
const valid = expected === received;`}
                py={`# ✅ CORRECT — timing-safe
import hmac
valid = hmac.compare_digest(
    base64.b64decode(expected),
    base64.b64decode(received)
)

# ❌ WRONG — timing leak
valid = expected == received`}
            />

            <h2>3. SSRF Prevention</h2>
            <p>If a subscriber registers an internal URL, the publisher could be tricked into making requests to private services.</p>
            <h3>Required Protections</h3>
            <ol>
                <li><strong>DNS resolution before connection</strong> — Resolve hostname to IP before connecting</li>
                <li><strong>IP blocklist validation</strong> — Reject loopback, private networks, link-local, and invalid ranges</li>
                <li><strong>HTTPS only</strong> — Only <code>https://</code> URLs in production</li>
                <li><strong>No redirect following</strong> — Could bypass IP blocklist</li>
            </ol>

            <h3>SSRF Validation</h3>
            <CodeTabs label="SSRF Check"
                ts={`import { validateSSRF } from '@eep-dev/validator';

try {
  await validateSSRF(subscriberUrl);
  // Safe to connect
} catch (err) {
  // SSRFError: blocked IP, private network, etc.
  console.error('SSRF blocked:', err.message);
}`}
                py={`from eep_validator import validate_ssrf, SSRFError

try:
    await validate_ssrf(subscriber_url)
    # Safe to connect
except SSRFError as err:
    # Blocked IP, private network, etc.
    print(f"SSRF blocked: {err}")`}
            />

            <h3>Blocked IP Ranges</h3>
            <table>
                <thead><tr><th>Range</th><th>Reason</th></tr></thead>
                <tbody>
                    <tr><td><code>127.0.0.0/8</code></td><td>Loopback (localhost)</td></tr>
                    <tr><td><code>::1/128</code></td><td>IPv6 loopback</td></tr>
                    <tr><td><code>10.0.0.0/8</code></td><td>Private network (RFC 1918)</td></tr>
                    <tr><td><code>172.16.0.0/12</code></td><td>Private network (RFC 1918)</td></tr>
                    <tr><td><code>192.168.0.0/16</code></td><td>Private network (RFC 1918)</td></tr>
                    <tr><td><code>169.254.0.0/16</code></td><td>Link-local (AWS metadata)</td></tr>
                    <tr><td><code>fc00::/7</code> and <code>fd00::/8</code></td><td>IPv6 Unique Local Address (private)</td></tr>
                    <tr><td><code>fe80::/10</code></td><td>IPv6 link-local</td></tr>
                </tbody>
            </table>

            <h2>4. WebSub Intent Verification</h2>
            <p>Prevents DDoS amplification by verifying the subscriber controls the delivery URL.</p>
            <CodeTabs label="Intent Verification"
                ts={`// Publisher sends challenge
const challenge = crypto.randomBytes(16).toString('hex');
const verifyUrl = new URL(deliveryUrl);
verifyUrl.searchParams.set('hub.mode', 'subscribe');
verifyUrl.searchParams.set('hub.topic', sourceDid);
verifyUrl.searchParams.set('hub.challenge', challenge);

const res = await fetch(verifyUrl.toString());
const body = await res.text();

if (res.status === 200 && body === challenge) {
  // Subscription activated
}`}
                py={`# Publisher sends challenge
import secrets, httpx

challenge = secrets.token_hex(16)
params = {
    "hub.mode": "subscribe",
    "hub.topic": source_did,
    "hub.challenge": challenge,
}

res = httpx.get(delivery_url, params=params)

if res.status_code == 200 and res.text == challenge:
    # Subscription activated
    pass`}
            />

            <h2>5. SSE Stream Security</h2>
            <ul>
                <li>SSE streams MUST require authentication (<code>Authorization: Bearer</code> or query parameter)</li>
                <li>Events flagged as <code>private</code> are only accessible to the entity owner</li>
                <li>Server-side filtering mandatory — never rely on client-side filtering</li>
                <li>Maximum concurrent SSE connections per API key (recommended: 5 free, 20 paid)</li>
            </ul>

            <h2>6. WebSocket Security</h2>
            <ul>
                <li>Authentication MUST be verified at the HTTP Upgrade request, before handshake</li>
                <li>JWT re-authentication for long-lived connections (see Specification §6.4)</li>
                <li>All received messages MUST be validated against JSON schema before processing</li>
            </ul>

            <h2>7. Gate and Commerce Security</h2>
            <table>
                <thead><tr><th>Threat</th><th>Mitigation</th></tr></thead>
                <tbody>
                    <tr><td>Tier escalation</td><td><code>@eep-dev/gates</code> matches proofs to tiers and returns only the highest qualifying tier</td></tr>
                    <tr><td>Proof replay</td><td>Structural validation checks <code>expires_at</code> and rejects future-dated <code>issued_at</code></td></tr>
                    <tr><td>Config manipulation</td><td><code>parseGateConfig()</code> validates all constraints before use</td></tr>
                    <tr><td>Commerce state skipping</td><td>Negotiation state machine rejects invalid transitions</td></tr>
                    <tr><td>Double receipt</td><td>Use atomic payment-hash consumption (<code>consumeIfFresh</code>) for distributed safety</td></tr>
                    <tr><td>Missing semantic verifier</td><td><code>resolveAccess</code> is strict fail-closed by default; unmet verifier blocks grant</td></tr>
                    <tr><td>Fake reviews</td><td>Verify reviewer completed a transaction for the service</td></tr>
                </tbody>
            </table>

            <h3>Two-Phase Validation</h3>
            <CodeTabs label="Gate Validation"
                ts={`import { resolveAccess, build402Response, ProofVerifierRegistry } from '@eep-dev/gates';

const registry = new ProofVerifierRegistry();
registry.register({
  supportedTypes: ['payment'],
  verify: async (proof) => {
    return await stripe.paymentIntents.retrieve(proof.token)
      .then(pi => pi.status === 'succeeded');
  },
});

const result = await resolveAccess(proofs, config, resource, registry);
if (!result.granted) {
  return res.json(await build402Response(config, resource, proofs), 402);
}`}
                py={`from eep_gates import resolve_access, build_402_response, ProofVerifierRegistry

registry = ProofVerifierRegistry()

@registry.register(supported_types=["payment"])
async def verify_payment(proof, requirement):
    intent = stripe.PaymentIntent.retrieve(proof["token"])
    return intent.status == "succeeded"

result = await resolve_access(proofs, config, resource, registry)
if not result.granted:
    body = await build_402_response(config, resource, proofs)
    return JSONResponse(body, status_code=402)`}
            />

            <h2>8. Delegation Proof Chains</h2>
            <p>
                When a <strong>delegated agent</strong> (sub-agent acting on behalf of an owner) presents a gate proof,
                it must attach a <strong>Delegation Proof</strong> alongside its own DID signature.
                A Delegation Proof is a W3C Verifiable Credential issued by the owner&apos;s DID to the agent&apos;s DID,
                specifying permitted actions, permitted endpoints, and an expiry time.
            </p>
            <p>The publisher must verify:</p>
            <ol>
                <li>The Delegation Proof is signed by the owner DID (not the agent DID)</li>
                <li>The requested action falls within the explicitly declared delegation scope</li>
                <li>The credential has not expired (<code>expirationDate</code> is in the future)</li>
                <li>The chain terminates at a DID that directly owns the resource</li>
            </ol>
            <pre><code>{`// Delegation Proof — Verifiable Credential structure
{
  "@context": ["https://www.w3.org/ns/credentials/v2"],
  "type": ["VerifiableCredential", "EEPDelegationCredential"],
  "issuer": "did:web:owner.example.com",          // owner DID
  "credentialSubject": {
    "id": "did:web:agent.example.com",             // agent DID
    "permittedActions": ["subscribe", "read:events"],
    "permittedEndpoints": ["https://api.example.com/eep/*"],
    "expirationDate": "2026-03-07T00:00:00Z"
  }
}`}</code></pre>
            <blockquote>
                <strong>Security rule:</strong> Delegation credentials without explicit <code>permittedActions</code>
                scope restrictions MUST be rejected. Agents without explicit scope cannot claim unlimited authority.
            </blockquote>

            <h2>9. Side-Channel and Constant-Time Security</h2>
            <p>
                All gate requirement verifications — credential checks, signature verifications, nonce consumptions
                — MUST be performed in <strong>constant time</strong>.
                Variable-time comparisons leak information about partial matches via timing side-channels.
            </p>
            <ul>
                <li>Use <code>timingSafeEqual</code> (Node.js) / <code>hmac.compare_digest</code> (Python) for all cryptographic equality checks</li>
                <li>Error responses for failed verification MUST NOT vary in detail or timing based on <em>why</em> verification failed — a failed signature and a failed nonce check must return the same HTTP status, same response latency, and generic error body</li>
                <li>Specific failure reasons are logged internally but <strong>never</strong> surfaced to the requesting agent</li>
            </ul>
            <pre><code>{`// ✅ Correct — constant-time
import { timingSafeEqual } from 'crypto';
const expected = Buffer.from(computeExpectedSig(secret, content), 'base64');
const actual   = Buffer.from(receivedSig, 'base64');
const valid = expected.length === actual.length && timingSafeEqual(expected, actual);

// ❌ Wrong — variable-time (leaks timing info)
const valid = computeExpectedSig(secret, content) === receivedSig;`}</code></pre>
        </>
    );
}
