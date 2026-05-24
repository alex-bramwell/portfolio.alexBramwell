/*
 * GSAP cheat sheet for this file:
 *
 *   gsap.registerPlugin(ScrollTrigger)  Registers the ScrollTrigger plugin once so any tween
 *                                       in the app can use scroll-based triggers.
 *   gsap.set(targets, vars)             Applies styles instantly with no tween. Used here to
 *                                       park words in their hidden start state before reveal.
 *   gsap.to(targets, vars)              Animates targets from their current values to the ones
 *                                       given in vars. The workhorse for the actual reveal.
 *   tween.kill() / scrollTrigger.kill() Stops a tween or ScrollTrigger and frees its listeners.
 *                                       Called on cleanup so React unmounts do not leak.
 *
 * ScrollTrigger options used here:
 *
 *   trigger    The element whose position drives the animation.
 *   start      When the trigger should fire. "top 85%" means: fire when the top of the
 *              trigger element passes the line 85% down the viewport.
 *   once       If true, the trigger fires a single time and never replays.
 *
 * Tween options used here:
 *
 *   duration   How long the tween takes, in seconds.
 *   stagger    Delay between each target when animating an array. 0.06 staggers each word
 *              by 60ms, producing the cascade.
 *   ease       The speed curve. "power3.out" starts fast and decelerates, so elements snap
 *              in and settle. It is the default entrance ease across this site. Other eases
 *              used elsewhere: "sine.inOut" for looping motion and "elastic.out(1, 0.4)"
 *              for playful snap-backs.
 *
 * What this component does: takes a heading, splits it into per-word spans wrapped in
 * overflow-hidden masks, then uses GSAP + ScrollTrigger to cascade each word from a
 * hidden, tilted-back 3D state into its final position when the heading scrolls into
 * view. The animation runs once per page load, respects the site-wide motion toggle,
 * and falls back to plain static text when reduced motion is preferred.
 */

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
    // Motion toggle: skip the animation entirely if the user prefers reduced motion.
    if (!container || isReduced) return;

    const words = container.querySelectorAll(".split-word");

    // Park each word in its hidden start state: invisible, nudged down, tilted back in 3D.
    // The natural (final) position is whatever CSS lays out, so we never specify an end value.
    gsap.set(words, { opacity: 0, y: 20, rotateX: -40 });

    // Scroll-reveal pattern: animate words to their natural position once they enter view.
    const tween = gsap.to(words, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "power3.out", // default entrance ease, snaps in fast then settles
      stagger: 0.06, // each word starts 60ms after the previous, giving the cascade
      scrollTrigger: {
        trigger: container,
        start: "top 85%", // fire when the heading is 85% down the viewport
        once: true, // play on first reveal only, no replay on scroll back
      },
    });

    // Tear down the ScrollTrigger and tween on unmount or when motion preference flips.
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [isReduced]);

  // Splits a heading into per-word spans so each word can animate independently.
  // The output structure is:
  //
  //   <span class="split-word-wrapper">   <-- mask. overflow:hidden clips the word as it slides up
  //     <span class="split-word">         <-- animated target. GSAP tweens opacity, y, rotateX here
  //       word
  //     </span>
  //   </span>
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

    // Preserve manual line breaks as-is, no wrapping needed.
    if (node?.type === "br") return node;

    // Same wrapping as plain text, but the <em> is kept inside .split-word so the accent
    // colour from SCSS still applies while GSAP animates the parent span.
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

  // Final rendered structure:
  //
  //   <Tag class="split-heading">                    <-- ScrollTrigger watches this element.
  //                                                      perspective:600px gives rotateX its 3D depth.
  //     <span class="split-word-wrapper">            <-- mask, one per word
  //       <span class="split-word">word</span>       <-- GSAP animates this from hidden to visible
  //     </span>
  //     ...repeat per word...
  //   </Tag>
  return (
    <Tag ref={containerRef} className={`split-heading ${className}`} style={isReduced ? undefined : { perspective: "600px" }}>
      {processedChildren}
    </Tag>
  );
}
