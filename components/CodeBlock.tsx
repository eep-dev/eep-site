'use client';
import { Highlight, themes } from 'prism-react-renderer';

interface CodeBlockProps {
    code: string;
    language?: string;
}

const LANG_MAP: Record<string, string> = {
    'bash': 'bash',
    'shell': 'bash',
    'sh': 'bash',
    'javascript': 'javascript',
    'js': 'javascript',
    'typescript': 'typescript',
    'ts': 'typescript',
    'json': 'json',
    'http': 'http',
    'sse': 'markup',
    'python': 'python',
    'py': 'python',
};

export default function CodeBlock({ code, language = '' }: CodeBlockProps) {
    const prismLang = LANG_MAP[language.toLowerCase()] || 'markup';

    return (
        <div className="code-block">
            {language && <span className="lang-label">{language}</span>}
            <Highlight theme={themes.nightOwl} code={code.trim()} language={prismLang}>
                {({ style, tokens, getLineProps, getTokenProps }) => (
                    <pre style={{ ...style, background: 'transparent', margin: 0, padding: 0 }}>
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
