/**
 * West Bengal Official Land Measurement Standards & Mathematical Engines
 *
 * Official Reference (Directorate of Land Records & Surveys, Govt. of West Bengal):
 * - 1 Bigha = 20 Katha = 14,400 Square Feet (approx 1,337.8 m²)
 * - 1 Katha (or Cottah) = 16 Chatak = 720 Square Feet (approx 66.89 m²)
 * - 1 Chatak = 20 Gandas = 45 Square Feet (approx 4.18 m²)
 * - 1 Acre = 100 Satak (Decimal) = 3 Bigha 8 Chatak = 43,560 Square Feet
 * - 1 Satak (or Decimal / শতক) = 435.6 Square Feet (approx 40.47 m²)
 * - 1 Katha ≈ 1.65289 Satak (Decimal)
 * - 1 Satak ≈ 0.605 Katha
 * - 1 Ganda = 4 Kora = 2.25 Square Feet
 * - 1 Kora = 0.5625 Square Feet
 * - 1 Square Meter = 10.7639104 Square Feet
 */

export interface LandUnit {
  id: string;
  name: string;
  bengaliName: string;
  sqftRatio: number; // 1 Unit = X Square Feet
  description: string;
}

export const WB_LAND_UNITS: LandUnit[] = [
  {
    id: 'sqft',
    name: 'Square Feet (sq ft)',
    bengaliName: 'বর্গফুট (Sq Ft)',
    sqftRatio: 1,
    description: 'Standard international unit (১ বর্গফুট)'
  },
  {
    id: 'katha',
    name: 'Katha / Cottah',
    bengaliName: 'কাঠা (Katha)',
    sqftRatio: 720,
    description: 'Standard West Bengal Katha = 720 Sq Ft (১ কাঠা = ৭২০ বর্গফুট)'
  },
  {
    id: 'satak',
    name: 'Satak / Decimal',
    bengaliName: 'শতক / ডেসিমেল (Satak)',
    sqftRatio: 435.6,
    description: '1/100 of an Acre = 435.6 Sq Ft (১ শতক = ৪৩৫.৬ বর্গফুট)'
  },
  {
    id: 'chatak',
    name: 'Chatak',
    bengaliName: 'ছটাক (Chatak)',
    sqftRatio: 45,
    description: '1/16 of a Katha = 45 Sq Ft (১ ছটাক = ৪৫ বর্গফুট)'
  },
  {
    id: 'bigha',
    name: 'Bigha',
    bengaliName: 'বিঘা (Bigha)',
    sqftRatio: 14400,
    description: '20 Katha = 14,400 Sq Ft (১ বিঘা = ২০ কাঠা = ১৪,৪০০ বর্গফুট)'
  },
  {
    id: 'acre',
    name: 'Acre',
    bengaliName: 'একর (Acre)',
    sqftRatio: 43560,
    description: '100 Satak = 43,560 Sq Ft (১ একর = ১০০ শতক)'
  },
  {
    id: 'sqmeter',
    name: 'Square Meter (sq m)',
    bengaliName: 'বর্গমিটার (Sq Meter)',
    sqftRatio: 10.7639104,
    description: '1 Sq Meter ≈ 10.7639 Sq Ft'
  },
  {
    id: 'ganda',
    name: 'Ganda',
    bengaliName: 'গণ্ডা (Ganda)',
    sqftRatio: 2.25,
    description: '1/20 of a Chatak = 2.25 Sq Ft (১ গণ্ডা = ৪ কড়া)'
  }
];

/**
 * Convert any value from one unit to all other units
 */
export function convertLandUnit(value: number, fromUnitId: string): Record<string, number> {
  const fromUnit = WB_LAND_UNITS.find(u => u.id === fromUnitId) || WB_LAND_UNITS[0];
  const sqft = value * fromUnit.sqftRatio;

  const result: Record<string, number> = {};
  for (const unit of WB_LAND_UNITS) {
    result[unit.id] = sqft / unit.sqftRatio;
  }
  return result;
}

/**
 * Breakdown total square feet into traditional West Bengal denomination:
 * Bigha - Katha - Chatak - Remaining Sq Ft
 */
export interface FractionalBreakdownResult {
  totalSqFt: number;
  bigha: number;
  katha: number;
  chatak: number;
  remainingSqFt: number;
  satakDecimal: number;
  formattedBengali: string;
  formattedEnglish: string;
}

