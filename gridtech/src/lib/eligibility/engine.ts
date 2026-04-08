import { Program, EligibilityCriteria, EligibilityResult } from '@/types/program';
import { UserProfile } from '@/types/user';

function checkCriterion(
  profile: UserProfile,
  criteria: EligibilityCriteria,
  key: keyof EligibilityCriteria
): { met: boolean; reason: string; missing?: string } {
  const value = criteria[key];
  if (value === undefined || value === null) {
    return { met: true, reason: '' };
  }

  switch (key) {
    case 'utility_providers': {
      const providers = value as string[];
      const met = providers.includes(profile.utility_provider);
      return {
        met,
        reason: met ? `Utility provider matches (${profile.utility_provider})` : '',
        missing: met ? undefined : `Requires utility: ${providers.join(' or ')}`,
      };
    }
    case 'user_types': {
      const types = value as string[];
      const met = types.includes(profile.user_type);
      return {
        met,
        reason: met ? `User type matches (${profile.user_type})` : '',
        missing: met ? undefined : `For ${types.join(', ')} users only`,
      };
    }
    case 'building_types': {
      const types = value as string[];
      const met = types.includes(profile.building_type);
      return {
        met,
        reason: met ? `Building type matches (${profile.building_type})` : '',
        missing: met ? undefined : `Requires building type: ${types.join(' or ')}`,
      };
    }
    case 'ownership': {
      const statuses = value as string[];
      const met = statuses.includes(profile.ownership_status);
      return {
        met,
        reason: met ? `Ownership status matches (${profile.ownership_status})` : '',
        missing: met ? undefined : `Requires: ${statuses.join(' or ')}`,
      };
    }
    case 'income_max_ami_pct': {
      const maxPct = value as number;
      if (!profile.income_range) {
        return { met: true, reason: 'Income not provided — may be eligible' };
      }
      const incomeMap: Record<string, number> = { low: 40, moderate: 65, middle: 100, high: 150 };
      const userPct = incomeMap[profile.income_range] || 100;
      const met = userPct <= maxPct;
      return {
        met,
        reason: met ? 'Income qualifies' : '',
        missing: met ? undefined : `Income must be below ${maxPct}% AMI`,
      };
    }
    case 'requires_ev': {
      if (!(value as boolean)) return { met: true, reason: '' };
      return {
        met: profile.has_ev,
        reason: profile.has_ev ? 'Has electric vehicle' : '',
        missing: profile.has_ev ? undefined : 'Requires an electric vehicle',
      };
    }
    case 'requires_smart_meter': {
      if (!(value as boolean)) return { met: true, reason: '' };
      return {
        met: profile.has_smart_meter,
        reason: profile.has_smart_meter ? 'Has smart meter' : '',
        missing: profile.has_smart_meter ? undefined : 'Requires a smart meter',
      };
    }
    case 'requires_central_ac': {
      if (!(value as boolean)) return { met: true, reason: '' };
      return {
        met: profile.has_central_ac,
        reason: profile.has_central_ac ? 'Has central AC' : '',
        missing: profile.has_central_ac ? undefined : 'Requires central air conditioning',
      };
    }
    case 'dac_only': {
      if (!(value as boolean)) return { met: true, reason: '' };
      return {
        met: profile.dac_eligible,
        reason: profile.dac_eligible ? 'In a Disadvantaged Community' : '',
        missing: profile.dac_eligible ? undefined : 'Only available in Disadvantaged Communities',
      };
    }
    case 'min_building_sqft': {
      const min = value as number;
      if (!profile.building_sqft) return { met: true, reason: 'Building size not specified' };
      const met = profile.building_sqft >= min;
      return {
        met,
        reason: met ? `Building is ${profile.building_sqft.toLocaleString()} sq ft` : '',
        missing: met ? undefined : `Requires building ${min.toLocaleString()}+ sq ft`,
      };
    }
    case 'min_units': {
      const min = value as number;
      if (!profile.building_units) return { met: true, reason: 'Unit count not specified' };
      const met = profile.building_units >= min;
      return {
        met,
        reason: met ? `Building has ${profile.building_units} units` : '',
        missing: met ? undefined : `Requires ${min}+ units`,
      };
    }
    case 'zip_codes': {
      const zips = value as string[];
      const met = zips.includes(profile.zip_code);
      return {
        met,
        reason: met ? 'Zip code qualifies' : '',
        missing: met ? undefined : 'Not available in your zip code',
      };
    }
    case 'heating_fuel': {
      const fuels = value as string[];
      const met = fuels.includes(profile.heating_fuel);
      return {
        met,
        reason: met ? `Heating fuel matches (${profile.heating_fuel})` : '',
        missing: met ? undefined : `Requires heating fuel: ${fuels.join(' or ')}`,
      };
    }
    default:
      return { met: true, reason: '' };
  }
}

export function checkEligibility(profile: UserProfile, program: Program): EligibilityResult {
  const criteria = program.eligibility_criteria;
  const keys = Object.keys(criteria) as (keyof EligibilityCriteria)[];

  const reasons: string[] = [];
  const missingRequirements: string[] = [];
  let metCount = 0;

  for (const key of keys) {
    const result = checkCriterion(profile, criteria, key);
    if (result.met) {
      metCount++;
      if (result.reason) reasons.push(result.reason);
    } else {
      if (result.missing) missingRequirements.push(result.missing);
    }
  }

  const totalCriteria = keys.length || 1;
  const matchScore = Math.round((metCount / totalCriteria) * 100);
  const eligible = missingRequirements.length === 0;

  return {
    program,
    eligible,
    matchScore,
    savingsEstimate: eligible ? program.savings_estimate_annual : 0,
    reasons,
    missingRequirements,
  };
}

export function getEligiblePrograms(profile: UserProfile, programs: Program[]): EligibilityResult[] {
  return programs
    .map((program) => checkEligibility(profile, program))
    .sort((a, b) => {
      // Eligible first, then by savings estimate, then by match score
      if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
      if (b.savingsEstimate !== a.savingsEstimate) return b.savingsEstimate - a.savingsEstimate;
      return b.matchScore - a.matchScore;
    });
}

export function getNearEligiblePrograms(profile: UserProfile, programs: Program[]): EligibilityResult[] {
  return programs
    .map((program) => checkEligibility(profile, program))
    .filter((r) => !r.eligible && r.missingRequirements.length <= 2)
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function getTotalSavings(results: EligibilityResult[]): number {
  return results
    .filter((r) => r.eligible)
    .reduce((sum, r) => sum + r.savingsEstimate, 0);
}
