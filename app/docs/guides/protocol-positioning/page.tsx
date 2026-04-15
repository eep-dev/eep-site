export const metadata = { title: 'Protocol Positioning Matrix — EEP Docs' };

export default function ProtocolPositioningPage() {
  return (
    <>
      <h1>Protocol Positioning Matrix</h1>
      <p>
        EEP is a protocol standard for <strong>agent-to-entity engagement</strong>. It is designed to
        complement, not replace, protocols that solve different interoperability scopes.
      </p>

      <table>
        <thead>
          <tr>
            <th>Protocol</th>
            <th>Primary Scope</th>
            <th>Pattern</th>
            <th>Core Strength</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>EEP</td>
            <td>Entity engagement</td>
            <td><code>agent ↔ entity</code></td>
            <td>Realtime entity streams, gate proofs, payment-aware access</td>
          </tr>
          <tr>
            <td>MCP</td>
            <td>Tool and resource invocation</td>
            <td><code>agent ↔ tool</code></td>
            <td>Portable tool-call and resource access contracts</td>
          </tr>
          <tr>
            <td>A2A</td>
            <td>Agent collaboration</td>
            <td><code>agent ↔ agent</code></td>
            <td>Inter-agent task delegation lifecycle</td>
          </tr>
          <tr>
            <td>ANP</td>
            <td>Decentralized agent networking</td>
            <td><code>agent ↔ agent</code></td>
            <td>DID-centric decentralized network coordination</td>
          </tr>
        </tbody>
      </table>
      <p>
        For a short complementary framing vs MCP/A2A (including trust signals and CI verification), see{' '}
        <a
          href="https://github.com/eep-dev/EEP/blob/main/docs/guides/eep-positioning-complementary.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          eep-positioning-complementary.md ↗
        </a>
        .
      </p>
    </>
  );
}
