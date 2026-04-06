import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../context/ThemeContext";
import "./ArticleModal.scss";
import { mapSteps, filterSteps, findSteps, spreadSteps, destructureSteps, functionSteps, variablesSteps, conditionalSteps, imperativeSteps, eventSteps, listRenderSteps, conditionalRenderSteps, propsSteps, stateSteps, useEffectSteps, keysSteps, nestingSteps, mixinSteps, partialsSteps, semanticSteps, contrastSteps, focusSteps, nosweatArchSteps, tenantFlowSteps, paymentFlowSteps } from "../data/diagramSteps";

gsap.registerPlugin(ScrollTrigger);

/* ===== CODE BLOCK HELPERS ===== */

const CODE_START = /^(?:\/\/|const |let |var |function |import |export |return |if \(|else |class |type |interface |enum |\|  |<[a-zA-Z\/!]|\{|\}|@mixin|@include|@use|@media|@keyframes|\$[\w-]+:|\.[\w-]+\s*\{|&[:\-]|:[a-z][\w-]*\s*\{|document\.|fetch\(|btn\.|window\.|ul\.|Bad:|Good:|- Use|styles\/)/;

const CODE_LINE = /^(?:\/\/|const |let |var |function |import |export |return |if \(|else |class |type |interface |enum |\|  |<[a-zA-Z\/!]|\{|\}|@mixin|@include|@use|@media|@keyframes|\$[\w-]+[:\s]|\.[\w-]+\s*\{|&[:\-]|:[a-z][\w-]*\s*\{|document\.|fetch\(|btn\.|window\.|ul\.|[\w-]+\s*:\s*.+;|[\w-]+\s*\{|[*]\s*[,{]|<\/?\w+|aria-[\w-]+(?:=)|outline|display|padding|margin|border|background|font-|color:|width|height|position|inset|align-|justify-|flex|grid|gap|transition|animation|overflow|opacity|transform|text-|letter-|line-|max-|min-|cursor|pointer|z-index)/;

function isCodeBlock(text) {
  const trimmed = text.trim();
  const lines = trimmed.split("\n");
  // Single-line: must look entirely like code (HTML tag, or selector/property with braces/semicolons)
  if (lines.length === 1) {
    return /^<[\w/].*>$/.test(trimmed) || (/^[.#@$:&{}\[\]*]/.test(trimmed) && /[{};]$/.test(trimmed));
  }
  // Multi-line: count lines that look like code (including indented lines which are continuation)
  const codeLines = lines.filter((l) => {
    const t = l.trim();
    if (t === "") return true; // blank lines inside code blocks
    if (/^\s{2,}/.test(l)) return true; // indented continuation
    return CODE_LINE.test(t);
  });
  // Need a solid proportion of code-like lines AND at least one definite code-start line
  const definiteCodeLines = lines.filter((l) => CODE_LINE.test(l.trim()));
  return definiteCodeLines.length >= 1 && codeLines.length >= lines.length * 0.5;
}

function highlightSyntax(code) {
  const lines = code.split("\n");
  return lines.map((line, i) => {
    const tokens = [];
    let remaining = line;

    // Comment lines
    if (/^\s*\/\//.test(remaining)) {
      return <div key={i} className="am-code-line"><span className="am-syn-comment">{line}</span></div>;
    }

    // Tokenise
    const parts = [];
    const regex = /(\b(?:const|let|var|function|return|import|export|if|else|from|new|true|false|null|undefined|default|async|await|type|interface|enum|extends|implements|readonly|keyof|typeof|as|is|infer|class|abstract|private|public|protected|static)\b|\b(?:string|number|boolean|any|void|never|unknown|object|bigint)\b(?!\s*[.(])|"[^"]*"|'[^']*'|`[^`]*`|\b\d+(?:\.\d+)?(?:px|%|em|rem|vh|vw|ms|s)?\b|\/\/.*$|\{|\}|\(|\)|=>|&&|\|\||<|>|\|(?!\|)|@mixin|@include|@use|@media|@content|@keyframes|\$[\w-]+|--[\w-]+|var\(|rgba?\(|#[\da-fA-F]{3,8}\b|&[:\w-]*|\.[\w-]+(?=\s*\{)|:[a-z][\w-]*(?=\s*\{)|<\/?[\w-]+|aria-[\w-]+(?:="[^"]*")?|\b(?:display|padding|margin|border|border-radius|background|font-size|font-family|font-weight|color|width|height|max-width|min-width|position|inset|top|right|bottom|left|align-items|justify-content|flex|grid|gap|transition|animation|animation-duration|transition-duration|overflow|opacity|transform|text-align|text-transform|letter-spacing|line-height|cursor|pointer-events|z-index|outline|outline-offset|overscroll-behavior|white-space|box-sizing|content|vertical-align)(?=\s*:))/g;

    let lastIndex = 0;
    let match;
    while ((match = regex.exec(remaining)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "plain", value: remaining.slice(lastIndex, match.index) });
      }
      const val = match[0];
      let type = "plain";
      if (/^(?:const|let|var|function|return|import|export|if|else|from|new|default|async|await|type|interface|enum|extends|implements|readonly|keyof|typeof|as|is|infer|class|abstract|private|public|protected|static)$/.test(val)) {
        type = "keyword";
      } else if (/^(?:string|number|boolean|any|void|never|unknown|object|bigint)$/.test(val)) {
        type = "type";
      } else if (/^(?:true|false|null|undefined)$/.test(val)) {
        type = "literal";
      } else if (/^["'`]/.test(val)) {
        type = "string";
      } else if (/^\d/.test(val) || /^#[\da-fA-F]/.test(val)) {
        type = "number";
      } else if (/^\/\//.test(val)) {
        type = "comment";
      } else if (/^[@]/.test(val)) {
        type = "keyword";
      } else if (/^\$/.test(val)) {
        type = "variable";
      } else if (/^--/.test(val)) {
        type = "variable";
      } else if (/^(?:var|rgba?)\($/.test(val)) {
        type = "function";
      } else if (/^:[a-z]/.test(val)) {
        type = "selector";
      } else if (/^(?:display|padding|margin|border|border-radius|background|font-size|font-family|font-weight|color|width|height|max-width|min-width|position|inset|top|right|bottom|left|align-items|justify-content|flex|grid|gap|transition|animation|animation-duration|transition-duration|overflow|opacity|transform|text-align|text-transform|letter-spacing|line-height|cursor|pointer-events|z-index|outline|outline-offset|overscroll-behavior|white-space|box-sizing|content|vertical-align)$/.test(val)) {
        type = "property";
      } else if (/^&/.test(val)) {
        type = "selector";
      } else if (/^\.[\w-]+$/.test(val)) {
        type = "selector";
      } else if (/^<\/?[\w-]+$/.test(val)) {
        type = "tag";
      } else if (/^aria-/.test(val)) {
        type = "attribute";
      } else if (/^[{}()=>]/.test(val) || val === "&&" || val === "||") {
        type = "punctuation";
      }
      parts.push({ type, value: val });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < remaining.length) {
      parts.push({ type: "plain", value: remaining.slice(lastIndex) });
    }

    return (
      <div key={i} className="am-code-line">
        {parts.map((p, k) => (
          <span key={k} className={p.type !== "plain" ? `am-syn-${p.type}` : undefined}>{p.value}</span>
        ))}
      </div>
    );
  });
}

function CodeToggle({ js, ts, id }) {
  const [showTs, setShowTs] = useState(false);
  const code = showTs ? ts : js;

  return (
    <div className={`am-code-block am-code-toggle ${showTs ? "am-code-toggle-ts" : ""}`}>
      <button
        className="am-code-toggle-btn"
        onClick={() => setShowTs(!showTs)}
        aria-label={showTs ? "Show JavaScript" : "Show TypeScript"}
        title={showTs ? "Switch to JavaScript" : "Switch to TypeScript"}
      >
        {showTs ? (
          <span className="am-code-toggle-label am-code-toggle-label-ts">TS</span>
        ) : (
          <span className="am-code-toggle-label am-code-toggle-label-js">JS</span>
        )}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      </button>
      <pre><code>{highlightSyntax(code)}</code></pre>
    </div>
  );
}

function InteractiveDiagram({ diagram: Diagram, steps }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const { isReduced } = useTheme();

  useEffect(() => {
    if (!isOpen || !contentRef.current || isReduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current, { height: 0, opacity: 0 }, {
        height: "auto", opacity: 1, duration: 0.4, ease: "power2.out",
      });
    }, contentRef);
    return () => ctx.revert();
  }, [isOpen, isReduced]);

  const handleToggle = () => {
    if (isOpen && contentRef.current && !isReduced) {
      gsap.to(contentRef.current, {
        height: 0, opacity: 0, duration: 0.3, ease: "power2.in",
        onComplete: () => setIsOpen(false),
      });
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`am-interactive ${isOpen ? "am-interactive-open" : ""}`}>
      <button className="am-interactive-btn" onClick={handleToggle} aria-label={isOpen ? "Hide diagram" : "Show diagram"}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="11" />
          <circle cx="12" cy="8" r="0.5" fill="currentColor" />
        </svg>
        <span>{isOpen ? "Hide visual" : "See it visually"}</span>
      </button>
      {isOpen && (
        <div className="am-interactive-content" ref={contentRef} style={isReduced ? undefined : { height: 0, opacity: 0 }}>
          {steps ? (
            <StepDiagram steps={steps} playing={isOpen} isReduced={isReduced}>{Diagram}</StepDiagram>
          ) : Diagram}
        </div>
      )}
    </div>
  );
}

const ALL_STAGES = [".idg-title", ".idg-input", ".idg-arrow", ".idg-process", ".idg-output", ".idg-note"];
const ALL_SELECTOR = ALL_STAGES.concat("[data-step]").join(", ");

function StepDiagram({ steps, playing, isReduced, children }) {
  const [step, setStep] = useState(0);
  const ref = useRef(null);
  const pulseRef = useRef([]);

  const total = steps.length;
  const current = steps[step];

  useEffect(() => { if (playing) setStep(0); }, [playing]);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    pulseRef.current.forEach((tw) => tw.kill());
    pulseRef.current = [];

    const allEls = el.querySelectorAll(ALL_SELECTOR);
    const visSel = current.show.join(", ");
    const hlSel = current.highlight ? current.highlight.join(", ") : null;

    if (isReduced) {
      allEls.forEach((n) => { n.style.opacity = visSel && n.matches(visSel) ? "1" : "0"; n.style.filter = "none"; });
      return;
    }

    const ctx = gsap.context(() => {
      allEls.forEach((n) => {
        const vis = visSel && n.matches(visSel);
        gsap.to(n, { opacity: vis ? 1 : 0, duration: vis ? 0.4 : 0.25, ease: vis ? "power2.out" : "power2.in" });
        gsap.set(n, { filter: "none" });
      });
      if (hlSel) {
        el.querySelectorAll(hlSel).forEach((n) => {
          pulseRef.current.push(gsap.to(n, { filter: "drop-shadow(0 0 8px var(--color-accent))", duration: 0.8, repeat: -1, yoyo: true, ease: "sine.inOut" }));
        });
      }
    }, ref);
    return () => ctx.revert();
  }, [step, isReduced, current]);

  useEffect(() => {
    if (!playing) return;
    const h = (e) => {
      if (e.key === "ArrowRight" && step < total - 1) setStep(step + 1);
      if (e.key === "ArrowLeft" && step > 0) setStep(step - 1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [playing, step, total]);

  return (
    <div ref={ref} className="idg-stepper">
      <div className="idg-svg-wrap">{children}</div>
      {current.text && <p className="idg-annotation" key={step}>{current.text}</p>}
      <div className="idg-controls">
        <button className="idg-controls-btn" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} aria-label="Previous step">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <span className="idg-step-indicator">{step + 1} / {total}</span>
        <button className="idg-controls-btn" onClick={() => setStep(Math.min(total - 1, step + 1))} disabled={step === total - 1} aria-label="Next step">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
        {step === total - 1 && (
          <button className="idg-controls-btn idg-replay-btn" onClick={() => setStep(0)} aria-label="Replay">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" /></svg>
          </button>
        )}
      </div>
    </div>
  );
}

function parseLinks(text) {
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(<a key={match.index} href={match[2]} target="_blank" rel="noopener" className="am-inline-link">{match[1]}</a>);
    lastIndex = linkRegex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length > 1 ? parts : text;
}

function renderBody(body, codeToggles, interactives) {
  const blocks = body.split("\n\n");
  const result = [];
  let i = 0;

  while (i < blocks.length) {
    // Check for interactive placeholder
    const interactiveMatch = blocks[i].match(/^\{\{interactive:(\d+)\}\}$/);
    if (interactiveMatch && interactives) {
      const idx = parseInt(interactiveMatch[1], 10);
      const entry = interactives[idx];
      if (entry) {
        const isDef = entry && typeof entry === "object" && entry.diagram;
        result.push(<InteractiveDiagram key={`interactive-${i}`} diagram={isDef ? entry.diagram : entry} steps={isDef ? entry.steps : undefined} />);
      }
      i++;
    // Check for toggle placeholder
    } else if (blocks[i].match(/^\{\{toggle:(\d+)\}\}$/) && codeToggles) {
      const toggleMatch = blocks[i].match(/^\{\{toggle:(\d+)\}\}$/);
      const idx = parseInt(toggleMatch[1], 10);
      const toggle = codeToggles[idx];
      if (toggle) {
        result.push(<CodeToggle key={`toggle-${i}`} js={toggle.js} ts={toggle.ts} id={idx} />);
      }
      i++;
    } else if (isCodeBlock(blocks[i])) {
      // Collect consecutive code blocks
      let codeLines = [];
      while (i < blocks.length && isCodeBlock(blocks[i])) {
        if (codeLines.length > 0) codeLines.push("");
        codeLines.push(blocks[i]);
        i++;
      }
      const code = codeLines.join("\n");
      result.push(
        <div key={`code-${i}`} className="am-code-block">
          <pre><code>{highlightSyntax(code)}</code></pre>
        </div>
      );
    } else {
      result.push(
        <p key={`p-${i}`} className="am-section-paragraph">{parseLinks(blocks[i])}</p>
      );
      i++;
    }
  }
  return result;
}

/* ===== ANIMATED ILLUSTRATIONS ===== */

function OutcomeIllustration() {
  const svgRef = useRef(null);
  const { isReduced } = useTheme();

  useEffect(() => {
    if (isReduced || !svgRef.current) return;
    const ctx = gsap.context(() => {
      // Animate the outcome rings expanding
      gsap.fromTo(".ood-ring", { scale: 0, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.5)", stagger: 0.15, delay: 0.3,
      });
      // Pulse the center dot
      gsap.to(".ood-center", {
        scale: 1.3, opacity: 0.6, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut",
      });
      // Draw the connecting lines
      gsap.fromTo(".ood-spoke", { strokeDashoffset: 100 }, {
        strokeDashoffset: 0, duration: 0.8, stagger: 0.1, delay: 0.6, ease: "power2.out",
      });
      // Float the metric labels
      gsap.fromTo(".ood-label", { opacity: 0, y: 10 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.12, delay: 1.0, ease: "power2.out",
      });
    }, svgRef);
    return () => ctx.revert();
  }, [isReduced]);

  return (
    <svg ref={svgRef} className="article-illustration" viewBox="0 0 400 280" fill="none">
      {/* Concentric outcome rings */}
      <circle className="ood-ring" cx="200" cy="140" r="120" stroke="var(--color-accent-border)" strokeWidth="1" fill="none" style={{ transformOrigin: "200px 140px" }} />
      <circle className="ood-ring" cx="200" cy="140" r="85" stroke="var(--color-accent-border)" strokeWidth="1" fill="none" style={{ transformOrigin: "200px 140px" }} />
      <circle className="ood-ring" cx="200" cy="140" r="50" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" style={{ transformOrigin: "200px 140px" }} />
      {/* Center point - the outcome */}
      <circle className="ood-center" cx="200" cy="140" r="6" fill="var(--color-accent)" style={{ transformOrigin: "200px 140px" }} />
      {/* Spokes connecting to metrics */}
      <line className="ood-spoke" x1="200" y1="140" x2="120" y2="60" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="100" opacity="0.4" />
      <line className="ood-spoke" x1="200" y1="140" x2="300" y2="55" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="100" opacity="0.4" />
      <line className="ood-spoke" x1="200" y1="140" x2="320" y2="200" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="100" opacity="0.4" />
      <line className="ood-spoke" x1="200" y1="140" x2="100" y2="210" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="100" opacity="0.4" />
      {/* Metric labels at spoke endpoints */}
      <text className="ood-label" x="120" y="50" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">RETENTION</text>
      <text className="ood-label" x="300" y="45" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">ACTIVATION</text>
      <text className="ood-label" x="330" y="220" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">CONVERSION</text>
      <text className="ood-label" x="85" y="230" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">SATISFACTION</text>
      {/* Small dots at endpoints */}
      <circle className="ood-label" cx="120" cy="60" r="3" fill="var(--color-accent)" opacity="0.6" />
      <circle className="ood-label" cx="300" cy="55" r="3" fill="var(--color-accent)" opacity="0.6" />
      <circle className="ood-label" cx="320" cy="200" r="3" fill="var(--color-accent)" opacity="0.6" />
      <circle className="ood-label" cx="100" cy="210" r="3" fill="var(--color-accent)" opacity="0.6" />
    </svg>
  );
}

function SpecIllustration() {
  const svgRef = useRef(null);
  const { isReduced } = useTheme();

  useEffect(() => {
    if (isReduced || !svgRef.current) return;
    const ctx = gsap.context(() => {
      // Draw the spec document outline
      gsap.fromTo(".sdd-doc", { strokeDashoffset: 600 }, {
        strokeDashoffset: 0, duration: 1.2, ease: "power2.out", delay: 0.2,
      });
      // Spec lines appear
      gsap.fromTo(".sdd-line", { scaleX: 0, opacity: 0 }, {
        scaleX: 1, opacity: 1, duration: 0.4, stagger: 0.08, delay: 0.6, ease: "power2.out",
      });
      // Arrow pulses from spec to code
      gsap.fromTo(".sdd-arrow", { opacity: 0, x: -10 }, {
        opacity: 1, x: 0, duration: 0.5, delay: 1.2, ease: "power2.out",
      });
      gsap.to(".sdd-arrow-pulse", {
        x: 20, opacity: 0, duration: 1.2, repeat: -1, ease: "power1.out", delay: 1.5,
      });
      // Code block appears
      gsap.fromTo(".sdd-code", { opacity: 0, x: 20 }, {
        opacity: 1, x: 0, duration: 0.6, stagger: 0.06, delay: 1.4, ease: "power2.out",
      });
    }, svgRef);
    return () => ctx.revert();
  }, [isReduced]);

  return (
    <svg ref={svgRef} className="article-illustration" viewBox="0 0 400 280" fill="none">
      {/* Spec document */}
      <rect className="sdd-doc" x="30" y="30" width="140" height="200" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="600" fill="none" />
      <text x="60" y="55" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">SPEC.MD</text>
      {/* Spec content lines */}
      <rect className="sdd-line" x="50" y="75" width="100" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.4" style={{ transformOrigin: "50px 76px" }} />
      <rect className="sdd-line" x="50" y="90" width="80" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.3" style={{ transformOrigin: "50px 91px" }} />
      <rect className="sdd-line" x="50" y="105" width="95" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.4" style={{ transformOrigin: "50px 106px" }} />
      <rect className="sdd-line" x="50" y="120" width="70" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.3" style={{ transformOrigin: "50px 121px" }} />
      <rect className="sdd-line" x="50" y="145" width="90" height="2" rx="1" fill="var(--color-accent-border)" opacity="0.6" style={{ transformOrigin: "50px 146px" }} />
      <rect className="sdd-line" x="50" y="160" width="60" height="2" rx="1" fill="var(--color-accent-border)" opacity="0.4" style={{ transformOrigin: "50px 161px" }} />
      <rect className="sdd-line" x="50" y="175" width="85" height="2" rx="1" fill="var(--color-accent-border)" opacity="0.6" style={{ transformOrigin: "50px 176px" }} />
      <rect className="sdd-line" x="50" y="190" width="50" height="2" rx="1" fill="var(--color-accent-border)" opacity="0.4" style={{ transformOrigin: "50px 191px" }} />
      {/* Arrow: spec -> code */}
      <g className="sdd-arrow">
        <line x1="190" y1="130" x2="220" y2="130" stroke="var(--color-accent)" strokeWidth="1.5" />
        <polygon points="220,125 230,130 220,135" fill="var(--color-accent)" />
      </g>
      <circle className="sdd-arrow-pulse" cx="210" cy="130" r="3" fill="var(--color-accent)" opacity="0.5" />
      {/* AI label */}
      <text className="sdd-arrow" x="210" y="118" textAnchor="middle" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="1.5">AI</text>
      {/* Code output */}
      <rect className="sdd-code" x="240" y="30" width="140" height="200" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="none" />
      <text className="sdd-code" x="264" y="55" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">output.tsx</text>
      <text className="sdd-code" x="258" y="80" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)" opacity="0.7">{"const"}</text>
      <text className="sdd-code" x="290" y="80" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">App = () =&gt;</text>
      <rect className="sdd-code" x="258" y="95" width="80" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.3" />
      <rect className="sdd-code" x="268" y="110" width="60" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.25" />
      <rect className="sdd-code" x="268" y="125" width="70" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.3" />
      <rect className="sdd-code" x="258" y="140" width="50" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.25" />
      <text className="sdd-code" x="258" y="165" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)" opacity="0.7">{"export"}</text>
      <rect className="sdd-code" x="258" y="180" width="90" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.3" />
      <rect className="sdd-code" x="258" y="195" width="65" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.25" />
    </svg>
  );
}

function PipelineIllustration() {
  const svgRef = useRef(null);
  const { isReduced } = useTheme();

  useEffect(() => {
    if (isReduced || !svgRef.current) return;
    const ctx = gsap.context(() => {
      // Draw the three stage boxes
      gsap.fromTo(".pip-box", { strokeDashoffset: 400, opacity: 0 }, {
        strokeDashoffset: 0, opacity: 1, duration: 0.8, stagger: 0.25, delay: 0.2, ease: "power2.out",
      });
      // Labels appear
      gsap.fromTo(".pip-label", { opacity: 0, y: 8 }, {
        opacity: 1, y: 0, duration: 0.4, stagger: 0.25, delay: 0.5, ease: "power2.out",
      });
      // Draw connecting arrows
      gsap.fromTo(".pip-arrow", { strokeDashoffset: 60, opacity: 0 }, {
        strokeDashoffset: 0, opacity: 1, duration: 0.5, stagger: 0.2, delay: 1.0, ease: "power2.out",
      });
      // Pulse the sync indicators
      gsap.fromTo(".pip-sync", { scale: 0, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.3, stagger: 0.15, delay: 1.5, ease: "back.out(2)",
      });
      gsap.to(".pip-sync", {
        scale: 1.3, opacity: 0.5, duration: 1.2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2.0,
      });
    }, svgRef);
    return () => ctx.revert();
  }, [isReduced]);

  return (
    <svg ref={svgRef} className="article-illustration" viewBox="0 0 400 280" fill="none">
      {/* Figma stage */}
      <rect className="pip-box" x="20" y="80" width="100" height="120" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="400" fill="none" style={{ transformOrigin: "70px 140px" }} />
      <text className="pip-label" x="70" y="110" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">FIGMA</text>
      <text className="pip-label" x="70" y="135" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">Tokens</text>
      <text className="pip-label" x="70" y="150" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">Wireframes</text>
      <text className="pip-label" x="70" y="165" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">Components</text>
      {/* Arrow 1 */}
      <line className="pip-arrow" x1="130" y1="140" x2="148" y2="140" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="60" />
      <polygon className="pip-arrow" points="148,135 158,140 148,145" fill="var(--color-accent)" opacity="0.8" />
      {/* Storybook stage */}
      <rect className="pip-box" x="160" y="80" width="100" height="120" rx="4" stroke="var(--color-accent-border)" strokeWidth="1.5" strokeDasharray="400" fill="none" style={{ transformOrigin: "210px 140px" }} />
      <text className="pip-label" x="210" y="110" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">STORYBOOK</text>
      <text className="pip-label" x="210" y="135" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">Documentation</text>
      <text className="pip-label" x="210" y="150" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">Isolation</text>
      <text className="pip-label" x="210" y="165" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">Testing</text>
      {/* Arrow 2 */}
      <line className="pip-arrow" x1="270" y1="140" x2="288" y2="140" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="60" />
      <polygon className="pip-arrow" points="288,135 298,140 288,145" fill="var(--color-accent)" opacity="0.8" />
      {/* Production stage */}
      <rect className="pip-box" x="300" y="80" width="100" height="120" rx="4" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="400" fill="none" style={{ transformOrigin: "350px 140px" }} />
      <text className="pip-label" x="350" y="110" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">PRODUCTION</text>
      <text className="pip-label" x="350" y="135" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">React + SCSS</text>
      <text className="pip-label" x="350" y="150" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">CI/CD</text>
      <text className="pip-label" x="350" y="165" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">GitHub Pages</text>
      {/* Sync indicators */}
      <circle className="pip-sync" cx="145" cy="140" r="4" fill="var(--color-accent)" style={{ transformOrigin: "145px 140px" }} />
      <circle className="pip-sync" cx="285" cy="140" r="4" fill="var(--color-accent)" style={{ transformOrigin: "285px 140px" }} />
      {/* Token flow line underneath */}
      <path className="pip-arrow" d="M70 210 Q210 240 350 210" stroke="var(--color-accent-border)" strokeWidth="1" strokeDasharray="60" fill="none" />
      <text className="pip-label" x="210" y="255" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="2">SHARED DESIGN TOKENS</text>
    </svg>
  );
}

function SplitBrainIllustration() {
  const svgRef = useRef(null);
  const { isReduced } = useTheme();

  useEffect(() => {
    if (isReduced || !svgRef.current) return;
    const ctx = gsap.context(() => {
      // Draw the dividing line
      gsap.fromTo(".sb-divide", { scaleY: 0 }, {
        scaleY: 1, duration: 0.8, ease: "power2.out", delay: 0.3,
      });
      // Left side (design) floats in
      gsap.fromTo(".sb-left", { opacity: 0, x: -20 }, {
        opacity: 1, x: 0, duration: 0.6, stagger: 0.1, delay: 0.5, ease: "power2.out",
      });
      // Right side (code) floats in
      gsap.fromTo(".sb-right", { opacity: 0, x: 20 }, {
        opacity: 1, x: 0, duration: 0.6, stagger: 0.1, delay: 0.5, ease: "power2.out",
      });
      // Arrows crossing between sides
      gsap.fromTo(".sb-cross", { strokeDashoffset: 80, opacity: 0 }, {
        strokeDashoffset: 0, opacity: 0.5, duration: 0.8, stagger: 0.15, delay: 1.2, ease: "power2.out",
      });
      // Pulsing question mark in the center
      gsap.fromTo(".sb-center", { scale: 0, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.5, delay: 1.6, ease: "back.out(2)",
      });
      gsap.to(".sb-center", {
        scale: 1.15, opacity: 0.6, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2.0,
      });
    }, svgRef);
    return () => ctx.revert();
  }, [isReduced]);

  return (
    <svg ref={svgRef} className="article-illustration" viewBox="0 0 400 280" fill="none">
      {/* Dividing line */}
      <line className="sb-divide" x1="200" y1="20" x2="200" y2="260" stroke="var(--color-border)" strokeWidth="1" style={{ transformOrigin: "200px 140px" }} />
      {/* Left: Design */}
      <text className="sb-left" x="100" y="45" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600" letterSpacing="2">DESIGN</text>
      <rect className="sb-left" x="40" y="65" width="120" height="16" rx="3" fill="var(--color-accent-border)" opacity="0.4" />
      <text className="sb-left" x="100" y="77" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">colour theory</text>
      <rect className="sb-left" x="40" y="95" width="120" height="16" rx="3" fill="var(--color-accent-border)" opacity="0.3" />
      <text className="sb-left" x="100" y="107" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">typography</text>
      <rect className="sb-left" x="40" y="125" width="120" height="16" rx="3" fill="var(--color-accent-border)" opacity="0.4" />
      <text className="sb-left" x="100" y="137" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">spatial reasoning</text>
      <rect className="sb-left" x="40" y="155" width="120" height="16" rx="3" fill="var(--color-accent-border)" opacity="0.3" />
      <text className="sb-left" x="100" y="167" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">user empathy</text>
      <rect className="sb-left" x="40" y="185" width="120" height="16" rx="3" fill="var(--color-accent-border)" opacity="0.4" />
      <text className="sb-left" x="100" y="197" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">visual hierarchy</text>
      <rect className="sb-left" x="40" y="215" width="120" height="16" rx="3" fill="var(--color-accent-border)" opacity="0.3" />
      <text className="sb-left" x="100" y="227" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">composition</text>
      {/* Right: Code */}
      <text className="sb-right" x="300" y="45" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600" letterSpacing="2">CODE</text>
      <rect className="sb-right" x="240" y="65" width="120" height="16" rx="3" fill="var(--color-border)" opacity="0.5" />
      <text className="sb-right" x="300" y="77" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">React hooks</text>
      <rect className="sb-right" x="240" y="95" width="120" height="16" rx="3" fill="var(--color-border)" opacity="0.4" />
      <text className="sb-right" x="300" y="107" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">SCSS specificity</text>
      <rect className="sb-right" x="240" y="125" width="120" height="16" rx="3" fill="var(--color-border)" opacity="0.5" />
      <text className="sb-right" x="300" y="137" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">async patterns</text>
      <rect className="sb-right" x="240" y="155" width="120" height="16" rx="3" fill="var(--color-border)" opacity="0.4" />
      <text className="sb-right" x="300" y="167" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">git workflows</text>
      <rect className="sb-right" x="240" y="185" width="120" height="16" rx="3" fill="var(--color-border)" opacity="0.5" />
      <text className="sb-right" x="300" y="197" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">API contracts</text>
      <rect className="sb-right" x="240" y="215" width="120" height="16" rx="3" fill="var(--color-border)" opacity="0.4" />
      <text className="sb-right" x="300" y="227" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">type systems</text>
      {/* Crossing arrows */}
      <path className="sb-cross" d="M160 80 Q200 100 240 90" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="80" fill="none" />
      <path className="sb-cross" d="M240 140 Q200 160 160 150" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="80" fill="none" />
      <path className="sb-cross" d="M160 200 Q200 220 240 210" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="80" fill="none" />
      {/* Center question mark */}
      <circle className="sb-center" cx="200" cy="250" r="12" fill="var(--color-accent)" opacity="0.15" style={{ transformOrigin: "200px 250px" }} />
      <text className="sb-center" x="200" y="255" textAnchor="middle" fill="var(--color-accent)" fontSize="14" fontFamily="var(--font-display)" fontWeight="800" style={{ transformOrigin: "200px 250px" }}>?!</text>
    </svg>
  );
}

function JsToReactIllustration() {
  const svgRef = useRef(null);
  const { isReduced } = useTheme();

  useEffect(() => {
    if (isReduced || !svgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".jtr-box", { strokeDashoffset: 400, opacity: 0 }, {
        strokeDashoffset: 0, opacity: 1, duration: 0.8, stagger: 0.3, delay: 0.2, ease: "power2.out",
      });
      gsap.fromTo(".jtr-label", { opacity: 0, y: 8 }, {
        opacity: 1, y: 0, duration: 0.4, stagger: 0.15, delay: 0.5, ease: "power2.out",
      });
      gsap.fromTo(".jtr-arrow", { strokeDashoffset: 60, opacity: 0 }, {
        strokeDashoffset: 0, opacity: 1, duration: 0.6, delay: 1.0, ease: "power2.out",
      });
      gsap.fromTo(".jtr-line", { scaleX: 0, opacity: 0 }, {
        scaleX: 1, opacity: 1, duration: 0.3, stagger: 0.06, delay: 0.8, ease: "power2.out",
      });
    }, svgRef);
    return () => ctx.revert();
  }, [isReduced]);

  return (
    <svg ref={svgRef} className="article-illustration" viewBox="0 0 400 280" fill="none">
      {/* JS side */}
      <rect className="jtr-box" x="30" y="40" width="140" height="200" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="400" fill="none" />
      <text className="jtr-label" x="100" y="65" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">JAVASCRIPT</text>
      <rect className="jtr-line" x="50" y="85" width="100" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.4" style={{ transformOrigin: "50px 86px" }} />
      <text className="jtr-label" x="100" y="110" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">document.querySelector</text>
      <rect className="jtr-line" x="50" y="120" width="80" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.3" style={{ transformOrigin: "50px 121px" }} />
      <text className="jtr-label" x="100" y="145" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">addEventListener</text>
      <rect className="jtr-line" x="50" y="155" width="90" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.3" style={{ transformOrigin: "50px 156px" }} />
      <text className="jtr-label" x="100" y="180" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">innerHTML</text>
      <rect className="jtr-line" x="50" y="190" width="70" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.3" style={{ transformOrigin: "50px 191px" }} />
      <text className="jtr-label" x="100" y="215" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">fetch()</text>
      {/* Arrow */}
      <line className="jtr-arrow" x1="185" y1="140" x2="215" y2="140" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="60" />
      <polygon className="jtr-arrow" points="215,135 225,140 215,145" fill="var(--color-accent)" opacity="0.8" />
      {/* React side */}
      <rect className="jtr-box" x="230" y="40" width="140" height="200" rx="4" stroke="var(--color-accent-border)" strokeWidth="1.5" strokeDasharray="400" fill="none" />
      <text className="jtr-label" x="300" y="65" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">REACT</text>
      <rect className="jtr-line" x="250" y="85" width="100" height="2" rx="1" fill="var(--color-accent-border)" opacity="0.4" style={{ transformOrigin: "250px 86px" }} />
      <text className="jtr-label" x="300" y="110" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">useRef</text>
      <rect className="jtr-line" x="250" y="120" width="80" height="2" rx="1" fill="var(--color-accent-border)" opacity="0.3" style={{ transformOrigin: "250px 121px" }} />
      <text className="jtr-label" x="300" y="145" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">onClick</text>
      <rect className="jtr-line" x="250" y="155" width="90" height="2" rx="1" fill="var(--color-accent-border)" opacity="0.3" style={{ transformOrigin: "250px 156px" }} />
      <text className="jtr-label" x="300" y="180" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">JSX</text>
      <rect className="jtr-line" x="250" y="190" width="70" height="2" rx="1" fill="var(--color-accent-border)" opacity="0.3" style={{ transformOrigin: "250px 191px" }} />
      <text className="jtr-label" x="300" y="215" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">useEffect</text>
    </svg>
  );
}

function ReactConceptsIllustration() {
  const svgRef = useRef(null);
  const { isReduced } = useTheme();

  useEffect(() => {
    if (isReduced || !svgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".rc-node", { scale: 0, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.5, stagger: 0.12, delay: 0.2, ease: "back.out(2)",
      });
      gsap.fromTo(".rc-branch", { strokeDashoffset: 80, opacity: 0 }, {
        strokeDashoffset: 0, opacity: 0.6, duration: 0.5, stagger: 0.1, delay: 0.6, ease: "power2.out",
      });
      gsap.fromTo(".rc-label", { opacity: 0 }, {
        opacity: 1, duration: 0.4, stagger: 0.1, delay: 1.0, ease: "power2.out",
      });
      gsap.to(".rc-pulse", {
        scale: 1.4, opacity: 0, duration: 1.5, repeat: -1, ease: "sine.out", delay: 1.5,
      });
    }, svgRef);
    return () => ctx.revert();
  }, [isReduced]);

  return (
    <svg ref={svgRef} className="article-illustration" viewBox="0 0 400 280" fill="none">
      {/* Root component */}
      <circle className="rc-node" cx="200" cy="50" r="20" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" style={{ transformOrigin: "200px 50px" }} />
      <text className="rc-label" x="200" y="54" textAnchor="middle" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)" fontWeight="600">App</text>
      {/* Branches */}
      <line className="rc-branch" x1="200" y1="70" x2="100" y2="120" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="80" />
      <line className="rc-branch" x1="200" y1="70" x2="200" y2="120" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="80" />
      <line className="rc-branch" x1="200" y1="70" x2="300" y2="120" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="80" />
      {/* Child components */}
      <circle className="rc-node" cx="100" cy="140" r="16" stroke="var(--color-accent-border)" strokeWidth="1" fill="none" style={{ transformOrigin: "100px 140px" }} />
      <text className="rc-label" x="100" y="144" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">Header</text>
      <circle className="rc-node" cx="200" cy="140" r="16" stroke="var(--color-accent-border)" strokeWidth="1" fill="none" style={{ transformOrigin: "200px 140px" }} />
      <text className="rc-label" x="200" y="144" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">Main</text>
      <circle className="rc-node" cx="300" cy="140" r="16" stroke="var(--color-accent-border)" strokeWidth="1" fill="none" style={{ transformOrigin: "300px 140px" }} />
      <text className="rc-label" x="300" y="144" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">Footer</text>
      {/* Deeper children */}
      <line className="rc-branch" x1="200" y1="156" x2="160" y2="200" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="80" />
      <line className="rc-branch" x1="200" y1="156" x2="240" y2="200" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="80" />
      <circle className="rc-node" cx="160" cy="216" r="14" stroke="var(--color-border)" strokeWidth="1" fill="none" style={{ transformOrigin: "160px 216px" }} />
      <text className="rc-label" x="160" y="220" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="7" fontFamily="var(--font-mono)">Card</text>
      <circle className="rc-node" cx="240" cy="216" r="14" stroke="var(--color-border)" strokeWidth="1" fill="none" style={{ transformOrigin: "240px 216px" }} />
      <text className="rc-label" x="240" y="220" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="7" fontFamily="var(--font-mono)">List</text>
      {/* State pulse on root */}
      <circle className="rc-pulse" cx="200" cy="50" r="20" stroke="var(--color-accent)" strokeWidth="0.5" fill="none" style={{ transformOrigin: "200px 50px" }} />
      {/* Labels */}
      <text className="rc-label" x="50" y="260" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="2">COMPONENT TREE</text>
    </svg>
  );
}

function ScssIllustration() {
  const svgRef = useRef(null);
  const { isReduced } = useTheme();

  useEffect(() => {
    if (isReduced || !svgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".scss-block", { strokeDashoffset: 300, opacity: 0 }, {
        strokeDashoffset: 0, opacity: 1, duration: 0.8, stagger: 0.2, delay: 0.2, ease: "power2.out",
      });
      gsap.fromTo(".scss-label", { opacity: 0, y: 6 }, {
        opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.6, ease: "power2.out",
      });
      gsap.fromTo(".scss-line", { scaleX: 0, opacity: 0 }, {
        scaleX: 1, opacity: 1, duration: 0.3, stagger: 0.06, delay: 0.8, ease: "power2.out",
      });
      gsap.fromTo(".scss-arrow", { strokeDashoffset: 100, opacity: 0 }, {
        strokeDashoffset: 0, opacity: 0.5, duration: 0.6, delay: 1.2, ease: "power2.out",
      });
    }, svgRef);
    return () => ctx.revert();
  }, [isReduced]);

  return (
    <svg ref={svgRef} className="article-illustration" viewBox="0 0 400 280" fill="none">
      {/* Variables block */}
      <rect className="scss-block" x="30" y="30" width="140" height="100" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="300" fill="none" />
      <text className="scss-label" x="100" y="52" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">$variables</text>
      <text className="scss-label" x="100" y="75" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">$color-accent: #dfff47</text>
      <text className="scss-label" x="100" y="90" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">$font-size-lg: 18px</text>
      <rect className="scss-line" x="50" y="105" width="100" height="2" rx="1" fill="var(--color-accent-border)" opacity="0.3" style={{ transformOrigin: "50px 106px" }} />
      {/* Nesting block */}
      <rect className="scss-block" x="230" y="30" width="140" height="100" rx="4" stroke="var(--color-accent-border)" strokeWidth="1.5" strokeDasharray="300" fill="none" />
      <text className="scss-label" x="300" y="52" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">.card {"{"}</text>
      <text className="scss-label" x="300" y="73" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">{"  "}&amp;-title {"{"} ... {"}"}</text>
      <text className="scss-label" x="300" y="88" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">{"  "}&amp;-body {"{"} ... {"}"}</text>
      <text className="scss-label" x="300" y="103" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">{"  "}&amp;:hover {"{"} ... {"}"}</text>
      {/* Mixin block */}
      <rect className="scss-block" x="130" y="160" width="140" height="90" rx="4" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="300" fill="none" />
      <text className="scss-label" x="200" y="182" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">@mixin</text>
      <text className="scss-label" x="200" y="205" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">breakpoint($size)</text>
      <text className="scss-label" x="200" y="220" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">@media (max-width: $size)</text>
      {/* Connecting arrows */}
      <path className="scss-arrow" d="M100 130 Q100 155 150 170" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="100" fill="none" />
      <path className="scss-arrow" d="M300 130 Q300 155 250 170" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="100" fill="none" />
      <text className="scss-label" x="200" y="270" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="2">SCSS FEATURES</text>
    </svg>
  );
}

function A11yIllustration() {
  const svgRef = useRef(null);
  const { isReduced } = useTheme();

  useEffect(() => {
    if (isReduced || !svgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".a11y-ring", { scale: 0, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.8, stagger: 0.15, delay: 0.2, ease: "elastic.out(1, 0.6)",
      });
      gsap.fromTo(".a11y-icon", { opacity: 0, y: 10 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.12, delay: 0.8, ease: "power2.out",
      });
      gsap.fromTo(".a11y-label", { opacity: 0 }, {
        opacity: 1, duration: 0.4, stagger: 0.1, delay: 1.2, ease: "power2.out",
      });
      gsap.to(".a11y-center", {
        scale: 1.15, opacity: 0.7, duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.5,
      });
    }, svgRef);
    return () => ctx.revert();
  }, [isReduced]);

  return (
    <svg ref={svgRef} className="article-illustration" viewBox="0 0 400 280" fill="none">
      {/* Accessibility symbol - person in circle */}
      <circle className="a11y-ring" cx="200" cy="140" r="100" stroke="var(--color-accent-border)" strokeWidth="1" fill="none" style={{ transformOrigin: "200px 140px" }} />
      <circle className="a11y-ring" cx="200" cy="140" r="65" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" style={{ transformOrigin: "200px 140px" }} />
      {/* Simple person icon */}
      <circle className="a11y-center" cx="200" cy="110" r="10" fill="var(--color-accent)" opacity="0.8" style={{ transformOrigin: "200px 110px" }} />
      <line className="a11y-center" x1="200" y1="120" x2="200" y2="155" stroke="var(--color-accent)" strokeWidth="2" style={{ transformOrigin: "200px 137px" }} />
      <line className="a11y-center" x1="180" y1="135" x2="220" y2="135" stroke="var(--color-accent)" strokeWidth="2" style={{ transformOrigin: "200px 135px" }} />
      <line className="a11y-center" x1="200" y1="155" x2="185" y2="175" stroke="var(--color-accent)" strokeWidth="2" />
      <line className="a11y-center" x1="200" y1="155" x2="215" y2="175" stroke="var(--color-accent)" strokeWidth="2" />
      {/* Surrounding labels */}
      <text className="a11y-icon" x="90" y="60" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">SEMANTIC</text>
      <text className="a11y-label" x="90" y="73" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)">HTML</text>
      <text className="a11y-icon" x="310" y="60" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">ARIA</text>
      <text className="a11y-label" x="310" y="73" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)">ROLES</text>
      <text className="a11y-icon" x="80" y="230" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">FOCUS</text>
      <text className="a11y-label" x="80" y="243" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)">MANAGEMENT</text>
      <text className="a11y-icon" x="320" y="230" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">COLOUR</text>
      <text className="a11y-label" x="320" y="243" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)">CONTRAST</text>
      {/* Small dots connecting labels to ring */}
      <circle className="a11y-icon" cx="115" cy="85" r="3" fill="var(--color-accent)" opacity="0.5" />
      <circle className="a11y-icon" cx="285" cy="85" r="3" fill="var(--color-accent)" opacity="0.5" />
      <circle className="a11y-icon" cx="115" cy="200" r="3" fill="var(--color-accent)" opacity="0.5" />
      <circle className="a11y-icon" cx="285" cy="200" r="3" fill="var(--color-accent)" opacity="0.5" />
    </svg>
  );
}

