import CodeTabs from '../../../../components/CodeTabs';

export default function TestingGuide() {
  return (
    <>
      <h1>Testing &amp; Validation</h1>
      <p>How to test your EEP implementation for conformance.</p>

      <h2>Compliance CLI</h2>
      <p>
        The fastest way to check a <strong>running deployment&apos;s</strong> end-to-end EEP conformance (live HTTP surface):
      </p>
      <CodeTabs label="Run Compliance"
        ts={`npx @eep-dev/compliance-cli \\
  --target https://api.yourplatform.com \\
  --api-key sk_test_... \\
  --entity u/test-entity \\
  --report-json ./eep-audit.json \\
  --report-md ./eep-audit.md`}
        py={`pip install eep-compliance-cli

eep-compliance \\
  --target https://api.yourplatform.com \\
  --api-key sk_test_... \\
  --entity u/test-entity \\
  --report-json ./eep-audit.json \\
  --report-md ./eep-audit.md`}
      />
      <p>
        The CLI reports pass/fail checks, a <code>score_100</code> summary, and concrete recommendations for failed checks.
        Use JSON output in CI and Markdown output for human review during release gates.
      </p>

      <h2>Setup CLI artifact checks</h2>
      <p>
        <code>eep-setup verify</code> (from <a href="/docs/guides/quick-setup">@eep-dev/setup-cli</a>) validates a{' '}
        <strong>generated artifact tree</strong> (manifests, OpenAPI fragments, etc.) — complementary to the compliance CLI,
        which exercises a live API. For CI patterns, see{' '}
        <a
          href="https://github.com/eep-dev/EEP/blob/main/docs/guides/eep-ready-verification.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          EEP-ready verification ↗
        </a>
        .
      </p>

      <h2>Schema Validation</h2>
      <CodeTabs label="Validate CloudEvent"
        ts={`import Ajv from 'ajv';
import schema from './schemas/v0.1/event.envelope.json';

const ajv = new Ajv();
const validate = ajv.compile(schema);
const valid = validate(yourEvent);
if (!valid) console.error(validate.errors);`}
        py={`import jsonschema, json

with open("schemas/v0.1/event.envelope.json") as f:
    schema = json.load(f)

try:
    jsonschema.validate(your_event, schema)
except jsonschema.ValidationError as e:
    print(f"Validation error: {e.message}")`}
      />

      <h2>Unit Testing: Signer</h2>
      <CodeTabs label="Signer Tests"
        ts={`import { EEPSigner, verifyEEPWebhook } from '@eep-dev/signer';

test('sign and verify', () => {
  const signer = new EEPSigner('test-secret');
  const sig = signer.sign('msg_1', '1708123456', '{"data":"test"}');
  expect(sig).toBeTruthy();

  const valid = verifyEEPWebhook('{"data":"test"}', {
    'webhook-id': 'msg_1',
    'webhook-timestamp': '1708123456',
    'webhook-signature': \`v1,\${sig}\`,
  }, 'test-secret');
  expect(valid).toBe(true);
});`}
        py={`from eep_signer import EEPSigner, verify_eep_webhook

def test_sign_and_verify():
    signer = EEPSigner("test-secret")
    sig = signer.sign("msg_1", "1708123456", '{"data":"test"}')
    assert sig

    valid = verify_eep_webhook(
        b'{"data":"test"}',
        {
            "webhook-id": "msg_1",
            "webhook-timestamp": "1708123456",
            "webhook-signature": f"v1,{sig}",
        },
        "test-secret",
    )
    assert valid is True`}
      />

      <h2>Unit Testing: Gates</h2>
      <CodeTabs label="Gate Tests"
        ts={`import { parseGateConfig, resolveAccess, ProofVerifierRegistry } from '@eep-dev/gates';

test('resolves access correctly', async () => {
  const config = parseGateConfig({
    default_tier: 'public',
    tiers: {
      public: { requirements: [], access: ['profile.summary'] },
      premium: {
        requirements: [{ type: 'payment', amount: 5, currency: 'usd', per: 'month' }],
        access: ['*'],
      },
    },
  });

  const registry = new ProofVerifierRegistry();
  const result = await resolveAccess([], config, 'profile.summary', registry);
  expect(result.granted).toBe(true);
  expect(result.tier).toBe('public');
});`}
        py={`from eep_gates import parse_gate_config, resolve_access
import pytest

@pytest.mark.asyncio
async def test_resolves_access_correctly():
    config = parse_gate_config({
        "default_tier": "public",
        "tiers": {
            "public": {"requirements": [], "access": ["profile.summary"]},
            "premium": {
                "requirements": [{"type": "payment", "amount": 5, "currency": "usd", "per": "month"}],
                "access": ["*"],
            },
        },
    })

    result = await resolve_access([], config, "profile.summary")
    assert result.granted is True
    assert result.tier == "public"`}
      />

      <h2>Integration Testing: SSRF</h2>
      <CodeTabs label="SSRF Tests"
        ts={`import { validateSSRF } from '@eep-dev/validator';

test('blocks private IPs', async () => {
  await expect(validateSSRF('http://127.0.0.1/callback'))
    .rejects.toThrow('SSRFError');

  await expect(validateSSRF('http://10.0.0.1/callback'))
    .rejects.toThrow('SSRFError');

  await expect(validateSSRF('http://169.254.169.254/latest/meta-data'))
    .rejects.toThrow('SSRFError');
});`}
        py={`from eep_validator import validate_ssrf, SSRFError
import pytest

@pytest.mark.asyncio
async def test_blocks_private_ips():
    with pytest.raises(SSRFError):
        await validate_ssrf("http://127.0.0.1/callback")

    with pytest.raises(SSRFError):
        await validate_ssrf("http://10.0.0.1/callback")

    with pytest.raises(SSRFError):
        await validate_ssrf("http://169.254.169.254/latest/meta-data")`}
      />
    </>
  );
}
