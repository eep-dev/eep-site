/**
 * If WHITEPAPER.pdf exists in the EEP protocol repo (pdflatex output), copy it
 * to public/docs for Next.js static serving. Otherwise skip (no-op).
 */
const fs = require("fs");
const path = require("path");

const dest = path.join(__dirname, "..", "public", "docs", "WHITEPAPER.pdf");
const candidates = [
    path.join(__dirname, "..", "..", "EEP", "docs", "WHITEPAPER.pdf"),
    path.join(__dirname, "..", "public", "docs", "WHITEPAPER.pdf"),
];

const src = candidates.find((p) => fs.existsSync(p));

if (!src) {
    console.warn(
        `[sync-whitepaper-pdf] skip: no source (tried ${candidates.join(", ")})`,
    );
    process.exit(0);
}

if (path.resolve(src) === path.resolve(dest)) {
    console.error(`[sync-whitepaper-pdf] already at ${dest}`);
    process.exit(0);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(src, dest);
console.error(`[sync-whitepaper-pdf] copied to ${dest} (${fs.statSync(dest).size} bytes)`);
