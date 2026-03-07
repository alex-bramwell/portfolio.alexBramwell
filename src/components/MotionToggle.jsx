import { useTheme } from "../context/ThemeContext";
import "./MotionToggle.scss";

export default function MotionToggle() {
  const { isReduced, toggleMotion } = useTheme();

  return (
    <button
      className={`motion-toggle-button ${isReduced ? "motion-reduced" : ""}`}
      onClick={toggleMotion}
      aria-label={`${isReduced ? "Enable" : "Disable"} animations`}
      title={isReduced ? "Animations off - click to enable" : "Animations on - click to disable"}
    >
      <svg
        className="motion-toggle-icon"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isReduced ? (
          <>
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </>
        ) : (
          <>
            <path d="M2 12c2-3 4-5 6-5s4 5 6 5 4-5 6-5" />
            <path d="M2 6c2-3 4-5 6-5s4 5 6 5 4-5 6-5" />
            <path d="M2 18c2-3 4-5 6-5s4 5 6 5 4-5 6-5" />
          </>
        )}
      </svg>
      <span className="motion-toggle-label">{isReduced ? "Off" : "On"}</span>
    </button>
  );
}
