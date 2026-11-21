import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShowcaseStage } from './pdpConfig';

gsap.registerPlugin(ScrollTrigger);

interface PinnedShowcaseProps {
  stages: ShowcaseStage[];
  reducedMotion: boolean;
}

export const PinnedShowcase: React.FC<PinnedShowcaseProps> = ({ stages, reducedMotion }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const switchStageLabel = (nextIdx: number) => {
    setActiveIndex((prev) => {
      if (prev === nextIdx) return prev;
      setTransitioning(true);
      window.setTimeout(() => setTransitioning(false), 180);
      return nextIdx;
    });
  };

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) {
      triggerRef.current = null;
      return;
    }

    const ctx = gsap.context(() => {
      const layers = layerRefs.current.filter(Boolean) as HTMLDivElement[];
      if (layers.length < 2) return;

      // Ensure initial clip-path state: stage 0 fully visible, 1..3 clipped from left
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
            const idx = Math.min(stages.length - 1, Math.floor(p * stages.length * 0.999));
            switchStageLabel(idx);
          },
        },
      });

      triggerRef.current = tl.scrollTrigger || null;

      // Explicit dwell per frame + smooth horizontal clip-path wipes
      tl.to({}, { duration: 0.35 }); // dwell on stage 0
      for (let i = 1; i < layers.length; i++) {
        tl.to(layers[i], {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.65,
          ease: 'none',
        });
        tl.to({}, { duration: 0.35 }); // dwell on stage i
      }
    }, sectionRef);

    return () => {
      triggerRef.current = null;
      ctx.revert();
    };
  }, [reducedMotion, stages]);

  const handleSelectStage = (idx: number) => {
    if (reducedMotion || !triggerRef.current) {
      switchStageLabel(idx);
      return;
    }
    const st = triggerRef.current;
    // Target center of each stage dwell window
    const ratios = [0.05, 0.36, 0.66, 0.96];
    const targetProgress = ratios[idx] ?? idx / Math.max(1, stages.length - 1);
    const targetScroll = st.start + (st.end - st.start) * targetProgress;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    switchStageLabel(idx);
  };

  const currentStage = stages[activeIndex] || stages[0];

  return (
    <section
      id="showcase"
      ref={sectionRef}
      aria-label="Environmental performance showcase"
      className="relative w-full h-[100dvh] min-h-[560px] overflow-hidden bg-[#0c100e]"
    >
      {/* 4 Full-Bleed Environmental Layers */}
      {stages.map((stage, idx) => {
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
              className="w-full h-full object-cover object-center select-none"
            />
          </div>
        );
      })}

      {/* Bottom Edge Dark Gradient Scrim (Crisp Legibility Without Card Boxes) */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[52%] pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(12, 16, 14, 0.9) 0%, rgba(12, 16, 14, 0.55) 48%, rgba(12, 16, 14, 0) 100%)',
        }}
      />

      {/* Top Subtle Scrim for Fixed Header */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-28 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(12, 16, 14, 0.45) 0%, rgba(12, 16, 14, 0) 100%)',
        }}
      />

      {/* Bottom HUD Overlay */}
      <div className="absolute inset-x-0 bottom-0 z-20 max-w-[1240px] mx-auto px-5 sm:px-8 pb-8 sm:pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* Left: Oversized Editorial Title + Subtitle with Blur/Opacity Switch */}
        <div
          className="max-w-2xl transition-all duration-300"
          style={{
            opacity: transitioning ? 0.35 : 1,
            filter: transitioning ? 'blur(4px)' : 'blur(0px)',
            transform: transitioning ? 'translateY(4px)' : 'translateY(0)',
          }}
        >
          <div className="pdp-mono text-[11px] uppercase tracking-[0.14em] text-[#b4bdb8] mb-2.5 flex items-center gap-2.5">
            <span>{currentStage.indexLabel} / 0{stages.length}</span>
            <span aria-hidden="true" className="opacity-40">—</span>
            <span>{currentStage.eyebrow}</span>
          </div>
          <h2 className="pdp-heading text-3xl sm:text-5xl lg:text-[54px] font-bold text-[#eff3f1] leading-[1.03] text-balance">
            {currentStage.title}
          </h2>
          <p className="text-sm sm:text-base text-[#cfd8d3] mt-3 max-w-xl leading-relaxed">
            {currentStage.subtitle}
          </p>
        </div>

        {/* Right: Clickable Glassmorphic Pill Progress Dots */}
        <div
          role="tablist"
          aria-label="Showcase environments"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/15 bg-[#0c100e]/60 backdrop-blur-xl self-start md:self-end shrink-0"
        >
          {stages.map((stage, idx) => {
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
                    backgroundColor: isSelected ? '#eff3f1' : 'rgba(239, 243, 241, 0.38)',
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
