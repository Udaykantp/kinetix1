import basaltStudioImg from '../../../assets/images/pdp_scene_basalt_studio_1795162651492.jpg';
import alpineFrostImg from '../../../assets/images/pdp_scene_alpine_frost_1795162652752.jpg';
import warmSunriseImg from '../../../assets/images/pdp_scene_warm_sunrise_1795162657178.jpg';
import duskLakesideImg from '../../../assets/images/pdp_scene_dusk_lakeside_1795162750558.jpg';
import macroTerminalImg from '../../../assets/images/pdp_macro_craft_terminal_1795162651910.jpg';
import macroPowderCoatImg from '../../../assets/images/pdp_macro_powder_coat_1795162717098.jpg';
import { Product } from '../../../types';

export type PdpTheme = 'light' | 'dark';

export type FinishId = 'alpine-sage' | 'basalt-black' | 'glacier-silver';

export interface FinishOption {
  id: FinishId;
  name: string;
  swatch: string;
  filter: string;
  tagline: string;
}

export const FINISH_OPTIONS: FinishOption[] = [
  {
    id: 'alpine-sage',
    name: 'Alpine Sage',
    swatch: '#48634B',
    filter: 'saturate(1.05) hue-rotate(64deg) brightness(0.98) contrast(1.04)',
    tagline: 'Matte anodized mineral finish',
  },
  {
    id: 'basalt-black',
    name: 'Basalt Black',
    swatch: '#222624',
    filter: 'saturate(0.45) brightness(0.92) contrast(1.12)',
    tagline: 'Graphite-infused volcanic coat',
  },
  {
    id: 'glacier-silver',
    name: 'Glacier Silver',
    swatch: '#B4BDB8',
    filter: 'saturate(0.28) brightness(1.12) contrast(0.96)',
    tagline: 'Bead-blasted titanium alloy sheen',
  },
];

export interface CapacityOption {
  id: string;
  label: string;
  sublabel: string;
  price: number;
  originalPrice: number;
  scale: number;
  capacityAh: number;
}

export function buildCapacityOptions(product: Product): CapacityOption[] {
  if (product.capacityAh > 0) {
    const compactAh = Math.max(5, Math.round((product.capacityAh * 0.8) / 5) * 5);
    const proAh = Math.round((product.capacityAh * 1.25) / 5) * 5;
    return [
      {
        id: 'compact',
        label: `${compactAh} Ah`,
        sublabel: 'Compact Core',
        price: Math.round((product.price * 0.88) / 50) * 50,
        originalPrice: Math.round((product.originalPrice * 0.88) / 50) * 50,
        scale: 0.94,
        capacityAh: compactAh,
      },
      {
        id: 'standard',
        label: `${product.capacityAh} Ah`,
        sublabel: 'Factory Spec',
        price: product.price,
        originalPrice: product.originalPrice,
        scale: 1.0,
        capacityAh: product.capacityAh,
      },
      {
        id: 'endurance',
        label: `${proAh} Ah`,
        sublabel: 'Extended Reserve',
        price: Math.round((product.price * 1.18) / 50) * 50,
        originalPrice: Math.round((product.originalPrice * 1.18) / 50) * 50,
        scale: 1.06,
        capacityAh: proAh,
      },
    ];
  }

  return [
    {
      id: 'compact',
      label: 'Standard Kit',
      sublabel: 'Single Bay',
      price: product.price,
      originalPrice: product.originalPrice,
      scale: 0.94,
      capacityAh: 0,
    },
    {
      id: 'standard',
      label: 'Pro Kit',
      sublabel: 'Dual Terminal',
      price: Math.round((product.price * 1.15) / 50) * 50,
      originalPrice: Math.round((product.originalPrice * 1.15) / 50) * 50,
      scale: 1.0,
      capacityAh: 0,
    },
    {
      id: 'endurance',
      label: 'Fleet Kit',
      sublabel: 'Commercial Grade',
      price: Math.round((product.price * 1.32) / 50) * 50,
      originalPrice: Math.round((product.originalPrice * 1.32) / 50) * 50,
      scale: 1.06,
      capacityAh: 0,
    },
  ];
}

export const PDP_MEDIA = {
  basaltStudio: basaltStudioImg,
  alpineFrost: alpineFrostImg,
  warmSunrise: warmSunriseImg,
  duskLakeside: duskLakesideImg,
  macroTerminal: macroTerminalImg,
  macroPowderCoat: macroPowderCoatImg,
};

export interface ShowcaseStage {
  id: string;
  indexLabel: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
}

export function buildShowcaseStages(product: Product): ShowcaseStage[] {
  return [
    {
      id: 'basalt-studio',
      indexLabel: '01',
      eyebrow: 'Studio Basalt Slate',
      title: 'Precision cast. Zero compromise.',
      subtitle: `${product.technology} internal architecture sealed inside a vibration-damped ${product.dimensions} chassis.`,
      image: PDP_MEDIA.basaltStudio,
    },
    {
      id: 'alpine-frost',
      indexLabel: '02',
      eyebrow: 'Sub-Zero Riverbank',
      title: 'Instant cold-crank authority.',
      subtitle: product.coldCrankingAmps
        ? `Delivers ${product.coldCrankingAmps} CCA down to -35°C with ultra-low internal impedance and zero voltage sag.`
        : `Calibrated electrolyte stability across -35°C glacial starts with zero thermal hesitation.`,
      image: PDP_MEDIA.alpineFrost,
    },
    {
      id: 'granite-ridge',
      indexLabel: '03',
      eyebrow: 'Alpine Granite Ridge',
      title: 'Harvest peak solar & alternator yield.',
      subtitle: `${product.chargingTime || 'Rapid multi-stage recharge'} engineered for high-altitude off-grid arrays and regenerative powertrains.`,
      image: PDP_MEDIA.warmSunrise,
    },
    {
      id: 'dusk-lakeside',
      indexLabel: '04',
      eyebrow: 'Dusk Lakeside Outpost',
      title: 'Silent overnight endurance.',
      subtitle: `${product.cycleLife || 'Deep-cycle architectural longevity'} backed by ${product.warrantyMonths}-month direct factory protection.`,
      image: PDP_MEDIA.duskLakeside,
    },
  ];
}
