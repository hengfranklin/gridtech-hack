import { UserType, BuildingType, OwnershipStatus, UtilityProvider } from './program';

export interface UserProfile {
  id: string;
  user_type: UserType;
  display_name: string;
  zip_code: string;
  borough?: string;
  utility_provider: UtilityProvider;
  building_type: BuildingType;
  ownership_status: OwnershipStatus;
  income_range?: 'low' | 'moderate' | 'middle' | 'high';
  household_size?: number;
  has_ev: boolean;
  has_smart_meter: boolean;
  has_central_ac: boolean;
  heating_fuel: 'gas' | 'oil' | 'electric' | 'steam';
  monthly_energy_cost: number;
  building_sqft?: number;
  building_units?: number;
  year_built?: number;
  dac_eligible: boolean;
  onboarding_complete: boolean;
}
