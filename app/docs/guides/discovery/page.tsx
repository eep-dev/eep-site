import Link from 'next/link';
import CodeTabs from '../../../../components/CodeTabs';

export const metadata = { title: 'Discovery | EEP Docs' };

export default function DiscoveryGuidePage() {
    return (
        <>
            <h1>EEP Discovery</h1>
            <p>
                EEP defines three mechanisms for agents to discover whether a service is EEP-compatible and locate its manifest,
                subscription endpoint, and gate configuration. Implements Whitepaper §4.
            </p>

            <h2>Manifests, sitemaps, and generative retrieval</h2>
            <p>
                Traditional SEO often uses XML <code>sitemap.xml</code> so crawlers can enumerate <strong>page URLs</strong> for human-oriented search.
                The EEP manifest at <code>/.well-known/eep.json</code> is a different job: a machine-readable declaration of <strong>entity identity</strong>, protocol layers, gates, and content types. It complements sitemaps; it does not replace them.
            </p>
            <p>
                Industry and research discussions of <strong>generative engine optimization (GEO)</strong> focus on how sources are selected and cited inside LLM-mediated answers. EEP does not guarantee rankings or citations. It does provide structured discovery and policy gates so automated clients can find verifiable endpoints without scraping marketing HTML.
            </p>
            <p>
                See the <Link href="/whitepaper">EEP Whitepaper</Link>{' '}
                (Discovery chapter, including &quot;Manifests, sitemaps, and generative retrieval&quot;;{' '}
                <a href="https://github.com/eep-dev/EEP/blob/main/docs/WHITEPAPER.tex" target="_blank" rel="noopener noreferrer">LaTeX source</a>) for narrative and citations. The{' '}
                <Link href="/docs/specification">normative specification</Link> §12 defines wire requirements only.
            </p>

            <h2>1. Well-known Manifest (<code>/.well-known/eep.json</code>)</h2>
            <p>
                The primary discovery mechanism. Any EEP-compatible service exposes a manifest at <code>/.well-known/eep.json</code>.
                Agents fetch and validate this manifest before subscribing.
            </p>

            <h3>Required manifest fields</h3>
            <table>
                <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><code>did</code></td><td>string</td><td>W3C DID of the entity (e.g. <code>did:web:example.com</code>)</td></tr>
                    <tr><td><code>eep_version</code></td><td>string</td><td>Protocol version, e.g. <code>"0.1"</code></td></tr>
                    <tr><td><code>layers</code></td><td>object</td><td>Endpoint URLs: <code>layer1</code> (REST) is required</td></tr>
                    <tr><td><code>supported_content_types</code></td><td>string[]</td><td>MIME types the entity publishes</td></tr>
                    <tr><td><code>pqc_ready</code></td><td>boolean</td><td>Post-quantum cryptography support</td></tr>
                    <tr><td><code>x402_enabled</code></td><td>boolean</td><td>x402 on-chain payment gate support</td></tr>
                </tbody>
            </table>

            <CodeTabs label="Validate Manifest"
                ts={`import { validateManifest } from '@eep-dev/discovery';

const res = await fetch('https://api.example.com/.well-known/eep.json');
const manifest = await res.json();

const result = validateManifest(manifest);
if (!result.valid) {
  console.error('Invalid manifest:', result.errors);
} else {
  console.log('Layer 1 endpoint:', manifest.layers.layer1);
}`}
                py={`from eep_discovery import validate_manifest
import httpx

async with httpx.AsyncClient() as client:
    res = await client.get("https://api.example.com/.well-known/eep.json")
    manifest = res.json()

result = validate_manifest(manifest)
if not result.valid:
    print("Invalid manifest:", result.errors)
else:
    print("Layer 1 endpoint:", manifest["layers"]["layer1"])`}
            />

            <h2>2. HTTP Link Header</h2>
            <p>
                Agents inspect HTTP responses for <code>Link</code> headers with <code>rel=&quot;eep&quot;</code>.
                This allows discovery from any existing HTTP endpoint without a dedicated manifest path.
            </p>
            <pre style={{ fontFamily: 'monospace', background: 'var(--color-code-bg)', padding: '1rem', borderRadius: '6px', overflowX: 'auto' }}>
                {`Link: <https://api.example.com/.well-known/eep.json>; rel="eep"
Link: <https://api.example.com/eep/subscribe>; rel="subscribe"`}
            </pre>

            <CodeTabs label="Parse Link Header"
                ts={`import { parseLinkHeader } from '@eep-dev/discovery';

const links = parseLinkHeader(res.headers.get('link') ?? '');
const eepLink = links.find(l => l.rel === 'eep');
if (eepLink) {
  console.log('Manifest URL:', eepLink.url);
}
const subscribeLink = links.find(l => l.rel === 'subscribe');`}
                py={`from eep_discovery import parse_link_header

links = parse_link_header(response.headers.get("link", ""))
eep_link = next((l for l in links if l.rel == "eep"), None)
if eep_link:
    print("Manifest URL:", eep_link.url)`}
            />

            <h2>3. DNS TXT Record</h2>
            <p>
                A fallback mechanism for domains where HTTP Link headers aren&apos;t available.
                Add a <code>_eep.yourdomain.com</code> TXT record pointing to your manifest.
            </p>
            <pre style={{ fontFamily: 'monospace', background: 'var(--color-code-bg)', padding: '1rem', borderRadius: '6px', overflowX: 'auto' }}>
                {`_eep.example.com.  IN  TXT  "v=eep1; manifest=https://api.example.com/.well-known/eep.json"`}
            </pre>

            <CodeTabs label="Parse DNS TXT"
                ts={`import { parseDnsTxtRecord } from '@eep-dev/discovery';

// After resolving _eep.domain.com TXT record:
const record = parseDnsTxtRecord('v=eep1; manifest=https://api.example.com/.well-known/eep.json');
if (record) {
  console.log('Manifest URL:', record.manifestUrl);
}`}
                py={`from eep_discovery import parse_dns_txt_record

txt = "v=eep1; manifest=https://api.example.com/.well-known/eep.json"
record = parse_dns_txt_record(txt)
if record:
    print("Manifest URL:", record.manifest_url)`}
            />

            <h2>Next steps</h2>
            <ul>
                <li><Link href="/docs/guides/subscribing">Subscribe to entity events →</Link></li>
                <li><Link href="/docs/packages">@eep-dev/discovery package reference →</Link></li>
                <li><Link href="/docs/schemas">eep-manifest.json schema →</Link></li>
            </ul>
        </>
    );
}
