import React, { useEffect, useRef } from 'react';
import { PdpTheme } from './pdpConfig';

interface WireframeCanvasProps {
  theme: PdpTheme;
  reducedMotion: boolean;
}

/**
 * Custom 2D Canvas 3D rotating architectural wireframe of the cylindrical/prismatic
 * energy core cross-section (horizontal contour rings + 12 rotating meridians),
 * gently accelerating on pointer hover and adapting strokes to Light/Dark theme.
 */
export const WireframeCanvas: React.FC<WireframeCanvasProps> = ({ theme, reducedMotion }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hoverRef = useRef(false);
  const themeRef = useRef<PdpTheme>(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let angle = 0.45;
    let speed = 0.0055;

    // Cross-section profile points (y from -1 to 1, radius r) representing a precision-machined power core
    const profile: { y: number; r: number }[] = [
      { y: -0.92, r: 0.24 }, // terminal cap top
      { y: -0.82, r: 0.26 },
      { y: -0.78, r: 0.42 }, // collar shoulder
      { y: -0.68, r: 0.62 },
      { y: -0.52, r: 0.72 }, // main body upper
      { y: -0.26, r: 0.74 },
      { y: 0.0, r: 0.74 },
      { y: 0.26, r: 0.74 },
      { y: 0.52, r: 0.72 }, // main body lower
      { y: 0.74, r: 0.68 },
      { y: 0.88, r: 0.56 }, // base chamfer
    ];

    const meridians = 12;
    const tiltX = 0.34;

    const project = (x: number, y: number, z: number, cx: number, cy: number, scale: number) => {
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const rx = x * cosA - z * sinA;
      const rz = x * sinA + z * cosA;

      const cosT = Math.cos(tiltX);
      const sinT = Math.sin(tiltX);
      const ry = y * cosT - rz * sinT;
      const depth = y * sinT + rz * cosT;

      const persp = 2.8 / (2.8 - depth * 0.55);
      return {
        sx: cx + rx * scale * persp,
        sy: cy + ry * scale * persp,
        depth,
      };
    };

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;

      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const isDark = themeRef.current === 'dark';
      const primaryStroke = isDark ? 'rgba(239, 243, 241, 0.42)' : 'rgba(17, 22, 20, 0.38)';
      const accentStroke = isDark ? 'rgba(116, 162, 121, 0.72)' : 'rgba(61, 87, 64, 0.65)';
      const faintStroke = isDark ? 'rgba(239, 243, 241, 0.14)' : 'rgba(17, 22, 20, 0.12)';

      const cx = w * 0.5;
      const cy = h * 0.5;
      const scale = Math.min(w, h) * 0.44;

      // Subtle crosshair registration marks
      ctx.strokeStyle = faintStroke;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - scale * 1.1, cy);
      ctx.lineTo(cx + scale * 1.1, cy);
      ctx.moveTo(cx, cy - scale * 1.05);
      ctx.lineTo(cx, cy + scale * 1.05);
      ctx.stroke();

      // Horizontal contour rings
      const ringSteps = 44;
      profile.forEach((p, idx) => {
        ctx.beginPath();
        for (let i = 0; i <= ringSteps; i++) {
          const theta = (i / ringSteps) * Math.PI * 2;
          const pt = project(Math.cos(theta) * p.r, p.y, Math.sin(theta) * p.r, cx, cy, scale);
          if (i === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        }
        ctx.strokeStyle = idx === 2 || idx === 6 ? accentStroke : primaryStroke;
        ctx.lineWidth = idx === 2 || idx === 6 ? 1.35 : 0.9;
        ctx.stroke();
      });

      // 12 rotating meridians
      for (let m = 0; m < meridians; m++) {
        const theta = (m / meridians) * Math.PI * 2;
        ctx.beginPath();
        let avgDepth = 0;
        profile.forEach((p, idx) => {
          const pt = project(Math.cos(theta) * p.r, p.y, Math.sin(theta) * p.r, cx, cy, scale);
          avgDepth += pt.depth;
          if (idx === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        });
        avgDepth /= profile.length;
        ctx.strokeStyle = avgDepth > 0 ? primaryStroke : faintStroke;
        ctx.lineWidth = avgDepth > 0 ? 1.0 : 0.75;
        ctx.stroke();
      }

      if (!reducedMotion) {
        const targetSpeed = hoverRef.current ? 0.022 : 0.0055;
        speed += (targetSpeed - speed) * 0.06;
        angle += speed;
        rafId = requestAnimationFrame(draw);
      }
    };

    draw();

    const handleResize = () => {
      if (reducedMotion) draw();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, [reducedMotion, theme]);

  return (
    <canvas
      ref={canvasRef}
      onPointerEnter={() => {
        hoverRef.current = true;
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
      }}
      aria-label="Interactive 3D architectural battery core wireframe"
      className="w-full h-full block cursor-crosshair"
    />
  );
};
