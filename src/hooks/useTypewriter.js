// useTypewriter.js - Character-by-character phrase cycling for the hero section
//
// I built this as a custom hook rather than using a library because the
// requirements are simple (type, pause, delete, cycle) and a library would
// add a dependency for about 30 lines of logic. The deletion speed is
// intentionally double the typing speed (charSpeed / 2) because it feels
// more natural, people notice slow typing but fast deletion just gets out
// of the way.
//
// Each character change is a separate setTimeout rather than a single
// interval because the timing needs to vary: typing speed, deletion speed,
// and the pause between phrases are all different durations. The cleanup
// function ensures no orphaned timers if the component unmounts mid-animation.

import { useState, useEffect } from "react";

export function useTypewriter(phrases, charSpeed = 65, pauseDuration = 2000) {
  const [displayText, setDisplayText] = useState("");
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);
  const [activeCharIndex, setActiveCharIndex] = useState(0);
  const [isDeletingPhrase, setIsDeletingPhrase] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[activePhraseIndex];
    const typeDelay = isDeletingPhrase ? charSpeed / 2 : charSpeed;
    const timer = setTimeout(() => {
      if (!isDeletingPhrase) {
        setDisplayText(currentPhrase.slice(0, activeCharIndex + 1));
        if (activeCharIndex + 1 === currentPhrase.length) {
          setTimeout(() => setIsDeletingPhrase(true), pauseDuration);
        } else {
          setActiveCharIndex((c) => c + 1);
        }
      } else {
        setDisplayText(currentPhrase.slice(0, activeCharIndex - 1));
        if (activeCharIndex === 0) {
          setIsDeletingPhrase(false);
          setActivePhraseIndex((i) => (i + 1) % phrases.length);
        } else {
          setActiveCharIndex((c) => c - 1);
        }
      }
    }, typeDelay);
    return () => clearTimeout(timer);
  }, [activeCharIndex, isDeletingPhrase, activePhraseIndex, phrases, charSpeed, pauseDuration]);

  return displayText;
}
