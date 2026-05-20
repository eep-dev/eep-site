/**
 * Copies pdf.js worker to public/ so CSP stays same-origin (no CDN worker-src).
 * Run from package postinstall / prebuild. Requires pdfjs-dist (via react-pdf).
 */
const fs = require("fs");
const path = require("path");

const pkgDir = path.dirname(require.resolve("pdfjs-dist/package.json"));
const src = path.join(pkgDir, "build", "pdf.worker.min.mjs");
const dest = path.join(__dirname, "..", "public", "pdf.worker.min.mjs");

if (!fs.existsSync(src)) {
    console.warn(`[copy-pdf-worker] skip: missing ${src}`);
    process.exit(0);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(src, dest);
console.error(`[copy-pdf-worker] wrote ${dest} (${fs.statSync(dest).size} bytes)`);
