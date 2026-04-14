// ScrollReveal.jsx - Reusable scroll-triggered entrance wrapper
//
// This is the most-used animation component on the site. Rather than writing
// GSAP ScrollTrigger logic in every section, I wrap content in <ScrollReveal>
// and let it handle the entrance animation, direction, and stagger timing.
//
// The approach: GSAP handles animation when motion is "full", but I also provide
// a pure CSS fallback (via css-reveal classes in ScrollReveal.scss) when motion is
// "reduced". This means reduced-motion users still get a subtle fade-in via CSS
// @keyframes, they just do not get the GSAP-driven physics and stagger. I chose
// this over showing everything statically because a gentle fade still aids readability
// without being disorienting.
//
// Every GSAP tween and ScrollTrigger is cleaned up on unmount. I learned early on
// that skipping cleanup causes ghost triggers and memory leaks, especially when
// modals mount and unmount components that contain ScrollReveals.

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../context/ThemeContext";
import "./ScrollReveal.scss";

gsap.registerPlugin(ScrollTrigger);

const directionProps = {
  up:    { y: 30, x: 0 },
  left:  { y: 0, x: -30 },
  right: { y: 0, x: 30 },
};

export default function ScrollReveal({ children, direction = "up", stagger = 0, className = "" }) {
  const elementRef = useRef(null);
  const { isReduced } = useTheme();

  useEffect(() => {
    const el = elementRef.current;
    if (!el || isReduced) return;

    const { x, y } = directionProps[direction] || directionProps.up;

    const tween = gsap.fromTo(
      el,
      { opacity: 0, x, y },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.7,
        delay: stagger * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [direction, stagger, isReduced]);

  const dirClass = isReduced ? `css-reveal css-reveal-${direction}` : "";

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal ${dirClass} ${className}`}
      style={isReduced ? undefined : { opacity: 0 }}
    >
      {children}
    </div>
  );
}