function TypeScriptIllustration() {
  const svgRef = useRef(null);
  const { isReduced } = useTheme();

  useEffect(() => {
    if (isReduced || !svgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".ts-box", { strokeDashoffset: 400, opacity: 0 }, {
        strokeDashoffset: 0, opacity: 1, duration: 0.8, stagger: 0.2, delay: 0.2, ease: "power2.out",
      });
      gsap.fromTo(".ts-label", { opacity: 0, y: 8 }, {
        opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.6, ease: "power2.out",
      });
      gsap.fromTo(".ts-line", { scaleX: 0 }, {
        scaleX: 1, duration: 0.4, stagger: 0.06, delay: 0.8, ease: "power2.out",
      });
      gsap.fromTo(".ts-badge", { scale: 0, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.5, stagger: 0.15, delay: 1.0, ease: "back.out(2)",
      });
      gsap.to(".ts-shield", {
        scale: 1.08, opacity: 0.7, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.5,
      });
    }, svgRef);
    return () => ctx.revert();
  }, [isReduced]);

  return (
    <svg ref={svgRef} className="article-illustration" viewBox="0 0 400 280" fill="none">
      {/* Central shield icon */}
      <path className="ts-shield" d="M200 40 L250 65 L250 140 Q250 200 200 230 Q150 200 150 140 L150 65 Z" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" style={{ transformOrigin: "200px 135px" }} />
      <text className="ts-label" x="200" y="125" textAnchor="middle" fill="var(--color-accent)" fontSize="28" fontFamily="var(--font-mono)" fontWeight="700">TS</text>
      <text className="ts-label" x="200" y="150" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">TYPE SAFE</text>
      {/* Left: JS code */}
      <rect className="ts-box" x="15" y="60" width="100" height="130" rx="4" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="400" fill="none" />
      <text className="ts-label" x="65" y="82" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)" fontWeight="600">JAVASCRIPT</text>
      <rect className="ts-line" x="30" y="98" width="70" height="2" rx="1" fill="var(--color-text-disabled)" opacity="0.3" style={{ transformOrigin: "30px 99px" }} />
      <rect className="ts-line" x="30" y="112" width="55" height="2" rx="1" fill="var(--color-text-disabled)" opacity="0.25" style={{ transformOrigin: "30px 113px" }} />
      <rect className="ts-line" x="30" y="126" width="65" height="2" rx="1" fill="var(--color-text-disabled)" opacity="0.3" style={{ transformOrigin: "30px 127px" }} />
      <rect className="ts-line" x="30" y="140" width="50" height="2" rx="1" fill="var(--color-text-disabled)" opacity="0.25" style={{ transformOrigin: "30px 141px" }} />
      <text className="ts-label" x="65" y="172" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="7" fontFamily="var(--font-mono)">no type info</text>
      {/* Right: TS code */}
      <rect className="ts-box" x="285" y="60" width="100" height="130" rx="4" stroke="var(--color-accent-border)" strokeWidth="1" strokeDasharray="400" fill="none" />
      <text className="ts-label" x="335" y="82" textAnchor="middle" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)" fontWeight="600">TYPESCRIPT</text>
      <rect className="ts-line" x="300" y="98" width="70" height="2" rx="1" fill="var(--color-accent-border)" opacity="0.4" style={{ transformOrigin: "300px 99px" }} />
      <rect className="ts-badge" x="372" y="94" width="8" height="8" rx="4" fill="var(--color-accent)" opacity="0.6" style={{ transformOrigin: "376px 98px" }} />
      <rect className="ts-line" x="300" y="112" width="55" height="2" rx="1" fill="var(--color-accent-border)" opacity="0.35" style={{ transformOrigin: "300px 113px" }} />
      <rect className="ts-badge" x="357" y="108" width="8" height="8" rx="4" fill="var(--color-accent)" opacity="0.6" style={{ transformOrigin: "361px 112px" }} />
      <rect className="ts-line" x="300" y="126" width="65" height="2" rx="1" fill="var(--color-accent-border)" opacity="0.4" style={{ transformOrigin: "300px 127px" }} />
      <rect className="ts-badge" x="367" y="122" width="8" height="8" rx="4" fill="var(--color-accent)" opacity="0.6" style={{ transformOrigin: "371px 126px" }} />
      <rect className="ts-line" x="300" y="140" width="50" height="2" rx="1" fill="var(--color-accent-border)" opacity="0.35" style={{ transformOrigin: "300px 141px" }} />
      <text className="ts-label" x="335" y="172" textAnchor="middle" fill="var(--color-accent)" fontSize="7" fontFamily="var(--font-mono)">typed + safe</text>
      {/* Bottom label */}
      <text className="ts-label" x="200" y="265" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="2">CATCH ERRORS BEFORE THEY SHIP</text>
    </svg>
  );
}

/* ---- Inline TypeScript diagrams ---- */

