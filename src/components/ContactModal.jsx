import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import "./ContactModal.scss";

export default function ContactModal({ isOpen, onClose }) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const formRef = useRef(null);
  const tlRef = useRef(null);
  const [formState, setFormState] = useState("idle"); // idle | sending | success | error
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    if (!overlayRef.current || !modalRef.current) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";

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
          ".modal-header-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: "power2.out" },
          "-=0.3"
        )
        .fromTo(
          ".modal-title",
          { opacity: 0, y: 20, skewY: 2 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.4 },
          "-=0.4"
        )
        .fromTo(
          ".modal-subtitle",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3 },
          "-=0.2"
        )
        .fromTo(
          ".modal-form-field",
          { opacity: 0, x: -30, rotateY: -5 },
          { opacity: 1, x: 0, rotateY: 0, duration: 0.4, stagger: 0.08 },
          "-=0.2"
        )
        .fromTo(
          ".modal-submit-button",
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(2)" },
          "-=0.15"
        )
        .fromTo(
          ".modal-close-button",
          { opacity: 0, rotate: -90 },
          { opacity: 1, rotate: 0, duration: 0.3 },
          "-=0.4"
        );
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        onClose();
        setFormState("idle");
        setFormData({ name: "", email: "", message: "" });
      },
    });

    tl.to(modalRef.current, {
      opacity: 0,
      scale: 0.92,
      y: 30,
      duration: 0.3,
      ease: "power2.in",
    }).to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.15");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState("sending");

    gsap.to(".modal-submit-button", {
      scale: 0.95,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
    });

    try {
      const response = await fetch("https://formsubmit.co/ajax/alex.s.bramwell.86@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: "Portfolio Contact Form",
        }),
      });

      if (!response.ok) throw new Error("Failed");

      setFormState("success");

      const tl = gsap.timeline();
      tl.to(".modal-form-inner", { opacity: 0, y: -20, duration: 0.3 })
        .fromTo(
          ".modal-success-state",
          { opacity: 0, scale: 0.8, display: "none" },
          { opacity: 1, scale: 1, display: "flex", duration: 0.4, ease: "back.out(2)" }
        )
        .fromTo(
          ".success-check-path",
          { strokeDashoffset: 100 },
          { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" },
          "-=0.2"
        )
        .fromTo(
          ".success-ring",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" },
          "-=0.5"
        )
        .fromTo(
          ".modal-success-text",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.3 },
          "-=0.2"
        );

      // fire particles
      const particles = document.querySelectorAll(".success-particle");
      particles.forEach((p, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const dist = 60 + Math.random() * 40;
        gsap.fromTo(
          p,
          { x: 0, y: 0, opacity: 1, scale: 1 },
          {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            opacity: 0,
            scale: 0,
            duration: 0.7 + Math.random() * 0.3,
            ease: "power2.out",
            delay: 0.2,
          }
        );
      });
    } catch {
      setFormState("error");
      gsap.fromTo(
        modalRef.current,
        { x: -8 },
        { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }
      );
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleClose}>
      <div
        className="modal-container"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{ perspective: "800px" }}
      >
        <button className="modal-close-button" onClick={handleClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-header-line" />

        <div className="modal-form-inner" style={formState === "success" ? { display: "none" } : {}}>
          <h2 className="modal-title">Send a message</h2>
          <p className="modal-subtitle">
            I'll get back to you within 24 hours.
          </p>

          <form onSubmit={handleSubmit} ref={formRef}>
            <div className="modal-form-field">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder=" "
                autoComplete="name"
              />
              <label>Your name</label>
              <div className="field-focus-line" />
            </div>

            <div className="modal-form-field">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                autoComplete="email"
              />
              <label>Email address</label>
              <div className="field-focus-line" />
            </div>

            <div className="modal-form-field">
              <textarea
                name="message"
                required
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder=" "
              />
              <label>Your message</label>
              <div className="field-focus-line" />
            </div>

            <button
              type="submit"
              className="modal-submit-button"
              disabled={formState === "sending"}
            >
              <span className="submit-button-text">
                {formState === "sending" ? "Sending..." : formState === "error" ? "Try again" : "Send message"}
              </span>
              <span className="submit-button-arrow">&rarr;</span>
              {formState === "sending" && <span className="submit-spinner" />}
            </button>
          </form>
        </div>

        <div className="modal-success-state">
          <div className="success-icon-container">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="success-particle"
                style={{ background: i % 2 === 0 ? "var(--color-accent)" : "var(--color-success)" }}
              />
            ))}
            <svg className="success-ring" width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" fill="none" stroke="var(--color-accent)" strokeWidth="2" opacity="0.3" />
            </svg>
            <svg className="success-check" width="48" height="48" viewBox="0 0 48 48">
              <path
                className="success-check-path"
                d="M14 24 L22 32 L34 16"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="100"
                strokeDashoffset="100"
              />
            </svg>
          </div>
          <p className="modal-success-text">Message sent successfully</p>
          <p className="modal-success-subtext">Thank you for reaching out!</p>
        </div>
      </div>
    </div>
  );
}
