import { BlogPost } from '../types';
import lithiumSolarImg from '../assets/images/product_lithium_solar_1794476150273.jpg';
import carBatteryImg from '../assets/images/product_car_battery_1794476149763.jpg';
import inverterBatteryImg from '../assets/images/product_inverter_battery_1794476149979.jpg';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'lithium-lifepo4-vs-lead-acid-guide',
    title: 'LiFePO4 vs Tall Tubular Lead-Acid: The Definitive 2026 Energy Storage Comparison',
    excerpt:
      'A deep technical breakdown comparing cycle life, round-trip efficiency, total cost of ownership, and thermal safety between lithium iron phosphate and conventional tubular batteries.',
    coverImage: lithiumSolarImg,
    category: 'Engineering & Chemistry',
    author: 'Dr. Arindam Sen, Battery Systems Architect',
    date: 'February 18, 2026',
    readTime: '6 min read',
    content: `
### The Paradigm Shift in Energy Storage

For over six decades, flooded lead-acid and tall-tubular batteries served as the undisputed workhorses of domestic inverter setups and industrial energy reserves across the subcontinent. However, with steep declines in cell manufacturing costs and stringent environmental mandates, Lithium Iron Phosphate (LiFePO4) has emerged as the definitive standard for resilient energy infrastructure.

#### 1. Depth of Discharge (DoD) & Usable Capacity
A standard 12V 200Ah Lead-Acid tubular battery delivers 2,400 Watt-hours of theoretical capacity. However, discharging a lead-acid battery beyond 50% Depth of Discharge drastically accelerates grid corrosion and positive plate degradation. Therefore, its true usable energy is limited to 1,200 Watt-hours.

In contrast, prismatic LiFePO4 cells easily withstand 90% to 95% DoD over 6,000 cycles without significant impedance rise. A 48V 100Ah LiFePO4 module provides 4,800 Watt-hours of sustained energy in a footprint less than half the size of two 200Ah tubular batteries.

#### 2. Thermal Stability & Safety
Unlike older lithium-cobalt oxide (NMC) chemistries susceptible to thermal runaway at 150°C, LiFePO4 features robust covalent P-O chemical bonds. The phospho-olivine structure remains structurally stable up to 270°C, eliminating explosive oxygen release during accidental overcharging or high ambient summer heat (up to 52°C in northern India).

#### 3. Total Cost of Ownership (TCO)
While the upfront acquisition cost of a 5kWh lithium battery is approximately 2.2x that of lead-acid, its operational lifespan extends beyond 12 years (versus replacing tubular batteries every 4 years). Furthermore, zero distilled water maintenance and 96% round-trip coulombic efficiency reduce recurring electrical charging losses by over 20%.
    `,
  },
  {
    id: 'blog-2',
    slug: 'car-battery-agm-vs-flooded-guide',
    title: 'Why Start-Stop Vehicles Demand Absorbent Glass Mat (AGM) Batteries',
    excerpt:
      'Understanding micro-hybrid electrical demands, alternator smart recuperation, and why fitting a standard flooded battery in an AGM-specified vehicle causes premature failure.',
    coverImage: carBatteryImg,
    category: 'Automotive Technology',
    author: 'Vikramaditya Sharma, Automotive Systems Lead',
    date: 'January 28, 2026',
    readTime: '5 min read',
    content: `
### Modern Vehicle Architecture: The Electrical Powerhouse

Modern vehicles—from the Hyundai Creta and Mahindra XUV700 to BMW 3 Series and Mercedes C-Class—are complex electronic ecosystems. Between advanced driver assistance systems (ADAS), electric power steering, ventilated seats, and idle start-stop systems, the 12-volt battery no longer acts merely as an ignition starter; it serves as a dynamic electrical buffer.

#### The Destructive Impact of Start-Stop on Flooded Cells
During an average city commute, an idle start-stop system may stop and restart the engine 30 to 50 times. Conventional flooded batteries rely on loose liquid electrolyte. Under rapid repeated cranking, the active lead oxide paste sheds from the grids, causing bottom sedimentation and dead short circuits in under 12 months.

#### How AGM Solves High Cyclic Demands
In an AGM (Absorbent Glass Mat) battery, ultra-thin borosilicate glass micro-fiber mats soak up all sulfuric acid electrolyte like a sponge under tight plate compression. This mechanical compression:
- Completely eliminates plate shedding during violent vibrational stress
- Provides 3x higher cyclic endurance (3,000+ start-stop cycles)
- Lowers internal impedance, enabling explosive Cold Cranking Amps (CCA > 750A)
- Accepts rapid regenerative braking charge bursts without boiling electrolyte

Always verify your car battery compartment before replacement. If your original factory battery was AGM, replacing it with conventional flooded lead-acid will cause warning lights on your instrument cluster and battery demise within months.
    `,
  },
  {
    id: 'blog-3',
    slug: 'inverter-battery-maintenance-checklist',
    title: 'The Ultimate Inverter Battery Maintenance Checklist for Peak Summer Performance',
    excerpt:
      'Five critical preventative maintenance steps to ensure your tubular battery delivers full backup without sulfation or voltage drop during severe heatwaves.',
    coverImage: inverterBatteryImg,
    category: 'Maintenance & Care',
    author: 'Sunil Rao, Chief Field Engineer',
    date: 'February 05, 2026',
    readTime: '4 min read',
    content: `
### Preparing Your Inverter Bank for Summer Blackouts

During high ambient temperatures exceeding 42°C, chemical reactions inside lead-acid batteries accelerate exponentially. Follow this field-tested checklist every 6 months:

1. **Verify Demineralized Water Float Indicators**: Inspect all 6 float indicators. Water must be topped up strictly with pure demineralized or distilled water (TDS < 10 ppm). Never use RO drinking water or tap water, which introduces metal ions that permanently short plate separators.
2. **Clean White Sulfate Crystals with Warm Baking Soda**: Sulfate buildup around copper terminals creates resistive heat and drops terminal voltage. Clean terminals with a mixture of warm water and baking soda, wipe dry, and apply petroleum jelly or terminal grease.
3. **Inspect Inverter Float Charge Voltage**: Using a digital multimeter, check the voltage across terminals during float charging. It should measure between 13.6V and 13.8V per 12V battery. Overcharging above 14.4V dries out electrolyte rapidly.
4. **Maintain Proper Ventilation Space**: Ensure at least 15 cm of open air clearance on all sides of the battery to dissipate hydrogen and heat during recharging.
5. **Periodic Equalization Charge**: If your inverter supports an equalization mode, run it every 6 months to break down hard lead sulfate stratification at the bottom of the plates.
    `,
  },
];
