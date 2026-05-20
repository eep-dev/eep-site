import Link from 'next/link';
import CodeTabs from '../../../components/CodeTabs';

export default function PackagesPage() {
    return (
        <>
            <h1>Packages &amp; SDKs</h1>
            <p>
                The monorepo ships <strong>eight</strong> TypeScript packages under <code>@eep-dev/*</code> and{' '}
                <strong>seven</strong> Python ports (install names vary: <code>eep-signer</code>, <code>eep-validator</code>,{' '}
                <code>eep-gates</code>, <code>eep-discovery</code>, <code>eep-compliance-cli</code>, <code>eep-mcp-bridge</code>,{' '}
                <code>eep-middleware</code>). Core libraries are framework-agnostic;{' '}
                <code>@eep-dev/middleware</code> / <code>eep-middleware</code> add Express, Fastify, Hono, Koa, FastAPI, Flask, and Django bindings.{' '}
                <code>@eep-dev/setup-cli</code> publishes the <code>eep-setup</code> binary (no Python counterpart — generate artifacts from Node).{' '}
                Node.js requirements are package-specific: <code>@eep-dev/compliance-cli</code> requires Node.js &gt;= 22; other TS packages support Node.js &gt;= 18.
            </p>

            <h2>@eep-dev/signer</h2>
            <p>HMAC-SHA256 webhook signing and verification per Standard Webhooks spec. Use it on the <strong>publisher</strong> side to sign outbound deliveries, and on the <strong>subscriber</strong> side to verify them.</p>
            <CodeTabs label="Sign & Verify"
                ts={`import { EEPSigner, verifyEEPWebhook } from '@eep-dev/signer';

// Sign
const signer = new EEPSigner(secret);
const signature = signer.sign(webhookId, timestamp, body);

// Verify (one-liner)
const ok = verifyEEPWebhook(rawBody, req.headers, secret);`}
                py={`from eep_signer import EEPSigner, verify_eep_webhook

# Sign
signer = EEPSigner(secret)
signature = signer.sign(webhook_id, timestamp, body)

# Verify (one-liner)
ok = verify_eep_webhook(raw_body, request.headers, secret)`}
            />

            <h2>@eep-dev/validator</h2>
            <p>SSRF prevention (URL safety + DNS resolution against private IP ranges) and event type pattern validation. Use it <strong>before making any outbound HTTP request</strong> to a subscriber-provided URL.</p>
            <CodeTabs label="SSRF & Event Patterns"
                ts={`import { validateSSRF, matchesAnyPattern } from '@eep-dev/validator';

await validateSSRF(deliveryUrl); // throws SSRFError if unsafe

const match = matchesAnyPattern(
  'com.example.entity.updated',
  ['com.example.entity.*']
); // true`}
                py={`from eep_validator import validate_ssrf, matches_any_pattern

await validate_ssrf(delivery_url)  # raises SSRFError if unsafe

match = matches_any_pattern(
    "com.example.entity.updated",
    ["com.example.entity.*"]
)  # True`}
            />

            <h2>@eep-dev/gates</h2>
            <p>
                General-purpose access control, commerce negotiation, and service discovery. The default resolver mode is
                <strong> strict fail-closed</strong>: if a semantic verifier is missing for a requirement type, access is denied unless explicitly configured otherwise.
            </p>
            <CodeTabs label="Access Control"
                ts={`import { parseGateConfig, resolveAccess, build402Response, ProofVerifierRegistry } from '@eep-dev/gates';

// Parse and validate gate configuration
const config = parseGateConfig(entityGateJson);
const verifierRegistry = new ProofVerifierRegistry();
verifierRegistry.register({
  supportedTypes: ['payment'],
  verify: async (proof) => proof.type === 'payment' && proof.token.startsWith('pi_'),
});

// Check access
const result = await resolveAccess(agentProofs, config, 'content.papers.full_text', verifierRegistry);
if (!result.granted) {
  const body = await build402Response(config, 'content.papers.full_text', agentProofs);
  // Send HTTP 402 with body
}`}
                py={`from eep_gates import parse_gate_config, resolve_access, build_402_response, ProofVerifierRegistry

# Parse and validate gate configuration
config = parse_gate_config(entity_gate_json)
registry = ProofVerifierRegistry()

# Check access
result = await resolve_access(agent_proofs, config, "content.papers.full_text", registry)
if not result.granted:
    body = await build_402_response(config, "content.papers.full_text", agent_proofs)
    # Send HTTP 402 with body`}
            />
            <CodeTabs label="Commerce State Machine"
                ts={`import { transition } from '@eep-dev/gates';

const t = transition('open', 'accept');
// { valid: true, to: 'accepted' }

const invalid = transition('open', 'complete');
// { valid: false, reason: 'Invalid transition' }`}
                py={`from eep_gates import transition

t = transition("open", "accept")
# TransitionResult(valid=True, to="accepted")

invalid = transition("open", "complete")
# TransitionResult(valid=False, reason="Invalid transition")`}
            />

            <h2>@eep-dev/discovery</h2>
            <p>
                Discovery utilities for agents: validate <code>/.well-known/eep.json</code> manifests, parse HTTP <code>Link</code> headers, and parse DNS TXT records. Implements Whitepaper §4. For manifest vs sitemap scope and GEO as <em>informative</em> publisher context (not a protocol test), see{' '}
                <Link href="/docs/guides/discovery">Discovery</Link> and the{' '}
                <Link href="/whitepaper">Whitepaper</Link>.
            </p>
            <CodeTabs label="Discovery"
                ts={`import { validateManifest, parseLinkHeader, parseDnsTxtRecord } from '@eep-dev/discovery';

// 1. Validate manifest fetched from /.well-known/eep.json
const result = validateManifest(manifest);
if (!result.valid) console.error(result.errors);

// 2. Parse HTTP Link header
const links = parseLinkHeader('<https://example.com/eep.json>; rel="eep"');
// [{ url: 'https://...', rel: 'eep' }]

// 3. Parse DNS TXT record
const dns = parseDnsTxtRecord('v=eep1; manifest=https://example.com/.well-known/eep.json');
console.log(dns?.manifestUrl);`}
                py={`from eep_discovery import validate_manifest, parse_link_header, parse_dns_txt_record

# 1. Validate manifest
result = validate_manifest(manifest)
if not result.valid:
    print(result.errors)

# 2. Parse Link header
links = parse_link_header('<https://example.com/eep.json>; rel="eep"')
# [EEPLinkInfo(url='https://...', rel='eep')]

# 3. Parse DNS TXT record
dns = parse_dns_txt_record('v=eep1; manifest=https://example.com/.well-known/eep.json')
print(dns.manifest_url)`}
            />

            <h2>@eep-dev/compliance-cli</h2>
            <p>
                End-to-end conformance test runner for external platform audits. It reports pass/fail checks and can emit
                both machine-readable and human-readable reports with a <code>score_100</code> summary.
            </p>
            <CodeTabs label="Run Compliance"
                ts={`// TypeScript (npx)
npx @eep-dev/compliance-cli \\
  --target https://api.yourplatform.com \\
  --api-key sk_... \\
  --entity u/test \\
  --report-json ./eep-audit.json \\
  --report-md ./eep-audit.md`}
                py={`# Python (pip)
pip install eep-compliance-cli

eep-compliance \\
  --target https://api.yourplatform.com \\
  --api-key sk_... \\
  --entity u/test \\
  --report-json ./eep-audit.json \\
  --report-md ./eep-audit.md`}
            />

            <h2>@eep-dev/mcp-bridge</h2>
            <p>
                Runtime MCP↔EEP bridge that auto-synthesizes manifest/services/gates from MCP introspection and
                exposes a gated tool-call facade with fail-closed enforcement.
            </p>
            <CodeTabs label="Bridge Quickstart"
                ts={`# Node
npx @eep-dev/mcp-bridge start --config ./bridge.config.json --port 3001

# Export manifest + gates without starting server
npx @eep-dev/mcp-bridge export-manifest --config ./bridge.config.json`}
                py={`# Python
pip install eep-mcp-bridge
eep-mcp-bridge validate-config --config ./bridge.config.json`}
            />

            <h2>@eep-dev/middleware</h2>
            <p>
                Mount generated EEP subscribe/stream/gate routes on an existing HTTP server. Provides{' '}
                <code>EEPServer</code>, framework routers (Express/Fastify/Hono/Koa), and adapter hooks for auth, persistence, and messaging.
            </p>
            <CodeTabs label="Middleware"
                ts={`import { createEEPRouter } from '@eep-dev/middleware';

// See packages/@eep-dev/middleware/README.md for full Express/Fastify/Hono/Koa examples`}
                py={`# pip install eep-middleware
# See packages/eep-middleware-python/README.md for FastAPI/Flask/Django patterns`}
            />

            <h2>@eep-dev/setup-cli</h2>
            <p>
                Configuration and artifact generator (<strong>binary:</strong> <code>eep-setup</code>). Commands include{' '}
                <code>init</code>, <code>inject</code>, <code>apply</code> (with <code>--dry-run</code> and <code>--production</code>),{' '}
                <code>verify</code>, <code>doctor</code>, <code>status</code>, <code>upgrade</code>, <code>watch</code>,{' '}
                <code>rotate-secrets</code>. Use <code>--interactive</code> / <code>--answers</code> for identity fields in CI vs TTY.
            </p>
            <pre><code>{`# After publish:
npx @eep-dev/setup-cli@latest init --preset exchange --out ./eep-setup.json

# From a built monorepo package:
node dist/index.js apply --config ./eep-setup.json --output ./eep-generated

# Binary name when installed:
eep-setup verify --output ./eep-generated`}</code></pre>
        </>
    );
}
