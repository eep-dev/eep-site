export const metadata = { title: 'Quick Setup CLI — EEP Docs' };

export default function QuickSetupPage() {
    return (
        <>
            <h1>Quick Setup CLI</h1>
            <p>
                <code>@eep-dev/setup-cli</code> bootstraps EEP configuration and artifacts for both greenfield and
                existing projects.
            </p>
            <p>
                Full tutorial (install, both flows, verification, middleware):{' '}
                <a
                    href="https://github.com/eep-dev/EEP/blob/main/docs/guides/how-to-setup-cli.md"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    How to use the Setup CLI ↗
                </a>
            </p>
            <p>
                After artifacts are generated, wire your HTTP app:{' '}
                <a
                    href="https://github.com/eep-dev/EEP/blob/main/docs/guides/integrate-eep-after-setup-cli.md"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    After setup-cli: integration ↗
                </a>
            </p>

            <h2>Core flow</h2>
            <p>
                The CLI binary is <code>eep-setup</code>. From the published package:{' '}
                <code>npx @eep-dev/setup-cli@latest &lt;command&gt;</code> (same as <code>eep-setup</code> when the package is on your PATH).
                Inside the EEP monorepo, use <code>node dist/index.js</code> after <code>npm run build</code>, or{' '}
                <code>npx tsx src/index.ts</code> from <code>packages/@eep-dev/setup-cli</code> — see the full how-to for paths.
            </p>
            <pre><code>{`# 1) Create setup config (published / global eep-setup)
npx @eep-dev/setup-cli@latest init --preset exchange --out ./eep-setup.json

# Monorepo equivalent (from packages/@eep-dev/setup-cli):
# npx tsx src/index.ts init --preset exchange --out ./eep-setup.json

# 2) Inject into an existing project
eep-setup inject --project /path/to/api --out /path/to/api/eep-setup.json

# 3) Preview artifacts (optional, no writes)
eep-setup apply --config /path/to/api/eep-setup.json --dry-run

# 4) Write artifacts (add --production to block placeholder identities)
eep-setup apply --config /path/to/api/eep-setup.json --output /path/to/api/eep-generated

# 5) Verify and monitor
eep-setup verify --output /path/to/api/eep-generated
eep-setup doctor --output /path/to/api/eep-generated
eep-setup status --output /path/to/api/eep-generated`}</code></pre>

            <h2>Security controls</h2>
            <ul>
                <li>Unsafe output paths are blocked by default in <code>apply</code></li>
                <li><code>rotate-secrets</code> supports dual-key windows via <code>EEP_WEBHOOK_SECRET_PREVIOUS</code></li>
                <li><code>verify</code> emits machine and human-readable reports</li>
            </ul>
        </>
    );
}