const TsDiagramAnnotations = (
  <svg viewBox="0 0 560 200" fill="none">
    {/* Variable annotation */}
    <text x="40" y="35" fill="var(--color-text-secondary)" fontSize="13" fontFamily="var(--font-mono)">
      <tspan fill="#c792ea">const</tspan> username<tspan fill="#89ddff">:</tspan> <tspan fill="#ffcb6b">string</tspan> <tspan fill="#89ddff">=</tspan> <tspan fill="#c3e88d">"Alex"</tspan>
    </text>
    {/* Arrow from :string */}
    <line x1="268" y1="40" x2="268" y2="70" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="4" />
    <rect x="198" y="72" width="140" height="28" rx="4" fill="var(--color-accent-dim)" stroke="var(--color-accent-border)" strokeWidth="1" />
    <text x="268" y="91" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontFamily="var(--font-mono)">type annotation</text>
    {/* Function annotation */}
    <text x="40" y="145" fill="var(--color-text-secondary)" fontSize="13" fontFamily="var(--font-mono)">
      <tspan fill="#c792ea">function</tspan> greet<tspan fill="#89ddff">(</tspan>name<tspan fill="#89ddff">:</tspan> <tspan fill="#ffcb6b">string</tspan><tspan fill="#89ddff">):</tspan> <tspan fill="#ffcb6b">string</tspan>
    </text>
    {/* Arrow from param type */}
    <line x1="270" y1="150" x2="270" y2="175" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="4" />
    <rect x="210" y="177" width="120" height="22" rx="4" fill="var(--color-accent-dim)" stroke="var(--color-accent-border)" strokeWidth="1" />
    <text x="270" y="193" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)">parameter type</text>
    {/* Arrow from return type */}
    <line x1="417" y1="150" x2="417" y2="175" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="4" />
    <rect x="357" y="177" width="120" height="22" rx="4" fill="var(--color-accent-dim)" stroke="var(--color-accent-border)" strokeWidth="1" />
    <text x="417" y="193" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)">return type</text>
  </svg>
);

const TsDiagramInterface = (
  <svg viewBox="0 0 560 250" fill="none">
    {/* Interface box */}
    <rect x="30" y="10" width="220" height="170" rx="6" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" />
    <text x="140" y="38" textAnchor="middle" fill="var(--color-accent)" fontSize="12" fontFamily="var(--font-mono)" fontWeight="600">interface User</text>
    <line x1="50" y1="48" x2="230" y2="48" stroke="var(--color-border)" strokeWidth="1" />
    <text x="60" y="72" fill="var(--color-text-secondary)" fontSize="11" fontFamily="var(--font-mono)">name<tspan fill="#89ddff">:</tspan> <tspan fill="#ffcb6b">string</tspan></text>
    <text x="60" y="96" fill="var(--color-text-secondary)" fontSize="11" fontFamily="var(--font-mono)">age<tspan fill="#89ddff">:</tspan> <tspan fill="#ffcb6b">number</tspan></text>
    <text x="60" y="120" fill="var(--color-text-secondary)" fontSize="11" fontFamily="var(--font-mono)">email<tspan fill="#89ddff">:</tspan> <tspan fill="#ffcb6b">string</tspan></text>
    <text x="60" y="144" fill="var(--color-text-secondary)" fontSize="11" fontFamily="var(--font-mono)">admin<tspan fill="#89ddff">?:</tspan> <tspan fill="#ffcb6b">boolean</tspan></text>
    <text x="60" y="168" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">? = optional</text>
    {/* Arrow to object */}
    <line x1="260" y1="95" x2="310" y2="95" stroke="var(--color-accent)" strokeWidth="1.5" />
    <polygon points="310,90 320,95 310,100" fill="var(--color-accent)" />
    <text x="290" y="82" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">shape</text>
    {/* Object that matches */}
    <rect x="325" y="30" width="210" height="130" rx="6" stroke="var(--color-accent-border)" strokeWidth="1" fill="var(--color-accent-dim)" />
    <text x="430" y="55" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="11" fontFamily="var(--font-mono)">{"{"} name: "Alex",</text>
    <text x="430" y="78" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="11" fontFamily="var(--font-mono)">age: 39,</text>
    <text x="430" y="101" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="11" fontFamily="var(--font-mono)">email: "a@b.com",</text>
    <text x="430" y="124" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="11" fontFamily="var(--font-mono)">admin: true {"}"}</text>
    {/* Check mark */}
    <text x="430" y="148" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)">matches the shape</text>
    {/* Bottom note */}
    <text x="280" y="225" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">An interface describes the shape an object must have.</text>
    <text x="280" y="242" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">TypeScript checks every object against its interface at compile time.</text>
  </svg>
);

const TsDiagramUnion = (
  <svg viewBox="0 0 560 180" fill="none">
    {/* Left circle - string */}
    <ellipse cx="200" cy="90" rx="110" ry="65" stroke="var(--color-accent)" strokeWidth="1.5" fill="var(--color-accent-dim)" opacity="0.5" />
    <text x="155" y="93" textAnchor="middle" fill="var(--color-accent)" fontSize="14" fontFamily="var(--font-mono)" fontWeight="600">string</text>
    <text x="155" y="112" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">"hello"  "world"</text>
    {/* Right circle - number */}
    <ellipse cx="360" cy="90" rx="110" ry="65" stroke="#f78c6c" strokeWidth="1.5" fill="rgba(247, 140, 108, 0.08)" opacity="0.5" />
    <text x="405" y="93" textAnchor="middle" fill="#f78c6c" fontSize="14" fontFamily="var(--font-mono)" fontWeight="600">number</text>
    <text x="405" y="112" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">42  3.14  0</text>
    {/* Union pipe in overlap */}
    <text x="280" y="85" textAnchor="middle" fill="var(--color-text-primary)" fontSize="22" fontFamily="var(--font-mono)" fontWeight="700">|</text>
    <text x="280" y="110" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">or</text>
    {/* Label */}
    <text x="280" y="170" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">string | number means the value can be either type</text>
  </svg>
);

const TsDiagramGenerics = (
  <svg viewBox="0 0 560 220" fill="none">
    {/* Generic box template */}
    <rect x="160" y="10" width="240" height="50" rx="6" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" />
    <text x="280" y="42" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="13" fontFamily="var(--font-mono)">
      Box<tspan fill="#89ddff">&lt;</tspan><tspan fill="#ffcb6b">T</tspan><tspan fill="#89ddff">&gt;</tspan>  =  {"{"} value<tspan fill="#89ddff">:</tspan> <tspan fill="#ffcb6b">T</tspan> {"}"}
    </text>
    {/* T placeholder label */}
    <line x1="280" y1="60" x2="280" y2="80" stroke="var(--color-accent-border)" strokeWidth="1" strokeDasharray="4" />
    <text x="280" y="94" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">T is a placeholder for any type</text>
    {/* Left: string version */}
    <rect x="40" y="120" width="200" height="45" rx="6" stroke="var(--color-accent-border)" strokeWidth="1" fill="var(--color-accent-dim)" />
    <text x="140" y="148" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="12" fontFamily="var(--font-mono)">
      Box<tspan fill="#89ddff">&lt;</tspan><tspan fill="#ffcb6b">string</tspan><tspan fill="#89ddff">&gt;</tspan>
    </text>
    <line x1="205" y1="118" x2="240" y2="62" stroke="var(--color-accent-border)" strokeWidth="1" strokeDasharray="4" />
    <text x="140" y="182" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">value must be a string</text>
    {/* Right: number version */}
    <rect x="320" y="120" width="200" height="45" rx="6" stroke="var(--color-accent-border)" strokeWidth="1" fill="var(--color-accent-dim)" />
    <text x="420" y="148" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="12" fontFamily="var(--font-mono)">
      Box<tspan fill="#89ddff">&lt;</tspan><tspan fill="#ffcb6b">number</tspan><tspan fill="#89ddff">&gt;</tspan>
    </text>
    <line x1="355" y1="118" x2="320" y2="62" stroke="var(--color-accent-border)" strokeWidth="1" strokeDasharray="4" />
    <text x="420" y="182" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">value must be a number</text>
    {/* Bottom note */}
    <text x="280" y="212" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">One definition, reused for any type. That is the power of generics.</text>
  </svg>
);

const TsDiagramNarrowing = (
  <svg viewBox="0 0 560 220" fill="none">
    {/* Top: wide type */}
    <rect x="130" y="10" width="300" height="40" rx="6" stroke="var(--color-border)" strokeWidth="1.5" fill="none" />
    <text x="280" y="36" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="12" fontFamily="var(--font-mono)">value<tspan fill="#89ddff">:</tspan> <tspan fill="#ffcb6b">string</tspan> <tspan fill="#89ddff">|</tspan> <tspan fill="#ffcb6b">number</tspan></text>
    {/* Funnel lines */}
    <line x1="200" y1="50" x2="160" y2="80" stroke="var(--color-border)" strokeWidth="1" />
    <line x1="360" y1="50" x2="400" y2="80" stroke="var(--color-border)" strokeWidth="1" />
    {/* If check */}
    <rect x="140" y="80" width="280" height="35" rx="4" fill="var(--color-accent-dim)" stroke="var(--color-accent-border)" strokeWidth="1" />
    <text x="280" y="103" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="11" fontFamily="var(--font-mono)">
      <tspan fill="#c792ea">if</tspan> (<tspan fill="#c792ea">typeof</tspan> value <tspan fill="#89ddff">===</tspan> <tspan fill="#c3e88d">"string"</tspan>)
    </text>
    {/* Two branches */}
    <line x1="220" y1="115" x2="140" y2="145" stroke="var(--color-accent)" strokeWidth="1.5" />
    <line x1="340" y1="115" x2="420" y2="145" stroke="var(--color-border)" strokeWidth="1.5" />
    {/* Left: narrowed to string */}
    <rect x="50" y="148" width="180" height="35" rx="6" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" />
    <text x="140" y="171" textAnchor="middle" fill="var(--color-accent)" fontSize="12" fontFamily="var(--font-mono)">value<tspan fill="#89ddff">:</tspan> <tspan fill="#ffcb6b">string</tspan></text>
    <text x="140" y="200" textAnchor="middle" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)">narrowed - safe to use .toUpperCase()</text>
    {/* Right: narrowed to number */}
    <rect x="330" y="148" width="180" height="35" rx="6" stroke="var(--color-border)" strokeWidth="1" fill="none" />
    <text x="420" y="171" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="12" fontFamily="var(--font-mono)">value<tspan fill="#89ddff">:</tspan> <tspan fill="#ffcb6b">number</tspan></text>
    <text x="420" y="200" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">narrowed - safe to use .toFixed()</text>
  </svg>
);

/* ---- Interactive diagrams for JS/TS articles ---- */

const InteractiveMapDiagram = (
  <svg viewBox="0 0 520 140" fill="none">
    {/* Input array */}
    <text className="idg-title" x="10" y="18" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">.map(n =&gt; n * 2)</text>
    {[1, 2, 3, 4].map((n, idx) => (
      <g key={n}>
        <rect className="idg-input" x={10 + idx * 65} y="30" width="52" height="36" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="none" />
        <text className="idg-input" x={36 + idx * 65} y="54" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="16" fontFamily="var(--font-mono)">{n}</text>
      </g>
    ))}
    {/* Arrows */}
    {[0, 1, 2, 3].map((idx) => (
      <g key={`arrow-${idx}`}>
        <line className="idg-arrow" x1={36 + idx * 65} y1="70" x2={36 + idx * 65} y2="88" stroke="var(--color-accent)" strokeWidth="1.5" />
        <polygon className="idg-arrow" points={`${31 + idx * 65},85 ${36 + idx * 65},93 ${41 + idx * 65},85`} fill="var(--color-accent)" />
        <text className="idg-process" x={56 + idx * 65} y="82" fill="var(--color-accent)" fontSize="8" fontFamily="var(--font-mono)">x2</text>
      </g>
    ))}
    {/* Output array */}
    {[2, 4, 6, 8].map((n, idx) => (
      <g key={`out-${n}`}>
        <rect className="idg-output" x={10 + idx * 65} y="96" width="52" height="36" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" fill="var(--color-accent-dim)" />
        <text className="idg-output" x={36 + idx * 65} y="120" textAnchor="middle" fill="var(--color-accent)" fontSize="16" fontFamily="var(--font-mono)" fontWeight="600">{n}</text>
      </g>
    ))}
    {/* Labels */}
    <text className="idg-note" x="380" y="53" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">input</text>
    <text className="idg-note" x="380" y="119" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)">output</text>
  </svg>
);

const InteractiveFilterDiagram = (
  <svg viewBox="0 0 520 140" fill="none">
    <text className="idg-title" x="10" y="18" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">.filter(w =&gt; w.length &lt;= 3)</text>
    {/* Input */}
    {["hello", "hi", "hey", "howdy"].map((w, idx) => {
      const keeps = w.length <= 3;
      return (
        <g key={w}>
          <rect className="idg-input" x={10 + idx * 120} y="30" width="105" height="36" rx="4" stroke={keeps ? "var(--color-accent)" : "var(--color-border)"} strokeWidth={keeps ? 1.5 : 1} fill="none" />
          <text className="idg-input" x={62 + idx * 120} y="54" textAnchor="middle" fill={keeps ? "var(--color-accent)" : "var(--color-text-disabled)"} fontSize="13" fontFamily="var(--font-mono)">{`"${w}"`}</text>
        </g>
      );
    })}
    {/* Arrows for kept items */}
    {[1, 2].map((idx, pos) => (
      <g key={`fa-${idx}`}>
        <line className="idg-arrow" x1={62 + idx * 120} y1="70" x2={36 + pos * 120} y2="88" stroke="var(--color-accent)" strokeWidth="1.5" />
        <polygon className="idg-arrow" points={`${31 + pos * 120},85 ${36 + pos * 120},93 ${41 + pos * 120},85`} fill="var(--color-accent)" />
      </g>
    ))}
    {/* Crossed out items */}
    {[0, 3].map((idx) => (
      <g key={`fx-${idx}`}>
        <line className="idg-process" x1={25 + idx * 120} y1="72" x2={40 + idx * 120} y2="86" stroke="#ff5370" strokeWidth="1.5" opacity="0.6" />
        <line className="idg-process" x1={40 + idx * 120} y1="72" x2={25 + idx * 120} y2="86" stroke="#ff5370" strokeWidth="1.5" opacity="0.6" />
      </g>
    ))}
    {/* Output */}
    {["hi", "hey"].map((w, pos) => (
      <g key={`fo-${w}`}>
        <rect className="idg-output" x={10 + pos * 120} y="96" width="105" height="36" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" fill="var(--color-accent-dim)" />
        <text className="idg-output" x={62 + pos * 120} y="120" textAnchor="middle" fill="var(--color-accent)" fontSize="13" fontFamily="var(--font-mono)" fontWeight="600">{`"${w}"`}</text>
      </g>
    ))}
  </svg>
);

const InteractiveFindDiagram = (
  <svg viewBox="0 0 520 130" fill="none">
    <text className="idg-title" x="10" y="18" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">.find(p =&gt; p.name === "Sam")</text>
    {/* Array items */}
    {[{ name: "Alex", found: false }, { name: "Sam", found: true }].map((p, idx) => (
      <g key={p.name}>
        <rect className="idg-input" x={10 + idx * 200} y="30" width="180" height="40" rx="4" stroke={p.found ? "var(--color-accent)" : "var(--color-border)"} strokeWidth={p.found ? 1.5 : 1} fill={p.found ? "var(--color-accent-dim)" : "none"} />
        <text className="idg-input" x={100 + idx * 200} y="56" textAnchor="middle" fill={p.found ? "var(--color-accent)" : "var(--color-text-secondary)"} fontSize="12" fontFamily="var(--font-mono)">{`{ name: "${p.name}", age: ${p.name === "Alex" ? 39 : 28} }`}</text>
        {!p.found && <text className="idg-process" x={100 + idx * 200} y="88" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">skip</text>}
        {p.found && (
          <>
            <line className="idg-arrow" x1={100 + idx * 200} y1="74" x2={100 + idx * 200} y2="90" stroke="var(--color-accent)" strokeWidth="1.5" />
            <polygon className="idg-arrow" points={`${95 + idx * 200},88 ${100 + idx * 200},96 ${105 + idx * 200},88`} fill="var(--color-accent)" />
            <rect className="idg-output" x={30 + idx * 200} y="98" width="140" height="28" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" fill="var(--color-accent-dim)" />
            <text className="idg-output" x={100 + idx * 200} y="117" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">found! stop here</text>
          </>
        )}
      </g>
    ))}
  </svg>
);

const InteractiveSpreadDiagram = (
  <svg viewBox="0 0 520 140" fill="none">
    <text className="idg-title" x="10" y="18" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">{"{ ...original, age: 40 }"}</text>
    {/* Original object */}
    <rect className="idg-input" x="10" y="30" width="180" height="65" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="none" />
    <text className="idg-input" x="100" y="50" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">original</text>
    <text className="idg-input" x="50" y="70" fill="var(--color-text-secondary)" fontSize="11" fontFamily="var(--font-mono)">name: "Alex"</text>
    <text className="idg-input" x="50" y="86" fill="var(--color-text-secondary)" fontSize="11" fontFamily="var(--font-mono)">age: 39</text>
    {/* Spread arrows */}
    <path className="idg-arrow" d="M195 48 Q230 30 260 48" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="4" fill="none" />
    <path className="idg-arrow" d="M195 78 Q230 95 260 78" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="4" fill="none" />
    <text className="idg-process" x="227" y="68" textAnchor="middle" fill="var(--color-accent)" fontSize="14" fontFamily="var(--font-mono)" fontWeight="700">...</text>
    {/* New object */}
    <rect className="idg-output" x="260" y="30" width="200" height="65" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" fill="var(--color-accent-dim)" />
    <text className="idg-output" x="360" y="50" textAnchor="middle" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)">updated (new copy)</text>
    <text className="idg-output" x="290" y="70" fill="var(--color-text-secondary)" fontSize="11" fontFamily="var(--font-mono)">name: "Alex"</text>
    <text className="idg-output" x="290" y="86" fill="var(--color-accent)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">age: 40</text>
    {/* Override label */}
    <rect className="idg-process" x="380" y="77" width="70" height="18" rx="3" fill="var(--color-accent-dim)" stroke="var(--color-accent-border)" strokeWidth="1" />
    <text className="idg-process" x="415" y="90" textAnchor="middle" fill="var(--color-accent)" fontSize="8" fontFamily="var(--font-mono)">overridden</text>
    {/* Bottom note */}
    <text className="idg-note" x="260" y="128" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">Original stays unchanged. Spread copies then overwrites.</text>
  </svg>
);

const InteractiveDestructureDiagram = (
  <svg viewBox="0 0 520 140" fill="none">
    <text className="idg-title" x="10" y="18" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">{"const { name, role } = user"}</text>
    {/* Object */}
    <rect className="idg-input" x="10" y="30" width="200" height="90" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="none" />
    <text className="idg-input" x="110" y="50" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">user object</text>
    <text className="idg-input" x="35" y="70" fill="var(--color-accent)" fontSize="11" fontFamily="var(--font-mono)">name: "Alex"</text>
    <text className="idg-input" x="35" y="86" fill="var(--color-text-secondary)" fontSize="11" fontFamily="var(--font-mono)">age: 39</text>
    <text className="idg-input" x="35" y="102" fill="var(--color-accent)" fontSize="11" fontFamily="var(--font-mono)">role: "Engineer"</text>
    {/* Arrows pulling values out */}
    <line className="idg-arrow" x1="215" y1="66" x2="280" y2="50" stroke="var(--color-accent)" strokeWidth="1.5" />
    <polygon className="idg-arrow" points="277,45 287,50 277,55" fill="var(--color-accent)" />
    <line className="idg-arrow" x1="215" y1="98" x2="280" y2="100" stroke="var(--color-accent)" strokeWidth="1.5" />
    <polygon className="idg-arrow" points="277,95 287,100 277,105" fill="var(--color-accent)" />
    {/* Extracted variables */}
    <rect className="idg-output" x="290" y="35" width="170" height="32" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" fill="var(--color-accent-dim)" />
    <text className="idg-output" x="375" y="56" textAnchor="middle" fill="var(--color-accent)" fontSize="12" fontFamily="var(--font-mono)" fontWeight="600">name = "Alex"</text>
    <rect className="idg-output" x="290" y="82" width="170" height="32" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" fill="var(--color-accent-dim)" />
    <text className="idg-output" x="375" y="103" textAnchor="middle" fill="var(--color-accent)" fontSize="12" fontFamily="var(--font-mono)" fontWeight="600">role = "Engineer"</text>
    {/* age stays behind */}
    <text className="idg-note" x="110" y="130" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">age not extracted (not destructured)</text>
  </svg>
);

const InteractiveFunctionDiagram = (
  <svg viewBox="0 0 520 130" fill="none">
    <text className="idg-title" x="10" y="18" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">function add(a, b) {"{"} return a + b {"}"}</text>
    {/* Input args */}
    <rect className="idg-input" x="10" y="35" width="60" height="35" rx="4" stroke="var(--color-accent-border)" strokeWidth="1" fill="var(--color-accent-dim)" />
    <text className="idg-input" x="40" y="58" textAnchor="middle" fill="var(--color-accent)" fontSize="14" fontFamily="var(--font-mono)" fontWeight="600">5</text>
    <text className="idg-input" x="40" y="84" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">a</text>
    <rect className="idg-input" x="85" y="35" width="60" height="35" rx="4" stroke="var(--color-accent-border)" strokeWidth="1" fill="var(--color-accent-dim)" />
    <text className="idg-input" x="115" y="58" textAnchor="middle" fill="var(--color-accent)" fontSize="14" fontFamily="var(--font-mono)" fontWeight="600">3</text>
    <text className="idg-input" x="115" y="84" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">b</text>
    {/* Arrow into function */}
    <line className="idg-arrow" x1="155" y1="52" x2="190" y2="52" stroke="var(--color-accent)" strokeWidth="1.5" />
    <polygon className="idg-arrow" points="190,47 200,52 190,57" fill="var(--color-accent)" />
    {/* Function box */}
    <rect className="idg-process" x="205" y="30" width="140" height="45" rx="6" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" />
    <text className="idg-process" x="275" y="48" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">add(a, b)</text>
    <text className="idg-process" x="275" y="65" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontFamily="var(--font-mono)">return a + b</text>
    {/* Arrow out */}
    <line className="idg-arrow" x1="350" y1="52" x2="385" y2="52" stroke="var(--color-accent)" strokeWidth="1.5" />
    <polygon className="idg-arrow" points="385,47 395,52 385,57" fill="var(--color-accent)" />
    {/* Output */}
    <rect className="idg-output" x="400" y="35" width="70" height="35" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" fill="var(--color-accent-dim)" />
    <text className="idg-output" x="435" y="58" textAnchor="middle" fill="var(--color-accent)" fontSize="16" fontFamily="var(--font-mono)" fontWeight="700">8</text>
    <text className="idg-output" x="435" y="84" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">result</text>
    {/* Bottom */}
    <text className="idg-note" x="260" y="118" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">Data flows in through parameters, out through return.</text>
  </svg>
);

/* ---- JS-to-React interactive diagrams ---- */

const InteractiveImperativeVsDeclarative = (
  <svg viewBox="0 0 520 150" fill="none">
    <text className="idg-title" x="130" y="15" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">IMPERATIVE (vanilla JS)</text>
    <text className="idg-title" x="390" y="15" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)">DECLARATIVE (React)</text>
    {/* Left: imperative steps */}
    {["1. Find element", "2. Read value", "3. Change DOM"].map((step, i) => (
      <g key={step}>
        <rect className="idg-input" x="30" y={28 + i * 38} width="200" height="30" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="none" />
        <text className="idg-input" x="130" y={48 + i * 38} textAnchor="middle" fill="var(--color-text-secondary)" fontSize="11" fontFamily="var(--font-mono)">{step}</text>
        {i < 2 && <line className="idg-input" x1="130" y1={58 + i * 38} x2="130" y2={66 + i * 38} stroke="var(--color-border)" strokeWidth="1" />}
      </g>
    ))}
    {/* Right: declarative */}
    <rect className="idg-output" x="290" y="28" width="200" height="30" rx="4" stroke="var(--color-accent-border)" strokeWidth="1" fill="var(--color-accent-dim)" />
    <text className="idg-output" x="390" y="48" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontFamily="var(--font-mono)">1. Set state</text>
    <line className="idg-output" x1="390" y1="58" x2="390" y2="70" stroke="var(--color-accent)" strokeWidth="1" />
    <rect className="idg-output" x="290" y="72" width="200" height="50" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" />
    <text className="idg-output" x="390" y="92" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">React updates the DOM</text>
    <text className="idg-process" x="390" y="110" textAnchor="middle" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)">automatically</text>
    <text className="idg-note" x="260" y="143" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">You tell the browser what to change vs. what the result should look like.</text>
  </svg>
);

