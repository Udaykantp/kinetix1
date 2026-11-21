import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Maximize2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { TopographicShaderCanvas } from '../product/pdp/TopographicShaderCanvas';
import titaniumBatteryImg from '../../assets/images/hero_battery_titanium_1794476148118.jpg';

type HeroFinishId = 'forest-titanium' | 'basalt-obsidian' | 'champagne-gold';

interface HeroFinishOption {
  id: HeroFinishId;
  name: string;
  swatch: string;
  filter: string;
  aura: string;
  note: string;
}

const KINETIX_HERO_FINISHES: HeroFinishOption[] = [
  {
    id: 'basalt-obsidian',
    name: 'Basalt Obsidian',
    swatch: '#101820',
    filter: 'contrast(1.06) saturate(1.02) brightness(0.98)',
    aura: 'rgba(11, 48, 39, 0.22)',
    note: 'Graphite-anodized industrial enclosure with copper posts',
  },
  {
    id: 'forest-titanium',
    name: 'Forest Titanium',
    swatch: '#0B3027',
    filter: 'hue-rotate(38deg) saturate(1.08) contrast(1.04) brightness(0.97)',
    aura: 'rgba(61, 87, 64, 0.28)',
    note: 'Deep pine-alloy matte finish engineered for coastal corrosion resistance',
  },
  {
    id: 'champagne-gold',
    name: 'Champagne Gold',
    swatch: '#D9AE6D',
    filter: 'sepia(0.18) saturate(1.18) brightness(1.04) contrast(1.02)',
    aura: 'rgba(217, 174, 109, 0.30)',
    note: 'Brushed champagne-gold side armor with laser-etched telemetry',
  },
];

