import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/types/user';
import { Enrollment } from '@/types/enrollment';
import { UserType, BuildingType, OwnershipStatus, UtilityProvider } from '@/types/program';

interface AppState {
  // User profile
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Onboarding
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;

  // Enrollments
  enrollments: Enrollment[];
  addEnrollment: (enrollment: Enrollment) => void;
  updateEnrollment: (id: string, updates: Partial<Enrollment>) => void;

  // Auth simulation
  isAuthenticated: boolean;
  login: (userType: UserType) => void;
  logout: () => void;
}

const createDefaultProfile = (userType: UserType): UserProfile => ({
  id: crypto.randomUUID(),
  user_type: userType,
  display_name: '',
  zip_code: '',
  utility_provider: 'con_edison' as UtilityProvider,
  building_type: 'single_family' as BuildingType,
  ownership_status: 'owner' as OwnershipStatus,
  has_ev: false,
  has_smart_meter: false,
  has_central_ac: false,
  heating_fuel: 'gas',
  monthly_energy_cost: 150,
  dac_eligible: false,
  onboarding_complete: false,
});

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      onboardingStep: 0,
      enrollments: [],
      isAuthenticated: false,

      setProfile: (profile) => set({ profile }),
      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),

      setOnboardingStep: (step) => set({ onboardingStep: step }),

      addEnrollment: (enrollment) =>
        set((state) => ({
          enrollments: [...state.enrollments, enrollment],
        })),
      updateEnrollment: (id, updates) =>
        set((state) => ({
          enrollments: state.enrollments.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),

      login: (userType) =>
        set({
          isAuthenticated: true,
          profile: createDefaultProfile(userType),
          onboardingStep: 0,
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          profile: null,
          enrollments: [],
          onboardingStep: 0,
        }),
    }),
    {
      name: 'gridtech-store',
    }
  )
);
