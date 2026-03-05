import { useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function BackgroundCanvas() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let canvasWidth = (canvas.width = window.innerWidth);
    let canvasHeight = (canvas.height = window.innerHeight);

    const floatingDots = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      velocityX: (Math.random() - 0.5) * 0.15,
      velocityY: (Math.random() - 0.5) * 0.15,
      radius: Math.random() * 1 + 0.5,
      opacity: Math.random() * 0.25 + 0.05,
    }));

    const handleWindowResize = () => {
      canvasWidth = canvas.width = window.innerWidth;
      canvasHeight = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleWindowResize);

    const drawFrame = () => {
      const styles = getComputedStyle(document.documentElement);
      const gridColor = styles.getPropertyValue("--canvas-grid").trim();
      const dotRGB = styles.getPropertyValue("--canvas-dot").trim();

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.5;
      const gridCellSize = 100;
      for (let x = 0; x <= canvasWidth; x += gridCellSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvasHeight); ctx.stroke();
      }
      for (let y = 0; y <= canvasHeight; y += gridCellSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvasWidth, y); ctx.stroke();
      }

      floatingDots.forEach((dot) => {
        dot.x += dot.velocityX;
        dot.y += dot.velocityY;
        if (dot.x < 0) dot.x = canvasWidth;
        if (dot.x > canvasWidth) dot.x = 0;
        if (dot.y < 0) dot.y = canvasHeight;
        if (dot.y > canvasHeight) dot.y = 0;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotRGB},${dot.opacity})`;
        ctx.fill();
      });

      floatingDots.forEach((dotA, index) => {
        floatingDots.slice(index + 1).forEach((dotB) => {
          const distanceBetweenDots = Math.hypot(dotA.x - dotB.x, dotA.y - dotB.y);
          if (distanceBetweenDots < 100) {
            ctx.strokeStyle = `rgba(${dotRGB},${0.05 * (1 - distanceBetweenDots / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(dotA.x, dotA.y);
            ctx.lineTo(dotB.x, dotB.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(drawFrame);
    };

    drawFrame();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [theme]);

  return <canvas className="background-canvas" ref={canvasRef} />;
}