const InteractiveEventComparison = (
  <svg viewBox="0 0 520 120" fill="none">
    {/* Vanilla */}
    <text className="idg-title" x="130" y="15" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">VANILLA JS</text>
    <rect className="idg-input" x="30" y="25" width="200" height="26" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="none" />
    <text className="idg-input" x="130" y="43" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">querySelector("#btn")</text>
    <line className="idg-input" x1="130" y1="51" x2="130" y2="60" stroke="var(--color-border)" strokeWidth="1" />
    <rect className="idg-input" x="30" y="62" width="200" height="26" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="none" />
    <text className="idg-input" x="130" y="80" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">addEventListener("click")</text>
    <text className="idg-note" x="130" y="106" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">2 steps, separate from markup</text>
    {/* React */}
    <text className="idg-title" x="390" y="15" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)">REACT</text>
    <rect className="idg-output" x="290" y="25" width="200" height="55" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" fill="var(--color-accent-dim)" />
    <text className="idg-output" x="390" y="48" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)">{"<button onClick={fn}>"}</text>
    <text className="idg-process" x="390" y="68" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">handler lives with element</text>
    <text className="idg-note" x="390" y="106" textAnchor="middle" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)">1 step, inline in JSX</text>
  </svg>
);

const InteractiveListRendering = (
  <svg viewBox="0 0 520 140" fill="none">
    <text className="idg-title" x="10" y="15" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">array.map() in JSX</text>
    {/* Source array */}
    {["Apple", "Banana", "Cherry"].map((item, i) => (
      <rect key={item} className="idg-input" x={10 + i * 100} y="25" width="88" height="30" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="none" />
    ))}
    {["Apple", "Banana", "Cherry"].map((item, i) => (
      <text key={`t-${item}`} className="idg-input" x={54 + i * 100} y="45" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="11" fontFamily="var(--font-mono)">{`"${item}"`}</text>
    ))}
    {/* Arrows */}
    {[0, 1, 2].map((i) => (
      <g key={`a-${i}`}>
        <line className="idg-arrow" x1={54 + i * 100} y1="58" x2={54 + i * 100} y2="75" stroke="var(--color-accent)" strokeWidth="1.5" />
        <polygon className="idg-arrow" points={`${49 + i * 100},73 ${54 + i * 100},80 ${59 + i * 100},73`} fill="var(--color-accent)" />
        <text className="idg-process" x={74 + i * 100} y="70" fill="var(--color-accent)" fontSize="8" fontFamily="var(--font-mono)">.map()</text>
      </g>
    ))}
    {/* Output list items */}
    {["Apple", "Banana", "Cherry"].map((item, i) => (
      <g key={`li-${item}`}>
        <rect className="idg-output" x={10 + i * 100} y="84" width="88" height="30" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" fill="var(--color-accent-dim)" />
        <text className="idg-output" x={54 + i * 100} y="104" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)">{`<li>${item}</li>`}</text>
      </g>
    ))}
    <text className="idg-note" x="160" y="133" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">Each array item becomes a JSX element.</text>
  </svg>
);

const InteractiveConditionalRender = (
  <svg viewBox="0 0 520 140" fill="none">
    <text className="idg-title" x="10" y="15" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">conditional rendering</text>
    {/* State box */}
    <rect className="idg-input" x="180" y="25" width="160" height="30" rx="4" stroke="var(--color-accent-border)" strokeWidth="1" fill="var(--color-accent-dim)" />
    <text className="idg-input" x="260" y="45" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontFamily="var(--font-mono)">isOpen = true / false</text>
    {/* Branch lines */}
    <line className="idg-arrow" x1="220" y1="55" x2="120" y2="80" stroke="var(--color-accent)" strokeWidth="1.5" />
    <line className="idg-arrow" x1="300" y1="55" x2="400" y2="80" stroke="var(--color-border)" strokeWidth="1.5" />
    <text className="idg-process" x="155" y="72" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)">true</text>
    <text className="idg-process" x="350" y="72" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">false</text>
    {/* True branch */}
    <rect className="idg-output" x="30" y="84" width="180" height="35" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" fill="var(--color-accent-dim)" />
    <text className="idg-output" x="120" y="106" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontFamily="var(--font-mono)">{"<Panel />"} renders</text>
    {/* False branch */}
    <rect className="idg-output" x="310" y="84" width="180" height="35" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="none" />
    <text className="idg-output" x="400" y="106" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="11" fontFamily="var(--font-mono)">nothing renders</text>
    <text className="idg-note" x="260" y="138" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">State controls what appears on screen.</text>
  </svg>
);

/* ---- React concepts interactive diagrams ---- */

const InteractivePropsFlow = (
  <svg viewBox="0 0 520 150" fill="none">
    <text className="idg-title" x="10" y="15" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">props flow one direction: parent → child</text>
    {/* Parent */}
    <rect className="idg-input" x="170" y="25" width="180" height="35" rx="6" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" />
    <text className="idg-input" x="260" y="48" textAnchor="middle" fill="var(--color-accent)" fontSize="12" fontFamily="var(--font-mono)" fontWeight="600">{"<App />"}</text>
    {/* Props flowing down */}
    <line className="idg-arrow" x1="200" y1="60" x2="120" y2="88" stroke="var(--color-accent)" strokeWidth="1.5" />
    <polygon className="idg-arrow" points="116,84 124,92 128,83" fill="var(--color-accent)" />
    <text className="idg-process" x="145" y="78" fill="var(--color-accent)" fontSize="8" fontFamily="var(--font-mono)">name="Alex"</text>
    <line className="idg-arrow" x1="320" y1="60" x2="400" y2="88" stroke="var(--color-accent)" strokeWidth="1.5" />
    <polygon className="idg-arrow" points="396,84 404,92 408,83" fill="var(--color-accent)" />
    <text className="idg-process" x="365" y="78" fill="var(--color-accent)" fontSize="8" fontFamily="var(--font-mono)">items={"{[]}"}</text>
    {/* Children */}
    <rect className="idg-output" x="40" y="92" width="160" height="35" rx="4" stroke="var(--color-accent-border)" strokeWidth="1" fill="var(--color-accent-dim)" />
    <text className="idg-output" x="120" y="114" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="11" fontFamily="var(--font-mono)">{"<Header name={} />"}</text>
    <rect className="idg-output" x="320" y="92" width="160" height="35" rx="4" stroke="var(--color-accent-border)" strokeWidth="1" fill="var(--color-accent-dim)" />
    <text className="idg-output" x="400" y="114" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="11" fontFamily="var(--font-mono)">{"<List items={} />"}</text>
    <text className="idg-note" x="260" y="148" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">Data flows down. Children cannot send props back up.</text>
  </svg>
);

const InteractiveStateRender = (
  <svg viewBox="0 0 520 120" fill="none">
    <text className="idg-title" x="10" y="15" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">state change → re-render cycle</text>
    {/* Cycle */}
    {[{ label: "state = 0", x: 30 }, { label: "click +1", x: 170 }, { label: "setState(1)", x: 310 }].map((s, i) => (
      <g key={s.label}>
        <rect className={i === 0 ? "idg-input" : i === 1 ? "idg-process" : "idg-output"} x={s.x} y="30" width="120" height="35" rx="4" stroke={i === 2 ? "var(--color-accent)" : "var(--color-border)"} strokeWidth={i === 2 ? 1.5 : 1} fill={i === 2 ? "var(--color-accent-dim)" : "none"} />
        <text className={i === 0 ? "idg-input" : i === 1 ? "idg-process" : "idg-output"} x={s.x + 60} y="52" textAnchor="middle" fill={i === 2 ? "var(--color-accent)" : "var(--color-text-secondary)"} fontSize="11" fontFamily="var(--font-mono)">{s.label}</text>
        {i < 2 && (
          <g>
            <line className="idg-arrow" x1={s.x + 125} y1="47" x2={s.x + 162} y2="47" stroke="var(--color-accent)" strokeWidth="1.5" />
            <polygon className="idg-arrow" points={`${s.x + 160},42 ${s.x + 168},47 ${s.x + 160},52`} fill="var(--color-accent)" />
          </g>
        )}
      </g>
    ))}
    {/* Re-render arrow looping back */}
    <path className="idg-arrow" d="M370 68 Q400 100 260 100 Q120 100 60 68" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="4" fill="none" />
    <polygon className="idg-arrow" points="55,70 60,62 65,70" fill="var(--color-accent)" />
    <text className="idg-note" x="260" y="95" textAnchor="middle" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)">re-render with new state</text>
  </svg>
);

const InteractiveUseEffect = (
  <svg viewBox="0 0 520 120" fill="none">
    <text className="idg-title" x="10" y="15" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">useEffect timing</text>
    {/* Timeline */}
    <line className="idg-arrow" x1="30" y1="55" x2="490" y2="55" stroke="var(--color-border)" strokeWidth="1" />
    {[{ label: "render", x: 80 }, { label: "DOM painted", x: 220 }, { label: "effect runs", x: 370 }].map((s, i) => (
      <g key={s.label}>
        <circle className={i === 2 ? "idg-output" : "idg-input"} cx={s.x} cy="55" r="6" fill={i === 2 ? "var(--color-accent)" : "var(--color-text-secondary)"} />
        <text className={i === 2 ? "idg-output" : "idg-input"} x={s.x} y="42" textAnchor="middle" fill={i === 2 ? "var(--color-accent)" : "var(--color-text-secondary)"} fontSize="10" fontFamily="var(--font-mono)">{s.label}</text>
      </g>
    ))}
    {/* Dependency array */}
    <rect className="idg-process" x="310" y="72" width="130" height="24" rx="4" stroke="var(--color-accent-border)" strokeWidth="1" fill="var(--color-accent-dim)" />
    <text className="idg-process" x="375" y="88" textAnchor="middle" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)">[deps] control re-run</text>
    <text className="idg-note" x="260" y="115" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">[] = once on mount. [count] = when count changes. No array = every render.</text>
  </svg>
);

const InteractiveKeysTracking = (
  <svg viewBox="0 0 520 140" fill="none">
    <text className="idg-title" x="10" y="15" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">keys help React track list items</text>
    {/* Before */}
    <text className="idg-input" x="130" y="35" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">before</text>
    {["A", "B", "C"].map((k, i) => (
      <g key={`b-${k}`}>
        <rect className="idg-input" x={30 + i * 80} y="42" width="65" height="28" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="none" />
        <text className="idg-input" x={62 + i * 80} y="61" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="11" fontFamily="var(--font-mono)">key={`"${k}"`}</text>
      </g>
    ))}
    {/* Arrows showing identity preserved */}
    <line className="idg-arrow" x1="62" y1="72" x2="142" y2="88" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="4" />
    <line className="idg-arrow" x1="142" y1="72" x2="62" y2="88" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="4" />
    <line className="idg-arrow" x1="222" y1="72" x2="222" y2="88" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="4" />
    {/* After (reordered) */}
    <text className="idg-output" x="130" y="102" textAnchor="middle" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)">after reorder</text>
    {["B", "A", "C"].map((k, i) => (
      <g key={`a-${k}`}>
        <rect className="idg-output" x={30 + i * 80} y="108" width="65" height="28" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" fill="var(--color-accent-dim)" />
        <text className="idg-output" x={62 + i * 80} y="127" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontFamily="var(--font-mono)">key={`"${k}"`}</text>
      </g>
    ))}
    <text className="idg-note" x="380" y="80" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">Keys let React move</text>
    <text className="idg-note" x="380" y="93" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">elements, not rebuild.</text>
  </svg>
);

/* ---- SCSS interactive diagrams ---- */

const InteractiveNesting = (
  <svg viewBox="0 0 520 150" fill="none">
    <text className="idg-title" x="10" y="15" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">SCSS nesting → compiled CSS</text>
    {/* SCSS side */}
    <rect className="idg-input" x="10" y="25" width="210" height="115" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" />
    <text className="idg-input" x="25" y="45" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)">.card {"{"}</text>
    <rect className="idg-input" x="30" y="52" width="170" height="35" rx="3" stroke="var(--color-accent-border)" strokeWidth="1" fill="var(--color-accent-dim)" />
    <text className="idg-input" x="45" y="68" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">.card-title {"{"}</text>
    <rect className="idg-input" x="55" y="76" width="125" height="20" rx="3" stroke="var(--color-border)" strokeWidth="1" fill="none" />
    <text className="idg-input" x="70" y="90" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)">&amp;:hover {"{"} ... {"}"}</text>
    <text className="idg-input" x="45" y="108" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">{"}"}</text>
    <text className="idg-input" x="25" y="130" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)">{"}"}</text>
    {/* Arrow */}
    <line className="idg-arrow" x1="230" y1="82" x2="275" y2="82" stroke="var(--color-accent)" strokeWidth="1.5" />
    <polygon className="idg-arrow" points="275,77 285,82 275,87" fill="var(--color-accent)" />
    <text className="idg-process" x="258" y="75" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)">compiles</text>
    {/* CSS output */}
    <rect className="idg-output" x="290" y="25" width="220" height="115" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="none" />
    <text className="idg-output" x="305" y="47" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">.card {"{"} ... {"}"}</text>
    <text className="idg-output" x="305" y="72" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">.card .card-title {"{"} ... {"}"}</text>
    <text className="idg-output" x="305" y="97" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">.card .card-title:hover {"{"} ... {"}"}</text>
    <text className="idg-note" x="400" y="130" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)">flat selectors in output</text>
  </svg>
);

const InteractiveMixin = (
  <svg viewBox="0 0 520 140" fill="none">
    <text className="idg-title" x="10" y="15" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">@mixin → @include</text>
    {/* Mixin definition */}
    <rect className="idg-input" x="10" y="25" width="180" height="60" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" />
    <text className="idg-input" x="100" y="45" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">@mixin flex-center</text>
    <text className="idg-input" x="100" y="62" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">display: flex</text>
    <text className="idg-input" x="100" y="76" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">align + justify: center</text>
    {/* Arrows to two uses */}
    <line className="idg-arrow" x1="195" y1="45" x2="250" y2="35" stroke="var(--color-accent)" strokeWidth="1" />
    <line className="idg-arrow" x1="195" y1="65" x2="250" y2="95" stroke="var(--color-accent)" strokeWidth="1" />
    {/* Usage blocks */}
    <rect className="idg-output" x="255" y="20" width="210" height="38" rx="4" stroke="var(--color-accent-border)" strokeWidth="1" fill="var(--color-accent-dim)" />
    <text className="idg-output" x="360" y="36" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">.hero {"{"} @include flex-center {"}"}</text>
    <text className="idg-process" x="360" y="50" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)">styles injected here</text>
    <rect className="idg-output" x="255" y="80" width="210" height="38" rx="4" stroke="var(--color-accent-border)" strokeWidth="1" fill="var(--color-accent-dim)" />
    <text className="idg-output" x="360" y="96" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">.modal {"{"} @include flex-center {"}"}</text>
    <text className="idg-process" x="360" y="110" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)">same styles, no repetition</text>
    <text className="idg-note" x="260" y="136" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">Define once, reuse anywhere.</text>
  </svg>
);

const InteractivePartials = (
  <svg viewBox="0 0 520 140" fill="none">
    <text className="idg-title" x="10" y="15" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">partials → main.scss</text>
    {/* Partial files */}
    {[{ name: "_variables.scss", y: 25, desc: "tokens" }, { name: "_base.scss", y: 62, desc: "reset" }, { name: "_shared.scss", y: 99, desc: "utilities" }].map((f) => (
      <g key={f.name}>
        <rect className="idg-input" x="10" y={f.y} width="170" height="28" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="none" />
        <text className="idg-input" x="20" y={f.y + 18} fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">{f.name}</text>
        <text className="idg-input" x="160" y={f.y + 18} textAnchor="end" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)">{f.desc}</text>
        <line className="idg-arrow" x1="185" y1={f.y + 14} x2="280" y2="68" stroke="var(--color-accent)" strokeWidth="1" />
      </g>
    ))}
    <polygon className="idg-arrow" points="278,63 288,68 278,73" fill="var(--color-accent)" />
    {/* Main file */}
    <rect className="idg-output" x="290" y="40" width="180" height="58" rx="6" stroke="var(--color-accent)" strokeWidth="1.5" fill="var(--color-accent-dim)" />
    <text className="idg-output" x="380" y="60" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">main.scss</text>
    <text className="idg-output" x="380" y="78" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">@use for each partial</text>
    <text className="idg-output" x="380" y="90" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">combines everything</text>
    <text className="idg-note" x="260" y="130" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">Split styles into small files, import into one entry point.</text>
  </svg>
);

/* ---- Accessibility interactive diagrams ---- */

const InteractiveSemanticHtml = (
  <svg viewBox="0 0 520 130" fill="none">
    <text className="idg-title" x="10" y="15" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">semantic HTML vs. generic divs</text>
    {/* Bad */}
    <rect className="idg-input" x="10" y="28" width="240" height="90" rx="4" stroke="#ff5370" strokeWidth="1" fill="none" />
    <text className="idg-input" x="130" y="46" textAnchor="middle" fill="#ff5370" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">{"<div onclick>"}</text>
    <text className="idg-input" x="130" y="66" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">no keyboard support</text>
    <text className="idg-input" x="130" y="80" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">no screen reader label</text>
    <text className="idg-input" x="130" y="94" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">no focus management</text>
    <text className="idg-process" x="130" y="111" textAnchor="middle" fill="#ff5370" fontSize="9" fontFamily="var(--font-mono)">you build it all manually</text>
    {/* Good */}
    <rect className="idg-output" x="270" y="28" width="240" height="90" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" fill="var(--color-accent-dim)" />
    <text className="idg-output" x="390" y="46" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">{"<button>"}</text>
    <text className="idg-output" x="390" y="66" textAnchor="middle" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)">Enter + Space to activate</text>
    <text className="idg-output" x="390" y="80" textAnchor="middle" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)">announced as "button"</text>
    <text className="idg-output" x="390" y="94" textAnchor="middle" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)">focusable by default</text>
    <text className="idg-process" x="390" y="111" textAnchor="middle" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)">all free, built in</text>
  </svg>
);

const InteractiveContrast = (
  <svg viewBox="0 0 520 110" fill="none">
    <text className="idg-title" x="10" y="15" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">colour contrast comparison</text>
    {/* Fail */}
    <rect className="idg-input" x="10" y="28" width="240" height="50" rx="4" fill="#ffffff" stroke="#ddd" strokeWidth="1" />
    <text className="idg-input" x="130" y="58" textAnchor="middle" fill="#aaaaaa" fontSize="14" fontFamily="var(--font-body)">Light grey on white</text>
    <text className="idg-process" x="130" y="96" textAnchor="middle" fill="#ff5370" fontSize="10" fontFamily="var(--font-mono)">ratio 2.3:1 - FAIL</text>
    {/* Pass */}
    <rect className="idg-output" x="270" y="28" width="240" height="50" rx="4" fill="#0b0b0b" stroke="var(--color-border)" strokeWidth="1" />
    <text className="idg-output" x="390" y="58" textAnchor="middle" fill="#f2f2ee" fontSize="14" fontFamily="var(--font-body)">Light text on dark</text>
    <text className="idg-process" x="390" y="96" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)">ratio 18.1:1 - PASS AA</text>
  </svg>
);

const InteractiveFocusOrder = (
  <svg viewBox="0 0 520 120" fill="none">
    <text className="idg-title" x="10" y="15" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">Tab key moves through interactive elements</text>
    {/* Elements in tab order */}
    {[{ label: "Logo link", x: 10 }, { label: "Nav link", x: 120 }, { label: "Button", x: 230 }, { label: "Input", x: 340 }].map((el, i) => (
      <g key={el.label}>
        <rect className={i === 2 ? "idg-output" : "idg-input"} x={el.x} y="30" width="95" height="35" rx="4" stroke={i === 2 ? "var(--color-accent)" : "var(--color-border)"} strokeWidth={i === 2 ? 2 : 1} fill={i === 2 ? "var(--color-accent-dim)" : "none"} />
        <text className={i === 2 ? "idg-output" : "idg-input"} x={el.x + 48} y="52" textAnchor="middle" fill={i === 2 ? "var(--color-accent)" : "var(--color-text-secondary)"} fontSize="10" fontFamily="var(--font-mono)">{el.label}</text>
        {i === 2 && <text className="idg-process" x={el.x + 48} y="80" textAnchor="middle" fill="var(--color-accent)" fontSize="8" fontFamily="var(--font-mono)">:focus-visible</text>}
        {i < 3 && (
          <g>
            <line className="idg-arrow" x1={el.x + 100} y1="47" x2={el.x + 115} y2="47" stroke="var(--color-accent)" strokeWidth="1" />
            <polygon className="idg-arrow" points={`${el.x + 113},43 ${el.x + 120},47 ${el.x + 113},51`} fill="var(--color-accent)" />
            <text className="idg-process" x={el.x + 108} y="40" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="7" fontFamily="var(--font-mono)">Tab</text>
          </g>
        )}
      </g>
    ))}
    <text className="idg-note" x="260" y="110" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">Every interactive element must be reachable and have a visible focus indicator.</text>
  </svg>
);

/* ---- Extra JS essentials interactive diagrams ---- */

const InteractiveVariables = (
  <svg viewBox="0 0 520 110" fill="none">
    <text className="idg-title" x="10" y="15" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">let vs. const</text>
    {/* let */}
    <rect className="idg-input" x="10" y="30" width="220" height="65" rx="4" stroke="var(--color-accent-border)" strokeWidth="1" fill="none" />
    <text className="idg-input" x="120" y="48" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">let score = 0</text>
    <line className="idg-input" x1="120" y1="55" x2="120" y2="65" stroke="var(--color-accent)" strokeWidth="1" />
    <text className="idg-output" x="120" y="78" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontFamily="var(--font-mono)">score = 10</text>
    <text className="idg-note" x="120" y="88" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)">can change</text>
    {/* const */}
    <rect className="idg-input" x="280" y="30" width="220" height="65" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="none" />
    <text className="idg-input" x="390" y="48" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">const name = "Alex"</text>
    <line className="idg-input" x1="390" y1="55" x2="390" y2="65" stroke="#ff5370" strokeWidth="1" />
    <text className="idg-process" x="390" y="78" textAnchor="middle" fill="#ff5370" fontSize="11" fontFamily="var(--font-mono)">name = "Sam"</text>
    <text className="idg-note" x="390" y="88" textAnchor="middle" fill="#ff5370" fontSize="8" fontFamily="var(--font-mono)">error: cannot reassign</text>
  </svg>
);

const InteractiveConditional = (
  <svg viewBox="0 0 520 130" fill="none">
    <text className="idg-title" x="10" y="15" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)">if / else decision flow</text>
    {/* Condition */}
    <rect className="idg-input" x="170" y="25" width="180" height="30" rx="15" stroke="var(--color-accent-border)" strokeWidth="1" fill="var(--color-accent-dim)" />
    <text className="idg-input" x="260" y="45" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontFamily="var(--font-mono)">age &gt;= 18 ?</text>
    {/* Branches */}
    <line className="idg-arrow" x1="210" y1="55" x2="120" y2="78" stroke="var(--color-accent)" strokeWidth="1.5" />
    <line className="idg-arrow" x1="310" y1="55" x2="400" y2="78" stroke="var(--color-border)" strokeWidth="1.5" />
    <text className="idg-process" x="150" y="70" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)">true</text>
    <text className="idg-process" x="358" y="70" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">false</text>
    {/* True */}
    <rect className="idg-output" x="30" y="82" width="180" height="32" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" fill="var(--color-accent-dim)" />
    <text className="idg-output" x="120" y="103" textAnchor="middle" fill="var(--color-accent)" fontSize="12" fontFamily="var(--font-mono)" fontWeight="600">"Adult"</text>
    {/* False */}
    <rect className="idg-output" x="310" y="82" width="180" height="32" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="none" />
    <text className="idg-output" x="400" y="103" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="12" fontFamily="var(--font-mono)">"Minor"</text>
  </svg>
);

