// MagneticButton.jsx - Cursor-following button with elastic return
//
// The button element shifts toward the cursor position while hovering, creating
// a "magnetic" feel. On mouse leave, it springs back with elastic easing.
//
// I use useCallback for both handlers to avoid creating new function references
// on every render, since these are attached as event listeners and would cause
// unnecessary re-bindng otherwise. The 0.3 multiplier on cursor offset keeps the
// movement subtle, larger values felt too exaggerated in testing.
//
// The component renders as either <a> or <button> depending on whether an href
// prop is provided, so it works for both navigation links and action buttons
// without duplicating the magnetic behaviour.
//
// Like all animation components, this respects isReduced from ThemeContext and
// returns early from both handlers when motion is disabled.

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { useTheme } from "../context/ThemeContext";

export default function MagneticButton({ children, className = "", href, ...props }) {
  const buttonRef = useRef(null);
  const { isReduced } = useTheme();

  const handleMouseMove = useCallback((e) => {
    if (isReduced) return;
    const el = buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [isReduced]);

  const handleMouseLeave = useCallback(() => {
    if (isReduced) return;
    const el = buttonRef.current;
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.4)",
    });
  }, [isReduced]);

  const Tag = href ? "a" : "button";

  return (
    <Tag
      ref={buttonRef}
      className={className}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: "inline-flex" }}
      {...props}
    >
      {children}
    </Tag>
  );
}
