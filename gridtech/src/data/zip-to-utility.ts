import { UtilityProvider } from '@/types/program';

// Simplified NY zip code to utility provider mapping
// Covers major areas — real app would use complete NYPSC data

const ZIP_RANGES: { start: number; end: number; provider: UtilityProvider; borough?: string }[] = [
  // Con Edison — Manhattan
  { start: 10001, end: 10282, provider: 'con_edison', borough: 'Manhattan' },
  // Con Edison — Bronx
  { start: 10451, end: 10475, provider: 'con_edison', borough: 'Bronx' },
  // Con Edison — Brooklyn (most)
  { start: 11201, end: 11256, provider: 'con_edison', borough: 'Brooklyn' },
  // Con Edison — Queens (most)
  { start: 11101, end: 11109, provider: 'con_edison', borough: 'Queens' },
  { start: 11354, end: 11385, provider: 'con_edison', borough: 'Queens' },
  { start: 11411, end: 11436, provider: 'con_edison', borough: 'Queens' },
  // Con Edison — Staten Island (northern)
  { start: 10301, end: 10314, provider: 'con_edison', borough: 'Staten Island' },
  // Con Edison — Westchester
  { start: 10501, end: 10710, provider: 'con_edison' },
  { start: 10801, end: 10805, provider: 'con_edison' },

  // National Grid — parts of Brooklyn/Queens/Staten Island, upstate
  { start: 11691, end: 11697, provider: 'national_grid', borough: 'Queens' },
  // National Grid — Syracuse area
  { start: 13200, end: 13290, provider: 'national_grid' },
  // National Grid — Albany area
  { start: 12200, end: 12260, provider: 'national_grid' },
  // National Grid — Buffalo area
  { start: 14200, end: 14280, provider: 'national_grid' },

  // PSEG Long Island — Nassau County
  { start: 11001, end: 11099, provider: 'pseg_li' },
  { start: 11501, end: 11599, provider: 'pseg_li' },
  // PSEG Long Island — Suffolk County
  { start: 11701, end: 11980, provider: 'pseg_li' },

  // Central Hudson — Hudson Valley
  { start: 12401, end: 12495, provider: 'central_hudson' },
  { start: 12500, end: 12590, provider: 'central_hudson' },

  // NYSEG — Southern Tier, Finger Lakes
  { start: 13800, end: 13905, provider: 'nyseg' },
  { start: 14800, end: 14905, provider: 'nyseg' },

  // RG&E — Rochester area
  { start: 14600, end: 14694, provider: 'rge' },

  // Orange & Rockland — Rockland County
  { start: 10901, end: 10994, provider: 'orange_rockland' },
  { start: 10950, end: 10998, provider: 'orange_rockland' },
];

export function getUtilityFromZip(zip: string): { provider: UtilityProvider; borough?: string } | null {
  const zipNum = parseInt(zip, 10);
  if (isNaN(zipNum)) return null;

  for (const range of ZIP_RANGES) {
    if (zipNum >= range.start && zipNum <= range.end) {
      return { provider: range.provider, borough: range.borough };
    }
  }

  // Default to NYSERDA (statewide) if no specific utility found
  return { provider: 'nyserda' };
}

// Disadvantaged Communities — simplified list of zip codes
// Based on NYSERDA Climate Justice data
export const DAC_ZIP_CODES = new Set([
  // South Bronx
  '10451', '10452', '10453', '10454', '10455', '10456', '10457', '10458', '10459', '10460',
  // East Harlem / Central Harlem
  '10026', '10027', '10029', '10030', '10031', '10032', '10033', '10034', '10035', '10037', '10039', '10040',
  // Lower East Side / Chinatown
  '10002', '10003', '10009',
  // East Brooklyn
  '11207', '11208', '11212', '11233', '11236', '11239',
  // Central Brooklyn
  '11213', '11216', '11221', '11225', '11226', '11238',
  // Southeast Queens
  '11412', '11413', '11422', '11423', '11433', '11434', '11436',
  // North Shore Staten Island
  '10301', '10302', '10303', '10310',
  // Syracuse areas
  '13202', '13203', '13204', '13205',
  // Buffalo areas
  '14201', '14202', '14203', '14204', '14207', '14208', '14209', '14210', '14211', '14212', '14213', '14214', '14215',
  // Albany areas
  '12202', '12206', '12209', '12210',
  // Rochester areas
  '14604', '14605', '14606', '14607', '14608', '14609', '14611', '14613', '14614', '14615', '14619', '14621',
]);

export function isDACZip(zip: string): boolean {
  return DAC_ZIP_CODES.has(zip);
}
