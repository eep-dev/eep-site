'use client';
import { useEffect, useRef, ReactNode, CSSProperties } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    delay?: number;          // ms
    variant?: 'fade' | 'up' | 'scale';
    className?: string;
    style?: CSSProperties;
}

export default function ScrollReveal({
    children,
    delay = 0,
    variant = 'up',
    className = '',
    style,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'none';
                        el.style.filter = 'none';
                    }, delay);
                    observer.disconnect();
                }
            },
            { threshold: 0.12 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [delay]);

    const initialStyle: CSSProperties = {
        opacity: 0,
        transition: `opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1), transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)`,
        ...(variant === 'up' ? { transform: 'translateY(24px)' } : {}),
        ...(variant === 'scale' ? { transform: 'translateY(12px) scale(0.97)' } : {}),
        ...style,
    };

    return (
        <div ref={ref} className={className} style={initialStyle}>
            {children}
        </div>
    );
}
