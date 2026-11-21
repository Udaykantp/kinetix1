import React, { useState } from 'react';
import {
  Phone,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  MessageSquareText,
  Send,
  User,
  Briefcase,
  ChevronRight,
  ChevronDown,
  Headphones,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import heroBatteryImg from '../../assets/images/hero_battery_titanium_1794476148118.jpg';
import hqBuildingImg from '../../assets/images/testimonial_hospital_facility_1795242948439.jpg';

interface RegionalHub {
  id: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
}

const REGIONAL_HUBS: RegionalHub[] = [
  {
    id: 'delhi-ncr',
    city: 'Delhi NCR',
    addressLine1: 'B-102, Sector 62,',
    addressLine2: 'Noida, Uttar Pradesh – 201309',
  },
  {
    id: 'mumbai',
    city: 'Mumbai',
    addressLine1: 'Plot C-42, G Block, BKC,',
    addressLine2: 'Mumbai, Maharashtra – 400051',
  },
  {
    id: 'bengaluru',
    city: 'Bengaluru',
    addressLine1: 'Suite 404, Sigma Tech Park,',
    addressLine2: 'Bengaluru, Karnataka – 560100',
  },
  {
    id: 'pune',
    city: 'Pune',
    addressLine1: 'Tower B, Hinjewadi Phase 2,',
    addressLine2: 'Pune, Maharashtra – 411057',
  },
];

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [activeHubId, setActiveHubId] = useState<string>('delhi-ncr');

  const activeHub =
    REGIONAL_HUBS.find((h) => h.id === activeHubId) || REGIONAL_HUBS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim() || !formEmail.trim() || !formMessage.trim()) {
      showToast('Please complete all required fields before transmitting.', 'error');
      return;
    }
    const ticketId = `KTX-INQ-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedTicket(ticketId);
    showToast('Inquiry transmitted! Our field coordinator will call within 15 minutes.');
  };

  const handleResetForm = () => {
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormCategory('');
    setFormMessage('');
    setSubmittedTicket(null);
  };

  return (
    <div className="bg-[#FAFBFB] min-h-screen text-[#1E2422] pb-20">
      {/* Panoramic Light Editorial Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#F7F9FA] via-[#F2F5F7] to-[#E6ECEF] border-b border-gray-200/80">
        {/* Right-side Architectural Battery Backdrop */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[52%] lg:w-[48%]">
            <img
              src={heroBatteryImg}
              alt=""
              aria-hidden="true"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {/* Smooth diagonal fade blending photo seamlessly into light canvas */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(108deg, #F3F6F8 0%, rgba(243,246,248,0.92) 22%, rgba(243,246,248,0.28) 54%, rgba(7,59,50,0.12) 100%)',
              }}
            />
            {/* Subtle golden energy orbital arc */}
            <svg
              className="absolute inset-0 w-full h-full opacity-80"
              viewBox="0 0 600 320"
              fill="none"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="contactHeroGoldArc" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F5C642" stopOpacity="0" />
                  <stop offset="48%" stopColor="#F5C642" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#E5A51C" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <path
                d="M170 270 C 260 280, 445 205, 525 88"
                stroke="url(#contactHeroGoldArc)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M210 292 C 305 292, 470 225, 555 110"
                stroke="url(#contactHeroGoldArc)"
                strokeWidth="1.5"
                strokeOpacity="0.55"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="inline-flex items-center px-3.5 py-1 rounded-full border border-[#E5B84B]/80 bg-white/85 text-xs font-semibold text-[#B88412] shadow-2xs">
                  Get in Touch
                </span>
                <span className="hidden sm:block h-px w-24 bg-gradient-to-r from-[#D5DCE0] to-transparent" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.06] [text-wrap:balance]">
                <span className="block text-[#073B32]">Connect with</span>
                <span className="block bg-gradient-to-r from-[#C18C18] via-[#DDA427] to-[#B78212] bg-clip-text text-transparent">
                  KINETIX Power
                </span>
              </h1>

              <p className="mt-4 text-sm sm:text-[15px] text-[#27312E] leading-relaxed max-w-lg font-medium">
                Need emergency roadside battery fitment, enterprise solar storage consultation, or bulk fleet quotes? Our engineering team is standing by.
              </p>
            </div>

            {/* Subtle Editorial Script Callout (Desktop) */}
            <div className="hidden lg:flex lg:col-span-3 flex-col items-start justify-center pl-2">
              <p
                className="text-[22px] leading-snug text-[#073B32] font-semibold italic tracking-tight -rotate-3"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Powering
                <span className="block pl-3">A Brighter Tomorrow</span>
              </p>
              <svg
                className="w-36 h-4 mt-1 ml-3"
                viewBox="0 0 160 18"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 13 C 48 4, 108 3, 156 8"
                  stroke="#E5A51C"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Two-Column Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT: Send a Technical Inquiry Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/90 shadow-[0_12px_36px_rgba(7,59,50,0.06)] overflow-hidden">
            {/* Deep Forest Green Card Header with Gold Swooping Wave */}
            <div className="relative bg-gradient-to-r from-[#053129] via-[#073B32] to-[#0D4C40] px-6 sm:px-7 py-5 overflow-hidden">
              <svg
                className="pointer-events-none absolute right-0 bottom-0 h-full w-64 opacity-45"
                viewBox="0 0 280 90"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M30 90 C 110 42, 195 36, 280 58 L280 90 Z"
                  fill="#E5A51C"
                  fillOpacity="0.45"
                />
                <path
                  d="M75 90 C 145 55, 215 55, 280 72 L280 90 Z"
                  fill="#F4C95D"
                  fillOpacity="0.55"
                />
              </svg>

              <div className="relative z-10 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                  <Send className="w-5 h-5 text-[#F2BA2E]" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                    Send a Technical Inquiry
                  </h2>
                  <p className="text-xs sm:text-[13px] text-white/80 mt-0.5">
                    Fill in the form and our experts will get back to you shortly.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-8">
              {submittedTicket ? (
                <div className="py-10 px-4 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#073B32]/8 text-[#073B32] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7 text-[#073B32]" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-[#073B32]">
                      Inquiry Dispatched to Field Coordinator
                    </h3>
                    <p className="text-sm text-gray-600 max-w-md mx-auto">
                      Reference <span className="font-mono font-bold text-[#073B32]">{submittedTicket}</span> has been logged for{' '}
                      <span className="font-semibold text-[#1E2422]">{formName}</span>. Our engineering specialist will reach out to{' '}
                      <span className="font-mono text-[#073B32]">{formPhone}</span> within 15 minutes.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-5 min-h-[44px] rounded-xl bg-[#073B32] hover:bg-[#0A5246] text-white text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Row 1: Full Name & Mobile Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-full-name"
                        className="block text-[13px] font-semibold text-[#1E2422] mb-2"
                      >
                        Full Name <span className="text-[#D97706]">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="contact-full-name"
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full min-h-[46px] pl-10 pr-3.5 py-2.5 bg-[#F6F8F9] hover:bg-[#F2F5F7] focus:bg-white border border-gray-200/90 focus:border-[#073B32] rounded-xl text-sm text-[#1E2422] placeholder-gray-400 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-mobile"
                        className="block text-[13px] font-semibold text-[#1E2422] mb-2"
                      >
                        Mobile Number <span className="text-[#D97706]">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="contact-mobile"
                          type="tel"
                          required
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full min-h-[46px] pl-10 pr-3.5 py-2.5 bg-[#F6F8F9] hover:bg-[#F2F5F7] focus:bg-white border border-gray-200/90 focus:border-[#073B32] rounded-xl text-sm text-[#1E2422] placeholder-gray-400 focus:outline-none transition-colors tabular-nums"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Email Address & Inquiry Nature */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-[13px] font-semibold text-[#1E2422] mb-2"
                      >
                        Email Address <span className="text-[#D97706]">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full min-h-[46px] pl-10 pr-3.5 py-2.5 bg-[#F6F8F9] hover:bg-[#F2F5F7] focus:bg-white border border-gray-200/90 focus:border-[#073B32] rounded-xl text-sm text-[#1E2422] placeholder-gray-400 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-nature"
                        className="block text-[13px] font-semibold text-[#1E2422] mb-2"
                      >
                        Inquiry Nature
                      </label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 text-[#073B32] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          id="contact-nature"
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full min-h-[46px] appearance-none pl-10 pr-10 py-2.5 bg-[#F6F8F9] hover:bg-[#F2F5F7] focus:bg-white border border-gray-200/90 focus:border-[#073B32] rounded-xl text-sm text-[#1E2422] focus:outline-none transition-colors cursor-pointer"
                        >
                          <option value="">Select Inquiry Type</option>
                          <option value="Doorstep Battery Replacement">
                            Doorstep Battery Replacement
                          </option>
                          <option value="Solar LiFePO4 Consultation">
                            Solar LiFePO4 Consultation
                          </option>
                          <option value="Commercial Fleet Supply">
                            Commercial Fleet Supply
                          </option>
                          <option value="Warranty Claim or Scrap Buyback">
                            Warranty Claim or Scrap Buyback
                          </option>
                          <option value="Dealership Inquiry">Dealership Inquiry</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Requirements Textarea */}
                  <div>
                    <label
                      htmlFor="contact-requirements"
                      className="block text-[13px] font-semibold text-[#1E2422] mb-2"
                    >
                      Your Requirements / Vehicle / Load Details{' '}
                      <span className="text-[#D97706]">*</span>
                    </label>
                    <div className="relative">
                      <MessageSquareText className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <textarea
                        id="contact-requirements"
                        rows={4}
                        required
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                        placeholder="Tell us about your requirement..."
                        className="w-full pl-10 pr-3.5 py-3 bg-[#F6F8F9] hover:bg-[#F2F5F7] focus:bg-white border border-gray-200/90 focus:border-[#073B32] rounded-xl text-sm text-[#1E2422] placeholder-gray-400 focus:outline-none transition-colors resize-y"
                      />
                    </div>
                  </div>

                  {/* Primary Golden Submit CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full min-h-[52px] px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#ECB429] via-[#F2C13C] to-[#E5A51C] hover:from-[#DFA61F] hover:via-[#E8B630] hover:to-[#D59412] text-[#073B32] font-bold text-sm sm:text-[15px] shadow-[0_8px_22px_rgba(229,165,28,0.28)] transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99]"
                    >
                      <Send className="w-4.5 h-4.5" />
                      <span>Transmit Inquiry to Field Coordinator</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT: Direct Channels + Regional Engineering Headquarters */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card 1: Direct Channels */}
            <div className="bg-white rounded-2xl border border-gray-200/90 shadow-[0_12px_36px_rgba(7,59,50,0.06)] overflow-hidden">
              <div className="relative bg-gradient-to-r from-[#053129] via-[#073B32] to-[#0D4C40] px-6 py-4 overflow-hidden">
                <svg
                  className="pointer-events-none absolute right-0 top-0 h-full w-40 opacity-30"
                  viewBox="0 0 180 64"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M15 64 C 65 24, 125 22, 180 8 L180 64 Z"
                    fill="#34D399"
                    fillOpacity="0.28"
                  />
                </svg>
                <div className="relative z-10 flex items-center gap-3">
                  <Headphones className="w-5 h-5 text-[#F2BA2E] shrink-0" />
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Direct Channels
                  </h2>
                </div>
              </div>

              <div className="p-5 space-y-3">
                {/* Toll-Free Dispatch */}
                <a
                  href="tel:18002098899"
                  className="group p-3.5 rounded-2xl bg-[#FAFBFB] hover:bg-[#F2F6F4] border border-gray-200/80 hover:border-[#073B32]/30 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="w-11 h-11 rounded-full bg-[#E8F4EE] text-[#073B32] flex items-center justify-center shrink-0">
                      <PhoneCall className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <span className="block text-xs text-gray-500 font-medium">
                        Toll-Free Dispatch (24x7)
                      </span>
                      <span className="block text-base sm:text-[17px] font-bold text-[#0F1715] tabular-nums tracking-tight">
                        1800 209 8899
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#073B32] group-hover:translate-x-0.5 transition-all shrink-0" />
                </a>

                {/* WhatsApp Quick Dispatch */}
                <a
                  href="https://wa.me/918860198887"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3.5 rounded-2xl bg-[#FAFBFB] hover:bg-[#F0FAF3] border border-gray-200/80 hover:border-emerald-500/30 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="w-11 h-11 rounded-full bg-[#E6F8EC] text-[#16A34A] flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <span className="block text-xs text-gray-500 font-medium">
                        WhatsApp Quick Dispatch
                      </span>
                      <span className="block text-base sm:text-[17px] font-bold text-[#0F1715] tabular-nums tracking-tight">
                        +91 88601 98887
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#16A34A] group-hover:translate-x-0.5 transition-all shrink-0" />
                </a>

                {/* Engineering Team Email */}
                <a
                  href="mailto:engineer@kinetixpower.in"
                  className="group p-3.5 rounded-2xl bg-[#FAFBFB] hover:bg-[#FDF9EE] border border-gray-200/80 hover:border-[#E5A51C]/40 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="w-11 h-11 rounded-full bg-[#FDF4DD] text-[#D99B16] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <span className="block text-xs text-gray-500 font-medium">
                        Engineering Team
                      </span>
                      <span className="block text-sm sm:text-[15px] font-bold text-[#0F1715] break-all sm:break-normal">
                        engineer@kinetixpower.in
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#D99B16] group-hover:translate-x-0.5 transition-all shrink-0" />
                </a>

                {/* Operating Hours */}
                <div className="pt-2 flex items-center justify-center gap-2 text-xs text-gray-600 font-medium">
                  <Clock className="w-4 h-4 text-[#E5A51C] shrink-0" />
                  <span>
                    <strong className="text-[#1E2422]">Operating Hours:</strong> 8:00 AM – 10:00 PM (All 7 Days)
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Regional Engineering Headquarters */}
            <div className="bg-white rounded-2xl border border-gray-200/90 shadow-[0_12px_36px_rgba(7,59,50,0.06)] overflow-hidden">
              <div className="bg-gradient-to-r from-[#053129] via-[#073B32] to-[#0D4C40] px-6 py-4 flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-[#F2BA2E] shrink-0" />
                <h2 className="text-base font-bold text-white tracking-tight">
                  Regional Engineering Headquarters
                </h2>
              </div>

              <div className="p-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Architectural HQ Photo */}
                <div className="sm:col-span-5">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#E9EFEF] border border-gray-200/80 shadow-xs">
                    <img
                      src={hqBuildingImg}
                      alt="KINETIX Power Regional Engineering Headquarters"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Address & Nearby Locations Selector */}
                <div className="sm:col-span-7 space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#073B32] shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-[13px] font-semibold text-[#1E2422] leading-snug">
                      <p>{activeHub.addressLine1}</p>
                      <p>{activeHub.addressLine2}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-2.5">
                    <p className="text-xs font-bold text-[#1E2422] mb-1.5">
                      Nearby Locations:
                    </p>
                    <ul className="space-y-1">
                      {REGIONAL_HUBS.map((hub) => {
                        const isSelected = hub.id === activeHubId;
                        return (
                          <li key={hub.id}>
                            <button
                              type="button"
                              onClick={() => setActiveHubId(hub.id)}
                              className={`text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                                isSelected
                                  ? 'text-[#C89214] font-bold'
                                  : 'text-gray-600 hover:text-[#073B32] font-medium'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isSelected ? 'bg-[#E5A51C]' : 'bg-[#073B32]/50'
                                }`}
                              />
                              <span>{hub.city}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
