"use client";

import dynamic from "next/dynamic";

const WhitepaperViewer = dynamic(
    () => import("./WhitepaperViewer").then((m) => ({ default: m.WhitepaperViewer })),
    {
        ssr: false,
        loading: () => (
            <div className="whitepaper-layout">
                <p className="whitepaper-loading">Loading…</p>
            </div>
        ),
    },
);

export function WhitepaperShell() {
    return <WhitepaperViewer />;
}
