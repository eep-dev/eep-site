'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { EepTerminalLineContent } from '@/components/EepTerminalLine';
import { RwAgentIcon } from '@/components/TerminalLogIcons';
import { TerminalCompareTable } from '@/components/TerminalCompareTable';
import { getLeftTerminalLineClass, LEFT_LOG } from '@/lib/realworldLeftTerminalLog';
import {
  buildLeftCompareRows,
  buildRightCompareRows,
  COMPARE_BLOCK_LEFT,
  COMPARE_BLOCK_RIGHT,
} from '@/lib/realworldCompareTables';
import {
  getRightTerminalRowClass,
  isRightPlainTerminalLine,
  RIGHT_LOG,
} from '@/lib/realworldRightTerminalLog';
import { stripTerminalLineDisplay } from '@/lib/stripTerminalLineDisplay';

/** Left (HTML + paywall + human checkout + re-parse) stays slower than EEP (JSON gates). */
const TICK_LEFT_MS = 58;
const TICK_RIGHT_MS = 38;

/** Pause on the “Human step” line; animated dots cycle during this window. */
const LEFT_HUMAN_STEP_HOLD_MS = 5000;
const HUMAN_STEP_DOT_INTERVAL_MS = 450;

const LEFT_HUMAN_STEP_LINE_INDEX = LEFT_LOG.findIndex((l) => l.startsWith('Human step'));
const HUMAN_STEP_DOTS = ['.', '..', '...'] as const;

/** Idle preview — same line conventions as the real terminal (abbreviated). */
const IDLE_LEFT_PREVIEW = `►SECTION► · HTML · paywall + checkout + second pass
<!DOCTYPE html>… paywall → manual card → reload → table → JSON
▶ Play — full Scenario A (slower than EEP column)`;

type SimStatus = 'idle' | 'playing' | 'done';

function isHttpWireLine(line: string): boolean {
  return line.startsWith('AGENT') || line.startsWith('← HTTP');
}

function DoneTickIcon() {
  return (
    <svg className="rw-pane-done-svg" viewBox="0 0 24 24" width={20} height={20} aria-hidden>
      <circle className="rw-pane-done-bg" cx="12" cy="12" r="11" />
      <path
        className="rw-pane-done-path"
        d="M10 16.4 6.6 13l1.4-1.4 2 2L16 9.4l1.4 1.4-6.4 6.4-1.4-1.4Z"
      />
    </svg>
  );
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return reduced;
}

