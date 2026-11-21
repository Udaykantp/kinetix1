import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { FAQS_DATA } from '../../data/faqs';
import { useStore } from '../../context/StoreContext';

export const FAQSection: React.FC = () => {
  const { navigate } = useStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-xs font-mono text-[#B59562] uppercase tracking-wider mb-2 font-semibold">
            Technical Knowledge Base
          </div>
          <h2 className="text-3xl font-bold text-gray-950 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Clear answers about doorstep battery fitting, scrap buyback rebates, and warranty registration.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-colors shadow-xs"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-semibold text-gray-950">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#B59562] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('faq')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B59562] hover:text-gray-950 transition-colors"
          >
            <span>View All Installation & Technical FAQs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
