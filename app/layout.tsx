import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EEP — Entity Engagement Protocol",
  description: "The open standard for real-time, agent-native communication between digital entities. Zero-trust by design with fail-closed gates, compliance scoring, and machine-actionable onboarding.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "EEP — Entity Engagement Protocol",
    description: "Agent-native event protocol with strict fail-closed access controls and automated compliance verification.",
    url: "https://eep.dev",
    siteName: "EEP",
    type: "website",
    images: [
      {
        url: "/eep-logo-small.png",
        width: 1200,
        height: 630,
        alt: "EEP — Entity Engagement Protocol",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Blocking script — runs before first paint, eliminates dark-mode FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('eep-theme');
                  var preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  document.documentElement.setAttribute('data-theme', saved || preferred);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
