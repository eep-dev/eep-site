import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 3600;

export function GET() {
  return NextResponse.json(
    {
      id: "did:web:eep.dev",
      name: "Entity Engagement Protocol",
      type: "Specification",
      version: "0.1",
      status: "stable",
      license: "Apache-2.0",
      repository: "https://github.com/eep-dev/EEP",
      specification: "https://eep.dev/docs/specification",
      schemas: "https://eep.dev/docs/schemas",
      changelog: "https://github.com/eep-dev/EEP/blob/main/CHANGELOG.md",
      governance: "https://github.com/eep-dev/EEP/blob/main/GOVERNANCE.md",
      contact: "hello@eep.dev"
    },
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600"
      }
    }
  );
}
