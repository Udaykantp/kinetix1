import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

// Scenic full-bleed environmental photography (identical to Product Detail Showcase)
import basaltStudioBg from '../../assets/images/pdp_scene_basalt_studio_1795162651492.jpg';
import alpineFrostBg from '../../assets/images/pdp_scene_alpine_frost_1795162652752.jpg';
import warmSunriseBg from '../../assets/images/pdp_scene_warm_sunrise_1795162657178.jpg';
import duskLakesideBg from '../../assets/images/pdp_scene_dusk_lakeside_1795162750558.jpg';

gsap.registerPlugin(ScrollTrigger);

interface ShowcaseBatteryStage {
  id: string;
  indexLabel: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  productId: string;
  productLabel: string;
}

const SHOWCASE_STAGES: ShowcaseBatteryStage[] = [
  {
    id: 'basalt-studio',
    indexLabel: '01',
    eyebrow: 'STUDIO BASALT SLATE · TITANIUM LITHIUM',
    title: 'Precision cast. Zero compromise.',
    subtitle:
      '48V LiFePO4 titanium-alloy architecture sealed inside a vibration-damped IP67 chassis with 6,000+ cycle endurance.',
    image: basaltStudioBg,
    productId: 'powergrid-megarack-48v',
    productLabel: 'POWERGRID 48V 200Ah',
  },
  {
    id: 'alpine-frost',
    indexLabel: '02',
    eyebrow: 'SUB-ZERO RIVERBANK · PURE LEAD AGM',
    title: 'Instant cold-crank authority.',
    subtitle:
      'Delivers 760 CCA down to -35°C with ultra-low internal impedance and zero voltage sag on luxury start-stop powertrains.',
    image: alpineFrostBg,
    productId: 'kinetix-aeon-75',
    productLabel: 'KINETIX AEON AGM Ultra-75',
  },
  {
    id: 'granite-ridge',
    indexLabel: '03',
    eyebrow: 'ALPINE GRANITE RIDGE · SOLAR LITHIUM ESS',
    title: 'Harvest peak solar yield.',
    subtitle:
      '2.5-hour rapid multi-stage recharge engineered for high-altitude off-grid solar arrays and regenerative systems.',
    image: warmSunriseBg,
    productId: 'solaris-h5-lithium-wall',
    productLabel: 'SOLARIS H5 5.12kWh',
  },
  {
    id: 'dusk-lakeside',
    indexLabel: '04',
    eyebrow: 'DUSK LAKESIDE OUTPOST · DEEP-CYCLE RESERVE',
    title: 'Silent overnight endurance.',
    subtitle:
      'Deep-cycle architectural longevity backed by up to 120-month direct factory protection and 4-hour doorstep fitment.',
    image: duskLakesideBg,
    productId: 'voltmax-powercore-220',
    productLabel: 'VOLTMAX PowerCore+ 220Ah',
  },
];

