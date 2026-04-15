import CodeTabs from '../../../../components/CodeTabs';
import Link from 'next/link';

export const metadata = { title: 'Adoption Paths — EEP Docs' };

export default function AdoptionGuidePage() {
  return (
    <>
      <h1>Adoption Paths (Human + Agent)</h1>
      <p>
        EEP is designed so organizations and coding agents can adopt the protocol with the same source of truth.
        The fastest path is: clone, bootstrap, validate locally, then run compliance against your own platform.
        For greenfield/brownfield artifact generation, start with <Link href="/docs/guides/quick-setup">Quick Setup CLI</Link> and the{' '}
        <a href="https://github.com/eep-dev/EEP/blob/main/docs/guides/integrate-eep-after-setup-cli.md" target="_blank" rel="noopener noreferrer">
          post-setup integration guide ↗
        </a>
        .
      </p>

      <h2>1) Clone and bootstrap</h2>
      <CodeTabs
        label="Repository Setup"
        ts={`git clone https://github.com/eep-dev/EEP.git
cd EEP
bash scripts/bootstrap.sh

# run full repo checks
bash test.sh`}
        py={`git clone https://github.com/eep-dev/EEP.git
cd EEP
bash scripts/bootstrap.sh

# run full repo checks
bash test.sh`}
      />

      <h2>2) Pick your minimum conformance target</h2>
      <table>
        <thead><tr><th>Target</th><th>When to choose it</th><th>Minimum capabilities</th></tr></thead>
        <tbody>
          <tr><td><strong>Core</strong></td><td>You need discovery + push stream quickly</td><td>Layer 1 REST + SSE + CloudEvents</td></tr>
          <tr><td><strong>Standard</strong></td><td>You need production webhook integrations</td><td>Core + Webhooks + HMAC verification + payment/credential gates</td></tr>
          <tr><td><strong>Full</strong></td><td>You need live negotiation and autonomous commerce</td><td>Standard + WebSocket pulse + commerce/session controls</td></tr>
        </tbody>
      </table>

      <h2>3) Enforce zero-trust defaults from day one</h2>
      <ul>
        <li>Use semantic verifier registries for gate proofs, not structural checks alone.</li>
        <li>Keep resolver mode fail-closed (default) unless you explicitly document an exception.</li>
        <li>Validate webhook signatures with timing-safe compare and 60-second timestamp tolerance.</li>
        <li>Apply SSRF protections before outbound webhook delivery, including IPv6 private/link-local ranges.</li>
      </ul>

      <h2>4) Production references</h2>
      <ul>
        <li><a href="https://github.com/eep-dev/EEP/blob/main/docs/guides/enterprise-implementation-playbook.md" target="_blank" rel="noopener noreferrer">Enterprise implementation playbook ↗</a></li>
        <li><a href="https://github.com/eep-dev/EEP/blob/main/docs/guides/agent-onboarding.md" target="_blank" rel="noopener noreferrer">Agent onboarding guide ↗</a></li>
        <li><a href="https://github.com/eep-dev/EEP/blob/main/docs/audit/2026-04-11-zero-trust-gate-report.md" target="_blank" rel="noopener noreferrer">Zero-trust gate report ↗</a></li>
      </ul>

      <h2>5) Narrated demo (optional)</h2>
      <p>
        For a side-by-side terminal story contrasting legacy HTML scraping with gate-based JSON (deterministic, no LLM calls), see the{' '}
        <a href="https://github.com/eep-dev/EEP/blob/main/docs/guides/realworld-simulation.md" target="_blank" rel="noopener noreferrer">
          realworld simulation guide ↗
        </a>{' '}
        and run <code className="text-sm">npm run demo</code> from <code className="text-sm">realworld-simulation/</code> in the EEP repo.
      </p>
    </>
  );
}