function JavaScriptIllustration() {
  const svgRef = useRef(null);
  const { isReduced } = useTheme();

  useEffect(() => {
    if (isReduced || !svgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".jsi-bracket", { opacity: 0, scale: 0.5 }, {
        opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, delay: 0.2, ease: "back.out(2)",
      });
      gsap.fromTo(".jsi-line", { scaleX: 0 }, {
        scaleX: 1, duration: 0.4, stagger: 0.08, delay: 0.5, ease: "power2.out",
      });
      gsap.fromTo(".jsi-label", { opacity: 0, y: 8 }, {
        opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.8, ease: "power2.out",
      });
      gsap.to(".jsi-cursor", {
        opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: "steps(1)", delay: 1.2,
      });
    }, svgRef);
    return () => ctx.revert();
  }, [isReduced]);

  return (
    <svg ref={svgRef} className="article-illustration" viewBox="0 0 400 280" fill="none">
      {/* Central JS badge */}
      <rect x="150" y="20" width="100" height="50" rx="6" fill="#f7df1e" opacity="0.15" stroke="#f7df1e" strokeWidth="1.5" />
      <text className="jsi-bracket" x="200" y="52" textAnchor="middle" fill="#f7df1e" fontSize="22" fontFamily="var(--font-mono)" fontWeight="800" style={{ transformOrigin: "200px 45px" }}>JS</text>
      {/* Code editor frame */}
      <rect className="jsi-bracket" x="60" y="90" width="280" height="160" rx="6" stroke="var(--color-border)" strokeWidth="1" fill="none" style={{ transformOrigin: "200px 170px" }} />
      {/* Title bar dots */}
      <circle className="jsi-label" cx="80" cy="105" r="4" fill="#ff5f56" opacity="0.6" />
      <circle className="jsi-label" cx="95" cy="105" r="4" fill="#ffbd2e" opacity="0.6" />
      <circle className="jsi-label" cx="110" cy="105" r="4" fill="#27ca3f" opacity="0.6" />
      <line x1="60" y1="115" x2="340" y2="115" stroke="var(--color-border)" strokeWidth="1" />
      {/* Code lines */}
      <text className="jsi-label" x="80" y="138" fill="#c792ea" fontSize="11" fontFamily="var(--font-mono)">const</text>
      <rect className="jsi-line" x="118" y="128" width="80" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.4" style={{ transformOrigin: "118px 129px" }} />
      <text className="jsi-label" x="80" y="158" fill="#c792ea" fontSize="11" fontFamily="var(--font-mono)">function</text>
      <rect className="jsi-line" x="140" y="148" width="100" height="2" rx="1" fill="var(--color-accent-border)" opacity="0.4" style={{ transformOrigin: "140px 149px" }} />
      <rect className="jsi-line" x="95" y="168" width="60" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.3" style={{ transformOrigin: "95px 169px" }} />
      <text className="jsi-label" x="80" y="190" fill="#89ddff" fontSize="11" fontFamily="var(--font-mono)">{"}"}</text>
      <rect className="jsi-line" x="80" y="200" width="120" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.3" style={{ transformOrigin: "80px 201px" }} />
      <rect className="jsi-line" x="80" y="215" width="90" height="2" rx="1" fill="var(--color-accent-border)" opacity="0.3" style={{ transformOrigin: "80px 216px" }} />
      {/* Blinking cursor */}
      <rect className="jsi-cursor" x="175" y="210" width="2" height="14" fill="var(--color-accent)" />
      {/* Bottom labels */}
      <text className="jsi-label" x="115" y="268" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)">VARIABLES</text>
      <text className="jsi-label" x="200" y="268" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)">FUNCTIONS</text>
      <text className="jsi-label" x="285" y="268" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)">OBJECTS</text>
    </svg>
  );
}

function AnimationIllustration() {
  const svgRef = useRef(null);
  const { isReduced } = useTheme();

  useEffect(() => {
    if (isReduced || !svgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".anim-bar", { scaleX: 0 }, {
        scaleX: 1, duration: 0.6, stagger: 0.12, delay: 0.3, ease: "power2.out",
      });
      gsap.fromTo(".anim-dot", { scale: 0, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.4, stagger: 0.1, delay: 0.6, ease: "back.out(2)",
      });
      gsap.fromTo(".anim-label", { opacity: 0, y: 6 }, {
        opacity: 1, y: 0, duration: 0.35, stagger: 0.08, delay: 0.9, ease: "power2.out",
      });
      gsap.to(".anim-playhead", {
        x: 300, duration: 3, repeat: -1, ease: "none", delay: 1.2,
      });
    }, svgRef);
    return () => ctx.revert();
  }, [isReduced]);

  return (
    <svg ref={svgRef} className="article-illustration" viewBox="0 0 400 280" fill="none">
      {/* Timeline tracks */}
      <text className="anim-label" x="20" y="30" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="2">GSAP TIMELINE</text>
      {[{ y: 50, w: 200, label: "opacity", color: "var(--color-accent)" }, { y: 80, w: 150, label: "y", color: "var(--color-accent-border)" }, { y: 110, w: 180, label: "scale", color: "var(--color-accent)" }, { y: 140, w: 120, label: "skewY", color: "var(--color-accent-border)" }, { y: 170, w: 250, label: "clipPath", color: "var(--color-accent)" }].map((t) => (
        <g key={t.label}>
          <text className="anim-label" x="20" y={t.y + 12} fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)">{t.label}</text>
          <rect className="anim-bar" x="90" y={t.y} width={t.w} height="16" rx="3" fill={t.color} opacity="0.2" style={{ transformOrigin: `90px ${t.y + 8}px` }} />
          <circle className="anim-dot" cx="90" cy={t.y + 8} r="4" fill={t.color} style={{ transformOrigin: `90px ${t.y + 8}px` }} />
          <circle className="anim-dot" cx={90 + t.w} cy={t.y + 8} r="4" fill={t.color} style={{ transformOrigin: `${90 + t.w}px ${t.y + 8}px` }} />
        </g>
      ))}
      {/* Playhead */}
      <line className="anim-playhead" x1="90" y1="42" x2="90" y2="194" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.6" />
      {/* Easing curve */}
      <text className="anim-label" x="20" y="220" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="2">EASING</text>
      <rect className="anim-label" x="90" y="210" width="280" height="60" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="none" />
      <path className="anim-bar" d="M90 270 C150 270 160 210 370 210" stroke="var(--color-accent)" strokeWidth="2" fill="none" style={{ transformOrigin: "90px 240px" }} />
      <text className="anim-label" x="200" y="256" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)">power3.out</text>
    </svg>
  );
}

function LivingPortfolioIllustration() {
  const svgRef = useRef(null);
  const { isReduced } = useTheme();

  useEffect(() => {
    if (isReduced || !svgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".lp-branch", { scaleY: 0 }, {
        scaleY: 1, duration: 0.5, stagger: 0.15, delay: 0.3, ease: "power2.out",
      });
      gsap.fromTo(".lp-commit", { scale: 0, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.35, stagger: 0.08, delay: 0.6, ease: "back.out(2)",
      });
      gsap.fromTo(".lp-label", { opacity: 0, y: 6 }, {
        opacity: 1, y: 0, duration: 0.3, stagger: 0.06, delay: 1.0, ease: "power2.out",
      });
      gsap.fromTo(".lp-arrow", { scaleX: 0, opacity: 0 }, {
        scaleX: 1, opacity: 1, duration: 0.4, stagger: 0.1, delay: 1.3, ease: "power2.out",
      });
    }, svgRef);
    return () => ctx.revert();
  }, [isReduced]);

  return (
    <svg ref={svgRef} className="article-illustration" viewBox="0 0 400 280" fill="none">
      {/* Main branch line */}
      <line className="lp-branch" x1="60" y1="30" x2="60" y2="260" stroke="var(--color-accent-alt)" strokeWidth="3" style={{ transformOrigin: "60px 30px" }} />
      {/* Feature branches */}
      <line className="lp-branch" x1="60" y1="70" x2="160" y2="70" stroke="var(--color-accent)" strokeWidth="2" opacity="0.5" style={{ transformOrigin: "60px 70px" }} />
      <line className="lp-branch" x1="160" y1="70" x2="160" y2="110" stroke="var(--color-accent)" strokeWidth="2" opacity="0.5" style={{ transformOrigin: "160px 70px" }} />
      <line className="lp-branch" x1="60" y1="140" x2="200" y2="140" stroke="var(--color-accent)" strokeWidth="2" opacity="0.5" style={{ transformOrigin: "60px 140px" }} />
      <line className="lp-branch" x1="200" y1="140" x2="200" y2="180" stroke="var(--color-accent)" strokeWidth="2" opacity="0.5" style={{ transformOrigin: "200px 140px" }} />
      <line className="lp-branch" x1="60" y1="210" x2="140" y2="210" stroke="var(--color-accent)" strokeWidth="2" opacity="0.5" style={{ transformOrigin: "60px 210px" }} />
      {/* Main branch commits */}
      {[70, 110, 140, 180, 210, 250].map((y) => (
        <circle key={y} className="lp-commit" cx="60" cy={y} r="6" fill="var(--color-accent-alt)" style={{ transformOrigin: `60px ${y}px` }} />
      ))}
      {/* Feature branch commits */}
      <circle className="lp-commit" cx="160" cy="90" r="5" fill="var(--color-accent)" style={{ transformOrigin: "160px 90px" }} />
      <circle className="lp-commit" cx="200" cy="160" r="5" fill="var(--color-accent)" style={{ transformOrigin: "200px 160px" }} />
      <circle className="lp-commit" cx="140" cy="210" r="5" fill="var(--color-accent)" style={{ transformOrigin: "140px 210px" }} />
      {/* Deploy arrows */}
      <line className="lp-arrow" x1="80" y1="110" x2="280" y2="110" stroke="var(--color-accent-alt)" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" style={{ transformOrigin: "80px 110px" }} />
      <line className="lp-arrow" x1="80" y1="180" x2="280" y2="180" stroke="var(--color-accent-alt)" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" style={{ transformOrigin: "80px 180px" }} />
      <line className="lp-arrow" x1="80" y1="250" x2="280" y2="250" stroke="var(--color-accent-alt)" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" style={{ transformOrigin: "80px 250px" }} />
      {/* Deploy labels */}
      <text className="lp-label" x="290" y="114" fill="var(--color-accent-alt)" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="1">v1.0</text>
      <text className="lp-label" x="290" y="184" fill="var(--color-accent-alt)" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="1">v2.0</text>
      <text className="lp-label" x="290" y="254" fill="var(--color-accent-alt)" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="1">v3.0</text>
      {/* Branch labels */}
      <text className="lp-label" x="40" y="20" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="2">MAIN</text>
      <text className="lp-label" x="130" y="60" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)">feature/</text>
      <text className="lp-label" x="170" y="130" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)">feature/</text>
      <text className="lp-label" x="110" y="200" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)">fix/</text>
      {/* Right side: iteration blocks */}
      <rect className="lp-label" x="290" y="40" width="90" height="24" rx="4" fill="var(--color-surface-raised)" stroke="var(--color-border)" strokeWidth="1" />
      <text className="lp-label" x="335" y="56" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">SHIP</text>
      <rect className="lp-label" x="290" y="70" width="90" height="24" rx="4" fill="var(--color-surface-raised)" stroke="var(--color-border)" strokeWidth="1" />
      <text className="lp-label" x="335" y="86" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">MEASURE</text>
      <rect className="lp-label" x="290" y="100" width="90" height="24" rx="4" fill="var(--color-surface-raised)" stroke="var(--color-border)" strokeWidth="1" />
      <text className="lp-label" x="335" y="116" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">ITERATE</text>
    </svg>
  );
}

const InteractiveNoSweatArch = (
  <svg viewBox="0 0 520 200" fill="none">
    <text className="idg-title" x="260" y="15" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="1">NOSWEAT ARCHITECTURE</text>
    {/* Frontend layer */}
    <rect className="idg-input" x="30" y="28" width="460" height="34" rx="4" stroke="var(--color-accent-border)" strokeWidth="1" fill="var(--color-accent-dim)" />
    <text className="idg-input" x="50" y="50" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="500">React 19 + TypeScript + Vite</text>
    <text className="idg-input" x="460" y="50" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="end">FRONTEND</text>
    {/* Arrows down */}
    <line className="idg-arrow" x1="160" y1="62" x2="160" y2="74" stroke="var(--color-border)" strokeWidth="1" />
    <line className="idg-arrow" x1="360" y1="62" x2="360" y2="74" stroke="var(--color-border)" strokeWidth="1" />
    {/* API layer */}
    <rect className="idg-arrow" x="30" y="76" width="220" height="34" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="var(--color-surface-raised)" />
    <text className="idg-arrow" x="50" y="98" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">Express (dev)</text>
    <rect className="idg-arrow" x="270" y="76" width="220" height="34" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="var(--color-surface-raised)" />
    <text className="idg-arrow" x="290" y="98" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">Vercel Serverless (prod)</text>
    <text className="idg-arrow" x="460" y="98" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="end">API</text>
    {/* Arrows down */}
    <line className="idg-process" x1="260" y1="110" x2="260" y2="122" stroke="var(--color-border)" strokeWidth="1" />
    {/* Database layer */}
    <rect className="idg-process" x="30" y="124" width="460" height="34" rx="4" stroke="#3ecf8e" strokeWidth="1" fill="rgba(62, 207, 142, 0.08)" />
    <text className="idg-process" x="50" y="146" fill="#3ecf8e" fontSize="10" fontFamily="var(--font-mono)" fontWeight="500">Supabase + PostgreSQL + RLS</text>
    <text className="idg-process" x="460" y="146" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="end">DATABASE</text>
    {/* External services */}
    <rect className="idg-output" x="30" y="168" width="140" height="28" rx="4" stroke="#635bff" strokeWidth="1" fill="rgba(99, 91, 255, 0.08)" />
    <text className="idg-output" x="100" y="186" textAnchor="middle" fill="#635bff" fontSize="9" fontFamily="var(--font-mono)">Stripe Connect</text>
    <rect className="idg-output" x="185" y="168" width="100" height="28" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="var(--color-surface-raised)" />
    <text className="idg-output" x="235" y="186" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">Resend</text>
    <rect className="idg-output" x="300" y="168" width="190" height="28" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="var(--color-surface-raised)" />
    <text className="idg-output" x="395" y="186" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">QuickBooks / Xero</text>
    <text className="idg-output" x="460" y="146" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="end">DATABASE</text>
    {/* Note */}
    <text className="idg-note" x="260" y="146" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)">59 migrations</text>
  </svg>
);

const InteractiveTenantFlow = (
  <svg viewBox="0 0 520 170" fill="none">
    <text className="idg-title" x="260" y="15" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="1">GYM ONBOARDING FLOW</text>
    {/* Step 1: Owner signs up */}
    <rect className="idg-input" x="10" y="30" width="100" height="50" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="none" />
    <text className="idg-input" x="60" y="52" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">Owner</text>
    <text className="idg-input" x="60" y="68" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">signs up</text>
    {/* Arrow 1 */}
    <line className="idg-arrow" x1="115" y1="55" x2="145" y2="55" stroke="var(--color-accent)" strokeWidth="1.5" />
    <polygon className="idg-arrow" points="143,50 150,55 143,60" fill="var(--color-accent)" />
    {/* Step 2: Tenant created */}
    <rect className="idg-arrow" x="155" y="30" width="100" height="50" rx="4" stroke="var(--color-accent-border)" strokeWidth="1" fill="var(--color-accent-dim)" />
    <text className="idg-arrow" x="205" y="52" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)">Tenant</text>
    <text className="idg-arrow" x="205" y="68" textAnchor="middle" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)">created</text>
    {/* Arrow 2 */}
    <line className="idg-process" x1="260" y1="55" x2="290" y2="55" stroke="var(--color-accent)" strokeWidth="1.5" />
    <polygon className="idg-process" points="288,50 295,55 288,60" fill="var(--color-accent)" />
    {/* Step 3: RLS */}
    <rect className="idg-process" x="300" y="30" width="100" height="50" rx="4" stroke="#3ecf8e" strokeWidth="1.5" fill="rgba(62, 207, 142, 0.08)" />
    <text className="idg-process" x="350" y="52" textAnchor="middle" fill="#3ecf8e" fontSize="10" fontFamily="var(--font-mono)">RLS</text>
    <text className="idg-process" x="350" y="68" textAnchor="middle" fill="#3ecf8e" fontSize="9" fontFamily="var(--font-mono)">isolates</text>
    {/* Arrow 3 */}
    <line className="idg-output" x1="405" y1="55" x2="435" y2="55" stroke="var(--color-accent)" strokeWidth="1.5" />
    <polygon className="idg-output" points="433,50 440,55 433,60" fill="var(--color-accent)" />
    {/* Step 4: Storefront */}
    <rect className="idg-output" x="445" y="30" width="70" height="50" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" fill="var(--color-accent-dim)" />
    <text className="idg-output" x="480" y="50" textAnchor="middle" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)">/gym</text>
    <text className="idg-output" x="480" y="66" textAnchor="middle" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)">/:slug</text>
    {/* Isolation detail */}
    <rect className="idg-process" x="155" y="100" width="100" height="34" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="none" />
    <text className="idg-process" x="205" y="121" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">Gym A data</text>
    <rect className="idg-process" x="270" y="100" width="100" height="34" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="none" />
    <text className="idg-process" x="320" y="121" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">Gym B data</text>
    <line className="idg-process" x1="258" y1="100" x2="258" y2="134" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="3 3" />
    {/* Note */}
    <text className="idg-note" x="260" y="158" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">One codebase, one database. RLS enforces complete data isolation per tenant.</text>
  </svg>
);

const InteractivePaymentFlow = (
  <svg viewBox="0 0 520 170" fill="none">
    <text className="idg-title" x="260" y="15" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="1">STRIPE CONNECT PAYMENT FLOW</text>
    {/* Step 1: Member */}
    <rect className="idg-input" x="10" y="30" width="90" height="50" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="none" />
    <text className="idg-input" x="55" y="52" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">Member</text>
    <text className="idg-input" x="55" y="68" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">checks out</text>
    {/* Arrow 1 */}
    <line className="idg-arrow" x1="105" y1="55" x2="135" y2="55" stroke="var(--color-accent)" strokeWidth="1.5" />
    <polygon className="idg-arrow" points="133,50 140,55 133,60" fill="var(--color-accent)" />
    {/* Step 2: API */}
    <rect className="idg-arrow" x="140" y="30" width="90" height="50" rx="4" stroke="var(--color-accent-border)" strokeWidth="1" fill="var(--color-accent-dim)" />
    <text className="idg-arrow" x="185" y="52" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)">API</text>
    <text className="idg-arrow" x="185" y="68" textAnchor="middle" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)">PaymentIntent</text>
    {/* Arrow 2 */}
    <line className="idg-process" x1="235" y1="55" x2="265" y2="55" stroke="#635bff" strokeWidth="1.5" />
    <polygon className="idg-process" points="263,50 270,55 263,60" fill="#635bff" />
    {/* Step 3: Stripe */}
    <rect className="idg-process" x="270" y="30" width="90" height="50" rx="4" stroke="#635bff" strokeWidth="1.5" fill="rgba(99, 91, 255, 0.08)" />
    <text className="idg-process" x="315" y="50" textAnchor="middle" fill="#635bff" fontSize="10" fontFamily="var(--font-mono)">Stripe</text>
    <text className="idg-process" x="315" y="66" textAnchor="middle" fill="#635bff" fontSize="9" fontFamily="var(--font-mono)">Connect</text>
    {/* Split arrows */}
    <line className="idg-output" x1="365" y1="45" x2="400" y2="35" stroke="#635bff" strokeWidth="1" />
    <line className="idg-output" x1="365" y1="65" x2="400" y2="75" stroke="var(--color-accent)" strokeWidth="1" />
    {/* Gym payout */}
    <rect className="idg-output" x="405" y="18" width="100" height="34" rx="4" stroke="#635bff" strokeWidth="1" fill="rgba(99, 91, 255, 0.08)" />
    <text className="idg-output" x="455" y="40" textAnchor="middle" fill="#635bff" fontSize="10" fontFamily="var(--font-mono)">Gym receives $</text>
    {/* Platform fee */}
    <rect className="idg-output" x="405" y="60" width="100" height="34" rx="4" stroke="var(--color-accent-border)" strokeWidth="1" fill="var(--color-accent-dim)" />
    <text className="idg-output" x="455" y="82" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)">Platform fee</text>
    {/* Webhook return */}
    <path className="idg-output" d="M315 85 L315 115 L185 115 L185 85" stroke="var(--color-text-disabled)" strokeWidth="1" strokeDasharray="4 4" fill="none" />
    <text className="idg-output" x="250" y="128" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">webhook</text>
    <polygon className="idg-output" points="180,88 185,80 190,88" fill="var(--color-text-disabled)" />
    {/* Note */}
    <text className="idg-note" x="260" y="158" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)">Each gym is a Stripe connected account. Payments split automatically between gym and platform.</text>
  </svg>
);

function NoSweatIllustration() {
  const svgRef = useRef(null);
  const { isReduced } = useTheme();

  useEffect(() => {
    if (isReduced || !svgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".ns-layer", { scaleY: 0 }, {
        scaleY: 1, duration: 0.5, stagger: 0.12, delay: 0.3, ease: "power2.out",
      });
      gsap.fromTo(".ns-dot", { scale: 0, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.35, stagger: 0.06, delay: 0.7, ease: "back.out(2)",
      });
      gsap.fromTo(".ns-label", { opacity: 0, y: 6 }, {
        opacity: 1, y: 0, duration: 0.3, stagger: 0.05, delay: 1.0, ease: "power2.out",
      });
      gsap.fromTo(".ns-arrow", { scaleX: 0, opacity: 0 }, {
        scaleX: 1, opacity: 1, duration: 0.4, stagger: 0.08, delay: 1.3, ease: "power2.out",
      });
    }, svgRef);
    return () => ctx.revert();
  }, [isReduced]);

  return (
    <svg ref={svgRef} className="article-illustration" viewBox="0 0 400 280" fill="none">
      {/* Architecture layers */}
      <text className="ns-label" x="200" y="18" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="2" textAnchor="middle">MULTI-TENANT ARCHITECTURE</text>
      {/* Frontend layer */}
      <rect className="ns-layer" x="30" y="30" width="340" height="44" rx="4" fill="var(--color-accent-dim)" stroke="var(--color-accent-border)" strokeWidth="1" style={{ transformOrigin: "200px 52px" }} />
      <text className="ns-label" x="50" y="56" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="500">React 19 + TypeScript</text>
      <text className="ns-label" x="340" y="56" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="end">FRONTEND</text>
      {/* Tenant boxes */}
      {[{ x: 50, label: "Gym A" }, { x: 155, label: "Gym B" }, { x: 260, label: "Gym C" }].map((t) => (
        <g key={t.label}>
          <rect className="ns-layer" x={t.x} y="90" width="90" height="32" rx="3" fill="var(--color-surface-raised)" stroke="var(--color-border)" strokeWidth="1" style={{ transformOrigin: `${t.x + 45}px 106px` }} />
          <text className="ns-label" x={t.x + 45} y="110" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">{t.label}</text>
          <circle className="ns-dot" cx={t.x + 45} cy="83" r="3" fill="var(--color-accent)" style={{ transformOrigin: `${t.x + 45}px 83px` }} />
        </g>
      ))}
      {/* RLS arrow */}
      <line className="ns-arrow" x1="50" y1="136" x2="350" y2="136" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" style={{ transformOrigin: "50px 136px" }} />
      <text className="ns-label" x="200" y="150" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">ROW-LEVEL SECURITY</text>
      {/* Supabase layer */}
      <rect className="ns-layer" x="30" y="160" width="340" height="44" rx="4" fill="rgba(62, 207, 142, 0.08)" stroke="rgba(62, 207, 142, 0.25)" strokeWidth="1" style={{ transformOrigin: "200px 182px" }} />
      <text className="ns-label" x="50" y="186" fill="#3ecf8e" fontSize="10" fontFamily="var(--font-mono)" fontWeight="500">Supabase + PostgreSQL</text>
      <text className="ns-label" x="340" y="186" fill="var(--color-text-disabled)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="end">DATABASE</text>
      {/* Stripe + Vercel layer */}
      <rect className="ns-layer" x="30" y="220" width="164" height="44" rx="4" fill="rgba(99, 91, 255, 0.08)" stroke="rgba(99, 91, 255, 0.25)" strokeWidth="1" style={{ transformOrigin: "112px 242px" }} />
      <text className="ns-label" x="50" y="246" fill="#635bff" fontSize="10" fontFamily="var(--font-mono)" fontWeight="500">Stripe Connect</text>
      <rect className="ns-layer" x="206" y="220" width="164" height="44" rx="4" fill="var(--color-accent-dim)" stroke="var(--color-accent-border)" strokeWidth="1" style={{ transformOrigin: "288px 242px" }} />
      <text className="ns-label" x="226" y="246" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="500">Vercel Edge</text>
      {/* Connection dots */}
      <circle className="ns-dot" cx="112" cy="210" r="3" fill="#635bff" style={{ transformOrigin: "112px 210px" }} />
      <circle className="ns-dot" cx="288" cy="210" r="3" fill="var(--color-accent)" style={{ transformOrigin: "288px 210px" }} />
    </svg>
  );
}

/* ===== ARTICLE CONTENT ===== */

