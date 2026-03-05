import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useCountUp(endValue, suffix = "", duration = 1.8) {
  const [display, setDisplay] = useState("0" + suffix);
  const triggerRef = useRef(null);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

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
  }, [endValue, suffix, duration]);

  return { display, triggerRef };
}
