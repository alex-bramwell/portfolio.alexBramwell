import { useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function BackgroundCanvas() {
  const canvasRef = useRef(null);
  const { theme, isReduced } = useTheme();

  useEffect(() => {
    if (isReduced) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let canvasWidth = (canvas.width = window.innerWidth);
    let canvasHeight = (canvas.height = window.innerHeight);

    const isMobile = window.innerWidth < 768;
    const dotCount = isMobile ? 30 : 80;
    const drawLines = !isMobile;
    const targetFPS = isMobile ? 24 : 60;
    const frameInterval = 1000 / targetFPS;
    let lastFrameTime = 0;

    // Read CSS vars once, re-read only on theme change
    const styles = getComputedStyle(document.documentElement);
    let gridColor = styles.getPropertyValue("--canvas-grid").trim();
    let dotRGB = styles.getPropertyValue("--canvas-dot").trim();

    const floatingDots = Array.from({ length: dotCount }, () => ({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      velocityX: (Math.random() - 0.5) * 0.15,
      velocityY: (Math.random() - 0.5) * 0.15,
      radius: Math.random() * 1 + 0.5,
      opacity: Math.random() * 0.25 + 0.05,
    }));

    // Pre-render grid to offscreen canvas (static, no need to redraw)
    const gridCanvas = document.createElement("canvas");
    gridCanvas.width = canvasWidth;
    gridCanvas.height = canvasHeight;
    const gridCtx = gridCanvas.getContext("2d");
    const drawGrid = () => {
      gridCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      gridCtx.strokeStyle = gridColor;
      gridCtx.lineWidth = 0.5;
      const gridCellSize = 100;
      gridCtx.beginPath();
      for (let x = 0; x <= canvasWidth; x += gridCellSize) {
        gridCtx.moveTo(x, 0); gridCtx.lineTo(x, canvasHeight);
      }
      for (let y = 0; y <= canvasHeight; y += gridCellSize) {
        gridCtx.moveTo(0, y); gridCtx.lineTo(canvasWidth, y);
      }
      gridCtx.stroke();
    };
    drawGrid();

    const handleWindowResize = () => {
      canvasWidth = canvas.width = window.innerWidth;
      canvasHeight = canvas.height = window.innerHeight;
      gridCanvas.width = canvasWidth;
      gridCanvas.height = canvasHeight;
      drawGrid();
    };
    window.addEventListener("resize", handleWindowResize);

    const drawFrame = (timestamp) => {
      animationFrameId = requestAnimationFrame(drawFrame);

      // Throttle FPS on mobile
      if (timestamp - lastFrameTime < frameInterval) return;
      lastFrameTime = timestamp;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Blit cached grid
      ctx.drawImage(gridCanvas, 0, 0);

      // Update and draw dots
      for (let i = 0; i < dotCount; i++) {
        const dot = floatingDots[i];
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
      }

      // Draw connecting lines (desktop only)
      if (drawLines) {
        ctx.lineWidth = 0.5;
        for (let i = 0; i < dotCount; i++) {
          const a = floatingDots[i];
          for (let j = i + 1; j < dotCount; j++) {
            const b = floatingDots[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = dx * dx + dy * dy;
            if (dist < 10000) { // 100^2, avoid Math.hypot
              ctx.strokeStyle = `rgba(${dotRGB},${0.05 * (1 - Math.sqrt(dist) / 100)})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }
    };

    animationFrameId = requestAnimationFrame(drawFrame);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [theme, isReduced]);

  return <canvas className="background-canvas" ref={canvasRef} />;
}
