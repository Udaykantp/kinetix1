import React, { useEffect, useRef } from 'react';
import { PdpTheme } from './pdpConfig';

interface TopographicShaderCanvasProps {
  theme: PdpTheme;
  reducedMotion: boolean;
}

const VERTEX_SHADER = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_isDark;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
  for (int i = 0; i < 4; i++) {
    value += amp * noise(p);
    p = rot * p * 2.02 + vec2(11.3, 7.1);
    amp *= 0.5;
  }
  return value;
}

void main() {
  vec2 aspect = vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
  vec2 st = v_uv * aspect;
  vec2 ptr = u_pointer * aspect;

  // Layered alpine elevation field
  float t = u_time * 0.055;
  float n1 = fbm(st * 2.15 + vec2(t, -t * 0.55));
  float n2 = fbm(st * 4.1 - vec2(t * 0.4, t * 0.3) + n1 * 0.65);
  float elev = n1 * 0.65 + n2 * 0.35;

  // Crisp topographic contour lines via screen-space derivatives
  float levels = 13.5;
  float band = elev * levels;
  float dist = abs(fract(band - 0.5) - 0.5);
  float fw = max(fwidth(band), 0.0012);
  float line = 1.0 - smoothstep(0.0, fw * 1.45, dist);

  // Subtle major elevation contour accent every 3rd band
  float majorBand = elev * (levels / 3.0);
  float majorDist = abs(fract(majorBand - 0.5) - 0.5);
  float majorLine = 1.0 - smoothstep(0.0, max(fwidth(majorBand), 0.0012) * 1.8, majorDist);

  // Pointer-following radial pine-sage light glow
  float dPtr = length(st - ptr);
  float glow = exp(-dPtr * dPtr * 3.2);

  // Theme palettes (no pure #000 or #fff)
  vec3 bgLight = vec3(0.953, 0.965, 0.957);       // #f3f6f4
  vec3 lineLight = vec3(0.239, 0.341, 0.251);     // #3d5740
  vec3 glowLight = vec3(0.76, 0.84, 0.78);

  vec3 bgDark = vec3(0.047, 0.063, 0.055);        // #0c100e
  vec3 lineDark = vec3(0.282, 0.388, 0.294);      // #48634b
  vec3 glowDark = vec3(0.16, 0.25, 0.19);

  vec3 baseBg = mix(bgLight, bgDark, u_isDark);
  vec3 lineCol = mix(lineLight, lineDark, u_isDark);
  vec3 glowCol = mix(glowLight, glowDark, u_isDark);

  float lineStrength = mix(0.11, 0.22, u_isDark);
  float majorStrength = mix(0.17, 0.32, u_isDark);

  vec3 col = mix(baseBg, glowCol, glow * mix(0.32, 0.42, u_isDark));
  col = mix(col, lineCol, line * lineStrength + majorLine * majorStrength * 0.5);

  // Soft edge fade to blend seamlessly into next section
  float bottomFade = smoothstep(0.0, 0.18, v_uv.y);
  col = mix(baseBg, col, bottomFade);

  outColor = vec4(col, 1.0);
}
`;

export const TopographicShaderCanvas: React.FC<TopographicShaderCanvasProps> = ({
  theme,
  reducedMotion,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef<PdpTheme>(theme);
  const targetPointerRef = useRef({ x: 0.68, y: 0.45 });
  const currentPointerRef = useRef({ x: 0.68, y: 0.45 });

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: true,
      powerPreference: 'low-power',
    });

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = 1 - (e.clientY - rect.top) / rect.height;
      targetPointerRef.current = {
        x: Math.max(0, Math.min(1, nx)),
        y: Math.max(0, Math.min(1, ny)),
      };
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    if (!gl) {
      // Graceful Canvas2D fallback if WebGL2 unavailable
      const ctx = canvas.getContext('2d');
      const drawFallback = () => {
        if (!ctx) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        canvas.width = Math.max(1, Math.floor(w * dpr));
        canvas.height = Math.max(1, Math.floor(h * dpr));
        ctx.scale(dpr, dpr);
        const dark = themeRef.current === 'dark';
        ctx.fillStyle = dark ? '#0c100e' : '#f3f6f4';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = dark ? 'rgba(72,99,75,0.22)' : 'rgba(61,87,64,0.12)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 12; i++) {
          ctx.beginPath();
          for (let x = 0; x <= w; x += 24) {
            const y =
              (h / 12) * i +
              Math.sin(x * 0.005 + i * 0.9) * 32 +
              Math.cos(x * 0.011 - i) * 14;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      };
      drawFallback();
      window.addEventListener('resize', drawFallback);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('resize', drawFallback);
      };
    }

    const compile = (type: number, source: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, source);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'a_pos');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const ptrLoc = gl.getUniformLocation(program, 'u_pointer');
    const darkLoc = gl.getUniformLocation(program, 'u_isDark');

    let isDarkCurrent = themeRef.current === 'dark' ? 1 : 0;
    let rafId = 0;
    const startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const renderFrame = (now: number) => {
      resize();
      const targetDark = themeRef.current === 'dark' ? 1 : 0;
      isDarkCurrent += (targetDark - isDarkCurrent) * (reducedMotion ? 1 : 0.09);

      const cur = currentPointerRef.current;
      const tgt = targetPointerRef.current;
      cur.x += (tgt.x - cur.x) * (reducedMotion ? 1 : 0.06);
      cur.y += (tgt.y - cur.y) * (reducedMotion ? 1 : 0.06);

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, reducedMotion ? 1.2 : (now - startTime) * 0.001);
      gl.uniform2f(ptrLoc, cur.x, cur.y);
      gl.uniform1f(darkLoc, isDarkCurrent);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!reducedMotion) {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    rafId = requestAnimationFrame(renderFrame);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', resize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [reducedMotion, theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none block"
    />
  );
};
