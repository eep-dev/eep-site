export const metadata = { title: 'IETF/W3C Standards Track — EEP Docs' };

export default function StandardsTrackPage() {
    return (
        <>
            <h1>IETF/W3C Standards Track</h1>
            <p>
                EEP&apos;s standards strategy is dual-track: IETF for protocol wire semantics and W3C profile
                alignment for DID/VC identity primitives.
            </p>

            <h2>IETF focus</h2>
            <ul>
                <li>Internet-Draft split: core protocol, gates/commerce, security profile</li>
                <li>Public review + interop evidence before WG adoption push</li>
                <li>Target: Proposed Standard + operational BCP companion</li>
            </ul>

            <h2>W3C focus</h2>
            <ul>
                <li>DID profile for entities/agents in EEP flows</li>
                <li>VC profile for delegation and gate credentials</li>
                <li>Conformance vectors aligned with W3C style test suites</li>
            </ul>

            <h2>Readiness artifact</h2>
            <p>
                See{' '}
                <a
                    href="https://github.com/eep-dev/EEP/blob/main/docs/standards/ietf-w3c-readiness-roadmap.md"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    docs/standards/ietf-w3c-readiness-roadmap.md ↗
                </a>{' '}
                in the main EEP repository for milestone planning and execution phases.
            </p>
        </>
    );
}
