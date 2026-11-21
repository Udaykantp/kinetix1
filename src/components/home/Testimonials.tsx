import React from 'react';
import { Star } from 'lucide-react';

// Facility & vertical photography via ES imports
import fleetTrucksImg from '../../assets/images/testimonial_fleet_trucks_1795242944949.jpg';
import dataCenterImg from '../../assets/images/category_banner_industrial_1794476151052.jpg';
import hospitalImg from '../../assets/images/testimonial_hospital_facility_1795242948439.jpg';

// Verified executive portrait avatars
import avatarRajesh from '../../assets/images/avatar_fleet_director_1795242944600.jpg';
import avatarSenuil from '../../assets/images/avatar_infra_manager_1795242949766.jpg';
import avatarAnjali from '../../assets/images/avatar_healthcare_lead_1795242948087.jpg';

interface FacilityReview {
  id: string;
  image: string;
  imageAlt: string;
  quote: string;
  avatar: string;
  name: string;
  role: string;
  company: string;
  vertical: string;
  rating: number;
}

const FACILITY_REVIEWS: FacilityReview[] = [
  {
    id: 'logistics',
    image: fleetTrucksImg,
    imageAlt: 'Commercial logistics fleet cruising highway at sunrise',
    quote:
      'KINETIX batteries have been a game-changer for our fleet. Exceptional cranking performance, long life, and unmatched reliability across highway runs.',
    avatar: avatarRajesh,
    name: 'Rajesh K. Nambiar',
    role: 'Fleet Operations Head',
    company: 'TransLogistics Pvt. Ltd.',
    vertical: 'AUTOMOTIVE · LOGISTICS',
    rating: 5,
  },
  {
    id: 'datacenters',
    image: dataCenterImg,
    imageAlt: '24/7 enterprise data center server and power storage corridor',
    quote:
      'Our data centers run 24/7, and KINETIX power solutions give us complete peace of mind. Reliable, efficient, and engineered to last.',
    avatar: avatarSenuil,
    name: 'Dr. Senuil Shemoni',
    role: 'IT Infrastructure Manager',
    company: 'NetSecure Tech',
    vertical: 'DATA CENTERS',
    rating: 5,
  },
  {
    id: 'healthcare',
    image: hospitalImg,
    imageAlt: 'Modern multi-specialty hospital medical facility campus',
    quote:
      'KINETIX batteries have proven to be highly reliable in our critical healthcare operations. Their zero-millisecond backup performance is simply outstanding.',
    avatar: avatarAnjali,
    name: 'Dr. Anjali Sharma',
    role: 'Facility Director',
    company: 'City Care Hospital',
    vertical: 'HEALTHCARE',
    rating: 5,
  },
];

// Clean sculpted opening quotation mark glyph matching reference aesthetic
const GoldQuoteMark: React.FC = () => (
  <svg
    width="26"
    height="20"
    viewBox="0 0 28 22"
    fill="none"
    aria-hidden="true"
    className="shrink-0 mt-1 text-[#D9AE6D]"
  >
    <path
      d="M11.6 0.8C6.1 2.7 1.8 7.4 1.8 14.1C1.8 18.6 4.7 21.4 8.4 21.4C11.7 21.4 14 19 14 15.8C14 12.8 11.9 10.6 9 10.6C8.3 10.6 7.5 10.8 7 11.1C7.6 7.6 10.1 4.9 13.4 3.5L11.6 0.8ZM25.4 0.8C19.9 2.7 15.6 7.4 15.6 14.1C15.6 18.6 18.5 21.4 22.2 21.4C25.5 21.4 27.8 19 27.8 15.8C27.8 12.8 25.7 10.6 22.8 10.6C22.1 10.6 21.3 10.8 20.8 11.1C21.4 7.6 23.9 4.9 27.2 3.5L25.4 0.8Z"
      fill="currentColor"
    />
  </svg>
);

export const Testimonials: React.FC = () => {
  return (
    <section
      aria-labelledby="trusted-facilities-heading"
      className="py-20 sm:py-24 bg-[#FAF9F6] border-b border-[#0B3027]/10"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-4 mb-2.5">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#C58A32]">
              Partnered In Performance To The Core
            </span>
            <span
              aria-hidden="true"
              className="hidden sm:block h-px w-40 bg-[#D9AE6D]/55"
            />
          </div>

          <h2
            id="trusted-facilities-heading"
            className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#101820] tracking-[-0.03em] leading-[1.1] text-balance"
          >
            Trusted by Critical Facilities &amp; Fleet Operators
          </h2>

          <p className="text-sm sm:text-base text-[#3D4A45] mt-2.5 leading-relaxed">
            Worldwide customers rely on KINETIX for reliable power solutions across
            logistics, healthcare, and industrial verticals.
          </p>
        </div>

        {/* 3-Column Photographic Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {FACILITY_REVIEWS.map((item) => (
            <article
              key={item.id}
              className="group bg-white rounded-[18px] overflow-hidden shadow-[0_14px_38px_rgba(16,24,32,0.07)] hover:shadow-[0_22px_50px_rgba(11,48,39,0.12)] border border-[#0B3027]/8 transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Top Facility Photography */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#101820]">
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Quote Body + Executive Attribution */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-5 sm:gap-6">
                <div className="flex items-start gap-3">
                  <GoldQuoteMark />
                  <p className="text-[14px] sm:text-[15px] text-[#1E293B] italic leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {/* Footer Attribution Row */}
                <div className="pt-4 border-t border-[#0B3027]/8 flex flex-col sm:flex-row lg:flex-col xl:flex-row sm:items-center lg:items-start xl:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover object-top ring-2 ring-[#FAF9F6] shadow-xs shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-[13px] sm:text-sm font-bold text-[#101820] truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-[#4A5652] truncate">
                        {item.role}
                      </div>
                      <div className="text-[11px] text-[#64748B] truncate">
                        {item.company}
                      </div>
                    </div>
                  </div>

                  {/* Subtle Vertical Hairline Divider */}
                  <span
                    aria-hidden="true"
                    className="hidden sm:block lg:hidden xl:block h-9 w-px bg-[#0B3027]/12 shrink-0"
                  />

                  {/* Vertical Label + 5 Gold Stars */}
                  <div className="text-left sm:text-right lg:text-left xl:text-right shrink-0">
                    <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#C58A32] whitespace-nowrap">
                      {item.vertical}
                    </div>
                    <div
                      className="flex items-center justify-start sm:justify-end lg:justify-start xl:justify-end gap-0.5 mt-1.5 text-[#D9AE6D]"
                      aria-label={`${item.rating} out of 5 stars`}
                    >
                      {Array.from({ length: item.rating }).map((_, sIdx) => (
                        <Star
                          key={sIdx}
                          className="w-3.5 h-3.5 fill-current text-[#D4A24C]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
