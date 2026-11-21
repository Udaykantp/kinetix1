import React, { useState } from 'react';
import {
  ArrowRight,
  BatteryCharging,
  Bike,
  Car,
  Cog,
  Cpu,
  Factory,
  FileText,
  Headphones,
  HelpCircle,
  Info,
  LayoutGrid,
  Lightbulb,
  Lock,
  Mail,
  PhoneCall,
  RotateCcw,
  Send,
  Server,
  ShieldCheck,
  Sun,
  Truck,
  Wrench,
  Zap,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import bannerBatteryImg from '../../assets/images/product_car_battery_1794476149763.jpg';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} aria-hidden="true">
    <path
      d="M12 21a9 9 0 1 0-7.75-4.44L3 21l4.6-1.2A8.96 8.96 0 0 0 12 21Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.4 9.2c-.2-.5-.4-.5-.7-.5h-.5c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.1.8 2.6.7 3 .6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.6-.3l-1.5-.7c-.2-.1-.4-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.7-1.5Z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

const GoldShieldBoltIcon: React.FC = () => (
  <svg width="40" height="44" viewBox="0 0 40 44" fill="none" aria-hidden="true" className="shrink-0">
    <path
      d="M20 2.5L5.5 8.5V20.5C5.5 30.2 11.7 38.6 20 41.5C28.3 38.6 34.5 30.2 34.5 20.5V8.5L20 2.5Z"
      stroke="#C58A32"
      strokeWidth="2.4"
      fill="#FAF2E1"
    />
    <path d="M21.4 11.5L13.5 23H19.4L18.1 32.5L26.5 20.5H20.5L21.4 11.5Z" fill="#C58A32" />
  </svg>
);

const SocialIcon: React.FC<{ network: 'facebook' | 'youtube' | 'linkedin' | 'instagram' }> = ({
  network,
}) => {
  switch (network) {
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
          <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.1H7.7v3h2.5V21h3.3Z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
          <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5a2.7 2.7 0 0 0-1.9 1.9C2 8.9 2 12 2 12s0 3.1.4 4.8a2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9c.4-1.7.4-4.8.4-4.8s0-3.1-.4-4.8ZM10 15.2V8.8l5.3 3.2-5.3 3.2Z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
          <path d="M6.94 8.5H3.56V19.5H6.94V8.5ZM5.25 3.5A1.96 1.96 0 1 0 5.25 7.42 1.96 1.96 0 0 0 5.25 3.5ZM20.44 13.02C20.44 9.88 18.76 8.22 16.22 8.22C14.37 8.22 13.48 9.24 13.02 9.96V8.5H9.65C9.7 9.46 9.65 19.5 9.65 19.5H13.02V13.36C13.02 13.02 13.05 12.69 13.15 12.45C13.42 11.78 14.04 11.09 15.08 11.09C16.44 11.09 17.06 12.12 17.06 13.63V19.5H20.44V13.02Z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" aria-hidden="true">
          <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
  }
};