export function getFractionalBreakdown(totalSqFt: number): FractionalBreakdownResult {
  if (totalSqFt <= 0 || isNaN(totalSqFt)) {
    return {
      totalSqFt: 0,
      bigha: 0,
      katha: 0,
      chatak: 0,
      remainingSqFt: 0,
      satakDecimal: 0,
      formattedBengali: '০ কাঠা ০ ছটাক',
      formattedEnglish: '0 Katha 0 Chatak'
    };
  }

  const bigha = Math.floor(totalSqFt / 14400);
  let remAfterBigha = totalSqFt % 14400;

  const katha = Math.floor(remAfterBigha / 720);
  let remAfterKatha = remAfterBigha % 720;

  const chatak = Math.floor(remAfterKatha / 45);
  const remainingSqFt = Math.round((remAfterKatha % 45) * 100) / 100;

  const satakDecimal = Math.round((totalSqFt / 435.6) * 1000) / 1000;

  // Bengali string
  const bParts: string[] = [];
  if (bigha > 0) bParts.push(`${bigha} বিঘা`);
  if (katha > 0 || bigha > 0) bParts.push(`${katha} কাঠা`);
  if (chatak > 0 || (bigha === 0 && katha === 0)) bParts.push(`${chatak} ছটাক`);
  if (remainingSqFt > 0) bParts.push(`${remainingSqFt} বর্গফুট`);

  // English string
  const eParts: string[] = [];
  if (bigha > 0) eParts.push(`${bigha} Bigha`);
  if (katha > 0 || bigha > 0) eParts.push(`${katha} Katha`);
  if (chatak > 0 || (bigha === 0 && katha === 0)) eParts.push(`${chatak} Chatak`);
  if (remainingSqFt > 0) eParts.push(`${remainingSqFt} Sq Ft`);

  return {
    totalSqFt,
    bigha,
    katha,
    chatak,
    remainingSqFt,
    satakDecimal,
    formattedBengali: bParts.join(' ') || '০ বর্গফুট',
    formattedEnglish: eParts.join(' ') || '0 Sq Ft'
  };
}

/**
 * Irregular 4-sided Plot Calculation using Heron's Formula (আমিন পদ্ধতি / বিষমবাহু জমি পরিমাপ)
 *
 * Given sides a (North), b (East), c (South), d (West), and diagonal e (কোনাকুনি কর্ণ).
 * Triangle 1 formed by (a, b, e)
 * Triangle 2 formed by (c, d, e)
 */
export interface IrregularPlotResult {
  isValid: boolean;
  errorMessage?: string;
  triangle1AreaSqFt: number;
  triangle2AreaSqFt: number;
  totalAreaSqFt: number;
  averageMethodAreaSqFt: number;
  differenceSqFt: number;
  errorPercentage: number;
  breakdown: FractionalBreakdownResult;
}

