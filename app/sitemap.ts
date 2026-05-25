import type { MetadataRoute } from "next";

const SITE = "https://eep.dev";

const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/adopters", priority: 0.8, changeFrequency: "weekly" },
  { path: "/whitepaper", priority: 0.9, changeFrequency: "monthly" },
  { path: "/playground", priority: 0.7, changeFrequency: "monthly" },
  { path: "/docs", priority: 0.9, changeFrequency: "weekly" },
  { path: "/docs/specification", priority: 0.9, changeFrequency: "monthly" },
  { path: "/docs/schemas", priority: 0.7, changeFrequency: "monthly" },
  { path: "/docs/events", priority: 0.7, changeFrequency: "monthly" },
  { path: "/docs/packages", priority: 0.7, changeFrequency: "monthly" },
  { path: "/docs/security", priority: 0.7, changeFrequency: "monthly" },
  { path: "/docs/monetization", priority: 0.7, changeFrequency: "monthly" },
  { path: "/docs/guides/adoption", priority: 0.6, changeFrequency: "monthly" },
  { path: "/docs/guides/discovery", priority: 0.6, changeFrequency: "monthly" },
  { path: "/docs/guides/dispatching", priority: 0.6, changeFrequency: "monthly" },
  { path: "/docs/guides/interoperability", priority: 0.6, changeFrequency: "monthly" },
  { path: "/docs/guides/mcp-bridge", priority: 0.6, changeFrequency: "monthly" },
  { path: "/docs/guides/protocol-positioning", priority: 0.6, changeFrequency: "monthly" },
  { path: "/docs/guides/quick-setup", priority: 0.6, changeFrequency: "monthly" },
  { path: "/docs/guides/reference-deployment", priority: 0.6, changeFrequency: "monthly" },
  { path: "/docs/guides/standards-track", priority: 0.6, changeFrequency: "monthly" },
  { path: "/docs/guides/subscribing", priority: 0.6, changeFrequency: "monthly" },
  { path: "/docs/guides/testing", priority: 0.6, changeFrequency: "monthly" },
  { path: "/docs/guides/verification", priority: 0.6, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
