export type EnrollmentStatus = 'interested' | 'in_progress' | 'submitted' | 'approved' | 'active' | 'rejected';

export interface Enrollment {
  id: string;
  user_id: string;
  program_id: string;
  status: EnrollmentStatus;
  current_step: number;
  total_steps: number;
  documents_submitted: string[];
  notes?: string;
  enrolled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SavingsRecord {
  id: string;
  user_id: string;
  enrollment_id: string;
  month: string;
  financial_savings: number;
  kwh_saved: number;
  therms_saved: number;
  co2_avoided_lbs: number;
}