const ARTICLES = {
  "nosweat-fitness-deep-dive": {
    title: "Building NoSweat Fitness",
    subtitle: "From single-gym prototype to multi-tenant SaaS across 474 commits and counting (still in development)",
    date: "April 2026",
    readTime: "9 min read",
    illustration: NoSweatIllustration,
    sections: [
      {
        heading: "Why build a gym platform",
        body: `NoSweat Fitness started as a question: what would it look like to build a real SaaS product, end to end, as a solo developer? Not a tutorial project. Not a to-do app. Something with multi-tenancy, payments, role-based access, and the kind of messy, interconnected features that make production software hard.

I chose the gym space because it has a clear set of problems: class scheduling, membership billing, workout programming, coach management. Every gym owner needs these things, and the existing platforms (Wodify, SugarWOD, PushPress) all make trade-offs that leave gaps. I was not trying to compete with them. I was trying to build something real enough that it would force me to solve real problems.

The first commit was in November 2025. By March 2026 the repo had 474 commits, 59 database migrations, and a working multi-tenant platform with Stripe Connect, custom domains, and a visual site builder. This article is about how it got there.`,
      },
      {
        heading: "The single-gym prototype",
        body: `The first version was deliberately simple. One gym, one database, no tenancy. React 19 with TypeScript on the frontend, Supabase for auth and the database, SCSS Modules for styling. The goal was to get the core features working before worrying about architecture.

That meant a class schedule page, a WOD (workout of the day) editor, coach profiles, and a member dashboard. Each feature lived in its own component directory with co-located styles. The data layer was thin: Supabase client calls directly from React components, guarded by auth context.

The backend started as an Express server running alongside Vite in development. It handled Stripe webhook processing, payment intent creation, and anything that needed server-side secrets. In production, the same logic runs as Vercel serverless functions. The two backends share utility code but have separate entry points, which means I can develop locally with hot reload and deploy to edge functions without changing any business logic.

This dual-backend pattern turned out to be one of the best early decisions. It kept the development loop fast (Express restarts in milliseconds) while the production path stayed serverless and scalable.

{{interactive:0}}`,
        interactives: [{ diagram: InteractiveNoSweatArch, steps: nosweatArchSteps }],
      },
      {
        heading: "Going multi-tenant",
        body: `Migration 050 was the big one. Converting from a single-gym app to a multi-tenant platform meant every table needed a gym_id column, every query needed to be scoped, and every RLS policy needed to enforce tenant isolation.

Supabase's Row-Level Security made this feasible as a solo developer. Instead of building a middleware layer to filter queries, the database itself enforces that Gym A can never see Gym B's data. Every table has a policy like "users can only select rows where gym_id matches their current tenant." The policies are defined in SQL migrations and versioned alongside the application code.

The routing layer resolves tenants in two ways. Path-based routing (/gym/:slug) works for the default Vercel deployment. Custom domain routing uses a useDomainResolution hook that queries the domains table on app load. If you visit a gym's custom domain, the app resolves the tenant from the hostname and loads their branding before anything renders.

The TenantContext wraps the entire gym-side app. It provides the current gym's ID, branding tokens, feature flags, and Stripe account ID to every component. The BrandingOverrideContext sits on top of that and powers the site builder's live preview, letting gym owners see changes before they publish.

Getting RLS right was the hardest part of the entire project. One early policy created an infinite recursion loop, which took down every query. Debugging RLS in Supabase means reading PostgreSQL logs and reasoning about policy evaluation order. It is not glamorous work, but it is the kind of thing that matters enormously in production.

{{interactive:0}}`,
        interactives: [{ diagram: InteractiveTenantFlow, steps: tenantFlowSteps }],
      },
      {
        heading: "Payments and Stripe Connect",
        body: `Payments in a multi-tenant platform are more complex than payments in a single app. Each gym owner needs to receive their own money. You cannot just collect everything into one Stripe account and sort it out later.

Stripe Connect solves this. Each gym onboards as a connected account. When a member buys a day pass, books a PT session, or starts a subscription, the payment is routed directly to the gym's Stripe account. The platform takes a cut via application fees. Webhooks from Stripe flow through a single endpoint in the API layer, get matched to the correct gym by their Stripe account ID, and update the relevant database records.

The payment flows span several features: day passes (one-off PaymentIntents), trial memberships (card-authorized SetupIntents that convert to subscriptions), recurring memberships (Stripe Subscriptions with plan management), and service bookings (coach-set pricing for PT, massage, nutrition consultations). Each flow has its own modal, confirmation page, and webhook handler.

I also integrated QuickBooks and Xero for gym owners who need accounting sync. This required encrypted API keys stored per tenant, OAuth token refresh flows, and a sync log that tracks which transactions have been pushed to which accounting system. It is the least visible feature in the app and the one that required the most careful error handling.

{{interactive:0}}`,
        interactives: [{ diagram: InteractivePaymentFlow, steps: paymentFlowSteps }],
      },
      {
        heading: "The feature system",
        body: `Not every gym needs every feature. A yoga studio does not need WOD programming. A CrossFit box does not need service bookings for massage therapists. The feature toggle system lets gym owners enable and disable capabilities from their admin panel.

The implementation is a FeatureGate component that wraps any feature-specific UI. It reads from the tenant's feature flags (stored in the database, cached in context) and renders either the children or nothing. On the backend, API endpoints check the same flags before processing requests.

The site builder is where this flexibility becomes visible. Gym owners can toggle sections on and off, reorder them, and customise every visual detail: logo, colour palette, fonts (loaded dynamically from Google Fonts), gradient direction, navigation style, hero effects, and even inject custom CSS. The BrandingOverrideContext lets them preview all of this in real time before publishing.

Building a site builder as a solo developer is an exercise in restraint. You could spend months on drag-and-drop layout editing. Instead I focused on the things that make each gym feel different: colour, typography, imagery, and section visibility. That covers 90% of what gym owners actually customise.`,
      },
      {
        heading: "Still iterating",
        body: `NoSweat is not finished. It is a product I continue to develop, and the backlog reflects the same kind of iteration I described in the portfolio article.

The 59 migration files tell the story of the schema's evolution. The early migrations set up profiles, bookings, and payments. The middle ones added the workout system with movement databases, muscle groups, and coach analytics. The later ones introduced multi-tenancy, feature voting, custom domains, and Stripe Connect. Each migration is a small, reversible step. None of them required downtime or data loss.

The codebase has gone through a full semantic class name refactor, a shared component extraction pass, and multiple rounds of RLS policy tightening. The Docker setup supports both development (hot reload, mounted volumes) and production (multi-stage builds, Nginx for the frontend, separate API container).

What makes this project valuable as a portfolio piece is not the feature count. It is the evidence of process. The git history shows how a real application evolves: messy early commits that explore ideas, focused refactoring commits that pay down debt, and careful migration commits that change the database without breaking existing data. That is what building software actually looks like.`,
      },
    ],
  },
  "building-a-living-portfolio": {
    title: "Building a living portfolio",
    subtitle: "How this site evolved from a static page into a product I ship, test, and iterate on",
    date: "April 2026",
    readTime: "8 min read",
    illustration: LivingPortfolioIllustration,
    sections: [
      {
        heading: "It started as a weekend project",
        body: `Most portfolio sites get built once and left to rot. I know because I have done it before. You spend a weekend on it, deploy it, share the link, then never touch it again. Six months later the dependencies are outdated, the copy does not reflect your current role, and the whole thing feels like a time capsule rather than a representation of who you are now.

This time I wanted something different. Not a polished monument to a single weekend of effort, but a working product that I treat the same way I treat any codebase at work: with version control, a deployment pipeline, automated quality checks, and a backlog of things to improve.

The first version was simple. A React app scaffolded with Vite, some SCSS for styling, and enough content to fill five sections. No animations, no blog, no Storybook, no Lighthouse audits. Just a clean layout that loaded fast and communicated the basics: who I am, what I do, how to get in touch.`,
      },
      {
        heading: "Treating it like a product",
        body: `The shift happened when I stopped thinking of the portfolio as a finished artefact and started thinking of it as a product with users. The users are hiring managers and recruiters. Their goal is to quickly understand whether I am worth interviewing. Every feature I add should serve that goal.

That framing changed how I make decisions. When I added GSAP animations, it was not because animations are fun (they are), but because smooth scroll-triggered reveals make the content easier to consume and demonstrate frontend craft in a way that a bullet-point list cannot. When I added a motion toggle, it was because accessibility is a core part of UX engineering and I wanted to show that I think about it by default. When I added Lighthouse audits to the CI pipeline, it was because I wanted proof, not just claims, that the site performs well.

Every feature goes through the same process. Identify a gap, build it on a feature branch, test it locally, merge it into main, and let GitHub Actions deploy it. The site has had dozens of these small iterations. Some visible, like the blog section you are reading right now. Some invisible, like switching from runtime Lighthouse API calls to a CI-generated static JSON file to eliminate an external dependency.`,
      },
      {
        heading: "The stack and why it works",
        body: `The stack is deliberately simple. React 19 with functional components and hooks. Vite for the dev server and production builds. SCSS with design tokens bridged to CSS custom properties. GSAP with ScrollTrigger for all animations. Storybook for component documentation. GitHub Pages for hosting.

There is no backend, no database, no CMS. Content lives in JavaScript files: an array of experience items, a list of skills, article objects with sections. This keeps everything in one place and means I can update copy with the same workflow I use for code changes.

The styling system uses SCSS variables as the source of truth, bridged to CSS custom properties at :root. Every component consumes var(--color-*) tokens, never raw hex values. The dark theme is the default. Light theme overrides via a [data-theme="light"] selector. Switching themes is instant because it is just swapping custom property values, no re-render required.

Storybook runs alongside the main site. It documents the reusable components (ThemeToggle, SkillChip, MagneticButton, ScrollReveal, SplitHeading) with live examples. It builds as part of the same CI pipeline and deploys to a /storybook/ subpath. Having a component library for a personal site might seem like overkill, but it forces the same discipline I use at work: every component should work in isolation, with clear props and predictable behaviour.`,
      },
      {
        heading: "The CI/CD pipeline",
        body: `Every push to main triggers a GitHub Actions workflow. It installs dependencies, builds the Vite app, builds Storybook, and deploys both to GitHub Pages. A second workflow runs after each successful deploy: it launches three Lighthouse audits against the live site, averages the scores, and commits the results to a JSON file in the repo. That file gets picked up on the next deploy, and the scores are displayed in the Design System section with animated SVG ring gauges.

This means the site is always telling the truth about its own performance. The Lighthouse scores are not screenshots from a good run. They are live data from the most recent deploy, generated automatically, committed to version control, and rendered at runtime.

The branching strategy is strict. No commits directly to main. Feature branches for new work, fix branches for bugs. Single commit per branch, merged with --no-ff to preserve the branch topology in the git graph. It is the same workflow I follow on production codebases, scaled down to a one-person project.`,
      },
      {
        heading: "What I have learned",
        body: `Building this site iteratively has taught me more about frontend engineering than any single project at work. When you are the only person on the team, you feel every decision. If the SCSS architecture is messy, you are the one who suffers when you come back to it three months later. If the animation code does not respect reduced motion, you are the one who has to retrofit it.

Some specific things I learned along the way. GSAP's ScrollTrigger is powerful but needs careful cleanup in React. Every useEffect that creates a timeline needs to revert it on unmount, or you get ghost animations and memory leaks. The motion toggle taught me that accessibility is not a feature you bolt on, it is an architectural decision that touches every animation in the codebase.

The blog system taught me that you do not always need a framework. I considered MDX, markdown files with frontmatter, even a headless CMS. In the end, plain JavaScript objects with a custom renderer gave me exactly the flexibility I needed: syntax highlighting, interactive diagrams, code toggles, all without adding a single dependency.

The biggest lesson is the simplest one. A portfolio is not a snapshot. It is a signal. It tells hiring managers not just what you can build, but how you build: your taste, your process, your standards. Treating it as a living product means that signal stays current. Every time I push a commit, the site gets a little better, and the gap between "what I claim I can do" and "what you can see I have done" gets a little smaller.`,
      },
    ],
  },
  "outcome-oriented-design": {
    title: "Outcome-oriented design",
    subtitle: "Why AI is shifting UX from pixels to purpose",
    date: "March 2026",
    readTime: "6 min read",
    illustration: OutcomeIllustration,
    sections: [
      {
        heading: "Outputs are getting cheaper",
        body: `For most of UX history, the craft has been measured by its outputs. Wireframes delivered, screens designed, prototypes built. The implicit assumption: more polished artefacts lead to better products. That assumption is breaking down.

AI tools like Figma Make, Galileo, and Relume can now generate full UI compositions from a text prompt, matching brand tokens, spacing conventions, and component patterns. 33% of designers already use AI to generate visual assets, and 22% use it for first-draft interfaces (Figma, 2025). When the output becomes trivially easy to produce, the competitive advantage shifts to knowing which output to produce and why.

This is the core of outcome-oriented design: rather than optimising for the quality of deliverables, you optimise for the measurable changes those deliverables create. Not "did we ship a new onboarding flow?" but "did activation increase by 12%?"`,
      },
      {
        heading: "What changes in practice",
        body: `The shift plays out in three areas.

First, research becomes continuous rather than front-loaded. Tools like Dovetail and Maze now auto-classify qualitative feedback, detect emerging themes at scale, and generate dynamic follow-up questions during interviews. Teams report 63% faster research turnaround. The result: designers can run lightweight validation at any point in the cycle, not just during a dedicated "discovery phase."

Second, variation becomes cheap. AI can produce multiple viable design directions in minutes. Instead of presenting one carefully refined concept, teams can test four rough concepts against outcome metrics and invest polish only in the one that performs. The designer's judgment shifts from "which layout is best?" to "which hypothesis is most worth testing?"

Third, measurement becomes a design skill. When the output itself is AI-assisted, the differentiating capability is connecting design decisions to business and user outcomes: retention, activation, task completion, satisfaction. Companies that tie UX metrics to business outcomes are significantly more likely to scale successful digital products.`,
      },
      {
        heading: "Designing for AI agents",
        body: `There is a deeper shift happening too. As AI evolves from passive chat tools to autonomous agents that plan, execute, and iterate on their own, the nature of the interface is changing.

The emerging paradigm is delegative UI: instead of walking a user through a series of steps, you assign an AI a goal and let it figure out the path. UX work becomes less about shaping individual screens and more about shaping the boundaries of what an agent is allowed to do, how it communicates its progress, and how it handles failure gracefully.

Trust becomes the central design challenge. Transparency, control, consistency, and graceful degradation are not new principles, but they take on new weight when the user is delegating real decisions to a system they cannot fully predict.`,
      },
      {
        heading: "Where UX Engineers fit",
        body: `This shift increases the value of people who sit at the intersection of design and engineering. When AI handles output generation, the scarce skills are:

Understanding user needs deeply enough to define the right outcomes. Building the design systems and constraints that guide AI output. Implementing the measurement infrastructure that connects design decisions to results. And prototyping rapidly using AI tools, with the technical literacy to evaluate what AI actually produces.

The designer's role is evolving from controller to curator, from pixel-pusher to strategic thinker. NN/g's State of UX 2026 report puts it plainly: "Surface-level design won't be enough to stay competitive." The future belongs to people who combine adaptability, strategy, and discernment, and who can work fluently across the full pipeline from research through to production code.`,
      },
    ],
  },
  "spec-driven-development": {
    title: "Spec-driven development",
    subtitle: "Writing specifications that AI turns into code",
    date: "March 2026",
    readTime: "7 min read",
    illustration: SpecIllustration,
    sections: [
      {
        heading: "The problem with vibe coding",
        body: `Vibe coding, the practice of building software by conversing with an AI assistant in natural language, ships prototypes fast. You describe what you want, the AI generates code, you iterate. For side projects and throwaway experiments, it works.

But vibe coding hits a documented wall. Around three months in, the technical debt compounds into a maintenance crisis. Without structure, AI-generated code accumulates inconsistencies, duplicated logic, and implicit assumptions that no one recorded. If another team member wants to contribute, they have to reverse-engineer intent from source code. The AI is good at pattern completion, but it is not good at reading your mind about architecture, constraints, and trade-offs.

Spec-driven development (SDD) is the emerging response. Identified by Thoughtworks as one of the most important new engineering practices of 2025, it inverts the traditional workflow: the specification is the source of truth, and the code is a generated secondary artefact. The spec declares intent. The code realises it.`,
      },
      {
        heading: "How SDD works",
        body: `The workflow breaks into four phases.

Specify: define what you are building and why through user journeys, success criteria, and constraints. Plan: establish architecture, stack choices, and boundaries. Tasks: break the spec into small, testable work units. Implement: hand each task to an AI agent to generate the code.

Real tooling exists for this. GitHub's Spec Kit provides a four-command CLI: /specify, /plan, /tasks, /implement. It works with Copilot, Claude Code, and Cursor. Amazon Kiro is building spec-driven workflows directly into an IDE. Fission AI's OpenSpec enforces a strict three-phase state machine with delta markers for tracking changes.

The critical insight is that specs are not just documentation. They are the interface between human intent and machine execution. Empirical studies suggest well-structured specs reduce AI coding errors by up to 50%, and prompts with explicit specifications cut back-and-forth refinements by 68%. The spec is doing real work.`,
      },
      {
        heading: "Writing specs that work",
        body: `Addy Osmani's widely cited framework for writing AI-ready specs recommends starting like a PRD (user-centric context, the "why" behind each feature) and expanding like an SRS (specific technical details: database schema, API contracts, framework choices).

Good specs cover six areas: commands, testing strategy, project structure, code style, git workflow, and boundaries. That last one is important. A three-tier boundary system, always do (safe actions), ask first (high-impact changes), never do (hard stops), gives the AI agent clear guardrails without micromanaging every line of output.

The key lesson from early adopters: break work into modular tasks. Research shows AI models struggle with too many simultaneous instructions (the "curse of instructions"). A single huge prompt produces worse results than a sequence of focused ones, each grounded in the same spec.

This is not waterfall. Unlike traditional spec-heavy approaches with long feedback loops, SDD provides tight cycles by combining rigorous specification with rapid AI code generation. Traditional specs are advisory; SDD specs are enforced through tests that fail if the code diverges.`,
      },
      {
        heading: "The UX Engineer advantage",
        body: `This is where the two disciplines converge. A UX engineer who understands both design and code is ideally positioned for spec-driven development.

Design systems are already specifications. Tokens, component APIs, interaction patterns, accessibility requirements: these are contracts between design intent and implementation. SDD extends this thinking from the component level to the full application.

The spec itself is a design artefact. It captures user journeys, success metrics, and constraints, all of which require the research, empathy, and strategic thinking that sit at the heart of UX practice. When AI writes the code, the differentiating skill is not typing speed. It is the ability to articulate what to build and why, with enough precision that a machine can execute it faithfully.

Vibe coding and SDD are not opposed. The consensus in 2026 is that they are complementary: vibe coding for early exploration and rapid prototyping, SDD for production systems requiring maintainability, collaboration, and reliability. The people who will thrive are those who can move fluently between the two modes, and who have the cross-disciplinary literacy to write specs that cover both the user experience and the technical architecture.`,
      },
    ],
  },
  "design-to-production-pipeline": {
    title: "The design-to-production pipeline",
    subtitle: "How Figma, Storybook, and React share a single source of truth",
    date: "March 2026",
    readTime: "5 min read",
    illustration: PipelineIllustration,
    sections: [
      {
        heading: "One system, three surfaces",
        body: `Most design systems have a gap. Designers maintain a Figma library. Developers maintain a component library. The two drift apart, and nobody notices until a QA engineer flags that the button radius in production does not match the mockup.

The portfolio you are reading right now is built to close that gap. The same set of design tokens (colours, typography, spacing, radii) powers three surfaces simultaneously: a Figma file via Tokens Studio, a Storybook instance documenting every component, and the live production site. Change a token in one place and it propagates to the others.

This is not a theoretical exercise. It is the workflow I use in production, and it is the workflow I built this site to demonstrate.`,
      },
      {
        heading: "Figma: where decisions are made",
        body: `The pipeline starts in Figma. Design tokens are defined using the Tokens Studio plugin, which stores them as structured JSON: colour primitives, semantic aliases, typography scales, border radii. Each token has a name, a value, and a type.

The key detail: tokens are organised into sets. This site has a Dark set and a Light set, with identical token names but different values. Toggle between them in Figma and every frame updates. The same mechanism drives the theme toggle on this site.

Wireframes and component mockups reference tokens by name, not by raw hex value. A background fill is not "#0b0b0b". It is "color.background". This indirection is what makes the entire pipeline possible. When the value changes, the name stays stable, and everything downstream picks it up.`,
      },
      {
        heading: "Storybook: where components are isolated",
        body: `From Figma, the same tokens flow into code as SCSS variables, compiled to CSS custom properties on :root. Every React component consumes them via var(--color-accent), var(--font-display), and so on. No hardcoded values.

Storybook documents these components in isolation. Each story renders a component with interactive controls (Storybook's args system), and the ThemeProvider wraps everything so the Dark/Light toggle works exactly as it does on the live site.

This is where the design system proves itself. If a component looks wrong in Storybook, it will look wrong in production. There is no "it works on my machine" problem because Storybook and the site consume identical tokens and identical component code. The Storybook instance is built alongside the site in the same CI pipeline and deployed to the same domain.`,
      },
      {
        heading: "Production: where it ships",
        body: `The final surface is the live site. Every push to main triggers a GitHub Actions workflow: Vite builds the site, Storybook builds alongside it, and both deploy to GitHub Pages. A second workflow runs Lighthouse audits and commits the scores back to the repo.

The production site does not import a separate copy of the design system. It is the design system. The components you see on this page are the same components documented in Storybook, consuming the same tokens defined in Figma.

This has a practical benefit beyond consistency. When a hiring manager asks "show me your design system work," I do not need to switch between tools. The portfolio itself is the artefact: tokens visible in the Design System section, components interactive in Storybook, the Figma file linked alongside, and real Lighthouse scores proving the whole thing performs in production.`,
      },
      {
        heading: "Why this matters for teams",
        body: `For a solo portfolio, this pipeline is admittedly over-engineered. But it demonstrates a workflow that scales to teams.

In a team setting, a designer updates a colour token in Figma. Tokens Studio syncs the change to a JSON file in the repository via a pull request. A developer reviews and merges. The CI pipeline rebuilds Storybook and the site. Every surface updates from a single change.

The reverse works too. If a developer adds a new component in code, they document it in Storybook. The designer sees it in the Storybook instance and references it in future Figma work. There is no "throw it over the wall" handoff because both sides are working from the same system.

The people who thrive in this workflow are those who understand both sides: designers who can read a component's prop interface, and developers who can interpret a Figma frame's token bindings. That intersection is exactly where a UX Engineer operates.`,
      },
    ],
  },
  "the-split-brain-problem": {
    title: "The split-brain problem",
    subtitle: "What nobody tells you about being both the designer and the developer",
    date: "March 2026",
    readTime: "5 min read",
    illustration: SplitBrainIllustration,
    disclaimer: "Disclaimer: I went to art school, not CS school. Everything I know about code, I learned on the job, from documentation, and from getting things wrong repeatedly. This article is written from that perspective.",
    sections: [
      {
        heading: "Two brains, one head",
        body: `There is a particular kind of frustration that comes from working across design and code. It is not that either discipline is too hard on its own. It is that they demand different modes of thinking, and switching between them has a cost that nobody warns you about.

When I am designing, I am thinking spatially. I am thinking about hierarchy, rhythm, contrast, whitespace. I am making decisions that are intuitive, pattern-based, and visual. The reasoning happens fast and it happens in a register that is hard to articulate. You know a layout is wrong before you can explain why.

When I am coding, I am thinking sequentially. I am thinking about state, data flow, side effects, edge cases. The reasoning is logical, explicit, and verbal. You can trace every decision back to a concrete reason.

These are not the same muscle. Using one does not exercise the other. And the context switch between them is more expensive than most people realise.`,
      },
      {
        heading: "The reference sheet problem",
        body: `Here is something I have accepted after seven years: I will never retain code syntax the way a full-time developer does. Not because I lack the ability, but because I am not spending eight hours a day in a single language. My brain is time-sharing between Figma and VS Code, between component APIs and colour systems, between user flows and data models.

The result is that code, for me, operates more like a reference sheet than a memorised vocabulary. I know what a useEffect does. I know when I need a useCallback. But I will look up the exact syntax every single time, because the space in my head where that muscle memory would live is occupied by typography rules and spacing scales.

This is not a weakness. It is a trade-off. The developer who writes React in their sleep has made a different trade-off: they probably cannot look at a Figma frame and immediately see that the vertical rhythm is off by 4px, or that the font weight on a secondary label is fighting the hierarchy.

Both skills are real. Both take years to develop. The difference is that one is treated as "technical" and the other is treated as "soft," which is a distinction that has done more damage to product quality than any single architectural decision.`,
      },
      {
        heading: "The imposter on both sides",
        body: `When you sit between two disciplines, you are always slightly underqualified for the room you are in. In a design review, you are the person who keeps mentioning implementation constraints. In a code review, you are the person whose variable naming is slightly off-convention.

I have been in meetings where a senior developer dismissed a design concern as "just aesthetics." I have been in meetings where a designer dismissed a technical constraint as "not my problem." Both of those responses come from the same place: a lack of fluency in the other domain.

The value of the in-between person is not that they are the best designer or the best developer. It is that they can translate. They can sit in a design review and say "this layout will require a CSS grid subgrid that does not work in Safari" before anyone has written a line of code. They can sit in a sprint planning session and say "this component needs three visual states, not one" before the developer has built a thing that needs to be rebuilt.

That translation work is invisible. It prevents problems that never happen, which means nobody thanks you for it. But the products that result from it are measurably better, because the gap between what was designed and what was built is smaller.`,
      },
      {
        heading: "Learning in public, with gaps",
        body: `I came to code from art school. I did not have data structures or algorithms. I did not have computer science fundamentals. I had colour theory, typographic history, life drawing, and a dissertation on visual semiotics.

Everything I know about JavaScript, I learned by building things that needed to exist. A client needed a responsive email template. A product needed a component library. A feature needed real-time data from an API. Each problem taught me exactly enough to solve it, and no more.

This means my knowledge has gaps. There are CS concepts I understand by analogy rather than by definition. There are patterns I use correctly but could not whiteboard from scratch. I have accepted this. The gaps are the cost of breadth, and the breadth is the thing that makes me useful.

What I have found is that the gaps matter less than the ability to close them quickly. If you can read documentation, identify the right abstraction, and ship working code that is accessible, performant, and maintainable, then the route you took to get there is less important than the result.

The industry is slowly coming around to this. The rise of AI coding tools has made the "reference sheet" approach to syntax even more viable. The scarce skill is not memorising array methods. It is knowing what to build and why. And that is a design skill as much as an engineering one.`,
      },
    ],
  },
  "javascript-to-react": {
    title: "JavaScript to React",
    subtitle: "Simple side-by-side examples showing how plain JS becomes React code",
    date: "April 2026",
    readTime: "6 min read",
    illustration: JsToReactIllustration,
    sections: [
      {
        heading: "Why this matters",
        body: `React is not a different language. It is JavaScript with a few extra patterns on top. If you already know how to write a function, use an array method, or handle a click event in plain JS, you are closer to React than you think.

This article walks through everyday JavaScript tasks and shows what they look like in React. No jargon, no deep theory. Just "here is how you did it before, and here is how you do it now."`,
      },
      {
        heading: "Selecting and updating elements",
        body: `In plain JavaScript, you grab an element with document.querySelector and change its content with textContent or innerHTML.

// Vanilla JS
const heading = document.querySelector("#title");
heading.textContent = "Hello";

In React, you do not touch the DOM directly. Instead, you store the value in state and let React update the page for you.

// React
const [title, setTitle] = useState("Hello");
return <h1>{title}</h1>;

The key difference: in vanilla JS, you tell the browser what to change. In React, you describe what the page should look like, and React figures out what to change. This is called declarative rendering.

[MDN: document.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) [React: useState](https://react.dev/reference/react/useState)

{{interactive:0}}`,
        interactives: [{ diagram: InteractiveImperativeVsDeclarative, steps: imperativeSteps }],
      },
      {
        heading: "Handling events",
        body: `In vanilla JS, you add an event listener to an element after the page loads.

// Vanilla JS
const btn = document.querySelector("#myBtn");
btn.addEventListener("click", function () {
  alert("Clicked!");
});

In React, you attach the handler directly in your JSX using camelCase event names like onClick.

// React
function MyButton() {
  function handleClick() {
    alert("Clicked!");
  }
  return <button onClick={handleClick}>Click me</button>;
}

No need to query the DOM, no need to worry about when the element exists. The handler is right there next to the element it belongs to.

[MDN: addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

{{interactive:0}}`,
        interactives: [{ diagram: InteractiveEventComparison, steps: eventSteps }],
      },
      {
        heading: "Looping through a list",
        body: `In vanilla JS, you might loop through an array and build HTML strings or create elements one by one.

// Vanilla JS
const fruits = ["Apple", "Banana", "Cherry"];
const ul = document.querySelector("#list");
fruits.forEach(function (fruit) {
  const li = document.createElement("li");
  li.textContent = fruit;
  ul.appendChild(li);
});

In React, you use the .map() array method inside your JSX. Each item needs a unique key prop so React can track it.

// React
const fruits = ["Apple", "Banana", "Cherry"];
return (
  <ul>
    {fruits.map((fruit) => (
      <li key={fruit}>{fruit}</li>
    ))}
  </ul>
);

The .map() pattern is one of the most common things you will write in React. It replaces manual DOM creation entirely.

[MDN: Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

{{interactive:0}}`,
        interactives: [{ diagram: InteractiveListRendering, steps: listRenderSteps }],
      },
      {
        heading: "Fetching data",
        body: `In vanilla JS, you call fetch() and update the DOM when the data arrives.

// Vanilla JS
fetch("/api/users")
  .then((res) => res.json())
  .then((data) => {
    document.querySelector("#count").textContent = data.length;
  });

In React, you do the same fetch inside a useEffect hook, and store the result in state.

// React
const [users, setUsers] = useState([]);

useEffect(() => {
  fetch("/api/users")
    .then((res) => res.json())
    .then((data) => setUsers(data));
}, []);

return <p>{users.length} users</p>;

The useEffect hook tells React "run this code once after the component appears." The empty array [] at the end means it only runs once, not on every re-render.

[React: useEffect](https://react.dev/reference/react/useEffect)`,
      },
      {
        heading: "Showing and hiding things",
        body: `In vanilla JS, you toggle a class or change the display style.

// Vanilla JS
const panel = document.querySelector("#panel");
btn.addEventListener("click", function () {
  panel.classList.toggle("hidden");
});

In React, you use a piece of state to decide whether to render the element at all.

// React
const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
    {isOpen && <div className="panel">Content here</div>}
  </>
);

The expression {isOpen && <div>...</div>} means "only render this div if isOpen is true." This is called conditional rendering, and it is one of the most useful patterns in React.

{{interactive:0}}

The jump from vanilla JS to React is smaller than it looks. The core skills transfer directly: functions, arrays, objects, and events. React just gives you a tidier way to organise them.`,
        interactives: [{ diagram: InteractiveConditionalRender, steps: conditionalRenderSteps }],
      },
    ],
  },
  "react-concepts": {
    title: "React basics explained",
    subtitle: "The most common React concepts with plain-English explanations and examples",
    date: "April 2026",
    readTime: "7 min read",
    illustration: ReactConceptsIllustration,
    sections: [
      {
        heading: "Components: the building blocks",
        body: `A React component is just a function that returns some HTML (written as JSX). That is it. You write a function, it returns what should appear on the screen.

function Greeting() {
  return <h1>Hello, world</h1>;
}

You use it like an HTML tag: <Greeting />. You can use it as many times as you like.

The whole idea of React is to break your page into small, reusable pieces. A navbar is a component. A button is a component. A single card in a list is a component. Each one manages its own little piece of the page.

[React: Your First Component](https://react.dev/learn/your-first-component)`,
      },
      {
        heading: "Props: passing data down",
        body: `Props are how you pass information from a parent component to a child component. Think of them like function arguments.

function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

// Usage
<Greeting name="Alex" />

The parent decides what data to pass. The child receives it and uses it. Props flow in one direction only: from parent to child. This makes it easy to understand where data comes from.

You can pass anything as a prop: strings, numbers, arrays, objects, even other components. If a component needs data it does not own, it gets it through props.

[React: Passing Props](https://react.dev/learn/passing-props-to-a-component)

{{interactive:0}}`,
        interactives: [{ diagram: InteractivePropsFlow, steps: propsSteps }],
      },
      {
        heading: "State: data that changes",
        body: `State is data that lives inside a component and can change over time. When state changes, React automatically re-renders the component to show the new value.

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add one</button>
    </div>
  );
}

useState gives you two things: the current value (count) and a function to update it (setCount). You never change state directly. You always use the setter function.

The rule is simple: if something on the screen needs to change in response to user action, it should be state.

[React: State](https://react.dev/learn/state-a-components-memory)

{{interactive:0}}`,
        interactives: [{ diagram: InteractiveStateRender, steps: stateSteps }],
      },
      {
        heading: "useEffect: doing things after render",
        body: `useEffect lets you run code after your component renders. This is where you put things like fetching data, setting up timers, or updating the document title.

useEffect(() => {
  document.title = "You clicked " + count + " times";
}, [count]);

The array at the end (called the dependency array) tells React when to re-run the effect. If you pass [count], it re-runs every time count changes. If you pass an empty array [], it only runs once when the component first appears.

A common pattern is fetching data when a component loads:

useEffect(() => {
  fetch("/api/data")
    .then((res) => res.json())
    .then((data) => setItems(data));
}, []);

Think of useEffect as "after this component renders, also do this."

[React: useEffect](https://react.dev/reference/react/useEffect)

{{interactive:0}}`,
        interactives: [{ diagram: InteractiveUseEffect, steps: useEffectSteps }],
      },
      {
        heading: "Conditional rendering",
        body: `Sometimes you want to show different things based on a condition. React gives you a few simple patterns for this.

The && operator renders something only when a condition is true:

{isLoggedIn && <p>Welcome back!</p>}

The ternary operator picks between two options:

{isLoggedIn ? <Dashboard /> : <LoginForm />}

You can also return early from a component:

function UserProfile({ user }) {
  if (!user) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}

These patterns replace the if/else and classList.toggle you would use in vanilla JavaScript. The idea is the same, just expressed differently.

[React: Conditional Rendering](https://react.dev/learn/conditional-rendering)`,
      },
      {
        heading: "Lists and keys",
        body: `Rendering a list in React means mapping over an array and returning JSX for each item.

const todos = ["Buy milk", "Walk the dog", "Write code"];

return (
  <ul>
    {todos.map((todo, index) => (
      <li key={index}>{todo}</li>
    ))}
  </ul>
);

The key prop helps React keep track of which item is which. When the list changes, React uses keys to figure out which items were added, removed, or moved. Without keys, React has to guess, and it can get things wrong.

The best key is a unique ID from your data (like a database ID). Using the array index works for simple, static lists, but can cause bugs if the list gets reordered.

[React: Rendering Lists](https://react.dev/learn/rendering-lists)

{{interactive:0}}

These concepts - components, props, state, effects, conditionals, and lists - cover about 90% of what you will do in React day to day. Master these and the rest follows naturally.`,
        interactives: [{ diagram: InteractiveKeysTracking, steps: keysSteps }],
      },
    ],
  },
  "scss-in-practice": {
    title: "SCSS made simple",
    subtitle: "A beginner-friendly look at variables, nesting, and mixins with real examples",
    date: "April 2026",
    readTime: "6 min read",
    illustration: ScssIllustration,
    sections: [
      {
        heading: "What SCSS adds to CSS",
        body: `SCSS (Sassy CSS) is CSS with superpowers. It compiles down to regular CSS, so browsers never see it. But while you are writing it, you get features that make stylesheets easier to organise and maintain.

The three biggest features are variables, nesting, and mixins. If you know CSS already, you can start using SCSS in minutes. Everything you already know still works. SCSS just adds new tools on top.`,
      },
      {
        heading: "Variables: name your values",
        body: `Instead of repeating the same colour code or font size everywhere, you store it in a variable and reference it by name.

// Define once
$color-accent: #dfff47;
$font-size-body: 16px;
$spacing-medium: 24px;

// Use anywhere
.button {
  background: $color-accent;
  font-size: $font-size-body;
  padding: $spacing-medium;
}

Now if your accent colour changes, you update it in one place. Every element that uses it updates automatically.

SCSS variables start with a dollar sign ($). They can hold colours, sizes, font names, or any CSS value. Think of them as labels you stick on values so you do not have to remember hex codes.

[Sass: Variables](https://sass-lang.com/documentation/variables/)`,
      },
      {
        heading: "Nesting: write less, see more",
        body: `In plain CSS, you write the full selector every time.

.card { border: 1px solid grey; }
.card .card-title { font-size: 20px; }
.card .card-title:hover { color: blue; }

In SCSS, you nest child selectors inside their parent. The structure of your SCSS mirrors the structure of your HTML.

.card {
  border: 1px solid grey;

  .card-title {
    font-size: 20px;

    &:hover {
      color: blue;
    }
  }
}

The & symbol means "the current selector." So &:hover inside .card-title becomes .card-title:hover in the compiled CSS.

One warning: do not nest too deeply. Two or three levels is plenty. Deeply nested SCSS produces long, brittle CSS selectors that are hard to override.

[Sass: Nesting](https://sass-lang.com/documentation/style-rules/#nesting)

{{interactive:0}}`,
        interactives: [{ diagram: InteractiveNesting, steps: nestingSteps }],
      },
      {
        heading: "Mixins: reusable blocks of styles",
        body: `A mixin is a reusable chunk of CSS that you can include anywhere. It is like a function for your styles.

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero {
  @include flex-center;
  height: 100vh;
}

.modal-overlay {
  @include flex-center;
  position: fixed;
  inset: 0;
}

Mixins can also accept arguments, just like a function.

@mixin respond-to($breakpoint) {
  @media (max-width: $breakpoint) {
    @content;
  }
}

.sidebar {
  width: 300px;

  @include respond-to(768px) {
    width: 100%;
  }
}

The @content keyword passes whatever styles you write inside the @include block into the mixin. This is incredibly useful for responsive breakpoints.

[Sass: Mixins](https://sass-lang.com/documentation/at-rules/mixin/)

{{interactive:0}}`,
        interactives: [{ diagram: InteractiveMixin, steps: mixinSteps }],
      },
      {
        heading: "Partials and imports",
        body: `SCSS lets you split your styles across multiple files and combine them at build time. Files that start with an underscore are called partials.

// _variables.scss
$color-bg: #0b0b0b;
$color-text: #ffffff;

// _base.scss
body {
  background: $color-bg;
  color: $color-text;
}

// main.scss
@use "variables";
@use "base";

The @use rule imports a partial and makes its variables available. This keeps your codebase organised: variables in one file, reset styles in another, component styles in their own files.

A typical SCSS folder might look like this:

styles/
  _variables.scss   (design tokens)
  _base.scss        (reset and root styles)
  _shared.scss      (reusable utility classes)
  main.scss         (imports everything)

Each component can also have its own .scss file sitting next to the .jsx file. This is called co-location, and it makes it easy to find the styles for any component.

[Sass: @use](https://sass-lang.com/documentation/at-rules/use/)

{{interactive:0}}`,
        interactives: [{ diagram: InteractivePartials, steps: partialsSteps }],
      },
      {
        heading: "Putting it together",
        body: `Here is a real-world example combining all four features.

// _variables.scss
$color-accent: #dfff47;
$breakpoint-mobile: 600px;

// _mixins.scss
@mixin respond-to($bp) {
  @media (max-width: $bp) { @content; }
}

// Card.scss
.card {
  padding: 24px;
  border: 1px solid rgba($color-accent, 0.2);
  border-radius: 8px;

  &-title {
    font-size: 20px;
    color: $color-accent;
  }

  &-body {
    font-size: 14px;
    line-height: 1.6;
  }

  @include respond-to($breakpoint-mobile) {
    padding: 16px;
  }
}

Variables keep your values consistent. Nesting keeps selectors organised. Mixins avoid repetition. Partials keep files small. Together, they make CSS manageable even on large projects.`,
      },
    ],
  },
  "web-accessibility": {
    title: "Web accessibility basics",
    subtitle: "A practical guide to building websites that everyone can use",
    date: "April 2026",
    readTime: "6 min read",
    illustration: A11yIllustration,
    sections: [
      {
        heading: "What accessibility means",
        body: `Web accessibility means making sure your website works for everyone, including people who use screen readers, navigate with a keyboard, have low vision, or experience motion sensitivity.

It is not a separate feature you bolt on at the end. It is a set of practices you follow while building. Most of it comes down to using HTML correctly and being thoughtful about how things look, move, and respond to input.

The standard is WCAG (Web Content Accessibility Guidelines). Level AA is the most commonly expected standard. It covers things like colour contrast, keyboard navigation, and text alternatives for images.`,
      },
      {
        heading: "Semantic HTML: the foundation",
        body: `The single biggest thing you can do for accessibility is use the right HTML elements. Screen readers and assistive tools understand HTML semantics. A <button> is announced as a button. A <nav> is announced as navigation. A <div> is announced as nothing.

Bad:
<div class="btn" onclick="submit()">Submit</div>

Good:
<button type="submit">Submit</button>

The <button> gives you keyboard support (Enter and Space to activate), focus management, and a correct screen reader announcement for free. The <div> gives you none of that.

Other examples:
- Use <a> for links, not clickable divs
- Use <h1> through <h6> in order for headings
- Use <ul> and <li> for lists
- Use <label> elements connected to form inputs
- Use <main>, <nav>, <header>, <footer> for page landmarks

If you use semantic HTML, you get most accessibility features without writing any extra code.

[MDN: HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)

{{interactive:0}}`,
        interactives: [{ diagram: InteractiveSemanticHtml, steps: semanticSteps }],
      },
      {
        heading: "Colour contrast and text",
        body: `People with low vision or colour blindness need enough contrast between text and its background to read comfortably.

WCAG AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text (18px bold or 24px regular).

You can check contrast ratios with browser dev tools, or tools like the WebAIM Contrast Checker. Chrome DevTools shows the ratio right in the colour picker.

A few practical rules:

Do not use colour alone to communicate meaning. A red border on an invalid form field is not enough if someone cannot see red. Add a text message too.

Make sure links are distinguishable from surrounding text. An underline or bold weight works. Colour alone does not.

Avoid light grey text on white backgrounds. It looks clean but fails contrast requirements. If in doubt, check the ratio.

[WebAIM: Contrast Checker](https://webaim.org/resources/contrastchecker/)

{{interactive:0}}`,
        interactives: [{ diagram: InteractiveContrast, steps: contrastSteps }],
      },
      {
        heading: "Keyboard navigation",
        body: `Many users navigate with a keyboard instead of a mouse. This includes people using screen readers, people with motor disabilities, and power users who prefer keyboard shortcuts.

Every interactive element on your page should be reachable and usable with the keyboard alone. The Tab key moves focus forward, Shift+Tab moves it back, Enter activates buttons and links, Space toggles checkboxes and buttons, and Escape closes modals and popups.

The most common keyboard accessibility mistakes:

Using div or span instead of button or a. Native HTML elements are keyboard-accessible by default. Custom elements are not.

Removing the focus outline. The blue or black ring that appears when you Tab to an element is there for a reason. If you remove it with outline: none, provide a visible alternative.

:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

Focus trapping in modals. When a modal is open, Tab should cycle through the modal's content, not disappear behind it. When the modal closes, focus should return to the element that opened it.

[MDN: :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)

{{interactive:0}}`,
        interactives: [{ diagram: InteractiveFocusOrder, steps: focusSteps }],
      },
      {
        heading: "ARIA: when HTML is not enough",
        body: `ARIA (Accessible Rich Internet Applications) attributes add extra information to elements when native HTML does not cover your use case.

The most useful ARIA attributes:

aria-label gives an element a text label when there is no visible text. Useful for icon-only buttons.
<button aria-label="Close menu"><svg>...</svg></button>

aria-hidden="true" hides decorative elements from screen readers. Glow effects, background animations, and purely visual flourishes should use this.

aria-expanded tells screen readers whether a dropdown or collapsible section is open or closed.
<button aria-expanded="false">Menu</button>

aria-live="polite" announces dynamic content changes. If a notification appears without a page reload, this tells screen readers to read it out.

The golden rule of ARIA: do not use it if native HTML can do the job. A <button> is better than <div role="button">. ARIA is a supplement, not a replacement.

[MDN: ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)`,
      },
      {
        heading: "Motion and animation",
        body: `Some users experience motion sickness, vertigo, or distraction from animations. The prefers-reduced-motion media query lets you respect their system settings.

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

In practice, this means providing a way to turn off or tone down animations. This site has a motion toggle in the navigation that switches between full animations and reduced alternatives.

For JavaScript animations (like GSAP), check the preference and skip the animation:

const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (isReduced) return;

Accessibility is not about removing features. It is about giving everyone an equivalent experience. A motion-sensitive user should still understand the page structure and content, even if the entrance animations do not play.

Start with semantic HTML, check your contrast, make sure everything works with a keyboard, and use ARIA where needed. These four things solve the vast majority of accessibility issues.

[MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)`,
      },
    ],
  },
  "typescript-basics": {
    title: "TypeScript basics",
    subtitle: "A plain-English guide to TypeScript, with diagrams",
    date: "April 2026",
    readTime: "8 min read",
    illustration: TypeScriptIllustration,
    sections: [
      {
        heading: "What TypeScript actually is",
        body: `TypeScript is JavaScript with one extra feature: types. You write your code the same way, but you add labels that describe what kind of data each variable, function parameter, and return value should hold.

These labels do not run in the browser. TypeScript compiles down to plain JavaScript before your code ships. The labels exist purely to help you (and your editor) catch mistakes early.

Think of it like writing a recipe. JavaScript lets you write "add some of the liquid." TypeScript makes you write "add 200ml of milk." Both recipes work, but the second one is much harder to get wrong.`,
      },
      {
        heading: "Type annotations",
        diagram: TsDiagramAnnotations,
        body: `A type annotation is a label you add after a variable name or parameter using a colon.

const username: string = "Alex";
const age: number = 39;
const isAdmin: boolean = true;

For functions, you annotate both the parameters and the return value:

function greet(name: string): string {
  return "Hello, " + name;
}

If you call greet(42), TypeScript shows an error before you run the code. The number 42 is not a string, so it does not match the annotation. You see the mistake immediately in your editor, not after a user reports a bug.

You do not always need to write annotations. TypeScript can often figure out the type on its own. This is called type inference:

const city = "Nottingham";

TypeScript knows city is a string because you assigned a string to it. You only need explicit annotations when TypeScript cannot infer the type, or when you want to be clear about your intent.

[TypeScript: Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)`,
      },
      {
        heading: "Interfaces: describing shapes",
        diagram: TsDiagramInterface,
        body: `An interface describes the shape of an object. It lists the property names and their types.

interface User {
  name: string;
  age: number;
  email: string;
  admin?: boolean;
}

The question mark after admin means it is optional. A User object does not have to include it.

Now when you write a function that accepts a User, TypeScript ensures every object you pass has the right shape:

function sendEmail(user: User) {
  console.log("Sending to " + user.email);
}

If you pass an object missing the email property, TypeScript flags it immediately. If you misspell a property name, it flags that too.

Interfaces are one of the most useful features in TypeScript. They act as a contract: "any object claiming to be a User must have these properties with these types." It is like a form with required fields. If you leave one blank, the form tells you before you submit.

[TypeScript: Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)`,
      },
      {
        heading: "Union types: this or that",
        diagram: TsDiagramUnion,
        body: `A union type says "this value can be one of several types." You write it with a pipe character.

type Id = string | number;

This means an Id can be either a string like "abc-123" or a number like 42. Both are valid.

Unions are useful when real-world data is not always the same type. An API might return a user ID as a number, but a session token as a string. A form input might hold a string or null if the user has not typed anything yet:

type FormValue = string | null;

You can also use unions with literal values to create a fixed set of options:

type Status = "loading" | "success" | "error";

Now any variable with the type Status can only be one of those three exact strings. If you misspell one, TypeScript catches it.

[TypeScript: Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)`,
      },
      {
        heading: "Generics: reusable types",
        diagram: TsDiagramGenerics,
        body: `Generics let you write a type or function that works with any type, while still being type-safe. The angle brackets hold a placeholder, usually called T, that gets replaced with a real type when you use it.

The simplest example is a box that can hold any type of value:

type Box<T> = {
  value: T;
};

const stringBox: Box<string> = { value: "hello" };
const numberBox: Box<number> = { value: 42 };

Both boxes are type-safe: stringBox.value is always a string, numberBox.value is always a number. But you only wrote the Box type once.

Generics are everywhere in real code. Arrays use them:

const names: Array<string> = ["Alex", "Sam"];

Promises use them:

const response: Promise<User> = fetchUser(1);

You do not need to write your own generics to benefit from them. Just understanding the angle bracket syntax lets you read most TypeScript code. When you see Array<string>, read it as "an array of strings." When you see Promise<User>, read it as "a promise that will eventually give you a User."

[TypeScript: Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)`,
      },
      {
        heading: "Type narrowing",
        diagram: TsDiagramNarrowing,
        body: `When a value could be more than one type (a union), you need to check which type it actually is before using type-specific methods. This is called narrowing.

function format(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}

Inside the if block, TypeScript knows value is a string, so .toUpperCase() is safe. In the else branch, it knows value is a number, so .toFixed(2) is safe. TypeScript tracks the checks you write and narrows the type automatically.

Common narrowing patterns:

typeof checks for primitive types (string, number, boolean).
"property" in object checks whether an object has a specific property.
instanceof checks whether something is an instance of a class.
Equality checks like value === null narrow out null.

Narrowing is how TypeScript stays helpful without getting in your way. You write normal JavaScript checks, and TypeScript uses them to understand your code better. The types get more specific as your logic gets more specific.

[TypeScript: Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)`,
      },
      {
        heading: "Why it matters",
        body: `TypeScript does not change what your code does. It changes how confidently you can write it.

Without types, renaming a property means searching every file to update it manually. With types, the compiler shows you every place that breaks. Without types, a function might receive the wrong data and fail silently at runtime. With types, the mistake shows up in your editor before you save the file.

For teams, TypeScript acts as living documentation. An interface tells a new developer exactly what shape an API response has, without needing to read the backend code or check a wiki that might be outdated.

The learning curve is gentle. You can add TypeScript to an existing JavaScript project one file at a time. Start by renaming .js files to .ts and adding a few type annotations. The compiler will guide you from there.

The concepts in this article, annotations, interfaces, unions, generics, and narrowing, cover about 90% of what you will use day to day. Everything else builds on these foundations.`,
      },
    ],
  },
  "javascript-essentials": {
    title: "JavaScript essentials",
    subtitle: "The core building blocks of JavaScript, with a TypeScript toggle on every example",
    date: "April 2026",
    readTime: "8 min read",
    illustration: JavaScriptIllustration,
    sections: [
      {
        heading: "Variables and data types",
        body: `Variables are containers that hold a value. JavaScript has three ways to create them: let for values that change, const for values that stay the same, and var which is the old way (best avoided).

{{toggle:0}}

JavaScript has a handful of basic data types. The most common are strings (text), numbers, booleans (true or false), null (intentionally empty), and undefined (not yet assigned).

{{toggle:1}}

You do not need to tell JavaScript what type a variable is. It figures it out from the value you assign. TypeScript adds that ability, and you can see how by toggling the examples above.

[MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) [MDN: const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)

{{interactive:0}}`,
        interactives: [{ diagram: InteractiveVariables, steps: variablesSteps }],
        codeToggles: [
          {
            js: `let score = 0;\nscore = 10;\n\nconst name = "Alex";\n// name = "Sam";  // Error: can't reassign a const`,
            ts: `let score: number = 0;\nscore = 10;\n\nconst name: string = "Alex";\n// name = "Sam";  // Error: can't reassign a const`,
          },
          {
            js: `const username = "Alex";       // string\nconst age = 39;                // number\nconst isAdmin = true;          // boolean\nconst middleName = null;       // null\nlet address;                   // undefined`,
            ts: `const username: string = "Alex";\nconst age: number = 39;\nconst isAdmin: boolean = true;\nconst middleName: string | null = null;\nlet address: string | undefined;`,
          },
        ],
      },
      {
        heading: "Functions",
        body: `A function is a reusable block of code. You give it a name, define what inputs it accepts (called parameters), and write the code that runs when you call it.

{{toggle:0}}

Functions can return a value using the return keyword. Whatever comes after return is sent back to wherever the function was called.

{{toggle:1}}

{{interactive:0}}

Arrow functions are a shorter way to write the same thing. They are especially common in React.

{{toggle:2}}

The key difference you will notice in the TypeScript versions is that every parameter and return value has a type label. This means if you accidentally pass a number where a string is expected, your editor catches it before you run the code.

[MDN: Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)`,
        codeToggles: [
          {
            js: `function greet(name) {\n  return "Hello, " + name;\n}\n\ngreet("Alex");  // "Hello, Alex"`,
            ts: `function greet(name: string): string {\n  return "Hello, " + name;\n}\n\ngreet("Alex");  // "Hello, Alex"`,
          },
          {
            js: `function add(a, b) {\n  return a + b;\n}\n\nconst total = add(5, 3);  // 8`,
            ts: `function add(a: number, b: number): number {\n  return a + b;\n}\n\nconst total: number = add(5, 3);  // 8`,
          },
          {
            js: `const double = (n) => n * 2;\n\nconst greet = (name) => {\n  return "Hello, " + name;\n};`,
            ts: `const double = (n: number): number => n * 2;\n\nconst greet = (name: string): string => {\n  return "Hello, " + name;\n};`,
          },
        ],
        interactives: [{ diagram: InteractiveFunctionDiagram, steps: functionSteps }],
      },
      {
        heading: "Objects",
        body: `Objects group related data together using key-value pairs. They are one of the most important structures in JavaScript because almost everything is built from them.

{{toggle:0}}

You access values using dot notation or bracket notation.

{{toggle:1}}

In the TypeScript version, notice the interface keyword. It describes the shape of the object: which properties it must have and what types they hold. If you try to add a property that is not in the interface, or misspell a property name, TypeScript flags it immediately.`,
        codeToggles: [
          {
            js: `const user = {\n  name: "Alex",\n  age: 39,\n  role: "UX Engineer",\n};`,
            ts: `interface User {\n  name: string;\n  age: number;\n  role: string;\n}\n\nconst user: User = {\n  name: "Alex",\n  age: 39,\n  role: "UX Engineer",\n};`,
          },
          {
            js: `console.log(user.name);        // "Alex"\nconsole.log(user["role"]);     // "UX Engineer"\n\nuser.age = 40;                 // update a value`,
            ts: `console.log(user.name);        // "Alex"\nconsole.log(user["role"]);     // "UX Engineer"\n\nuser.age = 40;                 // update a value`,
          },
        ],
      },
      {
        heading: "Arrays and array methods",
        body: `Arrays are ordered lists. They can hold any type of value and are the main way you work with collections of data.

{{toggle:0}}

JavaScript arrays come with built-in methods that let you transform, filter, and search through data without writing loops yourself.

.map() creates a new array by transforming every item:

{{toggle:1}}

{{interactive:0}}

.filter() creates a new array with only the items that pass a test:

{{toggle:2}}

{{interactive:1}}

.find() returns the first item that matches:

{{toggle:3}}

{{interactive:2}}

These methods are everywhere in modern JavaScript and React. Learning them well pays off quickly.

[MDN: Array methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)`,
        codeToggles: [
          {
            js: `const colours = ["red", "green", "blue"];\n\nconsole.log(colours[0]);     // "red"\nconsole.log(colours.length); // 3\n\ncolours.push("yellow");      // add to the end`,
            ts: `const colours: string[] = ["red", "green", "blue"];\n\nconsole.log(colours[0]);     // "red"\nconsole.log(colours.length); // 3\n\ncolours.push("yellow");      // add to the end`,
          },
          {
            js: `const numbers = [1, 2, 3, 4];\nconst doubled = numbers.map((n) => n * 2);\n// [2, 4, 6, 8]`,
            ts: `const numbers: number[] = [1, 2, 3, 4];\nconst doubled: number[] = numbers.map((n) => n * 2);\n// [2, 4, 6, 8]`,
          },
          {
            js: `const words = ["hello", "hi", "hey", "howdy"];\nconst short = words.filter((w) => w.length <= 3);\n// ["hi", "hey"]`,
            ts: `const words: string[] = ["hello", "hi", "hey", "howdy"];\nconst short: string[] = words.filter((w) => w.length <= 3);\n// ["hi", "hey"]`,
          },
          {
            js: `const people = [\n  { name: "Alex", age: 39 },\n  { name: "Sam", age: 28 },\n];\n\nconst sam = people.find((p) => p.name === "Sam");\n// { name: "Sam", age: 28 }`,
            ts: `interface Person {\n  name: string;\n  age: number;\n}\n\nconst people: Person[] = [\n  { name: "Alex", age: 39 },\n  { name: "Sam", age: 28 },\n];\n\nconst sam: Person | undefined = people.find((p) => p.name === "Sam");`,
          },
        ],
        interactives: [{ diagram: InteractiveMapDiagram, steps: mapSteps }, { diagram: InteractiveFilterDiagram, steps: filterSteps }, { diagram: InteractiveFindDiagram, steps: findSteps }],
      },
      {
        heading: "Conditionals and logic",
        body: `Conditionals let your code make decisions. The most common form is if/else.

{{toggle:0}}

The ternary operator is a one-line shorthand for simple if/else checks. It is used heavily in React for conditional rendering.

{{toggle:1}}

You can also check multiple conditions with else if, or use switch for matching against specific values. But if/else and ternaries cover the vast majority of real-world cases.

{{interactive:0}}`,
        interactives: [{ diagram: InteractiveConditional, steps: conditionalSteps }],
        codeToggles: [
          {
            js: `const age = 39;\n\nif (age >= 18) {\n  console.log("Adult");\n} else {\n  console.log("Minor");\n}`,
            ts: `const age: number = 39;\n\nif (age >= 18) {\n  console.log("Adult");\n} else {\n  console.log("Minor");\n}`,
          },
          {
            js: `const age = 39;\nconst label = age >= 18 ? "Adult" : "Minor";\n// "Adult"`,
            ts: `const age: number = 39;\nconst label: string = age >= 18 ? "Adult" : "Minor";\n// "Adult"`,
          },
        ],
      },
      {
        heading: "Destructuring and spread",
        body: `Destructuring lets you unpack values from objects and arrays into separate variables. It is a shorthand that makes code cleaner.

{{toggle:0}}

{{interactive:0}}

Array destructuring works the same way but uses position instead of names:

{{toggle:1}}

The spread operator (...) copies the contents of an array or object into a new one. It is useful for creating copies without mutating the original.

{{toggle:2}}

{{interactive:1}}

Destructuring and spread show up constantly in React. Props are destructured in function parameters, state updates use spread to copy objects, and arrays are spread into new arrays when adding items.

[MDN: Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)`,
        codeToggles: [
          {
            js: `const user = { name: "Alex", age: 39, role: "Engineer" };\n\n// Without destructuring\nconst name = user.name;\nconst role = user.role;\n\n// With destructuring\nconst { name, role } = user;`,
            ts: `interface User {\n  name: string;\n  age: number;\n  role: string;\n}\n\nconst user: User = { name: "Alex", age: 39, role: "Engineer" };\n\nconst { name, role }: { name: string; role: string } = user;`,
          },
          {
            js: `const colours = ["red", "green", "blue"];\nconst [first, second] = colours;\n// first = "red", second = "green"`,
            ts: `const colours: string[] = ["red", "green", "blue"];\nconst [first, second]: string[] = colours;\n// first = "red", second = "green"`,
          },
          {
            js: `const original = { name: "Alex", age: 39 };\nconst updated = { ...original, age: 40 };\n// { name: "Alex", age: 40 }\n\nconst list = [1, 2, 3];\nconst extended = [...list, 4, 5];\n// [1, 2, 3, 4, 5]`,
            ts: `const original = { name: "Alex", age: 39 };\nconst updated = { ...original, age: 40 };\n// { name: "Alex", age: 40 }\n\nconst list: number[] = [1, 2, 3];\nconst extended: number[] = [...list, 4, 5];\n// [1, 2, 3, 4, 5]`,
          },
        ],
        interactives: [{ diagram: InteractiveDestructureDiagram, steps: destructureSteps }, { diagram: InteractiveSpreadDiagram, steps: spreadSteps }],
      },
      {
        heading: "Async: promises and fetch",
        body: `JavaScript is single-threaded, meaning it does one thing at a time. But some tasks, like fetching data from an API, take time. Promises and async/await let you handle these without blocking everything else.

A promise represents a value that does not exist yet but will in the future. The fetch API returns a promise:

{{toggle:0}}

The async/await syntax is a cleaner way to write the same thing:

{{toggle:1}}

In the TypeScript versions, notice that the fetch response and the resulting data both have types. This means your editor can autocomplete properties on the user object and warn you if you access something that does not exist.

These are the core building blocks of JavaScript. Every framework, library, and tool you encounter is built from these fundamentals: variables, functions, objects, arrays, conditionals, destructuring, and async patterns. Understand these and the rest follows.

[MDN: async/await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises)`,
        codeToggles: [
          {
            js: `fetch("/api/user")\n  .then((response) => response.json())\n  .then((data) => {\n    console.log(data.name);\n  })\n  .catch((error) => {\n    console.log("Something went wrong");\n  });`,
            ts: `interface User {\n  name: string;\n  email: string;\n}\n\nfetch("/api/user")\n  .then((response: Response) => response.json())\n  .then((data: User) => {\n    console.log(data.name);\n  })\n  .catch((error: Error) => {\n    console.log("Something went wrong");\n  });`,
          },
          {
            js: `async function getUser() {\n  const response = await fetch("/api/user");\n  const data = await response.json();\n  console.log(data.name);\n}`,
            ts: `interface User {\n  name: string;\n  email: string;\n}\n\nasync function getUser(): Promise<User> {\n  const response: Response = await fetch("/api/user");\n  const data: User = await response.json();\n  console.log(data.name);\n  return data;\n}`,
          },
        ],
      },
    ],
  },
  "gsap-animation-architecture": {
    title: "How I animated this portfolio",
    subtitle: "The design-to-code workflow, GSAP patterns, and the human process behind every animation",
    date: "April 2026",
    readTime: "10 min read",
    illustration: AnimationIllustration,
    sections: [
      {
        heading: "The workflow: Figma to code to animation",
        body: `Every animation on this site started the same way: as a static design in Figma. Not as code, not as a GSAP timeline, not as coordinates on a grid. As a picture of what the finished state should look like.

The process has three steps, and the first two have nothing to do with animation.

Step 1: design the final frame in Figma. Place the boxes, the arrows, the labels, the layout. This is where all the visual decisions happen. Figma handles the coordinates, the spacing, the alignment. You are just arranging shapes on a canvas.

Step 2: export the SVG. Select the frame in Figma, right-click, "Copy as SVG." Paste it into a React component. Figma gives you the full SVG markup with every coordinate, colour, and size already calculated. You never type a coordinate yourself.

Step 3: decide how things arrive. This is the only animation step. You look at the finished SVG and ask: what appears first? What appears second? What slides in, what fades in, what pops? Then you write a short GSAP timeline that describes the entrances. That is it.

The mental model is simple. Figma gives you the destination. [GSAP](https://gsap.com/docs/v3/GSAP/) describes the journey to get there.`,
      },
      {
        heading: "Step 1: designing in Figma",
        body: `I design every illustration and diagram in Figma first. The interactive diagrams for the blog articles, the hero illustrations, the modal entrance layouts, all of them start as static frames.

The key decision at this stage is grouping. While designing, I think about which elements should appear together. The title text is one group. The input boxes are another. The arrows are another. The output boxes are another. I name these groups in Figma so they translate cleanly into code.

For example, the .map() diagram started as a Figma frame with four input boxes at the top, four arrows in the middle, and four output boxes at the bottom. I did not think about timing or easing at this stage. I just made sure the layout told the story: data goes in at the top, gets transformed, and comes out at the bottom.

The design tokens (colours, fonts, radii) are managed with Tokens Studio in Figma. The same tokens power the live site through SCSS variables. This means the colours in Figma and the colours in production are always in sync.`,
      },
      {
        heading: "Step 2: from Figma SVG to React",
        body: `Once the design looks right, I select the frame in Figma and copy as SVG. The output is standard SVG markup with all positions baked in. I paste it into a React component and make two small changes.

First, I replace hardcoded hex colours with CSS custom properties. #dfff47 becomes var(--color-accent). This way the illustration responds to the dark/light theme toggle automatically.

Second, I wrap related elements in groups and give them class names that describe their role in the animation:

<g className="idg-title">...</g>
<g className="idg-input">...</g>
<g className="idg-arrow">...</g>
<g className="idg-output">...</g>

These class names are not about styling. They are handles for GSAP to grab onto. "idg-input" means "this is an input element, animate it during the input stage." The grouping mirrors what I decided in Figma.

No coordinates to calculate. No maths to do. Figma already placed everything where it needs to be. The class names are the only thing I add by hand.`,
      },
      {
        heading: "Step 3: writing the GSAP timeline",
        body: `This is where the animation happens, and it is the shortest step. Every animation on this site uses one of five patterns, and they all follow the same structure.

The most common pattern is an entrance [timeline](https://gsap.com/docs/v3/GSAP/gsap.timeline()). You create a timeline, then tell each group how to enter:

const tl = gsap.timeline();

tl.from(".idg-title", { opacity: 0, duration: 0.3 })
  .from(".idg-input", { opacity: 0, x: -20, duration: 0.4 }, "-=0.2")
  .from(".idg-arrow", { opacity: 0, scaleX: 0, duration: 0.3 }, "-=0.1")
  .from(".idg-output", { opacity: 0, scale: 0.8, duration: 0.4 }, "-=0.15");

That is the entire animation. Four lines. Each line says: "take this group, start it invisible (and optionally offset or scaled), and animate it to where Figma placed it."

The [.from()](https://gsap.com/docs/v3/GSAP/Timeline/from()) method is the key insight. It animates FROM the values you give it TO the element's natural position. You never specify the end state because the end state is already defined by the SVG markup that Figma generated. GSAP just needs to know where things start.

The "-=0.2" overlap means the next animation starts 0.2 seconds before the previous one finishes. This is what makes sequences feel smooth rather than mechanical. I adjust this by feel, not by formula. Usually 0.1 to 0.3 seconds of overlap works well.`,
      },
      {
        heading: "The five patterns I reuse everywhere",
        body: `Every animation on this site is one of five patterns. Once you know them, you can build any animation you see here.

1. Entrance timelines: a [gsap.timeline()](https://gsap.com/docs/v3/GSAP/gsap.timeline()) with chained .from() calls and overlap. Used for the hero section, navigation menu, contact modal, and case study. The elements cascade in order.

2. Scroll reveals: [gsap.fromTo()](https://gsap.com/docs/v3/GSAP/gsap.fromTo()) with a [scrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) that fires once when the element enters the viewport. Used for every section on the page. The element fades and slides in from a direction (up, left, or right).

3. Continuous motion: [gsap.to()](https://gsap.com/docs/v3/GSAP/gsap.to()) with repeat: -1 and yoyo: true. Used for the hero glow orbs and the floating action button. The element drifts back and forth forever.

4. Cursor interaction: gsap.to() on mousemove with a multiplier (0.3) so the element follows at a fraction of the cursor distance. On mouseleave, elastic.out easing snaps it back with a bounce. Used for the magnetic buttons.

5. Modal choreography: a timeline combining opacity, scale, rotateX, and either y-translation or clipPath for the reveal. Used for the contact modal, case study, and article modals.

Every animation on this site is one of these five. The variety comes from mixing different properties (opacity + y for a slide, opacity + scale for a pop, opacity + scaleX for an arrow drawing in), not from different techniques.`,
      },
      {
        heading: "Easing: why animations feel right or wrong",
        body: `The easing function is the most important decision in any animation. It controls the speed curve: does the animation start fast and slow down, or start slow and speed up?

I use three easing functions for almost everything:

"power3.out" for entrances. Starts fast, decelerates at the end. Elements snap into place and settle gently. This is the default for 90% of animations.

"sine.inOut" for looping motion. Smooth acceleration and deceleration in both directions. Used for the glow orbs and any continuous floating effect.

"elastic.out(1, 0.4)" for playful snap-backs. The element overshoots its target and springs back. Used sparingly, only on the magnetic button return and a few scale-in effects.

The easiest way to understand easing is to try the [GSAP Ease Visualizer](https://gsap.com/docs/v3/Eases/). It lets you see the speed curve of every easing function. I spent time there before choosing mine, and I suggest doing the same. Pick two or three and use them consistently. Mixing too many easing functions makes a site feel chaotic.`,
      },
      {
        heading: "The motion toggle",
        body: `Every animation on this site can be turned off. This is not optional, it is a core accessibility requirement.

The MotionToggle component switches a data-motion attribute between "full" and "reduced" on the document root. Every component checks an isReduced flag from context before running any animation:

const { isReduced } = useTheme();

useEffect(() => {
  if (isReduced) return;
  // ... animation code only runs if motion is on
}, [isReduced]);

On first load, the site checks the operating system preference using window.matchMedia("(prefers-reduced-motion: reduce)"). If the user has told their OS they prefer less motion, the toggle starts in the reduced state automatically. No animations play, no canvas loops run, no ScrollTriggers are created.

For components that still need to show content (like scroll reveals), I provide simple CSS fallback animations that run once and settle immediately. These are shorter, simpler, and cause no motion sensitivity issues.`,
      },
      {
        heading: "Performance on mobile",
        body: `The background canvas was the biggest performance problem. It runs a continuous requestAnimationFrame loop drawing dots with connecting lines. On desktop this is fine. On an iPhone, it was consuming 40-60% of the main thread.

The fixes were straightforward: reduce dots from 80 to 30 on mobile, skip the connecting-line calculation entirely (it is O(n squared) and barely visible on small screens), throttle to 24fps instead of 60, pre-render the static grid to an offscreen canvas, and read CSS custom properties once on mount instead of every frame.

The other performance decision was lazy-loading. The article modal, case study, contact form, and floating action button are all loaded with React.lazy(). They are not downloaded until the user actually opens them. This cut the initial bundle by 35%.

Easing functions also matter for perceived performance. "power3.out" starts fast and slows down, making a 0.5 second animation feel snappy. A linear easing at the same duration feels sluggish. The animation is the same length, but the speed curve tricks your brain into thinking it was faster.`,
      },
      {
        heading: "The honest summary",
        body: `The process is simpler than it looks. Design the end state in Figma. Export the SVG. Group elements by when they should appear. Write a short GSAP timeline with .from() calls and overlaps. Pick an easing. Check reduced motion. Done.

I do not calculate coordinates. Figma does that. I do not work out timing with formulas. I adjust by feel, scrubbing durations between 0.3 and 0.6 seconds and overlaps between 0.1 and 0.3 until it looks right. I do not memorise easing curves. I use power3.out for almost everything and only reach for elastic or back easing when something needs to feel playful.

The five patterns (entrance timelines, scroll reveals, continuous motion, cursor interaction, modal choreography) cover every animation on this site. Learn those five and you can animate anything.

The hardest part is not the code. It is restraint. Every element could bounce, every section could parallax, every button could wiggle. The discipline is knowing when animation serves the experience and when it is just showing off. If you would not notice the animation on a second visit, it is doing its job.

If you want to learn GSAP from scratch, start with the [getting started guide](https://gsap.com/resources/getting-started/timelines/), then explore the [ease visualizer](https://gsap.com/docs/v3/Eases/) and the [ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/). For React specifically, look into [gsap.context()](https://gsap.com/docs/v3/GSAP/gsap.context()) for clean animation cleanup in useEffect hooks.`,
      },
    ],
  },
};

