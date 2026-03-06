import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../context/ThemeContext";
import "./SplitHeading.scss";

gsap.registerPlugin(ScrollTrigger);

export default function SplitHeading({ children, className = "", tag: Tag = "h2" }) {
  const containerRef = useRef(null);
  const { isReduced } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || isReduced) return;

    const words = container.querySelectorAll(".split-word");

    gsap.set(words, { opacity: 0, y: 20, rotateX: -40 });

    const tween = gsap.to(words, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.06,
      scrollTrigger: {
        trigger: container,
        start: "top 85%",
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [isReduced]);

  const wrapWords = (node) => {
    if (typeof node === "string") {
      return node.split(/(\s+)/).map((segment, i) => {
        if (/^\s+$/.test(segment)) return segment;
        return (
          <span key={i} className="split-word-wrapper">
            <span className="split-word">{segment}</span>
          </span>
        );
      });
    }

    if (node?.type === "br") return node;

    if (node?.type === "em") {
      const text = typeof node.props.children === "string" ? node.props.children : "";
      return text.split(/(\s+)/).map((segment, i) => {
        if (/^\s+$/.test(segment)) return segment;
        return (
          <span key={`em-${i}`} className="split-word-wrapper">
            <span className="split-word">
              <em>{segment}</em>
            </span>
          </span>
        );
      });
    }

    return node;
  };

  const processedChildren = Array.isArray(children)
    ? children.flatMap(wrapWords)
    : wrapWords(children);

  return (
    <Tag ref={containerRef} className={`split-heading ${className}`} style={isReduced ? undefined : { perspective: "600px" }}>
      {processedChildren}
    </Tag>
  );
}
