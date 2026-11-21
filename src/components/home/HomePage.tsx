import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { AlpineHero } from './AlpineHero';
import { Hero } from './Hero';
import { CompatibilityFinder } from './CompatibilityFinder';
import { CategoryGrid } from './CategoryGrid';
import { FeaturedProducts } from './FeaturedProducts';
import { ComparisonSection } from './ComparisonSection';
import { WhyChooseKinetix } from './WhyChooseKinetix';
import { Testimonials } from './Testimonials';
import { FAQSection } from './FAQSection';

gsap.registerPlugin(ScrollTrigger);

export const HomePage: React.FC = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.12,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      window.clearTimeout(refreshTimer);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <AlpineHero />
      <div id="battery-showcase">
        <Hero />
      </div>
      <CompatibilityFinder />
      <CategoryGrid />
      <FeaturedProducts />
      <ComparisonSection />
      <WhyChooseKinetix />
      <Testimonials />
      <FAQSection />
    </div>
  );
};
