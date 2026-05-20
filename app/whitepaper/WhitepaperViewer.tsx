"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import type { PDFPageProxy } from "pdfjs-dist";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ChevronLeft, ChevronRight, Download, Printer } from "lucide-react";

export const WHITEPAPER_PDF = "/docs/WHITEPAPER.pdf";

const DEFAULT_PAGE_ASPECT_WH = 8.5 / 11;

export function WhitepaperViewer() {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [renderWidth, setRenderWidth] = useState(600);
    const [pageAspectWH, setPageAspectWH] = useState(DEFAULT_PAGE_ASPECT_WH);
    const viewportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.body.classList.add("whitepaper-page");
        return () => {
            document.body.classList.remove("whitepaper-page");
        };
    }, []);

    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    }, []);

    const recomputeRenderWidth = useCallback(() => {
        const el = viewportRef.current;
        if (!el) return;
        const aw = Math.max(1, el.clientWidth);
        const ah = Math.max(1, el.clientHeight);
        const w = Math.min(aw, ah * pageAspectWH);
        setRenderWidth(Math.max(160, Math.floor(w)));
    }, [pageAspectWH]);

    useLayoutEffect(() => {
        recomputeRenderWidth();
        const el = viewportRef.current;
        if (!el) return;
        const ro = new ResizeObserver(() => {
            queueMicrotask(() => recomputeRenderWidth());
        });
        ro.observe(el);
        window.addEventListener("resize", recomputeRenderWidth, { passive: true });
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", recomputeRenderWidth);
        };
    }, [recomputeRenderWidth]);

    const onPdfPageLoadSuccess = useCallback((pdfPage: PDFPageProxy) => {
        try {
            const vp = pdfPage.getViewport({ scale: 1 });
            if (vp.height > 0) {
                setPageAspectWH(vp.width / vp.height);
            }
        } catch {
            /* keep previous aspect */
        }
    }, []);

    const onLoadSuccess = useCallback(({ numPages: n }: { numPages: number }) => {
        setNumPages(n);
        setLoadError(null);
        setPage(1);
    }, []);

    const onLoadError = useCallback((e: unknown) => {
        console.error("[whitepaper]", e);
        const message = e instanceof Error ? e.message : "Failed to load PDF.";
        setLoadError(message);
    }, []);

    useEffect(() => {
        if (numPages == null) return;
        setPage((p) => Math.min(Math.max(1, p), numPages));
    }, [numPages]);

    const goPrev = useCallback(() => {
        setPage((p) => Math.max(1, p - 1));
    }, []);

    const goNext = useCallback(() => {
        setPage((p) => (numPages ? Math.min(numPages, p + 1) : p));
    }, [numPages]);

    useEffect(() => {
        const onKey = (ev: KeyboardEvent) => {
            if (ev.defaultPrevented) return;
            const t = ev.target as HTMLElement | null;
            if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
                return;
            }
            if (ev.key === "ArrowLeft") {
                ev.preventDefault();
                goPrev();
            } else if (ev.key === "ArrowRight") {
                ev.preventDefault();
                goNext();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [goPrev, goNext]);

    const handlePrint = useCallback(() => {
        const w = window.open(WHITEPAPER_PDF, "_blank", "noopener,noreferrer");
        if (!w) return;
        const printWhenReady = () => {
            try {
                w.focus();
                w.print();
            } catch {
                /* ignore */
            }
        };
        w.addEventListener("load", printWhenReady, { once: true });
        window.setTimeout(printWhenReady, 1200);
    }, []);

    const canGoPrev = numPages != null && page > 1;
    const canGoNext = numPages != null && page < numPages;

    const toolbar = (
        <div className="whitepaper-toolbar" role="toolbar" aria-label="Whitepaper actions">
            <div className="whitepaper-toolbar-nav">
                <button
                    type="button"
                    onClick={goPrev}
                    disabled={!canGoPrev}
                    className="whitepaper-icon-btn"
                    aria-label="Previous page"
                >
                    <ChevronLeft size={20} aria-hidden />
                </button>
                <span className="whitepaper-page-count">
                    {numPages != null ? (
                        <>
                            <span className="whitepaper-page-current">{page}</span>
                            {" / "}
                            {numPages}
                        </>
                    ) : (
                        "— / —"
                    )}
                </span>
                <button
                    type="button"
                    onClick={goNext}
                    disabled={!canGoNext}
                    className="whitepaper-icon-btn"
                    aria-label="Next page"
                >
                    <ChevronRight size={20} aria-hidden />
                </button>
            </div>
            <div className="whitepaper-toolbar-actions">
                <a
                    href={WHITEPAPER_PDF}
                    download="EEP-WHITEPAPER.pdf"
                    className="whitepaper-action-btn"
                >
                    <Download size={16} aria-hidden />
                    Download
                </a>
                <button type="button" onClick={handlePrint} className="whitepaper-action-btn">
                    <Printer size={16} aria-hidden />
                    Print
                </button>
            </div>
        </div>
    );

    if (loadError) {
        return (
            <div className="whitepaper-layout whitepaper-layout--error">
                <div className="whitepaper-inner">
                    {toolbar}
                    <div className="whitepaper-error">
                        <p>
                            Could not load the whitepaper PDF. Build it with{" "}
                            <code>pdflatex WHITEPAPER.tex</code> under{" "}
                            <code>EEP/docs/</code>, then run{" "}
                            <code>npm run prebuild</code> in this site (or copy{" "}
                            <code>WHITEPAPER.pdf</code> to <code>public/docs/</code>).
                        </p>
                        <a href={WHITEPAPER_PDF} className="whitepaper-error-link">
                            Try direct PDF link
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="whitepaper-layout">
            <div className="whitepaper-inner">
                {toolbar}
                <div ref={viewportRef} className="whitepaper-viewport">
                    <Document
                        file={WHITEPAPER_PDF}
                        onLoadSuccess={onLoadSuccess}
                        onLoadError={onLoadError}
                        loading={<p className="whitepaper-loading">Loading PDF…</p>}
                    >
                        {numPages != null ? (
                            <div className="whitepaper-page-frame">
                                <Page
                                    pageNumber={page}
                                    width={renderWidth}
                                    onLoadSuccess={onPdfPageLoadSuccess}
                                    renderTextLayer
                                    renderAnnotationLayer
                                />
                            </div>
                        ) : null}
                    </Document>
                </div>
            </div>
        </div>
    );
}