export const Hero: React.FC = () => {
  const { navigate } = useStore();

  const sectionRef = useRef<HTMLElement | null>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const switchStageLabel = (nextIdx: number) => {
    setActiveIndex((prev) => {
      if (prev === nextIdx) return prev;
      setTransitioning(true);
      window.setTimeout(() => setTransitioning(false), 180);
      return nextIdx;
    });
  };

  // GSAP ScrollTrigger pinned 4-stage horizontal clip-path curtain wipes (identical to PDP PinnedShowcase)
  useEffect(() => {
    if (reducedMotion || !sectionRef.current) {
      triggerRef.current = null;
      return;
    }

    const ctx = gsap.context(() => {
      const layers = layerRefs.current.filter(Boolean) as HTMLDivElement[];
      if (layers.length < 2) return;

      layers.forEach((el, idx) => {
        gsap.set(el, {
          clipPath: idx === 0 ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 0% 100%)',
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=280%',
          pin: true,
          scrub: 0.75,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const idx = Math.min(
              SHOWCASE_STAGES.length - 1,
              Math.floor(p * SHOWCASE_STAGES.length * 0.999)
            );
            switchStageLabel(idx);
          },
        },
      });

      triggerRef.current = tl.scrollTrigger || null;

      // Explicit dwell time per frame + smooth horizontal clip-path wipes
      tl.to({}, { duration: 0.35 });
      for (let i = 1; i < layers.length; i++) {
        tl.to(layers[i], {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.65,
          ease: 'none',
        });
        tl.to({}, { duration: 0.35 });
      }
    }, sectionRef);

    return () => {
      triggerRef.current = null;
      ctx.revert();
    };
  }, [reducedMotion]);

  const handleSelectStage = (idx: number) => {
    if (reducedMotion || !triggerRef.current) {
      switchStageLabel(idx);
      return;
    }
    const st = triggerRef.current;
    const ratios = [0.05, 0.36, 0.66, 0.96];
    const targetProgress = ratios[idx] ?? idx / Math.max(1, SHOWCASE_STAGES.length - 1);
    const targetScroll = st.start + (st.end - st.start) * targetProgress;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    switchStageLabel(idx);
  };

  const currentStage = SHOWCASE_STAGES[activeIndex] || SHOWCASE_STAGES[0];

  return (
    <div className="bg-white">
      {/* =========================================================
          PINNED 4-STAGE ENVIRONMENTAL SHOWCASE (Matches PDP 1-to-1)
          ========================================================= */}
      <section
        ref={sectionRef}
        aria-label="KINETIX environmental battery performance showcase"
        className="relative w-full h-[92dvh] sm:h-[100dvh] min-h-[520px] overflow-hidden bg-[#0c100e]"
      >
        {/* 4 Full-Bleed Environmental Layers */}
        {SHOWCASE_STAGES.map((stage, idx) => {
          const reducedStyle = reducedMotion
            ? {
                opacity: idx === activeIndex ? 1 : 0,
                transition: 'opacity 0.35s ease',
              }
            : undefined;

          return (
            <div
              key={stage.id}
              ref={(el) => {
                layerRefs.current[idx] = el;
              }}
              style={reducedStyle}
              className="absolute inset-0 w-full h-full will-change-[clip-path]"
            >
              <img
                src={stage.image}
                alt={`${stage.eyebrow} — ${stage.title}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center select-none"
              />
            </div>
          );
        })}

        {/* Bottom Edge Dark Gradient Scrim (Crisp Legibility Without Card Boxes) */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[54%] pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(12, 16, 14, 0.92) 0%, rgba(12, 16, 14, 0.56) 48%, rgba(12, 16, 14, 0) 100%)',
          }}
        />

        {/* Subtle Top Vignette */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-24 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(12, 16, 14, 0.42) 0%, rgba(12, 16, 14, 0) 100%)',
          }}
        />

        {/* Bottom HUD Overlay — Exact PDP PinnedShowcase Structure */}
        <div className="absolute inset-x-0 bottom-0 z-20 max-w-[1240px] mx-auto px-4 sm:px-8 pb-6 sm:pb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          {/* Left: Monospace Chapter Index + Oversized Editorial Headline + Subtitle + Direct Battery Link */}
          <div
            className="max-w-2xl min-w-0 transition-all duration-300"
            style={{
              opacity: transitioning ? 0.35 : 1,
              filter: transitioning ? 'blur(4px)' : 'blur(0px)',
              transform: transitioning ? 'translateY(4px)' : 'translateY(0)',
            }}
          >
            <div className="pdp-mono text-[10px] sm:text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[#b4bdb8] mb-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 tabular-nums">
              <span>
                {currentStage.indexLabel} / 0{SHOWCASE_STAGES.length}
              </span>
              <span aria-hidden="true" className="opacity-40">
                —
              </span>
              <span>{currentStage.eyebrow}</span>
            </div>

            <h2 className="pdp-heading text-2xl sm:text-5xl lg:text-[54px] font-bold text-[#eff3f1] leading-[1.04] text-balance">
              {currentStage.title}
            </h2>

            <p className="text-xs sm:text-base text-[#cfd8d3] mt-2.5 sm:mt-3 max-w-xl leading-relaxed">
              {currentStage.subtitle}
            </p>

            {/* Clean Inline Action Links */}
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() =>
                  navigate('product-detail', { productId: currentStage.productId })
                }
                className="max-w-full inline-flex items-center gap-2 min-h-[42px] px-4 sm:px-5 py-2.5 rounded-full bg-[#eff3f1] hover:bg-[#D9AE6D] text-[#0c100e] text-xs sm:text-sm font-semibold transition-all active:scale-[0.97]"
              >
                <span className="truncate">Inspect {currentStage.productLabel}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => navigate('shop')}
                className="inline-flex items-center gap-1.5 min-h-[42px] text-xs sm:text-sm font-medium text-[#cfd8d3] hover:text-[#eff3f1] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Explore Full Lineup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Clickable Glassmorphic Pill Progress Dots */}
          <div
            role="tablist"
            aria-label="Battery showcase environments"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/15 bg-[#0c100e]/60 backdrop-blur-xl self-start md:self-end shrink-0"
          >
            {SHOWCASE_STAGES.map((stage, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={stage.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`Jump to ${stage.eyebrow}`}
                  onClick={() => handleSelectStage(idx)}
                  className="pdp-btn h-7 px-2 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eff3f1]"
                >
                  <span
                    className="block h-2 rounded-full transition-all duration-300"
                    style={{
                      width: isSelected ? '26px' : '8px',
                      backgroundColor: isSelected
                        ? '#eff3f1'
                        : 'rgba(239, 243, 241, 0.38)',
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          CLEAN 4-METRIC FULL-WIDTH ENGINEERING STRIP
          ========================================================= */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#0B3027] tabular-nums">
              45+ Cities
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Guaranteed 4-hour express doorstep delivery and fitment.
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#B59562] tabular-nums">
              760 CCA
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Instant sub-zero automotive ignition performance.
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#0B3027] tabular-nums">
              Up to 120M
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Direct manufacturer warranty on lithium & tubular packs.
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#B59562] tabular-nums">
              100% Recycled
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Instant scrap exchange rebate with certified zero-effluent smelting.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
