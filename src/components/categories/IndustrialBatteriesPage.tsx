import React from 'react';
import { ArrowRight, Building2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BatteryCategoryLayout, BatteryCategoryPageConfig } from './BatteryCategoryLayout';
import industrialBatteryHeroImg from '../../assets/images/category_banner_industrial_1794476151052.jpg';

const INDUSTRIAL_BATTERIES_CONFIG: BatteryCategoryPageConfig = {
  category: 'industrial',
  pageType: 'industrial-batteries',
  title: 'Industrial Batteries',
  eyebrow: 'Telecom, Data Center & Grid Infrastructure',
  headline: 'Mission-critical energy racks built for 99.99% uptime.',
  description:
    'High-voltage 48V rack-mount LiFePO4 modules and sealed 12V 100Ah VRLA industrial blocks engineered for telecom towers, enterprise data centers, hospital emergency systems, and substation switchgear.',
  heroImage: industrialBatteryHeroImg,
  heroImageAlt: 'Industrial rack-mount telecom and data center battery infrastructure',
  buyingTip:
    'For multi-rack telecom or data-center deployments, specify matched batch-code cells with SNMP/Modbus BMS telemetry and factory acceptance test (FAT) impedance certificates.',
  heroStats: [
    { value: '12V & 48V', label: 'Rack & block architectures' },
    { value: 'BIS / IEC', label: 'Certified with FAT reports' },
    { value: 'Up to 84M', label: 'Enterprise SLA coverage' },
  ],
  selectionGuideTitle: 'Enterprise & industrial procurement checklist',
  selectionGuideItems: [
    {
      title: 'Standard 19-inch rack vs floor-standing VRLA banks',
      detail:
        '48V LiFePO4 3U/4U rack modules cut floor loading by 60% and offer hot-swappable capacity expansion, while sealed 12V 100Ah VRLA blocks fit legacy telecom shelters and switchgear rooms.',
    },
    {
      title: 'Thermal management & flame-retardant UL94-V0 casings',
      detail:
        'All industrial packs utilize ABS flame-retardant enclosures and low internal impedance plates rated for continuous float service in high-ambient Indian utility rooms.',
    },
    {
      title: 'Bulk GST invoicing, FAT test sheets & pan-India freight',
      detail:
        'Dedicated engineering dispatch provides GST tax invoices, factory acceptance test logs, and scheduled heavy-cargo delivery directly to project sites.',
    },
  ],
  secondaryCta: {
    label: 'Request Enterprise Bulk Quote',
    targetPage: 'contact',
  },
  faqs: [
    {
      q: 'Do industrial shipments include Factory Acceptance Test (FAT) and BIS certificates?',
      a: 'Yes. Every industrial and enterprise order ships with matched serial logs, individual cell impedance FAT reports, BIS certification copies, and full GST compliance documentation.',
    },
    {
      q: 'Can your engineering team size a custom 48V rack or hospital UPS string?',
      a: 'Yes — reach out via our Contact & Engineering Dispatch page with your kVA load, target autonomy minutes, and cabinet dimensions for a tailored BOM quote within 4 business hours.',
    },
  ],
};

export const IndustrialBatteriesPage: React.FC = () => {
  const { navigate } = useStore();

  return (
    <BatteryCategoryLayout config={INDUSTRIAL_BATTERIES_CONFIG}>
      <div className="bg-white rounded-xl border border-gray-200/90 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#073B32]/8 text-[#073B32] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#073B32]">
              Need volume pricing or custom 48V telecom / data-center rack sizing?
            </h3>
            <p className="text-xs sm:text-sm text-[#5C6663] mt-0.5">
              Connect with our B2B engineering desk for GST proforma invoices, turnkey site fitment,
              and scheduled fleet replenishment.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('contact')}
          className="px-4 py-2.5 rounded-lg bg-[#073B32] hover:bg-[#0A5246] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
        >
          <span>Talk to Engineering Desk</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#E5A51C]" />
        </button>
      </div>
    </BatteryCategoryLayout>
  );
};
