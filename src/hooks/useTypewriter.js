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
