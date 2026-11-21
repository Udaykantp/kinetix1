import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PDP_MEDIA, PdpTheme } from './pdpConfig';
import { WireframeCanvas } from './WireframeCanvas';
import { Product } from '../../../types';

gsap.registerPlugin(ScrollTrigger);

interface CraftBentoProps {
  product: Product;
  theme: PdpTheme;
  reducedMotion: boolean;
}

export const CraftBento: React.FC<CraftBentoProps> = ({ product, theme, reducedMotion }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const tilesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tiles = tilesRef.current.filter(Boolean);
      gsap.fromTo(
        tiles,
        { opacity: 0, y: 28, scale: 0.975 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="craft"
      ref={sectionRef}
      aria-labelledby="craft-heading"
      className="py-20 sm:py-28 px-5 sm:px-8 max-w-[1240px] mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="pdp-mono text-[11px] uppercase tracking-[0.12em] text-[var(--pdp-accent)] mb-2">
            Materials &amp; Geometry
          </div>
          <h2
            id="craft-heading"
            className="pdp-heading text-3xl sm:text-5xl font-bold text-[var(--pdp-text)] leading-[1.05]"
          >
            Engineered to endure.
          </h2>
        </div>
        <p className="text-sm text-[var(--pdp-text-muted)] max-w-sm">
          Every gasket, terminal post, and chamfered cooling channel is milled for zero maintenance
          and decades of structural poise.
        </p>
      </div>

      {/* 12-Column, 2-Row Asymmetric 3-Tile Editorial Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-4 sm:gap-5">
        {/* Tile 1: Tall Left Tile (7 cols, 2 rows) — Macro Sealed Terminal & Gasket */}
        <div
          ref={(el) => {
            tilesRef.current[0] = el;
          }}
          className="group relative md:col-span-7 md:row-span-2 min-h-[360px] md:min-h-[540px] rounded-[12px] overflow-hidden border border-[var(--pdp-border)] bg-[var(--pdp-surface)]"
        >
          <img
            src={PDP_MEDIA.macroTerminal}
            alt="Macro detail of CNC-machined copper terminal and IP67 waterproof gasket seal"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-44 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, rgba(12, 16, 14, 0.88) 0%, rgba(12, 16, 14, 0.35) 55%, rgba(12, 16, 14, 0) 100%)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex items-end justify-between gap-4">
            <div>
              <div className="pdp-mono text-[11px] uppercase tracking-[0.12em] text-[#b4bdb8] mb-1">
                Hermetic Terminal Assembly
              </div>
              <h3 className="pdp-heading text-xl sm:text-2xl font-bold text-[#eff3f1]">
                IP67 Sealed Copper-Alloy Post
              </h3>
              <p className="text-xs sm:text-sm text-[#cfd8d3] mt-1.5 max-w-md">
                Triple O-ring compression lock eliminates terminal sulfation and moisture ingress
                across monsoon and high-altitude environments.
              </p>
            </div>
          </div>
        </div>

        {/* Tile 2: Top Right Tile (5 cols, 1 row) — Sunlit Matte Powder Coat Close-up */}
        <div
          ref={(el) => {
            tilesRef.current[1] = el;
          }}
          className="group relative md:col-span-5 md:row-span-1 min-h-[250px] rounded-[12px] overflow-hidden border border-[var(--pdp-border)] bg-[var(--pdp-surface)]"
        >
          <img
            src={PDP_MEDIA.macroPowderCoat}
            alt="Sunlit macro close-up of tactile matte powder-coated enclosure"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, rgba(12, 16, 14, 0.84) 0%, rgba(12, 16, 14, 0) 100%)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <div className="pdp-mono text-[10px] uppercase tracking-[0.12em] text-[#b4bdb8]">
              Tactile Enclosure
            </div>
            <h3 className="pdp-heading text-lg sm:text-xl font-bold text-[#eff3f1] mt-0.5">
              Micro-Grain Powder Coat
            </h3>
          </div>
        </div>

        {/* Tile 3: Bottom Right Tile (5 cols, 1 row) — 2D Canvas 3D Rotating Architectural Wireframe + Specs */}
        <div
          ref={(el) => {
            tilesRef.current[2] = el;
          }}
          className="md:col-span-5 md:row-span-1 min-h-[265px] rounded-[12px] overflow-hidden border border-[var(--pdp-border)] bg-[var(--pdp-surface)] p-5 sm:p-6 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="pdp-mono text-[10px] uppercase tracking-[0.12em] text-[var(--pdp-text-muted)]">
                Core Cross-Section
              </div>
              <div className="pdp-mono text-xl sm:text-2xl font-medium text-[var(--pdp-text)] mt-1 tabular-nums">
                {product.capacityAh > 0 ? `${product.capacityAh} Ah` : product.voltage}
              </div>
              <div className="pdp-mono text-xs text-[var(--pdp-text-muted)] mt-0.5">
                {product.weightKg} kg dry weight
              </div>
            </div>

            <span className="pdp-mono text-[11px] font-medium px-3 py-1 rounded-full bg-[var(--pdp-surface-2)] border border-[var(--pdp-border)] text-[var(--pdp-text)] shrink-0">
              {product.technology}
            </span>
          </div>

          {/* Rotating 3D Wireframe Canvas */}
          <div className="h-36 sm:h-40 w-full mt-2">
            <WireframeCanvas theme={theme} reducedMotion={reducedMotion} />
          </div>
        </div>
      </div>
    </section>
  );
};