export function calculateHeronPlot(
  sideA: number,
  sideB: number,
  sideC: number,
  sideD: number,
  diagonalE: number
): IrregularPlotResult {
  // Triangle 1: a, b, e
  // Triangle inequality check
  if (
    sideA + sideB <= diagonalE ||
    sideA + diagonalE <= sideB ||
    sideB + diagonalE <= sideA
  ) {
    return {
      isValid: false,
      errorMessage: 'প্রথম ত্রিভুজটি অসম্ভব! বাহু ১, বাহু ২ এবং কর্ণের মাপ সঠিক নয় (Triangle Inequality Error).',
      triangle1AreaSqFt: 0,
      triangle2AreaSqFt: 0,
      totalAreaSqFt: 0,
      averageMethodAreaSqFt: 0,
      differenceSqFt: 0,
      errorPercentage: 0,
      breakdown: getFractionalBreakdown(0)
    };
  }

  // Triangle 2: c, d, e
  if (
    sideC + sideD <= diagonalE ||
    sideC + diagonalE <= sideD ||
    sideD + diagonalE <= sideC
  ) {
    return {
      isValid: false,
      errorMessage: 'দ্বিতীয় ত্রিভুজটি অসম্ভব! বাহু ৩, বাহু ৪ এবং কর্ণের মাপ সঠিক নয় (Triangle Inequality Error).',
      triangle1AreaSqFt: 0,
      triangle2AreaSqFt: 0,
      totalAreaSqFt: 0,
      averageMethodAreaSqFt: 0,
      differenceSqFt: 0,
      errorPercentage: 0,
      breakdown: getFractionalBreakdown(0)
    };
  }

  // Heron's Formula for Triangle 1
  const s1 = (sideA + sideB + diagonalE) / 2;
  const t1Area = Math.sqrt(Math.max(0, s1 * (s1 - sideA) * (s1 - sideB) * (s1 - diagonalE)));

  // Heron's Formula for Triangle 2
  const s2 = (sideC + sideD + diagonalE) / 2;
  const t2Area = Math.sqrt(Math.max(0, s2 * (s2 - sideC) * (s2 - sideD) * (s2 - diagonalE)));

  const totalAreaSqFt = Math.round((t1Area + t2Area) * 100) / 100;

  // Approximate Average Method (সাধারণ গড় পদ্ধতি: (A+C)/2 * (B+D)/2)
  const avgMethod = Math.round((((sideA + sideC) / 2) * ((sideB + sideD) / 2)) * 100) / 100;
  const diff = Math.round(Math.abs(avgMethod - totalAreaSqFt) * 100) / 100;
  const errorPct = totalAreaSqFt > 0 ? Math.round((diff / totalAreaSqFt) * 1000) / 10 : 0;

  return {
    isValid: true,
    triangle1AreaSqFt: Math.round(t1Area * 100) / 100,
    triangle2AreaSqFt: Math.round(t2Area * 100) / 100,
    totalAreaSqFt,
    averageMethodAreaSqFt: avgMethod,
    differenceSqFt: diff,
    errorPercentage: errorPct,
    breakdown: getFractionalBreakdown(totalAreaSqFt)
  };
}

/**
 * West Bengal Property Registration & Stamp Duty Estimator
 *
 * Applicable Standard Rates in West Bengal:
 * - Panchayat Area (Rural): 5% Stamp Duty + 1% Registration Fee = 6% Total
 * - Municipality / Corporation (Urban): 6% Stamp Duty + 1% Registration Fee = 7% Total
 * - If Market Value > ₹1 Crore: +1% additional Stamp Duty applies.
 * - Women Owner Concession: 1% rebate on Stamp Duty if sole/joint female buyer.
 */
export interface StampDutyResult {
  marketValue: number;
  stampDutyRate: number;
  stampDutyAmount: number;
  registrationFeeRate: number;
  registrationFeeAmount: number;
  mutationFeeEstimate: number;
  totalGovernmentCharges: number;
  femaleConcessionApplied: boolean;
  highValueSurchargeApplied: boolean;
}

export function calculateWBStampDuty(
  marketValue: number,
  areaType: 'panchayat' | 'municipality',
  isFemaleOwner: boolean
): StampDutyResult {
  if (marketValue <= 0 || isNaN(marketValue)) {
    return {
      marketValue: 0,
      stampDutyRate: 0,
      stampDutyAmount: 0,
      registrationFeeRate: 0,
      registrationFeeAmount: 0,
      mutationFeeEstimate: 0,
      totalGovernmentCharges: 0,
      femaleConcessionApplied: false,
      highValueSurchargeApplied: false
    };
  }

  // Base rate
  let baseStampRate = areaType === 'panchayat' ? 5 : 6;
  const highValueSurcharge = marketValue > 10000000; // > 1 Crore

  if (highValueSurcharge) {
    baseStampRate += 1;
  }

  let femaleDiscount = false;
  if (isFemaleOwner) {
    baseStampRate -= 1;
    femaleDiscount = true;
  }

  const registrationFeeRate = 1; // 1% across WB
  const stampDutyAmount = Math.round((marketValue * baseStampRate) / 100);
  const registrationFeeAmount = Math.round((marketValue * registrationFeeRate) / 100);

  // Approximate mutation and processing fee estimate
  const mutationFeeEstimate = marketValue < 1000000 ? 500 : marketValue < 5000000 ? 1500 : 3000;
  const totalGovernmentCharges = stampDutyAmount + registrationFeeAmount + mutationFeeEstimate;

  return {
    marketValue,
    stampDutyRate: baseStampRate,
    stampDutyAmount,
    registrationFeeRate,
    registrationFeeAmount,
    mutationFeeEstimate,
    totalGovernmentCharges,
    femaleConcessionApplied: femaleDiscount,
    highValueSurchargeApplied: highValueSurcharge
  };
}
