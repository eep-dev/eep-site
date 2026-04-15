import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <span>© {new Date().getFullYear()} EEP — Entity Engagement Protocol. Apache 2.0 License.</span>
                <ul className="footer-links">
                    <li><Link href="/docs">Documentation</Link></li>
                    <li><Link href="/docs/specification">Specification</Link></li>
                    <li><a href="https://github.com/eep-dev/EEP" target="_blank" rel="noopener">EEP on GitHub</a></li>
                    <li><a href="https://github.com/eep-dev/eep-site" target="_blank" rel="noopener">Landing Site Repo</a></li>
                </ul>
            </div>
        </footer>
    );
}
