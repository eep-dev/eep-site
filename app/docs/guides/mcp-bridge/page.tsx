import Link from 'next/link';

export const metadata = { title: 'MCP↔EEP Bridge — EEP Docs' };

export default function MCPBridgePage() {
    return (
        <>
            <h1>MCP↔EEP Bridge</h1>
            <p>
                The bridge maps MCP servers into EEP-native discovery, service catalogs, and gate-aware access
                flows so MCP tools can be consumed inside protocol-grade EEP deployments.
            </p>

            <h2>Implementations</h2>
            <ul>
                <li><code>@eep-dev/mcp-bridge</code> (Node.js)</li>
                <li><code>eep-mcp-bridge</code> (Python)</li>
            </ul>

            <h2>Exposed bridge endpoints</h2>
            <p>Aligned with the Node bridge server routes (see <code>@eep-dev/mcp-bridge</code>):</p>
            <ul>
                <li><code>GET /.well-known/eep.json</code></li>
                <li><code>GET /eep/services</code></li>
                <li><code>GET /eep/gates</code></li>
                <li><code>POST /eep/subscribe</code></li>
                <li><code>GET /eep/stream</code> (SSE)</li>
                <li><code>POST /mcp/tools/call</code> (fail-closed gate enforcement)</li>
            </ul>

            <h2>Security baseline</h2>
            <ul>
                <li>Tool-name validation + unknown tool rejection</li>
                <li>402 fail-closed access path for gated tools</li>
                <li>Redteam suites in both runtimes</li>
            </ul>

            <h2>See also</h2>
            <ul>
                <li><Link href="/docs/guides/reference-deployment">Reference deployment →</Link></li>
                <li><Link href="/docs/guides/standards-track">IETF/W3C roadmap →</Link></li>
            </ul>
        </>
    );
}
