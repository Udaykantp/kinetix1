import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { PDP_MEDIA } from './pdpConfig';
import { Product } from '../../../types';

interface ThermalComparisonProps {
  product: Product;
  reducedMotion: boolean;
}

export const ThermalComparison: React.FC<ThermalComparisonProps> = ({
  product,
  reducedMotion,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tweenProxyRef = useRef({ value: 52 });
  const [split, setSplit] = useState(52);
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(0, Math.min(100, pct));
    tweenProxyRef.current.value = clamped;
    setSplit(clamped);
  };

  const animateSplitTo = (target: number) => {
    if (reducedMotion) {
      tweenProxyRef.current.value = target;
      setSplit(target);
      return;
    }
    gsap.killTweensOf(tweenProxyRef.current);
    gsap.to(tweenProxyRef.current, {
      value: target,
      duration: 0.72,
      ease: 'power3.out',
      onUpdate: () => setSplit(tweenProxyRef.current.value),
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    gsap.killTweensOf(tweenProxyRef.current);
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const next = Math.max(0, split - 6);
      tweenProxyRef.current.value = next;
      setSplit(next);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = Math.min(100, split + 6);
      tweenProxyRef.current.value = next;
      setSplit(next);
    } else if (e.key === 'Home') {
      e.preventDefault();
      animateSplitTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      animateSplitTo(100);
    }
  };

  const activeMode = split >= 50 ? 'cold' : 'hot';

  return (
    <section
      id="thermal"
      aria-labelledby="thermal-heading"
      className="py-20 sm:py-28 px-5 sm:px-8 max-w-[1240px] mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-10 lg:gap-14 items-center">
        {/* Left: 16:10 Interactive Before/After Comparison Slider */}
        <div
          ref={containerRef}
          role="slider"
          tabIndex={0}
          aria-label="Compare extreme sub-zero cold endurance and high-heat thermal endurance"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(split)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
          className="relative w-full aspect-[16/10] rounded-[12px] overflow-hidden select-none touch-none cursor-ew-resize border border-[var(--pdp-border)] shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--pdp-accent)]"
        >
          {/* Base Layer: Warm Sunrise (+65°C Peak Heat / 12h Hot) */}
          <img
            src={PDP_MEDIA.warmSunrise}
            alt="High-heat solar thermal endurance at sunrise"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Clipped Top Layer: Cold Frost Alpine (-35°C Cold Crank / 24h Cold) */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{
              clipPath: `inset(0 ${100 - split}% 0 0)`,
            }}
          >
            <img
              src={PDP_MEDIA.alpineFrost}
              alt="Sub-zero alpine frost endurance"
              draggable={false}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Corner Mode Labels */}
          <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10 px-2.5 sm:px-3 py-1 rounded-full bg-[#0c100e]/65 backdrop-blur-md border border-white/15 pdp-mono text-[10px] sm:text-[11px] text-[#eff3f1] tracking-wide">
            24h Cold · -35°C
          </div>
          <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 px-2.5 sm:px-3 py-1 rounded-full bg-[#0c100e]/65 backdrop-blur-md border border-white/15 pdp-mono text-[10px] sm:text-[11px] text-[#eff3f1] tracking-wide">
            12h Peak · +65°C
          </div>

          {/* Vertical Divider Line + Centered Circular Drag Knob */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 z-20 pointer-events-none"
            style={{ left: `${split}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-[1.5px] h-full bg-[#eff3f1]/90 mx-auto shadow-[0_0_12px_rgba(0,0,0,0.5)]" />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center border border-white/40 bg-[#0c100e]/75 backdrop-blur-xl text-[#eff3f1] shadow-xl transition-transform"
              style={{ transform: `translate(-50%, -50%) scale(${dragging ? 1.08 : 1})` }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="8 7 3 12 8 17" />
                <polyline points="16 7 21 12 16 17" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right: Editorial Copy, Segmented Control & Large Monospace Metrics */}
        <div className="space-y-6">
          <div>
            <div className="pdp-mono text-[11px] uppercase tracking-[0.12em] text-[var(--pdp-accent)] mb-2.5">
              Thermal Architecture
            </div>
            <h2
              id="thermal-heading"
              className="pdp-heading text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.06] text-[var(--pdp-text)] text-balance"
            >
              Sub-zero frost or scorching heat.
            </h2>
            <p className="text-[15px] text-[var(--pdp-text-muted)] leading-relaxed mt-4">
              Double-walled thermal containment and precision {product.technology} plate geometry
              prevent electrolyte stratification in alpine freezes and suppress thermal runaway
              under peak under-hood or rooftop solar loads.
            </p>
          </div>

          {/* Pill Segmented Control */}
          <div
            role="tablist"
            aria-label="Thermal preset comparison"
            className="grid grid-cols-2 sm:inline-flex items-center p-1 rounded-full bg-[var(--pdp-surface)] border border-[var(--pdp-border)] w-full sm:w-auto max-w-full"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeMode === 'cold'}
              onClick={() => animateSplitTo(100)}
              className={`pdp-btn h-10 px-3 sm:px-5 text-[11px] sm:text-xs font-medium pdp-mono whitespace-nowrap ${
                activeMode === 'cold'
                  ? 'bg-[var(--pdp-accent)] text-[var(--pdp-accent-fg)] shadow-sm'
                  : 'text-[var(--pdp-text-muted)] hover:text-[var(--pdp-text)]'
              }`}
            >
              24h Cold (-35°C)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeMode === 'hot'}
              onClick={() => animateSplitTo(0)}
              className={`pdp-btn h-10 px-3 sm:px-5 text-[11px] sm:text-xs font-medium pdp-mono whitespace-nowrap ${
                activeMode === 'hot'
                  ? 'bg-[var(--pdp-accent)] text-[var(--pdp-accent-fg)] shadow-sm'
                  : 'text-[var(--pdp-text-muted)] hover:text-[var(--pdp-text)]'
              }`}
            >
              12h Hot (+65°C)
            </button>
          </div>

          {/* Two Large Monospace Metrics */}
          <div className="grid grid-cols-2 gap-6 pt-5 border-t border-[var(--pdp-border)]">
            <div>
              <div className="pdp-mono text-3xl sm:text-4xl font-medium text-[var(--pdp-text)] tracking-tight tabular-nums">
                -35°C
              </div>
              <div className="text-xs text-[var(--pdp-text-muted)] mt-1.5">
                {product.coldCrankingAmps
                  ? `Cold crank (${product.coldCrankingAmps} CCA)`
                  : 'Sub-zero stability'}
              </div>
            </div>
            <div>
              <div className="pdp-mono text-3xl sm:text-4xl font-medium text-[var(--pdp-text)] tracking-tight tabular-nums">
                +65°C
              </div>
              <div className="text-xs text-[var(--pdp-text-muted)] mt-1.5">
                Continuous heat tolerance
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
