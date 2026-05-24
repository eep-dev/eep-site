import Link from 'next/link';
import adoptersData from '@/data/adopters.json';

export const metadata = { title: 'Adopters | EEP' };

type Adopter = {
    id: string;
    name: string;
    kind: string;
    description: string;
    url: string | null;
    source: string;
    conformance: string;
};

export default function AdoptersPage() {
    const rows = (adoptersData as { adopters: Adopter[] }).adopters;
    return (
        <div className="section" style={{ paddingTop: 'calc(var(--header-height, 52px) + 2rem)' }}>
            <div className="container" style={{ maxWidth: 960, margin: '0 auto' }}>
            <h1>Adopters &amp; integrations (seed)</h1>
            <p>
                Early <strong>examples and infrastructure</strong> around the Entity Engagement Protocol. This list is versioned in git; no
                marketplace or ranking. See the{' '}
                <Link href="https://github.com/eep-dev/EEP/blob/main/registry/adopters.json">source JSON</Link> in the EEP repo.
            </p>
            <table className="adopters-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.5rem' }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border, #333)', padding: '0.5rem' }}>Name</th>
                        <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border, #333)', padding: '0.5rem' }}>Kind</th>
                        <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border, #333)', padding: '0.5rem' }}>Description</th>
                        <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border, #333)', padding: '0.5rem' }}>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((a) => (
                        <tr key={a.id}>
                            <td style={{ padding: '0.5rem', verticalAlign: 'top' }}>{a.name}</td>
                            <td style={{ padding: '0.5rem', verticalAlign: 'top' }}><code>{a.kind}</code></td>
                            <td style={{ padding: '0.5rem', verticalAlign: 'top' }}>{a.description}</td>
                            <td style={{ padding: '0.5rem', verticalAlign: 'top' }}>
                                {a.url ? (
                                    <a href={a.url} rel="noopener noreferrer" target="_blank">
                                        site
                                    </a>
                                ) : null}
                                {a.url && a.source ? ' · ' : null}
                                {a.source ? (
                                    <a href={a.source} rel="noopener noreferrer" target="_blank">
                                        source
                                    </a>
                                ) : null}
                                <div style={{ fontSize: '0.85em', marginTop: '0.25rem' }}>
                                    <em>Conformance: {a.conformance}</em>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p style={{ marginTop: '1.5rem' }}>
                <Link href="/docs">Back to documentation</Link>
            </p>
            </div>
        </div>
    );
}
