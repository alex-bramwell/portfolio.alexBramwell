import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../context/ThemeContext";

gsap.registerPlugin(ScrollTrigger);

export function useCountUp(endValue, suffix = "", duration = 1.8) {
  const { isReduced } = useTheme();
  const [display, setDisplay] = useState(isReduced ? endValue + suffix : "0" + suffix);
  const triggerRef = useRef(null);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el || isReduced) {
      setDisplay(endValue + suffix);
      return;
    }

    const counter = { val: 0 };

    const tween = gsap.to(counter, {
      val: endValue,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
      onUpdate: () => {
        setDisplay(Math.round(counter.val) + suffix);
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [endValue, suffix, duration, isReduced]);

  return { display, triggerRef };
}
