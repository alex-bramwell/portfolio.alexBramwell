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
