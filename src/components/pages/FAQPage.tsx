import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall, Search } from 'lucide-react';
import { FAQS_DATA } from '../../data/faqs';
import { useStore } from '../../context/StoreContext';

export const FAQPage: React.FC = () => {
  const { navigate } = useStore();
  const [openId, setOpenId] = useState<string | null>(FAQS_DATA[0].id);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = FAQS_DATA.filter(
    (f) =>
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#17191C] min-h-screen py-16 border-b border-[#25282D]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-xs font-mono text-[#D6B98C] uppercase tracking-wider mb-2">
            Support Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F2F0EA] tracking-tight">
            Battery Installation & Warranty FAQs
          </h1>
          <p className="text-sm text-[#B7BCC2] mt-2 max-w-xl mx-auto">
            Everything you need to know about battery capacity selection, cold cranking performance, doorstep installation, and lead recycling.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="w-4 h-4 text-[#8E959E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search FAQs (e.g. warranty, installation, scrap, inverter, LiFePO4)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#101214] border border-[#25282D] focus:border-[#D6B98C] text-xs sm:text-sm text-[#F2F0EA] pl-10 pr-4 py-3 rounded-xl focus:outline-none"
          />
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-[#101214] border border-[#25282D] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4"
                >
                  <span className="text-sm font-semibold text-[#F2F0EA]">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D6B98C] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#B7BCC2] leading-relaxed border-t border-[#25282D] pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact help strip */}
        <div className="mt-12 p-6 bg-[#101214] border border-[#25282D] rounded-xl text-center text-xs space-y-3">
          <p className="text-[#8E959E]">Still have technical questions regarding inverter sizing or vehicle compatibility?</p>
          <button
            onClick={() => navigate('contact')}
            className="px-5 py-2.5 bg-[#D6B98C] text-[#17191C] font-semibold rounded-lg inline-flex items-center gap-2"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Contact Field Engineering Support</span>
          </button>
        </div>
      </div>
    </div>
  );
};
