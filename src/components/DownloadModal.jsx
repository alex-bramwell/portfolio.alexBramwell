import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useTheme } from "../context/ThemeContext";
import { generateCV } from "../utils/generateCV";
import "./DownloadModal.scss";

const RESUME_URL = import.meta.env.BASE_URL + "alex-bramwell-resume.json";

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function DownloadModal({ isOpen, onClose }) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const tlRef = useRef(null);
  const [generating, setGenerating] = useState(null); // "docx" | "json" | null
  const { isReduced } = useTheme();

  useEffect(() => {
    if (!overlayRef.current || !modalRef.current) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";

      if (isReduced) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tlRef.current = tl;

      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        .fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.92, y: 40, rotateX: 8 },
          { opacity: 1, scale: 1, y: 0, rotateX: 0, duration: 0.5, ease: "back.out(1.4)" },
          "-=0.15"
        )
        .fromTo(
          ".download-modal-header-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: "power2.out" },
          "-=0.3"
        )
        .fromTo(
          ".download-modal-title",
          { opacity: 0, y: 20, skewY: 2 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.4 },
          "-=0.4"
        )
        .fromTo(
          ".download-modal-subtitle",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3 },
          "-=0.2"
        )
        .fromTo(
          ".download-option",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 },
          "-=0.15"
        );
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isReduced]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  async function handleDocx() {
    setGenerating("docx");
    try {
      const res = await fetch(RESUME_URL);
      const resume = await res.json();
      const blob = await generateCV(resume);
      triggerDownload(blob, "Alex-Bramwell-CV.docx");
    } catch (err) {
      console.error("DOCX generation failed:", err);
    } finally {
      setGenerating(null);
    }
  }

  async function handleJson() {
    setGenerating("json");
    try {
      const res = await fetch(RESUME_URL);
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      triggerDownload(blob, "Alex-Bramwell-Resume.json");
    } catch (err) {
      console.error("JSON download failed:", err);
    } finally {
      setGenerating(null);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="download-modal-overlay" ref={overlayRef} onClick={onClose}>
      <div className="download-modal-container" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <button className="download-modal-close" onClick={onClose} aria-label="Close download modal">&times;</button>
        <div className="download-modal-header-line" />
        <h2 className="download-modal-title">Download CV</h2>
        <p className="download-modal-subtitle">Choose a format that works best for you.</p>

        <div className="download-option-grid">
          <button className="download-option" onClick={handleDocx} disabled={!!generating}>
            <div className="download-option-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <path d="M14 2v6h6" />
                <path d="M8 13h3M8 17h3" />
              </svg>
            </div>
            <div className="download-option-text">
              <span className="download-option-label">
                {generating === "docx" ? "Generating..." : "Word Document"}
              </span>
              <span className="download-option-ext">.docx</span>
            </div>
            <span className="download-option-desc">Traditional CV format, compatible with ATS and recruiter tools.</span>
          </button>

          <button className="download-option" onClick={handleJson} disabled={!!generating}>
            <div className="download-option-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <path d="M14 2v6h6" />
                <path d="M8 13l2 2-2 2M13 13l-2 2 2 2" />
              </svg>
            </div>
            <div className="download-option-text">
              <span className="download-option-label">
                {generating === "json" ? "Downloading..." : "Structured Data"}
              </span>
              <span className="download-option-ext">.json</span>
            </div>
            <span className="download-option-desc">Machine-readable resume data for automated parsing and integrations.</span>
          </button>
        </div>
      </div>
    </div>
  );
}
