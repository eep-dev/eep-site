'use client';
import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';

const LANG_MAP: Record<string, string> = {
    'bash': 'bash',
    'shell': 'bash',
    'javascript': 'javascript',
    'js': 'javascript',
    'typescript': 'typescript',
    'ts': 'typescript',
    'json': 'json',
    'http': 'http',
    'python': 'python',
    'py': 'python',
};

export default function CodeTabs({ ts, py, label }: { ts: string; py: string; label?: string }) {
    const [lang, setLang] = useState<'ts' | 'py'>('ts');

    const code = lang === 'ts' ? ts : py;
    const prismLang = lang === 'ts' ? 'typescript' : 'python';

    return (
        <div className="code-tabs">
            <div className="code-tabs-header">
                {label && <span className="code-tabs-label">{label}</span>}
                <div className="code-tabs-buttons">
                    <button className={lang === 'ts' ? 'active' : ''} onClick={() => setLang('ts')}>TypeScript</button>
                    <button className={lang === 'py' ? 'active' : ''} onClick={() => setLang('py')}>Python</button>
                </div>
            </div>
            <Highlight theme={themes.nightOwl} code={code.trim()} language={prismLang}>
                {({ style, tokens, getLineProps, getTokenProps }) => (
                    <pre style={{ ...style, background: 'transparent', margin: 0 }}>
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })}>
                                {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({ token })} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        </div>
    );
}