export const Footer: React.FC = () => {
  const { navigate, showToast } = useStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      showToast('Subscribed to KINETIX Technical Updates & Exclusive Offers.', 'success');
      setEmail('');
    }
  };

  const handleSocialClick = (label: string) => {
    showToast(`Opening KINETIX official ${label} channel`, 'info');
  };

  const socials: { id: 'facebook' | 'youtube' | 'linkedin' | 'instagram'; label: string }[] = [
    { id: 'facebook', label: 'Facebook' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'instagram', label: 'Instagram' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-[#FAF9F6] via-[#FFFFFF] to-[#F4F6F4] border-t border-[#0B3027]/10 text-[#3D4A45] pt-10 sm:pt-14 pb-24 sm:pb-6 overflow-hidden">
      {/* Subtle Architectural Diagonal Light Sweeps */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          background:
            'radial-gradient(circle at 92% 78%, rgba(217, 174, 109, 0.12) 0%, transparent 45%)',
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================
            1. TOP ROADSIDE ASSISTANCE SUPPORT BANNER
            ========================================================= */}
        <div className="relative rounded-[20px] overflow-hidden bg-gradient-to-r from-[#EFF2F6] via-[#FAF9F6] to-[#EDF1F6] border border-[#0B3027]/10 shadow-[0_14px_38px_rgba(16,24,32,0.08)] mb-12 sm:mb-14">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
            {/* Left Battery & Vehicle Visual Strip with Gold Diagonal Accent */}
            <div className="relative lg:w-[270px] xl:w-[310px] h-32 sm:h-36 lg:h-[126px] shrink-0 overflow-hidden bg-[#101820]">
              <img
                src={bannerBatteryImg}
                alt="KINETIX Power For Life Battery Support"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              {/* Soft right fade into banner canvas on desktop */}
              <div
                aria-hidden="true"
                className="hidden lg:block absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#EFF2F6] via-[#EFF2F6]/65 to-transparent"
              />
              {/* Gold Diagonal Chamfer Ribbon */}
              <svg
                viewBox="0 0 320 126"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                <path d="M0 98L84 126H0V98Z" fill="#C58A32" />
                <path d="M225 126L305 126L255 82L225 126Z" fill="#D9AE6D" fillOpacity="0.88" />
              </svg>
            </div>

            {/* Center: Shield Bolt + Need Assistance Copy */}
            <div className="flex-1 px-5 lg:px-2 flex items-center gap-4">
              <GoldShieldBoltIcon />
              <span
                aria-hidden="true"
                className="hidden sm:block h-11 w-px bg-[#D9AE6D]/55 shrink-0"
              />
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#101820] tracking-[-0.025em] leading-tight">
                  Need Assistance?
                </h3>
                <p className="text-xs sm:text-sm text-[#3D4A45] mt-1">
                  Get <span className="font-bold text-[#C58A32]">24/7</span> roadside support
                  for a worry-free journey.
                </p>
              </div>
            </div>

            {/* Right: 1800 Call Lockup + Gold WhatsApp Direct Pill CTA */}
            <div className="px-5 pb-5 lg:pb-0 lg:pr-6 xl:pr-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-5 shrink-0">
              <span
                aria-hidden="true"
                className="hidden xl:block h-11 w-px bg-[#D9AE6D]/55 shrink-0"
              />

              <a
                href="tel:18002098899"
                className="group inline-flex items-center gap-3 hover:opacity-90 transition-opacity min-h-[44px]"
              >
                <span className="w-11 h-11 rounded-full bg-[#FAF2E1] border border-[#D9AE6D]/40 text-[#C58A32] flex items-center justify-center shrink-0 group-hover:bg-[#0B3027] group-hover:text-[#D9AE6D] transition-colors">
                  <PhoneCall className="w-5 h-5" />
                </span>
                <div>
                  <div className="text-base sm:text-lg font-extrabold text-[#101820] tabular-nums leading-tight">
                    1800 209 8899
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#52605C]">Call Us Anytime</div>
                </div>
              </a>

              <a
                href="https://wa.me/919820199887"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-full bg-gradient-to-r from-[#D5A34E] to-[#B67E26] hover:from-[#DFB05C] hover:to-[#C48B31] text-white text-xs sm:text-sm font-semibold shadow-[0_10px_24px_rgba(182,126,38,0.28)] transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp Direct</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* =========================================================
            2. MAIN 5-COLUMN FOOTER DIRECTORY
            ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-y-10 gap-x-6 lg:gap-0 pb-12">
          {/* Col 1: KINETIX Brand Mark + Narrative + Light Circular Socials */}
          <div className="lg:col-span-3 lg:pr-7 flex flex-col justify-between space-y-5">
            <div>
              {/* KINETIX Geometric Wordmark with Gold X Accent */}
              <button
                type="button"
                onClick={() => navigate('home')}
                className="text-left group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3027]"
                aria-label="KINETIX Home"
              >
                <div className="flex items-center text-[30px] font-black tracking-[0.12em] leading-none text-[#101820]">
                  <span>KINETI</span>
                  <span className="relative inline-block">
                    <span className="text-[#101820]">X</span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-tr from-[#C58A32] via-[#E5C17B] to-[#C58A32] bg-clip-text text-transparent opacity-90"
                      style={{ clipPath: 'polygon(58% 0%, 100% 0%, 42% 100%, 0% 100%)' }}
                    >
                      X
                    </span>
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2.5">
                  <span className="h-[1.5px] w-7 bg-[#C58A32]" aria-hidden="true" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#101820]">
                    Power For Life
                  </span>
                  <span className="h-[1.5px] w-7 bg-[#C58A32]" aria-hidden="true" />
                </div>
              </button>

              <p className="text-xs sm:text-[13px] text-[#3D4A45] leading-relaxed mt-4">
                Engineered without compromise. KINETIX develops and supplies aerospace-grade
                Lithium Iron Phosphate (LiFePO4) batteries for a cleaner, stronger and more
                sustainable tomorrow.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {socials.map((s) => (
                <button
                  key={`brand-${s.id}`}
                  type="button"
                  onClick={() => handleSocialClick(s.label)}
                  aria-label={`KINETIX on ${s.label}`}
                  className="w-9 h-9 rounded-full bg-white shadow-[0_6px_16px_rgba(16,24,32,0.08)] border border-[#0B3027]/8 text-[#101820] hover:bg-[#0B3027] hover:text-[#D9AE6D] flex items-center justify-center transition-all active:scale-95"
                >
                  <SocialIcon network={s.id} />
                </button>
              ))}
            </div>
          </div>

          {/* Col 2: Battery Collection */}
          <div className="lg:col-span-2 lg:px-6 lg:border-l lg:border-[#0B3027]/10">
            <div className="flex items-center gap-2 text-sm font-bold text-[#101820]">
              <BatteryCharging className="w-4 h-4 text-[#0B3027] shrink-0" />
              <span>Battery Collection</span>
            </div>
            <div className="h-[2px] w-full bg-gradient-to-r from-[#D9AE6D] via-[#C58A32]/50 to-transparent mt-2.5 mb-4" />
            <ul className="space-y-2.5 text-[13px] text-[#2D3A36]">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('car-batteries')}
                  className="inline-flex items-center gap-2.5 hover:text-[#C58A32] transition-colors"
                >
                  <Car className="w-4 h-4 text-[#0B3027] shrink-0" />
                  <span>Car Batteries</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('bike-batteries')}
                  className="inline-flex items-center gap-2.5 hover:text-[#C58A32] transition-colors"
                >
                  <Bike className="w-4 h-4 text-[#0B3027] shrink-0" />
                  <span>Bike Batteries</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('inverter-batteries')}
                  className="inline-flex items-center gap-2.5 hover:text-[#C58A32] transition-colors"
                >
                  <Cpu className="w-4 h-4 text-[#0B3027] shrink-0" />
                  <span>Inverter Batteries</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('lithium-batteries')}
                  className="inline-flex items-center gap-2.5 hover:text-[#C58A32] transition-colors"
                >
                  <Zap className="w-4 h-4 text-[#0B3027] shrink-0" />
                  <span>Lithium (LiFePO4)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('solar-batteries')}
                  className="inline-flex items-center gap-2.5 hover:text-[#C58A32] transition-colors"
                >
                  <Sun className="w-4 h-4 text-[#0B3027] shrink-0" />
                  <span>Solar Batteries</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('industrial-batteries')}
                  className="inline-flex items-center gap-2.5 hover:text-[#C58A32] transition-colors"
                >
                  <Factory className="w-4 h-4 text-[#0B3027] shrink-0" />
                  <span>Industrial Batteries</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('ups-batteries')}
                  className="inline-flex items-center gap-2.5 hover:text-[#C58A32] transition-colors"
                >
                  <Server className="w-4 h-4 text-[#0B3027] shrink-0" />
                  <span>UPS Batteries</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('accessories')}
                  className="inline-flex items-center gap-2.5 hover:text-[#C58A32] transition-colors"
                >
                  <Wrench className="w-4 h-4 text-[#0B3027] shrink-0" />
                  <span>Accessories</span>
                </button>
              </li>
              <li className="pt-1 border-t border-[#0B3027]/10">
                <button
                  type="button"
                  onClick={() => navigate('all-batteries')}
                  className="inline-flex items-center gap-2.5 font-semibold text-[#0B3027] hover:text-[#C58A32] transition-colors"
                >
                  <LayoutGrid className="w-4 h-4 text-[#C58A32] shrink-0" />
                  <span>Browse All Batteries</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Engineering & Support */}
          <div className="lg:col-span-2 lg:px-6 lg:border-l lg:border-[#0B3027]/10">
            <div className="flex items-center gap-2 text-sm font-bold text-[#101820]">
              <Cog className="w-4 h-4 text-[#0B3027] shrink-0" />
              <span>Engineering &amp; Support</span>
            </div>
            <div className="h-[2px] w-full bg-gradient-to-r from-[#D9AE6D] via-[#C58A32]/50 to-transparent mt-2.5 mb-4" />
            <ul className="space-y-3 text-[13px] text-[#2D3A36]">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('policy', { type: 'warranty' })}
                  className="inline-flex items-center gap-2.5 hover:text-[#C58A32] transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-[#0B3027] shrink-0" />
                  <span>Warranty &amp; Support</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('contact')}
                  className="inline-flex items-center gap-2.5 hover:text-[#C58A32] transition-colors"
                >
                  <Headphones className="w-4 h-4 text-[#0B3027] shrink-0" />
                  <span>Customer Care</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('buying-guide')}
                  className="inline-flex items-center gap-2.5 hover:text-[#C58A32] transition-colors"
                >
                  <Wrench className="w-4 h-4 text-[#0B3027] shrink-0" />
                  <span>Installation Guide</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('maintenance-guide')}
                  className="inline-flex items-center gap-2.5 hover:text-[#C58A32] transition-colors"
                >
                  <Lightbulb className="w-4 h-4 text-[#0B3027] shrink-0" />
                  <span>Battery Care Tips</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('faq')}
                  className="inline-flex items-center gap-2.5 hover:text-[#C58A32] transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-[#0B3027] shrink-0" />
                  <span>FAQs</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Policies & Information */}
          <div className="lg:col-span-2 lg:px-6 lg:border-l lg:border-[#0B3027]/10">
            <div className="flex items-center gap-2 text-sm font-bold text-[#101820]">
              <FileText className="w-4 h-4 text-[#0B3027] shrink-0" />
              <span>Policies &amp; Information</span>
            </div>
            <div className="h-[2px] w-full bg-gradient-to-r from-[#D9AE6D] via-[#C58A32]/50 to-transparent mt-2.5 mb-4" />
            <ul className="space-y-3 text-[13px] text-[#2D3A36]">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('about')}
                  className="inline-flex items-center gap-2.5 hover:text-[#C58A32] transition-colors"
                >
                  <Info className="w-4 h-4 text-[#0B3027] shrink-0" />
                  <span>About Us</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('policy', { type: 'terms' })}
                  className="inline-flex items-center gap-2.5 hover:text-[#C58A32] transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#0B3027] shrink-0" />
                  <span>Terms &amp; Conditions</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('policy', { type: 'privacy' })}
                  className="inline-flex items-center gap-2.5 hover:text-[#C58A32] transition-colors"
                >
                  <Lock className="w-4 h-4 text-[#0B3027] shrink-0" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('policy', { type: 'shipping' })}
                  className="inline-flex items-center gap-2.5 hover:text-[#C58A32] transition-colors"
                >
                  <Truck className="w-4 h-4 text-[#0B3027] shrink-0" />
                  <span>Shipping Policy</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('policy', { type: 'return' })}
                  className="inline-flex items-center gap-2.5 hover:text-[#C58A32] transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-[#0B3027] shrink-0" />
                  <span>Return &amp; Refund Policy</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Subscribe Newsletter + Dark Follow Us Icons */}
          <div className="lg:col-span-3 lg:pl-7 lg:border-l lg:border-[#0B3027]/10">
            <div className="flex items-center gap-2 text-sm font-bold text-[#101820]">
              <Mail className="w-4 h-4 text-[#0B3027] shrink-0" />
              <span>Subscribe Newsletter</span>
            </div>
            <div className="h-[2px] w-full bg-gradient-to-r from-[#D9AE6D] via-[#C58A32]/50 to-transparent mt-2.5 mb-4" />

            <p className="text-xs text-[#4A5652] mb-3">Get the latest updates and offers.</p>

            <form onSubmit={handleSubscribe} className="flex items-stretch rounded-lg overflow-hidden border border-[#0B3027]/15 bg-white shadow-xs focus-within:border-[#C58A32]">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address for newsletter"
                className="flex-1 min-w-0 px-3.5 py-2.5 text-xs text-[#101820] placeholder:text-[#64748B] bg-white focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="px-4 bg-gradient-to-r from-[#D5A34E] to-[#B67E26] hover:from-[#DFB05C] hover:to-[#C48B31] text-white flex items-center justify-center transition-all active:scale-95 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5">
              <div className="text-xs font-bold text-[#101820] mb-2.5">Follow Us</div>
              <div className="flex items-center gap-2.5">
                {socials.map((s) => (
                  <button
                    key={`follow-${s.id}`}
                    type="button"
                    onClick={() => handleSocialClick(s.label)}
                    aria-label={`Follow KINETIX on ${s.label}`}
                    className="w-8 h-8 rounded-full bg-[#101820] hover:bg-[#0B3027] text-white hover:text-[#D9AE6D] flex items-center justify-center transition-all active:scale-95"
                  >
                    <SocialIcon network={s.id} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            3. BOTTOM DARK CAPSULE COMPLIANCE & PAYMENT BAR
            ========================================================= */}
        <div className="relative rounded-[18px] overflow-hidden bg-gradient-to-r from-[#0B221D] via-[#101820] to-[#0B221D] text-[#E6ECE9] px-4 sm:px-14 lg:px-16 py-4 shadow-[0_14px_34px_rgba(11,48,39,0.22)]">
          {/* Signature Curved Champagne-Gold Left & Right Corner Ribbons */}
          <svg
            viewBox="0 0 80 64"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="hidden sm:block pointer-events-none absolute left-0 top-0 bottom-0 h-full w-12 lg:w-14"
          >
            <path d="M0 0H52C30 16 18 38 14 64H0V0Z" fill="#D9AE6D" fillOpacity="0.88" />
          </svg>
          <svg
            viewBox="0 0 80 64"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="hidden sm:block pointer-events-none absolute right-0 top-0 bottom-0 h-full w-12 lg:w-14"
          >
            <path d="M80 64H28C50 48 62 26 66 0H80V64Z" fill="#D9AE6D" fillOpacity="0.88" />
          </svg>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4 text-[11px] sm:text-xs">
            {/* Left: Copyright & Made in India */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <span className="font-medium text-[#FAF9F6]">
                © {new Date().getFullYear()} KINETIX. All Rights Reserved.
              </span>
              <span aria-hidden="true" className="hidden sm:inline text-white/25">
                |
              </span>
              <span className="inline-flex items-center gap-1.5 text-[#D1DBD6]">
                <span>Made with</span>
                <svg
                  viewBox="0 0 20 20"
                  fill="#D9AE6D"
                  className="w-3.5 h-3.5"
                  aria-label="love"
                >
                  <path d="M10 17.4l-1.2-1.1C4.4 12.4 1.6 9.8 1.6 6.6 1.6 4 3.6 2 6.2 2c1.5 0 2.9.7 3.8 1.8C10.9 2.7 12.3 2 13.8 2c2.6 0 4.6 2 4.6 4.6 0 3.2-2.8 5.8-7.2 9.7L10 17.4z" />
                </svg>
                <span>in India</span>
              </span>
            </div>

            {/* Center: BIS / ISO / IEC Certifications */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 border-y lg:border-y-0 lg:border-x border-white/15 py-2 lg:py-0 lg:px-6 text-[11px]">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D9AE6D] shrink-0" />
                <span className="leading-tight">
                  <strong className="text-white block text-[10px]">BIS</strong>
                  <span className="text-white/70 text-[9px]">Certified</span>
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded border border-white/40 text-[9px] font-bold text-white">
                  ISO
                </span>
                <span className="leading-tight">
                  <strong className="text-white block text-[10px]">ISO</strong>
                  <span className="text-white/70 text-[9px] font-mono">9001:2015</span>
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded border border-white/40 text-[9px] font-bold text-white">
                  IEC
                </span>
                <span className="leading-tight">
                  <strong className="text-white block text-[10px]">IEC</strong>
                  <span className="text-white/70 text-[9px] font-mono">62619</span>
                </span>
              </span>
            </div>

            {/* Right: Payment Method Marks + Secure Payments */}
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 sm:gap-4">
              <div className="flex items-center gap-3 font-bold tracking-tight text-white">
                <span className="italic font-black text-sm tracking-tighter">VISA</span>
                {/* Mastercard overlapping circles */}
                <span className="inline-flex items-center" aria-label="Mastercard">
                  <span className="w-4 h-4 rounded-full bg-[#EB001B] inline-block" />
                  <span className="w-4 h-4 rounded-full bg-[#F79E1B]/90 -ml-1.5 inline-block" />
                </span>
                <span className="italic font-extrabold text-xs tracking-wide">
                  UPI<span className="text-[#D9AE6D]">▸</span>
                </span>
                <span className="italic font-extrabold text-xs">
                  RuPay<span className="text-[#22C55E]">▸</span>
                </span>
              </div>

              <span aria-hidden="true" className="hidden sm:inline text-white/25">
                |
              </span>

              <span className="inline-flex items-center gap-1.5 text-[#FAF9F6] font-medium whitespace-nowrap">
                <Lock className="w-3.5 h-3.5 text-[#D9AE6D]" />
                <span>Secure Payments</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
