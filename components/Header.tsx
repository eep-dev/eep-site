'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Sun, Moon, Github } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Header() {
    const { theme, toggle } = useTheme();

    return (
        <header className="header">
            <div className="header-inner">
                <Link href="/" className="header-logo">
                    <span className="header-logo-mark">
                        <Image
                            src="/eep-logo-small.png"
                            alt="EEP"
                            width={28}
                            height={28}
                            className="header-logo-image"
                            priority
                        />
                    </span>
                    <span className="protocol-badge">v0.1</span>
                </Link>
                <nav>
                    <ul className="header-nav">
                        <li><Link href="/docs">Docs</Link></li>
                        <li><Link href="/docs/specification">Specification</Link></li>
                        <li><Link href="/docs/packages">Packages</Link></li>
                        <li><Link href="/playground">Playground</Link></li>
                        <li><a href="https://github.com/eep-dev/EEP" target="_blank" rel="noopener" aria-label="GitHub" style={{ display: 'flex', alignItems: 'center' }}><Github size={17} /></a></li>
                        <li>
                            <button
                                className="theme-toggle"
                                onClick={toggle}
                                aria-label="Toggle theme"
                                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                <Sun className="theme-icon theme-icon-sun" />
                                <Moon className="theme-icon theme-icon-moon" />
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
