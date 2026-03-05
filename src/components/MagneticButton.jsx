import { useRef, useCallback } from "react";
import gsap from "gsap";

export default function MagneticButton({ children, className = "", href, ...props }) {
  const buttonRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
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
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = buttonRef.current;
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.4)",
    });
  }, []);

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
