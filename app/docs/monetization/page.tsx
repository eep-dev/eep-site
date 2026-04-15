import CodeTabs from '../../../components/CodeTabs';

export default function MonetizationPage() {
  return (
    <>
      <h1>EEP Monetization Guide</h1>
      <p>Gates (access control), commerce (price negotiation), and service listings (marketplace).</p>

      <h2>1. Gated Access</h2>
      <p>Gates let entities decide who gets access to what. You pick your own tier names and requirements.</p>

      <h3>Define Your Gate Config</h3>
      <pre><code>{`{
  "default_tier": "public",
  "tiers": {
    "public": {
      "requirements": [],
      "access": ["profile.summary", "profile.capabilities"]
    },
    "verified_agents": {
      "label": "Verified Agents",
      "requirements": [
        { "type": "trust", "min_score": 50 }
      ],
      "access": ["profile.*", "events.public"]
    },
    "premium": {
      "label": "Premium",
      "requirements": [
        { "type": "payment", "amount": 5, "currency": "usd", "per": "month" }
      ],
      "access": ["*"]
    }
  }
}`}</code></pre>

      <h3>Handle 402 Responses</h3>
      <p>When an agent asks for a gated resource without proof, your platform returns HTTP 402 with a machine-readable body telling the agent exactly what it needs.</p>

      <h3>Write a ProofVerifier</h3>
      <CodeTabs label="ProofVerifier"
        ts={`import { ProofVerifierRegistry, resolveAccess, build402Response } from '@eep-dev/gates';

const registry = new ProofVerifierRegistry();

registry.register({
  supportedTypes: ['payment'],
  verify: async (proof, requirement) => {
    // Ask Stripe if the token is good
    return await stripe.paymentIntents.retrieve(proof.token)
      .then(pi => pi.status === 'succeeded');
  },
});

// In your route handler
const result = await resolveAccess(proofs, gateConfig, resourcePath, registry);
if (!result.granted) {
  return c.json(await build402Response(gateConfig, resourcePath, proofs), 402);
}`}
        py={`from eep_gates import ProofVerifierRegistry, ProofVerifier, resolve_access, build_402_response

class PaymentVerifier(ProofVerifier):
    @property
    def supported_types(self):
        return ["payment"]

    async def verify(self, proof, requirement):
        intent = stripe.PaymentIntent.retrieve(proof["token"])
        return intent.status == "succeeded"

registry = ProofVerifierRegistry()
registry.register(PaymentVerifier())

# In your route handler
result = await resolve_access(proofs, gate_config, resource_path, registry)
if not result.granted:
    body = await build_402_response(gate_config, resource_path, proofs)
    return JSONResponse(body, status_code=402)`}
      />

      <h2>2. Requirement Types</h2>
      <p>Combine any of these using AND/OR logic. The <code>combined</code> type lets you express complex requirement sets.</p>
      <table>
        <thead><tr><th>Type</th><th>What the Agent Provides</th><th>Typical Use Case</th></tr></thead>
        <tbody>
          <tr><td><code>credential</code></td><td>W3C Verifiable Credential from a named issuer DID</td><td>Role/affiliation gating (research, licensed entities)</td></tr>
          <tr><td><code>identity</code></td><td>Proof of DID ownership (signed challenge)</td><td>Know-your-peer; allowlists by DID</td></tr>
          <tr><td><code>agreement</code></td><td>EdDSA signature over SHA-256 hash of a licence doc</td><td>Non-commercial or research usage terms</td></tr>
          <tr><td><code>data_request</code></td><td>Signed VP + W3C DPV purpose declaration</td><td>Quid-pro-quo data exchange</td></tr>
          <tr><td><code>payment</code></td><td>On-chain transaction hash verified at publisher address</td><td>Micropayment for premium data / compute</td></tr>
          <tr><td><code>combined</code></td><td>AND/OR combination of any of the above</td><td>Regulated or high-value resources</td></tr>
        </tbody>
      </table>

      <h2>3. Commerce Negotiation</h2>
      <p>If a service is negotiable, agents and entities trade offers over WebSocket:</p>
      <CodeTabs label="Negotiation Flow"
        ts={`// Agent sends offer
ws.send(JSON.stringify({
  type: 'commerce', action: 'offer',
  data: { pricing: { model: 'fixed', amount: 50, currency: 'usd' } }
}));

// Entity counters
ws.send(JSON.stringify({
  type: 'commerce', action: 'counter',
  data: { pricing: { model: 'fixed', amount: 75, currency: 'usd' } }
}));

// Agent accepts
ws.send(JSON.stringify({
  type: 'commerce', action: 'accept',
  data: { negotiation_id: 'neg_abc' }
}));`}
        py={`# Agent sends offer
await ws.send(json.dumps({
    "type": "commerce", "action": "offer",
    "data": {"pricing": {"model": "fixed", "amount": 50, "currency": "usd"}}
}))

# Entity counters
await ws.send(json.dumps({
    "type": "commerce", "action": "counter",
    "data": {"pricing": {"model": "fixed", "amount": 75, "currency": "usd"}}
}))

# Agent accepts
await ws.send(json.dumps({
    "type": "commerce", "action": "accept",
    "data": {"negotiation_id": "neg_abc"}
}))`}
      />

      <h2>4. Service Listings</h2>
      <p>Entities publish a machine-readable catalog of what they offer:</p>
      <pre><code>{`{
  "entity_did": "did:web:example.com:u:alice",
  "services": [
    {
      "id": "svc_consultation_30",
      "name": "30-Minute Strategy Consultation",
      "category": "consulting",
      "pricing": { "model": "fixed", "amount": 75, "currency": "usd" },
      "delivery": "realtime",
      "negotiable": true,
      "status": "active"
    }
  ]
}`}</code></pre>

      <h2>5. Access Patterns</h2>
      <p>Wildcard syntax for matching resources to tiers:</p>
      <table>
        <thead><tr><th>Pattern</th><th>Matches</th></tr></thead>
        <tbody>
          <tr><td><code>*</code></td><td>Everything</td></tr>
          <tr><td><code>profile.*</code></td><td><code>profile.bio</code>, <code>profile.skills</code>, <code>profile.contact.email</code></td></tr>
          <tr><td><code>content.papers.*</code></td><td><code>content.papers.abstract</code>, <code>content.papers.full_text</code></td></tr>
          <tr><td><code>events.public</code></td><td>Only <code>events.public</code>, nothing else</td></tr>
        </tbody>
      </table>
    </>
  );
}