export default function RealworldSimulationShowcase() {
  const [status, setStatus] = useState<SimStatus>('idle');
  const [leftVisible, setLeftVisible] = useState(0);
  const [rightVisible, setRightVisible] = useState(0);
  const leftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leftRef = useRef(0);
  const rightRef = useRef(0);
  const leftScrollRef = useRef<HTMLDivElement | null>(null);
  const rightScrollRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [humanStepDotPhase, setHumanStepDotPhase] = useState(0);

  const clearTimers = useCallback(() => {
    if (leftTimerRef.current != null) {
      clearTimeout(leftTimerRef.current);
      leftTimerRef.current = null;
    }
    if (rightTimerRef.current != null) {
      clearTimeout(rightTimerRef.current);
      rightTimerRef.current = null;
    }
  }, []);

  const tryBothComplete = useCallback(() => {
    if (leftRef.current >= LEFT_LOG.length && rightRef.current >= RIGHT_LOG.length) {
      setStatus('done');
    }
  }, []);

  const runSimulation = useCallback(() => {
    clearTimers();
    if (reducedMotion) {
      leftRef.current = LEFT_LOG.length;
      rightRef.current = RIGHT_LOG.length;
      setLeftVisible(LEFT_LOG.length);
      setRightVisible(RIGHT_LOG.length);
      setStatus('done');
      return;
    }
    setStatus('playing');
    setLeftVisible(0);
    setRightVisible(0);
    setHumanStepDotPhase(0);
    leftRef.current = 0;
    rightRef.current = 0;

    const leftTick = () => {
      leftRef.current += 1;
      setLeftVisible(leftRef.current);
      if (leftRef.current < LEFT_LOG.length) {
        const justRevealedHumanStep =
          LEFT_HUMAN_STEP_LINE_INDEX >= 0 &&
          leftRef.current === LEFT_HUMAN_STEP_LINE_INDEX + 1;
        const delay = justRevealedHumanStep ? LEFT_HUMAN_STEP_HOLD_MS : TICK_LEFT_MS;
        leftTimerRef.current = setTimeout(leftTick, delay);
      }
      tryBothComplete();
    };

    const rightTick = () => {
      rightRef.current += 1;
      setRightVisible(rightRef.current);
      if (rightRef.current < RIGHT_LOG.length) {
        rightTimerRef.current = setTimeout(rightTick, TICK_RIGHT_MS);
      }
      tryBothComplete();
    };

    leftTick();
    rightTick();
  }, [clearTimers, reducedMotion, tryBothComplete]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const leftShown = LEFT_LOG.slice(0, Math.min(leftVisible, LEFT_LOG.length));
  const rightShown = RIGHT_LOG.slice(0, Math.min(rightVisible, RIGHT_LOG.length));
  const isPlaying = status === 'playing';
  const isDone = status === 'done';
  const showStaticPreview = status === 'idle' && leftVisible === 0 && rightVisible === 0;

  /** Cycling . / .. / … on the Human step line while the 5s hold is active. */
  useEffect(() => {
    if (!isPlaying) {
      setHumanStepDotPhase(0);
      return;
    }
    if (LEFT_HUMAN_STEP_LINE_INDEX < 0) return;
    const holdingHumanStep =
      leftVisible === LEFT_HUMAN_STEP_LINE_INDEX + 1 && leftVisible < LEFT_LOG.length;
    if (!holdingHumanStep) {
      setHumanStepDotPhase(0);
      return;
    }
    const id = window.setInterval(() => {
      setHumanStepDotPhase((p) => (p + 1) % HUMAN_STEP_DOTS.length);
    }, HUMAN_STEP_DOT_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isPlaying, leftVisible]);

  /** Pin scroll to bottom so new lines behave like a sliding terminal viewport. */
  useEffect(() => {
    if (showStaticPreview) return;
    const el = leftScrollRef.current;
    if (!el) return;
    const t = window.setTimeout(() => {
      el.scrollTop = el.scrollHeight;
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }, 0);
    return () => clearTimeout(t);
  }, [leftVisible, showStaticPreview, status, humanStepDotPhase]);

  useEffect(() => {
    if (showStaticPreview) return;
    const el = rightScrollRef.current;
    if (!el) return;
    const t = window.setTimeout(() => {
      el.scrollTop = el.scrollHeight;
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }, 0);
    return () => clearTimeout(t);
  }, [rightVisible, showStaticPreview, status]);
  const leftCursorOn = isPlaying && leftVisible < LEFT_LOG.length;
  const rightCursorOn = isPlaying && rightVisible < RIGHT_LOG.length;

  const rightStreamDone = !showStaticPreview && rightVisible >= RIGHT_LOG.length;
  const leftStreamDone = !showStaticPreview && leftVisible >= LEFT_LOG.length;

  return (
    <section className="section rw-sim-section">
      <div className="container">
        <ScrollReveal variant="up">
          <div className="rw-sim-header">
            <span className="rw-sim-badge">Runnable in the repo</span>
            <h2 className="section-h2 rw-sim-title">Same publisher. Two agent paths.</h2>
            <p className="section-p rw-sim-lead">
              The <strong>realworld simulation</strong> runs side-by-side in your terminal: a bloated Next.js page
              scraped with Playwright versus the same data behind{' '}
              <code className="code-inline">@eep-dev/gates</code> — manifest,{' '}
              <code className="code-inline">402</code>, proofs, then raw JSON. Deterministic. No LLM calls. Like the
              repo, the <strong>HTML path stays busy</strong> (viewports, gates, Playwright, exports) while the{' '}
              <strong>EEP path finishes in seconds</strong>.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="up" delay={70}>
          <div className="rw-sim-stage">
            <div className={`rw-sim-grid ${isPlaying ? 'rw-sim-grid--running' : ''}`}>
              {/* Legacy HTML path */}
              <div className="rw-sim-col">
                <article
                  className={`rw-pane rw-pane-html ${isPlaying || isDone ? 'rw-pane--lit' : ''}`}
                  aria-label="Legacy HTML path"
                >
                  <header className="rw-pane-top">
                    <div className="rw-pane-traffic" aria-hidden="true">
                      <span className="rw-pane-dot" />
                      <span className="rw-pane-dot" />
                      <span className="rw-pane-dot" />
                    </div>
                    <div className="rw-pane-titlebar">Scenario A — current web</div>
                    <div className="rw-pane-top-end">
                      {leftStreamDone && (
                        <span className="rw-pane-done" title="Scenario A stream complete" aria-label="Complete">
                          <DoneTickIcon />
                        </span>
                      )}
                    </div>
                  </header>
                  <div className="rw-pane-body">
                    <div ref={leftScrollRef} className="rw-sim-terminal">
                      {showStaticPreview ? (
                        <pre className="rw-idle-terminal" aria-hidden="true">
                          {IDLE_LEFT_PREVIEW}
                        </pre>
                      ) : (
                        <>
                          {leftShown.map((line, i) => {
                            if (line === COMPARE_BLOCK_LEFT) {
                              return (
                                <div
                                  key={`l-${i}-compare`}
                                  className={getLeftTerminalLineClass(line)}
                                >
                                  <TerminalCompareTable caption="Compare" rows={buildLeftCompareRows()} />
                                </div>
                              );
                            }
                            const baseText = stripTerminalLineDisplay(line);
                            const showHumanDots =
                              LEFT_HUMAN_STEP_LINE_INDEX >= 0 &&
                              i === LEFT_HUMAN_STEP_LINE_INDEX &&
                              leftVisible === LEFT_HUMAN_STEP_LINE_INDEX + 1;
                            const plainText = showHumanDots
                              ? `${baseText}${HUMAN_STEP_DOTS[humanStepDotPhase]}`
                              : baseText;
                            return (
                              <div
                                key={`l-${i}-${line.slice(0, 48)}`}
                                className={getLeftTerminalLineClass(line)}
                              >
                                {isHttpWireLine(line) ? (
                                  <EepTerminalLineContent line={line} />
                                ) : (
                                  plainText
                                )}
                              </div>
                            );
                          })}
                          {leftCursorOn && (
                            <span className="rw-cursor" aria-hidden="true">
                              ▍
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </article>
                <div className="rw-pane-caption">
                  {showStaticPreview ? (
                    <>
                      Fetch HTML → login &amp; paywall narrative → <strong>Playwright</strong> extracts{' '}
                      <code className="code-inline">#report-data</code>.
                    </>
                  ) : (
                    <>
                      End state: scraped <code className="code-inline">#report-data</code> — high bytes, simulated human
                      steps.
                    </>
                  )}
                </div>
              </div>

              <div className="rw-sim-divider rw-sim-divider-col">
                <button
                  type="button"
                  className={`rw-sim-play ${isPlaying ? 'rw-sim-play--busy' : ''}`}
                  onClick={() => {
                    if (isPlaying) return;
                    runSimulation();
                  }}
                  disabled={isPlaying}
                  aria-label={
                    isPlaying ? 'Running simulation' : isDone ? 'Replay simulation' : 'Play side-by-side simulation'
                  }
                >
                  {isPlaying ? (
                    <span className="rw-sim-play-spinner" aria-hidden />
                  ) : isDone ? (
                    <span className="rw-sim-play-replay" aria-hidden>
                      ↺
                    </span>
                  ) : (
                    <svg className="rw-sim-play-svg" viewBox="0 0 24 24" aria-hidden>
                      <path
                        fill="currentColor"
                        d="M9.2 6.3c-.4-.23-.9-.06-1.06.37-.06.15-.09.32-.09.5v10.66c0 .62.67 1 1.2.68l8.26-5.33a.8.8 0 0 0 0-1.36L9.25 6.32Z"
                      />
                    </svg>
                  )}
                </button>
                <span className="rw-sim-vs">vs</span>
              </div>

              {/* EEP path */}
              <div className="rw-sim-col">
                <article
                  className={`rw-pane rw-pane-eep ${isPlaying || isDone ? 'rw-pane--lit' : ''}`}
                  aria-label="EEP protocol path"
                >
                  <header className="rw-pane-top">
                    <div className="rw-pane-traffic" aria-hidden="true">
                      <span className="rw-pane-dot" />
                      <span className="rw-pane-dot" />
                      <span className="rw-pane-dot" />
                    </div>
                    <div className="rw-pane-titlebar">Scenario B — gates + JSON</div>
                    <div className="rw-pane-top-end">
                      {rightStreamDone && (
                        <span className="rw-pane-done" title="Scenario B stream complete" aria-label="Complete">
                          <DoneTickIcon />
                        </span>
                      )}
                    </div>
                  </header>
                  <div className="rw-pane-body">
                    <div
                      ref={rightScrollRef}
                      className={
                        showStaticPreview ? 'rw-sim-terminal' : 'rw-sim-terminal rw-sim-terminal-eep'
                      }
                    >
                      {showStaticPreview ? (
                        <div className="rw-idle-terminal rw-idle-stack" aria-hidden="true">
                          <div>►SECTION► · Manifest · 402</div>
                          <div className="rw-idle-wire">
                            <span className="rw-log-glyph rw-log-glyph--agent" title="Agent — outbound request">
                              <RwAgentIcon className="rw-log-icon-svg" />
                            </span>
                            <span>GET …/.well-known/eep.json</span>
                          </div>
                          <div>▶ Play — manifest → 402 → proofs → JSON (repo parity)</div>
                        </div>
                      ) : (
                        <>
                          {rightShown.map((line, i) => {
                            if (line === COMPARE_BLOCK_RIGHT) {
                              return (
                                <div
                                  key={`r-${i}-compare`}
                                  className={getRightTerminalRowClass(line)}
                                >
                                  <TerminalCompareTable caption="Compare" rows={buildRightCompareRows()} />
                                </div>
                              );
                            }
                            return (
                              <div
                                key={`r-${i}-${line.slice(0, 40)}`}
                                className={getRightTerminalRowClass(line)}
                              >
                                {isRightPlainTerminalLine(line) ? (
                                  stripTerminalLineDisplay(line)
                                ) : (
                                  <EepTerminalLineContent line={line} />
                                )}
                              </div>
                            );
                          })}
                          {rightCursorOn && (
                            <span className="rw-cursor rw-cursor-eep" aria-hidden="true">
                              ▍
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </article>
                <div className="rw-pane-caption">
                  {showStaticPreview ? (
                    <>
                      <code className="code-inline">GET /.well-known/eep.json</code> → negotiate{' '}
                      <code className="code-inline">402</code> → sign agreement → payment proof →{' '}
                      <strong>structured receipt</strong>.
                    </>
                  ) : (
                    <>
                      End state: gate-verified <strong>JSON</strong> — no HTML parse, no simulated checkout in the agent
                      path.
                    </>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`rw-sim-metrics ${isDone ? 'rw-sim-metrics--in' : ''}`}
              role="group"
              aria-label="Comparison highlights"
            >
              <div className="rw-metric">
                <span className="rw-metric-k">Bytes on the wire</span>
                <span className="rw-metric-v">
                  <span className="rw-metric-bad">HTML + assets</span>
                  <span className="rw-metric-sep">→</span>
                  <span className="rw-metric-good">JSON payloads</span>
                </span>
              </div>
              <div className="rw-metric">
                <span className="rw-metric-k">Human in the loop</span>
                <span className="rw-metric-v">
                  <span className="rw-metric-bad">Simulated steps</span>
                  <span className="rw-metric-sep">→</span>
                  <span className="rw-metric-good">Machine proofs</span>
                </span>
              </div>
              <div className="rw-metric">
                <span className="rw-metric-k">Outcome</span>
                <span className="rw-metric-v">
                  <span className="rw-metric-bad">Scraped DOM + hidden JSON</span>
                  <span className="rw-metric-sep">→</span>
                  <span className="rw-metric-good">Gate-verified resource</span>
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="up" delay={110}>
          <div className="rw-sim-cta">
            <a
              href="https://github.com/eep-dev/EEP/blob/main/docs/guides/realworld-simulation.md"
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the walkthrough ↗
            </a>
            <a
              href="https://github.com/eep-dev/EEP/tree/main/realworld-simulation"
              className="btn btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source: realworld-simulation/ ↗
            </a>
            <Link href="/docs/guides/adoption" className="btn btn-ghost">
              Adoption paths →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
