'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sections = [
    {
        title: 'Getting Started',
        links: [
            { href: '/docs', label: 'Overview' },
        ],
    },
    {
        title: 'Specification',
        links: [
            { href: '/docs/specification', label: 'Full Specification' },
            { href: '/docs/security', label: 'Security Model' },
            { href: '/docs/monetization', label: 'Monetization Guide' },
        ],
    },
    {
        title: 'Guides',
        links: [
            { href: '/docs/guides/subscribing', label: 'How to Subscribe' },
            { href: '/docs/guides/dispatching', label: 'How to Dispatch' },
            { href: '/docs/guides/testing', label: 'Testing & Validation' },
            { href: '/docs/guides/verification', label: 'Verification & Scoring' },
            { href: '/docs/guides/adoption', label: 'Adoption Paths' },
            { href: '/docs/guides/protocol-positioning', label: 'Protocol Positioning Matrix' },
            { href: '/docs/guides/interoperability', label: 'Interoperability (MCP/A2A)' },
            { href: '/docs/guides/discovery', label: 'Discovery (manifest/DNS)' },
            { href: '/docs/guides/mcp-bridge', label: 'MCP↔EEP Bridge' },
            { href: '/docs/guides/quick-setup', label: 'Quick Setup CLI' },
            {
                href: 'https://github.com/eep-dev/EEP/blob/main/docs/guides/how-to-setup-cli.md',
                label: 'Setup CLI: full how-to ↗',
            },
            {
                href: 'https://github.com/eep-dev/EEP/blob/main/docs/guides/integrate-eep-after-setup-cli.md',
                label: 'After setup-cli: integration ↗',
            },
            {
                href: 'https://github.com/eep-dev/EEP/blob/main/docs/guides/five-minute-proof.md',
                label: 'Five-minute proof ↗',
            },
            {
                href: 'https://github.com/eep-dev/EEP/blob/main/docs/guides/realworld-simulation.md',
                label: 'Realworld simulation (HTML vs EEP) ↗',
            },
            {
                href: 'https://github.com/eep-dev/EEP/blob/main/docs/guides/eep-ready-verification.md',
                label: 'EEP-ready verification ↗',
            },
            {
                href: 'https://github.com/eep-dev/EEP/blob/main/docs/guides/adoption-metrics.md',
                label: 'Adoption metrics ↗',
            },
            {
                href: 'https://github.com/eep-dev/EEP/blob/main/docs/guides/implementation-matrix.md',
                label: 'Implementation matrix (TS/Python) ↗',
            },
            { href: '/docs/guides/reference-deployment', label: 'Reference deployment' },
            { href: '/docs/guides/standards-track', label: 'IETF/W3C Standards Track' },
            { href: 'https://github.com/eep-dev/EEP/blob/main/docs/guides/agent-onboarding.md', label: 'Agent Onboarding ↗' },
            { href: 'https://github.com/eep-dev/EEP/blob/main/docs/guides/enterprise-implementation-playbook.md', label: 'Enterprise Playbook ↗' },
        ],
    },
    {
        title: 'Reference',
        links: [
            { href: '/docs/packages', label: 'Packages & SDKs' },
            { href: '/docs/schemas', label: 'JSON Schemas' },
            { href: '/docs/events', label: 'Event Catalog' },
            { href: '/playground', label: 'Interactive Playground' },
            { href: '/whitepaper', label: 'Whitepaper' },
            {
                href: 'https://github.com/eep-dev/EEP/blob/main/docs/WHITEPAPER.tex',
                label: 'Whitepaper: LaTeX source ↗',
            },
            {
                href: 'https://github.com/eep-dev/EEP/blob/main/docs/guides/langgraph-eep-agent.md',
                label: 'LangGraph/Claude Integration ↗',
            },
        ],
    },
    {
        title: 'Community',
        links: [
            { href: 'https://github.com/eep-dev/EEP', label: 'EEP Repository ↗' },
            { href: 'https://github.com/eep-dev/eep-site', label: 'Landing Site Repository ↗' },
            { href: 'https://www.npmjs.com/search?q=%40eep-dev', label: 'npm @eep-dev Packages ↗' },
        ],
    },
];

export default function DocsSidebar() {
    const pathname = usePathname();

    return (
        <aside className="docs-sidebar">
            {sections.map((section) => (
                <div key={section.title} className="sidebar-section">
                    <div className="sidebar-section-title">{section.title}</div>
                    {section.links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            ))}
        </aside>
    );
}
