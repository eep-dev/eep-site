import CodeTabs from '../../../../components/CodeTabs';

export const metadata = { title: 'Verification & Scoring — EEP Docs' };

export default function VerificationGuidePage() {
  return (
    <>
      <h1>Verification &amp; Scoring</h1>
      <p>
        EEP includes an automation-first verification workflow so any platform can be audited consistently.
        Use the compliance CLI in CI to generate both machine-readable and human-readable reports.
      </p>

      <h2>Run an audit</h2>
      <CodeTabs
        label="Compliance Audit"
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

      <h2>What you get</h2>
      <ul>
        <li><code>score_100</code> summary for release gates and KPI tracking.</li>
        <li>Per-check pass/fail data for policy automation.</li>
        <li>Actionable recommendations for each failed check.</li>
        <li>Markdown artifact that can be shared directly with engineering and security teams.</li>
      </ul>

      <h2>CI usage pattern</h2>
      <pre><code>{`# Example release gate
if [ "$(jq '.score_100' eep-audit.json)" -lt 90 ]; then
  echo "EEP score below release threshold"
  exit 1
fi`}</code></pre>

      <h2>Setup vs compliance reports</h2>
      <p>
        <code>@eep-dev/compliance-cli</code> scores a <strong>live</strong> deployment.{' '}
        <code>eep-setup verify</code> scores <strong>generated files</strong> on disk — use both where applicable; see{' '}
        <a
          href="https://github.com/eep-dev/EEP/blob/main/docs/guides/eep-ready-verification.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          EEP-ready verification ↗
        </a>
        .
      </p>

      <h2>Scope note</h2>
      <p>
        Automated checks cover a large portion of Core/Standard conformance and selected Full-path checks.
        Keep manual validation for environment-specific controls (e.g., production wallet ops, WebSocket commerce hardening,
        and org-specific legal/policy requirements).
      </p>
    </>
  );
}
