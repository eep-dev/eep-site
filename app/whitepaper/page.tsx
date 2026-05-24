import type { Metadata } from "next";
import { WhitepaperShell } from "./WhitepaperShell";

export const metadata: Metadata = {
    title: "Whitepaper | EEP",
    description:
        "EEP technical whitepaper: Entity Engagement Protocol architecture, discovery, gates, and agent-native engagement.",
    alternates: { canonical: "/whitepaper" },
    openGraph: {
        title: "Whitepaper | EEP",
        description: "Technical whitepaper for the Entity Engagement Protocol (EEP).",
        url: "https://eep.dev/whitepaper",
        type: "website",
    },
};

export default function WhitepaperPage() {
    return <WhitepaperShell />;
}