export const AlpineHero: React.FC = () => {
  const { navigate } = useStore();

  const [selectedFinishId, setSelectedFinishId] =
    useState<HeroFinishId>('basalt-obsidian');
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const floatWrapRef = useRef<HTMLDivElement | null>(null);
  const tiltCardRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);
  const copyColRef = useRef<HTMLDivElement | null>(null);

  // GSAP quickTo setters for silky spring-damped 3D perspective tilt
  const quickSettersRef = useRef<{
    rx?: gsap.QuickToFunc;
    ry?: gsap.QuickToFunc;
    tx?: gsap.QuickToFunc;
    ty?: gsap.QuickToFunc;
    sx?: gsap.QuickToFunc;
    sy?: gsap.QuickToFunc;
    gx?: gsap.QuickToFunc;
    gy?: gsap.QuickToFunc;
    gOpacity?: gsap.QuickToFunc;
  }>({});

  const selectedFinish = useMemo(
    () =>
      KINETIX_HERO_FINISHES.find((f) => f.id === selectedFinishId) ||
      KINETIX_HERO_FINISHES[0],
    [selectedFinishId]
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Initialize GSAP entrance animations, floating motion, and 3D tilt quickTo controllers
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (!reducedMotion && copyColRef.current) {
        const items = copyColRef.current.querySelectorAll('[data-hero-reveal]');
        gsap.fromTo(
          items,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.72,
            stagger: 0.08,
            ease: 'power3.out',
            clearProps: 'transform',
          }
        );
      }

      if (tiltCardRef.current) {
        gsap.set(tiltCardRef.current, {
          transformPerspective: 1100,
          transformStyle: 'preserve-3d',
          rotateX: 0,
          rotateY: 0,
        });

        if (!reducedMotion) {
          gsap.fromTo(
            tiltCardRef.current,
            { opacity: 0, scale: 0.94, y: 18 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.85,
              ease: 'power3.out',
            }
          );

          quickSettersRef.current.rx = gsap.quickTo(tiltCardRef.current, 'rotateX', {
            duration: 0.52,
            ease: 'power3.out',
          });
          quickSettersRef.current.ry = gsap.quickTo(tiltCardRef.current, 'rotateY', {
            duration: 0.52,
            ease: 'power3.out',
          });
          quickSettersRef.current.tx = gsap.quickTo(tiltCardRef.current, 'x', {
            duration: 0.58,
            ease: 'power3.out',
          });
          quickSettersRef.current.ty = gsap.quickTo(tiltCardRef.current, 'y', {
            duration: 0.58,
            ease: 'power3.out',
          });
        }
      }

      if (!reducedMotion && shadowRef.current) {
        quickSettersRef.current.sx = gsap.quickTo(shadowRef.current, 'x', {
          duration: 0.58,
          ease: 'power3.out',
        });
        quickSettersRef.current.sy = gsap.quickTo(shadowRef.current, 'y', {
          duration: 0.58,
          ease: 'power3.out',
        });
      }

      if (!reducedMotion && glareRef.current) {
        quickSettersRef.current.gx = gsap.quickTo(glareRef.current, 'x', {
          duration: 0.48,
          ease: 'power3.out',
        });
        quickSettersRef.current.gy = gsap.quickTo(glareRef.current, 'y', {
          duration: 0.48,
          ease: 'power3.out',
        });
        quickSettersRef.current.gOpacity = gsap.quickTo(glareRef.current, 'opacity', {
          duration: 0.35,
          ease: 'power2.out',
        });
      }

      // Weightless continuous levitation on outer wrapper
      if (!reducedMotion && floatWrapRef.current) {
        gsap.to(floatWrapRef.current, {
          y: -10,
          duration: 3.1,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    }, sectionRef);

    return () => {
      quickSettersRef.current = {};
      ctx.revert();
    };
  }, [reducedMotion]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Normalize pointer coordinates to [-1, 1]
    const nx = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
    const ny = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1));

    const q = quickSettersRef.current;
    q.rx?.(-ny * 12);
    q.ry?.(nx * 14);
    q.tx?.(nx * 10);
    q.ty?.(ny * 8);

    // Opposite shadow displacement enhances floating 3D depth
    q.sx?.(-nx * 24);
    q.sy?.(-ny * 10);

    // Metallic sheen tracks cursor position
    q.gx?.(nx * 90);
    q.gy?.(ny * 70);
    q.gOpacity?.(0.45);
  };

  const handlePointerLeave = () => {
    if (reducedMotion) return;
    const q = quickSettersRef.current;
    q.rx?.(0);
    q.ry?.(0);
    q.tx?.(0);
    q.ty?.(0);
    q.sx?.(0);
    q.sy?.(0);
    q.gx?.(0);
    q.gy?.(0);
    q.gOpacity?.(0);
  };

  const scrollToElement = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    } else {
      navigate('shop');
    }
  };

  return (
    <section
      ref={sectionRef}
      aria-label="KINETIX Alpine Energy Hero"
      className="relative w-full min-h-0 lg:min-h-[calc(100dvh-104px)] bg-[#FAF9F6] text-[#101820] overflow-hidden border-b border-[#0B3027]/10 flex items-center"
    >
      {/* Procedural Alpine Topographic Contour Shader Backdrop */}
      <div className="absolute inset-0 opacity-85 pointer-events-none">
        <TopographicShaderCanvas theme="light" reducedMotion={reducedMotion} />
      </div>

      {/* Subtle Deep Forest Architectural Curve Accent on Right Edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none hidden lg:block absolute -right-32 top-1/2 -translate-y-1/2 w-[52vw] max-w-[740px] aspect-square rounded-full"
        style={{
          background:
            'radial-gradient(circle at 40% 45%, rgba(11, 48, 39, 0.13) 0%, rgba(11, 48, 39, 0.04) 55%, rgba(250, 249, 246, 0) 75%)',
        }}
      />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-10 sm:py-16 lg:py-16 grid grid-cols-1 lg:grid-cols-[1.04fr_0.96fr] gap-9 sm:gap-12 lg:gap-14 items-center">
        {/* Left Column: KINETIX Editorial Brand Messaging & High-Intent Actions */}
        <div ref={copyColRef} className="space-y-6 max-w-xl">
          {/* Clean Unboxed Technical Eyebrow */}
          <div
            data-hero-reveal
            className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.16em] text-[#0B3027]"
          >
            <span className="h-[1.5px] w-7 bg-[#C58A32] shrink-0" aria-hidden="true" />
            <span className="font-semibold">Next-Generation Energy Engineering</span>
          </div>

          {/* Oversized KINETIX Display Headline */}
          <div data-hero-reveal className="space-y-2.5">
            <h1
              className="pdp-heading font-bold tracking-[-0.04em] text-[#101820] leading-[0.98] text-balance"
              style={{ fontSize: 'clamp(2.65rem, 5.4vw, 4.55rem)' }}
            >
              ENERGY WITHOUT{' '}
              <span className="kinetix-gold-text block sm:inline">COMPROMISE.</span>
            </h1>
            <p className="font-mono text-xs sm:text-[13px] text-[#0B3027]/80 tracking-wide">
              KINETIX TITANIUM LITHIUM · 48V 10.5 kWh · PURE LEAD AGM · SOLAR ESS
            </p>
          </div>

          {/* Concise Narrative Copy */}
          <p
            data-hero-reveal
            className="text-[15px] sm:text-base text-[#3D4A45] leading-relaxed max-w-lg"
          >
            Engineered with forged titanium-alloy thermal armor and ultra-low impedance
            cells for relentless endurance—from sub-zero luxury start-stop powertrains to
            off-grid high-voltage solar microgrids.
          </p>

          {/* Dual Pill CTAs (Deep Forest Green Primary + Champagne Gold Ghost) */}
          <div data-hero-reveal className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => navigate('shop')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-7 py-3 rounded-full bg-[#0B3027] hover:bg-[#134639] text-[#FAF9F6] text-sm font-semibold transition-all shadow-lg shadow-[#0B3027]/15 active:scale-[0.97] whitespace-nowrap shrink-0"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 text-[#D9AE6D]" />
            </button>

            <button
              type="button"
              onClick={() => scrollToElement('compatibility-finder')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-[#C58A32]/55 text-[#101820] text-sm font-semibold transition-all active:scale-[0.97] whitespace-nowrap shrink-0"
            >
              <Zap className="w-4 h-4 text-[#C58A32]" />
              <span>Find Your Battery</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToElement('battery-showcase')}
              className="inline-flex items-center justify-center gap-1 min-h-[44px] px-3 py-2 text-sm font-medium text-[#0B3027] hover:text-[#C58A32] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Showcase</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quiet Unboxed Engineering Trust Row */}
          <div
            data-hero-reveal
            className="pt-5 border-t border-[#0B3027]/12 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-[#3D4A45]"
          >
            <div className="inline-flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#C58A32] shrink-0" />
              <span className="font-medium text-[#101820]">Doorstep 4-Hour Fitment</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0B3027] shrink-0" />
              <span className="font-medium text-[#101820]">Instant Scrap Rebate</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#C58A32] shrink-0" />
              <span className="font-medium text-[#101820]">Up to 120M Warranty</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive GSAP 3D Perspective-Tilting Battery Stage */}
        <div className="flex flex-col items-center">
          <div
            ref={stageRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="relative w-full max-w-[520px] aspect-[16/13] flex items-center justify-center select-none"
          >
            {/* Dynamic Ambient Aura matching Selected Finish */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-6 rounded-full blur-3xl transition-colors duration-500"
              style={{
                background: `radial-gradient(circle, ${selectedFinish.aura} 0%, transparent 72%)`,
              }}
            />

            {/* GSAP Synchronized Shifting Drop Shadow */}
            <div
              ref={shadowRef}
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 w-[74%] h-10 rounded-full blur-2xl will-change-transform"
              style={{
                background: 'rgba(11, 48, 39, 0.32)',
              }}
            />

            {/* Continuous Weightless Levitation Container */}
            <div
              ref={floatWrapRef}
              className="relative z-10 w-[88%] will-change-transform"
            >
              {/* GSAP 3D Perspective Tilt Target (Clean Frameless Floating Hardware) */}
              <div
                ref={tiltCardRef}
                onClick={() =>
                  navigate('product-detail', { productId: 'powergrid-megarack-48v' })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('product-detail', { productId: 'powergrid-megarack-48v' });
                  }
                }}
                aria-label="Inspect KINETIX Titanium Lithium 48V battery details"
                className="group relative rounded-[16px] overflow-hidden cursor-pointer will-change-transform shadow-[0_28px_54px_rgba(11,48,39,0.22)]"
              >
                {/* Specular Metallic Glare Sheen synced to pointer */}
                <div
                  ref={glareRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 opacity-0 mix-blend-overlay will-change-transform"
                  style={{
                    background:
                      'radial-gradient(circle at center, rgba(217, 174, 109, 0.72) 0%, rgba(255, 255, 255, 0.28) 28%, transparent 64%)',
                  }}
                />

                <img
                  src={titaniumBatteryImg}
                  alt={`KINETIX Titanium Lithium 48V 10.5kWh Battery — ${selectedFinish.name}`}
                  referrerPolicy="no-referrer"
                  style={{ filter: selectedFinish.filter }}
                  className="w-full aspect-[16/11] object-cover object-center rounded-[16px] transition-[filter,transform] duration-500 group-hover:scale-[1.03]"
                />

                {/* Subtle Hover Inspect Tag */}
                <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF9F6]/85 backdrop-blur-md border border-[#0B3027]/15 font-mono text-[10px] uppercase tracking-[0.12em] text-[#101820] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3 h-3" />
                  <span>Inspect</span>
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Finish Swatch Pill Radio Group (Material Flask Pattern) */}
          <div className="mt-4 w-full flex flex-col items-center gap-2">
            <div
              role="radiogroup"
              aria-label="Select KINETIX enclosure finish"
              className="inline-flex flex-wrap justify-center max-w-full items-center gap-1 p-1.5 rounded-2xl sm:rounded-full bg-white/80 backdrop-blur-xl border border-[#0B3027]/12 shadow-sm"
            >
              {KINETIX_HERO_FINISHES.map((finish) => {
                const isActive = finish.id === selectedFinish.id;
                return (
                  <button
                    key={finish.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setSelectedFinishId(finish.id)}
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-full text-[11px] sm:text-xs font-medium transition-all active:scale-[0.97] whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#0B3027] text-[#FAF9F6] shadow-sm'
                        : 'text-[#3D4A45] hover:text-[#101820]'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full border shrink-0 ${
                        isActive
                          ? 'border-[#D9AE6D] ring-2 ring-[#D9AE6D]/45'
                          : 'border-black/20'
                      }`}
                      style={{ backgroundColor: finish.swatch }}
                    />
                    <span>{finish.name}</span>
                  </button>
                );
              })}
            </div>

            <p className="font-mono text-[11px] text-[#3D4A45] text-center px-2">
              {selectedFinish.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