/* ===== MODAL COMPONENT ===== */

export default function ArticleModal({ articleId, isOpen, onClose }) {
  const overlayRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const triggersRef = useRef([]);
  const { isReduced } = useTheme();

  const cleanup = useCallback(() => {
    triggersRef.current.forEach((st) => st.kill());
    triggersRef.current = [];
  }, []);

  useEffect(() => {
    if (!isOpen || !overlayRef.current) return;

    document.body.style.overflow = "hidden";

    if (isReduced) {
      return () => { document.body.style.overflow = ""; };
    }

    const scroller = scrollContainerRef.current;

    // Entrance animation
    const entranceTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    entranceTl
      .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35 })
      .fromTo(scroller, { y: "100%" }, { y: "0%", duration: 0.6, ease: "power4.out" }, "-=0.15")
      .fromTo(".am-hero-eyebrow", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.25")
      .fromTo(".am-hero-title", { opacity: 0, y: 50, skewY: 3 }, { opacity: 1, y: 0, skewY: 0, duration: 0.6 }, "-=0.3")
      .fromTo(".am-hero-subtitle", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.3")
      .fromTo(".am-hero-meta span", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.06 }, "-=0.2");

    // Scroll-triggered section reveals
    document.querySelectorAll(".am-section").forEach((section) => {
      const st = ScrollTrigger.create({
        trigger: section,
        scroller,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(section,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
          );
        },
      });
      triggersRef.current.push(st);
    });

    return () => {
      cleanup();
      document.body.style.overflow = "";
    };
  }, [isOpen, articleId, cleanup, isReduced]);

  const handleClose = useCallback(() => {
    if (isReduced) {
      cleanup();
      onClose();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        cleanup();
        onClose();
      },
    });
    tl.to(scrollContainerRef.current, { y: "100%", duration: 0.45, ease: "power3.in" })
      .to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.15");
  }, [isReduced, cleanup, onClose]);

  // Close on escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, handleClose]);

  if (!isOpen || !articleId) return null;

  const article = ARTICLES[articleId];
  if (!article) return null;

  const Illustration = article.illustration;

  return (
    <div className="am-overlay" ref={overlayRef}>
      <div className="am-scroll-container" ref={scrollContainerRef}>
        <button className="am-close-button" onClick={handleClose} aria-label="Close article">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <article className="am-article">
          {/* Hero */}
          <header className="am-hero">
            <span className="am-hero-eyebrow">Article</span>
            <h1 className="am-hero-title">{article.title}</h1>
            <p className="am-hero-subtitle">{article.subtitle}</p>
            <div className="am-hero-meta">
              <span>{article.date}</span>
              <span className="am-meta-separator">&middot;</span>
              <span>{article.readTime}</span>
            </div>
          </header>

          {/* Illustration */}
          <div className="am-illustration-wrapper">
            <Illustration />
          </div>

          {/* Disclaimer */}
          {article.disclaimer && (
            <div className="am-disclaimer">
              <p>{article.disclaimer}</p>
            </div>
          )}

          {/* Body sections */}
          <div className="am-body">
            {article.sections.map((section, i) => (
              <section key={i} className="am-section" style={isReduced ? undefined : { opacity: 0 }}>
                <h2 className="am-section-heading">{section.heading}</h2>
                {section.diagram && (
                  <div className="am-section-diagram">
                    {section.diagram}
                  </div>
                )}
                {renderBody(section.body, section.codeToggles, section.interactives)}
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
