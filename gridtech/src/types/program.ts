export type ProgramCategory =
  | 'demand_response'
  | 'ev_charging'
  | 'weatherization'
  | 'heat_pump'
  | 'solar'
  | 'storage'
  | 'tax_credit'
  | 'bill_assistance'
  | 'building_performance';

export type SavingsType = 'bill_credit' | 'rebate' | 'tax_credit' | 'rate_reduction' | 'free_service';

export type UtilityProvider =
  | 'con_edison'
  | 'national_grid'
  | 'pseg_li'
  | 'central_hudson'
  | 'nyseg'
  | 'rge'
  | 'orange_rockland'
  | 'nyserda'
  | 'federal'
  | 'nyc';

export interface EligibilityCriteria {
  utility_providers?: UtilityProvider[] | null;
  user_types?: UserType[];
  building_types?: BuildingType[];
  ownership?: OwnershipStatus[];
  income_max_ami_pct?: number;
  requires_smart_meter?: boolean;
  requires_ev?: boolean;
  requires_central_ac?: boolean;
  zip_codes?: string[] | null;
  dac_only?: boolean;
  min_building_sqft?: number;
  min_units?: number;
  heating_fuel?: string[];
}

export interface EnrollmentStep {
  title: string;
  description: string;
  action: 'form' | 'upload' | 'external_link' | 'checkbox';
  url?: string;
}

export interface Program {
  id: string;
  name: string;
  slug: string;
  provider: UtilityProvider;
  category: ProgramCategory;
  description: string;
  short_description: string;
  savings_estimate_annual: number;
  savings_type: SavingsType;
  enrollment_url?: string;
  enrollment_deadline?: string;
  is_active: boolean;
  eligibility_criteria: EligibilityCriteria;
  enrollment_steps: EnrollmentStep[];
  required_documents: string[];
}

export type UserType = 'resident' | 'building_owner' | 'business' | 'admin';
export type BuildingType = 'single_family' | 'multi_family' | 'coop_condo' | 'commercial' | 'industrial' | 'mixed_use';
export type OwnershipStatus = 'owner' | 'renter' | 'manager';

export interface EligibilityResult {
  program: Program;
  eligible: boolean;
  matchScore: number;
  savingsEstimate: number;
  reasons: string[];
  missingRequirements: string[];
}
