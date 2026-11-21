import React from 'react';
import { ShieldCheck, Award, CheckCircle } from 'lucide-react';

export const TrustedBrands: React.FC = () => {
  const brands = [
    'KINETIX ADVANCED LAB',
    'AMARON HI-LIFE',
    'EXIDE TECHNOLOGIES',
    'LUMINOUS POWER',
    'SOLARIS CLEAN TECH',
    'POWERGRID INDUSTRIAL',
  ];

  return (
    <section className="py-12 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-500 font-medium">
            Authorized Direct Manufacturer Distribution & Testing
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {brands.map((brand, idx) => (
            <div
              key={idx}
              className="py-4 px-3 bg-gray-50 border border-gray-200 rounded-lg text-center shadow-xs"
            >
              <span className="text-xs font-bold tracking-wider text-gray-700 font-mono">
                {brand}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-gray-500 font-mono">
          <span className="flex items-center gap-1.5 text-gray-700">
            <ShieldCheck className="w-4 h-4 text-[#B59562]" />
            <span>BIS IS 14257:2018 Standard</span>
          </span>
          <span className="flex items-center gap-1.5 text-gray-700">
            <Award className="w-4 h-4 text-[#B59562]" />
            <span>ARAI Automotive Testing Passed</span>
          </span>
          <span className="flex items-center gap-1.5 text-gray-700">
            <CheckCircle className="w-4 h-4 text-[#B59562]" />
            <span>ISO 9001:2015 Precision Calibrated</span>
          </span>
          <span className="flex items-center gap-1.5 text-gray-700">
            <ShieldCheck className="w-4 h-4 text-[#B59562]" />
            <span>IEC 62619 Prismatic Safety</span>
          </span>
        </div>
      </div>
    </section>
  );
};
