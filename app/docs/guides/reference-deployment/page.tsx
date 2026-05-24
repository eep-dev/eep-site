export const metadata = { title: 'Reference deployment | EEP Docs' };

export default function ReferenceDeploymentPage() {
    return (
        <>
            <h1>Reference deployment</h1>
            <p>
                <code>examples/eep-reference-implementation/</code> in the EEP repository is the dual-runtime reference
                deployment used for protocol validation, implementation onboarding, and interop verification (also
                referred to informally as <strong>eep-api</strong>).
            </p>

            <h2>Runtimes</h2>
            <ul>
                <li><code>examples/eep-reference-implementation/node</code> (Node.js reference publisher)</li>
                <li><code>examples/eep-reference-implementation/python</code> (FastAPI reference publisher)</li>
                <li><code>examples/eep-reference-implementation/compose.yml</code> (Redis + Postgres local stack)</li>
            </ul>

            <h2>Covered protocol surface</h2>
            <ul>
                <li>Layer 1 discovery + entity resolution</li>
                <li>Layer 2 subscription and SSE stream</li>
                <li>Layer 3 WebSocket pulse</li>
                <li>Gate and services endpoints with payment-gated content route</li>
            </ul>

            <h2>Verification</h2>
            <ul>
                <li>Node runtime tests/coverage: 100%</li>
                <li>Python runtime tests/coverage: 100%</li>
                <li>Shared parity fixture: <code>examples/eep-reference-implementation/parity-fixtures.json</code></li>
            </ul>
        </>
    );
}
