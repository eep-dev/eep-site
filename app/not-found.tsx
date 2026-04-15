'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const TYPEWRITER_LINES = [
    { text: '404 ', cls: 'nf-num' },
    { text: 'Not Found', cls: 'nf-title' },
    { text: '\n', cls: '' },
    { text: '\n', cls: '' },
    { text: '> ', cls: 'nf-muted' },
    { text: "The route you requested doesn't exist,", cls: 'nf-muted' },
    { text: '\n', cls: '' },
    { text: '> ', cls: 'nf-muted' },
    { text: 'has been moved, or is still in draft.', cls: 'nf-muted' },
    { text: '\n', cls: '' },
    { text: '\n', cls: '' },
    { text: '---', cls: 'nf-muted' },
    { text: '\n', cls: '' },
    { text: '\n', cls: '' },
];

export default function NotFound() {
    const [visibleChars, setVisibleChars] = useState(0);
    const [showLink, setShowLink] = useState(false);

    const totalChars = TYPEWRITER_LINES.reduce((sum, l) => sum + l.text.length, 0);

    useEffect(() => {
        if (visibleChars < totalChars) {
            const timer = setTimeout(
                () => setVisibleChars((c) => c + 1),
                visibleChars === 0 ? 350 : 24
            );
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => setShowLink(true), 200);
            return () => clearTimeout(timer);
        }
    }, [visibleChars, totalChars]);

    const renderTypewriter = () => {
        let remaining = visibleChars;
        return TYPEWRITER_LINES.map((line, i) => {
            if (remaining <= 0) return null;
            const show = Math.min(remaining, line.text.length);
            remaining -= show;
            const text = line.text.slice(0, show);
            if (text === '\n') return <br key={i} />;
            return <span key={i} className={line.cls}>{text}</span>;
        });
    };

    return (
        <div className="nf-page">
            <main className="nf-main">
                <div className="nf-card-wrap">
                    <div className="nf-mono-box">
                        {renderTypewriter()}
                        {visibleChars < totalChars && (
                            <span className="nf-cursor" />
                        )}
                        {showLink && (
                            <span className="nf-md-link" style={{ animation: 'fadeInUp 0.3s ease-out both' }}>
                                <span className="nf-muted">{'['}</span>
                                <span className="nf-accent">← Go home</span>
                                <span className="nf-muted">{'](/'}</span>
                                <span className="nf-muted">{')'}</span>
                            </span>
                        )}
                    </div>

                    <div
                        className="nf-actions"
                        style={{
                            opacity: showLink ? 1 : 0,
                            transform: showLink ? 'translateY(0)' : 'translateY(8px)',
                            transition: 'opacity 0.3s ease, transform 0.3s ease',
                        }}
                    >
                        <Link href="/" className="btn btn-primary">Go home</Link>
                        <button onClick={() => window.history.back()} className="btn btn-secondary">Go back</button>
                    </div>
                    <p className="nf-footer">EEP v0.1</p>
                </div>
            </main>

            <style>{`
                .nf-page {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    background: var(--bg);
                    padding-top: var(--header-height);
                }
                .nf-main {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }
                .nf-card-wrap {
                    max-width: 480px;
                    width: 100%;
                    text-align: center;
                }
                .nf-mono-box {
                    background: var(--code-bg);
                    border: 1px solid var(--code-border);
                    border-radius: 12px;
                    padding: 1.75rem 2rem;
                    text-align: left;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.875rem;
                    line-height: 1.7;
                    min-height: 180px;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 2px 16px oklch(0 0 0 / 0.2);
                }
                .nf-num {
                    font-weight: 700;
                    color: oklch(0.65 0.15 160);
                    font-size: 1rem;
                }
                .nf-title {
                    color: var(--code-text);
                    font-weight: 600;
                }
                .nf-muted {
                    color: oklch(0.45 0.01 260);
                }
                .nf-accent {
                    color: oklch(0.65 0.15 160);
                }
                .nf-cursor {
                    display: inline-block;
                    width: 2px;
                    height: 1em;
                    background: oklch(0.65 0.15 160 / 0.7);
                    margin-left: 2px;
                    vertical-align: text-bottom;
                    animation: termBlink 0.9s step-end infinite;
                }
                .nf-md-link {
                    display: inline;
                }
                .nf-actions {
                    display: flex;
                    gap: 0.75rem;
                    justify-content: center;
                    margin-bottom: 2.5rem;
                }
                .nf-footer {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    opacity: 0.5;
                }
                @keyframes termBlink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}</style>
        </div>
    );
}
