import { Product, Review } from '../types';

/**
 * Generates realistic, battery-model-specific verified baseline reviews
 * tailored to each product's category, capacity, voltage, and chemistry.
 * Live customer reviews stored in Firestore are merged on top of these.
 */
export function getBaselineReviewsForProduct(product: Product): Review[] {
  const capLabel = product.capacityAh > 0 ? `${product.capacityAh}Ah` : product.voltage;
  const specTag = `${product.voltage} · ${capLabel} · ${product.technology}`;
  const defaultVehicle =
    product.compatibleVehicles?.[0] ||
    product.compatibleAppliances?.[0] ||
    `${product.brand} Certified Installation`;
  const secondVehicle =
    product.compatibleVehicles?.[1] ||
    product.compatibleAppliances?.[1] ||
    `${product.category.toUpperCase()} Power Setup`;

  switch (product.category) {
    case 'car':
      return [
        {
          id: `base-${product.id}-1`,
          productId: product.id,
          author: 'Sameer Verma',
          rating: 5,
          date: 'October 18, 2026',
          createdAtMs: new Date('2026-10-18T09:30:00Z').getTime(),
          title: 'Instant cold-crank authority even on frosty mornings',
          comment: `Installed the ${product.name} before a high-altitude highway run. Cranking response was immediate at sub-zero dawn temperatures and resting open-circuit voltage stayed steady at 12.8V overnight.`,
          verifiedPurchase: true,
          vehicleOrApplication: defaultVehicle,
          configuredVariant: specTag,
          helpfulUserIds: [],
          baseHelpfulCount: 14,
          source: 'baseline',
        },
        {
          id: `base-${product.id}-2`,
          productId: product.id,
          author: 'Rohit Khandelwal',
          rating: 5,
          date: 'September 29, 2026',
          createdAtMs: new Date('2026-09-29T14:15:00Z').getTime(),
          title: 'Clean doorstep fitment and zero voltage sag under heavy accessories',
          comment: `Technician checked alternator ripple and starter draw during fitment. Even with dual dashcams and cabin HVAC running in bumper-to-bumper traffic, start-stop ignition recovers effortlessly.`,
          verifiedPurchase: true,
          vehicleOrApplication: secondVehicle,
          configuredVariant: specTag,
          helpfulUserIds: [],
          baseHelpfulCount: 9,
          source: 'baseline',
        },
        {
          id: `base-${product.id}-3`,
          productId: product.id,
          author: 'Meenakshi Nair',
          rating: 4,
          date: 'August 14, 2026',
          createdAtMs: new Date('2026-08-14T11:00:00Z').getTime(),
          title: 'Solid build quality, slightly heavier than OEM unit',
          comment: `Noticeably stronger starter turnover compared to my factory battery. It is a couple kilograms heavier due to denser plates, but tray fitment was exact and warranty registration took under two minutes.`,
          verifiedPurchase: true,
          vehicleOrApplication: product.compatibleVehicles?.[2] || defaultVehicle,
          configuredVariant: specTag,
          helpfulUserIds: [],
          baseHelpfulCount: 5,
          source: 'baseline',
        },
      ];

    case 'bike':
      return [
        {
          id: `base-${product.id}-1`,
          productId: product.id,
          author: 'Karanjeet Gill',
          rating: 5,
          date: 'October 22, 2026',
          createdAtMs: new Date('2026-10-22T08:40:00Z').getTime(),
          title: 'Crisp one-touch ignition after two weeks parked',
          comment: `Swapped my tired stock cell for the ${product.name}. Even after leaving the bike untouched for 14 days during monsoon, it fired up on the very first thumb crank without dimming the LED headlamp.`,
          verifiedPurchase: true,
          vehicleOrApplication: defaultVehicle,
          configuredVariant: specTag,
          helpfulUserIds: [],
          baseHelpfulCount: 11,
          source: 'baseline',
        },
        {
          id: `base-${product.id}-2`,
          productId: product.id,
          author: 'Siddharth Rao',
          rating: 5,
          date: 'September 11, 2026',
          createdAtMs: new Date('2026-09-11T16:20:00Z').getTime(),
          title: 'Handles rough touring trails with zero terminal loosening',
          comment: `Factory-sealed casing fits snugly into the battery bay. Zero vibration rattle over broken mountain roads and holds auxiliary fog lights steady on night rides.`,
          verifiedPurchase: true,
          vehicleOrApplication: secondVehicle,
          configuredVariant: specTag,
          helpfulUserIds: [],
          baseHelpfulCount: 6,
          source: 'baseline',
        },
      ];

    case 'inverter':
      return [
        {
          id: `base-${product.id}-1`,
          productId: product.id,
          author: 'Pradeep Deshpande',
          rating: 5,
          date: 'October 19, 2026',
          createdAtMs: new Date('2026-10-19T12:10:00Z').getTime(),
          title: 'Powers 4 fans, Wi-Fi, and work desk for over 7 hours effortlessly',
          comment: `Paired the ${product.name} with our 1500VA pure sine inverter. Deep-discharge recovery is noticeably quicker than our old flat-plate unit, and water-level float indicators make checks painless.`,
          verifiedPurchase: true,
          vehicleOrApplication: defaultVehicle,
          configuredVariant: specTag,
          helpfulUserIds: [],
          baseHelpfulCount: 16,
          source: 'baseline',
        },
        {
          id: `base-${product.id}-2`,
          productId: product.id,
          author: 'Anjali Kulkarni',
          rating: 5,
          date: 'September 24, 2026',
          createdAtMs: new Date('2026-09-24T17:45:00Z').getTime(),
          title: 'Zero acid fumes and reliable summer outage backup',
          comment: `We experience frequent 4-hour voltage cuts in peak summer. This tubular bank charges back quickly between cuts and stays cool in our utility balcony.`,
          verifiedPurchase: true,
          vehicleOrApplication: secondVehicle,
          configuredVariant: specTag,
          helpfulUserIds: [],
          baseHelpfulCount: 8,
          source: 'baseline',
        },
        {
          id: `base-${product.id}-3`,
          productId: product.id,
          author: 'Harshvardhan Joshi',
          rating: 4,
          date: 'August 30, 2026',
          createdAtMs: new Date('2026-08-30T10:05:00Z').getTime(),
          title: 'Dependable backup capacity; trolley recommended for movement',
          comment: `True ${capLabel} capacity verified with a clamp meter during a 5-hour outage. Make sure you order a ventilated battery trolley because the heavy-duty tubular plates give it serious weight.`,
          verifiedPurchase: true,
          vehicleOrApplication: '3BHK Home Inverter Setup',
          configuredVariant: specTag,
          helpfulUserIds: [],
          baseHelpfulCount: 4,
          source: 'baseline',
        },
      ];

    case 'lithium':
    case 'solar':
      return [
        {
          id: `base-${product.id}-1`,
          productId: product.id,
          author: 'Dr. Arvind Subramanian',
          rating: 5,
          date: 'October 25, 2026',
          createdAtMs: new Date('2026-10-25T13:20:00Z').getTime(),
          title: 'Flat discharge voltage curve and super-fast solar recharge',
          comment: `Integrated the ${product.name} into our hybrid rooftop MPPT setup. Usable depth-of-discharge and charge acceptance are leagues ahead of conventional lead-acid banks, hitting 100% SoC before noon.`,
          verifiedPurchase: true,
          vehicleOrApplication: defaultVehicle,
          configuredVariant: specTag,
          helpfulUserIds: [],
          baseHelpfulCount: 19,
          source: 'baseline',
        },
        {
          id: `base-${product.id}-2`,
          productId: product.id,
          author: 'Nikhil Bhasin',
          rating: 5,
          date: 'September 16, 2026',
          createdAtMs: new Date('2026-09-16T09:50:00Z').getTime(),
          title: 'Compact footprint, zero maintenance, clean BMS telemetry',
          comment: `Replaced four bulky tubular batteries with this clean ${product.voltage} installation. Zero topping-up, zero smell, and rock-steady thermal behavior even in a 42°C summer garage.`,
          verifiedPurchase: true,
          vehicleOrApplication: secondVehicle,
          configuredVariant: specTag,
          helpfulUserIds: [],
          baseHelpfulCount: 12,
          source: 'baseline',
        },
      ];

    case 'industrial':
    case 'ups':
      return [
        {
          id: `base-${product.id}-1`,
          productId: product.id,
          author: 'Suresh Menon (Facilities Lead)',
          rating: 5,
          date: 'October 14, 2026',
          createdAtMs: new Date('2026-10-14T15:00:00Z').getTime(),
          title: 'Zero-switchover stability for studio & server racks',
          comment: `Deployed the ${product.name} across our 3kVA online UPS string. Internal resistance matched tightly across cells right out of the crate, giving clean holdover until our DG syncs.`,
          verifiedPurchase: true,
          vehicleOrApplication: defaultVehicle,
          configuredVariant: specTag,
          helpfulUserIds: [],
          baseHelpfulCount: 10,
          source: 'baseline',
        },
        {
          id: `base-${product.id}-2`,
          productId: product.id,
          author: 'Deepak Chawla',
          rating: 4,
          date: 'September 07, 2026',
          createdAtMs: new Date('2026-09-07T11:30:00Z').getTime(),
          title: 'Consistent float-charge endurance with sealed VRLA safety',
          comment: `Running 24×7 inside an enclosed network cabinet with zero off-gassing. Load-bank test after 60 days showed negligible capacity drift.`,
          verifiedPurchase: true,
          vehicleOrApplication: secondVehicle,
          configuredVariant: specTag,
          helpfulUserIds: [],
          baseHelpfulCount: 5,
          source: 'baseline',
        },
      ];

    default:
      return [
        {
          id: `base-${product.id}-1`,
          productId: product.id,
          author: 'Vikramaditya Sen',
          rating: 5,
          date: 'October 20, 2026',
          createdAtMs: new Date('2026-10-20T10:15:00Z').getTime(),
          title: 'Industrial-grade construction that outlasts generic spares',
          comment: `Picked up the ${product.name} alongside our main battery upgrade. Solid brass/copper hardware, clean insulation, and clear LED status feedback from day one.`,
          verifiedPurchase: true,
          vehicleOrApplication: defaultVehicle,
          configuredVariant: specTag,
          helpfulUserIds: [],
          baseHelpfulCount: 8,
          source: 'baseline',
        },
        {
          id: `base-${product.id}-2`,
          productId: product.id,
          author: 'Rituja Patwardhan',
          rating: 5,
          date: 'September 09, 2026',
          createdAtMs: new Date('2026-09-09T18:00:00Z').getTime(),
          title: 'Essential companion for long-term battery health',
          comment: `Easy plug-and-play setup with thorough safety protections. Kept my weekend SUV battery topped up at optimal float voltage effortlessly.`,
          verifiedPurchase: true,
          vehicleOrApplication: secondVehicle,
          configuredVariant: specTag,
          helpfulUserIds: [],
          baseHelpfulCount: 4,
          source: 'baseline',
        },
      ];
  }
}
