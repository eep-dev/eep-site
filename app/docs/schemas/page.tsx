import CodeTabs from '../../../components/CodeTabs';

export const metadata = { title: 'JSON Schemas — EEP Docs' };

export default function SchemasPage() {
    return (
        <>
            <h1>JSON Schemas</h1>
            <p>
                EEP defines <strong>24 JSON Schemas</strong> under <code>schemas/v0.1/</code> (JSON Schema Draft-07). The canonical
                tree is in the{' '}
                <a href="https://github.com/eep-dev/EEP/tree/main/schemas/v0.1" target="_blank" rel="noopener noreferrer">
                    eep-dev/EEP repository
                </a>
                ; filenames below match it exactly.
            </p>

            <h2>Events, subscriptions &amp; transport</h2>
            <table>
                <thead><tr><th>Schema file</th><th>Role</th></tr></thead>
                <tbody>
                    <tr><td><code>event.envelope.json</code></td><td>CloudEvents v1.0.2 envelope with EEP extension attributes (primary event schema)</td></tr>
                    <tr><td><code>subscription.request.json</code></td><td>Subscription creation request body</td></tr>
                    <tr><td><code>delivery.payload.json</code></td><td>Webhook / delivery payload wrapper</td></tr>
                    <tr><td><code>ws-message.json</code></td><td>WebSocket frame format (Layer 3)</td></tr>
                    <tr><td><code>eep-pulse-message-schema.json</code></td><td>Network pulse message envelope</td></tr>
                </tbody>
            </table>

            <h2>Discovery &amp; registry</h2>
            <table>
                <thead><tr><th>Schema file</th><th>Role</th></tr></thead>
                <tbody>
                    <tr><td><code>eep-manifest.json</code></td><td><code>/.well-known/eep.json</code> manifest</td></tr>
                    <tr><td><code>eep-registry.json</code></td><td>Registry document</td></tr>
                    <tr><td><code>registry.search-result.json</code></td><td>Registry search hit shape</td></tr>
                </tbody>
            </table>

            <h2>Gates, sessions &amp; HTTP error bodies</h2>
            <table>
                <thead><tr><th>Schema file</th><th>Role</th></tr></thead>
                <tbody>
                    <tr><td><code>gate.config.json</code></td><td>Gate configuration (tiers, requirements)</td></tr>
                    <tr><td><code>gate.proof.json</code></td><td>Proof payloads submitted to gates</td></tr>
                    <tr><td><code>session.token.json</code></td><td>Gate session token</td></tr>
                    <tr><td><code>delegation.proof.json</code></td><td>Delegation / VC-style proofs</td></tr>
                    <tr><td><code>gate.402-response.json</code></td><td>HTTP 402 access restriction body</td></tr>
                    <tr><td><code>gate.403-response.json</code></td><td>HTTP 403 body</td></tr>
                    <tr><td><code>gate.429-response.json</code></td><td>HTTP 429 body</td></tr>
                    <tr><td><code>gate.451-response.json</code></td><td>HTTP 451 body</td></tr>
                </tbody>
            </table>

            <h2>Commerce, operator &amp; compliance</h2>
            <table>
                <thead><tr><th>Schema file</th><th>Role</th></tr></thead>
                <tbody>
                    <tr><td><code>commerce.negotiation.json</code></td><td>Commerce negotiation envelope</td></tr>
                    <tr><td><code>service.listing.json</code></td><td>Marketplace / service listing</td></tr>
                    <tr><td><code>agent.wallet.json</code></td><td>Agent wallet structure</td></tr>
                    <tr><td><code>operator.privacy-policy.json</code></td><td>Operator privacy policy profile</td></tr>
                    <tr><td><code>operator.spending-policy.json</code></td><td>Spending limits / policy</td></tr>
                    <tr><td><code>data.withdrawal.json</code></td><td>Data withdrawal / erasure flows</td></tr>
                    <tr><td><code>conformance.credential.json</code></td><td>Conformance credential (tier claims)</td></tr>
                    <tr><td><code>audit-log.json</code></td><td>Audit log entry</td></tr>
                </tbody>
            </table>

            <h2>Validate an event envelope</h2>
            <CodeTabs label="Schema Validation"
                ts={`import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from './schemas/v0.1/event.envelope.json';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(schema);

const event = {
  specversion: '1.0',
  id: '01HN3QK7GX-1708123456000',
  source: 'did:web:example.com:u:acme-corp',
  type: 'com.example.entity.updated',
  time: '2026-02-22T14:30:00Z',
  datacontenttype: 'application/json',
  eep_version: '0.1',
  data: { field: 'bio', current: 'New bio' },
};

if (!validate(event)) {
  console.error(validate.errors);
}`}
                py={`import json
import jsonschema
from jsonschema import validate, ValidationError

with open("schemas/v0.1/event.envelope.json") as f:
    schema = json.load(f)

event = {
    "specversion": "1.0",
    "id": "01HN3QK7GX-1708123456000",
    "source": "did:web:example.com:u:acme-corp",
    "type": "com.example.entity.updated",
    "time": "2026-02-22T14:30:00Z",
    "datacontenttype": "application/json",
    "eep_version": "0.1",
    "data": {"field": "bio", "current": "New bio"},
}

try:
    validate(instance=event, schema=schema)
    print("Valid!")
except ValidationError as e:
    print(f"Error: {e.message}")`}
            />

            <h2>Validate a Manifest</h2>
            <CodeTabs label="Manifest Validation"
                ts={`import { validateManifest } from '@eep-dev/discovery';

const result = validateManifest({
  did: 'did:web:api.example.com',
  eep_version: '0.1',
  layers: { layer1: 'https://api.example.com/eep' },
  supported_content_types: ['application/json'],
  pqc_ready: false,
  x402_enabled: true,
});

console.log(result.valid); // true`}
                py={`from eep_discovery import validate_manifest

result = validate_manifest({
    "did": "did:web:api.example.com",
    "eep_version": "0.1",
    "layers": {"layer1": "https://api.example.com/eep"},
    "supported_content_types": ["application/json"],
    "pqc_ready": False,
    "x402_enabled": True,
})

print(result.valid)  # True`}
            />

            <h2>Validate Gate Config</h2>
            <CodeTabs label="Gate Config Validation"
                ts={`import { parseGateConfig } from '@eep-dev/gates';

const config = parseGateConfig({
  default_tier: 'public',
  tiers: {
    public: {
      requirements: [],
      access: ['profile.summary'],
    },
    premium: {
      label: 'Premium Access',
      requirements: [
        { type: 'payment', amount: 10, currency: 'usd', per: 'month' },
      ],
      access: ['*'],
      rate_limit: { requests_per_minute: 100 },
    },
  },
  fallback_behavior: 'default',
});
// Throws if invalid`}
                py={`from eep_gates import parse_gate_config

config = parse_gate_config({
    "default_tier": "public",
    "tiers": {
        "public": {
            "requirements": [],
            "access": ["profile.summary"],
        },
        "premium": {
            "label": "Premium Access",
            "requirements": [
                {"type": "payment", "amount": 10, "currency": "usd", "per": "month"},
            ],
            "access": ["*"],
            "rate_limit": {"requests_per_minute": 100},
        },
    },
    "fallback_behavior": "default",
})
# Raises GateConfigError if invalid`}
            />
        </>
    );
}
