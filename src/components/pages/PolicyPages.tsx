import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, RotateCcw, Lock, FileText, Ban } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const PolicyPages: React.FC = () => {
  const { pageParams, navigate } = useStore();
  const initialType = pageParams?.type || 'warranty';
  const [activePolicy, setActivePolicy] = useState<string>(initialType);

  useEffect(() => {
    if (pageParams?.type) {
      setActivePolicy(pageParams.type);
    }
  }, [pageParams?.type]);

  const handlePolicySelect = (type: string) => {
    setActivePolicy(type);
    navigate('policy', { type }, { replace: true, skipScroll: true });
  };

  const POLICIES: Record<
    string,
    { title: string; subtitle: string; icon: React.ElementType; content: string[] }
  > = {
    warranty: {
      title: 'Direct Manufacturer Warranty Policy',
      subtitle: 'Doorstep replacement coverage and battery test protocol',
      icon: ShieldCheck,
      content: [
        'All KINETIX battery systems come with direct manufacturer warranty registered under your order invoice and mobile phone number upon delivery.',
        'Free Replacement Period: If a battery fails due to manufacturing defects or internal cell shorting during the initial free replacement window (36 to 60 months depending on model), KINETIX dispatches an engineer with an on-the-spot replacement unit.',
        'Pro-Rata Settlement: For remaining months after the full replacement window, warranty compensation is calculated as a pro-rata discount against the prevailing MRP of a new battery.',
        'Exclusions: Damage caused by external physical impacts, broken casing, operating with dry plates (neglected distilled water top-up), or incorrect charger voltage settings (above 15.0V continuously) is not covered.',
      ],
    },
    shipping: {
      title: 'Doorstep Shipping & Fitment Policy',
      subtitle: '4-hour delivery coverage and vehicle alternator health checks',
      icon: Truck,
      content: [
        'KINETIX provides guaranteed 4-hour express doorstep delivery in 45+ tier-1 and metro Indian cities (Mumbai, Bengaluru, Delhi NCR, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad, etc.).',
        'Certified Technicians: Every delivery is handled by our verified technician equipped with a digital battery conductance tester. Before removing your old battery, the technician verifies starter motor draw and charging alternator output.',
        'Heavy Freight Crating: Inverter and lithium batteries are transported in shock-absorbent, tamper-evident polymer crates to prevent terminal damage or acid spillage during transit.',
        'Free Shipping Threshold: All orders exceeding ₹2,500 qualify for free doorstep delivery and fitment.',
      ],
    },
    return: {
      title: 'Returns, Scrap Exchange & Refund Policy',
      subtitle: '7-day replacement window and certified lead scrap buyback',
      icon: RotateCcw,
      content: [
        '7-Day Unopened Return: If you ordered an incompatible battery model, you may request a free swap or full refund within 7 days of delivery, provided the terminal seals are intact.',
        'Old Scrap Battery Rebate: When choosing "Old Battery Exchange", our technician inspects your old battery and credits up to ₹1,500 for car batteries or up to ₹3,500 for heavy inverter batteries directly.',
        'Refund Processing: Approved refunds are credited back to the original source (UPI, Card, NetBanking) within 3 to 5 business days with automated SMS notification.',
      ],
    },
    privacy: {
      title: 'Privacy & Data Security Policy',
      subtitle: 'Commitment to customer data security and encrypted transactions',
      icon: Lock,
      content: [
        'We collect only information essential to process orders, dispatch local technicians, and maintain digital warranty logs (Name, Phone, Delivery Address, Vehicle Make).',
        'Zero Data Sale: We never sell or share customer data with third-party advertisers.',
        'Payment Encryption: All financial transactions are processed over 256-bit SSL encrypted channels verified by PCI-DSS certified payment gateways.',
      ],
    },
    terms: {
      title: 'Terms of Supply & Equipment Sales',
      subtitle: 'Regulatory compliance and supply conditions',
      icon: FileText,
      content: [
        'All products supplied comply with Bureau of Indian Standards (BIS IS 14257) and Central Pollution Control Board (CPCB) battery management rules.',
        'Title and Risk of loss transfer to the purchaser upon formal digital receipt and signature at the doorstep installation site.',
        'Commercial and industrial high-voltage lithium banks require certified commissioning by KINETIX authorized field engineers to validate the 10-year warranty.',
      ],
    },
    cancellation: {
      title: 'Order Cancellation Policy',
      subtitle: 'Pre-dispatch cancellation and refund procedures',
      icon: Ban,
      content: [
        'Orders can be cancelled free of charge at any time before the technician departs the local hub (typically within 60 minutes of order placement).',
        'If cancellation occurs while the technician is on-site, a nominal logistical inspection fee of ₹250 may apply.',
        'Full refund will be initiated instantly upon cancellation confirmation.',
      ],
    },
  };

  const current = POLICIES[activePolicy] || POLICIES['warranty'];
  const Icon = current.icon;

  return (
    <div className="bg-[#17191C] min-h-screen py-16 border-b border-[#25282D]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 pb-6 border-b border-[#25282D] mb-10 text-xs">
          {[
            { id: 'warranty', label: 'Warranty Policy' },
            { id: 'shipping', label: 'Shipping & Delivery' },
            { id: 'return', label: 'Returns & Scrap Buyback' },
            { id: 'privacy', label: 'Privacy Policy' },
            { id: 'terms', label: 'Terms & Conditions' },
            { id: 'cancellation', label: 'Cancellation Policy' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handlePolicySelect(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activePolicy === tab.id
                  ? 'bg-[#D6B98C] text-[#17191C] font-bold'
                  : 'bg-[#101214] text-[#B7BCC2] hover:text-[#F2F0EA] border border-[#25282D]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Policy Content Card */}
        <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-5 sm:p-10 space-y-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#25282D] border border-[#D6B98C]/30 flex items-center justify-center text-[#D6B98C] shrink-0">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-[#F2F0EA]">{current.title}</h1>
              <p className="text-xs text-[#8E959E] mt-0.5">{current.subtitle}</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#B7BCC2] leading-relaxed border-t border-[#25282D] pt-6">
            {current.content.map((para, i) => (
              <p key={i} className="leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          <div className="pt-6 border-t border-[#25282D] text-xs text-[#8E959E] flex flex-wrap items-center justify-between gap-2 font-mono">
            <span>Last Updated: February 2026</span>
            <span>Ref: KTX-LEGAL-REG-04</span>
          </div>
        </div>
      </div>
    </div>
  );
};
