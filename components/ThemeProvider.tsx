'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: 'light', toggle: () => { } });

export function useTheme() { return useContext(ThemeContext); }

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        const saved = localStorage.getItem('eep-theme') as Theme | null;
        const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const t = saved || preferred;
        setTheme(t);
        document.documentElement.setAttribute('data-theme', t);
    }, []);

    const toggle = () => {
        const next = theme === 'light' ? 'dark' : 'light';

        const apply = () => {
            setTheme(next);
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('eep-theme', next);
        };

        // Use View Transition API for smooth crossfade
        if (typeof document !== 'undefined' && (document as any).startViewTransition) {
            (document as any).startViewTransition(apply);
        } else {
            apply();
        }
    };

    return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}
